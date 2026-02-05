import { z } from "zod";

const EnvSchema = z.object({
  UPS_CLIENT_ID: z.string().min(1),
  UPS_CLIENT_SECRET: z.string().min(1),
  UPS_OAUTH_TOKEN_URL: z.string().url(),
  UPS_RATE_API_URL: z.string().url(),
  HTTP_TIMEOUT_MS: z.coerce.number().default(5000),
});

export const env = EnvSchema.parse(process.env);
