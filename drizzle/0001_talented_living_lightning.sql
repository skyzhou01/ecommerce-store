CREATE TYPE "public"."product_badge" AS ENUM('New', 'Limited');--> statement-breakpoint
CREATE TABLE "category" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"image_alt" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"color" text NOT NULL,
	"price_cents" integer NOT NULL,
	"image_url" text NOT NULL,
	"image_alt" text NOT NULL,
	"details" text[] DEFAULT '{}'::text[] NOT NULL,
	"badge" "product_badge",
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_slug_unique" UNIQUE("slug"),
	CONSTRAINT "product_price_cents_check" CHECK ("product"."price_cents" >= 0)
);
--> statement-breakpoint
CREATE TABLE "product_image" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_image_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer NOT NULL,
	"url" text NOT NULL,
	"alt" text NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "product_image_position_unique" UNIQUE("product_id","position")
);
--> statement-breakpoint
CREATE TABLE "product_size" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_size_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer NOT NULL,
	"label" text NOT NULL,
	"position" integer NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	CONSTRAINT "product_size_label_unique" UNIQUE("product_id","label")
);
--> statement-breakpoint
CREATE TABLE "product_stock" (
	"product_id" integer PRIMARY KEY NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_stock_quantity_check" CHECK ("product_stock"."quantity" >= 0)
);
--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_image" ADD CONSTRAINT "product_image_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_size" ADD CONSTRAINT "product_size_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_stock" ADD CONSTRAINT "product_stock_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_category_id_idx" ON "product" USING btree ("category_id");