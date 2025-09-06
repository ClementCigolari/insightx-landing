import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-black text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-14 text-center">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Prêt à ouvrir les yeux sur tes soirées foot ?
        </h2>
        <p className="max-w-2xl text-white/80">
          Accède aux analyses SAFE, FUN et Scénarios. Le fil rouge de chaque journée.
          Essaie aujourd’hui, annule quand tu veux.
        </p>
        <Link
          href="#pricing"
          className="rounded-xl bg-white px-6 py-3 font-semibold text-black shadow hover:opacity-90"
        >
          Choisir ma formule
        </Link>
      </div>
    </section>
  );
}