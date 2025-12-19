import { z } from 'zod';
import { insertPredictionSchema, predictions, rankings, marketData } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  predictions: {
    list: {
      method: 'GET' as const,
      path: '/api/predictions',
      input: z.object({
        coin: z.string().optional(),
        timeframe: z.string().optional(),
        status: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof predictions.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/predictions/:id',
      responses: {
        200: z.custom<typeof predictions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/predictions',
      input: insertPredictionSchema,
      responses: {
        201: z.custom<typeof predictions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  rankings: {
    list: {
      method: 'GET' as const,
      path: '/api/rankings',
      input: z.object({
        timeframe: z.string().optional(),
        type: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof rankings.$inferSelect>()),
      },
    },
  },
  marketData: {
    get: {
      method: 'GET' as const,
      path: '/api/market-data/:symbol',
      responses: {
        200: z.custom<typeof marketData.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type PredictionResponse = z.infer<typeof api.predictions.get.responses[200]>;
export type RankingResponse = z.infer<typeof api.rankings.list.responses[200]>;
