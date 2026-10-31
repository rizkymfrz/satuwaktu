const app = (name, cwd, env = {}) => ({
  name,
  cwd,
  script: "pnpm",
  args: "start",
  interpreter: "none",
  env,
});

module.exports = {
  apps: [
    app("api", "apps/api"),
    app("web", "apps/web", { PORT: 3000 }),
    app("mobile", "apps/mobile", { CI: 1 }),
  ],
};
