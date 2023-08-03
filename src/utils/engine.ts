// we fix some number to protect overhead bit overload. Allow up to 46 bit unsigned number (which is pretty perfomant)
export const PerformanceSafeInterger = 70368744177664 - 1;
export function dirtyUnsignedInterger(n: number) {
  return n < 0 || n > PerformanceSafeInterger || n % 1 != 0;
}
