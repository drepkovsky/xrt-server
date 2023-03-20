import { Study } from '#app/studies/entities/study.entity';
import { MikroORM } from '@mikro-orm/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class PublicStudyGuard implements CanActivate {
  constructor(private readonly orm: MikroORM) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const key =
      Reflect.getMetadata('study-token-key', context.getHandler()) || 'token';

    const request = context.switchToHttp().getRequest();

    const token =
      request.body[key] ||
      request.query[key] ||
      request.params[key] ||
      request.headers['x-study-token'];

    console.log('token', token);

    const study = await this.orm.em.transactional((em) => {
      return em.findOne(Study, { token });
    });

    request.publicStudy = study;

    return !!study;
  }
}
