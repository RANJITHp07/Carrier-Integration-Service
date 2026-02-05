import { CarrierType } from "../carrier/Carrier";
import { ServiceLevel } from "./ServiceLevel";

export interface Money {
  currency: string;
  amount: number;
}

export interface RateQuote {
  carrier: CarrierType;
  serviceLevel: ServiceLevel;
  totalCharge: Money;
  deliveryDays?: number;
}
