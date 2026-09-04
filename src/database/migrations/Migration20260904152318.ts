import { Migration } from '@mikro-orm/migrations';

export class Migration20260904152318 extends Migration {

  override name = 'Migration20260904152318';

  override up(): void | Promise<void> {
    this.addSql(`create table \`refresh_sessions\` (\`id\` int unsigned not null auto_increment primary key, \`user_id\` int unsigned not null, \`token_hash\` varchar(64) not null, \`family_id\` varchar(36) not null, \`expires_at\` datetime not null, \`revoked_at\` datetime null, \`created_at\` datetime not null, \`updated_at\` datetime not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`refresh_sessions\` add index \`refresh_sessions_user_id_index\` (\`user_id\`);`);
    this.addSql(`alter table \`refresh_sessions\` add unique \`refresh_sessions_token_hash_unique\` (\`token_hash\`);`);
    this.addSql(`alter table \`refresh_sessions\` add index \`refresh_sessions_family_id_index\` (\`family_id\`);`);

    this.addSql(`alter table \`refresh_sessions\` add constraint \`refresh_sessions_user_id_foreign\` foreign key (\`user_id\`) references \`users\` (\`id\`) on delete cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`refresh_sessions\`;`);
  }

}
