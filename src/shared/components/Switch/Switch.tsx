import type { ChangeEvent } from "react";
import cn from "classnames";

import styles from "./Switch.module.scss";

interface Props {
  checked: boolean;
  label?: string;
  disabled?: boolean;
  reversed?: boolean;
  fullWidth?: boolean;
  onChange?(value: boolean): void;
}

function Switch({
  checked,
  onChange,
  disabled = false,
  reversed,
  fullWidth,
  label,
}: Props) {
  return (
    <label
      className={cn(styles.root, {
        [styles.reversed]: reversed,
        [styles.fullWidth]: fullWidth,
      })}
    >
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <div className={styles.switch} />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange && onChange(e.target.checked);
  }
}

export { Switch };
