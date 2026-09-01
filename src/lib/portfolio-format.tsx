/**
 * AtlasWallet — Portfolio formatting helpers (shared across app pages).
 * Illustrative reference rates — backend values are authoritative.
 */

export const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

export function formatAmount(s: string, decimals: number): string {
  const n = Number(s);
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: Math.min(decimals, 8),
  });
}

export function brlRate(code: string): number {
  const r: Record<string, number> = { BRL: 1, EUR: 5.5, USD: 5.05, GBP: 6.4 };
  return r[code] || 1;
}

export function cryptoRate(code: string): number {
  const r: Record<string, number> = {
    USDT: 5.05,
    USDC: 5.05,
    BTC: 320000,
    ETH: 18000,
    SOL: 800,
  };
  return r[code] || 1;
}

export function AssetIcon({ code }: { code: string }) {
  const colors: Record<string, string> = {
    BRL: "#2DDC8C",
    EUR: "#1687FF",
    USD: "#2DDC8C",
    GBP: "#8B68FF",
    USDT: "#2DDC8C",
    USDC: "#1687FF",
    BTC: "#F6B93B",
    ETH: "#8B68FF",
    SOL: "#8B68FF",
  };
  const c = colors[code] || "#95A4B8";
  return (
    <div
      className="h-9 w-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
      style={{ background: c, boxShadow: `0 0 12px -2px ${c}80` }}
      aria-hidden
    >
      {code.slice(0, 3)}
    </div>
  );
}
