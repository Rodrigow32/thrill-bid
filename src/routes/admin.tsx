import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { actions, brl, catLabel, CATEGORIES, useStore, type Category, type Item } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Gestão — Thrill Bid" },
      { name: "description", content: "Aprovação, agendamento de leilões e relatórios gerais." },
      { property: "og:title", content: "Gestão — Thrill Bid" },
      { property: "og:description", content: "Aprovação, agendamento e relatórios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const input = "rounded-lg border bg-background px-2 py-1.5 text-sm";

function Scheduler({ item }: { item: Item }) {
  const def = new Date(Date.now() + 60_000 - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const [dt, setDt] = useState(def);
  const [inc, setInc] = useState("0.01");
  const [cat, setCat] = useState<Category>(item.category);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border p-3">
      <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
      <div className="mr-auto font-semibold">{item.title}</div>
      <input type="datetime-local" className={input} value={dt} onChange={(e) => setDt(e.target.value)} />
      <input type="number" step="0.01" className={`${input} w-20`} value={inc} onChange={(e) => setInc(e.target.value)} />
      <select className={input} value={cat} onChange={(e) => setCat(e.target.value as Category)}>
        {CATEGORIES.filter((c) => c.id !== "todos").map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <button onClick={() => actions.schedule(item.id, new Date(dt).getTime(), Number(inc) || 0.01, cat)} className="rounded-lg bg-foreground px-3 py-1.5 text-sm text-background">Agendar</button>
      <button onClick={() => { actions.schedule(item.id, Date.now(), Number(inc) || 0.01, cat); actions.startNow(item.id); }} className="rounded-lg bg-urgent px-3 py-1.5 text-sm text-urgent-foreground">Iniciar já</button>
    </div>
  );
}

function Page() {
  const items = useStore((s) => s.items);
  const bp = useStore((s) => s.bidsPurchased);
  const pr = useStore((s) => s.planRevenue);
  const pk = useStore((s) => s.packRevenue);
  const pending = items.filter((i) => i.status === "pendente");
  const approved = items.filter((i) => i.status === "aprovado");
  const scheduled = items.filter((i) => i.status === "agendado");
  const done = items.filter((i) => i.status === "leiloado");
  const totalClicks = items.reduce((a, i) => a + i.bids.length, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <h1 className="text-3xl font-bold">Gestão</h1>
      <div className="grid gap-4 sm:grid-cols-4">
        {[["Lances comprados", bp.toLocaleString("pt-BR")], ["Receita de planos", brl(pr)], ["Receita de pacotes", brl(pk)], ["Cliques registrados", totalClicks.toLocaleString("pt-BR")]].map(([l, v]) => (
          <div key={l} className="rounded-2xl border p-5"><div className="text-xs text-muted-foreground">{l}</div><div className="mt-1 text-2xl font-bold">{v}</div></div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Aprovação ({pending.length})</h2>
        <div className="space-y-3">
          {pending.map((i) => (
            <div key={i.id} className="flex items-center gap-4 rounded-xl border p-3">
              <img src={i.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1"><div className="font-semibold">{i.title}</div><div className="text-xs text-muted-foreground">{i.partner} · {catLabel(i.category)} · {brl(i.marketValue)}</div><div className="text-xs line-clamp-1">{i.description}</div></div>
              <button onClick={() => actions.approve(i.id)} className="rounded-lg bg-foreground px-4 py-2 text-sm text-background">Aprovar</button>
            </div>
          ))}
          {pending.length === 0 && <p className="text-sm text-muted-foreground">Nada pendente.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-xl font-semibold">Agendamento</h2>
        <p className="mb-3 text-xs text-muted-foreground">Data/hora de início · incremento por clique (R$) · categoria restrita</p>
        <div className="space-y-3">
          {approved.map((i) => <Scheduler key={i.id} item={i} />)}
          {approved.length === 0 && <p className="text-sm text-muted-foreground">Nenhum item aprovado aguardando agenda.</p>}
          {scheduled.map((i) => (
            <div key={i.id} className="flex justify-between rounded-xl bg-muted p-3 text-sm"><span>{i.title}</span><span>Início {new Date(i.startsAt!).toLocaleString("pt-BR")} · +{brl(i.increment)}</span></div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Leilões finalizados</h2>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs text-muted-foreground"><tr><th className="p-3 text-left">Item</th><th className="text-left">Ganhador oficial</th><th className="text-left">Último timestamp</th><th className="text-left">Lances</th><th className="p-3 text-right">Arremate</th></tr></thead>
            <tbody>
              {done.map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="p-3">{i.title}</td><td className="font-semibold">{i.winner}</td>
                  <td className="font-mono text-xs">{i.bids[0] ? new Date(i.bids[0].ts).toISOString() : "—"}</td>
                  <td>{i.bids.length}</td><td className="p-3 text-right">{brl(i.finalPrice ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
