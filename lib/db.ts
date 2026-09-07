import { PrismaClient } from "@prisma/client";
import { PrismaLibSql as PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const DB_URL = process.env.DATABASE_URL ?? "file:prisma/dev.db";

function makePrisma() {
  // PrismaLibSql is a factory that takes a libsql config object ({ url })
  // and creates the client internally — do NOT pass a pre-built client.
  const adapter = new PrismaLibSQL({ url: DB_URL });
  return new PrismaClient({ adapter } as never);
}

export const db = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
