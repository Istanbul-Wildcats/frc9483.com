import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Backfill of schema drift that accumulated after the baseline migration without a
// migration of its own: CMS-selectable fonts (two enum-typed site_settings columns),
// six new ui_text_locales UI-text fields, and resources_links_locales.description.
// The originally hand-trimmed add_cad_image migration skipped all of these, which
// made production builds fail ("column ... does not exist") during prerender.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_site_settings_fonts_body_font" AS ENUM('inter', 'barlow', 'archivo', 'ibm-plex-sans', 'hanken-grotesk', 'manrope', 'space-grotesk');
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_site_settings_fonts_display_font" AS ENUM('anta', 'saira', 'space-grotesk', 'archivo');
   EXCEPTION WHEN duplicate_object THEN null; END $$;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_body_font" "enum_site_settings_fonts_body_font" DEFAULT 'inter';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_display_font" "enum_site_settings_fonts_display_font" DEFAULT 'anta';
  ALTER TABLE "ui_text_locales" ADD COLUMN IF NOT EXISTS "join_closed" varchar;
  ALTER TABLE "ui_text_locales" ADD COLUMN IF NOT EXISTS "form_hint" varchar;
  ALTER TABLE "ui_text_locales" ADD COLUMN IF NOT EXISTS "order_note" varchar;
  ALTER TABLE "ui_text_locales" ADD COLUMN IF NOT EXISTS "build_thread" varchar;
  ALTER TABLE "ui_text_locales" ADD COLUMN IF NOT EXISTS "awards_note" varchar;
  ALTER TABLE "ui_text_locales" ADD COLUMN IF NOT EXISTS "sponsor_stats" varchar;
  ALTER TABLE "resources_links_locales" ADD COLUMN IF NOT EXISTS "description" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources_links_locales" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "ui_text_locales" DROP COLUMN IF EXISTS "sponsor_stats";
  ALTER TABLE "ui_text_locales" DROP COLUMN IF EXISTS "awards_note";
  ALTER TABLE "ui_text_locales" DROP COLUMN IF EXISTS "build_thread";
  ALTER TABLE "ui_text_locales" DROP COLUMN IF EXISTS "order_note";
  ALTER TABLE "ui_text_locales" DROP COLUMN IF EXISTS "form_hint";
  ALTER TABLE "ui_text_locales" DROP COLUMN IF EXISTS "join_closed";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_display_font";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_body_font";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_display_font";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_body_font";`)
}
