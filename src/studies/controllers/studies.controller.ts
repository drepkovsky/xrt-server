import { UserParam } from '#app/auth/decorators/user-param.decorator';
import { JwtAuthGuard } from '#app/auth/guards/jwt-auth.guard';
import { StudiesService } from '#app/studies/services/studies.service';
import { User } from '#app/users/entities/user.entity';
import { Controller, UseGuards } from '@nestjs/common';

@Controller('studies')
@UseGuards(JwtAuthGuard)
export class StudiesController {
  constructor(private readonly studyService: StudiesService) {}

  // creates empty study as draft
  create(@UserParam() user: User) {
    return this.studyService.create(user);
  }

  // returns all studies
  findAll(@UserParam() user: User) {
    return this.studyService.findAll(user);
  }
}
