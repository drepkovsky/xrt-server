import { PublicStudy } from '#app/public/decorators/public-study.decorator';
import { UsePublicStudy } from '#app/public/decorators/use-public-study.decorator';
import { PublicService } from '#app/public/public.service';
import { Task } from '#app/studies/entities/task.entity';
import { MikroORM } from '@mikro-orm/core';
import { Controller, Get, Req } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators/index.js';
import { Request } from 'express';
import { Study } from '../studies/entities/study.entity.js';

@Controller('public')
@UsePublicStudy()
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
    console.log('createRun', req.session, study);
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
  finishTask(
    @Req() req: Request,
    @PublicStudy() study: Study,
  ): Promise<boolean> {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.finishTask(em, study, req.session);
    });
  }

  @Post('run/finish')
  finishRun(
    @Req() req: Request,
    @PublicStudy() study: Study,
  ): Promise<boolean> {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.finishRun(em, study, req.session);
    });
  }
}
