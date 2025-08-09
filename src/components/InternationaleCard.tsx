import Link from "next/link";

interface InternationaleCardProps {
  name: string;
  logo: string;
  href: string;
}

export default function InternationaleCard({ name, logo, href }: InternationaleCardProps) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer shadow-md w-40 h-40">
        <div className="w-20 h-20 flex items-center justify-center mb-2">
          <img src={logo} alt={name} className="object-contain w-full h-full" />
        </div>
        <span className="text-white text-sm text-center">{name}</span>
      </div>
    </Link>
  );
}