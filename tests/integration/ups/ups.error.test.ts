import { UpsOAuthClient } from "../../../src/infra/carrier/ups/auth/UpsOAuthClient";
import { UpsHttpClient } from "../../../src/infra/carrier/ups/UpsHttpClient";
import { CarrierType } from "../../../src/domain/carrier/Carrier";
import { CarrierError } from "../../../src/domain/errors/CarrierError";
import { ErrorType } from "../../../src/domain/errors/ErrorType";
import { FakeHttpClient } from "../FakeHttpClient.test";
import { UpsCarrier } from "../../../src/infra/carrier/ups/UpsCarrier";

it("handles 4xx auth error", async () => {
  const http = new FakeHttpClient();
  http.enqueueError(new Error("401 Unauthorized"));

  const oauth = new UpsOAuthClient({
    http,
    tokenUrl: "token-url",
    clientId: "id",
    clientSecret: "secret",
  });

  await expect(oauth.getAccessToken()).rejects.toMatchObject({
    type: ErrorType.AUTH_FAILED,
    carrier: CarrierType.UPS,
    retryable: false,
  });
});

it("handles 5xx rate API error", async () => {
  const http = new FakeHttpClient();
  http.enqueueResponse({ access_token: "token", expires_in: 3600 });
  http.enqueueError(new Error("500 Internal Server Error"));

  const carrier = new UpsCarrier({
    auth: new UpsOAuthClient({
      http,
      tokenUrl: "token-url",
      clientId: "id",
      clientSecret: "secret",
    }),
    http: new UpsHttpClient({ http, rateUrl: "rate-url" }),
  });

  await expect(
    carrier.getRates({
      origin: { postalCode: "10001", countryCode: "US" },
      destination: { postalCode: "90001", countryCode: "US" },
      packages: [{ weight: 1 }],
    }),
  ).rejects.toMatchObject({
    type: ErrorType.NETWORK_ERROR,
    carrier: CarrierType.UPS,
    retryable: true,
  });
});

it("handles malformed UPS response", async () => {
  const http = new FakeHttpClient();
  http.enqueueResponse({ access_token: "token", expires_in: 3600 });
  http.enqueueResponse({ unexpected: "shape" });

  const carrier = new UpsCarrier({
    auth: new UpsOAuthClient({
      http,
      tokenUrl: "token-url",
      clientId: "id",
      clientSecret: "secret",
    }),
    http: new UpsHttpClient({ http, rateUrl: "rate-url" }),
  });

  await expect(
    carrier.getRates({
      origin: { postalCode: "10001", countryCode: "US" },
      destination: { postalCode: "90001", countryCode: "US" },
      packages: [{ weight: 1 }],
    }),
  ).rejects.toMatchObject({
    type: ErrorType.MALFORMED_RESPONSE,
    carrier: CarrierType.UPS,
    retryable: true,
  });
});

it("handles timeout error", async () => {
  const http = new FakeHttpClient();
  http.enqueueResponse({ access_token: "token", expires_in: 3600 });
  http.enqueueError(new Error("ETIMEDOUT"));

  const carrier = new UpsCarrier({
    auth: new UpsOAuthClient({
      http,
      tokenUrl: "token-url",
      clientId: "id",
      clientSecret: "secret",
    }),
    http: new UpsHttpClient({ http, rateUrl: "rate-url" }),
  });

  await expect(
    carrier.getRates({
      origin: { postalCode: "10001", countryCode: "US" },
      destination: { postalCode: "90001", countryCode: "US" },
      packages: [{ weight: 1 }],
    }),
  ).rejects.toMatchObject({
    type: ErrorType.NETWORK_ERROR,
    carrier: CarrierType.UPS,
    retryable: true,
  });
});
