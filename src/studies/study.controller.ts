import { JwtAuthGuard } from '#app/auth/guards/jwt-auth.guard';
import { StudyService } from '#app/studies/study.service';
import { MikroORM } from '@mikro-orm/core';
import { Controller, UseGuards } from '@nestjs/common';

@Controller('studies')
@UseGuards(JwtAuthGuard)
export class StudyController {
  constructor(
    private readonly orm: MikroORM,
    private readonly studyService: StudyService,
  ) {}
}
