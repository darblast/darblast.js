/// <reference path="GlobalMath.ts"/>


namespace Darblast {
export namespace Utilities {


/**
 * Compares two numbers with a tolerance.
 *
 * @param a  The first number.
 * @param b  The second number.
 * @param e  The tolerance.
 * @returns `true` iff `b` is in the closed range `[a-e, a+e]`.
 */
export function almostEquals(a: number, b: number, e: number): boolean {
  return b >= a - e && b <= a + e;
}


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


/**
 * Generates an array of `length` consecutive integers.
 *
 * The returned integers may optionally start from an `offset`, which defaults
 * to 0.
 *
 * For example, `range(6, 4)` will return `[4, 5, 6, 7, 8, 9]`.
 *
 * @param length  the number of integers to generate.
 * @param offset  the offset of the generated values (the values range from
 *                `offset` to `length - offset`, inclusive).
 *
 * @returns the generated array.
 */
export function range(length: number, offset: number = 0): number[] {
  return Array.from({length}, (_, i) => offset + i);
}


/**
 * Shuffles an array in place.
 *
 * This function produces a uniformly distributed pseudo-random permutation. It
 * uses the [Knuth / Fisher-Yates shuffle
 * algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).
 *
 * It is not safe for cryptographic purposes because it uses `Math.random` for
 * randomization, which is in turn not cryptographically safe.
 *
 * @returns the input array.
 */
export function shuffle<Element>(array: Element[]): Element[] {
  for (let i = 0; i < array.length; i++) {
    const j = i + GlobalMath.floor(GlobalMath.random() * (array.length - i));
    const t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
  return array;
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
