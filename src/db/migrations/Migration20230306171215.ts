import { Migration } from '@mikro-orm/migrations';

export class Migration20230306171215 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "task" add column "event_name" varchar(255) not null;');
    this.addSql('alter table "task" alter column "text" type varchar(255) using ("text"::varchar(255));');
    this.addSql('alter table "task" alter column "text" set default \'Enter task text here\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "task" alter column "text" drop default;');
    this.addSql('alter table "task" alter column "text" type varchar using ("text"::varchar);');
    this.addSql('alter table "task" drop column "event_name";');
  }

}
