import { Link } from "@tanstack/react-router";
import { Gavel, Clock, CalendarClock, Trophy } from "lucide-react";
import { actions, brl, catLabel, fmtTs, useNow, useStore, ME_NAME, type Item } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Timer({ item, big }: { item: Item; big?: boolean }) {
  const n = useNow(100);
  if (item.status === "leiloado") return <span className="font-mono text-muted-foreground">ENCERRADO</span>;
  if (item.status !== "ativo" || !item.endsAt) return <span className="font-mono text-muted-foreground">--:--</span>;
  const left = Math.max(0, item.endsAt - n);
  const s = left / 1000;
  const urgent = s < 5;
  return (
    <span className={cn("font-mono font-bold tabular-nums", big ? "text-6xl" : "text-2xl", urgent ? "text-urgent animate-blink urgent-glow" : "text-foreground")}>
      00:{String(Math.ceil(s)).padStart(2, "0")}
    </span>
  );
}

export function AuctionCard({ item, onOpen, selected }: { item: Item; onOpen: () => void; selected?: boolean }) {
  return (
    <button onClick={onOpen} className={cn("group text-left rounded-2xl border bg-card overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg", selected && "ring-2 ring-urgent")}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium">{catLabel(item.category)}</span>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold leading-tight line-clamp-1">{item.title}</h3>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Preço atual</div>
            <div className="text-xl font-bold">{brl(item.price)}</div>
          </div>
          <Timer item={item} />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">Último: <b className="text-foreground">{item.lastBidder ?? "—"}</b></span>
          <span>Mercado {brl(item.marketValue)}</span>
        </div>
      </div>
    </button>
  );
}

export function AuctionDetail({ item, compact }: { item: Item; compact?: boolean }) {
  const wallet = useStore((s) => s.wallet);
  const role = useStore((s) => s.role);
  const canBid = item.status === "ativo" && role === "usuario" && wallet > 0;
  return (
    <div className="space-y-5">
      <div className={cn("overflow-hidden rounded-2xl bg-muted", compact ? "aspect-[16/10]" : "aspect-[4/3]")}>
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{catLabel(item.category)} · por {item.partner}</div>
        <h2 className="mt-1 text-2xl font-bold">{item.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
      </div>

      {item.status === "agendado" && item.startsAt && (
        <div className="flex items-center gap-3 rounded-xl border border-urgent/40 bg-urgent/10 p-4 text-sm">
          <CalendarClock className="h-5 w-5 text-urgent" />
          Leilão começa em <b>{new Date(item.startsAt).toLocaleString("pt-BR")}</b>
        </div>
      )}
      {item.status === "leiloado" && (
        <div className="flex items-center gap-3 rounded-xl bg-secondary p-4 text-sm">
          <Trophy className="h-5 w-5" /> Arrematado por <b>{item.winner}</b> por {brl(item.finalPrice ?? 0)}
        </div>
      )}

      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Preço atual</div>
            <div className="text-4xl font-bold">{brl(item.price)}</div>
            <div className="mt-1 text-xs text-muted-foreground">+{brl(item.increment)} por lance · último: <b className="text-foreground">{item.lastBidder ?? "—"}</b></div>
          </div>
          <div className="text-right">
            <Clock className="ml-auto h-4 w-4 text-muted-foreground" />
            <Timer item={item} big={!compact} />
          </div>
        </div>
        <button
          disabled={!canBid}
          onClick={() => actions.bid(item.id)}
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-urgent py-5 text-2xl font-black tracking-wide text-urgent-foreground shadow-lg transition active:scale-[0.98] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Gavel className="h-7 w-7" /> DAR LANCE
        </button>
        <div className="mt-2 text-center text-xs text-muted-foreground">
          {role !== "usuario" ? "Mude para a visão Usuário para dar lances" : wallet > 0 ? `Você tem ${wallet} lances` : "Sem lances — compre um pacote no seu painel"}
        </div>
      </div>

      <div className="rounded-2xl border bg-card">
        <div className="border-b px-4 py-3 text-sm font-semibold">Últimos 10 cliques</div>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr><th className="px-4 py-2 text-left">ID</th><th className="text-left">Usuário</th><th className="text-left">Timestamp</th><th className="px-4 text-right">Valor</th></tr>
          </thead>
          <tbody className="font-mono text-xs">
            {item.bids.slice(0, 10).map((b, i) => (
              <tr key={b.id} className={cn("border-t", i === 0 && "bg-urgent/10 animate-in fade-in", b.user === ME_NAME && "font-bold")}>
                <td className="px-4 py-2">#{b.id.slice(0, 6)}</td><td>{b.user}</td><td>{fmtTs(b.ts)}</td><td className="px-4 text-right">{brl(b.price)}</td>
              </tr>
            ))}
            {item.bids.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground font-sans">Nenhum lance ainda</td></tr>}
          </tbody>
        </table>
      </div>
      {compact && <Link to="/leilao/$id" params={{ id: item.id }} className="block text-center text-sm underline">Abrir página completa</Link>}
    </div>
  );
}
