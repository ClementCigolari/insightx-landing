"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function Connexion() {
  const router = useRouter();

  // UI / form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  // states
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("ix_last_email");
    if (saved) setEmail(saved);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const mail = email.trim();
    if (!mail || !password) {
      setError("Veuillez saisir votre e-mail et votre mot de passe.");
      return;
    }

    setLoading(true);
    try {
      // 1) Auth Supabase
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: mail,
        password,
      });
      if (authError) {
        console.error("Supabase Auth error:", authError.message);
        setError("❌ Identifiants incorrects.");
        setLoading(false);
        return;
      }

      // 2) Lookup dans ta base (ENVOI AVEC password)
      const res = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mail, password }),
      });

      if (!res.ok) {
        const t = await res.text();
        console.error("Réponse NON OK :", res.status, t);
        setError("Erreur côté serveur : " + res.status);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.success && data.user) {
        const { email: e2, prenom, formule, ligue, options, niveau_acces } = data.user;

        // mémoriser email si demandé
        if (remember) localStorage.setItem("ix_last_email", mail);
        else localStorage.removeItem("ix_last_email");

        // 3) Stocker le profil léger côté front
        localStorage.setItem(
          "insightx_user",
          JSON.stringify({
            email: e2,
            prenom,
            formule,
            ligue,
            options: options || "Aucune",
            niveau_acces,
          })
        );

        setInfo("✅ Connexion réussie. Redirection…");
        // 4) Redirection
        if (niveau_acces === "superadmin") router.push("/superadmin");
        else router.push("/espace-client");
      } else {
        setError(data.message || "❌ Une erreur est survenue.");
      }
    } catch (err) {
      console.error("Erreur attrapée :", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/10 text-white placeholder-white/50 px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent";

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* halo / brand */}
        <div
          aria-hidden
          className="mx-auto mb-6 h-16 w-64 rounded-full bg-gradient-to-r from-emerald-400/20 via-white/10 to-emerald-400/20 blur-2xl"
        />
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,.45)] p-6 sm:p-8"
        >
          {/* badge */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide">
              Espace membre
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold">
              Connexion Insight-X
            </h1>
            <p className="mt-2 text-white/70 text-sm">
              Accède à tes analyses SAFE/FUN & fil rouge.
            </p>
          </div>

          {/* erreurs / infos */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="text-red-200">{error}</p>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="text-red-300 hover:text-red-200"
                  aria-label="Fermer l'erreur"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          {info && (
            <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              {info}
            </div>
          )}

          {/* champs */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/80">E-mail</label>
              <input
                type="email"               // ✅ type email
                autoComplete="email"
                className={inputClass}
                placeholder="exemple@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm text-white/80">
                Mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={inputClass}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-9 text-white/60 hover:text-white"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm mt-1">
              <label className="inline-flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-white/30 bg-white/10 text-emerald-400 focus:ring-emerald-400"
                />
                <span className="text-white/80">Se souvenir de moi</span>
              </label>

              <button
                type="button"
                onClick={async () => {
                  setError("");
                  if (!email) {
                    setError("⚠️ Entrez votre e-mail avant de demander la réinitialisation.");
                    return;
                  }
                  const { error } = await supabase.auth.resetPasswordForEmail(
                    email.trim(),
                    { redirectTo: `${window.location.origin}/reset-password` }
                  );
                  if (error) {
                    setError("❌ Impossible d'envoyer l’e-mail de réinitialisation.");
                  } else {
                    setInfo("📧 Un e-mail de réinitialisation vient d’être envoyé.");
                  }
                }}
                className="text-white/70 hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full rounded-xl px-4 py-3 font-semibold transition
              ${loading ? "bg-white/10 text-white/60 cursor-wait" : "bg-emerald-400 text-black hover:bg-emerald-300"}`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-3">
                <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Connexion en cours…
              </span>
            ) : (
              "Se connecter"
            )}
          </button>

          {/* mentions */}
          <div className="mt-4 flex items-center justify-between text-xs text-white/60">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="underline underline-offset-2"
            >
              Retour à l’accueil
            </button>
            <div className="inline-flex items-center gap-1">
              <Shield size={14} className="opacity-70" />
              Paiement sécurisé via Stripe • Données protégées (RGPD)
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}