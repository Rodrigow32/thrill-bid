import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Gift, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { actions } from "@/lib/store";

type Access = { signedIn: boolean; requestAccess: (partner?: boolean) => void; signOut: () => void };
const AccessContext = createContext<Access>({ signedIn: false, requestAccess: () => {}, signOut: () => {} });
export const useVisitorAccess = () => useContext(AccessContext);

export function VisitorAccessProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [partner, setPartner] = useState(false);
  const navigate = useNavigate();
  function requestAccess(isPartner = false) { setPartner(isPartner); setOpen(true); }
  return <AccessContext.Provider value={{ signedIn, requestAccess, signOut: () => setSignedIn(false) }}>
    {children}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-lg bg-card p-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary"><LockKeyhole className="size-6" /></div>
        <DialogTitle className="text-center text-2xl leading-tight">{partner ? "Sua loja no Thrill Bid" : "Seu próximo arremate começa aqui"}</DialogTitle>
        <DialogDescription className="text-center leading-relaxed">{partner ? "Faça parte dos nossos parceiros comerciais e apresente seus produtos a novos clientes." : "Aproveite nossos leilões gratuitos e pagos! Cadastre-se em menos de 1 minuto para participar e ganhar seus primeiros lances grátis."}</DialogDescription>
        {!partner && <div className="flex items-center justify-center gap-2 text-sm text-primary"><Gift className="size-4" /> Seus primeiros lances grátis</div>}
        <p className="text-xs text-muted-foreground">Cadastro real ainda não disponível. Acesso abaixo apenas para demonstração.</p>
        <Button size="lg" onClick={() => { setSignedIn(true); setOpen(false); actions.setRole(partner ? "parceiro" : "usuario"); if (partner) navigate({ to: "/parceiro" }); }}> {partner ? "Experimentar painel do parceiro" : "Experimentar como usuário"}<ArrowRight /></Button>
      </DialogContent>
    </Dialog>
  </AccessContext.Provider>;
}