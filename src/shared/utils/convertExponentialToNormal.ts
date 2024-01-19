export function convertExponentialToNormal(value: number): string {
  const data = value.toString().split(/[eE]/);
  const mantissa = data[0];
  const exponent = data[1];
  if (exponent === undefined) {
    return data[0];
  }

  let zeroes = "";
  const sign = value < 0 ? "-" : "";
  const str = mantissa.replace(".", "");
  let zeroesAcc = Number(exponent) + 1;

  if (zeroesAcc < 0) {
    zeroes = `${sign}0.`;
    while (zeroesAcc) {
      zeroesAcc += 1;
      zeroes += "0";
    }
    return zeroes + str.replace(/^-/, "");
  }
  zeroesAcc -= sign ? str.length - 1 : str.length;
  while (zeroesAcc) {
    zeroesAcc -= 1;
    zeroes += "0";
  }
  return str + zeroes;
}
