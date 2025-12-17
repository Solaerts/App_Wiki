import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Fonction pour parser le markdown (titres uniquement pour le sommaire)
function parseContent(content: string) {
  const lines = content.split('\n');
  const toc: { id: string; text: string; level: number }[] = [];
  
  const html = lines.map((line, index) => {
    // Gestion simple des titres
    if (line.startsWith('# ')) {
      const text = line.replace('# ', '').trim();
      const id = `section-${index}`;
      toc.push({ id, text, level: 1 });
      return `<h1 id="${id}" class="text-3xl font-bold mt-8 mb-4">${text}</h1>`;
    }
    if (line.startsWith('## ')) {
      const text = line.replace('## ', '').trim();
      const id = `section-${index}`;
      toc.push({ id, text, level: 2 });
      return `<h2 id="${id}" class="text-2xl font-semibold mt-6 mb-3">${text}</h2>`;
    }
    // Paragraphes simples
    if (line.trim() === '') return '<br/>';
    return `<p class="mb-4 leading-relaxed">${line}</p>`;
  }).join('');

  return { html, toc };
}

// NOTEZ BIEN : params est une Promise ici
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. On attend que les paramètres soient résolus (Spécifique Next.js 15)
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 2. On cherche l'article
  const result = await db.select().from(articles).where(eq(articles.slug, slug));
  const article = result[0];

  // 3. Si pas d'article, on renvoie une 404
  if (!article) {
    notFound();
  }

  const { html, toc } = parseContent(article.content);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-black text-black dark:text-zinc-50">
      {/* Sidebar: Sommaire */}
      <aside className="w-full md:w-64 bg-gray-50 dark:bg-zinc-900 p-6 border-r border-gray-200 dark:border-zinc-800 md:h-screen md:sticky md:top-0 overflow-y-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-8 block font-medium">
          ← Retour
        </Link>
        
        <h3 className="font-bold text-lg mb-4 uppercase text-gray-500 text-sm tracking-wider">Sommaire</h3>
        <nav className="space-y-2">
          {toc.length > 0 ? toc.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`}
              className={`block hover:text-blue-500 text-sm transition-colors ${item.level === 1 ? 'font-medium' : 'pl-4 text-gray-500'}`}
            >
              {item.text}
            </a>
          )) : <p className="text-sm text-gray-400 italic">Aucun sommaire détecté</p>}
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8 md:p-16 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-4">{article.title}</h1>
        <div className="text-gray-500 dark:text-gray-400 mb-8 border-b dark:border-zinc-800 pb-4 text-sm">
          Dernière modification : {article.updatedAt ? new Date(article.updatedAt).toLocaleDateString() : 'Inconnue'}
        </div>
        
        {/* Affichage du contenu HTML généré */}
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }} 
        />
      </main>
    </div>
  );
}