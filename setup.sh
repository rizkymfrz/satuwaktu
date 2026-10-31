#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
CONTAINER=satuwaktu-postgres
READY_ATTEMPTS=30
step() { printf '\n==> %s\n' "$1"; }
die() { printf 'ERROR: %s\n' "$1" >&2; exit 1; }
copy_env() {
  local example=$1 target=$2
  if [ -f "$target" ]; then
    echo "keep $target"
  else
    cp "$example" "$target"
    echo "created $target"
  fi
}
database_ready() {
  pnpm --silent --filter @repo/db db:create >/dev/null 2>&1
}
start_postgres_container() {
  if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER"; then
    docker start "$CONTAINER" >/dev/null
  else
    docker run -d --name "$CONTAINER" \
      -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=satuwaktu \
      -p 5432:5432 -v satuwaktu-pgdata:/var/lib/postgresql/data \
      postgres:17 >/dev/null
  fi
  for _ in $(seq "$READY_ATTEMPTS"); do
    database_ready && return 0
    sleep 1
  done
  die "Postgres container did not become ready"
}
step "Checking tools"
command -v node >/dev/null || die "node >= 24 is required"
[ "$(node -p 'process.versions.node.split(".")[0]')" -ge 24 ] || die "node >= 24 is required"
if ! command -v pnpm >/dev/null; then
  command -v corepack >/dev/null || die "pnpm is required"
  corepack enable
fi
step "Installing dependencies"
pnpm install
step "Creating env files"
copy_env apps/api/.env.example apps/api/.env
copy_env packages/db/.env.example packages/db/.env
copy_env apps/mobile/.env.example apps/mobile/.env.local
if grep -qE '^JWT_SECRET=[[:space:]]*$' apps/api/.env; then
  secret=$(node -p 'require("node:crypto").randomBytes(32).toString("hex")')
  sed -i "s|^JWT_SECRET=[[:space:]]*$|JWT_SECRET=$secret|" apps/api/.env
  echo "generated JWT_SECRET in apps/api/.env"
fi
step "Preparing database"
if ! database_ready; then
  command -v docker >/dev/null || {
    pnpm --silent --filter @repo/db db:create || true
    die "Postgres is not reachable. Start it, fix DATABASE_URL in packages/db/.env and apps/api/.env, or install Docker"
  }
  start_postgres_container
fi
pnpm --silent --filter @repo/db db:create
step "Generating Prisma client"
pnpm --filter @repo/db db:generate
step "Applying migrations"
pnpm --filter @repo/db db:deploy
step "Seeding"
pnpm --filter @repo/db db:seed
step "Building (except mobile)"
pnpm exec turbo run build --ui=stream --filter='!mobile'
step "Done"
echo "API:    pnpm --filter api start:dev"
echo "Web:    pnpm --filter web dev"
echo "Mobile: pnpm --filter mobile start"
echo "All:    pm2 startOrReload ecosystem.config.cjs && pm2 save"
