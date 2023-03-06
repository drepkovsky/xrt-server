import { Migration } from '@mikro-orm/migrations';

export class Migration20230306095130 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "study" drop constraint "study_post_study_questionnaire_id_foreign";');
    this.addSql('alter table "study" drop constraint "study_pre_study_questionnaire_id_foreign";');

    this.addSql('alter table "study" alter column "pre_study_questionnaire_id" type bigint using ("pre_study_questionnaire_id"::bigint);');
    this.addSql('alter table "study" alter column "pre_study_questionnaire_id" drop not null;');
    this.addSql('alter table "study" alter column "post_study_questionnaire_id" type bigint using ("post_study_questionnaire_id"::bigint);');
    this.addSql('alter table "study" alter column "post_study_questionnaire_id" drop not null;');
    this.addSql('alter table "study" add constraint "study_post_study_questionnaire_id_foreign" foreign key ("post_study_questionnaire_id") references "questionnaire" ("id") on update cascade on delete set null;');
    this.addSql('alter table "study" add constraint "study_pre_study_questionnaire_id_foreign" foreign key ("pre_study_questionnaire_id") references "questionnaire" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "study" drop constraint "study_pre_study_questionnaire_id_foreign";');
    this.addSql('alter table "study" drop constraint "study_post_study_questionnaire_id_foreign";');

    this.addSql('alter table "study" alter column "pre_study_questionnaire_id" type int8 using ("pre_study_questionnaire_id"::int8);');
    this.addSql('alter table "study" alter column "pre_study_questionnaire_id" set not null;');
    this.addSql('alter table "study" alter column "post_study_questionnaire_id" type int8 using ("post_study_questionnaire_id"::int8);');
    this.addSql('alter table "study" alter column "post_study_questionnaire_id" set not null;');
    this.addSql('alter table "study" add constraint "study_pre_study_questionnaire_id_foreign" foreign key ("pre_study_questionnaire_id") references "questionnaire" ("id") on update cascade on delete no action;');
    this.addSql('alter table "study" add constraint "study_post_study_questionnaire_id_foreign" foreign key ("post_study_questionnaire_id") references "questionnaire" ("id") on update cascade on delete no action;');
  }

}
