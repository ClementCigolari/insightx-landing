import Link from "next/link";
import Image from "next/image";

interface ChampionnatCardProps {
  nom: string;
  code: string;
  name: string;
  logo: string;
  href: string;
}

export default function ChampionnatCard({ name, logo, href }: ChampionnatCardProps) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer shadow-md w-40 h-40">
        <div className="w-20 h-20 flex items-center justify-center mb-2">
          <Image
            src={logo}
            alt={name}
            width={80} // largeur en px
            height={80} // hauteur en px
            className="object-contain w-full h-full"
          />
        </div>
        <span className="text-white text-sm text-center">{name}</span>
      </div>
    </Link>
  );
}