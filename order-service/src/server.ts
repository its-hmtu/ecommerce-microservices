import express, {Express, RequestHandler} from 'express';
import {Server} from "http";
import orderRouter from './routes';
import { errorConverter, errorHandler } from './middlewares';
import { connectDb } from './database';
import config from './config';
import { redisCacheService } from './services/RedisCacheService';
import { rabbitMQService } from './services/RabbitMQService';
import winston from 'winston';
require('winston-logstash');

const app:Express = express();
let server:Server;
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(orderRouter);
app.use(errorConverter);
app.use(errorHandler);

connectDb();

server = app.listen(config.PORT, () => {
  // console.log(`Server is running on port ${config.PORT}`);
  logger.info(`Server is running on port ${config.PORT}`);
})

const initializeRabbitMQ = async () => {
  try {
    await rabbitMQService.init();
    console.log("RabbitMQ client initialized and listening for messages");
  } catch (e) {
    console.error("Error initializing RabbitMQ client: ", e);
  }
}

initializeRabbitMQ();

const initializeRedis = async () => {
  try {
    await redisCacheService.init();
  } catch (e) {
    console.error("Error initializing Redis client: ", e);
  }
}

initializeRedis();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

const unexpectedErrorHandler = (error: Error) => {
  console.error(error);
  exitHandler();
}

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

app.get('/hello', (req, res) => {
  res.send('Hello World');
})