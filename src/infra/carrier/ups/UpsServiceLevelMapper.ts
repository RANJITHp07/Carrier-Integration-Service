import { ServiceLevel } from "../../../domain/rate/ServiceLevel";
import { CarrierError } from "../../../domain/errors/CarrierError";
import { ErrorType } from "../../../domain/errors/ErrorType";
import { CarrierType } from "../../../domain/carrier/Carrier";

export function mapUpsServiceLevel(code: string): ServiceLevel {
  switch (code) {
    case "03":
      return ServiceLevel.GROUND;

    case "02":
      return ServiceLevel.EXPRESS;

    case "13":
      return ServiceLevel.EXPRESS_SAVER;

    case "01":
      return ServiceLevel.NEXT_DAY_AIR;

    default:
      throw new CarrierError(
        ErrorType.MALFORMED_RESPONSE,
        CarrierType.UPS,
        `Unsupported UPS service code: ${code}`,
        false,
      );
  }
}
