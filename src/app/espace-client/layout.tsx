import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default function EspaceClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav mobile (bouton burger + drawer) */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Conteneur principal */}
      <div className="flex">
        {/* Sidebar desktop seulement */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Contenu */}
        <main
          className={
            // un peu d'espace en haut sur mobile car le bouton burger est en fixe
            "flex-1 p-4 sm:p-6 md:p-8 w-full pt-16 md:pt-8"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}