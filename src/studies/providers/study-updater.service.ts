import { isNullish } from '#app/global/utils/misc.utils';
import type { UpdateQuestionDto } from '#app/studies/dto/question.dto';
import type { UpdateQuestionnaireDto } from '#app/studies/dto/questionnaire.dto';
import type { StudyAddPayloadDto, StudyRemovePayloadDto, StudyUpdatePayloadDto } from '#app/studies/dto/study.dto';
import { StudyAddResource, StudyRemoveResource } from '#app/studies/dto/study.dto';
import type { UpdateTaskDto } from '#app/studies/dto/task.dto';
import { Option } from '#app/studies/entities/option.entity';
import { Question, QuestionType } from '#app/studies/entities/question.entity';
import { Questionnaire } from '#app/studies/entities/questionnaire.entity';
import type { Study } from '#app/studies/entities/study.entity';
import { Task } from '#app/studies/entities/task.entity';
import type { EntityManager, Loaded } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';

type UpdatableStudy = Loaded<
  Study,
  'tasks' | 'preStudyQuestionnaire.questions.options' | 'postStudyQuestionnaire.questions.options'
>;

@Injectable()
export class StudyUpdaterService {
  logger: Logger = new Logger(StudyUpdaterService.name);

  studyUpdatableFields: (keyof Study)[] = ['name', 'description'];
  questionUpdatableFields: (keyof Question)[] = ['text', 'type'];

  // UPDATE
  handleUpdate(study: UpdatableStudy, dto: StudyUpdatePayloadDto) {
    this.updateQuestionnaires(study, dto);
    this.updateTasks(study, dto);
    this.updateStudy(study, dto);
  }

  private updateStudy(study: UpdatableStudy, dto: StudyUpdatePayloadDto) {
    for (const field of this.studyUpdatableFields) {
      if (!isNullish(dto[field])) {
        study[field as any] = dto[field];
      }
    }
  }

  private updateTasks(study: UpdatableStudy, dto: StudyUpdatePayloadDto) {
    const taskMap = new Map<string, UpdateTaskDto>();
    for (const taskDto of dto.tasks || []) {
      taskMap.set(taskDto.id, taskDto);
    }

    for (const task of study.tasks) {
      const taskDto = taskMap.get(task.id);
      if (taskDto) {
        task.assign(taskDto);
      }
    }
  }

  private updateQuestionnaires(study: UpdatableStudy, dto: StudyUpdatePayloadDto) {
    for (const qst of ['preStudyQuestionnaire', 'postStudyQuestionnaire'] as const) {
      if (dto[qst]) {
        const questionnaire = study[qst].$;
        this.updateQuestions(questionnaire, dto[qst]);
      }
    }
  }

  private updateQuestions(questionnaire: Loaded<Questionnaire, 'questions.options'>, dto: UpdateQuestionnaireDto) {
    const questionMap = new Map<string, UpdateQuestionDto>();
    for (const questionDto of dto.questions) {
      questionMap.set(questionDto.id, questionDto);
    }

    for (const question of questionnaire.questions) {
      const questionDto = questionMap.get(question.id);
      if (questionDto) {
        this.updateOptions(question, questionDto);

        for (const field of this.questionUpdatableFields) {
          if (!isNullish(questionDto[field])) {
            question[field as any] = questionDto[field] as any;
          }
        }
      }
    }
  }

  updateOptions(question: Loaded<Question, 'options'>, dto: UpdateQuestionDto) {
    const optionMap = new Map<string, Partial<Option>>();

    for (const optionDto of dto.options || []) {
      optionMap.set(optionDto.id, optionDto);
    }

    for (const option of question.options) {
      const optionDto = optionMap.get(option.id);
      if (optionDto) {
        option.assign(optionDto);
      }
    }
  }

  // REMOVAL
  handleRemove(em: EntityManager, study: UpdatableStudy, dto: StudyRemovePayloadDto) {
    if (dto.resource === StudyRemoveResource.TASK) return this.removeTask(em, study, dto);

    if (dto.resource === StudyRemoveResource.QUESTIONNAIRE) return this.removeQuestionnaire(em, study, dto);

    if (dto.resource === StudyRemoveResource.QUESTION) return this.removeQuestion(em, study, dto);

    if (dto.resource === StudyRemoveResource.OPTION) return this.removeOption(em, study, dto);
  }

  private removeTask(em: EntityManager, study: UpdatableStudy, dto: StudyRemovePayloadDto) {
    const task = study.tasks.getItems().find(t => t.id === dto.id);
    const order = task.order;
    study.tasks.getItems().forEach(t => {
      if (t.order > order) {
        t.order--;
      }
    });

    study.tasks.remove(task);
    em.remove(task);
  }

  private removeQuestionnaire(em: EntityManager, study: UpdatableStudy, dto: StudyRemovePayloadDto) {
    if (dto.id === study.preStudyQuestionnaire.id) {
      study.preStudyQuestionnaire = null;
      em.remove(study.preStudyQuestionnaire);
    }

    if (dto.id === study.postStudyQuestionnaire.id) {
      study.postStudyQuestionnaire = null;
      em.remove(study.postStudyQuestionnaire);
    }
    em.remove(em.getReference(Questionnaire, dto.id));
  }

  private removeQuestion(em: EntityManager, study: UpdatableStudy, dto: StudyRemovePayloadDto) {
    const questionnaires = this.getAllQuestionnaires(study);
    for (const questionnaire of questionnaires) {
      questionnaire.questions.remove(em.getReference(Question, dto.id));
    }
    em.remove(em.getReference(Question, dto.id));
  }

  private removeOption(em: EntityManager, study: UpdatableStudy, dto: StudyRemovePayloadDto) {
    const questionnaires = this.getAllQuestionnaires(study);
    for (const questionnaire of questionnaires) {
      for (const question of questionnaire.questions) {
        question.options.remove(em.getReference(Option, dto.id));
      }
    }
    em.remove(em.getReference(Option, dto.id));
  }

  handleAdd(em: EntityManager, study: UpdatableStudy, dto: StudyAddPayloadDto) {
    if (dto.resource === StudyAddResource.TASK) return this.addTask(em, study);

    if (dto.resource === StudyAddResource.POST_STUDY_QUESTIONNAIRE)
      return this.addQuestionnaire(em, study, 'postStudyQuestionnaire');

    if (dto.resource === StudyAddResource.PRE_STUDY_QUESTIONNAIRE)
      return this.addQuestionnaire(em, study, 'preStudyQuestionnaire');

    if (dto.resource === StudyAddResource.QUESTION) return this.addQuestion(em, study, dto);

    if (dto.resource === StudyAddResource.OPTION) return this.addOption(em, study, dto);
  }

  private addTask(em: EntityManager, study: UpdatableStudy) {
    const highestOrder = Math.max(...study.tasks.$.getItems().map(t => t.order), 0);

    const order = highestOrder + 1;
    const task = em.create(Task, {
      order,
      name: `Task ${order}`,
    });
    study.tasks.add(task);
  }

  private addQuestionnaire(
    em: EntityManager,
    study: UpdatableStudy,
    field: 'preStudyQuestionnaire' | 'postStudyQuestionnaire',
  ) {
    const questionnaire = em.create(Questionnaire, {});
    study[field] = wrap(questionnaire).toReference() as any;
  }

  private addQuestion(em: EntityManager, study: UpdatableStudy, dto: StudyAddPayloadDto) {
    const question = em.create(Question, {
      text: '',
      type: QuestionType.TEXT,
    });
    em.persist(question);

    if (dto.questionnaireId === study.preStudyQuestionnaire.id) {
      study.preStudyQuestionnaire.$.questions.add(question);
      return;
    }

    study.postStudyQuestionnaire.$.questions.add(question);
  }

  private addOption(em: EntityManager, study: UpdatableStudy, dto: StudyAddPayloadDto) {
    const option = em.create(Option, dto);

    const questionnaires = this.getAllQuestionnaires(study);

    for (const questionnaire of questionnaires) {
      for (const question of questionnaire.questions) {
        if (question.id !== dto.questionId) continue;
        question.options.add(option);
      }
    }
  }

  private getAllQuestionnaires(study: UpdatableStudy) {
    return [study.preStudyQuestionnaire?.$, study.postStudyQuestionnaire?.$].filter(q => !!q);
  }
}
