# Proxydeck

Web dashboard for managing Caddy and Traefik reverse proxies. Single app: Elysia (Bun) + React SSR, Oat UI.

## Requirements

- Bun
- PostgreSQL
- Caddy or Traefik (optional; detected at runtime)

## Setup

1. Clone and install:

   ```bash
   bun install
   ```

2. Create DB and run schema:

   ```bash
   createdb proxydeck
   export DATABASE_URL="postgres://user:pass@localhost:5432/proxydeck"
   bun run db:migrate
   ```

3. Set env and run:

   ```bash
   export BETTER_AUTH_SECRET="$(openssl rand -base64 32)"
   export BETTER_AUTH_URL="http://localhost:3000"
   bun run build:client
   bun run start
   ```

4. Open http://localhost:3000. Sign up once (first user only), then log in.

## Env

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 3000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Auth secret (min 32 chars) |
| `BETTER_AUTH_URL` | Base URL of the app |
| `CADDY_ADMIN` | Caddy admin API (default http://localhost:2019) |
| `TRAEFIK_API_URL` | Traefik API (default http://localhost:8080) |
| `TRAEFIK_DYNAMIC_CONFIG` | Path for Traefik dynamic config file |
| `PROXY_LOG_FILE` | Optional path to proxy log file |

## Docker

```bash
docker build -t proxydeck .
docker run -p 3000:3000 -e DATABASE_URL=... -e BETTER_AUTH_SECRET=... proxydeck
```

## Scripts

- `bun run dev` – dev server with hot reload
- `bun run build:client` – build React bundle
- `bun run start` – run server (run build:client first)
- `bun run db:migrate` – apply schema.sql
