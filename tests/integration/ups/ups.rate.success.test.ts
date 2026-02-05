import { UpsOAuthClient } from "../../../src/infra/carrier/ups/auth/UpsOAuthClient";
import { UpsHttpClient } from "../../../src/infra/carrier/ups/UpsHttpClient";
import { CarrierType } from "../../../src/domain/carrier/Carrier";
import { ServiceLevel } from "../../../src/domain/rate/ServiceLevel";
import { FakeHttpClient } from "../FakeHttpClient.test";
import { UpsCarrier } from "../../../src/infra/carrier/ups/UpsCarrier";

it("builds UPS rate request and normalizes successful response", async () => {
  const http = new FakeHttpClient();

  http.enqueueResponse({
    access_token: "ups-token",
    expires_in: 3600,
  });

  http.enqueueResponse({
    RateResponse: {
      RatedShipment: [
        {
          Service: { Code: "03" },
          TotalCharges: {
            MonetaryValue: "18.50",
            CurrencyCode: "USD",
          },
        },
      ],
    },
  });

  const carrier = new UpsCarrier(
    new UpsOAuthClient(http, "token-url", "id", "secret"),
    new UpsHttpClient(http, "rate-url"),
  );

  const rates = await carrier.getRates({
    origin: { postalCode: "10001", countryCode: "US" },
    destination: { postalCode: "90001", countryCode: "US" },
    packages: [{ weight: 3 }],
  });

  expect(http.requests[1].body).toMatchObject({
    RateRequest: {
      Shipment: {
        Shipper: { Address: { postalCode: "10001", countryCode: "US" } },
        ShipTo: { Address: { postalCode: "90001", countryCode: "US" } },
      },
    },
  });

  expect(rates).toEqual([
    {
      carrier: CarrierType.UPS,
      serviceLevel: ServiceLevel.GROUND,
      totalCharge: { currency: "USD", amount: 18.5 },
    },
  ]);
});
