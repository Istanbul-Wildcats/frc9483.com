import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// New UI-text key 'offSeasonRobots' (section label on the robots page).
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "ui_text_locales" ADD COLUMN IF NOT EXISTS "off_season_robots" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "ui_text_locales" DROP COLUMN IF EXISTS "off_season_robots";`)
}
