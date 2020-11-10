/// <reference path="GlobalMath.ts"/>


namespace Darblast {
export namespace Utilities {


export function npo2(x: number): number {
  if (x <= 0) {
    return 1;
  }
  return 2 ** (GlobalMath.floor(GlobalMath.log2(x)) + 1);
}


export function TemplateClass(compiler: (...args: any) => string) {
  return () => {
    const wrapper = new Function(`return(${compiler.apply(null, arguments)})`);
    return wrapper();
  };
}


}  // namespace Utilities
}  // namespace Darblast


const Utilities = Darblast.Utilities;
const TemplateClass = Darblast.Utilities.TemplateClass;
