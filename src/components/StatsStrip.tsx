export default function StatsStrip() {
    const Item = ({ big, small }: { big: string; small: string }) => (
      <div className="flex flex-col items-center">
        <div className="text-xl font-bold sm:text-2xl">{big}</div>
        <div className="text-xs text-white/70 sm:text-sm">{small}</div>
      </div>
    );
  
    return (
      <section className="bg-neutral-900 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-6 sm:grid-cols-4">
          <Item big="71%" small="SAFE validés (août)" />
          <Item big="V7" small="Méthode séquentielle" />
          <Item big="5" small="Grands championnats" />
          <Item big="4,99€" small="Essai mensuel sans engagement" />
        </div>
      </section>
    );
  }