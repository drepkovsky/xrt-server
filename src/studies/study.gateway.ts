import { UserParam } from '#app/auth/decorators/user-param.decorator';
import { JwtAuthIoGuard } from '#app/auth/guards/jwt-auth.ioguard';
import { IoGateway } from '#app/global/decorators/io-gateway.decorator';
import { UseIoGuard } from '#app/global/decorators/use-io-guard.decorator';
import { IoBaseGateway } from '#app/global/gateway/io-base.gateway';
import { UpdateStudyDto } from '#app/studies/dto/study.dto';
import { ResultsService } from '#app/studies/providers/results.service';
import { StudyService } from '#app/studies/providers/study.service';
import { User } from '#app/users/entities/user.entity';
import { MessageBody, SubscribeMessage } from '@nestjs/websockets';

@UseIoGuard(JwtAuthIoGuard)
@IoGateway({
  namespace: 'studies',
  transports: ['websocket'],
})
export class StudyGateway extends IoBaseGateway {
  constructor(
    private readonly studyService: StudyService,
    private readonly resultsService: ResultsService,
  ) {
    super();
  }

  @SubscribeMessage('create')
  async create(@UserParam() user: User) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.create(em, user);
    });
  }

  @SubscribeMessage('findAll')
  async findAll(@UserParam() user: User) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.findAll(em, user);
    });
  }

  @SubscribeMessage('findOne')
  async findOne(@UserParam() user: User, @MessageBody('id') id: string) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.findOne(em, id, user);
    });
  }

  @SubscribeMessage('update')
  async update(@MessageBody() dto: UpdateStudyDto, @UserParam() user: User) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.update(em, dto, user);
    });
  }

  @SubscribeMessage('launch')
  async launch(@UserParam() user: User, @MessageBody('id') id: string) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.launch(em, id, user);
    });
  }

  @SubscribeMessage('remove')
  async remove(@UserParam() user: User, @MessageBody('id') id: string) {
    return this.orm.em.transactional(async (em) => {
      return this.studyService.remove(em, id, user);
    });
  }

  @SubscribeMessage('results')
  async getRespondents(@UserParam() user: User, @MessageBody('id') id: string) {
    return this.orm.em.transactional(async (em) => {
      return this.resultsService.getResults(em, id, user);
    });
  }
}
