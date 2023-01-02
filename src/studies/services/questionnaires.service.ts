import { Injectable } from '@nestjs/common';
import { Prisma, Questionnaire } from '@prisma/client';
import { StudyUpdatable } from 'src/studies/abstract/study-updatable.abstract';
import { UpdateQuestionnaireDto } from 'src/studies/dto/questionnaire.dto';

@Injectable()
export class QuestionnairesService
  implements StudyUpdatable<Questionnaire, UpdateQuestionnaireDto>
{
  update(
    prisma: Prisma.TransactionClient,
    id: number,
    data: UpdateQuestionnaireDto,
  ): Promise<Questionnaire> {
    throw new Error('Method not implemented.');
  }

  updateMany(
    prisma: Prisma.TransactionClient,
    data: UpdateQuestionnaireDto[],
  ): Promise<Questionnaire[]> {
    throw new Error('Method not implemented.');
  }
}
