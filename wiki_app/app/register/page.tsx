import { register } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Créer un compte</h1>
          <p className="text-gray-500 mt-2">Rejoignez le Wiki pour publier vos articles.</p>
        </div>

        <form action={register} className="space-y-4">
          <div>
            <Label htmlFor="email" required>Email</Label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full p-2 mt-1 border rounded-md bg-transparent dark:border-zinc-700"
              placeholder="votre@email.com"
            />
          </div>
          
          <div>
            <Label htmlFor="password" required>Mot de passe</Label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full p-2 mt-1 border rounded-md bg-transparent dark:border-zinc-700"
            />
          </div>

          <Button type="submit" className="w-full">S'inscrire</Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          <Link href="/" className="hover:underline">← Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  );
}