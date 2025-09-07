"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* BACKGROUND: zoom progressif */}
      <motion.div
        aria-hidden
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 18, ease: "easeOut" }}
        style={{ backgroundImage: "url('/hero-stade.jpg')" }}
        className="absolute inset-0 bg-cover bg-center"
      />
      {/* OVERLAY: gradient pour lisibilité */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* CONTENT */}
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-3xl text-center">

          {/* Badge */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs tracking-wide uppercase"
          >
            <span className="text-green-400">71% SAFE validés</span>
            <span className="text-white/70">— Août</span>
          </motion.p>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl"
          >
            Arrête de jouer à l’aveugle 👀
            <br />
            <span className="text-white/90">
              Avec Insight-X, chaque match devient lisible.
            </span>
          </motion.h1>

          {/* Sous-texte */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 text-base text-white/80 sm:text-lg"
          >
            Données, signaux, scénarios. Une méthode claire (V7) pour faire des
            choix de matchs <strong>sereins</strong>. Essaie dès <strong>4,99 €</strong>.
          </motion.p>

          {/* Boutons */}
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.7 }}
  className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto"
>
  {/* CTA principal */}
  <motion.div
    initial={{ scale: 1 }}
    animate={{ scale: [1, 1.06, 1] }}
    transition={{ delay: 2, duration: 1.2, repeat: 2 }}
    className="w-full sm:w-auto"
  >
    <Link
      href="#pricing"
      className="w-full block text-center px-8 py-4 bg-green-500 text-black font-bold text-lg rounded-xl shadow-lg 
                 animate-pulse hover:scale-105 hover:shadow-green-500/50 transition-all duration-300"
    >
      Commencer dès 4,99 €
    </Link>
  </motion.div>

  {/* Second CTA */}
  <Link
    href="#methode"
    className="w-full sm:w-auto block text-center rounded-xl border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
  >
    Voir la méthode V7
  </Link>
</motion.div>

          {/* Confiance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-6 text-xs text-white/60"
          >
            Paiement 100% sécurisé via Stripe · Sans engagement · Annulable à tout moment
          </motion.div>
        </div>
      </div>
    </section>
  );
}