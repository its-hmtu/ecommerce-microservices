import Redis from "ioredis";
import config from "../config";

class RedisService {
  private redis: any;

  constructor() {
    this.init();
  }

  async init() {
    this.redis = new Redis({
      port: 6379,
      host: 'localhost',
    })

    this.redis.on("connect", () => {
      console.log(`Redis connected on: ${config.redisUri}`);
    })

    this.redis.on("error", (err: any) => {
      console.error("Redis error: ", err);
    })
  }

  /**
   * Set a value in Redis
   * @param {string} key - The key to set.
   * @param {string|object} value - The value to set (string or JSON).
   * @param {number} ttl - Time to live in seconds (optional).
   */

  async setCache(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const data = typeof value === 'object' ? JSON.stringify(value) : value;
      if (ttl) {
        await this.redis.set(key, data, 'EX', ttl);
      } else {
        await this.redis.set(key, data);
      }
    } catch (err: any) {
      console.error('Error setting cache: ', err);
    }
  }

  /**
   * Get a value from Redis
   * @param {string} key - The key to retrieve.
   * @returns {string|object|null} - The retrieved value (parsed if JSON).
   */

  async getCache(key: string): Promise<string | object | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cache: ', error);
      return null
    }
  }

  /**
   * Delete a key from Redis
   * @param {string} key - The key to delete.
   * @returns {number} a number - The number of keys that were removed.
   */

  async clearCache(key: string): Promise<number> {
    try {
      return await this.redis.del(key);
    } catch (err: any) {
      console.error('Error clearing cache: ', err);
      return 0;
    }
  }

  /**
   * Check if a key exists in Redis
   * @param {string} key - The key to check.
   * @returns {boolean} - True if the key exists, false otherwise.
   */

  async keyExists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Error checking key: ', error);
      return false;
    }
  } 


  /**
   * Disconnect from Redis
   */

  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
      console.log('Redis disconnected');
    } catch (error) {
      console.error('Error disconnecting from Redis: ', error);
    }
  }
}

export default new RedisService();