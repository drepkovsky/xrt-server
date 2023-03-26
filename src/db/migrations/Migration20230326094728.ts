import { Migration } from '@mikro-orm/migrations';

export class Migration20230326094728 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "question" drop constraint if exists "question_type_check";',
    );

    this.addSql(
      'alter table "question" alter column "type" type text using ("type"::text);',
    );

    //  single-line, multi-line, number to text
    this.addSql(
      "update \"question\" set \"type\" = 'text' where \"type\" in ('single-line', 'multi-line', 'number');",
    );

    // convert radio to select
    this.addSql(
      'update "question" set "type" = \'select\' where "type" = \'radio\';',
    );

    this.addSql(
      'alter table "question" add constraint "question_type_check" check ("type" in (\'text\', \'checkbox\', \'select\'));',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "question" drop constraint if exists "question_type_check";',
    );

    this.addSql(
      'alter table "question" alter column "type" type text using ("type"::text);',
    );
    this.addSql(
      "alter table \"question\" add constraint \"question_type_check\" check (\"type\" in ('single-line', 'multi-line', 'number', 'radio', 'checkbox', 'select'));",
    );
  }
}
