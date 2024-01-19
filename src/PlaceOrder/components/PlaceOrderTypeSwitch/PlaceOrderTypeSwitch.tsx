import { Button } from "shared/components/Button/Button";
import type { OrderSide } from "../../model";

import styles from "./PlaceOrderTypeSwitch.module.scss";

interface Props {
  activeOrderSide: OrderSide;
  onChange(orderSide: OrderSide): void;
}

const PlaceOrderTypeSwitch = ({ activeOrderSide, onChange }: Props) => {
  const handleToggle = (orderType: OrderSide) => {
    onChange(orderType);
  };

  return (
    <div className={styles.root}>
      <Button
        color="green"
        fullWidth
        size="small"
        inactive={activeOrderSide !== "buy"}
        onClick={() => handleToggle("buy")}
      >
        Buy
      </Button>
      <Button
        color="red"
        size="small"
        fullWidth
        inactive={activeOrderSide === "buy"}
        onClick={() => handleToggle("sell")}
      >
        Sell
      </Button>
    </div>
  );
};

export { PlaceOrderTypeSwitch };
