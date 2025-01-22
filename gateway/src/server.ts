import express, { Request, Response, NextFunction } from 'express';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import cors from 'cors';
import { consulClient } from './consulClient';

const app = express();

const logger = morgan('dev');

// const auth = proxy('http://localhost:8081')
// const products = proxy('http://localhost:8082')
// const cart = proxy('http://localhost:8083')
// const orders = proxy('http://localhost:8085')
// const payment = proxy('http://localhost:8086')

const createProxyMiddleware = (serviceName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const services = await consulClient.getService(serviceName)

      if (services.length > 0) {
        const { address, port } = services[0];
        const target = `http://${address}:${port}`;
        proxy(target)
      }
    } catch (error) {
      
    }
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: 'http://localhost:8000',
    credentials: true,
  }
));
app.use(logger);


app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/cart', cart);
app.use('/api/orders', orders);
app.use('/api/payment', payment);

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,

  })
});

const server = app.listen(8080, () => {
  console.log('Gateway is running on port 8080');
});

consulClient.getService("user-service").then((services) => {
  console.log(services);
}).catch((error) => {
  console.error(error);
}).finally(() => {
  console.log('Done');
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.info('Server closed');
      process.exit(1);
    })
  } else {
    process.exit(1);
  }
}

const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
  exitHandler();
}

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);