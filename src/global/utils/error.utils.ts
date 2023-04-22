import type {
  FieldError,
  ValidationError,
} from '#app/global/types/error.types';

export function buildValidationErrorPayload(
  fieldErrors: FieldError[] | FieldError,
): Pick<ValidationError, 'error' | 'message'> {
  return {
    error: 'VALIDATION_ERROR',
    message: Array.isArray(fieldErrors) ? fieldErrors : [fieldErrors],
  };
}
