import Consul from "consul";
import config from ".";

export const registerService = async (serviceName: string, port?: number) => {
  const consul = new Consul();

  try {
    await consul.agent.service.register({
      id: `${serviceName}-${port}`,
      name: serviceName,
      address: "localhost",
      port,
      check: {
        name: `${serviceName} health check`,
        http: `http://localhost:${port}/health`,
        interval: "10m",
        timeout: "5s",
      }
    })

    console.log(`Service ${serviceName} registered on port ${port}`);
  } catch (e: any) {
    console.error("Error registering service: ", e);
  }
}