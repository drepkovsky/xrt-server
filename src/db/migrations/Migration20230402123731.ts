import { Migration } from '@mikro-orm/migrations';

export class Migration20230402123731 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "recording" ("id" bigserial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "respondent_id" bigint not null, "token" varchar(255) not null, "type" text check ("type" in (\'microphone\', \'audio\', \'screen\')) not null, "location" varchar(255) null);',
    );

    this.addSql(
      'create table "answer_options" ("answer_id" bigint not null, "option_id" bigint not null, constraint "answer_options_pkey" primary key ("answer_id", "option_id"));',
    );

    this.addSql(
      'alter table "recording" add constraint "recording_respondent_id_foreign" foreign key ("respondent_id") references "respondent" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "answer_options" add constraint "answer_options_answer_id_foreign" foreign key ("answer_id") references "answer" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "answer_options" add constraint "answer_options_option_id_foreign" foreign key ("option_id") references "option" ("id") on update cascade on delete cascade;',
    );

    this.addSql('alter table "answer" drop constraint "answer_option_id_foreign";');

    this.addSql('alter table "answer" drop column "option_id";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "recording" cascade;');

    this.addSql('drop table if exists "answer_options" cascade;');

    this.addSql('alter table "answer" add column "option_id" int8 not null default null;');
    this.addSql(
      'alter table "answer" add constraint "answer_option_id_foreign" foreign key ("option_id") references "option" ("id") on update cascade on delete no action;',
    );
  }
}
