import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload } from "lucide-react";
import { actions, brl, CATEGORIES, useStore, type Category } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/parceiro")({
  head: () => ({
    meta: [
      { title: "Painel do parceiro — centavo." },
      { name: "description", content: "Cadastre itens para leilão e acompanhe status e receita de arremates." },
      { property: "og:title", content: "Painel do parceiro — centavo." },
      { property: "og:description", content: "Cadastre itens e acompanhe seus leilões." },
    ],
  }),
  component: Page,
});

const STATUS: Record<string, [string, string]> = {
  pendente: ["Pendente", "bg-muted text-muted-foreground"],
  aprovado: ["Aprovado", "bg-secondary"],
  agendado: ["Aprovado · agendado", "bg-secondary"],
  ativo: ["Em leilão", "bg-urgent/15 text-urgent"],
  leiloado: ["Leiloado", "bg-foreground text-background"],
};
const input = "w-full rounded-lg border bg-background px-3 py-2 text-sm";

function Page() {
  const items = useStore((s) => s.items.filter((i) => i.partner === "TechStore"));
  const [f, setF] = useState({ title: "", description: "", marketValue: "", category: "geral" as Category, image: "" });
  const revenue = items.reduce((a, i) => a + (i.finalPrice ?? 0), 0);

  const onFile = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setF((x) => ({ ...x, image: String(r.result) }));
    r.readAsDataURL(file);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title || !f.image) return;
    actions.submitItem({ ...f, marketValue: Number(f.marketValue) || 0 });
    setF({ title: "", description: "", marketValue: "", category: "geral", image: "" });
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[380px_1fr]">
      <form onSubmit={submit} className="space-y-3 rounded-2xl border p-5 h-fit">
        <h2 className="text-lg font-semibold">Cadastrar item</h2>
        <label className="flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed text-sm text-muted-foreground">
          {f.image ? <img src={f.image} alt="" className="h-full w-full object-cover" /> : <><Upload className="mb-1 h-5 w-5" /> Imagem ou GIF</>}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        <input className={input} placeholder="Título" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <textarea className={input} rows={3} placeholder="Descrição comercial" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <input className={input} type="number" placeholder="Valor de mercado (R$)" value={f.marketValue} onChange={(e) => setF({ ...f, marketValue: e.target.value })} />
        <select className={input} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Category })}>
          {CATEGORIES.filter((c) => c.id !== "todos").map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <button className="w-full rounded-xl bg-foreground py-3 font-semibold text-background">Enviar como rascunho</button>
      </form>

      <div>
        <div className="mb-4 flex items-end justify-between">
          <h1 className="text-3xl font-bold">Meus itens</h1>
          <div className="text-right"><div className="text-xs text-muted-foreground">Receita de arremates</div><div className="text-2xl font-bold">{brl(revenue)}</div></div>
        </div>
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-4 rounded-xl border p-3">
              <img src={i.image} alt={i.title} className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0"><div className="font-semibold truncate">{i.title}</div><div className="text-xs text-muted-foreground">Mercado {brl(i.marketValue)}</div></div>
              {i.status === "leiloado" && <div className="text-sm">Arremate: <b>{brl(i.finalPrice ?? 0)}</b></div>}
              <span className={cn("rounded-full px-3 py-1 text-xs font-medium", STATUS[i.status][1])}>{STATUS[i.status][0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
