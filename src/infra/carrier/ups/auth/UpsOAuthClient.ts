import { OAuthToken } from "./OAuthToken";
import { CarrierError } from "../../../../domain/errors/CarrierError";
import { ErrorType } from "../../../../domain/errors/ErrorType";
import { CarrierType } from "../../../../domain/carrier/Carrier";
import { HttpClient } from "../../../http/HttpClient";
import { UpsOAuthTokenResponse } from "./types/OAuthTypes";

type UpsOAuthClientParams = {
  http: HttpClient;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
};

export class UpsOAuthClient {
  private token?: OAuthToken;

  constructor(private readonly params: UpsOAuthClientParams) {}

  async getAccessToken(): Promise<string> {
    const { http, tokenUrl, clientId, clientSecret } = this.params;

    if (this.token && !this.token.isExpired()) {
      return this.token.value;
    }

    let response: UpsOAuthTokenResponse;
    try {
      response = await http.post<UpsOAuthTokenResponse>({
        url: tokenUrl,
        body: {
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
        },
      });
    } catch (err) {
      throw new CarrierError({
        type: ErrorType.AUTH_FAILED,
        carrier: CarrierType.UPS,
        message: "UPS authentication failed",
        retryable: false,
        details: err,
      });
    }

    if (!response?.access_token || !response?.expires_in) {
      throw new CarrierError({
        type: ErrorType.MALFORMED_RESPONSE,
        carrier: CarrierType.UPS,
        message: "Invalid UPS auth response",
        retryable: false,
        details: response,
      });
    }

    this.token = new OAuthToken(response.access_token, response.expires_in);
    return this.token.value;
  }
}
