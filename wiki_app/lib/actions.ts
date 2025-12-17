'use server'

import { db } from '@/db';
import { articles, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Création d'un article
export async function createArticle(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  // Générer un slug simple (ex: "Mon Titre" -> "mon-titre")
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  await db.insert(articles).values({
    title,
    slug,
    content,
    // Pour l'exemple, on met un ID auteur arbitraire ou null si non géré
    authorId: 1, 
  });

  revalidatePath('/');
  redirect(`/wiki/${slug}`);
}

// Inscription rapide (simulée)
export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  await db.insert(users).values({ email, password });
  redirect('/');
}