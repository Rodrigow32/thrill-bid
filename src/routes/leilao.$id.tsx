import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { AuctionDetail } from "@/components/auction";
import { useVisitorAccess } from "@/components/VisitorAccess";
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";

export const Route = createFileRoute("/leilao/$id")({
  head: () => ({
    meta: [
      { title: "Leilão ao vivo — Thrill Bid" },
      { name: "description", content: "Acompanhe a disputa em tempo real e dê seu lance antes do cronômetro zerar." },
      { property: "og:title", content: "Leilão ao vivo — Thrill Bid" },
      { property: "og:description", content: "Acompanhe a disputa em tempo real e dê seu lance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const { signedIn, requestAccess } = useVisitorAccess();
  const item = useStore((s) => s.items.find((i) => i.id === id));
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Voltar à vitrine</Link>
      <div className="mt-4">{!signedIn ? <div className="space-y-4 py-12 text-center"><LockKeyhole className="mx-auto size-8 text-primary" /><h1 className="text-xl font-semibold">Cadastre-se para ver</h1><Button onClick={() => requestAccess()}>Cadastro de Usuário</Button></div> : item ? <AuctionDetail item={item} /> : <p>Leilão não encontrado (os dados de demonstração são recriados ao recarregar).</p>}</div>
    </div>
  );
}
