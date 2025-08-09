'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientHeader() {
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkConnection = () => {
      const user = localStorage.getItem("insightx_user");
      setIsConnected(!!user);
    };

    checkConnection(); // À l'initialisation

    const handleStorageChange = () => checkConnection();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🌀 En bonus : vérification régulière dans cette même tab
  useEffect(() => {
    const interval = setInterval(() => {
      const user = localStorage.getItem("insightx_user");
      setIsConnected(!!user);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("insightx_user");
    setIsConnected(false);
    router.push("/"); // ou router.refresh() si tu veux juste recharger la page
  };

  return (
    <div className="w-full flex justify-end items-center px-6 py-4">
      {isConnected ? (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-white px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0V7a3 3 0 016 0v1"
            />
          </svg>
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      ) : (
        <Link
          href="/connexion"
          className="flex items-center gap-2 rounded-full border border-white px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A9.004 9.004 0 0012 21a9.003 9.003 0 006.879-3.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="hidden sm:inline">Connexion</span>
        </Link>
      )}
    </div>
  );
}