import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// robots.links_chief_delphi / links_chief_delphi_title were added to the collection
// (and to seed data) after the baseline migration but never got a migration of their
// own — production builds failed with "column robots.links_chief_delphi does not exist".
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "robots" ADD COLUMN IF NOT EXISTS "links_chief_delphi" varchar;
  ALTER TABLE "robots" ADD COLUMN IF NOT EXISTS "links_chief_delphi_title" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "robots" DROP COLUMN "links_chief_delphi_title";
  ALTER TABLE "robots" DROP COLUMN "links_chief_delphi";`)
}
