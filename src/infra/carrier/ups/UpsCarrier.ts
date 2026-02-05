import { Carrier, CarrierType } from "../../../domain/carrier/Carrier";
import { RateRequest } from "../../../domain/rate/RateRequest";
import { CarrierError } from "../../../domain/errors/CarrierError";
import { ErrorType } from "../../../domain/errors/ErrorType";
import { UpsOAuthClient } from "./auth/UpsOAuthClient";
import { UpsRateRequestBuilder } from "./rate/UpsRateRequestBuilder";
import { UpsRateResponseParser } from "./rate/UpsRateResponseParser";
import { UpsHttpClient } from "./UpsHttpClient";

export class UpsCarrier implements Carrier {
  private builder = new UpsRateRequestBuilder();
  private parser = new UpsRateResponseParser();

  constructor(
    private readonly auth: UpsOAuthClient,
    private readonly http: UpsHttpClient,
  ) {}

  async getRates(req: RateRequest) {
    try {
      const token = await this.auth.getAccessToken();
      const payload = this.builder.build(req);
      const response = await this.http.postRates(payload, token);
      return this.parser.parse(response);
    } catch (err) {
      if (err instanceof CarrierError) {
        throw err;
      }

      const message = err instanceof Error ? err.message : "UPS error";

      if (message.includes("ETIMEDOUT") || message.includes("timeout")) {
        throw new CarrierError(
          ErrorType.NETWORK_ERROR,
          CarrierType.UPS,
          "UPS request timed out",
          true,
          err,
        );
      }

      throw new CarrierError(
        ErrorType.MALFORMED_RESPONSE,
        CarrierType.UPS,
        "UPS rate request failed",
        true,
        err,
      );
    }
  }
}
