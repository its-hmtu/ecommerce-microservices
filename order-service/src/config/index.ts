import { config } from 'dotenv';
const configFile = `./.env`;

config({ path: configFile });

const { MONGO_URI, PORT, JWT_SECRET, NODE_ENV, MESSAGE_BROKER_URI, REDIS_URL } = process.env;
const queue = {notifications: "NOTIFICATIONS"}

export default {
  MONGO_URI,
  PORT,
  JWT_SECRET,
  env: NODE_ENV,
  msgBrokerUri: MESSAGE_BROKER_URI,
  queue,
  redisUrl: REDIS_URL
}