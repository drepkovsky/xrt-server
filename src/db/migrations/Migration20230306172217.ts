import { Migration } from '@mikro-orm/migrations';

export class Migration20230306172217 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "study" add column "description" varchar(255) not null default \'Enter study description here\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "study" drop column "description";');
  }

}
