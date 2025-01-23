import { createTransport, Transport, Transporter } from "nodemailer";
import config from "../config";
import fs from "fs";
import path from "path";

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

  async sendEmail(to: string, subject: string, text: string) {
    try {
      const templatePath = path.join(__dirname, "../templates/email.template.html");
      let html = fs.readFileSync(templatePath, "utf-8");

      html = html.replace("{{subject}}", subject).replace("{{content}}", text).replace("{{year}}", new Date().getFullYear().toString());

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
