namespace Darblast {


/**
 * Implements a basic
 * [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)-based
 * render loop.
 *
 * The loop can be started and stopped more than once.
 *
 * This class is abstract. Subclasses must implement the {@link render} method
 * where they can make actual drawing calls on the canvas or the GL pipeline.
 */
export abstract class BaseRenderLoop {
  private _running: boolean = false;
  private _requestId: any = null;

  /**
   * Constructs a render loop object.
   *
   * The loop won't start automatically, you need to call {@link start}
   * explicitly.
   */
  public constructor() {
    this.renderFrame = this.renderFrame.bind(this);
  }

  /**
   * Starts the loop by requesting animation frames.
   *
   * A subsequent {@link stop} call stops the loop, i.e. prevents it from
   * requesting any other animation frames. It can then be started again.
   */
  public start(): void {
    if (!this._running) {
      this._running = true;
      this._requestId = window.requestAnimationFrame(this.renderFrame);
    }
  }

  /**
   * Stops the loop, preventing it from requesting any other animation frames.
   *
   * See {@link start} for more information.
   */
  public stop(): void {
    if (this._running) {
      this._running = false;
      window.cancelAnimationFrame(this._requestId);
      this._requestId = null;
    }
  }

  /**
   * Performs the actual rendering.
   *
   * Subclasses implement this method with their own rendering.
   *
   * @param t  the current time in milliseconds.
   */
  public abstract render(t: number): void;

  private renderFrame(): void {
    this.render(Date.now());
    if (this._running) {
      this._requestId = window.requestAnimationFrame(this.renderFrame);
    } else {
      this._requestId = null;
    }
  }
}


/**
 * Callback-based render loop.
 *
 * This class works like {@link BaseRenderLoop}, but users provide the
 * {@link BaseRenderLoop.render} implementation as a callback function.
 */
export class CallbackRenderLoop extends BaseRenderLoop {
  /**
   * Constructs a CallbackRenderLoop.
   *
   * @param _callback  user-defined function called by {@link render}.
   */
  public constructor(private readonly _callback: (t: number) => any) {
    super();
  }

  public render(t: number): void {
    this._callback(t);
  }
}


}  // namespace Darblast
