import { UpdateQuestionDto } from '#app/studies/dto/question.dto';
import { UpdateQuestionnaireDto } from '#app/studies/dto/questionnaire.dto';
import {
  StudyAddPayloadDto,
  StudyAddResource,
  StudyRemovePayloadDto,
  StudyRemoveResource,
  StudyUpdatePayloadDto,
} from '#app/studies/dto/study.dto';
import { UpdateTaskDto } from '#app/studies/dto/task.dto';
import { Option } from '#app/studies/entities/option.entity';
import { Question } from '#app/studies/entities/question.entity';
import { Questionnaire } from '#app/studies/entities/questionnaire.entity';
import { Study } from '#app/studies/entities/study.entity';
import { Task } from '#app/studies/entities/task.entity';
import { EntityManager, Loaded } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

type UpdatableStudy = Loaded<
  Study,
  | 'tasks'
  | 'preStudyQuestionnaire.questions.options'
  | 'postStudyQuestionnaire.questions.options'
>;

@Injectable()
export class StudyUpdaterService {
  handleUpdate(
    em: EntityManager,
    study: UpdatableStudy,
    dto: StudyUpdatePayloadDto,
  ) {
    for (const qst of [
      'preStudyQuestionnaire',
      'postStudyQuestionnaire',
    ] as const) {
      if (dto[qst]) {
        this.updateQuestionnaire(study[qst].$, dto[qst]);
      }
    }

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

    for (const field of ['name', 'description']) {
      if (dto[field]) {
        study[field] = dto[field];
      }
    }
  }

  handleRemove(
    em: EntityManager,
    study: UpdatableStudy,
    dto: StudyRemovePayloadDto,
  ) {
    if (dto.resource === StudyRemoveResource.TASK) {
      study.tasks.remove(em.getReference(Task, dto.id));
    } else if (dto.resource === StudyRemoveResource.QUESTIONNAIRE) {
      if (dto.id === study.preStudyQuestionnaire.id) {
        study.preStudyQuestionnaire = null;
        em.remove(study.preStudyQuestionnaire);
      }

      if (dto.id === study.postStudyQuestionnaire.id) {
        study.postStudyQuestionnaire = null;
        em.remove(study.postStudyQuestionnaire);
      }
    } else if (dto.resource === StudyRemoveResource.QUESTION) {
      const questionnaires = [
        study.preStudyQuestionnaire.$,
        study.postStudyQuestionnaire.$,
      ];
      for (const questionnaire of questionnaires) {
        questionnaire.questions.remove(em.getReference(Question, dto.id));
      }
    }
  }

  handleAdd(em: EntityManager, study: UpdatableStudy, dto: StudyAddPayloadDto) {
    if (dto.resource === StudyAddResource.TASK) {
      const task = em.create(Task, {});
      study.tasks.add(task);
    } else if (
      [
        StudyAddResource.POST_STUDY_QUESTIONNAIRE,
        StudyAddResource.PRE_STUDY_QUESTIONNAIRE,
      ].includes(dto.resource)
    ) {
      const questionnaire = em.create(Questionnaire, {});
      if (dto.resource === StudyAddResource.PRE_STUDY_QUESTIONNAIRE) {
        study.preStudyQuestionnaire.set(questionnaire);
      }

      if (dto.resource === StudyAddResource.POST_STUDY_QUESTIONNAIRE) {
        study.postStudyQuestionnaire.set(questionnaire);
      }
    } else if (dto.resource === StudyAddResource.QUESTION) {
      const question = em.create(Question, dto);
      if (dto.questionnaireId === study.preStudyQuestionnaire.id) {
        study.preStudyQuestionnaire.$.questions.add(question);
      } else if (dto.questionnaireId === study.postStudyQuestionnaire.id) {
        study.postStudyQuestionnaire.$.questions.add(question);
      }
    } else if (dto.resource === StudyAddResource.OPTION) {
      const option = em.create(Option, dto);
      const questionnaires = [
        study.preStudyQuestionnaire.$,
        study.postStudyQuestionnaire.$,
      ];
      for (const questionnaire of questionnaires) {
        for (const question of questionnaire.questions) {
          if (question.id === dto.questionId) {
            question.options.add(option);
          }
        }
      }
    }
  }

  private updateQuestionnaire(
    questionnaire: Loaded<Questionnaire, 'questions.options'>,
    dto: UpdateQuestionnaireDto,
  ) {
    const questionMap = new Map<string, UpdateQuestionDto>();
    for (const questionDto of dto.questions) {
      questionMap.set(questionDto.id, questionDto);
    }

    for (const question of questionnaire.questions) {
      const questionDto = questionMap.get(question.id);
      if (questionDto) {
        this.updateQuestion(question, questionDto);
      }
    }
  }

  private updateQuestion(
    question: Loaded<Question, 'options'>,
    dto: UpdateQuestionDto,
  ) {
    const optionMap = new Map<string, Partial<Option>>();

    for (const optionDto of dto.options) {
      optionMap.set(optionDto.id, optionDto);
    }

    for (const option of question.options) {
      const optionDto = optionMap.get(option.id);
      if (optionDto) {
        option.assign(optionDto);
      }

      for (const field of ['text', 'type']) {
        if (dto[field]) {
          question[field] = dto[field];
        }
      }
    }
  }
}
