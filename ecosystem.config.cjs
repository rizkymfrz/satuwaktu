const app = (name, cwd, env = {}, args = "start") => ({
  name,
  cwd,
  script: "pnpm",
  args,
  interpreter: "none",
  env,
});

module.exports = {
  apps: [
    app("api", "apps/api"),
    app("web", "apps/web", { PORT: 3000 }),
    app("mobile", "apps/mobile", { CI: false }, "exec expo start --tunnel"),
  ],
};
