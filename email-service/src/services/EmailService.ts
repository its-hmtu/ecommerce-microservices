import { createTransport, Transport, Transporter } from "nodemailer";
import config from "../config";

class EmailService {
  private transporter!: Transporter;

  constructor() {
    this.init();
  }

  async init() {
    this.transporter = createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort),
      service: config.smtpService,
      secure: false,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: config.smtpFrom,
        to,
        subject,
        text,
        html,
      })

      console.log("Email sent: ", info.messageId);
    } catch (e: any) {
      console.error("Error while sending email: ", e.message);
    }
  }
}

export const emailService = new EmailService();
