/**
 * Catalog tables: categories, products and their stock, gallery images and
 * size runs. Kept apart from the Better Auth generated `schema.ts` so
 * regenerating auth tables never overwrites them; both are re-exported from
 * `tables.ts`.
 */
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const productBadge = pgEnum("product_badge", ["New", "Limited"]);

export const category = pgTable("category", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  /** Tile image; categories without one are not shown as homepage tiles. */
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  position: integer("position").notNull().default(0),
  ...timestamps,
});

export const product = pgTable(
  "product",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    slug: text("slug").notNull().unique(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    color: text("color").notNull(),
    /** Price in USD cents. */
    priceCents: integer("price_cents").notNull(),
    /** Primary image, used on cards and first in the gallery. */
    imageUrl: text("image_url").notNull(),
    imageAlt: text("image_alt").notNull(),
    details: text("details")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    badge: productBadge("badge"),
    position: integer("position").notNull().default(0),
    ...timestamps,
  },
  (table) => [
    index("product_category_id_idx").on(table.categoryId),
    check("product_price_cents_check", sql`${table.priceCents} >= 0`),
  ],
);

/** Units on hand, one row per product (no per-size quantities yet). */
export const productStock = pgTable(
  "product_stock",
  {
    productId: integer("product_id")
      .primaryKey()
      .references(() => product.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(0),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [check("product_stock_quantity_check", sql`${table.quantity} >= 0`)],
);

/** Additional gallery images (detail crops) shown on the product page. */
export const productImage = pgTable(
  "product_image",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    productId: integer("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt").notNull(),
    position: integer("position").notNull(),
  },
  (table) => [unique("product_image_position_unique").on(table.productId, table.position)],
);

/** Size run for apparel/shoes; one-size products have no rows. */
export const productSize = pgTable(
  "product_size",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    productId: integer("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    position: integer("position").notNull(),
    available: boolean("available").notNull().default(true),
  },
  (table) => [unique("product_size_label_unique").on(table.productId, table.label)],
);

export const categoryRelations = relations(category, ({ many }) => ({
  products: many(product),
}));

export const productRelations = relations(product, ({ one, many }) => ({
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  stock: one(productStock),
  images: many(productImage),
  sizes: many(productSize),
}));

export const productStockRelations = relations(productStock, ({ one }) => ({
  product: one(product, {
    fields: [productStock.productId],
    references: [product.id],
  }),
}));

export const productImageRelations = relations(productImage, ({ one }) => ({
  product: one(product, {
    fields: [productImage.productId],
    references: [product.id],
  }),
}));

export const productSizeRelations = relations(productSize, ({ one }) => ({
  product: one(product, {
    fields: [productSize.productId],
    references: [product.id],
  }),
}));
