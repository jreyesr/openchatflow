import { env } from "process";

import { PrismaClient } from "@prisma/client";
import assert from "assert/strict";

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

const prisma = new PrismaClient();

async function main() {
  console.log(await prisma.conversationTemplate.findMany({}));
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

console.log("Done registering webhooks! Bye...");
