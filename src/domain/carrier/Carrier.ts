import { RateRequest } from "../rate/RateRequest";
import { RateQuote } from "../rate/RateQuote";

export enum CarrierType {
  UPS = "UPS",
  FEDEX = "FEDEX",
  USPS = "USPS",
}

export interface Carrier {
  getRates(request: RateRequest): Promise<RateQuote[]>;
}
