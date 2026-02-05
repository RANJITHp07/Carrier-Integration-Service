import { CarrierType } from "../carrier/Carrier";
import { ErrorType } from "./ErrorType";

type CarrierErrorParams = {
  type: ErrorType;
  carrier: CarrierType;
  message: string;
  retryable: boolean;
  details?: unknown;
};

export class CarrierError extends Error {
  public readonly type: ErrorType;
  public readonly carrier: CarrierType;
  public readonly retryable: boolean;
  public readonly details?: unknown;

  constructor({
    type,
    carrier,
    message,
    retryable,
    details,
  }: CarrierErrorParams) {
    super(message);
    this.type = type;
    this.carrier = carrier;
    this.retryable = retryable;
    this.details = details;
  }
}
