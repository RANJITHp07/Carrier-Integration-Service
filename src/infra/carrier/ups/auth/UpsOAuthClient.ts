import { OAuthToken } from "./OAuthToken";
import { CarrierError } from "../../../../domain/errors/CarrierError";
import { ErrorType } from "../../../../domain/errors/ErrorType";
import { CarrierType } from "../../../../domain/carrier/Carrier";

export class UpsOAuthClient {
  private token?: OAuthToken;

  constructor(
    private readonly http: any,
    private readonly tokenUrl: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  async getAccessToken(): Promise<string> {
    if (this.token && !this.token.isExpired()) {
      return this.token.value;
    }

    let response;
    try {
      response = await this.http.post({
        url: this.tokenUrl,
        body: {
          grant_type: "client_credentials",
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
      });
    } catch (err) {
      throw new CarrierError(
        ErrorType.AUTH_FAILED,
        CarrierType.UPS,
        "UPS authentication failed",
        false,
        err,
      );
    }

    if (!response?.access_token || !response?.expires_in) {
      throw new CarrierError(
        ErrorType.MALFORMED_RESPONSE,
        CarrierType.UPS,
        "Invalid UPS auth response",
        false,
        response,
      );
    }

    this.token = new OAuthToken(response.access_token, response.expires_in);
    return this.token.value;
  }
}
