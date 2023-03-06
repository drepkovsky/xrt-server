import { UpdateStudyDto } from '#app/studies/dto/study.dto';
import { Study } from '#app/studies/entities/study.entity';
import { StudyUpdaterService } from '#app/studies/services/study-updater.service';
import { User } from '#app/users/entities/user.entity';
import { EntityManager, Loaded, Populate } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class StudyService {
  private findOnePopulate = [
    'createdBy',
    'tasks',
    'postStudyQuestionnaire',
  ] as const;
  private findManyPopulate = ['createdBy'] as const;

  constructor(private readonly studyUpdaterService: StudyUpdaterService) {}

  async create(em: EntityManager, user: User): Promise<Study> {
    const name = 'New Study #' + nanoid(4);
    const study = em.create(Study, {
      name,
      createdBy: {
        id: user.id,
      },
    });
    await em.persistAndFlush(study);
    return study;
  }

  findAll<R extends string = (typeof this.findManyPopulate)[number]>(
    em: EntityManager,
    user: User,
    populate: Populate<Study, R> = this.findManyPopulate as any,
  ): Promise<Loaded<Study, R>[]> {
    return em.find(
      Study,
      {
        createdBy: {
          id: user.id,
        },
      },
      {
        orderBy: {
          createdAt: 'desc',
        },
        populate: populate,
      },
    );
  }
  async findOne<R extends string = (typeof this.findOnePopulate)[number]>(
    em: EntityManager,
    id: string,
    user: User,
    populate: Populate<Study, R> = this.findOnePopulate as any,
  ): Promise<Loaded<Study, R>> {
    const result = await em.findOne(
      Study,
      {
        id,
        createdBy: {
          id: user.id,
        },
      },
      {
        populate,
      },
    );

    if (!result) throw new NotFoundException(`Study with id ${id} not found`);

    return result;
  }
  async update(
    em: EntityManager,
    dto: UpdateStudyDto,
    user: User,
  ): Promise<
    Loaded<
      Study,
      | 'tasks'
      | 'preStudyQuestionnaire.questions.options'
      | 'postStudyQuestionnaire.questions.options'
    >
  > {
    const study = await this.findOne(em, dto.id, user, [
      'tasks',
      'preStudyQuestionnaire.questions.options',
      'postStudyQuestionnaire.questions.options',
    ]);

    if (dto.update) {
      this.studyUpdaterService.handleUpdate(em, study, dto.update);
    }

    if (dto.remove) {
      this.studyUpdaterService.handleRemove(em, study, dto.remove);
    }

    if (dto.add) {
      this.studyUpdaterService.handleAdd(em, study, dto.add);
    }

    return em.persistAndFlush(study).then(() => study);
  }

  async remove(em: EntityManager, id: string, user: User) {
    const study = await this.findOne(em, id, user, [
      'tasks',
      'preStudyQuestionnaire',
      'postStudyQuestionnaire',
    ]);
    study.softRemove();
    for (const task of study.tasks.$) {
      task.softRemove();
    }
    for (const questionnaire of [
      study.preStudyQuestionnaire.$,
      study.postStudyQuestionnaire.$,
    ]) {
      questionnaire.softRemove();
    }

    await em.persistAndFlush(study);
    return study;
  }
}
