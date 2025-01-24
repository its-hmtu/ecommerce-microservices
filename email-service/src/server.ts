import express, {Express, Request, Response} from 'express';
import {Server} from "http";
import { errorConverter, errorHandler } from './middlewares';
import config from './config';
import { rabbitMQService } from './services/RabbitMQService';
import emailQueue from './services/EmailQueue';

const app:Express = express();
let server:Server;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/health", (req: Request, res: Response)=> {
  res.status(200).json({
    ok: true,
    environment: config.env,
  })
} )

server = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
})

app.use(errorConverter);
app.use(errorHandler);

const initializeRabbitMQ = async () => {
  try {
    await rabbitMQService.init();
    console.log("RabbitMQ client initialized and listening for messages");
  } catch (e) {
    console.error("Error initializing RabbitMQ client: ", e);
  }
}
initializeRabbitMQ();

// const initializeBullQueue = async () => {
//   try {
//     await emailQueue.isReady();
//     console.log("Bull queue initialized and ready to accept jobs");

//   } catch (e) {
//     console.error("Error initializing Bull queue: ", e);
//   }
// }

// initializeBullQueue();

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