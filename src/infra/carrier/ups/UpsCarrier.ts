import { Carrier, CarrierType } from "../../../domain/carrier/Carrier";
import { RateRequest } from "../../../domain/rate/RateRequest";
import { CarrierError } from "../../../domain/errors/CarrierError";
import { ErrorType } from "../../../domain/errors/ErrorType";
import { UpsOAuthClient } from "./auth/UpsOAuthClient";
import { UpsRateRequestBuilder } from "./rate/UpsRateRequestBuilder";
import { UpsRateResponseParser } from "./rate/UpsRateResponseParser";
import { UpsHttpClient } from "./UpsHttpClient";

type UpsCarrierParams = {
  auth: UpsOAuthClient;
  http: UpsHttpClient;
};

export class UpsCarrier implements Carrier {
  private builder = new UpsRateRequestBuilder();
  private parser = new UpsRateResponseParser();
  private auth: UpsOAuthClient;
  private http: UpsHttpClient;

  constructor({ auth, http }: UpsCarrierParams) {
    this.auth = auth;
    this.http = http;
  }

  async getRates({ origin, destination, packages }: RateRequest) {
    try {
      const token = await this.auth.getAccessToken();
      const payload = this.builder.build({ origin, destination, packages });
      const response = await this.http.postRates({ payload, token });
      return this.parser.parse(response);
    } catch (err) {
      if (err instanceof CarrierError) {
        throw err;
      }

      const message = err instanceof Error ? err.message : "UPS error";

      if (message.includes("ETIMEDOUT") || message.includes("timeout")) {
        throw new CarrierError({
          type: ErrorType.NETWORK_ERROR,
          carrier: CarrierType.UPS,
          message: "UPS request timed out",
          retryable: true,
          details: err,
        });
      }

      throw new CarrierError({
        type: ErrorType.MALFORMED_RESPONSE,
        carrier: CarrierType.UPS,
        message: "UPS rate request failed",
        retryable: true,
        details: err,
      });
    }
  }
}
