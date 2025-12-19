import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./models/auth";

// === COINS ===
export const coins = pgTable("coins", {
  symbol: varchar("symbol").primaryKey(), // e.g., BTCUSDT
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true),
});

// === PREDICTIONS ===
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  coinSymbol: varchar("coin_symbol").notNull(), // FK to coins.symbol (logical)
  timeframe: varchar("timeframe").notNull(), // 1H, 4H, 1D
  direction: varchar("direction").notNull(), // UP, DOWN
  entryPrice: decimal("entry_price").notNull(),
  targetPrice: decimal("target_price").notNull(),
  stopLoss: decimal("stop_loss").notNull(),
  confidenceScore: integer("confidence_score").notNull(), // 0-100
  expectedMovePct: decimal("expected_move_pct"),
  status: varchar("status").default("PENDING"), // PENDING, SUCCESS, FAIL, PARTIAL
  ruleScore: integer("rule_score"),
  mlProbability: integer("ml_probability"),
  lstmConfidence: integer("lstm_confidence"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  resultOutcome: varchar("result_outcome"), // SUCCESS, FAIL
});

// === RANKINGS ===
export const rankings = pgTable("rankings", {
  id: serial("id").primaryKey(),
  coinSymbol: varchar("coin_symbol").notNull(),
  rankScore: decimal("rank_score").notNull(),
  rankType: varchar("rank_type").notNull(), // TOP_OPPORTUNITY, TOP_RISK
  timeframe: varchar("timeframe").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === MARKET DATA (SNAPSHOTS) ===
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  coinSymbol: varchar("coin_symbol").notNull(),
  price: decimal("price").notNull(),
  volume: decimal("volume"),
  rsi: decimal("rsi"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === SCHEMAS ===
export const insertCoinSchema = createInsertSchema(coins);
export const insertPredictionSchema = createInsertSchema(predictions).omit({ id: true, createdAt: true });
export const insertRankingSchema = createInsertSchema(rankings).omit({ id: true, createdAt: true });
export const insertMarketDataSchema = createInsertSchema(marketData).omit({ id: true, timestamp: true });

// === TYPES ===
export type Coin = typeof coins.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;
export type Ranking = typeof rankings.$inferSelect;
export type MarketData = typeof marketData.$inferSelect;

export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type InsertRanking = z.infer<typeof insertRankingSchema>;
