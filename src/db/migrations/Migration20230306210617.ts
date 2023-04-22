import { Migration } from '@mikro-orm/migrations';

export class Migration20230306210617 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "task" alter column "text" type varchar(255) using ("text"::varchar(255));',
    );
    this.addSql('alter table "task" alter column "text" set default \'\';');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "task" alter column "text" type varchar using ("text"::varchar);',
    );
    this.addSql(
      'alter table "task" alter column "text" set default \'Enter task text here\';',
    );
  }
}
