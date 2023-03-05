export type ValidationError = {
  message: FieldError[];
  error: 'VALIDATION_ERROR';
};
export type FieldError = {
  field: string;
  messages: string[];
};
