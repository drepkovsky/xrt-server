import { Controller, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserParam } from 'src/auth/decorators/user-param.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StudiesService } from 'src/studies/services/studies.service';

@Controller('studies')
@UseGuards(JwtAuthGuard)
export class StudiesController {
  constructor(private readonly studyService: StudiesService) {}

  // creates empty study
  create(@UserParam() user: User) {
    return this.studyService.create(user);
  }

  // returns all studies
  findAll(@UserParam() user: User) {
    return this.studyService.findAll(user);
  }
}
