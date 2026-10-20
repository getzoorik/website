/** A share of a scale as a CSS length, as the mocks print it ("40.00%"): the bars of both cost charts. */
export function share(value: number, of: number, digits = 2): string {
  return `${((value / of) * 100).toFixed(digits)}%`;
}
