import { PublicStudyGuard } from '#app/public/guards/public-study.guard';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

export const UsePublicStudy = (tokenKey = 'token') =>
  applyDecorators(SetMetadata('study-token-key', tokenKey), UseGuards(PublicStudyGuard));
