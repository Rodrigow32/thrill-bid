import { useEffect, useState, useSyncExternalStore } from "react";

export type Role = "usuario" | "parceiro" | "admin";
export type Category = "geral" | "mulheres" | "iniciantes" | "eletronicos";
export type ItemStatus = "pendente" | "aprovado" | "agendado" | "ativo" | "leiloado";

export const CATEGORIES: { id: Category | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "geral", label: "Geral" },
  { id: "mulheres", label: "Só para Mulheres" },
  { id: "iniciantes", label: "Iniciantes" },
  { id: "eletronicos", label: "Eletrônicos" },
];

export interface Bid { id: string; user: string; ts: number; price: number }
export interface Item {
  id: string; title: string; description: string; image: string; marketValue: number;
  category: Category; partner: string; status: ItemStatus; price: number; increment: number;
  timerSec: number; endsAt: number | null; startsAt: number | null; lastBidder: string | null;
  bids: Bid[]; winner?: string; finalPrice?: number;
}

const BOTS = ["marina_s", "joao.p", "carla88", "rafa_lances", "bia.m", "tiago_r", "ana.lu"];
const ME = "voce_demo";
const now = () => Date.now();
const uid = () => Math.random().toString(36).slice(2, 10);
const img = (id: string) => `https://images.unsplash.com/${id}?w=800&q=70&auto=format&fit=crop`;

function mk(p: Partial<Item> & Pick<Item, "title" | "image" | "marketValue" | "category">): Item {
  return {
    id: uid(), description: "Produto novo, lacrado, com garantia do parceiro e nota fiscal.",
    partner: "TechStore", status: "ativo", price: 0, increment: 0.01, timerSec: 15,
    endsAt: now() + 5000 + Math.random() * 10000, startsAt: null, lastBidder: null, bids: [], ...p,
  };
}

interface State {
  role: Role; wallet: number; plan: "gratuito" | "pago"; items: Item[];
  bidsPurchased: number; planRevenue: number; packRevenue: number;
}

let state: State = {
  role: "usuario", wallet: 45, plan: "gratuito", bidsPurchased: 12840, planRevenue: 18450, packRevenue: 32190,
  items: [
    mk({ title: "iPhone 15 Pro 256GB", image: img("photo-1695048133142-1a20484d2569"), marketValue: 8999, category: "eletronicos" }),
    mk({ title: "PlayStation 5 Slim", image: img("photo-1606813907291-d86efa9b94db"), marketValue: 3799, category: "geral" }),
    mk({ title: "Bolsa de Couro Premium", image: img("photo-1584917865442-de89df76afd3"), marketValue: 1290, category: "mulheres", partner: "Atelier Lia" }),
    mk({ title: "Fone Sony WH-1000XM5", image: img("photo-1618366712010-f4ae9c647dcb"), marketValue: 2199, category: "iniciantes" }),
    mk({ title: "Smartwatch Series 9", image: img("photo-1579586337278-3befd40fd17a"), marketValue: 3499, category: "eletronicos" }),
    mk({ title: "Kit Skincare Luxo", image: img("photo-1556228578-8c89e6adf883"), marketValue: 690, category: "mulheres", partner: "Beauty Co" }),
    mk({ title: "Drone DJI Mini 4", image: img("photo-1473968512647-3e447244af8f"), marketValue: 5299, category: "geral", status: "agendado", endsAt: null, startsAt: now() + 3600_000 * 5 }),
    mk({ title: "Notebook Gamer RTX", image: img("photo-1603302576837-37561b2e2302"), marketValue: 7999, category: "eletronicos", status: "pendente", endsAt: null, partner: "TechStore" }),
    mk({ title: "Cafeteira Expresso", image: img("photo-1517668808822-9ebb02f2a0e6"), marketValue: 1490, category: "geral", status: "aprovado", endsAt: null, partner: "TechStore" }),
    mk({ title: "Kindle Paperwhite", image: img("photo-1592496431122-2349e0fbc666"), marketValue: 899, category: "iniciantes", status: "leiloado", endsAt: null, winner: "carla88", finalPrice: 14.37, partner: "TechStore" }),
    mk({ title: "AirPods Pro 2", image: img("photo-1600294037681-c80b4cb5b434"), marketValue: 1899, category: "geral", status: "leiloado", endsAt: null, winner: ME, finalPrice: 8.12, partner: "TechStore" }),
  ],
};

const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const set = (fn: (s: State) => Partial<State>) => { state = { ...state, ...fn(state) }; emit(); };
const updItem = (id: string, fn: (i: Item) => Partial<Item>) =>
  set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...fn(i) } : i)) }));

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => sel(state), () => sel(state));
}

function placeBid(id: string, user: string) {
  updItem(id, (i) => {
    if (i.status !== "ativo") return {};
    const price = +(i.price + i.increment).toFixed(2);
    const bid: Bid = { id: uid(), user, ts: now(), price };
    return { price, lastBidder: user, endsAt: now() + i.timerSec * 1000, bids: [bid, ...i.bids] };
  });
}

export const actions = {
  setRole: (role: Role) => set(() => ({ role })),
  bid: (id: string) => {
    if (state.wallet <= 0) return false;
    set((s) => ({ wallet: s.wallet - 1 }));
    placeBid(id, ME);
    return true;
  },
  buyPack: (qty: number, price: number) => set((s) => ({ wallet: s.wallet + qty, bidsPurchased: s.bidsPurchased + qty, packRevenue: s.packRevenue + price })),
  subscribe: () => set((s) => ({ plan: "pago", wallet: s.wallet + 300, planRevenue: s.planRevenue + 49.9 })),
  submitItem: (d: Pick<Item, "title" | "description" | "image" | "marketValue" | "category">) =>
    set((s) => ({ items: [...s.items, mk({ ...d, status: "pendente", endsAt: null, partner: "TechStore" })] })),
  approve: (id: string) => updItem(id, () => ({ status: "aprovado" })),
  schedule: (id: string, startsAt: number, increment: number, category: Category) =>
    updItem(id, () => ({ status: "agendado", startsAt, increment, category })),
  startNow: (id: string) => updItem(id, () => ({ status: "ativo", startsAt: null, endsAt: now() + 15000 })),
};

export const ME_NAME = ME;

// Simulation engine (client only)
let engine = false;
export function useEngine() {
  useEffect(() => {
    if (engine) return; engine = true;
    const t = setInterval(() => {
      const n = now();
      state.items.forEach((i) => {
        if (i.status === "agendado" && i.startsAt && i.startsAt <= n) actions.startNow(i.id);
        if (i.status !== "ativo" || !i.endsAt) return;
        const left = i.endsAt - n;
        if (left <= 0) {
          if (!i.lastBidder) { updItem(i.id, () => ({ endsAt: n + 15000 })); return; }
          updItem(i.id, (x) => ({ status: "leiloado", winner: x.lastBidder!, finalPrice: x.price, endsAt: null }));
          return;
        }
        // bots bid more often near the end, but stop sometimes so auctions finish
        const p = left < 4000 ? 0.12 : 0.01;
        if (Math.random() < p && i.bids.length < 400) placeBid(i.id, BOTS[Math.floor(Math.random() * BOTS.length)]!);
      });
    }, 200);
    return () => { clearInterval(t); engine = false; };
  }, []);
}

export function useNow(ms = 100) {
  const [n, setN] = useState(() => now());
  useEffect(() => { const t = setInterval(() => setN(now()), ms); return () => clearInterval(t); }, [ms]);
  return n;
}

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const fmtTs = (t: number) => {
  const d = new Date(t);
  return d.toLocaleTimeString("pt-BR") + "." + String(d.getMilliseconds()).padStart(3, "0");
};
export const catLabel = (c: Category) => CATEGORIES.find((x) => x.id === c)?.label ?? c;
