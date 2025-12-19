import { useRankings } from "@/hooks/use-rankings";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export function RankingsList({ timeframe = "1H" }: { timeframe: string }) {
  const { data: rankings, isLoading } = useRankings({ timeframe });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  if (!rankings?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-white/5 rounded-lg border border-dashed border-white/10">
        <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No rankings available</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {rankings.map((rank, idx) => {
          const score = Number(rank.rankScore);
          const isTop = idx < 3;
          
          return (
            <div 
              key={rank.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer
                ${isTop 
                  ? "bg-gradient-to-r from-primary/10 to-transparent border-primary/30" 
                  : "bg-card border-border hover:border-primary/50"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm
                  ${isTop ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-secondary text-muted-foreground"}`}
                >
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="font-bold tracking-tight">{rank.coinSymbol}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="font-mono">{rank.timeframe}</span>
                    <span>•</span>
                    <span className={rank.rankType === 'TOP_OPPORTUNITY' ? "text-emerald-400" : "text-red-400"}>
                      {rank.rankType === 'TOP_OPPORTUNITY' ? 'Bullish' : 'Bearish'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-1 font-mono font-bold text-lg">
                  {score.toFixed(1)}
                  {rank.rankType === 'TOP_OPPORTUNITY' 
                    ? <TrendingUp className="w-4 h-4 text-emerald-500" />
                    : <TrendingDown className="w-4 h-4 text-red-500" />
                  }
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
