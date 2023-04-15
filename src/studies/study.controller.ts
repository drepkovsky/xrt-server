import { UserParam } from '#app/auth/decorators/user-param.decorator';
import { JwtAuthGuard } from '#app/auth/guards/jwt-auth.guard';
import { UpdateStudyDto } from '#app/studies/dto/study.dto';
import { StudyService } from '#app/studies/providers/study.service';
import { User } from '#app/users/entities/user.entity';
import { MikroORM } from '@mikro-orm/core';
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Body, Delete, Param, Patch } from '@nestjs/common/decorators/index.js';

@UseGuards(JwtAuthGuard)
@Controller('studies')
export class StudyController {
  constructor(
    private readonly orm: MikroORM,
    private readonly studyService: StudyService,
  ) {}

  @Post('')
  async create(@UserParam() user: User) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.create(em, user);
    });
  }

  @Get('')
  async findAll(@UserParam() user: User) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.findAll(em, user);
    });
  }

  @Get(':id')
  async findOne(@UserParam() user: User, @Param('id') id: string) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.findOne(em, id, user);
    });
  }

  @Patch('')
  async update(@UserParam() user: User, @Body() dto: UpdateStudyDto) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.update(em, dto, user);
    });
  }

  @Delete(':id')
  async remove(@UserParam() user: User, @Param('id') id: string) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.remove(em, id, user);
    });
  }
}
