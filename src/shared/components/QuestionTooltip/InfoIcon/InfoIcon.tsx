import { SvgIcon } from "@mui/material";
import cn from "classnames";

import styles from "./InfoIcon.module.scss";

interface Props {
  className?: string;
}

function InfoIcon({ className }: Props) {
  return (
    <SvgIcon
      width={16}
      height={16}
      className={cn(className, styles.root)}
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z"
        className={styles.circle}
      />
      <rect
        x="8.33334"
        y="11.3333"
        width="1.33333"
        height="5.33333"
        rx="0.666667"
        transform="rotate(-180 8.33334 11.3333)"
        className={styles.char}
      />
      <rect
        x="8.33334"
        y="5.33331"
        width="1.33333"
        height="1.33333"
        rx="0.666667"
        transform="rotate(-180 8.33334 5.33331)"
        className={styles.char}
      />
    </SvgIcon>
  );
}

export { InfoIcon };
