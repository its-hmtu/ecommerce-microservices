module.exports = {
  apps: [
    {
      name: "gateway",
      script: "npm",
      args: "run dev",
      cwd: "./gateway",
      watch: true,
      interpreter: "node",
      env: {
        NODE_ENV: "development",
      },
    },
    {
      name: "user-service",
      script: "npm",
      args: "run dev",
      cwd: "./user-service",
      watch: true,
      interpreter: "node",
      env: {
        NODE_ENV: "development",
        PORT: 8081,
        JWT_SECRET: "secret",
        MONGO_URI: "mongodb://localhost:27017/user-service",
        MESSAGE_BROKER_URI:
          "amqps://qpdanbsi:MC6r5HMKW2GukiVsz3oqIE0CJkLeI7zX@armadillo.rmq.cloudamqp.com/qpdanbsi",
      },
    },
  ],
};
