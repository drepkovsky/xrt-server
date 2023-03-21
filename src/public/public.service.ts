import { Respondent } from '#app/studies/entities/respondents.entity';
import { Study } from '#app/studies/entities/study.entity';
import { TaskResponse } from '#app/studies/entities/task-response.entity';
import { Task } from '#app/studies/entities/task.entity';
import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Session, SessionData } from 'express-session';
import { promisify } from 'util';

@Injectable()
export class PublicService {
  logger = new Logger(PublicService.name);

  async startRun(
    em: EntityManager,
    study: Study,
    session: Session & Partial<SessionData>,
  ) {
    if (session.runs && session.runs[study.token]) {
      // study is already running we don't want to start it again
      return {
        success: true,
        message: 'Study is already running, you can continue',
      };
    }

    // TODO
    const respondent = em.create(Respondent, {
      study: em.getReference(Study, study.id),
    });
    await em.persistAndFlush(respondent);

    session.runs = session.runs || {};
    session.runs[study.token] = {
      respondentId: respondent.id,
      studyId: study.id,
      tasksDone: [],
    };

    this.logger.debug(
      `Started study ${study.token} for respondent ${respondent.id}`,
    );

    await promisify(session.save).call(session);

    return {
      success: true,
      message: 'Study started',
    };
  }

  async getNextTask(
    em: EntityManager,
    study: Study,
    session: Session & Partial<SessionData>,
  ) {
    this.logger.debug(`Getting next task for study ${study.token}`);

    const run = session.runs?.[study.token];
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

    await em.upsert(TaskResponse, {
      respondent: em.getReference(Respondent, run.respondentId),
      task: em.getReference(Task, run.currentTaskId),
    });

    await promisify(session.save).call(session);

    this.logger.debug(
      `Started task ${currentTask.id} for respondent ${run.respondentId}`,
    );

    return currentTask;
  }

  async finishTask(
    em: EntityManager,
    study: Study,
    session: Session & Partial<SessionData>,
  ) {
    const run = session.runs?.[study.token];
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

    this.logger.debug(
      `Finished task ${taskResponse.task.id} for respondent ${taskResponse.respondent.id}`,
    );

    return { success: true };
  }

  async finishRun(
    em: EntityManager,
    study: Study,
    session: Session & Partial<SessionData>,
  ) {
    const run = session.runs?.[study.token];

    if (!run) {
      throw new BadRequestException('You have not started this study');
    }

    if (run.currentTaskId) {
      throw new BadRequestException('You have not finished the current task');
    }

    const respondent = await em.findOne(Respondent, {
      id: run.respondentId,
    });

    respondent.finishedAt ??= new Date();
    em.persist(respondent);

    run.tasksDone.push(run.currentTaskId);
    run.currentTaskId = undefined;

    this.logger.debug(
      `Finished study ${study.token} for respondent ${respondent.id}`,
    );
    // clear session if development
    if (process.env.NODE_ENV !== 'production') {
      session.runs = undefined;
    }
    await promisify(session.save).call(session);

    return { success: true };
  }
}
