import { createClient, RedisClientType } from 'redis';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

export class RedisManager {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      url: config.REDIS_URL,
      password: config.REDIS_PASSWORD,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      logger.info('Redis client connected');
    });

    this.client.on('ready', () => {
      this.isConnected = true;
      logger.info('Redis client ready');
    });

    this.client.on('error', (error) => {
      logger.error('Redis client error:', error);
      this.isConnected = false;
    });

    this.client.on('end', () => {
      this.isConnected = false;
      logger.info('Redis client disconnected');
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis client reconnecting...');
    });
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      logger.info('Redis connection established successfully');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.disconnect();
      logger.info('Redis connection closed');
    }
  }

  // Basic Redis operations
  public async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  public async set(key: string, value: string): Promise<boolean> {
    try {
      await this.client.set(key, value);
      return true;
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
      return false;
    }
  }

  public async setex(key: string, seconds: number, value: string): Promise<boolean> {
    try {
      await this.client.setEx(key, seconds, value);
      return true;
    } catch (error) {
      logger.error(`Redis SETEX error for key ${key}:`, error);
      return false;
    }
  }

  public async del(key: string): Promise<boolean> {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  public async expire(key: string, seconds: number): Promise<boolean> {
    try {
      await this.client.expire(key, seconds);
      return true;
    } catch (error) {
      logger.error(`Redis EXPIRE error for key ${key}:`, error);
      return false;
    }
  }

  // Hash operations
  public async hget(key: string, field: string): Promise<string | null> {
    try {
      return await this.client.hGet(key, field);
    } catch (error) {
      logger.error(`Redis HGET error for key ${key}, field ${field}:`, error);
      return null;
    }
  }

  public async hset(key: string, field: string, value: string): Promise<boolean> {
    try {
      await this.client.hSet(key, field, value);
      return true;
    } catch (error) {
      logger.error(`Redis HSET error for key ${key}, field ${field}:`, error);
      return false;
    }
  }

  public async hgetall(key: string): Promise<Record<string, string> | null> {
    try {
      return await this.client.hGetAll(key);
    } catch (error) {
      logger.error(`Redis HGETALL error for key ${key}:`, error);
      return null;
    }
  }

  // List operations
  public async lpush(key: string, ...values: string[]): Promise<number | null> {
    try {
      return await this.client.lPush(key, values);
    } catch (error) {
      logger.error(`Redis LPUSH error for key ${key}:`, error);
      return null;
    }
  }

  public async rpush(key: string, ...values: string[]): Promise<number | null> {
    try {
      return await this.client.rPush(key, values);
    } catch (error) {
      logger.error(`Redis RPUSH error for key ${key}:`, error);
      return null;
    }
  }

  public async lrange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      return await this.client.lRange(key, start, stop);
    } catch (error) {
      logger.error(`Redis LRANGE error for key ${key}:`, error);
      return [];
    }
  }

  public async ltrim(key: string, start: number, stop: number): Promise<boolean> {
    try {
      await this.client.lTrim(key, start, stop);
      return true;
    } catch (error) {
      logger.error(`Redis LTRIM error for key ${key}:`, error);
      return false;
    }
  }

  // Set operations
  public async sadd(key: string, ...members: string[]): Promise<number | null> {
    try {
      return await this.client.sAdd(key, members);
    } catch (error) {
      logger.error(`Redis SADD error for key ${key}:`, error);
      return null;
    }
  }

  public async smembers(key: string): Promise<string[]> {
    try {
      return await this.client.sMembers(key);
    } catch (error) {
      logger.error(`Redis SMEMBERS error for key ${key}:`, error);
      return [];
    }
  }

  public async sismember(key: string, member: string): Promise<boolean> {
    try {
      return await this.client.sIsMember(key, member);
    } catch (error) {
      logger.error(`Redis SISMEMBER error for key ${key}, member ${member}:`, error);
      return false;
    }
  }

  // Sorted set operations
  public async zadd(key: string, score: number, member: string): Promise<number | null> {
    try {
      return await this.client.zAdd(key, { score, value: member });
    } catch (error) {
      logger.error(`Redis ZADD error for key ${key}:`, error);
      return null;
    }
  }

  public async zrange(key: string, start: number, stop: number, withScores: boolean = false): Promise<string[]> {
    try {
      if (withScores) {
        const result = await this.client.zRangeWithScores(key, start, stop);
        return result.map(item => `${item.value}:${item.score}`);
      } else {
        return await this.client.zRange(key, start, stop);
      }
    } catch (error) {
      logger.error(`Redis ZRANGE error for key ${key}:`, error);
      return [];
    }
  }

  public async zrevrange(key: string, start: number, stop: number, withScores: boolean = false): Promise<string[]> {
    try {
      if (withScores) {
        const result = await this.client.zRevRangeWithScores(key, start, stop);
        return result.map(item => `${item.value}:${item.score}`);
      } else {
        return await this.client.zRevRange(key, start, stop);
      }
    } catch (error) {
      logger.error(`Redis ZREVRANGE error for key ${key}:`, error);
      return [];
    }
  }

  // Cache helper methods
  public async cacheGet<T>(key: string): Promise<T | null> {
    try {
      const value = await this.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  public async cacheSet<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        return await this.setex(key, ttl, serialized);
      } else {
        return await this.set(key, serialized);
      }
    } catch (error) {
      logger.error(`Cache SET error for key ${key}:`, error);
      return false;
    }
  }

  public get connected(): boolean {
    return this.isConnected;
  }
}