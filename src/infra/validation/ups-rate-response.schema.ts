import { z } from "zod";

export const UpsRateResponseSchema = z.object({
  RateResponse: z.object({
    RatedShipment: z.array(
      z.object({
        Service: z.object({ Code: z.string() }),
        TotalCharges: z.object({
          CurrencyCode: z.string(),
          MonetaryValue: z.string(),
        }),
      }),
    ),
  }),
});
