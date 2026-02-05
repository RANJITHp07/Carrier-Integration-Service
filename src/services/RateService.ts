import { RateRequest } from "../domain/rate/RateRequest";
import { RateQuote } from "../domain/rate/RateQuote";
import { CarrierType } from "../domain/carrier/Carrier";
import { CarrierFactory } from "../factory/CarrierType";

export class RateService {
  constructor(private readonly carrierFactory: CarrierFactory) {}

  async getRates(request: RateRequest): Promise<RateQuote[]> {
    const carrier = this.carrierFactory.create(
      request.carrier ?? CarrierType.UPS,
    );

    return carrier.getRates(request);
  }
}
