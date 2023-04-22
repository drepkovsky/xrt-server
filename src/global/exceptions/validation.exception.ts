import type { FieldError } from '#app/global/types/error.types';
import { buildValidationErrorPayload } from '#app/global/utils/error.utils';
import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(payload: FieldError[] | FieldError) {
    super(buildValidationErrorPayload(payload));
  }
}
