import { PublicStudy } from '#app/public/decorators/public-study.decorator';
import { UsePublicStudy } from '#app/public/decorators/use-public-study.decorator';
import { AnswerDto } from '#app/public/dto/answer.dto';
import { RecordingFileInterceptor } from '#app/public/interceptors/recording-file.interceptor';
import { PublicService } from '#app/public/public.service';
import { Task } from '#app/studies/entities/task.entity';
import { MikroORM } from '@mikro-orm/core';
import { Controller, Get, Req } from '@nestjs/common';
import {
  Body,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common/decorators/index.js';
import { Request } from 'express';
import { Study } from '../studies/entities/study.entity.js';

@UsePublicStudy()
@Controller('public')
export class PublicController {
  constructor(
    private readonly orm: MikroORM,
    private readonly publicService: PublicService,
  ) {}

  @Get('')
  getStudy(@PublicStudy() study: Study) {
    return study;
  }

  @Post('run/start')
  createRun(@Req() req: Request, @PublicStudy() study: Study) {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.startRun(em, study, req.session);
    });
  }

  @Get('task')
  getNextTask(
    @Req() req: Request,
    @PublicStudy() study: Study,
  ): Promise<Task | null> {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.getNextTask(em, study, req.session);
    });
  }

  @Post('task/finish')
  finishTask(@Req() req: Request, @PublicStudy() study: Study) {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.finishTask(em, study, req.session);
    });
  }

  @Post('run/finish')
  finishRun(@Req() req: Request, @PublicStudy() study: Study) {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.finishRun(em, study, req.session);
    });
  }

  @Post('answer')
  answerQuestion(
    @Req() req: Request,
    @Body() dto: AnswerDto,
    @PublicStudy() study: Study,
  ) {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.answerQuestion(em, study, req.session, dto);
    });
  }

  @Post('recording/:recording')
  @UseInterceptors(RecordingFileInterceptor)
  uploadFile(
    @Param('recording') token: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.processRecording(em, token, file);
    });
  }
}
