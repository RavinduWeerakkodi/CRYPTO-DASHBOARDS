import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // === PREDICTIONS ===
  app.get(api.predictions.list.path, async (req, res) => {
    const coin = req.query.coin as string;
    const timeframe = req.query.timeframe as string;
    const status = req.query.status as string;
    const predictions = await storage.getPredictions({ coin, timeframe, status });
    res.json(predictions);
  });

  app.get(api.predictions.get.path, async (req, res) => {
    const prediction = await storage.getPrediction(Number(req.params.id));
    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }
    res.json(prediction);
  });

  app.post(api.predictions.create.path, async (req, res) => {
    try {
      const input = api.predictions.create.input.parse(req.body);
      const prediction = await storage.createPrediction(input);
      res.status(201).json(prediction);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === RANKINGS ===
  app.get(api.rankings.list.path, async (req, res) => {
    const timeframe = req.query.timeframe as string;
    const type = req.query.type as string;
    const rankings = await storage.getRankings(timeframe, type);
    res.json(rankings);
  });

  // === MARKET DATA ===
  app.get(api.marketData.get.path, async (req, res) => {
    const data = await storage.getMarketData(req.params.symbol);
    if (!data) {
      return res.status(404).json({ message: 'Market data not found' });
    }
    res.json(data);
  });

  // === SEED DATA (SIMPLE) ===
  // In a real app, this would be a separate script or controlled by admin
  app.post('/api/admin/seed', async (req, res) => {
    await seedDatabase();
    res.json({ message: "Database seeded" });
  });

  return httpServer;
}

async function seedDatabase() {
  // Add some coins
  await storage.upsertCoin({ symbol: "BTCUSDT", name: "Bitcoin" });
  await storage.upsertCoin({ symbol: "ETHUSDT", name: "Ethereum" });
  await storage.upsertCoin({ symbol: "SOLUSDT", name: "Solana" });

  // Add dummy prediction
  const existing = await storage.getPredictions();
  if (existing.length === 0) {
    await storage.createPrediction({
      coinSymbol: "BTCUSDT",
      timeframe: "4H",
      direction: "UP",
      entryPrice: "98000.00",
      targetPrice: "102000.00",
      stopLoss: "96000.00",
      confidenceScore: 85,
      status: "PENDING",
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4h from now
      ruleScore: 80,
      mlProbability: 88,
      lstmConfidence: 82,
      expectedMovePct: "4.08"
    });
    
    await storage.createRanking({
      coinSymbol: "BTCUSDT",
      rankScore: "85.5",
      rankType: "TOP_OPPORTUNITY",
      timeframe: "4H"
    });
  }
}
