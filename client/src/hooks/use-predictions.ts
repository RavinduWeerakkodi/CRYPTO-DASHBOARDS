import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type PredictionResponse } from "@shared/routes";
import { InsertPrediction } from "@shared/schema";
import { z } from "zod";

export function usePredictions(filters?: { coin?: string; timeframe?: string; status?: string }) {
  // Construct URL with query params
  const url = new URL(api.predictions.list.path, window.location.origin);
  if (filters?.coin) url.searchParams.append("coin", filters.coin);
  if (filters?.timeframe) url.searchParams.append("timeframe", filters.timeframe);
  if (filters?.status) url.searchParams.append("status", filters.status);

  return useQuery({
    queryKey: [api.predictions.list.path, filters],
    queryFn: async () => {
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch predictions");
      const data = await res.json();
      return api.predictions.list.responses[200].parse(data);
    },
  });
}

export function usePrediction(id: number) {
  return useQuery({
    queryKey: [api.predictions.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.predictions.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch prediction");
      return api.predictions.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePrediction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPrediction) => {
      const res = await fetch(api.predictions.create.path, {
        method: api.predictions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json(); // Assuming error structure
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create prediction");
      }
      
      return api.predictions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.predictions.list.path] });
    },
  });
}
