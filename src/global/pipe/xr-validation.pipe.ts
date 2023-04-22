import type { ArgumentMetadata, PipeTransform, ValidationPipeOptions } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { VALIDATION_GROUP_METADATA } from '#app/global/decorators/validation-group.decorator';

export class XrValidationPipe implements PipeTransform {
  constructor(private readonly options?: ValidationPipeOptions) {}

  transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;

    const instance =
      value.constructor.name === 'Object' || value.constructor.name === 'Array'
        ? plainToInstance(metatype, value)
        : value;

    const groups =
      typeof instance !== 'object' || typeof instance !== 'function'
        ? []
        : Reflect.getMetadata(VALIDATION_GROUP_METADATA, instance) || [];

    const validationPipe = new ValidationPipe({
      ...this.options,
      groups,
    });

    return validationPipe.transform(value, metadata);
  }
}
