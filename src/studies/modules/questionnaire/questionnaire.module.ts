import { QuestionnaireService } from '#app/studies/modules/questionnaire/questionnaire.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [QuestionnaireService],
  exports: [QuestionnaireService],
})
export class QuestionnaireModule {}
