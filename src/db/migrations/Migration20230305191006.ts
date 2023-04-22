import { Migration } from '@mikro-orm/migrations';

export class Migration20230305191006 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "questionnaire" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));',
    );
    this.addSql('alter table "questionnaire" alter column "deleted_at" drop not null;');

    this.addSql('alter table "question" add column "text" varchar(255) not null;');
    this.addSql(
      'alter table "question" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));',
    );
    this.addSql('alter table "question" alter column "deleted_at" drop not null;');

    this.addSql('alter table "option" add column "text" varchar(255) not null;');
    this.addSql(
      'alter table "option" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));',
    );
    this.addSql('alter table "option" alter column "deleted_at" drop not null;');

    this.addSql(
      'alter table "user" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));',
    );
    this.addSql('alter table "user" alter column "deleted_at" drop not null;');

    this.addSql(
      'alter table "study" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));',
    );
    this.addSql('alter table "study" alter column "deleted_at" drop not null;');

    this.addSql('alter table "task" add column "text" varchar(255) not null;');
    this.addSql(
      'alter table "task" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));',
    );
    this.addSql('alter table "task" alter column "deleted_at" drop not null;');

    this.addSql(
      'alter table "respondent" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));',
    );
    this.addSql('alter table "respondent" alter column "deleted_at" drop not null;');

    this.addSql(
      'alter table "task_response" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));',
    );
    this.addSql('alter table "task_response" alter column "deleted_at" drop not null;');
    this.addSql(
      'alter table "task_response" alter column "completed_at" type timestamptz(0) using ("completed_at"::timestamptz(0));',
    );
    this.addSql('alter table "task_response" alter column "completed_at" drop not null;');
    this.addSql(
      'alter table "task_response" alter column "skipped_at" type timestamptz(0) using ("skipped_at"::timestamptz(0));',
    );
    this.addSql('alter table "task_response" alter column "skipped_at" drop not null;');

    this.addSql('alter table "answer" add column "text" varchar(255) null;');
    this.addSql(
      'alter table "answer" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));',
    );
    this.addSql('alter table "answer" alter column "deleted_at" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "answer" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);');
    this.addSql('alter table "answer" alter column "deleted_at" set not null;');
    this.addSql('alter table "answer" drop column "text";');

    this.addSql('alter table "option" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);');
    this.addSql('alter table "option" alter column "deleted_at" set not null;');
    this.addSql('alter table "option" drop column "text";');

    this.addSql('alter table "question" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);');
    this.addSql('alter table "question" alter column "deleted_at" set not null;');
    this.addSql('alter table "question" drop column "text";');

    this.addSql(
      'alter table "questionnaire" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);',
    );
    this.addSql('alter table "questionnaire" alter column "deleted_at" set not null;');

    this.addSql(
      'alter table "respondent" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);',
    );
    this.addSql('alter table "respondent" alter column "deleted_at" set not null;');

    this.addSql('alter table "study" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);');
    this.addSql('alter table "study" alter column "deleted_at" set not null;');

    this.addSql('alter table "task" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);');
    this.addSql('alter table "task" alter column "deleted_at" set not null;');
    this.addSql('alter table "task" drop column "text";');

    this.addSql(
      'alter table "task_response" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);',
    );
    this.addSql('alter table "task_response" alter column "deleted_at" set not null;');
    this.addSql(
      'alter table "task_response" alter column "completed_at" type timestamptz using ("completed_at"::timestamptz);',
    );
    this.addSql('alter table "task_response" alter column "completed_at" set not null;');
    this.addSql(
      'alter table "task_response" alter column "skipped_at" type timestamptz using ("skipped_at"::timestamptz);',
    );
    this.addSql('alter table "task_response" alter column "skipped_at" set not null;');

    this.addSql('alter table "user" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);');
    this.addSql('alter table "user" alter column "deleted_at" set not null;');
  }
}
