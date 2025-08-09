"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserMinimal = {
  email: string;
  adresse?: string | null;
};

export default function ModifierInfos({ user }: { user: UserMinimal }) {
  const router = useRouter();
  const [email, setEmail] = useState<string>(user.email || "");
  const [adresse, setAdresse] = useState<string>(user.adresse ?? "");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const ancienEmail = user.email;
    const payload: {
      ancienEmail: string;
      nouvelEmail?: string;
      nouvelleAdresse?: string;
    } = { ancienEmail };

    if (email && email !== ancienEmail) payload.nouvelEmail = email;
    if (adresse) payload.nouvelleAdresse = adresse;

    try {
      const res = await fetch("/api/modifier-utilisateur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: { success?: boolean; message?: string } = await res.json();

      if (data.success) {
        setMessage("Informations mises à jour. Redirection en cours...");
        localStorage.removeItem("insightx_user");
        setTimeout(() => {
          router.push("/connexion");
        }, 2000);
      } else {
        setMessage(data.message || "Erreur lors de la mise à jour.");
      }
    } catch (err) {
      setMessage("Une erreur est survenue. Réessaie dans un instant.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
      <div>
        <label className="block text-sm mb-1">Nouvel email</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-300"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Nouvelle adresse</label>
        <input
          type="text"
          value={adresse}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdresse(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-300"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Mise à jour..." : "Valider les modifications"}
      </button>

      {message && <p className="text-sm mt-2 text-center">{message}</p>}
    </form>
  );
}