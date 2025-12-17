import { createArticle } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

export default function CreatePage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Nouvel Article</h1>
      <form action={createArticle} className="space-y-6">
        <div>
          <Label htmlFor="title" required>Titre de l'article</Label>
          <input
            name="title"
            id="title"
            required
            className="w-full p-2 border rounded-md bg-transparent"
            placeholder="Ex: L'Histoire de l'informatique"
          />
        </div>
        
        <div>
          <Label htmlFor="content" required>Contenu</Label>
          <p className="text-sm text-gray-500 mb-2">Utilisez # pour les titres principaux et ## pour les sous-titres.</p>
          <textarea
            name="content"
            id="content"
            required
            rows={15}
            className="w-full p-2 border rounded-md bg-transparent font-mono"
            placeholder="# Introduction&#10;Votre texte ici...&#10;&#10;## Section 1&#10;Détails..."
          />
        </div>

        <Button type="submit">Publier l'article</Button>
      </form>
    </div>
  );
}