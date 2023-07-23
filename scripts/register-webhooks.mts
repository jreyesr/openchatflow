import { env } from "process";

import { default as prismaClient } from "../src/lib/prisma";
import assert from "assert/strict";
import { PrismaClient } from "@prisma/client";

type VercelEnv = "development" | "preview" | "production";

console.log("Registering webhooks...");

const environ: VercelEnv = (env.VERCEL_ENV as VercelEnv) ?? "development";

// WARN: Is this good? Is this vendor lock-in? Don't know yet
// In case of emergencies, add this to the .env file manually
// assert(env.VERCEL === "1", `Trying to run script outside of Vercel`);
// assert(
//   ["preview", "production"].includes(environ),
//   `Trying to run on environment ${environ}, only supported on test and prod`
// );
const prisma: PrismaClient = prismaClient.makeClient();

async function main() {
  const bots = await prisma.telegramBot.findMany({});

  for (const bot of bots) {
    console.log(bot.id, bot.name, bot.username, bot.token);
  }

  console.log("Done registering webhooks! Bye...");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
