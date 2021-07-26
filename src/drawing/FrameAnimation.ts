namespace Darblast {
export namespace Drawing {


export class Frame {
  public constructor(
      public readonly image: HTMLImageElement,
      public readonly duration: number = 0) {}

  public get width(): number {
    return this.image.width;
  }

  public get height(): number {
    return this.image.height;
  }
}


export class FrameAnimation {
  public constructor(
      public readonly frames: Frame[],
      public readonly periodic: boolean,
      public readonly x0: number,
      public readonly y0: number)
  {
    if (!this.frames.length) {
      throw new Error('FrameAnimation must have at least 1 frame');
    }
  }

  public get width(): number {
    return this.frames[0].width;
  }

  public get height(): number {
    return this.frames[0].height;
  }

  public getFrame(t0: number, t1: number): Frame {
    // TODO: get the right frame
    return this.frames[0];
  }
}


}  // namespace Drawing
}  // namespace Darblast


type FrameAnimation = Darblast.Drawing.FrameAnimation;
const FrameAnimation = Darblast.Drawing.FrameAnimation;
