import cn from "classnames";
import styles from "./TakeProfit.module.scss";

import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { QuestionTooltip } from "shared/components/QuestionTooltip/QuestionTooltip";
import { Switch } from "shared/components/Switch/Switch";
import { TextButton } from "shared/components/TextButton/TextButton";

import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useStore } from "PlaceOrder/context";
import { ProfitTarget as ProfitTargetModel } from "PlaceOrder/model";
import { observer } from "mobx-react";
import { ChangeEvent, useCallback, useMemo } from "react";

type ProfitTargetProps = ProfitTargetModel;

const ProfitTarget = observer(
  ({
    id,
    profit,
    targetPrice,
    amountToSell,
    validationErrorText,
  }: ProfitTargetProps) => {
    const {
      recalcProfitTargetProfit,
      recalcProfitTargetPrice,
      changeProfitTargetProfit,
      changeProfitTargetPrice,
      changeProfitTargetAmount,
      deleteTargetProfit,
    } = useStore();

    const profitValue = useMemo(
      () => (profit === undefined ? "" : profit),
      [profit]
    );

    const targetPriceValue = useMemo(
      () => (targetPrice === undefined ? "" : targetPrice),
      [targetPrice]
    );

    const amountToSellValue = useMemo(
      () => (amountToSell === undefined ? "" : amountToSell),
      [amountToSell]
    );

    const handleProfitChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        changeProfitTargetProfit(id, value.length ? Number(value) : undefined);
      },
      [id, changeProfitTargetProfit]
    );

    const handleProfitBlur = useCallback(() => {
      recalcProfitTargetPrice(id);
    }, [id, recalcProfitTargetPrice]);

    const handleTargetPriceChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        changeProfitTargetPrice(id, value.length ? Number(value) : undefined);
      },
      [id, changeProfitTargetPrice]
    );

    const handleTargetPriceBlur = useCallback(() => {
      recalcProfitTargetProfit(id);
    }, [id, recalcProfitTargetProfit]);

    const handleAmountToSellChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        changeProfitTargetAmount(id, value.length ? Number(value) : undefined);
      },
      [id, changeProfitTargetAmount]
    );

    const handleTargetProfitDelete = useCallback(() => {
      deleteTargetProfit(id);
    }, [id, deleteTargetProfit]);

    const hasValidationError = Boolean(validationErrorText.length);

    return (
      <div
        className={cn(
          styles.row,
          hasValidationError && styles._validationError
        )}
      >
        <div className={styles.row_col}>
          <div className={styles.percentage_box}>
            <input
              type="number"
              value={profitValue}
              onChange={handleProfitChange}
              onBlur={handleProfitBlur}
              className={cn(
                styles.take_profit_input,
                hasValidationError && styles._validationError
              )}
            />
          </div>
        </div>

        <div className={styles.row__col}>
          <div className={styles.target_price}>
            <div className={cn(!validationErrorText && styles.accented_text)}>
              <input
                type="number"
                value={targetPriceValue}
                onChange={handleTargetPriceChange}
                onBlur={handleTargetPriceBlur}
                className={cn(
                  styles.take_profit_input,
                  styles._currency,
                  hasValidationError && styles._validationError
                )}
              />
            </div>
            &nbsp;
            <span>USDT</span>
          </div>
        </div>

        <div className={styles.row__col}>
          <div className={styles.amount_to_sell}>
            <div className={styles.percentage_box}>
              <input
                type="number"
                value={amountToSellValue}
                onChange={handleAmountToSellChange}
                className={cn(
                  styles.take_profit_input,
                  hasValidationError && styles._validationError
                )}
              />
            </div>

            <div
              onClick={handleTargetProfitDelete}
              className={styles.delete_profit_target_button}
            >
              <CancelRoundedIcon
                className={styles.delete_profit_target_button__icon}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

const TakeProfit = observer(() => {
  const {
    activeOrderSide,
    profitTargets,
    takeProfitEnabled,
    allValidationErrors,
    protectedProfit,
    disableAddProfitTargets,
    addTargetProfit,
    toggleTakeProfit,
  } = useStore();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.header__title}>
          <QuestionTooltip message="Take Profit" />
          &nbsp;
          <span className={styles.accented_text}>Take Profit</span>
        </span>

        <Switch checked={takeProfitEnabled} onChange={toggleTakeProfit} />
      </div>

      {takeProfitEnabled && (
        <>
          <div className={styles.body}>
            <div className={cn(styles.row, styles._h_auto, styles._bb_none)}>
              <div className={styles.row__col}>Profit</div>

              <div className={styles.row__col}>Target price</div>

              <div className={styles.row__col}>
                {activeOrderSide === "buy" ? "Amount to buy" : "Amount to sell"}
              </div>
            </div>

            {profitTargets.map((profitTarget) => (
              <ProfitTarget key={profitTarget.id} {...profitTarget} />
            ))}
          </div>

          {allValidationErrors.map((validationErrorText, index) => (
            <div key={index} className={styles.alerts}>
              <div className={styles.alert_notice}>{validationErrorText}</div>
            </div>
          ))}

          {!disableAddProfitTargets && (
            <div className={styles.footer_actions}>
              <TextButton
                startIcon={<AddCircleRoundedIcon />}
                className={styles.add_profit_target_button}
                onClick={addTargetProfit}
              >
                Add profit target {profitTargets.length}/5
              </TextButton>
            </div>
          )}

          <div className={styles.footer}>
            <div className={styles.accented_text_row}>
              <span>Projected profit</span>

              <span className={styles.accented_text_row__dashed}></span>

              <span>
                <span className={styles.accented_text}>{protectedProfit}</span>
                &nbsp; USDT
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export { TakeProfit };
