import { UpdateStudyDto } from '#app/studies/dto/study.dto';
import { Study } from '#app/studies/entities/study.entity';
import { User } from '#app/users/entities/user.entity';
import { EntityManager, Loaded, Populate } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class StudyService {
  private updatableFields = ['name'];
  private findOnePopulate = [
    'createdBy',
    'tasks',
    'postStudyQuestionnaire',
  ] as const;
  private findManyPopulate = ['createdBy'] as const;

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

    if (!result) {
      throw new NotFoundException(`Study with id ${id} not found`);
    }

    return result;
  }
  async update(em: EntityManager, dto: UpdateStudyDto, user: User) {
    const study = await this.findOne(em, dto.id, user);
    const payload: Partial<Study> = {};
    for (const field of this.updatableFields) {
      if (dto[field]) {
        payload[field] = dto[field];
      }
    }
    return em.persist({
      ...study,
      ...payload,
    });
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
