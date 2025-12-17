import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Fonction utilitaire pour parser sommairement le markdown (titres uniquement)
function parseContent(content: string) {
  const lines = content.split('\n');
  const toc: { id: string; text: string; level: number }[] = [];
  
  const html = lines.map((line, index) => {
    if (line.startsWith('# ')) {
      const text = line.replace('# ', '');
      const id = `section-${index}`;
      toc.push({ id, text, level: 1 });
      return `<h1 id="${id}" class="text-3xl font-bold mt-8 mb-4">${text}</h1>`;
    }
    if (line.startsWith('## ')) {
      const text = line.replace('## ', '');
      const id = `section-${index}`;
      toc.push({ id, text, level: 2 });
      return `<h2 id="${id}" class="text-2xl font-semibold mt-6 mb-3">${text}</h2>`;
    }
    return `<p class="mb-4 leading-relaxed">${line}</p>`;
  }).join('');

  return { html, toc };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const result = await db.select().from(articles).where(eq(articles.slug, slug));
  const article = result[0];

  if (!article) notFound();

  const { html, toc } = parseContent(article.content);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar: Table des matières */}
      <aside className="w-full md:w-64 bg-gray-50 dark:bg-zinc-900 p-6 border-r border-gray-200 dark:border-gray-800 h-auto md:h-screen sticky top-0 overflow-y-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-8 block">← Retour à l'accueil</Link>
        
        <h3 className="font-bold text-lg mb-4 uppercase text-gray-500 text-sm tracking-wider">Sommaire</h3>
        <nav className="space-y-2">
          {toc.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`}
              className={`block hover:text-blue-500 text-sm ${item.level === 1 ? 'font-medium' : 'pl-4 text-gray-500'}`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8 md:p-16 max-w-4xl">
        <h1 className="text-5xl font-black mb-2">{article.title}</h1>
        <div className="text-gray-500 mb-8 border-b pb-4">
          Dernière modification : {article.updatedAt?.toLocaleDateString()}
        </div>
        
        {/* Rendu du contenu */}
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }} 
        />
      </main>
    </div>
  );
}