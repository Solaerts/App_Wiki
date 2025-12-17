import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

// Table des utilisateurs
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // En production, hachez ce mot de passe !
  createdAt: timestamp('created_at').defaultNow(),
});

// Table des articles (Wiki pages)
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(), // URL conviviale (ex: /wiki/mon-sujet)
  content: text('content').notNull(), // Contenu principal (Markdown ou HTML)
  authorId: integer('author_id').references(() => users.id),
  updatedAt: timestamp('updated_at').defaultNow(),
});