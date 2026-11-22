import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the robots.offSeason checkbox (off-season robots live in their own section, not the main grid).
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "robots" ADD COLUMN "off_season" boolean DEFAULT false NOT NULL;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "robots" DROP COLUMN "off_season";`)
}
