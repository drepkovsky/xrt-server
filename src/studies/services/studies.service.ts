import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class StudiesService {
  private readonly _updatableFields = ['name', 'description'];
  private readonly _updatableRelations: Record<
    string,
    StudyUpdatable<any, any>
  >;

  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
    private readonly questionnairesService: QuestionnairesService,
  ) {
    this._updatableRelations = {
      tasks: this.tasksService,
      preStudyQuestionnaire: this.questionnairesService,
      postStudyQuestionnaire: this.questionnairesService,
    };
  }

  create(user: User) {
    const name = 'New Study #' + nanoid(4);

    return this.prisma.study.create({
      data: {
        name,
        description: '',
        createdBy: {
          connect: { id: user.id },
        },
      },
    });
  }

  async findAll(user: User) {
    return await this.prisma.study.findMany({
      where: {
        createdBy: {
          id: user.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        createdBy: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.study.findUnique({
      where: { id },
      include: {
        tasks: true,
        postStudyQuestionnaire: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
        preStudyQuestionnaire: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });
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
