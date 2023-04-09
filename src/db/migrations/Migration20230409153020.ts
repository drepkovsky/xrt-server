import { Migration } from '@mikro-orm/migrations';

export class Migration20230409153020 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "task" alter column "order" type varchar(255) using ("order"::varchar(255));',
    );
    this.addSql('alter table "task" drop column "is_required";');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "task" add column "is_required" bool not null default false;',
    );
    this.addSql(
      'alter table "task" alter column "order" type int4 using ("order"::int4);',
    );
  }
}
