import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// ✅ Clé secrète Stripe via .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export async function POST(req: NextRequest) {
  try {
    const { priceIds, client } = await req.json();

    if (!priceIds || priceIds.length === 0) {
      return NextResponse.json({ error: "Aucun produit sélectionné" }, { status: 400 });
    }

    // Étape 1 : on compte combien de fois chaque priceId apparaît
const itemCount: Record<string, number> = {};
for (const id of priceIds) {
  itemCount[id] = (itemCount[id] || 0) + 1;
}

// Étape 2 : on construit line_items avec quantité correcte
const line_items = Object.entries(itemCount).map(([price, quantity]) => ({
  price,
  quantity,
}));

// Et dans stripe.checkout.sessions.create :
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "subscription",
  line_items,
  success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/merci`,
  cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/inscription`,
  customer_email: client.email,
  metadata: {
    nom: client.nom,
    prenom: client.prenom,
    identifiant: client.identifiant,
  },
});

return NextResponse.json({ url: session.url });
} catch (err: unknown) {
  let message = "Erreur inconnue";

  if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === "string") {
    message = err;
  }

  console.error("Erreur Stripe :", message);
  return NextResponse.json({ error: message }, { status: 500 });
}
}