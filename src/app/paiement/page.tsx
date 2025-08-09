"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";

export default function PaiementPage() {
  const router = useRouter();
  const { priceIds, donneesClient } = useCheckout();

  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceIds,
            client: donneesClient,
          }),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url; // Redirection vers Stripe Checkout
        } else {
          console.error("Erreur : pas d’URL retour de Stripe");
        }
      } catch (error) {
        console.error("Erreur lors de la création de la session :", error);
      }
    };

    if (priceIds.length > 0) {
      createCheckoutSession();
    } else {
      router.push("/inscription"); // Redirige si aucune formule n’est sélectionnée
    }
  }, [priceIds, donneesClient, router]);

  return (
    <main className="flex items-center justify-center h-screen">
      <p className="text-xl font-medium">⏳ Redirection vers le paiement sécurisé...</p>
    </main>
  );
}