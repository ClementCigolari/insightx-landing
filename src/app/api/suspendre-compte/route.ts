import { NextResponse } from "next/server";
import { transporter } from "@/lib/email";

export async function POST(req: Request) {
  const { email } = await req.json();

  const message = `
Demande de suspension de compte Insight-X :

📧 Email : ${email}

🕐 La suspension doit être appliquée à la date anniversaire de l’abonnement mensuel.

👉 À traiter manuellement.
`;

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: "contact@insight-x.fr",
      subject: "Suspension de compte demandée",
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur envoi mail suspension :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}