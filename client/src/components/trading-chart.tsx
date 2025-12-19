import { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import { Card } from "@/components/ui/card";

interface ChartProps {
  data?: { time: string; open: number; high: number; low: number; close: number }[];
  height?: number;
  symbol?: string;
}

export function TradingChart({ data = [], height = 400, symbol = "BTCUSDT" }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981', // Success color
      downColor: '#ef4444', // Danger color
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    // Generate dummy data if none provided (for visualization)
    const chartData = data.length > 0 ? data : generateDummyData();
    candlestickSeries.setData(chartData);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, height]);

  return (
    <Card className="p-1 glass-panel overflow-hidden border-none bg-black/20">
      <div className="flex items-center justify-between p-3 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded bg-gradient-to-tr from-orange-500 to-yellow-500 flex items-center justify-center text-[10px] font-bold text-white">
             ₿
           </div>
           <span className="font-display font-bold text-lg tracking-wide">{symbol}</span>
           <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-mono">PERP</span>
        </div>
        <div className="flex gap-2">
           {['1H', '4H', '1D'].map(tf => (
             <button key={tf} className="text-xs font-mono text-muted-foreground hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-colors">
               {tf}
             </button>
           ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </Card>
  );
}

function generateDummyData() {
  const initialDate = new Date(2023, 0, 1);
  const initialValue = 20000;
  const data = [];
  let time = initialDate.getTime() / 1000;
  let value = initialValue;

  for (let i = 0; i < 300; i++) {
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility;
    const open = value;
    const close = value * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    data.push({
      time: time as any, // lightweight-charts expects UTCTimestamp but numbers work
      open,
      high,
      low,
      close,
    });

    time += 3600; // 1 hour
    value = close;
  }
  return data;
}
