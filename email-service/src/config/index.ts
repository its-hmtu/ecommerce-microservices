import { config } from 'dotenv';
const configFile = `./.env`;

config({ path: configFile });

const { PORT, JWT_SECRET, NODE_ENV, MESSAGE_BROKER_URI, STMP_HOST, STMP_PORT, STMP_SERVICE, STMP_USER, STMP_PASS, STMP_FROM } = process.env;

export default {
  PORT,
  JWT_SECRET,
  env: NODE_ENV,
  msgBrokerUri: MESSAGE_BROKER_URI,
  smtpHost: STMP_HOST,
  smtpPort: STMP_PORT,
  smtpService: STMP_SERVICE,
  smtpUser: STMP_USER,
  smtpPass: STMP_PASS,
  smtpFrom: STMP_FROM,
}