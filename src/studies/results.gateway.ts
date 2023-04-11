import { UserParam } from '#app/auth/decorators/user-param.decorator';
import { JwtAuthIoGuard } from '#app/auth/guards/jwt-auth.ioguard';
import { IoGateway } from '#app/global/decorators/io-gateway.decorator';
import { UseIoGuard } from '#app/global/decorators/use-io-guard.decorator';
import { IoBaseGateway } from '#app/global/gateway/io-base.gateway';
import { ResultsService } from '#app/studies/services/results.service';
import { User } from '#app/users/entities/user.entity';
import { MessageBody, SubscribeMessage } from '@nestjs/websockets';

@UseIoGuard(JwtAuthIoGuard)
@IoGateway({
  namespace: 'study-results',
  transports: ['websocket'],
})
export class ResultsGateway extends IoBaseGateway {
  constructor(private readonly resultsService: ResultsService) {
    super();
  }

  @SubscribeMessage('respondents')
  async getRespondents(@UserParam() user: User, @MessageBody('id') id: string) {
    return this.orm.em.transactional(async (em) => {
      return this.resultsService.getRespondents(em, id, user);
    });
  }
}
