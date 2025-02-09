import Bull from "bull";
import { emailService } from "./EmailService";
import config from "../config";

const emailQueue = new Bull("email-queue", {
  redis: {
    host: "localhost",
    port: 6379,
  },
});

emailQueue.process(async (job) => {
  const { to, subject, text } = job.data;
  console.log("Received email request: ", { to, subject });
  await emailService.sendEmail(to, subject, text );
});

emailQueue.on("completed", (job) => {
  console.log(`Job with id ${job.id} has been completed`);
});

export default emailQueue