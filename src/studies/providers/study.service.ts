import type { UpdateStudyDto } from '#app/studies/dto/study.dto';
import { Study, StudyStatus } from '#app/studies/entities/study.entity';
import { StudyUpdaterService } from '#app/studies/providers/study-updater.service';
import { User } from '#app/users/entities/user.entity';
import type { EntityManager, Loaded, Populate } from '@mikro-orm/core';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class StudyService {
  private findOnePopulate = [
    'createdBy',
    'tasks',
    'postStudyQuestionnaire.questions.options',
    'preStudyQuestionnaire.questions.options',
  ] as const;
  private findManyPopulate = ['createdBy'] as const;

  constructor(private readonly studyUpdaterService: StudyUpdaterService) {}

  async create(em: EntityManager, user: User): Promise<Study> {
    const name = 'New Study #' + nanoid(4);
    const study = em.create(Study, {
      name,
      createdBy: em.getReference(User, user.id),
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
          tasks: {
            id: 'asc',
          },
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

    return result as Loaded<Study, R>;
  }
  async update(
    em: EntityManager,
    dto: UpdateStudyDto,
    user: User,
  ): Promise<
    Loaded<Study, 'tasks' | 'preStudyQuestionnaire.questions.options' | 'postStudyQuestionnaire.questions.options'>
  > {
    const study = await this.findOne(em, dto.id, user, [
      'tasks',
      'preStudyQuestionnaire.questions.options',
      'postStudyQuestionnaire.questions.options',
    ]);

    // TODO: fix this may be causing bulk update vulnerabilities
    if (study.status !== StudyStatus.DRAFT && dto.update.description === undefined)
      throw new BadRequestException('Cannot update a study that is not in draft mode');

    dto.update && this.studyUpdaterService.handleUpdate(study, dto.update);
    dto.remove && this.studyUpdaterService.handleRemove(em, study, dto.remove);
    dto.add && this.studyUpdaterService.handleAdd(em, study, dto.add);

    await em.persistAndFlush(study);

    return study;
  }

  async remove(em: EntityManager, id: string, user: User) {
    const study = await this.findOne(em, id, user, ['tasks', 'preStudyQuestionnaire', 'postStudyQuestionnaire']);
    study.softRemove();
    for (const task of study.tasks.$) {
      task.softRemove();
    }
    for (const questionnaire of [study.preStudyQuestionnaire?.$, study.postStudyQuestionnaire?.$]) {
      questionnaire.softRemove();
    }

    await em.persistAndFlush(study);
    return study;
  }

  async launch(em: EntityManager, id: string, user: User) {
    const study = await this.findOne(em, id, user);
    study.status = StudyStatus.ACTIVE;
    await em.persistAndFlush(study);
    return study;
  }
}
