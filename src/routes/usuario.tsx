import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Trophy, Zap } from "lucide-react";
import { actions, brl, useStore, ME_NAME } from "@/lib/store";

export const Route = createFileRoute("/usuario")({
  head: () => ({
    meta: [
      { title: "Minha carteira — Thrill Bid" },
      { name: "description", content: "Saldo de lances, planos, arremates e histórico de participação." },
      { property: "og:title", content: "Minha carteira — Thrill Bid" },
      { property: "og:description", content: "Saldo de lances, planos e arremates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const PACKS = [{ q: 50, p: 25 }, { q: 150, p: 65 }, { q: 500, p: 199 }];

function Page() {
  const wallet = useStore((s) => s.wallet);
  const plan = useStore((s) => s.plan);
  const items = useStore((s) => s.items);
  const won = items.filter((i) => i.status === "leiloado" && i.winner === ME_NAME);
  const part = items.filter((i) => i.bids.some((b) => b.user === ME_NAME));
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <h1 className="text-3xl font-bold">Painel do usuário</h1>
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-foreground p-6 text-background md:col-span-2">
          <div className="text-sm opacity-70">Carteira de lances</div>
          <div className="mt-1 text-5xl font-bold">Você tem {wallet} lances</div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {PACKS.map((k) => (
              <button key={k.q} onClick={() => actions.buyPack(k.q, k.p)} className="rounded-xl bg-background/10 p-4 text-left transition hover:bg-background/20">
                <div className="flex items-center gap-1 font-bold"><Zap className="h-4 w-4 text-urgent" /> +{k.q} lances</div>
                <div className="text-sm opacity-70">{brl(k.p)}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border p-6">
          <div className="text-sm text-muted-foreground">Plano ativo</div>
          <div className="mt-1 flex items-center gap-2 text-2xl font-bold">{plan === "pago" && <Crown className="h-5 w-5 text-urgent" />}{plan === "pago" ? "Premium" : "Gratuito"}</div>
          <p className="mt-2 text-sm text-muted-foreground">{plan === "pago" ? "200 lances/mês inclusos." : "10 lances inclusos no cadastro. O Premium oferece 200 lances mensais."}</p>
          {plan === "gratuito" && <button onClick={actions.subscribe} className="mt-4 w-full rounded-xl bg-urgent py-3 font-semibold text-urgent-foreground">Assinar por {brl(49.9)}/mês</button>}
        </div>
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold"><Trophy className="h-5 w-5" /> Meus Arremates</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {won.map((i) => (
            <div key={i.id} className="flex gap-3 rounded-xl border p-3">
              <img src={i.image} alt={i.title} className="h-16 w-16 rounded-lg object-cover" />
              <div><div className="font-semibold">{i.title}</div><div className="text-sm text-muted-foreground">Arrematado por {brl(i.finalPrice ?? 0)} · valor {brl(i.marketValue)}</div></div>
            </div>
          ))}
          {won.length === 0 && <p className="text-sm text-muted-foreground">Nenhum arremate ainda.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Histórico de Participação</h2>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs text-muted-foreground"><tr><th className="p-3 text-left">Item</th><th className="text-left">Meus lances</th><th className="text-left">Status</th><th className="p-3 text-right">Preço</th></tr></thead>
            <tbody>
              {part.map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="p-3"><Link to="/leilao/$id" params={{ id: i.id }} className="underline">{i.title}</Link></td>
                  <td>{i.bids.filter((b) => b.user === ME_NAME).length}</td>
                  <td>{i.status === "leiloado" ? (i.winner === ME_NAME ? "Venceu" : "Perdeu") : "Em disputa"}</td>
                  <td className="p-3 text-right">{brl(i.price)}</td>
                </tr>
              ))}
              {part.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Dê um lance na vitrine para começar.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
