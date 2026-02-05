import { CarrierType } from "../carrier/Carrier";
import { ErrorType } from "./ErrorType";

export class CarrierError extends Error {
  constructor(
    public readonly type: ErrorType,
    public readonly carrier: CarrierType,
    message: string,
    public readonly retryable: boolean,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}
