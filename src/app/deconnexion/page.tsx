// app/deconnexion/page.tsx
export default function Deconnexion() {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">🚫 Accès refusé</h1>
        <p className="text-lg text-white">
         Bien tenté... mais chez Insight-X, chaque mouvement laisse une trace.<br />
         On t’a vu prendre un raccourci — sauf qu’ici, le chemin est balisé.<br /><br />
         Déconnecté. Mais pas banni.<br />
         Reviens par la grande porte, elle est toujours ouverte pour les joueurs clean.
        </p>
      </div>
    );
  }