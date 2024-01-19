import { Button as MUIButton, ButtonProps } from "@mui/material";
import cn from "classnames";

import styles from "./Button.module.scss";

type Props = Omit<ButtonProps, "color" | "size"> & {
  color: "green" | "red";
  size?: "small" | "normal";
  inactive?: boolean;
};

const Button = ({
  children,
  color,
  size = "normal",
  inactive = false,
  ...rest
}: Props) => (
  <MUIButton
    disableRipple
    className={cn(styles.root, styles[color], styles[size], {
      [styles.inactive]: inactive,
    })}
    {...rest}
  >
    {children}
  </MUIButton>
);

export { Button };
