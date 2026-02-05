import { z } from "zod";

export const PackageSchema = z.object({
  weight: z.number().positive(),
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});
