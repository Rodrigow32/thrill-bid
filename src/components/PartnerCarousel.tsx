import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVisitorAccess } from "@/components/VisitorAccess";
import headphones from "@/assets/partner-headphones.jpg";

const ads = [
  { store: "TECHSTORE", title: "O seu próximo upgrade.", text: "Ofertas exclusivas da loja parceira TechStore.", cta: "Conhecer ofertas" },
  { store: "ATELIER LIA", title: "Detalhes que fazem a diferença.", text: "Seleção exclusiva da loja parceira Atelier Lia.", cta: "Ver seleção" },
  { store: "BEAUTY CO", title: "Um momento só seu.", text: "Ofertas especiais da loja parceira Beauty Co.", cta: "Descobrir ofertas" },
];
export function PartnerCarousel() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const { requestAccess } = useVisitorAccess();
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setSlide(s => (s + 1) % ads.length), 6500);
    return () => clearInterval(timer);
  }, [paused]);
  const ad = ads[slide] ?? ads[0];
  return <section aria-label="Publicidade de parceiros" aria-roledescription="carrossel" className="relative overflow-hidden rounded-lg bg-promo" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
    <img src={headphones} width={1536} height={512} alt="Fone sem fio premium em fundo verde suave" className="absolute inset-0 h-full w-full object-cover object-right opacity-40 sm:opacity-100" />
    <div className="relative px-6 py-8 sm:px-10 sm:py-10">
      <div className="mb-4 flex items-center gap-3 text-[10px] font-semibold text-promo-foreground"><span className="rounded border border-promo-foreground/20 px-2 py-1">PARCEIRO EM DESTAQUE</span><span>{ad.store}</span></div>
      <h2 className="max-w-[70%] text-2xl font-semibold leading-tight text-promo-foreground sm:text-3xl">{ad.title}</h2>
      <p className="mt-2 max-w-[65%] text-sm text-promo-foreground/75">{ad.text}</p>
      <Button onClick={() => requestAccess()} variant="ghost" className="mt-4 h-auto px-0 text-promo-foreground hover:bg-transparent">{ad.cta}<ArrowUpRight /></Button>
      <div className="mt-5 flex gap-1.5">{ads.map((a, i) => <Button key={a.store} size="icon" variant="ghost" aria-label={`Mostrar anúncio ${i + 1}`} aria-pressed={slide === i} onClick={() => setSlide(i)} className="size-5"><span className={`h-1 rounded-full ${slide === i ? "w-5 bg-promo-foreground" : "w-2 bg-promo-foreground/30"}`} /></Button>)}</div>
    </div>
    <span className="absolute bottom-5 right-6 text-[10px] text-promo-foreground/60">Publicidade simulada</span>
    <div className="absolute right-5 top-5 flex gap-1"><Button size="icon" variant="ghost" aria-label="Anúncio anterior" onClick={() => setSlide(s => (s + ads.length - 1) % ads.length)} className="size-7 text-promo-foreground"><ChevronLeft /></Button><Button size="icon" variant="ghost" aria-label="Próximo anúncio" onClick={() => setSlide(s => (s + 1) % ads.length)} className="size-7 text-promo-foreground"><ChevronRight /></Button></div>
  </section>;
}