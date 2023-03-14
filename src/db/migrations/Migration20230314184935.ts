import { Migration } from '@mikro-orm/migrations';

export class Migration20230314184935 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "respondent" add column "status" text check ("status" in (\'RUNNING\', \'FINISHED\', \'ABANDONED\')) not null default \'RUNNING\', add column "finished_at" timestamptz(0) null, add column "abandoned_at" timestamptz(0) null;',
    );

    this.addSql(
      'alter table "task_response" add constraint "task_response_respondent_id_task_id_unique" unique ("respondent_id", "task_id");',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "respondent" drop column "status";');
    this.addSql('alter table "respondent" drop column "finished_at";');
    this.addSql('alter table "respondent" drop column "abandoned_at";');

    this.addSql(
      'alter table "task_response" drop constraint "task_response_respondent_id_task_id_unique";',
    );
  }
}
