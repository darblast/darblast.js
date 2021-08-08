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
  public readonly duration: number;

  public constructor(
      public readonly frames: Frame[],
      public readonly periodic: boolean,
      public readonly x0: number,
      public readonly y0: number)
  {
    if (!this.frames.length) {
      throw new Error('FrameAnimation must have at least 1 frame');
    }
    this.duration = this.frames.reduce(
        (duration, frame) => duration + frame.duration, 0);
  }

  public get width(): number {
    return this.frames[0].width;
  }

  public get height(): number {
    return this.frames[0].height;
  }
}


}  // namespace Drawing
}  // namespace Darblast


/**
 * @hidden
 */
type FrameAnimation = Darblast.Drawing.FrameAnimation;

/**
 * @hidden
 */
const FrameAnimation = Darblast.Drawing.FrameAnimation;
