/// <reference path="GlobalMath.ts"/>


namespace Darblast {
export namespace Utilities {


/**
 * Calculates a "wrap around" version of the modulus.
 *
 * The formula is:
 *
 * ```
 * ((a % b) + b) % b
 * ```
 *
 * The result is always in the range `[0, b)` and never negative, even if `a` is
 * negative. This is useful when looking up arrays.
 */
export function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}


/**
 * Rounds x to the next power of 2.
 *
 * It is assumed that x is a positive integer.
 */
export function npo2(x: number): number {
  if (x <= 0) {
    return 1;
  }
  let y = 1;
  while (x) {
    x >>>= 1;
    y <<= 1;
  }
  return y;
}


export function TemplateClass(compiler: (...args: any[]) => string) {
  return (...args: any[]) => {
    const compiled = compiler.apply(null, args);
    const wrapper = new Function(`return(${compiled})`);
    return wrapper();
  };
}


export const getGlobal = new Function('return this;');


}  // namespace Utilities


/**
 * Run the specified function in response to the
 * [`DOMContentLoaded`](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event)
 * event.
 *
 * @returns the {@link Darblast} namespace (so that other calls can be chained).
 */
export function startup(fn: () => any): Object {
  window.addEventListener('DOMContentLoaded', fn);
  return Darblast;
}


}  // namespace Darblast


/**
 * @hidden
 */
const Utilities = Darblast.Utilities;

/**
 * @hidden
 */
const TemplateClass = Darblast.Utilities.TemplateClass;
