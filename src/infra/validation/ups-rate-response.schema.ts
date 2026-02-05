import { z } from "zod";

export const UpsRateResponseSchema = z.object({
  RateResponse: z.object({
    RatedShipment: z.array(
      z.object({
        Service: z.object({
          Code: z.enum(["01", "02", "03", "13"]),
        }),
        TotalCharges: z.object({
          CurrencyCode: z.string(),
          MonetaryValue: z.string(),
        }),
      }),
    ),
  }),
});
