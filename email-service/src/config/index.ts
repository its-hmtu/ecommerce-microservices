import { config } from 'dotenv';
const configFile = `./.env`;

config({ path: configFile });

const { PORT, JWT_SECRET, NODE_ENV, MESSAGE_BROKER_URI, SMTP_HOST, SMTP_PORT, SMTP_SERVICE, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

export default {
  PORT,
  JWT_SECRET,
  env: NODE_ENV,
  msgBrokerUri: MESSAGE_BROKER_URI,
  smtpHost: SMTP_HOST,
  smtpPort: SMTP_PORT,
  smtpService: SMTP_SERVICE,
  smtpUser: SMTP_USER,
  smtpPass: SMTP_PASS,
  smtpFrom: SMTP_FROM,
}