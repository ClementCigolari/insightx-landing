"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newPass, setNewPass] = useState("");

  useEffect(() => {
    const run = async () => {
      setErrorMsg(null);

      // 1) Essaye d’échanger le hash si présent (#access_token=…)
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        const { error } = await supabase.auth.exchangeCodeForSession(hash);
        if (error) {
          // on n’affiche pas d’erreur tout de suite, on check la session
          console.warn("exchangeCodeForSession:", error.message);
        } else {
          // on nettoie l’URL (enlève le hash moche)
          history.replaceState({}, "", window.location.pathname);
        }
      }

      // 2) Vérifie la session (recovery en place = OK pour changer le mdp)
      const { data: { session } } = await supabase.auth.getSession();
      setHasSession(!!session);

      // 3) Si pas de hash ET pas de session → vrai lien invalide
      if ((!hash || !hash.includes("access_token")) && !session) {
        setErrorMsg("Lien invalide ou expiré.");
      }

      setReady(true);
    };
    run();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) {
      setErrorMsg("Impossible de changer le mot de passe.");
      return;
    }
    alert("Mot de passe changé. Tu peux te reconnecter.");
    window.location.href = "/connexion";
  };

  if (!ready) return <p className="text-white text-center py-10">Chargement…</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={onSubmit} className="bg-[#0D1117] p-8 rounded-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-semibold mb-6 text-center">Réinitialisation du mot de passe</h1>

        {errorMsg && !hasSession && (
          <div className="bg-red-800 p-3 rounded-md mb-4">
            <p className="text-sm font-semibold">{errorMsg}</p>
          </div>
        )}

        <label className="block mb-2">Nouveau mot de passe</label>
        <input
          type="password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
          className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 mb-4"
        />

        <button
          type="submit"
          disabled={!hasSession}
          className="w-full bg-white text-black py-2 rounded-md font-semibold disabled:opacity-50"
          title={!hasSession ? "Ouvre d'abord le lien depuis l'email" : ""}
        >
          Changer le mot de passe
        </button>
      </form>
    </div>
  );
}