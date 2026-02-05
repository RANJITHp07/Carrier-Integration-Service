import { RateRequestSchema } from "../infra/validation/rate-request.schema";
import { RateService } from "../services/RateService";

export class RateController {
  constructor(private readonly service: RateService) {}

  async getRates(input: unknown) {
    const request = RateRequestSchema.parse(input);
    return this.service.getRates(request);
  }
}
