type UpsRateResponse = {
  RateResponse: {
    RatedShipment: Array<{
      Service: { Code: "01" | "02" | "03" | "13" };
      TotalCharges: {
        MonetaryValue: string;
        CurrencyCode: string;
      };
    }>;
  };
};
