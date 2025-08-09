import { NextResponse } from "next/server";
import { transporter } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = `
Nouvelle demande de changement de formule Insight-X :

📧 Email : ${body.email}
🧾 Nouvelle formule : ${body.formule} (${body.plan})
🏟️ Championnat choisi : ${body.league}
🎯 Options demandées : ${
  body.formule === "decouverte"
    ? "Aucune"
    : body.options?.length > 0
    ? body.options.join(", ")
    : "Aucune"
}
💰 Prix affiché : ${body.prix}

👉 À traiter manuellement : mettre à jour la BDD, Stripe si nécessaire, et prévenir le client si besoin.
`;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: "contact@insight-x.fr",
      subject: "Changement de formule demandé",
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur changement-manuel:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}