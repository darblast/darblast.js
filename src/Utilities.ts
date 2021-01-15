/// <reference path="GlobalMath.ts"/>


namespace Darblast {
export namespace Utilities {


export function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}


export function npo2(x: number): number {
  if (x <= 0) {
    return 1;
  }
  return 2 ** (GlobalMath.floor(GlobalMath.log2(x)) + 1);
}


export function TemplateClass(compiler: (...args: any[]) => string) {
  return (...args: any[]) => {
    const compiled = compiler.apply(null, args);
    const wrapper = new Function(`return(${compiled})`);
    return wrapper();
  };
}


}  // namespace Utilities


export function startup(fn: () => any): Object {
  window.addEventListener('DOMContentLoaded', fn);
  return Darblast;
}


}  // namespace Darblast


const Utilities = Darblast.Utilities;
const TemplateClass = Darblast.Utilities.TemplateClass;
