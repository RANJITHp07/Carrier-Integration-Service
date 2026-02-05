import { CarrierType } from "../../../domain/carrier/Carrier";
import { CarrierError } from "../../../domain/errors/CarrierError";
import { ErrorType } from "../../../domain/errors/ErrorType";
import { HttpClient } from "../../http/HttpClient";

type HttpError = {
  status?: number;
  message?: string;
};

export class UpsHttpClient {
  constructor(
    private readonly http: HttpClient,
    private readonly rateUrl: string,
  ) {}

  async postRates(payload: unknown, token: string): Promise<unknown> {
    try {
      return await this.http.post({
        url: this.rateUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });
    } catch (error) {
      const err = error as HttpError;
      if (err?.status === 401 || err?.status === 403) {
        throw new CarrierError(
          ErrorType.AUTH_FAILED,
          CarrierType.UPS,
          "UPS rate API authentication failed",
          true,
          error,
        );
      }

      if (err?.status === 429) {
        throw new CarrierError(
          ErrorType.RATE_LIMITED,
          CarrierType.UPS,
          "UPS rate API rate limited",
          true,
          error,
        );
      }

      throw new CarrierError(
        ErrorType.NETWORK_ERROR,
        CarrierType.UPS,
        "UPS rate API request failed",
        true,
        error,
      );
    }
  }
}
