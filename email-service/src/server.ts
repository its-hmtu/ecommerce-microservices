import express, {Express, RequestHandler} from 'express';
import {Server} from "http";
import { errorConverter, errorHandler } from './middlewares';
import config from './config';
import { rabbitMQService } from './services/RabbitMQService';

const app:Express = express();
let server:Server;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(errorConverter);
app.use(errorHandler);


server = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
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

app.get('/', (req, res) => {
  res.send('Hello World');
})