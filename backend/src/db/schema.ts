import {
  integer,
  uuid,
  timestamp,
  text,
  boolean,
  jsonb,
  pgTable,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export type OrderStatus = "pending" | "paid" | "cancelled";
export type UserRole = "admin" | "customer" | "support";

export type CheckoutSessionLine = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  name: text("display_name").notNull(),
  email: text("email").notNull().default(""),
  role: text("role").$type<UserRole>().notNull().default("customer"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull().default("general"),
  price: integer("price_cents").notNull(),
  description: text("description").notNull().default(""),
  currency: text("currency").notNull().default("USD"),
  imageUrl: text("image_url"),
  // imagekit integration fieldsfielf for deletes:
  imagekitFileId: text("imagekit_file_id"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const checkoutSessions = pgTable("checkout_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  //  cascade = deleat children when parent is deleated; restrict = do not deleat the parent if any child still points at it.
  polarCheckoutId: text("polar_checkout_id").unique(),
  lines: jsonb("lines").$type<CheckoutSessionLine[]>().notNull(),
  totalPrice: integer("total_price").notNull(),
  currency: text("currency").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").$type<OrderStatus>().notNull().default("pending"),
  polarCheckoutId: text("polar_checkout_id"),
  polarOrderId: text("polar_order_id").unique(),
  totalPrice: integer("total_price").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
});

// various Relations

// a user can have many orders over time.
export const usersRelations = relations(users, ({ many }) => ({
  orderItems: many(orderItems),
}));

// A user can have many orders over time.
export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

// checkout sessions relation.
export const checkoutSessionsRelations = relations(
  checkoutSessions,
  ({ one }) => ({
    user: one(users, {
      fields: [checkoutSessions.userId],
      references: [users.id],
    }),
  }),
);

// each order belongs to exactly one user; each other can have many line items.
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}));

// each line item is for exactly one order and one product
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
