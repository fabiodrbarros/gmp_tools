# Deploy — GMP Tools (Docker + VPS + Cloudflare)

Next.js 16 app with a SQLite database (Prisma + libSQL). Runs in a single container.
The database and uploaded images live in **Docker volumes**, so they survive rebuilds.

## 1. Requirements on the VPS

- Docker + Docker Compose plugin
  ```bash
  curl -fsSL https://get.docker.com | sh
  ```

## 2. Get the code onto the VPS

Copy the project folder to the server (git clone, `scp`, rsync…). Then `cd` into it.

## 3. Configure environment

```bash
cp .env.production.example .env
nano .env
```
Fill in at least:
- `ADMIN_USER` / `ADMIN_PASSWORD` — admin login
- `ADMIN_TOKEN` — a random secret: `openssl rand -hex 24`
- `NEXT_PUBLIC_SITE_URL` — your domain (e.g. `https://gmptools.pt`)
- `SEED_ON_START=true` **for the first boot only** (loads demo products/machines/categories)
- `COOKIE_SECURE=true` (keep true — Cloudflare serves HTTPS)

## 4. Build & run

```bash
docker compose up -d --build
```
First boot creates the DB schema automatically and (if `SEED_ON_START=true`) seeds demo data.
The site is now on `http://<vps-ip>:3000`.

> After the first successful boot, set `SEED_ON_START=false` in `.env` and `docker compose up -d` again, so it doesn't try to re-seed.

- Admin panel: `http://<vps-ip>:3000/gmp-panel-admin`
- Logs: `docker compose logs -f`
- Update after code changes: `docker compose up -d --build`

## 5. Put Cloudflare in front

Two common options:

**A) Cloudflare Tunnel (no open ports — recommended)**
```bash
docker run -d --restart=unless-stopped --network host \
  cloudflare/cloudflared:latest tunnel --no-autoupdate run --token <TUNNEL_TOKEN>
```
In the Cloudflare Zero Trust dashboard, point the tunnel hostname (your domain) to
`http://localhost:3000`. Then restrict the container to localhost by changing the compose port
mapping to `"127.0.0.1:3000:3000"`.

**B) DNS + reverse proxy**
Point an A record (proxied / orange cloud) at the VPS IP, and run a reverse proxy
(Caddy/Nginx/Traefik) that forwards `:443` → `:3000`. Enable Cloudflare **Full (strict)** SSL.

Either way, because the app sits behind HTTPS, keep `COOKIE_SECURE=true`.

## Data & backups

- Database volume: `gmp-data` (file `/data/gmp.db` inside the container)
- Uploads volume: `gmp-uploads` (`/app/public/uploads`)

Backup:
```bash
docker run --rm -v gmp-tools_gmp-data:/data -v "$PWD":/backup busybox \
  tar czf /backup/gmp-db-$(date +%F).tar.gz -C /data .
```

Bring your **current local data** to the server (optional): copy your local
`prisma/dev.db` into the `gmp-data` volume as `gmp.db` **before** the first start:
```bash
docker volume create gmp-tools_gmp-data
docker run --rm -v gmp-tools_gmp-data:/data -v "$PWD/prisma":/src busybox \
  cp /src/dev.db /data/gmp.db
```
(then leave `SEED_ON_START=false`).

## Notes

- `docker-compose.yml` maps `3000:3000`. With a Cloudflare Tunnel, change it to
  `127.0.0.1:3000:3000` so the port isn't publicly exposed.
- The app renders pages per-request (`force-dynamic`) so the catalog always reflects the DB.
- Image uploads accept up to 10 MB per request (`next.config.ts`).
