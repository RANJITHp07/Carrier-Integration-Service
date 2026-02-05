import { RateRequest } from "../../../../domain/rate/RateRequest";

type UpsAddress = {
  postalCode: string;
  countryCode: string;
};

export class UpsRateRequestBuilder {
  build(req: RateRequest) {
    const { origin, destination, packages } = req;

    const shipper: UpsAddress = {
      postalCode: origin.postalCode,
      countryCode: origin.countryCode,
    };

    const shipTo: UpsAddress = {
      postalCode: destination.postalCode,
      countryCode: destination.countryCode,
    };

    const upsPackages = packages.map((p) => ({
      PackagingType: { Code: "02" },
      PackageWeight: {
        UnitOfMeasurement: { Code: "LBS" },
        Weight: p.weight.toString(),
      },
    }));

    return {
      RateRequest: {
        Shipment: {
          Shipper: { Address: shipper },
          ShipTo: { Address: shipTo },
          Package: upsPackages,
        },
      },
    };
  }
}
