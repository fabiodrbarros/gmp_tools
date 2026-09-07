#!/bin/sh
set -e

echo "→ A garantir o esquema da base de dados (${DATABASE_URL})…"
npx prisma db push

# Seed demo data only when explicitly requested (SEED_ON_START=true)
if [ "${SEED_ON_START}" = "true" ]; then
  echo "→ A semear dados de demonstração…"
  node prisma/seed.mjs || echo "  (seed ignorado / já existente)"
fi

echo "→ A iniciar o Next.js na porta ${PORT:-3000}…"
exec npm run start -- -H 0.0.0.0 -p "${PORT:-3000}"
