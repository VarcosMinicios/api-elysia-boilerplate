import { Migration } from '@mikro-orm/migrations';

export class Migration20260904142514 extends Migration {

  override name = 'Migration20260904142514';

  override up(): void | Promise<void> {
    this.addSql(`create table \`users\` (\`id\` int unsigned not null auto_increment primary key, \`role\` tinyint not null default 2, \`name\` varchar(255) not null, \`email\` varchar(255) not null, \`password\` varchar(255) not null, \`avatar\` varchar(255) null, \`stripe_customer_id\` varchar(255) null, \`created_at\` datetime not null, \`updated_at\` datetime not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`users\` add unique \`users_email_unique\` (\`email\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`users\`;`);
  }

}
