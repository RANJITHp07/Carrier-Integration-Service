import { Router, Request, Response, NextFunction } from "express";

import { RateController } from "../controller/RateController";
import { CarrierFactory } from "../factory/CarrierFactory";
import { RateService } from "../services/RateService";

export function createRateRoutes(): Router {
  const carrierFactory = new CarrierFactory();
  const rateService = new RateService(carrierFactory);
  const rateController = new RateController(rateService);

  const router = Router();

  router.post(
    "/rates",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await rateController.getRates(req.body);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
