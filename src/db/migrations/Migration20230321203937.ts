import { Migration } from '@mikro-orm/migrations';

export class Migration20230321203937 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "questionnaire" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql('alter table "questionnaire" alter column "created_at" set default now();');
    this.addSql(
      'alter table "questionnaire" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql('alter table "questionnaire" alter column "updated_at" set default now();');

    this.addSql(
      'alter table "question" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql('alter table "question" alter column "created_at" set default now();');
    this.addSql(
      'alter table "question" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql('alter table "question" alter column "updated_at" set default now();');

    this.addSql(
      'alter table "option" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql('alter table "option" alter column "created_at" set default now();');
    this.addSql(
      'alter table "option" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql('alter table "option" alter column "updated_at" set default now();');

    this.addSql(
      'alter table "user" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql('alter table "user" alter column "created_at" set default now();');
    this.addSql(
      'alter table "user" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql('alter table "user" alter column "updated_at" set default now();');

    this.addSql(
      'alter table "study" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql('alter table "study" alter column "created_at" set default now();');
    this.addSql(
      'alter table "study" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql('alter table "study" alter column "updated_at" set default now();');

    this.addSql(
      'alter table "task" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql('alter table "task" alter column "created_at" set default now();');
    this.addSql(
      'alter table "task" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql('alter table "task" alter column "updated_at" set default now();');

    this.addSql(
      'alter table "respondent" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql('alter table "respondent" alter column "created_at" set default now();');
    this.addSql(
      'alter table "respondent" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql('alter table "respondent" alter column "updated_at" set default now();');

    this.addSql(
      'alter table "task_response" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql('alter table "task_response" alter column "created_at" set default now();');
    this.addSql(
      'alter table "task_response" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql('alter table "task_response" alter column "updated_at" set default now();');

    this.addSql(
      'alter table "answer" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql('alter table "answer" alter column "created_at" set default now();');
    this.addSql(
      'alter table "answer" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql('alter table "answer" alter column "updated_at" set default now();');
  }

  async down(): Promise<void> {
    this.addSql('alter table "answer" alter column "created_at" drop default;');
    this.addSql('alter table "answer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "answer" alter column "updated_at" drop default;');
    this.addSql('alter table "answer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');

    this.addSql('alter table "option" alter column "created_at" drop default;');
    this.addSql('alter table "option" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "option" alter column "updated_at" drop default;');
    this.addSql('alter table "option" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');

    this.addSql('alter table "question" alter column "created_at" drop default;');
    this.addSql('alter table "question" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "question" alter column "updated_at" drop default;');
    this.addSql('alter table "question" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');

    this.addSql('alter table "questionnaire" alter column "created_at" drop default;');
    this.addSql(
      'alter table "questionnaire" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql('alter table "questionnaire" alter column "updated_at" drop default;');
    this.addSql(
      'alter table "questionnaire" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
    );

    this.addSql('alter table "respondent" alter column "created_at" drop default;');
    this.addSql(
      'alter table "respondent" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql('alter table "respondent" alter column "updated_at" drop default;');
    this.addSql(
      'alter table "respondent" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
    );

    this.addSql('alter table "study" alter column "created_at" drop default;');
    this.addSql('alter table "study" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "study" alter column "updated_at" drop default;');
    this.addSql('alter table "study" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');

    this.addSql('alter table "task" alter column "created_at" drop default;');
    this.addSql('alter table "task" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "task" alter column "updated_at" drop default;');
    this.addSql('alter table "task" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');

    this.addSql('alter table "task_response" alter column "created_at" drop default;');
    this.addSql(
      'alter table "task_response" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql('alter table "task_response" alter column "updated_at" drop default;');
    this.addSql(
      'alter table "task_response" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
    );

    this.addSql('alter table "user" alter column "created_at" drop default;');
    this.addSql('alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" drop default;');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
  }
}
