module.exports = {
  apps: [
    {
      name: "app1",
      script: "./dist/index.js",
      instances: "max",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
