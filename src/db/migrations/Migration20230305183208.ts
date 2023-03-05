import { Migration } from '@mikro-orm/migrations';

export class Migration20230305183208 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "questionnaire" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null);');

    this.addSql('create table "question" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null, "questionnaire_id" bigint not null, "type" text check ("type" in (\'single-line\', \'multi-line\', \'number\', \'radio\', \'checkbox\', \'select\')) not null);');

    this.addSql('create table "option" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null, "question_id" bigint not null);');

    this.addSql('create table "user" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null);');

    this.addSql('create table "study" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null, "name" varchar(255) not null, "token" varchar(255) not null, "status" text check ("status" in (\'draft\', \'active\', \'finished\')) not null default \'draft\', "created_by_id" bigint not null, "pre_study_questionnaire_id" bigint not null, "post_study_questionnaire_id" bigint not null);');
    this.addSql('alter table "study" add constraint "study_token_unique" unique ("token");');

    this.addSql('create table "task" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null, "name" varchar(255) not null, "study_id" bigint not null, "is_required" boolean not null default false);');

    this.addSql('create table "respondent" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null, "study_id" bigint not null);');

    this.addSql('create table "task_response" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null, "respondent_id" bigint not null, "task_id" bigint not null, "completed_at" timestamptz(6) not null, "skipped_at" timestamptz(6) not null);');

    this.addSql('create table "answer" ("id" bigserial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null, "question_id" bigint not null, "option_id" bigint not null, "respondent_id" bigint not null);');

    this.addSql('alter table "question" add constraint "question_questionnaire_id_foreign" foreign key ("questionnaire_id") references "questionnaire" ("id") on update cascade;');

    this.addSql('alter table "option" add constraint "option_question_id_foreign" foreign key ("question_id") references "question" ("id") on update cascade;');

    this.addSql('alter table "study" add constraint "study_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "study" add constraint "study_pre_study_questionnaire_id_foreign" foreign key ("pre_study_questionnaire_id") references "questionnaire" ("id") on update cascade;');
    this.addSql('alter table "study" add constraint "study_post_study_questionnaire_id_foreign" foreign key ("post_study_questionnaire_id") references "questionnaire" ("id") on update cascade;');

    this.addSql('alter table "task" add constraint "task_study_id_foreign" foreign key ("study_id") references "study" ("id") on update cascade;');

    this.addSql('alter table "respondent" add constraint "respondent_study_id_foreign" foreign key ("study_id") references "study" ("id") on update cascade;');

    this.addSql('alter table "task_response" add constraint "task_response_respondent_id_foreign" foreign key ("respondent_id") references "respondent" ("id") on update cascade;');
    this.addSql('alter table "task_response" add constraint "task_response_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade;');

    this.addSql('alter table "answer" add constraint "answer_question_id_foreign" foreign key ("question_id") references "question" ("id") on update cascade;');
    this.addSql('alter table "answer" add constraint "answer_option_id_foreign" foreign key ("option_id") references "option" ("id") on update cascade;');
    this.addSql('alter table "answer" add constraint "answer_respondent_id_foreign" foreign key ("respondent_id") references "respondent" ("id") on update cascade;');
  }

}
