import Sidebar from "@/components/Sidebar";

export default function EspaceClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-black text-white">
        {children}
      </main>
    </div>
  );
}