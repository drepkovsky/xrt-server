import { Migration } from '@mikro-orm/migrations';

export class Migration20230325154420 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "option" alter column "text" type varchar(255) using ("text"::varchar(255));',
    );
    this.addSql('alter table "option" alter column "text" set default \'\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "option" alter column "text" drop default;');
    this.addSql(
      'alter table "option" alter column "text" type varchar using ("text"::varchar);',
    );
  }
}
