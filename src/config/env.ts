import { z } from "zod";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
const envExamplePath = path.resolve(process.cwd(), ".env.example");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (fs.existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath });
}

const EnvSchema = z.object({
  UPS_CLIENT_ID: z.string().min(1),
  UPS_CLIENT_SECRET: z.string().min(1),
  UPS_OAUTH_TOKEN_URL: z.string().url(),
  UPS_RATE_API_URL: z.string().url(),
  HTTP_TIMEOUT_MS: z.coerce.number().default(5000),
});

export const env = EnvSchema.parse(process.env);
