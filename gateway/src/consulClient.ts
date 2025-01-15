import Consul from "consul";

export class ConsulClient {
  private consul: Consul

  constructor() {
    this.consul = new Consul()
  }

  async getService(serviceName: string): Promise<{ address: string; port: number }[]> {
    const services = await this.consul.health.service(serviceName);

    // Kiểm tra nếu `services` là mảng hợp lệ
    if (!Array.isArray(services) || services.length === 0) {
      throw new Error(`No services found for ${serviceName}`);
    }

    // Lấy danh sách các service từ mảng trả về
    return services.map((service: any) => {
      const { Address, Port } = service.Service;
      return { address: Address || "127.0.0.1", port: Port };
    });
  }
}

export const consulClient = new ConsulClient();