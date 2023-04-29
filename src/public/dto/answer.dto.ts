import { IsOptional, IsString } from 'class-validator';

export class AnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString({ each: true })
  @IsOptional()
  optionIds?: string[];
}
