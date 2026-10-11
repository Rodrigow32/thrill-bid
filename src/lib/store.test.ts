import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { actions, useStore } from "./store";

describe("bid source balances", () => {
  it("keeps package and plan balances consistent with the wallet", () => {
    const { result } = renderHook(() => useStore(s => s));
    act(() => actions.registerDemo("gratuito"));
    expect(result.current.bidBalances).toEqual({ free: 10, purchased: 0, referral: 0 });
    act(() => actions.buyPack(50, 25));
    expect(result.current.wallet).toBe(60);
    expect(result.current.bidBalances.purchased).toBe(50);
    const item = result.current.items.find(i => i.status === "ativo");
    if (!item) throw new Error("Missing active fixture");
    act(() => { actions.bid(item.id); });
    expect(result.current.bidBalances.free).toBe(9);
    expect(result.current.wallet).toBe(59);
    act(() => actions.subscribe());
    expect(result.current.wallet).toBe(259);
    const balances = result.current.bidBalances;
    expect(balances.free + balances.purchased + balances.referral).toBe(result.current.wallet);
    act(() => actions.registerDemo("pago"));
    expect(result.current.bidBalances).toEqual({ free: 200, purchased: 0, referral: 0 });
  });
});