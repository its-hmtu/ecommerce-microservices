import express, {Express, Request, Response, NextFunction} from 'express';
import {Server} from "http";
import router from './routes';
import { errorConverter, errorHandler } from './middlewares';
import { connectDb } from './database';
import config from './config';
import { rabbitMQService } from './services/RabbitMQService';
import morgan from 'morgan';
import winston from 'winston';
import { registerService } from './config/consulClient';
require('winston-logstash');

const app:Express = express();
let server:Server;
const logger = morgan('dev')


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(logger);
app.get('/health', (req: Request, res: Response) => {
  res.json({
    ok: true,
    environment: config.env
  })
})
app.use(router);


server = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
})

connectDb();
registerService('product-service', Number(config.PORT));

app.use(errorConverter);
app.use(errorHandler);
// const initializeRabbitMQ = async () => {
//   try {
//     await rabbitMQService.init();
//     console.log("RabbitMQ client initialized and listening for messages");
//   } catch (e) {
//     console.error("Error initializing RabbitMQ client: ", e);
//   }
// }

// initializeRabbitMQ();

// const exitHandler = () => {
//   if (server) {
//     server.close(() => {
//       console.log("Server closed");
//       process.exit(1);
//     });
//   } else {
//     process.exit(1);
//   }
// }

// const unexpectedErrorHandler = (error: Error) => {
//   console.error(error);
//   exitHandler();
// }

// process.on("uncaughtException", unexpectedErrorHandler);
// process.on("unhandledRejection", unexpectedErrorHandler);