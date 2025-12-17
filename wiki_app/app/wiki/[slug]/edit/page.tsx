import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { updateArticle } from '@/lib/actions'; // On importe la nouvelle action
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Récupérer l'article existant pour pré-remplir le formulaire
  const result = await db.select().from(articles).where(eq(articles.slug, slug));
  const article = result[0];

  if (!article) notFound();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Modifier : {article.title}</h1>
      
      <form action={updateArticle} className="space-y-6">
        {/* Champ caché pour passer l'ID à l'action serveur */}
        <input type="hidden" name="id" value={article.id} />

        <div>
          <Label htmlFor="title" required>Titre de l'article</Label>
          <input
            name="title"
            id="title"
            required
            defaultValue={article.title} // Pré-remplissage
            className="w-full p-2 border rounded-md bg-transparent dark:border-zinc-700"
          />
        </div>
        
        <div>
          <Label htmlFor="content" required>Contenu</Label>
          <textarea
            name="content"
            id="content"
            required
            rows={15}
            defaultValue={article.content} // Pré-remplissage
            className="w-full p-2 border rounded-md bg-transparent font-mono dark:border-zinc-700"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit">Enregistrer les modifications</Button>
          <Button variant="secondary" formAction={async () => { 'use server'; }}>
            {/* Lien simple pour annuler via un bouton HTML */}
            <a href={`/wiki/${slug}`} className="no-underline text-inherit">Annuler</a>
          </Button>
        </div>
      </form>
    </div>
  );
}