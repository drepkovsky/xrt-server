import { Study } from '#app/studies/entities/study.entity';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicService {
  findStudy(em: EntityManager, token: string) {
    return em.findOne(
      Study,
      { token },
      {
        populate: ['tasks'],
      },
    );
  }
}
