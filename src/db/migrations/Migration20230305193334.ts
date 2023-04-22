import { Migration } from '@mikro-orm/migrations';

export class Migration20230305193334 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_email_unique";');
  }
}
