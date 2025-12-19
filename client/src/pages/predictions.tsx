import { LayoutShell } from "@/components/layout-shell";
import { usePredictions } from "@/hooks/use-predictions";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Predictions() {
  const { data: predictions, isLoading } = usePredictions();

  return (
    <LayoutShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-display tracking-tight text-glow">Prediction History</h1>
        </div>

        <Card className="glass-panel border-none">
          <CardHeader>
            <CardTitle>All Signals</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="space-y-2">
                 {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full bg-white/5" />)}
               </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead>Date</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Stop Loss</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Outcome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictions?.map((pred) => (
                    <TableRow key={pred.id} className="border-white/10 hover:bg-white/5 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {pred.createdAt ? format(new Date(pred.createdAt), "MMM d, HH:mm") : "-"}
                      </TableCell>
                      <TableCell className="font-bold">{pred.coinSymbol}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={pred.direction === 'UP' ? "text-emerald-400 border-emerald-400/30" : "text-red-400 border-red-400/30"}>
                          {pred.direction}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{Number(pred.entryPrice).toFixed(4)}</TableCell>
                      <TableCell className="font-mono text-emerald-400">{Number(pred.targetPrice).toFixed(4)}</TableCell>
                      <TableCell className="font-mono text-red-400">{Number(pred.stopLoss).toFixed(4)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: `${pred.confidenceScore}%` }} />
                          </div>
                          <span className="text-xs">{pred.confidenceScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          pred.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
                          pred.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' :
                          'bg-gray-500/20 text-gray-400'
                        }>
                          {pred.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pred.resultOutcome === 'SUCCESS' && <Badge className="bg-emerald-500">WIN</Badge>}
                        {pred.resultOutcome === 'FAIL' && <Badge variant="destructive">LOSS</Badge>}
                        {!pred.resultOutcome && <span className="text-muted-foreground text-xs">-</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {(!predictions || predictions.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No prediction history found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  );
}
