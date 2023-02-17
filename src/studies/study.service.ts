import { StudyUpdatable } from '#app/studies/abstract/study-updatable.abstract';
import { Study } from '#app/studies/entities/study.entity';
import { QuestionnaireService } from '#app/studies/modules/questionnaire/questionnaire.service';
import { TaskService } from '#app/studies/modules/task/task.service';
import { User } from '#app/users/entities/user.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class StudyService {
  private readonly _updatableFields = ['name', 'description'];
  private readonly _updatableRelations: Record<
    string,
    StudyUpdatable<any, any>
  >;

  constructor(
    private readonly taskService: TaskService,
    private readonly questionnaireService: QuestionnaireService,
  ) {
    this._updatableRelations = {
      task: this.taskService,
      preStudyQuestionnaire: this.questionnaireService,
      postStudyQuestionnaire: this.questionnaireService,
    };
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

  findOne(em: EntityManager, id: number) {
    return em.findOne(
      Study,
      {
        id,
      },
      {
        populate: ['createdBy', 'tasks'],
      },
    );
  }

  async update(id: number, data: UpdateStudyDto) {
    this.prisma.$transaction(async (trx) => {
      const study = await this.findOne(id);

      const payload: Prisma.StudyUpdateInput = {};
      for (const field of this._updatableFields) {
        if (data[field]) {
          payload[field] = data[field];
        }
      }

      for (const field of Object.keys(this._updatableRelations)) {
        if (data[field]) {
          if (!this._updatableRelations[field]) {
            throw new Error(`Relation ${field} is not updatable`);
          }

          const value = data[field];

          if (Array.isArray(value)) {
            await this._updatableRelations[field].updateMany(trx, data[field]);
          } else {
            await this._updatableRelations[field].update(
              trx,
              study.id,
              data[field],
            );
          }
        }
      }

      return this.prisma.study.update({
        where: { id },
        data: payload,
      });
    });
  }

  remove(id: number) {
    return this.prisma.study.delete({
      where: { id },
    });
  }
}
