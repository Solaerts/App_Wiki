import Link from 'next/link';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { Button } from '@/components/ui/Button';

export default async function Home() {
  const allArticles = await db.select().from(articles);

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold">WikiApp</h1>
        <div className="space-x-4">
          <Link href="/create"><Button>Créer un article</Button></Link>
          {/* Ajoute ce lien vers la page register */}
          <Link href="/register"><Button variant="secondary">S'inscrire</Button></Link>
        </div>
      </header>

      <section className="grid gap-6">
        {allArticles.map((article) => (
          <Link key={article.id} href={`/wiki/${article.slug}`} className="block group">
            <article className="p-6 border rounded-lg hover:border-black dark:border-gray-800 dark:hover:border-white transition-colors">
              <h2 className="text-2xl font-semibold mb-2 group-hover:underline">{article.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                {article.content.substring(0, 150)}...
              </p>
            </article>
          </Link>
        ))}
        
        {allArticles.length === 0 && (
          <p className="text-center text-gray-500">Aucun article pour le moment. Soyez le premier à écrire !</p>
        )}
      </section>
    </main>
  );
}