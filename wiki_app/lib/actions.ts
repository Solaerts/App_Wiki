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

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Vérification basique
  if (!email || !password) {
    return; // Ou gérer l'erreur
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await db.select().from(users).where(eq(users.email, email));
  if (existingUser.length > 0) {
    // L'utilisateur existe déjà
    return; 
  }

  // Création de l'utilisateur
  // NOTE: En production, il faut TOUJOURS hacher le mot de passe (ex: avec bcrypt)
  // Ici on le stocke en clair pour la simplicité de l'exercice.
  await db.insert(users).values({ 
    email, 
    password 
  });

  console.log("Compte créé pour :", email);
  
  // Redirection vers l'accueil après inscription
  redirect('/');
}

export async function updateArticle(formData: FormData) {
  const id = Number(formData.get('id'));
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  // On régénère le slug au cas où le titre change
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  await db.update(articles)
    .set({ 
      title, 
      slug, 
      content, 
      updatedAt: new Date() // On met à jour la date
    })
    .where(eq(articles.id, id));

  revalidatePath('/'); // Rafraîchir l'accueil
  revalidatePath(`/wiki/${slug}`); // Rafraîchir la page de l'article
  redirect(`/wiki/${slug}`);
}