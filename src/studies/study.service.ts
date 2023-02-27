import { CRUDService } from '#app/global/crud-service';
import { UpdateStudyDto } from '#app/studies/dto/study.dto';
import { Study } from '#app/studies/entities/study.entity';
import { User } from '#app/users/entities/user.entity';
import {
  Connection,
  EntityData,
  EntityManager,
  FindOptions,
  IDatabaseDriver,
  ObjectQuery,
  RequiredEntityData,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StudyService extends CRUDService<Study, {}, UpdateStudyDto, {}> {
  protected updatableFields = this._buildFields(['name']);
  protected findOneRelations = ['tasks'];
  protected findManyRelations = this._buildFields(['createdBy']);
  protected updateRelations = this.findOneRelations;
  protected removeRelations = this.findOneRelations;

  constructor() {
    super(Study);
  }

  protected async resolveCreatePayload(
    _: {},
    user: User,
  ): Promise<RequiredEntityData<Study>> {
    return {
      createdBy: {
        id: user.id,
      },
    };
  }

  protected resolveFindManyQuery(findDto: {}): ObjectQuery<Study> {
    return {};
  }
  protected resolveUserQuery(user: User): ObjectQuery<Study> {
    return {};
  }
  protected resolveFindOptions(findDto: {}): FindOptions<Study, never> {
    return {
      orderBy: {
        createdAt: 'DESC',
      },
    };
  }
  protected resolveUpdatePayload(
    data: UpdateStudyDto,
    user: User,
  ): Promise<EntityData<Study>> {
    return Promise.resolve(data);
  }

  protected handleRelationRemoval<E>(
    em: EntityManager<IDatabaseDriver<Connection>>,
    entity: E,
    shouldSoftRemove: boolean,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // create(em: EntityManager, user: User) {
  //   const name = 'New Study #' + nanoid(4);

  //   const study = em.create(Study, {
  //     name,
  //     createdBy: {
  //       id: user.id,
  //     },
  //   });

  //   em.persist(study);

  //   return study;
  // }

  // async findAll(em: EntityManager, user: User) {
  //   return await em.find(
  //     Study,
  //     {
  //       createdBy: {
  //         id: user.id,
  //       },
  //     },
  //     {
  //       orderBy: {
  //         createdAt: 'desc',
  //       },
  //       populate: ['createdBy'],
  //     },
  //   );
  // }

  // findOne(em: EntityManager, id: string) {
  //   return em.findOne(
  //     Study,
  //     { id },
  //     {
  //       populate: [
  //         'createdBy',
  //         'tasks',
  //         'preStudyQuestionnaire',
  //         'postStudyQuestionnaire',
  //       ],
  //     },
  //   );
  // }

  // async update(em: EntityManager, id: string, data: UpdateStudyDto) {
  //   const study = await this.findOne(em, id);

  //   const payload: Partial<Study> = {};
  //   for (const field of this._updatableFields) {
  //     if (data[field]) {
  //       payload[field] = data[field];
  //     }
  //   }

  //   return em.persist({
  //     ...study,
  //     ...payload,
  //   });
  // }

  // async remove(em: EntityManager, id: string) {
  //   const study = await this.findOne(em, id);
  //   study.softRemove();

  //   for (const task of study.tasks.$.getItems()) {
  //     task.softRemove();
  //   }

  //   for (const questionnaire of [
  //     study.preStudyQuestionnaire.$,
  //     study.postStudyQuestionnaire.$,
  //   ]) {
  //     questionnaire.softRemove();
  //   }

  //   return em.persist(study);
  // }
}
