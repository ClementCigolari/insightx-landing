import Hero from "@/components/Hero";
import Method from "@/components/Method";
import Team from "@/components/Team";
import Formules from "@/components/Formules";
import Competitions from "@/components/Competitions"; // 👈 Ajouté ici
import Teaser from "@/components/Teaser";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <Method />
      <Team />
      <Formules />
      <Competitions /> {/* 👈 Ajouté ici */}
      <Teaser />
      <Contact />
    </main>
  );
}