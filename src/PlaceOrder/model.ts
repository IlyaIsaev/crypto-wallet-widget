export type OrderSide = "buy" | "sell";

export type ProfitTarget = {
  id: number;
  profit: number | undefined;
  targetPrice: number | undefined;
  amountToSell: number | undefined;
  validationErrorText: string[];
};
