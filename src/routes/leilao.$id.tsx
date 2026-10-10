import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { AuctionDetail } from "@/components/auction";

export const Route = createFileRoute("/leilao/$id")({
  head: () => ({
    meta: [
      { title: "Leilão ao vivo — centavo." },
      { name: "description", content: "Acompanhe a disputa em tempo real e dê seu lance antes do cronômetro zerar." },
      { property: "og:title", content: "Leilão ao vivo — centavo." },
      { property: "og:description", content: "Acompanhe a disputa em tempo real e dê seu lance." },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const item = useStore((s) => s.items.find((i) => i.id === id));
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Voltar à vitrine</Link>
      <div className="mt-4">{item ? <AuctionDetail item={item} /> : <p>Leilão não encontrado (os dados de demonstração são recriados ao recarregar).</p>}</div>
    </div>
  );
}
