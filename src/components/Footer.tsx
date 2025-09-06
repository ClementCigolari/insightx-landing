"use client";


export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-white/70">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Insight-X. Tous droits réservés.</p>

          <nav className="flex flex-wrap items-center justify-center gap-4">
            <a href="/mentions-legales" className="hover:text-white">Mentions légales</a>
            <span className="opacity-40">•</span>
            <a href="/conditions" className="hover:text-white">Conditions Générales de Vente</a>
            <span className="opacity-40">•</span>
            <a href="mailto:contact@insight-x.fr" className="hover:text-white">contact@insight-x.fr</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}