import { Migration } from '@mikro-orm/migrations';

export class Migration20230417191514 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "event" ("id" bigserial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "respondent_id" bigint not null, "name" varchar(255) not null, "description" varchar(255) null);',
    );

    this.addSql(
      'alter table "event" add constraint "event_respondent_id_foreign" foreign key ("respondent_id") references "respondent" ("id") on update cascade;',
    );

    this.addSql('alter table "task_response" drop column "skipped_at";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "event" cascade;');

    this.addSql('alter table "task_response" add column "skipped_at" timestamptz null default null;');
  }
}
