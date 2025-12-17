import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';

// Petit utilitaire pour transformer le markdown en HTML simple
function parseContent(content: string) {
  const lines = content.split('\n');
  const toc: { id: string; text: string; level: number }[] = [];
  
  const html = lines.map((line, index) => {
    // Titres H1 (#)
    if (line.startsWith('# ')) {
      const text = line.replace('# ', '').trim();
      const id = `section-${index}`;
      toc.push({ id, text, level: 1 });
      return `<h1 id="${id}" class="text-3xl font-bold mt-8 mb-4">${text}</h1>`;
    }
    // Titres H2 (##)
    if (line.startsWith('## ')) {
      const text = line.replace('## ', '').trim();
      const id = `section-${index}`;
      toc.push({ id, text, level: 2 });
      return `<h2 id="${id}" class="text-2xl font-semibold mt-6 mb-3">${text}</h2>`;
    }
    // Paragraphes vides
    if (line.trim() === '') return '<br/>';
    // Paragraphes normaux
    return `<p class="mb-4 leading-relaxed">${line}</p>`;
  }).join('');

  return { html, toc };
}

// NOTE : Le type de props a changé en Next.js 15
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  // ⚠️ ÉTAPE CRUCIALE : Il faut attendre la résolution des paramètres
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  console.log("Recherche de l'article avec le slug :", slug); // Pour le débogage

  // Récupération de l'article
  const result = await db.select().from(articles).where(eq(articles.slug, slug));
  const article = result[0];

  // Si l'article n'existe pas, on déclenche la 404
  if (!article) {
    notFound();
  }

  const { html, toc } = parseContent(article.content);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-black text-black dark:text-zinc-50">
      {/* Sidebar : Sommaire */}
      <aside className="w-full md:w-64 bg-zinc-50 dark:bg-zinc-900 p-6 border-r border-zinc-200 dark:border-zinc-800 md:h-screen md:sticky md:top-0 overflow-y-auto">
        <Link href="/" className="inline-flex items-center text-sm text-zinc-500 hover:text-black dark:hover:text-white mb-8 transition-colors">
          ← Retour à l'accueil
        </Link>
        
        <h3 className="font-bold text-xs uppercase text-zinc-400 mb-4 tracking-wider">
          Dans cet article
        </h3>
        
        <nav className="space-y-1">
          {toc.length > 0 ? toc.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`}
              className={`block text-sm py-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400
                ${item.level === 1 ? 'font-medium text-zinc-900 dark:text-zinc-200' : 'pl-4 text-zinc-500 dark:text-zinc-400'}`}
            >
              {item.text}
            </a>
          )) : (
            <p className="text-xs text-zinc-400 italic">Aucun sommaire</p>
          )}
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8 md:p-12 max-w-4xl mx-auto w-full">
        <header className="mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-start">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{article.title}</h1>
                
                {/* BOUTON MODIFIER ICI */}
                <Link href={`/wiki/${slug}/edit`}>
                <Button variant="secondary" className="text-sm">Modifier</Button>
                </Link>
            </div>
            
            <div className="flex items-center text-sm text-zinc-500">
                <span>Mis à jour le {article.updatedAt ? new Date(article.updatedAt).toLocaleDateString() : "Date inconnue"}</span>
            </div>
        </header>
        
        <div 
          className="prose prose-zinc dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: html }} 
        />
      </main>
    </div>
  );
}