import { CRUDService } from '#app/global/crud-service';
import { UpdateStudyDto } from '#app/studies/dto/study.dto';
import { Study } from '#app/studies/entities/study.entity';
import { User } from '#app/users/entities/user.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class StudyService extends CRUDService<Study, {}, UpdateStudyDto, {}> {
  private readonly _updatableFields = ['name', 'description'];

  constructor() {
    super(Study, true);
  }

  create(em: EntityManager, user: User) {
    const name = 'New Study #' + nanoid(4);

    const study = em.create(Study, {
      name,
      createdBy: {
        id: user.id,
      },
    });

    em.persist(study);

    return study;
  }

  async findAll(em: EntityManager, user: User) {
    return await em.find(
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
        populate: ['createdBy'],
      },
    );
  }

  findOne(em: EntityManager, id: string) {
    return em.findOne(
      Study,
      { id },
      {
        populate: [
          'createdBy',
          'tasks',
          'preStudyQuestionnaire',
          'postStudyQuestionnaire',
        ],
      },
    );
  }

  async update(em: EntityManager, id: string, data: UpdateStudyDto) {
    const study = await this.findOne(em, id);

    const payload: Partial<Study> = {};
    for (const field of this._updatableFields) {
      if (data[field]) {
        payload[field] = data[field];
      }
    }

    return em.persist({
      ...study,
      ...payload,
    });
  }

  async remove(em: EntityManager, id: string) {
    const study = await this.findOne(em, id);
    study.softRemove();

    for (const task of study.tasks.$.getItems()) {
      task.softRemove();
    }

    for (const questionnaire of [
      study.preStudyQuestionnaire.$,
      study.postStudyQuestionnaire.$,
    ]) {
      questionnaire.softRemove();
    }

    return em.persist(study);
  }
}
