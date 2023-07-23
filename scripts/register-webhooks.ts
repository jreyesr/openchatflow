import { env } from "process";
import assert from "assert/strict";
import axios from "axios";
import debug from "debug";

import "dotenv/config";

import { makeClient } from "../src/lib/prisma";
import { PrismaClient } from "@prisma/client";

const logger = debug("register-webhooks");

type VercelEnv = "development" | "preview" | "production";
type WebhookGateway = "direct" | "hookdeck";

logger("Registering webhooks...");

const environ: VercelEnv = (env.VERCEL_ENV as VercelEnv) ?? "development";

const backendURL = `https://${
  env.VERCEL_URL ?? "localhost:3000"
}/api/webhook/telegram`;
const webhookURL: string = env.WEBHOOK_GATEWAY_OVERRIDE ?? backendURL;
const webhookVerificationToken = env.WEBHOOK_VERIFICATION_TOKEN;
const hookdeckApiToken = env.WEBHOOK_HOOKDECK_API_TOKEN;

// WARN: Is this good? Is this vendor lock-in? Don't know yet
// In case of emergencies, add this to the .env file manually
// assert(env.VERCEL === "1", `Trying to run script outside of Vercel`);
// assert(
//   ["preview", "production"].includes(environ),
//   `Trying to run on environment ${environ}, only supported on test and prod`
// );
const prisma: PrismaClient = makeClient();

type SetTokenResponse = { ok: boolean; result: boolean; description: string };
/**
 * Registers a bot (identified by its secret token) so it sends webhooks to the passed URL
 * @param botToken Secret bot token
 * @param destinationURL Telegram will send bot updates to this URL
 * @param verificationToken If set, this token will be provided by Telegram on every webhook call, so
 *  the application can verify that the update really comes from Telegram
 * @returns Whether the registration succeeded or not
 */
async function registerWithTelegram(
  botToken: string,
  destinationURL: string,
  verificationToken?: string
): Promise<SetTokenResponse> {
  let body: any = { url: destinationURL };
  if (verificationToken) {
    body.secret_token = verificationToken;
  }

  const resp = await axios.post(
    `https://api.telegram.org/bot${botToken}/setWebhook`,
    body
  );
  // The /setWebhook endpoint returns a plain True/False boolean
  return resp.data;
}

/**
 * Uses the Hookdeck API to point a destination (backend URL) to us
 * @param env The environment, it's used to generate the name of the destination that will be changed
 * @param hookdeckApiToken A Hookdeck API key, see https://hookdeck.com/api-ref#authentication
 * @param targetURL Our internal (Vercel) URL, to which webhooks will be forwarded
 */
async function pointHookdeckToUs(
  env: VercelEnv,
  hookdeckApiToken: string | undefined,
  targetURL: string
) {
  logger(`Configuring Hookdeck back-facing Destination, point to ${targetURL}`);
  assert(
    hookdeckApiToken,
    "Envvar WEBHOOK_HOOKDECK_API_TOKEN must be set, because the webhook destination URL is hosted in Hookdeck's platform!"
  );

  const destinationName = `openchatflow-${env}`;
  const resp = await axios.get(
    "https://api.hookdeck.com/2023-01-01/destinations",
    {
      params: { name: destinationName },
      headers: { Authorization: `Bearer ${hookdeckApiToken}` },
    }
  );
  assert(
    resp.status === 200 && resp.data.count === 1,
    `Destination ${destinationName} wasn't found on Hookdeck! Please create it first`
  );
  const destination = resp.data.models[0];

  if (destination.url === null) {
    logger("Destination is using CLI mode, skipping URL configure");
    return;
  }

  logger(
    `Switching destination ${destinationName} on Hookdeck to ${targetURL}`
  );
  // Now switch the destination
  const respUpdate = await axios.put(
    `https://api.hookdeck.com/2023-01-01/destinations/${destination.id}`,
    { url: targetURL },
    {
      headers: { Authorization: `Bearer ${hookdeckApiToken}` },
    }
  );
  assert(
    respUpdate.status === 200 && respUpdate.data.url === targetURL,
    `Unable to reconfigure destination ${destinationName} on Hookdeck`
  );
  logger("Hookdeck reconfigured");
}

async function main() {
  // 1. If the `webhookURL` that Telegram will see is Hookdeck,
  // configure Hookdeck first so it forwards to us. This is done first
  // to minimize the chances of dropped messages between configuring TG and Hookdeck
  if (webhookURL.startsWith("https://events.hookdeck.com/e/")) {
    await pointHookdeckToUs(environ, hookdeckApiToken, backendURL);
  } else {
    logger(
      `Destination URL ${webhookURL} is not Hookdeck, skipping Hookdeck config`
    );
  }

  // 2. Get all the bots
  const bots = await prisma.telegramBot.findMany({});

  // 3. Configure TG so it sends updates of all managed bots to `webhookURL`
  const tgRegistrationPromises: Array<Promise<SetTokenResponse>> = [];
  for (const bot of bots) {
    logger(`Registering bot ${bot.id} on URL ${webhookURL}`);
    tgRegistrationPromises.push(
      registerWithTelegram(bot.token, webhookURL, webhookVerificationToken)
    );
  }
  const responses = await Promise.all(tgRegistrationPromises);
  logger(responses);

  logger("Done registering webhooks! Bye...");
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
