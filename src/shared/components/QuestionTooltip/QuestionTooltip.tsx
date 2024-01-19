import type { ReactNode } from "react";
import type { TooltipProps } from "@mui/material";

import { Tooltip } from "shared/components/Tooltip/Tooltip";
import { InfoIcon } from "./InfoIcon/InfoIcon";
import styles from "./QuestionTooltip.module.scss";

interface Props {
  message: ReactNode;
  placement?: TooltipProps["placement"];
  wide?: boolean;
}

function QuestionTooltip({ message, placement }: Props) {
  return (
    <Tooltip message={message} placement={placement}>
      <div className={styles.tooltipIconWrapper}>
        <InfoIcon />
      </div>
    </Tooltip>
  );
}

export { QuestionTooltip };
export type { Props as QuestionTooltipProps };
