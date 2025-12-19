import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useMarketData(symbol: string) {
  return useQuery({
    queryKey: [api.marketData.get.path, symbol],
    queryFn: async () => {
      if (!symbol) return null;
      const url = buildUrl(api.marketData.get.path, { symbol });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch market data");
      return api.marketData.get.responses[200].parse(await res.json());
    },
    refetchInterval: 10000, // Refresh every 10s for "live" data feel
  });
}
