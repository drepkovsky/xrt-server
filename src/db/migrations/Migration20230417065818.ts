import { Migration } from '@mikro-orm/migrations';

export class Migration20230417065818 extends Migration {
  async up(): Promise<void> {
    this.addSql(this.getKnex()('respondent').whereNotNull('finished_at').update('status', 'FINISHED'));
  }

  async down(): Promise<void> {
    return;
  }
}
