import { Bell, Check, Clock3, LockKeyhole, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Timer } from "@/components/auction";
import { brl, catLabel, type Item } from "@/lib/store";

export function HomeAuctionCard({ item, guest, onOpen, reminded, onRemind }: { item: Item; guest: boolean; onOpen: () => void; reminded?: boolean; onRemind: () => void }) {
  const scheduled = item.status === "agendado";
  const date = item.startsAt ? new Date(item.startsAt) : null;
  return <article className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
    <Button variant="ghost" onClick={onOpen} className="relative block aspect-[4/3] h-auto w-full overflow-hidden rounded-none bg-muted p-0" aria-label={`Abrir ${item.title}`}>
      <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      <span className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold ${scheduled ? "bg-card/95 text-foreground" : "bg-live-soft text-live"}`}>{scheduled ? <Clock3 className="size-3" /> : <span className="size-1.5 rounded-full bg-live" />}{scheduled ? "AGENDADO" : "AO VIVO"}</span>
      <span className="absolute bottom-3 left-3 rounded-md bg-card/95 px-2 py-1 text-[10px] font-medium text-foreground">{catLabel(item.category)}</span>
    </Button>
    <div className="p-4">
      <p className="mb-1 text-[11px] text-muted-foreground">{item.partner}</p>
      <Button variant="ghost" onClick={onOpen} className="h-auto w-full justify-start whitespace-normal p-0 text-left text-base font-semibold hover:bg-transparent">{item.title}</Button>
      <p className="mt-1 text-xs text-muted-foreground">Valor de mercado <span className="line-through">{brl(item.marketValue)}</span></p>
      <div className="my-4 border-t" />
      {scheduled ? <div className="mb-4 flex items-center gap-2.5"><div className="grid size-9 place-items-center rounded-md bg-secondary text-primary"><Clock3 className="size-4" /></div><div><p className="text-[10px] text-muted-foreground">Início do leilão</p><p className="text-xs font-semibold">{date?.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} · {date?.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p></div></div> : <div className="mb-4 flex h-10 items-center justify-between gap-2"><div><p className="text-[10px] text-muted-foreground">Lance atual</p>{guest ? <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><LockKeyhole className="size-3.5" /> Cadastre-se para ver</span> : <p className="text-xl font-bold text-primary">{brl(item.price)}</p>}</div><div className="text-right"><p className="text-[10px] text-muted-foreground">Encerra em</p><Timer item={item} /></div></div>}
      {scheduled && guest && <p className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground"><LockKeyhole className="size-3" /> Cadastre-se para ver</p>}
      <Button onClick={scheduled ? onRemind : onOpen} variant={scheduled ? "outline" : "secondary"} className="w-full">{scheduled ? reminded ? <><Check /> Lembrete ativado</> : <><Bell /> Me Lembrar</> : <>Participar do leilão <ArrowUpRight /></>}</Button>
    </div>
  </article>;
}