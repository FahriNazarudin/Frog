module.exports = {
  apps: [
    {
      name: "gc01-p3",
      script: "./index.js",
      env: {
        MONGODB_URI:
          "mongodb+srv://fahrihacktiv8:HXE3FN8aJqFZTjsg@cluster0.gjc0utf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        JWT_SECRET: "SECRET_KEY",
        REDIS_URL:
          "rredis://default:L4EoNZ6XloqPMPPZYrBMH5Tlj63G67pe@redis-18984.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com:18984",
        PORT: 80,
      },
    },
  ],
};
