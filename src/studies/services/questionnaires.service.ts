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
    return prisma.questionnaire.update({
      where: { id },
      data: {
        questions: {
          updateMany: data.questions.map((question) => ({
            where: { id: Number(question.id) },
            data: {
              text: question.text,
              type: question.type,
            },
          })),
        },
      },
    });
  }

  updateMany(
    prisma: Prisma.TransactionClient,
    data: UpdateQuestionnaireDto[],
  ): Promise<Questionnaire[]> {
    return Promise.all(
      data.map((questionnaire) =>
        this.update(prisma, Number(questionnaire.id), questionnaire),
      ),
    );
  }
}
