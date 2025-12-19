import { LayoutShell } from "@/components/layout-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePrediction } from "@/hooks/use-predictions";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { InsertPrediction } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

// Simplified schema for the form
const formSchema = z.object({
  coinSymbol: z.string().min(1, "Symbol is required"),
  timeframe: z.string(),
  direction: z.string(),
  entryPrice: z.coerce.number(),
  targetPrice: z.coerce.number(),
  stopLoss: z.coerce.number(),
  confidenceScore: z.coerce.number().min(0).max(100),
  expiresAt: z.string().transform(str => new Date(str)), // Input type="datetime-local" returns string
});

export default function Admin() {
  const { mutate: createPrediction, isPending } = useCreatePrediction();
  const { toast } = useToast();

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      timeframe: "1H",
      direction: "UP",
      confidenceScore: 80,
    }
  });

  const onSubmit = (data: any) => {
    // Transform data to match API expectation
    const payload = {
      ...data,
      coinSymbol: data.coinSymbol.toUpperCase(),
      entryPrice: String(data.entryPrice),
      targetPrice: String(data.targetPrice),
      stopLoss: String(data.stopLoss),
      status: "PENDING",
      expiresAt: new Date(data.expiresAt).toISOString() as any, // Drizzle handles Date/string
    };

    createPrediction(payload, {
      onSuccess: () => {
        toast({ title: "Success", description: "Prediction created successfully" });
        reset();
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <LayoutShell>
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold font-display">Admin Controls</h1>

        <Card className="glass-panel border-none">
          <CardHeader>
            <CardTitle>Create Manual Prediction</CardTitle>
            <CardDescription>Manually inject a signal into the system (bypassing AI engine)</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Coin Symbol</Label>
                  <Input {...register("coinSymbol", { required: true })} placeholder="BTCUSDT" className="bg-white/5 border-white/10" />
                  {errors.coinSymbol && <span className="text-xs text-red-400">Required</span>}
                </div>

                <div className="space-y-2">
                  <Label>Timeframe</Label>
                  <Select onValueChange={(val) => setValue("timeframe", val)} defaultValue="1H">
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1H">1 Hour</SelectItem>
                      <SelectItem value="4H">4 Hours</SelectItem>
                      <SelectItem value="1D">1 Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Direction</Label>
                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                    onClick={() => setValue("direction", "UP")}
                  >
                    LONG (UP)
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => setValue("direction", "DOWN")}
                  >
                    SHORT (DOWN)
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Entry Price</Label>
                  <Input type="number" step="0.0001" {...register("entryPrice", { required: true })} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Target Price</Label>
                  <Input type="number" step="0.0001" {...register("targetPrice", { required: true })} className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Stop Loss</Label>
                  <Input type="number" step="0.0001" {...register("stopLoss", { required: true })} className="bg-white/5 border-white/10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confidence Score (0-100)</Label>
                <Input type="number" {...register("confidenceScore", { required: true, min: 0, max: 100 })} className="bg-white/5 border-white/10" />
              </div>

              <div className="space-y-2">
                <Label>Expires At</Label>
                <Input type="datetime-local" {...register("expiresAt", { required: true })} className="bg-white/5 border-white/10" />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Publish Signal"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  );
}
