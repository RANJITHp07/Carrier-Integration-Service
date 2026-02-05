import { Carrier, CarrierType } from "../domain/carrier/Carrier";
import { env } from "../config/env";
import { FetchHttpClient } from "../infra/http/FetchHttpClient";
import { UpsOAuthClient } from "../infra/carrier/ups/auth/UpsOAuthClient";
import { UpsHttpClient } from "../infra/carrier/ups/UpsHttpClient";
import { UpsCarrier } from "../infra/carrier/ups/UpsCarrier";
import { assertNever } from "../infra/utils/defaultCaseWrapper";

export class CarrierFactory {
  private readonly httpClient = new FetchHttpClient();

  create(type: CarrierType): Carrier {
    switch (type) {
      case CarrierType.UPS:
        return this.createUpsCarrier();
      default:
        return assertNever<string>(type);
    }
  }

  private createUpsCarrier(): Carrier {
    const oauthClient = new UpsOAuthClient({
      http: this.httpClient,
      tokenUrl: env.UPS_OAUTH_TOKEN_URL,
      clientId: env.UPS_CLIENT_ID,
      clientSecret: env.UPS_CLIENT_SECRET,
    });

    const upsHttpClient = new UpsHttpClient({
      http: this.httpClient,
      rateUrl: env.UPS_RATE_API_URL,
    });

    return new UpsCarrier({ auth: oauthClient, http: upsHttpClient });
  }
}
