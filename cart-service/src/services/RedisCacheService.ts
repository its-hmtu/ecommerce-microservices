import { createClient } from "redis";
import config from "../config";

class RedisCacheService {
  private redisClient: any;

  // constructor() {
  //   this.init()
  // }

  async init() {
    this.redisClient = createClient({
      url: config.redisUrl
    })

    this.redisClient.on("connect", () => {
      console.log("Redis connected")
    })

    this.redisClient.on("error", (err: any) => { 
      console.error("Redis error: ", err)
    })

    this.redisClient.connect();
  }

  async setCache(key: string, value: any) {
    await this.redisClient.set(key, JSON.stringify(value), {EX: 60 * 60});
  }

  async getCache(key: string) {
    const data = await this.redisClient.get(key);

    return data ? JSON.parse(data) : null
  }

  async clearCache(key?: string) {
    await this.redisClient.del(key)
  }
}

export const redisCacheService = new RedisCacheService();

// export const setCache = async (key: string, value: any) => {
//   await redisClient.set(key, JSON.stringify(value), {EX: 60 * 60});
// }

// export const getCache = async (key: string) => {
//   const data = await redisClient.get(key);

//   return data ? JSON.parse(data) : null
// }

// export const clearCache = async (key: string) => {
//   await redisClient.del(key)
// }