// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
// "In development, the command next dev clears Node.js cache on run.
// This in turn initializes a new PrismaClient instance each time due to hot reloading
// that creates a connection to the database. This can quickly exhaust the database connections
// as each PrismaClient instance holds its own connection pool.""

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
