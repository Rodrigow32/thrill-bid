import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES, useStore, type Category } from "@/lib/store";
import { AuctionCard, AuctionDetail } from "@/components/auction";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "centavo. — Leilões de centavos ao vivo" },
      { name: "description", content: "Dispute produtos premium a partir de R$ 0,00. Cada lance soma centavos e reinicia o cronômetro." },
      { property: "og:title", content: "centavo. — Leilões de centavos ao vivo" },
      { property: "og:description", content: "Dispute produtos premium a partir de R$ 0,00 em leilões de centavos em tempo real." },
    ],
  }),
  component: Vitrine,
});

function Vitrine() {
  const items = useStore((s) => s.items);
  const [cat, setCat] = useState<Category | "todos">("todos");
  const [sel, setSel] = useState<string | null>(null);
  const visible = items.filter((i) => ["ativo", "agendado"].includes(i.status) && (cat === "todos" || i.category === cat));
  const selected = items.find((i) => i.id === sel);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-urgent/10 px-3 py-1 text-xs font-semibold text-urgent">
          <span className="h-2 w-2 rounded-full bg-urgent animate-blink" /> AO VIVO · {items.filter((i) => i.status === "ativo").length} leilões
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Produtos premium.<br />Por centavos.</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">Cada lance soma R$ 0,01 e reinicia o relógio. O último lance antes do zero leva.</p>
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className={cn("rounded-full border px-4 py-2 text-sm transition", cat === c.id ? "bg-foreground text-background" : "hover:bg-muted")}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <div className={cn("grid flex-1 gap-5 sm:grid-cols-2", selected ? "lg:grid-cols-2" : "lg:grid-cols-3 xl:grid-cols-4")}>
          {visible.map((i) => <AuctionCard key={i.id} item={i} selected={i.id === sel} onOpen={() => setSel(i.id)} />)}
          {visible.length === 0 && <p className="col-span-full py-16 text-center text-muted-foreground">Nenhum leilão nesta categoria agora.</p>}
        </div>
        {selected && (
          <aside className="fixed inset-0 z-50 overflow-y-auto bg-background p-4 lg:sticky lg:top-20 lg:z-0 lg:h-[calc(100vh-6rem)] lg:w-[440px] lg:shrink-0 lg:rounded-2xl lg:border lg:p-5">
            <button onClick={() => setSel(null)} className="mb-3 ml-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /> Fechar</button>
            <AuctionDetail item={selected} compact />
          </aside>
        )}
      </div>
    </div>
  );
}
