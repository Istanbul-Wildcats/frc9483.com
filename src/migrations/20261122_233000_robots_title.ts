import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// UI text key 'robots' (home section title + hero button) is replaced by 'robotsTitle', default 'Robotlar' / 'Robots'.
// The old stored value ('Robotlarımız') is intentionally dropped so the new default shows.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ui_text_locales" ADD COLUMN IF NOT EXISTS "robots_title" varchar;
   ALTER TABLE "ui_text_locales" DROP COLUMN IF EXISTS "robots";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ui_text_locales" ADD COLUMN IF NOT EXISTS "robots" varchar;
   ALTER TABLE "ui_text_locales" DROP COLUMN IF EXISTS "robots_title";`)
}
