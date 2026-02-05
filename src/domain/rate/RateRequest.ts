import { Address } from "../address/Address";
import { CarrierType } from "../carrier/Carrier";
import { Package } from "../package/Package";
import { ServiceLevel } from "./ServiceLevel";

export interface RateRequest {
  readonly origin: Address;
  readonly destination: Address;
  readonly packages: readonly Package[];
  readonly serviceLevel?: ServiceLevel;
  readonly shipDate?: Date;
  readonly carrier?: CarrierType;
}
