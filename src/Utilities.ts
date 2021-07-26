/// <reference path="GlobalMath.ts"/>


namespace Darblast {
export namespace Utilities {


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
 * Applies mixins to a class.
 *
 * See https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(
          derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(
              baseCtor.prototype, name) || Object.create(null));
    });
  });
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


export function startup(fn: () => any): Object {
  window.addEventListener('DOMContentLoaded', fn);
  return Darblast;
}


}  // namespace Darblast


const Utilities = Darblast.Utilities;
const applyMixins = Darblast.Utilities.applyMixins;
const TemplateClass = Darblast.Utilities.TemplateClass;
