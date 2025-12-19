import { useAuth } from "@/hooks/use-auth";
import { LayoutShell } from "@/components/layout-shell";
import { TradingChart } from "@/components/trading-chart";
import { StatCard } from "@/components/stat-card";
import { RankingsList } from "@/components/rankings-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Bitcoin, BrainCircuit, Target, Wallet } from "lucide-react";
import { usePredictions } from "@/hooks/use-predictions";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("1H");
  const { data: predictions } = usePredictions({ timeframe, status: "PENDING" });

  const activePredictions = predictions?.length || 0;

  return (
    <LayoutShell>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Portfolio Value" 
            value="12,450.00" 
            prefix="$" 
            change={2.4} 
            icon={<Wallet className="w-8 h-8 text-primary" />}
          />
          <StatCard 
            title="Active Signals" 
            value={activePredictions} 
            trend="up"
            icon={<Target className="w-8 h-8 text-accent" />}
          />
          <StatCard 
            title="Win Rate (24H)" 
            value="68" 
            suffix="%" 
            change={-1.2} 
            icon={<Activity className="w-8 h-8 text-orange-400" />}
          />
          <StatCard 
            title="AI Confidence" 
            value="8.4" 
            suffix="/10" 
            trend="up"
            icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}
          />
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[800px]">
          
          {/* Left Panel: Rankings & Scanner */}
          <div className="xl:col-span-3 space-y-6 flex flex-col h-full">
             <div className="glass-panel rounded-xl p-4 flex-1 flex flex-col gap-4">
               <div className="flex items-center justify-between">
                 <h2 className="text-lg font-bold font-display flex items-center gap-2">
                   <Bitcoin className="w-5 h-5 text-accent" />
                   Market Scanner
                 </h2>
                 <Badge variant="outline" className="font-mono text-xs border-primary/20 text-primary bg-primary/5">LIVE</Badge>
               </div>

               <Tabs defaultValue="1H" className="w-full" onValueChange={setTimeframe}>
                  <TabsList className="grid w-full grid-cols-3 bg-black/20">
                    <TabsTrigger value="1H">1H</TabsTrigger>
                    <TabsTrigger value="4H">4H</TabsTrigger>
                    <TabsTrigger value="1D">1D</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex-1 overflow-hidden mt-2">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Top Opportunities</h3>
                  <RankingsList timeframe={timeframe} />
                </div>
             </div>
          </div>

          {/* Center Panel: Chart & Analysis */}
          <div className="xl:col-span-6 flex flex-col gap-6">
            <div className="glass-panel rounded-xl p-1 flex-1 min-h-[500px]">
              <TradingChart height={500} symbol="BTCUSDT" />
            </div>

            <div className="glass-panel rounded-xl p-6 h-64">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                AI Analysis Summary
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Market structure is currently <span className="text-emerald-400 font-bold">BULLISH</span> on the 4H timeframe. 
                RSI (14) is cooling off from overbought levels, suggesting a potential retracement entry. 
                Our LSTM model predicts a <span className="text-accent font-bold">78% probability</span> of continuation to the $48,000 level.
                Watch for support validation at $46,200.
              </p>
              
              <div className="mt-4 flex gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">Strong Buy</Badge>
                <Badge variant="outline">Volatility: High</Badge>
                <Badge variant="outline">Trend: Uptrend</Badge>
              </div>
            </div>
          </div>

          {/* Right Panel: Signals & History */}
          <div className="xl:col-span-3 flex flex-col h-full gap-6">
             <div className="glass-panel rounded-xl p-4 flex-1">
                <h2 className="text-lg font-bold font-display mb-4">Recent Signals</h2>
                
                <div className="space-y-4">
                  {predictions?.slice(0, 5).map(pred => (
                    <div key={pred.id} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors group">
                       <div className="flex justify-between items-start mb-2">
                         <span className="font-bold">{pred.coinSymbol}</span>
                         <Badge className={pred.direction === 'UP' ? "bg-emerald-500" : "bg-red-500"}>
                           {pred.direction}
                         </Badge>
                       </div>
                       <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
                         <div>Target: <span className="text-foreground">{pred.targetPrice}</span></div>
                         <div>Stop: <span className="text-foreground">{pred.stopLoss}</span></div>
                       </div>
                       <div className="mt-2 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                         <div 
                           className="bg-primary h-full transition-all duration-1000 group-hover:bg-accent" 
                           style={{ width: `${pred.confidenceScore}%` }} 
                         />
                       </div>
                       <div className="text-[10px] text-right mt-1 text-muted-foreground">{pred.confidenceScore}% Conf.</div>
                    </div>
                  ))}

                  {(!predictions || predictions.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No active signals
                    </div>
                  )}
                </div>
             </div>
          </div>

        </div>
      </div>
    </LayoutShell>
  );
}
