import { Migration } from '@mikro-orm/migrations';

export class Migration20230306192653 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "study" alter column "description" drop default;');
    this.addSql(
      'alter table "study" alter column "description" type varchar(255) using ("description"::varchar(255));',
    );
    this.addSql('alter table "study" alter column "description" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "study" alter column "description" type varchar using ("description"::varchar);');
    this.addSql('alter table "study" alter column "description" set default \'Enter study description here\';');
    this.addSql('alter table "study" alter column "description" set not null;');
  }
}
