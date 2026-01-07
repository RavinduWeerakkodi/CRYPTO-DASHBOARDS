import { z } from "zod";

export interface Candle {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
}

// Binance API response format:
// [
//   [
//     1499040000000,      // Open time
//     "0.01634790",       // Open
//     "0.80000000",       // High
//     "0.01575800",       // Low
//     "0.01577100",       // Close
//     "148976.11427815",  // Volume
//     1499644799999,      // Close time
//     ...
//   ]
// ]

export const MarketDataService = {
  /**
   * Fetch candlestick data from Binance public API
   * @param symbol Pair symbol (e.g. BTCUSDT)
   * @param interval Timeframe (1h, 4h, 1d)
   * @param limit Number of candles to fetch
   */
  async fetchCandles(symbol: string, interval: string = "4h", limit: number = 100): Promise<Candle[]> {
    try {
      // Normalize timeframe for Binance (1H -> 1h)
      const binanceInterval = interval.toLowerCase();
      
      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${binanceInterval}&limit=${limit}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Invalid data format from Binance:", data);
        return [];
      }

      return data.map((d: any[]) => ({
        openTime: d[0],
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
        volume: parseFloat(d[5]),
        closeTime: d[6]
      }));
    } catch (error) {
      console.error(`Failed to fetch candles for ${symbol}:`, error);
      return [];
    }
  },

  /**
   * Get current price for a symbol
   */
  async getCurrentPrice(symbol: string): Promise<number | null> {
    try {
      const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.price) {
        return parseFloat(data.price);
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch price for ${symbol}:`, error);
      return null;
    }
  }
};
