import { RateRequest } from "../../../../domain/rate/RateRequest";

export class UpsRateRequestBuilder {
  build(req: RateRequest) {
    return {
      RateRequest: {
        Shipment: {
          Shipper: { Address: req.origin },
          ShipTo: { Address: req.destination },
          Package: req.packages.map((p) => ({
            PackagingType: { Code: "02" },
            PackageWeight: {
              UnitOfMeasurement: { Code: "LBS" },
              Weight: p.weight.toString(),
            },
          })),
        },
      },
    };
  }
}
