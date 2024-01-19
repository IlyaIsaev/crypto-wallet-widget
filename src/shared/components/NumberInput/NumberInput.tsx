import * as R from "remeda";

import {
  TextInput,
  TextInputProps,
} from "shared/components/TextInput/TextInput";
import { useNumberFormat } from "./useNumberFormat";

type Props = Omit<TextInputProps, "onChange" | "value"> & {
  value: number | null;
  min?: number;
  max?: number;
  decimalScale?: number;
  onChange?(value: number | null): void;
};

function NumberInput({
  value,
  min,
  max,
  decimalScale,
  onChange,
  onBlur,
  onFocus,
  onMouseUp,
  onKeyUp,
  InputProps,
  ...rest
}: Props) {
  const numberInput = R.omit(
    useNumberFormat(
      value,
      { onChange, onBlur, onFocus, onMouseUp, onKeyUp },
      { min, max, decimalScale },
    ),
    ["api"],
  );
  return <TextInput {...rest} InputProps={{ ...InputProps, ...numberInput }} />;
}

export { NumberInput };
