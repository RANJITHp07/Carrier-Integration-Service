import { z } from "zod";

export const AddressSchema = z.object({
  postalCode: z.string().min(1),
  countryCode: z.string().length(2),
  stateProvince: z.string().optional(),
  city: z.string().optional(),
});
