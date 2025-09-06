"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Method() {
  const items = [
    "🔍 Enjeu du match – Motivation, objectifs concrets et contexte émotionnel.",
    "📊 Statistiques brutes – Données terrain : buts, possession, tirs, périodes clés.",
    "🔥 Forme & H2H – Dynamiques récentes + historique des confrontations.",
    "🧠 Joueurs clés – Analyse des titulaires, stats individuelles & rôles décisifs.",
    "🧮 Lecture croisée – Synthèse stratégique et recommandations personnalisées.",
    "⚡️ Le Match Fil Rouge – Chaque journée, Insight-X sélectionne LE match le plus intense pour vibrer comme jamais !",
  ];

  return (
    <section
      id="methode"
      className="relative isolate scroll-mt-[160px] py-20 sm:py-24"
    >
      {/* BG image — inline style to avoid Tailwind purge */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-cover bg-center opacity-55"
        style={{ backgroundImage: "url('/method-bg.jpg')" }}
      />
      {/* Readability: soft vignette */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-black/25 to-black/80"
      />
      {/* Title glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 inset-x-0 h-56 -z-10
                   bg-[radial-gradient(60%_60%_at_50%_0%,rgba(34,197,94,0.22),transparent_60%),
                       radial-gradient(45%_45%_at_75%_10%,rgba(59,130,246,0.18),transparent_55%)]"
      />

      <div className="mx-auto max-w-4xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: -14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          className="text-center text-3xl sm:text-4xl font-extrabold"
        >
          🚀 La Méthode V7 : <span className="text-white/90">ton nouveau terrain de jeu</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mt-3 text-center text-lg sm:text-xl text-white/85"
        >
          Chaque match, décodé en{" "}
          <span className="text-green-400 font-bold">7 secondes chrono</span>. Clair. Structuré. Efficace.
        </motion.p>

        <ul className="mt-10 space-y-5 text-left max-w-2xl mx-auto">
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.08 * i, duration: 0.35 }}
              className="rounded-2xl border border-white/12 bg-black/50 backdrop-blur-sm
                         px-5 py-4 text-base sm:text-lg text-white/92 shadow-[0_6px_18px_rgba(0,0,0,0.28)]"
            >
              {item}
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.5, duration: 0.35 }}
          className="mt-10 text-center"
        >
          <Link
            href="#pricing"
            className="inline-block rounded-xl bg-green-500 px-8 py-4 font-bold text-black
                       shadow-lg hover:scale-105 active:scale-100 transition"
          >
            Découvrir les formules →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}