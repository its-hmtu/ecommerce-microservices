import express, { Express, RequestHandler } from "express";
import { Server } from "http";
import userRouter from "./routes";
import { errorConverter, errorHandler } from "./middlewares";
import { connectDb } from "./database";
import config from "./config";
import { rabbitMQService } from "./services/RabbitMQService";
import morgan from "morgan";

const app: Express = express();
let server: Server;
const logger = morgan("dev");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(errorConverter);
app.use(errorHandler);
app.use(userRouter);

connectDb();

server = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

const initializeRabbitMQ = async () => {
  try {
    await rabbitMQService.init();
    console.log("RabbitMQ client initialized and listening for messages");
  } catch (e) {
    console.error("Error initializing RabbitMQ client: ", e);
  }
};

// initializeRabbitMQ();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
