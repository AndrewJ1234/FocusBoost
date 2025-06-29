import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  
  // Database
  DATABASE_URL: z.string().default('postgresql://postgres:password@localhost:5432/focusboost'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default('5432'),
  DB_NAME: z.string().default('focusboost'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('password'),
  
  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  
  // JWT
  JWT_SECRET: z.string().default('your-super-secret-jwt-key-change-in-production'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().default('your-refresh-secret-key'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  
  // Email
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_USER: z.string().default(''),
  SMTP_PASSWORD: z.string().default(''),
  FROM_EMAIL: z.string().default('noreply@focusboost.com'),
  
  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('10485760'), // 10MB
  UPLOAD_PATH: z.string().default('./uploads'),
  
  // External APIs
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  
  // Security
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'), // 15 minutes
  RATE_LIMIT_MAX: z.string().transform(Number).default('1000'),
  
  // Monitoring
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  ENABLE_METRICS: z.string().transform(Boolean).default('true'),
});

export const config = envSchema.parse(process.env);

export type Config = z.infer<typeof envSchema>;