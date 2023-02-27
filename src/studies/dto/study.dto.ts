import { Study } from '#app/studies/entities/study.entity';
import { PickType } from '@nestjs/mapped-types';

export class UpdateStudyDto extends PickType(Study, ['name', 'id']) {}
