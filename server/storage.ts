import { db } from "./db";
import {
  predictions,
  rankings,
  marketData,
  coins,
  type InsertPrediction,
  type InsertRanking,
  type Prediction,
  type Ranking,
  type MarketData,
  type Coin
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  // Predictions
  getPredictions(filters?: { coin?: string; timeframe?: string; status?: string }): Promise<Prediction[]>;
  getPrediction(id: number): Promise<Prediction | undefined>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;

  // Rankings
  getRankings(timeframe?: string, type?: string): Promise<Ranking[]>;
  createRanking(ranking: InsertRanking): Promise<Ranking>;

  // Market Data
  getMarketData(symbol: string): Promise<MarketData | undefined>;
  upsertMarketData(data: typeof marketData.$inferInsert): Promise<MarketData>;

  // Coins
  getCoins(): Promise<Coin[]>;
  upsertCoin(coin: typeof coins.$inferInsert): Promise<Coin>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods delegated to authStorage
  getUser = authStorage.getUser.bind(authStorage);
  upsertUser = authStorage.upsertUser.bind(authStorage);

  async getPredictions(filters?: { coin?: string; timeframe?: string; status?: string }): Promise<Prediction[]> {
    let query = db.select().from(predictions).orderBy(desc(predictions.createdAt));
    
    const conditions = [];
    if (filters?.coin) conditions.push(eq(predictions.coinSymbol, filters.coin));
    if (filters?.timeframe) conditions.push(eq(predictions.timeframe, filters.timeframe));
    if (filters?.status) conditions.push(eq(predictions.status, filters.status));

    if (conditions.length > 0) {
      // @ts-ignore - simpler to ignore type check for dynamic where than complex typing
      return await query.where(and(...conditions));
    }
    
    return await query;
  }

  async getPrediction(id: number): Promise<Prediction | undefined> {
    const [prediction] = await db.select().from(predictions).where(eq(predictions.id, id));
    return prediction;
  }

  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const [newPrediction] = await db.insert(predictions).values(prediction).returning();
    return newPrediction;
  }

  async getRankings(timeframe?: string, type?: string): Promise<Ranking[]> {
    let query = db.select().from(rankings).orderBy(desc(rankings.rankScore));
    
    const conditions = [];
    if (timeframe) conditions.push(eq(rankings.timeframe, timeframe));
    if (type) conditions.push(eq(rankings.rankType, type));

    if (conditions.length > 0) {
       // @ts-ignore
      return await query.where(and(...conditions));
    }

    return await query;
  }

  async createRanking(ranking: InsertRanking): Promise<Ranking> {
    const [newRanking] = await db.insert(rankings).values(ranking).returning();
    return newRanking;
  }

  async getMarketData(symbol: string): Promise<MarketData | undefined> {
    const [data] = await db.select().from(marketData).where(eq(marketData.coinSymbol, symbol)).orderBy(desc(marketData.timestamp)).limit(1);
    return data;
  }

  async upsertMarketData(data: typeof marketData.$inferInsert): Promise<MarketData> {
    const [newData] = await db.insert(marketData).values(data).returning();
    return newData;
  }

  async getCoins(): Promise<Coin[]> {
    return await db.select().from(coins);
  }

  async upsertCoin(coin: typeof coins.$inferInsert): Promise<Coin> {
    const [newCoin] = await db.insert(coins).values(coin)
      .onConflictDoUpdate({ target: coins.symbol, set: { name: coin.name } })
      .returning();
    return newCoin;
  }
}

export const storage = new DatabaseStorage();
