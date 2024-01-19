import { action, computed, makeObservable, observable } from "mobx";

import { MouseEvent } from "react";
import { compact, concat, flatMap, maxBy, pipe, sumBy, uniq } from "remeda";
import type { OrderSide, ProfitTarget } from "../model";

const PROFIT_INCREMENT_STEP = 2;

const MAX_PROFIT_SUM = 500;

const AMOUNT_TO_SELL_INCREMENT_STEP = 20;

const MAX_AMOUNT_TO_SELL_SUM = 100;

const calcTargetPrice = (
  activeOrderSide: OrderSide,
  price: number,
  profit?: number
) =>
  activeOrderSide === "buy"
    ? price + price * ((profit || 0) / 100)
    : price - price * ((profit || 0) / 100);

export class PlaceOrderStore {
  constructor() {
    makeObservable(this);
  }

  @observable activeOrderSide: OrderSide = "buy";
  @observable price = 0;
  @observable amount = 0;
  @observable profitTargets: ProfitTarget[] = [];
  @observable takeProfitEnabled = false;
  @observable validationErrors: string[] = [];

  @computed get total(): number {
    return this.price * this.amount;
  }

  @computed get disableAddProfitTargets() {
    return this.profitTargets.length >= 5;
  }

  @computed get protectedProfit() {
    return this.profitTargets
      .reduce(
        (acc, { targetPrice = 0, amountToSell = 0 }) =>
          acc +
          (this.activeOrderSide === "buy"
            ? this.amount * (amountToSell / 100) * (targetPrice - this.price)
            : this.amount * (amountToSell / 100) * (this.price - targetPrice)),
        0
      )
      .toFixed(2);
  }

  @computed get allValidationErrors() {
    return pipe(
      this.profitTargets,
      flatMap((profitTarget) => profitTarget.validationErrorText),
      compact,
      concat(this.validationErrors),
      uniq()
    );
  }

  @action
  public setOrderSide = (side: OrderSide) => {
    this.activeOrderSide = side;

    this.profitTargets.forEach((targetProfit) => {
      targetProfit.targetPrice = calcTargetPrice(
        side,
        this.price,
        targetProfit.profit
      );
    });
  };

  @action
  public setPrice = (price: number) => {
    this.price = price;

    this.profitTargets.forEach((targetProfit) => {
      targetProfit.targetPrice = calcTargetPrice(
        this.activeOrderSide,
        price,
        targetProfit.profit
      );
    });
  };

  @action
  public setAmount = (amount: number) => {
    this.amount = amount;
  };

  @action
  public setTotal = (total: number) => {
    this.amount = this.price > 0 ? total / this.price : 0;
  };

  @action
  public addTargetProfit = () => {
    if (this.disableAddProfitTargets) {
      return;
    }

    const lastProfitTarget: ProfitTarget | undefined =
      this.profitTargets[this.profitTargets.length - 1];

    const id = lastProfitTarget ? lastProfitTarget.id + 1 : 1;

    const profit = lastProfitTarget
      ? (lastProfitTarget.profit || 0) + PROFIT_INCREMENT_STEP
      : PROFIT_INCREMENT_STEP;

    const targetPrice = calcTargetPrice(
      this.activeOrderSide,
      this.price,
      profit
    );

    const amountToSell = lastProfitTarget
      ? AMOUNT_TO_SELL_INCREMENT_STEP
      : MAX_AMOUNT_TO_SELL_SUM;

    this.profitTargets.push({
      id,
      profit,
      targetPrice,
      amountToSell,
      validationErrorText: [],
    });

    const amountToSellSum = sumBy<ProfitTarget>(
      ({ amountToSell = 0 }) => amountToSell
    )(this.profitTargets);

    if (amountToSellSum > MAX_AMOUNT_TO_SELL_SUM) {
      const profitTargetBiggestAmountToSell = maxBy<ProfitTarget>(
        ({ amountToSell = 0 }) => amountToSell
      )(this.profitTargets);

      if (
        profitTargetBiggestAmountToSell &&
        profitTargetBiggestAmountToSell.amountToSell
      ) {
        profitTargetBiggestAmountToSell.amountToSell =
          profitTargetBiggestAmountToSell.amountToSell -
          (amountToSellSum - MAX_AMOUNT_TO_SELL_SUM);
      }
    }
  };

  @action
  public deleteTargetProfit = (profitTargetId: ProfitTarget["id"]) => {
    this.profitTargets.forEach((profitTarget, index) => {
      if (profitTarget.id === profitTargetId) {
        this.profitTargets.splice(index, 1);
      }
    });

    if (!this.profitTargets.length) {
      this.turnOffTakeProfit();
    }
  };

  @action
  public turnOnTakeProfit = () => {
    this.addTargetProfit();

    this.takeProfitEnabled = true;
  };

  @action
  public turnOffTakeProfit = () => {
    this.takeProfitEnabled = false;

    this.profitTargets = [];

    this.validationErrors = [];
  };

  @action
  public toggleTakeProfit = () => {
    if (this.takeProfitEnabled) {
      this.turnOffTakeProfit();
    } else {
      this.turnOnTakeProfit();
    }
  };

  @action
  public changeProfitTargetProfit = (
    profitTargetId: ProfitTarget["id"],
    newProfit: ProfitTarget["profit"]
  ) => {
    const profitTarget = this.profitTargets.find(
      (profitTarget) => profitTarget.id === profitTargetId
    );

    if (profitTarget) {
      profitTarget.profit = newProfit;
    }
  };

  @action
  public recalcProfitTargetProfit = (profitTargetId: ProfitTarget["id"]) => {
    const profitTarget = this.profitTargets.find(
      (profitTarget) => profitTarget.id === profitTargetId
    );

    if (profitTarget) {
      profitTarget.profit =
        ((profitTarget.targetPrice || 0) - this.price) / 100;
    }
  };

  @action
  public changeProfitTargetPrice = (
    profitTargetId: ProfitTarget["id"],
    newTargetPrice: ProfitTarget["targetPrice"]
  ) => {
    const profitTarget = this.profitTargets.find(
      (profitTarget) => profitTarget.id === profitTargetId
    );

    if (profitTarget) {
      profitTarget.targetPrice = newTargetPrice;
    }
  };

  @action
  public recalcProfitTargetPrice = (profitTargetId: ProfitTarget["id"]) => {
    const profitTarget = this.profitTargets.find(
      (profitTarget) => profitTarget.id === profitTargetId
    );

    if (profitTarget) {
      profitTarget.targetPrice = calcTargetPrice(
        this.activeOrderSide,
        this.price,
        profitTarget.profit
      );
    }
  };

  @action
  public changeProfitTargetAmount = (
    profitTargetId: ProfitTarget["id"],
    newAmountToSell: ProfitTarget["amountToSell"]
  ) => {
    const profitTarget = this.profitTargets.find(
      (profitTarget) => profitTarget.id === profitTargetId
    );

    if (profitTarget) {
      profitTarget.amountToSell = newAmountToSell;
    }
  };

  @action
  public submitForm = (event: MouseEvent<HTMLElement>) => {
    if (!this.takeProfitEnabled) {
      return;
    }

    event.preventDefault();

    this.validationErrors = [];

    this.profitTargets.forEach((profitTarget) => {
      profitTarget.validationErrorText = [];
    });

    const profitSum = sumBy<ProfitTarget>(({ profit = 0 }) => profit)(
      this.profitTargets
    );

    if (profitSum > MAX_PROFIT_SUM) {
      this.validationErrors.push("Maximum profit sum is 500%");
    }

    const amountToSellSum = sumBy<ProfitTarget>(
      ({ amountToSell = 0 }) => amountToSell
    )(this.profitTargets);

    if (amountToSellSum > MAX_AMOUNT_TO_SELL_SUM) {
      this.validationErrors.push(
        `${amountToSellSum} out of 100% selected. Please decrease by ${
          amountToSellSum - MAX_AMOUNT_TO_SELL_SUM
        }`
      );
    }

    if (amountToSellSum < MAX_AMOUNT_TO_SELL_SUM) {
      this.validationErrors.push(
        `${amountToSellSum} out of 100% selected. Please increase by ${
          MAX_AMOUNT_TO_SELL_SUM - amountToSellSum
        }`
      );
    }

    this.profitTargets.forEach((profitTarget, index, arr) => {
      const prevProfitTarget: ProfitTarget | undefined = arr[index - 1];

      const { profit = 0, targetPrice = 0 } = profitTarget;

      if (profit < 0.01) {
        profitTarget.validationErrorText.push("Minimum value is 0.01%");
      }

      if (prevProfitTarget && (prevProfitTarget.profit || 0) >= profit) {
        profitTarget.validationErrorText.push(
          "Each target's profit should be greater than the previous one"
        );
      }

      if (targetPrice <= 0) {
        profitTarget.validationErrorText.push("Price must be greater than 0");
      }
    });
  };
}
