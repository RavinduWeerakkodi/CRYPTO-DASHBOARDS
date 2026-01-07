import { Candle } from "./market_data";

export interface AnalysisResult {
    direction: "UP" | "DOWN";
    confidence: number;
    targetPrice: number;
    stopLoss: number;
    summary: string;
    indicators: {
        rsi: number;
        emaFast: number;
        emaSlow: number;
        trend: "BULLISH" | "BEARISH" | "NEUTRAL";
    };
}

export const AnalysisEngine = {

    /**
     * Main entry point to analyze market structure and generate a prediction
     */
    analyze(symbol: string, candles: Candle[]): AnalysisResult {
        const closes = candles.map(c => c.close);
        const currentPrice = closes[closes.length - 1];

        // 1. Calculate Indicators
        const rsi = this.calculateRSI(closes);
        const ema20 = this.calculateEMA(closes, 20);
        const ema50 = this.calculateEMA(closes, 50);

        // 2. Determine Trend
        let trend: "BULLISH" | "BEARISH" | "NEUTRAL" = "NEUTRAL";
        if (currentPrice > ema50 && ema20 > ema50) trend = "BULLISH";
        else if (currentPrice < ema50 && ema20 < ema50) trend = "BEARISH";

        // 3. Heuristic Scoring
        let score = 50; // Base score
        let direction: "UP" | "DOWN" = "UP"; // Default
        let summaryParts = [];

        // Trend logic
        if (trend === "BULLISH") {
            score += 10;
            summaryParts.push("Uptrend defined by EMA20 > EMA50.");
        } else if (trend === "BEARISH") {
            score -= 10;
            summaryParts.push("Downtrend defined by EMA20 < EMA50.");
        }

        // RSI logic
        if (rsi < 30) {
            // Oversold in uptrend = clear buy
            if (trend === "BULLISH") {
                score += 25;
                direction = "UP";
                summaryParts.push(`RSI is oversold (${rsi.toFixed(1)}), suggesting a pullback entry.`);
            } else {
                // Oversold in downtrend = bounce risk
                score += 5;
                summaryParts.push(`RSI is oversold (${rsi.toFixed(1)}), potential dead cat bounce.`);
            }
        } else if (rsi > 70) {
            if (trend === "BEARISH") {
                score -= 25;
                direction = "DOWN"; // Reinforce short
                summaryParts.push(`RSI is overbought (${rsi.toFixed(1)}), suggesting continuation lower.`);
            } else {
                score -= 5;
                summaryParts.push(`RSI is overbought (${rsi.toFixed(1)}), potential exhaustion.`);
            }
        } else {
            summaryParts.push(`RSI is neutral (${rsi.toFixed(1)}).`);
        }

        // Finalize Direction based on Score
        // > 60 => UP, < 40 => DOWN, else weak
        if (score >= 55) direction = "UP";
        else if (score <= 45) direction = "DOWN";
        else {
            // Follow the trend if neutral score
            direction = trend === "BULLISH" ? "UP" : "DOWN";
        }

        // Normalize confidence (distance from 50)
        let confidence = Math.abs(score - 50) * 2; // 50->0, 100->100, 0->100
        if (confidence > 95) confidence = 95;
        if (confidence < 20) confidence = 20; // Min confidence

        // 4. Calculate Targets (ATR-ish logic simplified)
        const volatility = (Math.max(...closes.slice(-14)) - Math.min(...closes.slice(-14))) / currentPrice;
        const targetDist = currentPrice * volatility; // 1x implied volatility move

        let targetPrice = 0;
        let stopLoss = 0;

        if (direction === "UP") {
            targetPrice = currentPrice + targetDist;
            stopLoss = currentPrice - (targetDist * 0.5); // 1:2 R:R roughly
        } else {
            targetPrice = currentPrice - targetDist;
            stopLoss = currentPrice + (targetDist * 0.5);
        }

        return {
            direction,
            confidence: Math.round(confidence),
            targetPrice,
            stopLoss,
            summary: summaryParts.join(" "),
            indicators: {
                rsi,
                emaFast: ema20,
                emaSlow: ema50,
                trend
            }
        };
    },

    calculateRSI(prices: number[], period: number = 14): number {
        if (prices.length < period + 1) return 50;

        let gains = 0;
        let losses = 0;

        for (let i = 1; i <= period; i++) {
            const change = prices[prices.length - i] - prices[prices.length - i - 1];
            if (change >= 0) gains += change;
            else losses += Math.abs(change);
        }

        const avgGain = gains / period;
        const avgLoss = losses / period;

        if (avgLoss === 0) return 100;
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    },

    calculateEMA(prices: number[], period: number): number {
        if (prices.length < period) return prices[prices.length - 1];

        const k = 2 / (period + 1);
        let ema = prices[0];

        for (let i = 1; i < prices.length; i++) {
            ema = (prices[i] * k) + (ema * (1 - k));
        }

        return ema;
    }
};
