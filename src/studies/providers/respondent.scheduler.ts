import { Respondent, RespondentStatus } from '#app/studies/entities/respondents.entity';
import { UseRequestContext } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RespondentScheduler {
  constructor(private readonly orm: MikroORM) {}
  // run every 10 seconds
  @Cron('*/10 * * * * *')
  async schedule() {
    await this.cleanUpRespondents();
  }

  @UseRequestContext()
  async cleanUpRespondents() {
    // get respondens that were create more than 24 hours ago and are not finished
    const respondents = await this.orm.em.find(Respondent, {
      createdAt: {
        $lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      finishedAt: null,
    });

    // set their status to abandoned
    for (const r of respondents) {
      r.status = RespondentStatus.ABANDONED;
      r.abandonedAt = new Date();
    }

    await this.orm.em.flush();
  }
}
