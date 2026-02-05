import { Carrier, CarrierType } from "../domain/carrier/Carrier";

export interface CarrierFactory {
  create(type: CarrierType): Carrier;
}
