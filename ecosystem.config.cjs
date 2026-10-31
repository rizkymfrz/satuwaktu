module.exports = {
  apps: [
    {
      name: "api",
      cwd: "apps/api",
      script: "dist/main.js",
    },
    {
      name: "mobile",
      cwd: "apps/mobile",
      script: "pnpm",
      args: "exec expo start --tunnel",
      interpreter: "none",
      env: { CI: false },
    },
  ],
};
