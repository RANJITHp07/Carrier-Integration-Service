import { ServiceLevel } from "../../../domain/rate/ServiceLevel";
import { assertNever } from "../../utils/defaultCaseWrapper";

type UpsServiceCode = "01" | "02" | "03" | "13";

export function mapUpsServiceLevel(code: UpsServiceCode): ServiceLevel {
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
      return assertNever<string>(code);
  }
}
