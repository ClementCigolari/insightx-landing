"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-center py-4">
      <p>
        &copy; {new Date().getFullYear()} Insight-X. Tous droits réservés. |{" "}
        <Link href="/mentions-legales" className="underline hover:text-white">
          Mentions légales
        </Link>{" "}
        |{" "}
        <Link href="/cgv" className="underline hover:text-white">
          Conditions Générales de Vente
        </Link>
      </p>
    </footer>
  );
}