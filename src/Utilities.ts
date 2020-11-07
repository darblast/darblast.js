/// <reference path="GlobalMath.ts"/>


namespace Darblast {
export namespace Utilities {


export function npo2(x: number): number {
  if (x <= 0) {
    return 1;
  }
  return 2 ** (GlobalMath.floor(GlobalMath.log2(x)) + 1);
}


}  // namespace Utilities
}  // namespace Darblast


const Utilities = Darblast.Utilities;
