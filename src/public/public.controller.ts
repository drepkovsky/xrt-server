import { PublicService } from '#app/public/public.service';
import { MikroORM } from '@mikro-orm/core';
import { Controller, Get, Param, Req } from '@nestjs/common';
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
}
