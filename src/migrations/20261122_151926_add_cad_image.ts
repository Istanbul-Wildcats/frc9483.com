import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Only the two columns this change introduces: robots.cad_image_id and the cadView UI-text field.
// (The generated diff also contained stale drift — e.g. dropping media._objectkey, which does not
// exist in any real database — so the migration is kept minimal and additive instead.)
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "robots" ADD COLUMN "cad_image_id" integer;
  ALTER TABLE "robots" ADD CONSTRAINT "robots_cad_image_id_media_id_fk" FOREIGN KEY ("cad_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "robots_cad_image_idx" ON "robots" USING btree ("cad_image_id");
  ALTER TABLE "ui_text_locales" ADD COLUMN "cad_view" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "robots" DROP CONSTRAINT IF EXISTS "robots_cad_image_id_media_id_fk";
  DROP INDEX IF EXISTS "robots_cad_image_idx";
  ALTER TABLE "robots" DROP COLUMN "cad_image_id";
  ALTER TABLE "ui_text_locales" DROP COLUMN "cad_view";`)
}
