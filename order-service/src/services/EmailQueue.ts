import Bull from "bull";
const emailQueue = new Bull("email-queue", {
    redis: {
        host: "localhost",
        port: 6379,
    },
});

export default emailQueue;