import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({ title, value, change, prefix, suffix, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("p-5 glass-panel border-l-4 border-l-primary/50 relative overflow-hidden group hover:border-l-primary transition-all duration-300", className)}>
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">{title}</span>
        
        <div className="flex items-baseline gap-1 mt-1">
          {prefix && <span className="text-sm text-muted-foreground font-mono">{prefix}</span>}
          <span className="text-3xl font-bold font-display tracking-tight text-foreground group-hover:text-glow transition-all">
            {value}
          </span>
          {suffix && <span className="text-sm text-muted-foreground font-mono">{suffix}</span>}
        </div>

        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold mt-2 w-fit px-2 py-0.5 rounded-full",
            change > 0 ? "text-emerald-400 bg-emerald-400/10" : 
            change < 0 ? "text-red-400 bg-red-400/10" : 
            "text-gray-400 bg-gray-400/10"
          )}>
            {change > 0 ? <ArrowUp className="w-3 h-3" /> : 
             change < 0 ? <ArrowDown className="w-3 h-3" /> : 
             <Minus className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </Card>
  );
}
