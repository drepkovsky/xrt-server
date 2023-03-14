import { Respondent } from '#app/studies/entities/respondents.entity';
import { Study } from '#app/studies/entities/study.entity';
import { TaskResponse } from '#app/studies/entities/task-response.entity';
import { Task } from '#app/studies/entities/task.entity';
import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Session, SessionData } from 'express-session';
import { promisify } from 'util';

@Injectable()
export class PublicService {
  findStudy(em: EntityManager, token: string) {
    return em.findOne(Study, { token });
  }

  async startRun(
    em: EntityManager,
    token: string,
    session: Session & Partial<SessionData>,
  ) {
    if (session.runs && session.runs.has(token)) {
      throw new BadRequestException('You have already started this study');
    }

    const study = await em.findOne(
      Study,
      { token },
      {
        populate: ['tasks'],
      },
    );

    // TODO
    const respondent = em.create(Respondent, {
      study: {
        id: study.id,
      },
      startedAt: new Date(),
    });
    await em.persistAndFlush(respondent);

    session.runs = session.runs || new Map();
    session.runs.set(token, {
      respondentId: respondent.id,
      studyId: study.id,
      tasksDone: [],
    });

    await promisify(session.save).call(session);

    return true;
  }

  async getNextTask(
    em: EntityManager,
    token: string,
    session: Session & Partial<SessionData>,
  ) {
    const run = session.runs.get(token);
    if (!run) {
      throw new BadRequestException('You have not started this study');
    }

    const tasks = await em.find(
      Task,
      {
        study: {
          id: run.studyId,
        },
        id: {
          $nin: run.tasksDone,
        },
      },
      {
        orderBy: {
          order: 'asc',
        },
        limit: 1,
      },
    );

    if (tasks.length === 0) {
      return null;
    }

    // TODO: implement more complex task selection logic if needed
    const currentTask = tasks[0];
    run.currentTaskId = currentTask.id;

    const taskResponse = em.create(TaskResponse, {
      respondent: {
        id: run.respondentId,
      },
      task: {
        id: run.currentTaskId,
      },
    });

    em.persist(taskResponse);

    await promisify(session.save).call(session);

    return currentTask;
  }

  async finishTask(
    em: EntityManager,
    token: string,
    session: Session & Partial<SessionData>,
  ) {
    const run = session.runs.get(token);
    if (!run) {
      throw new BadRequestException('You have not started this study');
    }

    if (!run.currentTaskId) {
      throw new BadRequestException('You have not started any task');
    }

    // TODO: write task response, check if skipped
    const taskResponse = await em.findOne(TaskResponse, {
      respondent: {
        id: run.respondentId,
      },
      task: {
        id: run.currentTaskId,
      },
    });
    taskResponse.completedAt = new Date();
    em.persist(taskResponse);

    run.tasksDone.push(run.currentTaskId);
    run.currentTaskId = undefined;

    await promisify(session.save).call(session);

    return true;
  }

  async finishRun(
    em: EntityManager,
    token: string,
    session: Session & Partial<SessionData>,
  ) {
    const run = session.runs.get(token);

    if (!run) {
      throw new BadRequestException('You have not started this study');
    }

    if (run.currentTaskId) {
      throw new BadRequestException('You have not finished the current task');
    }

    await em.upsert(Respondent, {
      id: run.respondentId,
      finishedAt: new Date(),
    });

    run.tasksDone.push(run.currentTaskId);
    run.currentTaskId = undefined;

    await promisify(session.save).call(session);

    return true;
  }
}
