import { Migration } from '@mikro-orm/migrations';

export class Migration20230306215329 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "task" add column "order" int not null default 0;');
    this.addSql(
      'CREATE UNIQUE INDEX "task_event_name_study_unique" ON "task" ("event_name", "study_id", "deleted_at") WHERE "deleted_at" IS NULL;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop index "task_event_name_study_unique";');
    this.addSql('alter table "task" drop column "order";');
  }
}
