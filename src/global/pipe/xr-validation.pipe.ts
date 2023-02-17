import { VALIDATION_GROUP_METADATA } from '#app/global/decorators/validation-group.decorator';
import {
  ArgumentMetadata,
  PipeTransform,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

export class XrValidationPipe implements PipeTransform {
  constructor(private readonly options?: ValidationPipeOptions) {}

  transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;

    const instance = plainToInstance(metatype, value);

    const groups =
      Reflect.getMetadata(VALIDATION_GROUP_METADATA, instance) || [];

    const validationPipe = new ValidationPipe({
      ...this.options,
      groups,
    });

    return validationPipe.transform(value, metadata);
  }
}
