import { CarrierType } from "../../../../domain/carrier/Carrier";
import { ServiceLevel } from "../../../../domain/rate/ServiceLevel";
import { UpsRateResponseSchema } from "../../../validation/ups-rate-response.schema";
import { CarrierError } from "../../../../domain/errors/CarrierError";
import { ErrorType } from "../../../../domain/errors/ErrorType";
import { mapUpsServiceLevel } from "../UpsServiceLevelMapper";

export class UpsRateResponseParser {
  parse(raw: unknown) {
    let parsed;
    try {
      parsed = UpsRateResponseSchema.parse(raw);
    } catch (err) {
      throw new CarrierError(
        ErrorType.MALFORMED_RESPONSE,
        CarrierType.UPS,
        "Invalid UPS rate response",
        false,
        err,
      );
    }

    return parsed.RateResponse.RatedShipment.map((s) => ({
      carrier: CarrierType.UPS,
      serviceLevel: mapUpsServiceLevel(s.Service.Code),
      totalCharge: {
        currency: s.TotalCharges.CurrencyCode,
        amount: Number(s.TotalCharges.MonetaryValue),
      },
    }));
  }
}
