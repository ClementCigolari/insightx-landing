"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      console.log("Tentative de login avec :", email, password);
  
      // Étape 1 : Connexion sécurisée avec Supabase
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
  
      if (authError) {
        console.error("Erreur Supabase Auth :", authError.message);
        setError("❌ Identifiants incorrects.");
        return;
      }
  
      // Étape 2 : Récupération des infos dans ta base à toi (Supabase Users)
      const res = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Réponse NON OK :", res.status, errorText);
        setError("Erreur côté serveur : " + res.status);
        return;
      }
  
      const data = await res.json();
      console.log("Données JSON :", data);
  
      if (data.success && data.user) {
        const { email, prenom, formule, ligue, options, niveau_acces } = data.user;
  
        // Étape 3 : Stockage de ton insightx_user pour l'affichage
        localStorage.setItem(
          "insightx_user",
          JSON.stringify({
            email,
            prenom,
            formule,
            ligue,
            options: options || "Aucune",
            niveau_acces,
          })
        );
  
        // Étape 4 : Redirection logique
        if (niveau_acces === "superadmin") {
          router.push("/superadmin");
        } else {
          router.push("/espace-client");
        }
      } else {
        setError(data.message || "❌ Une erreur est survenue.");
      }
    } catch (err) {
      console.error("Erreur attrapée :", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0D1117] p-8 rounded-2xl w-full max-w-md shadow-lg border border-gray-700"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Connexion à votre espace Insight-X
        </h1>

        {error && (
          <div className="bg-red-800 p-3 rounded-md mb-4 relative">
            <p className="text-sm font-semibold">{error}</p>
            <button
              type="button"
              className="absolute top-1 right-2 text-white"
              onClick={() => setError("")}
            >
              ✕
            </button>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        <div className="mb-4 relative">
          <label className="block mb-1">Mot de passe</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex justify-between items-center mb-6 text-sm">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-gray-400 hover:underline"
          >
            Retour à l&apos;accueil
          </button>
          <button
  type="button"
  onClick={async () => {
    if (!email) {
      setError("⚠️ Veuillez entrer votre email avant de demander une réinitialisation.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password` // Lien cliquable dans l'email
    });

    if (error) {
      console.error("Erreur reset password :", error.message);
      setError("❌ Impossible d'envoyer l'email de réinitialisation.");
    } else {
      alert("📧 Un email de réinitialisation vient de vous être envoyé.");
    }
  }}
  className="text-gray-400 hover:underline"
>
  Mot de passe oublié ?
</button>
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black py-2 rounded-md hover:bg-gray-200 font-semibold transition"
        >
          Connexion
        </button>
      </form>
    </div>
  );
}