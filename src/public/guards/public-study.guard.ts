import { Study } from '#app/studies/entities/study.entity';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception.js';

@Injectable()
export class PublicStudyGuard implements CanActivate {
  constructor(private readonly orm: MikroORM) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const key = Reflect.getMetadata('study-token-key', context.getHandler()) || 'studyToken';

    const request = context.switchToHttp().getRequest();

    const token = request.headers['x-study-token'] || request.body[key] || request.query[key] || request.params[key];

    const study = await this.orm.em.transactional(em => {
      return em.findOne(
        Study,
        { token },
        {
          populate: ['preStudyQuestionnaire.questions.options', 'postStudyQuestionnaire.questions.options'] as const,
        },
      );
    });

    request.publicStudy = study;

    if (!study) {
      throw new ForbiddenException('Invalid study token');
    }

    return true;
  }
}
