import express, { Express, Request, RequestHandler, Response } from "express";
import { Server } from "http";
import userRouter from "./routes";
import { errorConverter, errorHandler } from "./middlewares";
import { connectDb } from "./database";
import config from "./config";
import { rabbitMQService } from "./services/RabbitMQService";
import morgan from "morgan";
import { registerService } from "./config/consulClient";

const logger = morgan("dev");
const app: Express = express();
let server: Server;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get("/health", (req: Request, res: Response) => {
  res.json({
    ok: true,
    environment: config.env,
  })
})
app.use(userRouter);

server = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

connectDb();

registerService("user-service", Number(config.PORT));

app.use(errorConverter);
app.use(errorHandler);


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
// };

// const unexpectedErrorHandler = (error: Error) => {
//   console.error(error);
//   exitHandler();
// };

// process.on("uncaughtException", unexpectedErrorHandler);
// process.on("unhandledRejection", unexpectedErrorHandler);
