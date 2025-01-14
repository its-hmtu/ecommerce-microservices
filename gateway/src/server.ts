import express, {Request, Response, NextFunction} from "express";
import {createProxyMiddleware} from "http-proxy-middleware"
import {consulClient} from "./consulClient"

const app = express();
const PORT = process.env.PORT || 8080;

interface RequestWithProxyTarget extends Request {
  proxyTarget?: string;
}

const serviceDiscoveryMiddleware = async (req: RequestWithProxyTarget, res: Response, next: NextFunction) => {
  const serviceName = req.params.service;
  try {
    const services = await consulClient.getService(serviceName);

    if (services.length === 0) {
      res.status(503).json({message: `Service ${serviceName} unavailable`});
      return;
    }

    const {address, port } = services[Math.floor(Math.random() * services.length)];
    req.proxyTarget = `http://${address}:${port}`;
    next();
  } catch (e: any) {
    console.error("Error getting service: ", e);
    res.status(500).json({message: "Error getting service"});
  }
}

app.use("/api/:service/*", serviceDiscoveryMiddleware, (req: RequestWithProxyTarget, res: Response, next: NextFunction) => {
  const proxy = createProxyMiddleware({
    target: req.proxyTarget,
    changeOrigin: true,
    pathRewrite: {
      "^/api/:service": ""
    }
  });
  proxy(req, res, next);
})

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({message: "Gateway is healthy"})
});

app.listen(PORT, () => {
  console.log(`Gateway listening on port ${PORT}`);
})