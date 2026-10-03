import { PrismaClient } from "@prisma/client";

/**
 * Один клиент Prisma на процесс. В разработке Next перезагружает модули при
 * каждом изменении, и без этого кэша открывались бы всё новые подключения
 * к базе, пока она не откажется их принимать.
 */
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
