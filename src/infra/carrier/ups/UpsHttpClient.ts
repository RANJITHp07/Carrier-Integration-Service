import { CarrierType } from "../../../domain/carrier/Carrier";
import { CarrierError } from "../../../domain/errors/CarrierError";
import { ErrorType } from "../../../domain/errors/ErrorType";
import { HttpClient } from "../../http/HttpClient";
import { assertNever } from "../../utils/defaultCaseWrapper";

type HttpError = {
  status?: number;
  message?: string;
};

type UpsHttpClientParams = {
  http: HttpClient;
  rateUrl: string;
};

type PostRatesParams<T> = {
  payload: T;
  token: string;
};

export class UpsHttpClient {
  private readonly http: HttpClient;
  private readonly rateUrl: string;

  constructor({ http, rateUrl }: UpsHttpClientParams) {
    this.http = http;
    this.rateUrl = rateUrl;
  }

  async postRates<TRequest, TResponse>({
    payload,
    token,
  }: PostRatesParams<TRequest>): Promise<TResponse> {
    try {
      return await this.http.post<TResponse>({
        url: this.rateUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });
    } catch (error) {
      const err = error as HttpError;

      if (err.status === 401 || err.status === 403) {
        throw new CarrierError({
          type: ErrorType.AUTH_FAILED,
          carrier: CarrierType.UPS,
          message: "UPS rate API authentication failed",
          retryable: true,
          details: err,
        });
      }

      if (err.status === 429) {
        throw new CarrierError({
          type: ErrorType.RATE_LIMITED,
          carrier: CarrierType.UPS,
          message: "UPS rate API rate limited",
          retryable: true,
          details: err,
        });
      }

      throw new CarrierError({
        type: ErrorType.NETWORK_ERROR,
        carrier: CarrierType.UPS,
        message: "UPS rate API request failed",
        retryable: true,
        details: err,
      });
    }
  }
}
