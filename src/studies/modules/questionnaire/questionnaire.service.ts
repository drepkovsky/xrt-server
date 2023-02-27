import { UpdateQuestionnaireDto } from '#app/studies/modules/questionnaire/dto/questionnaire.dto';
import { Questionnaire } from '#app/studies/modules/questionnaire/entities/questionnaire.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionnaireService {
  async update(
    em: EntityManager,
    dto: UpdateQuestionnaireDto,
  ): Promise<Questionnaire> {
    const questionnaire = await em.findOne(
      Questionnaire,
      {
        id: dto.id,
      },
      {
        populate: ['questions'],
      },
    );

    questionnaire.assign(dto, { mergeObjects: true });

    return questionnaire;
  }

  async updateMany(
    em: EntityManager,
    dtos: UpdateQuestionnaireDto[],
  ): Promise<Questionnaire[]> {
    const questionnaires = await em.find(Questionnaire, {
      id: dtos.map((d) => d.id),
    });

    dtos.forEach((dto) => {
      const q = questionnaires.find((q) => q.id === dto.id);
      if (!q) return;
      q.assign(dto, { mergeObjects: true });
    });

    return questionnaires;
  }
}
