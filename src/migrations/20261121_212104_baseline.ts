import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('tr', 'en');
  CREATE TYPE "public"."enum_sponsors_status" AS ENUM('active', 'past');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('tr', 'en');
  CREATE TYPE "public"."enum_contact_messages_topic" AS ENUM('sponsorship', 'collaboration', 'join', 'other');
  CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'read', 'replied');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "robots_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rank" numeric,
  	"teams" numeric,
  	"wins" numeric DEFAULT 0,
  	"losses" numeric DEFAULT 0,
  	"ties" numeric DEFAULT 0
  );
  
  CREATE TABLE "robots_events_locales" (
  	"event" varchar NOT NULL,
  	"result" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "robots_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"banner" boolean DEFAULT false
  );
  
  CREATE TABLE "robots_awards_locales" (
  	"event" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "robots_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "robots_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "robots" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"season" numeric NOT NULL,
  	"game" varchar,
  	"image_id" integer,
  	"season_photo_id" integer,
  	"links_tba" varchar,
  	"links_youtube" varchar,
  	"links_statbotics" varchar,
  	"links_first_events" varchar,
  	"epa_rank" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sponsors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"legal_name" varchar,
  	"logo_id" integer,
  	"url" varchar,
  	"status" "enum_sponsors_status" DEFAULT 'active' NOT NULL,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"date" timestamp(3) with time zone,
  	"cover_id" integer,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_cover_id" integer,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"quantity" numeric DEFAULT 1,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "gallery_images" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gallery_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"topic" "enum_contact_messages_topic",
  	"message" varchar NOT NULL,
  	"locale" varchar,
  	"status" "enum_contact_messages_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"robots_id" integer,
  	"sponsors_id" integer,
  	"posts_id" integer,
  	"products_id" integer,
  	"gallery_images_id" integer,
  	"contact_messages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Overcharge · FRC 9483' NOT NULL,
  	"og_image_id" integer,
  	"favicon_id" integer,
  	"favicon_light_id" integer,
  	"footer_title" varchar DEFAULT 'OVERCHARGE',
  	"footer_subtitle" varchar DEFAULT '#9483 · İstanbul',
  	"team_name" varchar DEFAULT 'FRC 9483 İstanbul Wildcats' NOT NULL,
  	"email" varchar,
  	"forms_join_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_text" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_text_locales" (
  	"join" varchar,
  	"join_team" varchar,
  	"apply" varchar,
  	"robots" varchar,
  	"detail" varchar,
  	"all_awards" varchar,
  	"all_sponsors" varchar,
  	"achievements" varchar,
  	"sponsors" varchar,
  	"season_summary" varchar,
  	"season_awards" varchar,
  	"highlights" varchar,
  	"videos_label" varchar,
  	"play_video" varchar,
  	"back" varchar,
  	"not_found_back" varchar,
  	"write_us" varchar,
  	"sponsor_cta" varchar,
  	"active_sponsors" varchar,
  	"past_sponsors" varchar,
  	"open_form" varchar,
  	"rankings" varchar,
  	"teams" varchar,
  	"who" varchar,
  	"team" varchar,
  	"contact" varchar,
  	"join_intro" varchar,
  	"contact_intro" varchar,
  	"not_found_title" varchar,
  	"new_tab" varchar,
  	"menu" varchar,
  	"close_menu" varchar,
  	"view_large" varchar,
  	"units_suffix" varchar,
  	"sold_out" varchar,
  	"sources" varchar,
  	"source_note" varchar,
  	"table_event" varchar,
  	"table_rank" varchar,
  	"table_record" varchar,
  	"table_total" varchar,
  	"table_of" varchar,
  	"no_products" varchar,
  	"form_name" varchar,
  	"form_email" varchar,
  	"form_topic" varchar,
  	"topic_sponsor" varchar,
  	"topic_collab" varchar,
  	"topic_join" varchar,
  	"topic_other" varchar,
  	"form_message" varchar,
  	"form_send" varchar,
  	"form_sending" varchar,
  	"form_success_title" varchar,
  	"form_success_text" varchar,
  	"err_name" varchar,
  	"err_email" varchar,
  	"err_message" varchar,
  	"err_generic" varchar,
  	"close" varchar,
  	"previous" varchar,
  	"next" varchar,
  	"skip_to_content" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL
  );
  
  CREATE TABLE "home_highlights_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"hero_title" varchar DEFAULT 'Overcharge' NOT NULL,
  	"hero_tag" varchar DEFAULT '#9483',
  	"side_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_locales" (
  	"cta_text" varchar DEFAULT 'Takımımıza katılmak ister misin?',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "about_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_paragraphs_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "about_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_rankings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL
  );
  
  CREATE TABLE "about_rankings_locales" (
  	"title" varchar NOT NULL,
  	"result" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_teams" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_teams_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"who_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_locales" (
  	"lead" varchar,
  	"tagline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "navigation_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "resources_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "resources_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "robots_events" ADD CONSTRAINT "robots_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."robots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "robots_events_locales" ADD CONSTRAINT "robots_events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."robots_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "robots_awards" ADD CONSTRAINT "robots_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."robots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "robots_awards_locales" ADD CONSTRAINT "robots_awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."robots_awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "robots_videos" ADD CONSTRAINT "robots_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."robots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "robots_videos_locales" ADD CONSTRAINT "robots_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."robots_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "robots" ADD CONSTRAINT "robots_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "robots" ADD CONSTRAINT "robots_season_photo_id_media_id_fk" FOREIGN KEY ("season_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_images_locales" ADD CONSTRAINT "gallery_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_robots_fk" FOREIGN KEY ("robots_id") REFERENCES "public"."robots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sponsors_fk" FOREIGN KEY ("sponsors_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_images_fk" FOREIGN KEY ("gallery_images_id") REFERENCES "public"."gallery_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_light_id_media_id_fk" FOREIGN KEY ("favicon_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_text_locales" ADD CONSTRAINT "ui_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_highlights" ADD CONSTRAINT "home_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_highlights_locales" ADD CONSTRAINT "home_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_side_image_id_media_id_fk" FOREIGN KEY ("side_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_paragraphs" ADD CONSTRAINT "about_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_paragraphs_locales" ADD CONSTRAINT "about_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_stats" ADD CONSTRAINT "about_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_stats_locales" ADD CONSTRAINT "about_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_rankings" ADD CONSTRAINT "about_rankings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_rankings_locales" ADD CONSTRAINT "about_rankings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_rankings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_teams" ADD CONSTRAINT "about_teams_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_teams_locales" ADD CONSTRAINT "about_teams_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_who_image_id_media_id_fk" FOREIGN KEY ("who_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_locales" ADD CONSTRAINT "about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_rels" ADD CONSTRAINT "about_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_rels" ADD CONSTRAINT "about_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_links" ADD CONSTRAINT "navigation_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_links_locales" ADD CONSTRAINT "navigation_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation" ADD CONSTRAINT "navigation_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_links" ADD CONSTRAINT "resources_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_links_locales" ADD CONSTRAINT "resources_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources_links"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "robots_events_order_idx" ON "robots_events" USING btree ("_order");
  CREATE INDEX "robots_events_parent_id_idx" ON "robots_events" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "robots_events_locales_locale_parent_id_unique" ON "robots_events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "robots_events_locales_parent_id_idx" ON "robots_events_locales" USING btree ("_parent_id");
  CREATE INDEX "robots_awards_order_idx" ON "robots_awards" USING btree ("_order");
  CREATE INDEX "robots_awards_parent_id_idx" ON "robots_awards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "robots_awards_locales_locale_parent_id_unique" ON "robots_awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "robots_awards_locales_parent_id_idx" ON "robots_awards_locales" USING btree ("_parent_id");
  CREATE INDEX "robots_videos_order_idx" ON "robots_videos" USING btree ("_order");
  CREATE INDEX "robots_videos_parent_id_idx" ON "robots_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "robots_videos_locales_locale_parent_id_unique" ON "robots_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "robots_videos_locales_parent_id_idx" ON "robots_videos_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "robots_slug_idx" ON "robots" USING btree ("slug");
  CREATE INDEX "robots_image_idx" ON "robots" USING btree ("image_id");
  CREATE INDEX "robots_season_photo_idx" ON "robots" USING btree ("season_photo_id");
  CREATE INDEX "robots_updated_at_idx" ON "robots" USING btree ("updated_at");
  CREATE INDEX "robots_created_at_idx" ON "robots" USING btree ("created_at");
  CREATE INDEX "sponsors_logo_idx" ON "sponsors" USING btree ("logo_id");
  CREATE INDEX "sponsors_updated_at_idx" ON "sponsors" USING btree ("updated_at");
  CREATE INDEX "sponsors_created_at_idx" ON "sponsors" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_seo_seo_image_idx" ON "posts" USING btree ("seo_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_locales_parent_id_idx" ON "posts_locales" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_image_idx" ON "_posts_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_locales_parent_id_idx" ON "_posts_v_locales" USING btree ("_parent_id");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_locales_parent_id_idx" ON "products_locales" USING btree ("_parent_id");
  CREATE INDEX "gallery_images_image_idx" ON "gallery_images" USING btree ("image_id");
  CREATE INDEX "gallery_images_updated_at_idx" ON "gallery_images" USING btree ("updated_at");
  CREATE INDEX "gallery_images_created_at_idx" ON "gallery_images" USING btree ("created_at");
  CREATE UNIQUE INDEX "gallery_images_locales_locale_parent_id_unique" ON "gallery_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "gallery_images_locales_parent_id_idx" ON "gallery_images_locales" USING btree ("_parent_id");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_robots_id_idx" ON "payload_locked_documents_rels" USING btree ("robots_id");
  CREATE INDEX "payload_locked_documents_rels_sponsors_id_idx" ON "payload_locked_documents_rels" USING btree ("sponsors_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_images_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_images_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_favicon_light_idx" ON "site_settings" USING btree ("favicon_light_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ui_text_locales_locale_parent_id_unique" ON "ui_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_text_locales_parent_id_idx" ON "ui_text_locales" USING btree ("_parent_id");
  CREATE INDEX "home_highlights_order_idx" ON "home_highlights" USING btree ("_order");
  CREATE INDEX "home_highlights_parent_id_idx" ON "home_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_highlights_locales_locale_parent_id_unique" ON "home_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_highlights_locales_parent_id_idx" ON "home_highlights_locales" USING btree ("_parent_id");
  CREATE INDEX "home_hero_image_idx" ON "home" USING btree ("hero_image_id");
  CREATE INDEX "home_side_image_idx" ON "home" USING btree ("side_image_id");
  CREATE UNIQUE INDEX "home_locales_locale_parent_id_unique" ON "home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_locales_parent_id_idx" ON "home_locales" USING btree ("_parent_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_media_id_idx" ON "home_rels" USING btree ("media_id");
  CREATE INDEX "about_paragraphs_order_idx" ON "about_paragraphs" USING btree ("_order");
  CREATE INDEX "about_paragraphs_parent_id_idx" ON "about_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_paragraphs_locales_locale_parent_id_unique" ON "about_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_paragraphs_locales_parent_id_idx" ON "about_paragraphs_locales" USING btree ("_parent_id");
  CREATE INDEX "about_stats_order_idx" ON "about_stats" USING btree ("_order");
  CREATE INDEX "about_stats_parent_id_idx" ON "about_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_stats_locales_locale_parent_id_unique" ON "about_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_stats_locales_parent_id_idx" ON "about_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "about_rankings_order_idx" ON "about_rankings" USING btree ("_order");
  CREATE INDEX "about_rankings_parent_id_idx" ON "about_rankings" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_rankings_locales_locale_parent_id_unique" ON "about_rankings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_rankings_locales_parent_id_idx" ON "about_rankings_locales" USING btree ("_parent_id");
  CREATE INDEX "about_teams_order_idx" ON "about_teams" USING btree ("_order");
  CREATE INDEX "about_teams_parent_id_idx" ON "about_teams" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_teams_locales_locale_parent_id_unique" ON "about_teams_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_teams_locales_parent_id_idx" ON "about_teams_locales" USING btree ("_parent_id");
  CREATE INDEX "about_hero_image_idx" ON "about" USING btree ("hero_image_id");
  CREATE INDEX "about_who_image_idx" ON "about" USING btree ("who_image_id");
  CREATE UNIQUE INDEX "about_locales_locale_parent_id_unique" ON "about_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_locales_parent_id_idx" ON "about_locales" USING btree ("_parent_id");
  CREATE INDEX "about_rels_order_idx" ON "about_rels" USING btree ("order");
  CREATE INDEX "about_rels_parent_idx" ON "about_rels" USING btree ("parent_id");
  CREATE INDEX "about_rels_path_idx" ON "about_rels" USING btree ("path");
  CREATE INDEX "about_rels_media_id_idx" ON "about_rels" USING btree ("media_id");
  CREATE INDEX "navigation_links_order_idx" ON "navigation_links" USING btree ("_order");
  CREATE INDEX "navigation_links_parent_id_idx" ON "navigation_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_links_locales_locale_parent_id_unique" ON "navigation_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_links_locales_parent_id_idx" ON "navigation_links_locales" USING btree ("_parent_id");
  CREATE INDEX "navigation_logo_idx" ON "navigation" USING btree ("logo_id");
  CREATE INDEX "resources_links_order_idx" ON "resources_links" USING btree ("_order");
  CREATE INDEX "resources_links_parent_id_idx" ON "resources_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "resources_links_locales_locale_parent_id_unique" ON "resources_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "resources_links_locales_parent_id_idx" ON "resources_links_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "robots_events" CASCADE;
  DROP TABLE "robots_events_locales" CASCADE;
  DROP TABLE "robots_awards" CASCADE;
  DROP TABLE "robots_awards_locales" CASCADE;
  DROP TABLE "robots_videos" CASCADE;
  DROP TABLE "robots_videos_locales" CASCADE;
  DROP TABLE "robots" CASCADE;
  DROP TABLE "sponsors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "gallery_images" CASCADE;
  DROP TABLE "gallery_images_locales" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "ui_text" CASCADE;
  DROP TABLE "ui_text_locales" CASCADE;
  DROP TABLE "home_highlights" CASCADE;
  DROP TABLE "home_highlights_locales" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_locales" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "about_paragraphs" CASCADE;
  DROP TABLE "about_paragraphs_locales" CASCADE;
  DROP TABLE "about_stats" CASCADE;
  DROP TABLE "about_stats_locales" CASCADE;
  DROP TABLE "about_rankings" CASCADE;
  DROP TABLE "about_rankings_locales" CASCADE;
  DROP TABLE "about_teams" CASCADE;
  DROP TABLE "about_teams_locales" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "about_locales" CASCADE;
  DROP TABLE "about_rels" CASCADE;
  DROP TABLE "navigation_links" CASCADE;
  DROP TABLE "navigation_links_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "resources_links" CASCADE;
  DROP TABLE "resources_links_locales" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_sponsors_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_contact_messages_topic";
  DROP TYPE "public"."enum_contact_messages_status";`)
}
