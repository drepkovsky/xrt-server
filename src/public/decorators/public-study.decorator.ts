import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const PublicStudy = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    return request.publicStudy;
  },
);
