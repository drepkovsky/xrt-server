import { AnswerDto } from '#app/public/dto/answer.dto';
import {
  Recording,
  RecordingType,
} from '#app/recording/entities/recording.entity';
import { RecordingService } from '#app/recording/recording.service';
import { RecordingJobProcessPayload } from '#app/recording/recording.types';
import { Answer } from '#app/studies/entities/answer.entity';
import { Option } from '#app/studies/entities/option.entity';
import { Question } from '#app/studies/entities/question.entity';
import { Respondent } from '#app/studies/entities/respondents.entity';
import { Study } from '#app/studies/entities/study.entity';
import { TaskResponse } from '#app/studies/entities/task-response.entity';
import { Task } from '#app/studies/entities/task.entity';
import { EntityManager, wrap } from '@mikro-orm/core';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Session, SessionData } from 'express-session';
import { promisify } from 'util';

@Injectable()
export class PublicService {
  logger = new Logger(PublicService.name);

  constructor(private readonly recordingService: RecordingService) {}

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

    const recordings = this.recordingService.createForRespondent(
      em,
      wrap(respondent).toReference(),
    );

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

    const recMap = recordings.reduce((acc, recording) => {
      acc[recording.type] = recording;
      return acc;
    }, {} as Record<RecordingType, Recording>);

    return {
      microphone: recMap[RecordingType.MICROPHONE].token,
      audio: recMap[RecordingType.AUDIO].token,
      screen: recMap[RecordingType.SCREEN].token,
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

  async answerQuestion(
    em: EntityManager,
    study: Study,
    session: Session & Partial<SessionData>,
    dto: AnswerDto,
  ) {
    const run = session.runs?.[study.token];
    if (!run) {
      throw new BadRequestException('You have not started this study');
    }

    if (!run.currentTaskId) {
      throw new BadRequestException('You have not started any task');
    }

    const answer = new Answer();

    answer.respondent = em.getReference(Respondent, run.respondentId, {
      wrapped: true,
    });
    answer.question = em.getReference(Question, dto.questionId, {
      wrapped: true,
    });
    answer.text = dto.text;
    for (const id of dto.optionIds) {
      answer.options.add(em.getReference(Option, id));
    }

    await em.persistAndFlush(answer);

    return { success: true };
  }

  async processRecording(
    em: EntityManager,
    token: string,
    file: Express.Multer.File,
  ) {
    const recording = await em.findOne(Recording, { token });

    if (!recording) {
      throw new BadRequestException('Invalid token');
    }

    const jobData: RecordingJobProcessPayload = {
      type: recording.type,
      token: token,
      location: file.path,
    };

    // save to storage with timestamp_token, send location to recording processor to process zip file, create video from images
    await this.recordingService.addToQueue(jobData);

    return { success: true };
  }
}
