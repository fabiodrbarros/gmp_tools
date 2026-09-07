// @ts-nocheck — Prisma 7 config API not yet fully typed
import path from "node:path";
import { defineConfig } from "prisma/config";

const DB_URL = process.env.DATABASE_URL ?? "file:prisma/dev.db";

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: DB_URL,
  },
  migrate: {
    adapter: async () => {
      const { PrismaLibSql } = await import("@prisma/adapter-libsql");
      return new PrismaLibSql({ url: DB_URL });
    },
  },
});
