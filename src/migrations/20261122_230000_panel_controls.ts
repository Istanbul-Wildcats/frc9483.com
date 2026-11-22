import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

import { sectionToggles } from '../lib/sections'

// Panel controls: page section toggles (pages.sections_*), hero darkness (home.hero_overlay),
// optional award pennant image (robots_awards.image_id), "show on contact page" per social link,
// and removal of the CMS font choice (the site now uses the design system's Anta everywhere).
const toggleColumn = (key: string) => `sections_${key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)}`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const { key } of sectionToggles) {
    await db.execute(sql.raw(`ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "${toggleColumn(key)}" boolean DEFAULT true;`))
  }
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "hero_overlay" numeric DEFAULT 70;
   ALTER TABLE "robots_awards" ADD COLUMN IF NOT EXISTS "image_id" integer;
   DO $$ BEGIN
    ALTER TABLE "robots_awards" ADD CONSTRAINT "robots_awards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null; END $$;
   CREATE INDEX IF NOT EXISTS "robots_awards_image_idx" ON "robots_awards" USING btree ("image_id");
   ALTER TABLE "site_settings_socials" ADD COLUMN IF NOT EXISTS "show_on_contact" boolean DEFAULT false;
   UPDATE "site_settings_socials" SET "show_on_contact" = true WHERE "label" ~* 'instagram|youtube';
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_body_font";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_display_font";
   DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_body_font";
   DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_display_font";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_site_settings_fonts_body_font" AS ENUM('inter', 'barlow', 'archivo', 'ibm-plex-sans', 'hanken-grotesk', 'manrope', 'space-grotesk');
   EXCEPTION WHEN duplicate_object THEN null; END $$;
   DO $$ BEGIN
    CREATE TYPE "public"."enum_site_settings_fonts_display_font" AS ENUM('anta', 'saira', 'space-grotesk', 'archivo');
   EXCEPTION WHEN duplicate_object THEN null; END $$;
   ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_body_font" "enum_site_settings_fonts_body_font" DEFAULT 'inter';
   ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_display_font" "enum_site_settings_fonts_display_font" DEFAULT 'anta';
   ALTER TABLE "site_settings_socials" DROP COLUMN IF EXISTS "show_on_contact";
   DROP INDEX IF EXISTS "robots_awards_image_idx";
   ALTER TABLE "robots_awards" DROP COLUMN IF EXISTS "image_id";
   ALTER TABLE "home" DROP COLUMN IF EXISTS "hero_overlay";`)
  for (const { key } of sectionToggles) {
    await db.execute(sql.raw(`ALTER TABLE "pages" DROP COLUMN IF EXISTS "${toggleColumn(key)}";`))
  }
}
