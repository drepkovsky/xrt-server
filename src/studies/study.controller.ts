import { UserParam } from '#app/auth/decorators/user-param.decorator';
import { JwtAuthGuard } from '#app/auth/guards/jwt-auth.guard';
import { StudyService } from '#app/studies/study.service';
import { User } from '#app/users/entities/user.entity';
import { MikroORM } from '@mikro-orm/postgresql';
import { Controller, UseGuards } from '@nestjs/common';

@Controller('studies')
@UseGuards(JwtAuthGuard)
export class StudyController {
  constructor(
    private readonly studyService: StudyService,
    private readonly orm: MikroORM,
  ) {}

  // creates empty study as draft
  create(@UserParam() user: User) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.create(em, user);
    });
  }

  // returns all studies
  findAll(@UserParam() user: User) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.findAll(em, user);
    });
  }
}
