export type UpsRateResponse = {
  RateResponse: {
    RatedShipment: Array<{
      Service: {
        Code: string;
      };
      TotalCharges: {
        MonetaryValue: string;
        CurrencyCode: string;
      };
    }>;
  };
};
