import { Migration } from '@mikro-orm/migrations';

export class Migration20230305184502 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "task_response" alter column "completed_at" type timestamptz(0) using ("completed_at"::timestamptz(0));');
    this.addSql('alter table "task_response" alter column "skipped_at" type timestamptz(0) using ("skipped_at"::timestamptz(0));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "task_response" alter column "completed_at" type timestamptz using ("completed_at"::timestamptz);');
    this.addSql('alter table "task_response" alter column "skipped_at" type timestamptz using ("skipped_at"::timestamptz);');
  }

}
