import Consul from "consul";

export class ConsulClient {
  private consul: Consul

  constructor() {
    this.consul = new Consul()
  }

  async getService(serviceName: string): Promise<{address: string, port: number}[]> {
    const services = await this.consul.health.service(serviceName);
    return services[1].map((service: any) => ({
      address: service.Service.Address,
      port: service.Service.Port
    }))
  }
}

export const consulClient = new ConsulClient();