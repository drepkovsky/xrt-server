import { PublicService } from '#app/public/public.service';
import { RunData } from '#app/public/public.types';
import { MikroORM } from '@mikro-orm/core';
import { Controller, Get, Req } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators/index.js';
import { Request } from 'express';

@Controller('public')
export class PublicController {
  constructor(
    private readonly orm: MikroORM,
    private readonly publicService: PublicService,
  ) {}

  @Get('study/:token')
  getStudy(@Req() req: Request) {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.findStudy(em, req.params.token);
    });
  }

  @Post('study/:token/run')
  createRun(@Req() req: Request) {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.startRun(em, req.params.token, req.session);
    });
  }

  @Get('study/:token/task')
  getNextTask(@Req() req: Request) {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.getNextTask(em, req.params.token, req.session);
    });
  }

  @Post('study/:token/task/')
  finishTask(@Req() req: Request) {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.finishTask(em, req.params.token, req.session);
    });
  }

  @Post('study/:token/finish')
  finishRun(@Req() req: Request) {
    return this.orm.em.transactional(async (em) => {
      return this.publicService.finishRun(em, req.params.token, req.session);
    });
  }
}
