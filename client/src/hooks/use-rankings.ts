import { useQuery } from "@tanstack/react-query";
import { api, type RankingResponse } from "@shared/routes";

export function useRankings(filters?: { timeframe?: string; type?: string }) {
  const url = new URL(api.rankings.list.path, window.location.origin);
  if (filters?.timeframe) url.searchParams.append("timeframe", filters.timeframe);
  if (filters?.type) url.searchParams.append("type", filters.type);

  return useQuery({
    queryKey: [api.rankings.list.path, filters],
    queryFn: async () => {
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch rankings");
      const data = await res.json();
      return api.rankings.list.responses[200].parse(data);
    },
  });
}
