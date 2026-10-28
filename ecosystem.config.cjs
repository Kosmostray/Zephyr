module.exports = {
  apps: [
    {
      name: "zephyr",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
