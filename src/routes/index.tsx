import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CalendarDays, Gavel, Search, X } from "lucide-react";
import { CATEGORIES, useStore, type Category, type Item } from "@/lib/store";
import { AuctionDetail } from "@/components/auction";
import { HomeAuctionCard } from "@/components/HomeAuctionCard";
import { PartnerCarousel } from "@/components/PartnerCarousel";
import { useVisitorAccess } from "@/components/VisitorAccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Thrill Bid — Leilões ao vivo e agendados" },
    { name: "description", content: "Explore produtos, acompanhe leilões ao vivo e descubra os próximos arremates no Thrill Bid." },
    { property: "og:title", content: "Thrill Bid — Leilões ao vivo e agendados" },
    { property: "og:description", content: "Seu próximo arremate está no Thrill Bid. Confira leilões ativos e agendados." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <ClientOnly fallback={<div className="mx-auto max-w-7xl px-5 py-12 text-muted-foreground">Carregando leilões…</div>}><Vitrine /></ClientOnly>,
});
function Vitrine() {
  const items = useStore(s => s.items);
  const { signedIn, requestAccess } = useVisitorAccess();
  const [cat, setCat] = useState<Category | "todos">("todos");
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const [reminders, setReminders] = useState<string[]>([]);
  const filtered = items.filter(i => (cat === "todos" || i.category === cat) && i.title.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")));
  const active = filtered.filter(i => i.status === "ativo");
  const scheduled = filtered.filter(i => i.status === "agendado");
  const selected = signedIn ? items.find(i => i.id === sel) : undefined;
  const open = (item: Item) => { if (!signedIn) { requestAccess(); return; } setSel(item.id); };
  const remind = (item: Item) => { if (!signedIn) { requestAccess(); return; } setReminders(r => r.includes(item.id) ? r.filter(id => id !== item.id) : [...r, item.id]); };
  function cards(list: Item[]) { return list.map(item => <HomeAuctionCard key={item.id} item={item} guest={!signedIn} onOpen={() => open(item)} onRemind={() => remind(item)} reminded={reminders.includes(item.id)} />); }
  return <>
    <main className="mx-auto max-w-7xl px-5 pb-12 pt-7 lg:px-8">
      <PartnerCarousel />
      <section className="pb-5 pt-9">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="mb-2 text-[10px] font-semibold uppercase text-primary">PEQUENOS LANCES. GRANDES CONQUISTAS.</p><h1 className="text-3xl font-semibold sm:text-4xl">Encontre seu próximo arremate<span className="text-primary">.</span></h1><p className="mt-2 text-sm text-muted-foreground">Produtos que você deseja. Oportunidades que surpreendem.</p></div>
          <span className="flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-xs text-live"><span className="size-1.5 rounded-full bg-live" />{items.filter(i => i.status === "ativo").length} leilões ao vivo</span>
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b pb-5">
          <div className="flex flex-wrap gap-1.5">{CATEGORIES.map(c => <Button key={c.id} variant="ghost" onClick={() => setCat(c.id)} className={cn("h-8 px-3 text-xs", cat === c.id ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "text-muted-foreground")}>{c.label}</Button>)}</div>
          <div className="relative w-full sm:w-56"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar um produto" aria-label="Buscar um produto" className="bg-card pl-9 text-xs" /></div>
        </div>
      </section>
      <div className="flex items-start gap-6">
        <div className="min-w-0 flex-1">
          <section aria-labelledby="ativos-title"><div className="mb-5 flex items-center gap-2"><Gavel className="size-5 text-primary" /><h2 id="ativos-title" className="text-xl font-semibold">Leilões ativos</h2><span className="ml-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-primary">{active.length}</span><span className="ml-auto hidden text-xs text-muted-foreground sm:block">A disputa acontece agora</span></div><div className={cn("grid gap-5 sm:grid-cols-2", selected ? "xl:grid-cols-2" : "lg:grid-cols-3 xl:grid-cols-4")}>{cards(active)}</div>{!active.length && <p className="py-12 text-center text-sm text-muted-foreground">Nenhum leilão ativo encontrado.</p>}</section>
          <section id="agendados" className="scroll-mt-5 pt-10" aria-labelledby="agendados-title"><div className="mb-5 flex items-center gap-2"><CalendarDays className="size-5 text-primary" /><h2 id="agendados-title" className="text-xl font-semibold">Vem por aí</h2><span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-primary">Agendados</span><span className="ml-auto hidden text-xs text-muted-foreground sm:block">Reserve um lugar na próxima disputa</span></div><div className={cn("grid gap-5 sm:grid-cols-2", selected ? "xl:grid-cols-2" : "lg:grid-cols-3 xl:grid-cols-4")}>{cards(scheduled)}</div>{!scheduled.length && <p className="py-12 text-center text-sm text-muted-foreground">Nenhum leilão agendado encontrado.</p>}<p aria-live="polite" className="mt-4 text-xs text-muted-foreground">{reminders.length > 0 && signedIn ? "Lembretes marcados nesta demonstração; nenhuma notificação será enviada." : ""}</p></section>
        </div>
        {selected && <aside className="fixed inset-0 z-40 overflow-y-auto bg-background p-5 lg:sticky lg:top-5 lg:z-0 lg:max-h-[calc(100vh-3rem)] lg:w-[400px] lg:shrink-0 lg:rounded-lg lg:border"><Button variant="ghost" onClick={() => setSel(null)} className="mb-3 ml-auto flex"><X />Fechar</Button><AuctionDetail item={selected} compact /></aside>}
      </div>
    </main>
    <footer className="border-t bg-card"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-7 lg:px-8"><span className="text-lg font-bold">Thrill Bid<span className="text-primary">.</span></span><p className="text-xs text-muted-foreground">Cada lance, uma nova possibilidade.</p><Button variant="ghost" onClick={() => requestAccess(true)} className="text-xs text-muted-foreground">Sua loja por aqui<ArrowRight /></Button></div></footer>
  </>;
}
