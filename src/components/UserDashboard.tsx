import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Copy, Crown, Gift, Gavel, ShoppingBag, Trophy, Users, Wallet } from "lucide-react";
import { actions, brl, ME_NAME, useStore, type Item } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const PACKS = [{ qty: 50, price: 25 }, { qty: 150, price: 65 }, { qty: 500, price: 199 }];

function ActivityTable({ items, wins = false }: { items: Item[]; wins?: boolean }) {
  return <div className="overflow-x-auto border-y">
    <table className="w-full min-w-[540px] text-left text-sm">
      <thead className="bg-muted/60 text-xs text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Item</th><th className="px-4 py-3 font-medium">{wins ? "Valor do arremate" : "Último valor"}</th><th className="px-4 py-3 font-medium">{wins ? "Próximo passo" : "Situação"}</th></tr></thead>
      <tbody>{items.map(item => <tr key={item.id} className="border-t">
        <td className="px-4 py-4"><Link to="/leilao/$id" params={{ id: item.id }} className="flex items-center gap-3 font-medium hover:text-primary"><img src={item.image} alt="" className="size-12 shrink-0 rounded-md object-cover" /><span>{item.title}</span></Link></td>
        <td className="whitespace-nowrap px-4 py-4 font-mono font-medium">{brl(wins ? item.finalPrice ?? item.price : item.price)}</td>
        <td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs ${wins ? "text-purchased-ink" : item.status === "ativo" ? "text-primary" : "text-muted-foreground"}`}><span className={`size-1.5 rounded-full ${wins ? "bg-purchased-ink" : item.status === "ativo" ? "bg-primary" : "bg-muted-foreground"}`} />{wins ? item.fulfillment === "aguardando_envio" ? "Aguardando envio" : "Aguardando pagamento" : item.status === "leiloado" ? "Encerrado" : item.status === "ativo" ? "Em andamento" : "Agendado"}</span></td>
      </tr>)}{items.length === 0 && <tr><td colSpan={3} className="px-5 py-12 text-center"><Gavel className="mx-auto mb-3 size-6 text-muted-foreground" /><p className="font-medium">{wins ? "Seus próximos arremates ficam aqui" : "Você ainda não participou de um leilão"}</p><Button asChild variant="link" className="mt-2"><Link to="/">Explorar leilões<ArrowRight /></Link></Button></td></tr>}</tbody>
    </table>
  </div>;
}

export function UserDashboard() {
  const wallet = useStore(s => s.wallet);
  const balances = useStore(s => s.bidBalances);
  const plan = useStore(s => s.plan);
  const code = useStore(s => s.referralCode);
  const items = useStore(s => s.items);
  const participated = items.filter(i => i.bids.some(b => b.user === ME_NAME));
  const wins = items.filter(i => i.status === "leiloado" && i.winner === ME_NAME && i.fulfillment !== "enviado");
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [selected, setSelected] = useState(50);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const metrics = [
    { title: "Lances Gratuitos", value: balances.free, detail: "Plano inicial ou bônus", Icon: Gift, theme: "bg-secondary text-secondary-foreground" },
    { title: "Lances Comprados", value: balances.purchased, detail: "Pacotes adquiridos", Icon: ShoppingBag, theme: "bg-purchased-soft text-purchased-ink" },
    { title: "Lances por Indicação", value: balances.referral, detail: "Amigos que se cadastraram", Icon: Users, theme: "bg-referral-soft text-referral-ink" },
  ];
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/register?perfil=usuario&ref=${code}`);
      setCopied(true); setCopyError("");
    } catch { setCopyError("Não foi possível copiar. Seu código de indicação está abaixo."); }
  }
  function confirmPurchase() {
    const pack = PACKS.find(p => p.qty === selected);
    if (!pack) return;
    actions.buyPack(pack.qty, pack.price);
    setNotice(`${pack.qty} lances adicionados à sua carteira. Compra simulada, sem cobrança.`);
    setPurchaseOpen(false);
  }
  return <main className="mx-auto max-w-6xl px-5 py-8 sm:py-10 lg:px-8">
    <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
      <div><p className="mb-2 text-xs font-medium text-primary">MINHA CONTA</p><h1 className="text-3xl font-semibold sm:text-4xl">Meu painel</h1></div>
      <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs font-medium text-primary"><Crown className="size-4" />Plano {plan === "pago" ? "Premium" : "Gratuito"}</div>
    </div>
    <section aria-labelledby="balance-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><h2 id="balance-title" className="flex items-center gap-2 text-base font-medium text-muted-foreground"><Wallet className="size-4" />Saldo de lances</h2><p className="mt-2 text-5xl font-semibold">{wallet} <span className="text-lg font-normal text-muted-foreground">lances disponíveis</span></p></div><Button asChild variant="link" className="p-0"><Link to="/">Ir aos leilões<ArrowRight /></Link></Button></div>
      <div className="grid gap-4 sm:grid-cols-3">{metrics.map(({ title, value, detail, Icon, theme }) => <article key={title} className={`rounded-lg p-5 sm:p-6 ${theme}`}><div className="mb-5 flex items-center justify-between gap-2"><h3 className="text-sm font-medium">{title}</h3><Icon className="size-5 shrink-0" /></div><p className="text-4xl font-semibold" data-testid={title}>{value}</p><p className="mt-3 text-xs opacity-80">{detail}</p></article>)}</div>
      <Button size="lg" className="mt-5 h-12 w-full sm:w-auto sm:min-w-72" onClick={() => { setNotice(""); setPurchaseOpen(true); }}><ShoppingBag />Adquirir Mais Lances<ArrowRight /></Button>
      <p role="status" className="mt-3 text-sm text-primary">{notice}</p>
    </section>
    <section aria-labelledby="activity-title" className="mt-8">
      <h2 id="activity-title" className="mb-5 text-xl font-semibold">Minha Atividade</h2>
      <Tabs defaultValue="participated">
        <TabsList className="mb-4 h-auto max-w-full flex-wrap justify-start gap-1 bg-transparent p-0"><TabsTrigger value="participated" className="gap-2 px-3 py-3 data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-none"><Gavel className="size-4" />Leilões que participei<span className="text-xs opacity-70">{participated.length}</span></TabsTrigger><TabsTrigger value="wins" className="gap-2 px-3 py-3 data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-none"><Trophy className="size-4" />Meus Arremates<span className="text-xs opacity-70">{wins.length}</span></TabsTrigger></TabsList>
        <TabsContent value="participated"><ActivityTable items={participated} /></TabsContent>
        <TabsContent value="wins"><ActivityTable items={wins} wins /></TabsContent>
      </Tabs>
    </section>
    <section aria-labelledby="referral-title" className="mt-10 flex flex-col gap-6 border-y border-referral-ink/15 bg-referral-soft px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <div className="max-w-lg"><div className="mb-3 flex items-center gap-2 text-referral-ink"><Gift className="size-5" /><h2 id="referral-title" className="text-lg font-semibold">É melhor com amigos.</h2></div><p className="text-sm leading-relaxed">Indique um amigo e ganhe 10 lances gratuitos quando ele se cadastrar!</p></div>
      <div className="shrink-0"><p className="mb-2 text-xs text-muted-foreground">Seu código de indicação</p><div className="flex flex-wrap items-center gap-4"><code className="select-all text-lg font-semibold text-referral-ink">{code}</code><Button variant="outline" onClick={copyLink}>{copied ? <Check /> : <Copy />}{copied ? "Link Copiado!" : "Copiar Link"}</Button></div><p role="status" className="mt-2 max-w-72 text-xs text-destructive">{copyError}</p></div>
    </section>
    <Dialog open={purchaseOpen} onOpenChange={setPurchaseOpen}><DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg">
      <DialogTitle>Mais lances, mais oportunidades</DialogTitle><DialogDescription>Escolha um pacote. Compra demonstrativa, sem pagamento real.</DialogDescription>
      <fieldset className="space-y-3"><legend className="sr-only">Pacotes de lances</legend>{PACKS.map(pack => <label key={pack.qty} className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 ${selected === pack.qty ? "border-primary bg-secondary" : "bg-card"}`}><input type="radio" name="pack" value={pack.qty} checked={selected === pack.qty} onChange={() => setSelected(pack.qty)} className="size-4 accent-primary" /><span className="flex-1 font-medium">{pack.qty} lances</span><span className="font-mono text-sm">{brl(pack.price)}</span></label>)}</fieldset>
      <Button className="h-11" onClick={confirmPurchase}>Confirmar compra simulada<ArrowRight /></Button>
    </DialogContent></Dialog>
  </main>;
}