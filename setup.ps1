$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$Container = 'satuwaktu-postgres'
$ReadyAttempts = 30
function Step($Message) { Write-Host "`n==> $Message" }
function Fail($Message) { Write-Host "ERROR: $Message" -ForegroundColor Red; exit 1 }
function Invoke-Native {
    param([scriptblock]$Command)
    & $Command
    if ($LASTEXITCODE -ne 0) { Fail "Command failed: $Command" }
}
function Copy-Env($Example, $Target) {
    if (Test-Path $Target) {
        Write-Host "keep $Target"
    } else {
        Copy-Item $Example $Target
        Write-Host "created $Target"
    }
}
function Test-DatabaseReady {
    $ErrorActionPreference = 'Continue'
    pnpm --silent --filter '@repo/db' db:create *> $null
    return $LASTEXITCODE -eq 0
}
function Start-PostgresContainer {
    $existing = docker ps -a --format '{{.Names}}'
    if ($existing -contains $Container) {
        docker start $Container | Out-Null
    } else {
        docker run -d --name $Container `
            -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=satuwaktu `
            -p 5432:5432 -v satuwaktu-pgdata:/var/lib/postgresql/data `
            postgres:17 | Out-Null
    }
    if ($LASTEXITCODE -ne 0) { Fail 'Could not start the Postgres container' }
    for ($i = 0; $i -lt $ReadyAttempts; $i++) {
        if (Test-DatabaseReady) { return }
        Start-Sleep -Seconds 1
    }
    Fail 'Postgres container did not become ready'
}
Step 'Checking tools'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Fail 'node >= 24 is required' }
if ([version]((node -v).TrimStart('v')) -lt [version]'24.0') { Fail 'node >= 24 is required' }
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    if (-not (Get-Command corepack -ErrorAction SilentlyContinue)) { Fail 'pnpm is required' }
    Invoke-Native { corepack enable }
}
Step 'Installing dependencies'
Invoke-Native { pnpm install }
Step 'Creating env files'
Copy-Env 'apps/api/.env.example' 'apps/api/.env'
Copy-Env 'packages/db/.env.example' 'packages/db/.env'
Copy-Env 'apps/mobile/.env.example' 'apps/mobile/.env.local'
$apiEnv = Join-Path $PSScriptRoot 'apps/api/.env'
$envText = [IO.File]::ReadAllText($apiEnv)
if ($envText -match '(?m)^JWT_SECRET=\r?$') {
    $bytes = [byte[]]::new(32)
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $secret = -join ($bytes | ForEach-Object { $_.ToString('x2') })
    $envText = $envText -replace '(?m)^JWT_SECRET=(\r?)$', "JWT_SECRET=$secret`$1"
    [IO.File]::WriteAllText($apiEnv, $envText)
    Write-Host 'generated JWT_SECRET in apps/api/.env'
}
Step 'Preparing database'
if (-not (Test-DatabaseReady)) {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        pnpm --silent --filter '@repo/db' db:create
        Fail 'Postgres is not reachable. Start it, fix DATABASE_URL in packages/db/.env and apps/api/.env, or install Docker'
    }
    Start-PostgresContainer
}
Invoke-Native { pnpm --silent --filter '@repo/db' db:create }
Step 'Generating Prisma client'
Invoke-Native { pnpm --filter '@repo/db' db:generate }
Step 'Applying migrations'
Invoke-Native { pnpm --filter '@repo/db' db:deploy }
Step 'Seeding'
Invoke-Native { pnpm --filter '@repo/db' db:seed }
Step 'Building (except web and mobile)'
Invoke-Native { pnpm exec turbo run build --ui=stream --filter='!web' --filter='!mobile' }
Step 'Done'
Write-Host 'API:    pnpm --filter api start:dev'
Write-Host 'Web:    pnpm --filter web dev'
Write-Host 'Mobile: pnpm --filter mobile start'
