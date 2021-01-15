namespace Darblast {


export type KeyHandler = (key: string) => void;


export interface KeyboardInterface {
  isPressed(key: string): boolean;
  on(key: string, handler: KeyHandler): KeyboardInterface;
  off(key: string): KeyboardInterface;
  destroy(): void;
}


export class Keyboard implements KeyboardInterface {
  private readonly _element: EventTarget;
  private readonly _state: {[key: string]: boolean} = Object.create(null);
  private readonly _handlers: {[key: string]: KeyHandler} = Object.create(null);

  public constructor(element: EventTarget = window) {
    this._element = element;
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._element.addEventListener('keydown', this._onKeyDown, false);
    this._element.addEventListener('keyup', this._onKeyUp, false);
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const key = event.code;
    if (!this._state[key]) {
      this._state[key] = true;
      this._handlers[key]?.(key);
    }
  }

  private _onKeyUp(event: KeyboardEvent): void {
    this._state[event.code] = false;
  }

  public isPressed(key: string): boolean {
    return !!this._state[key];
  }

  public on(key: string, handler: KeyHandler, scope: any = null): Keyboard {
    this._handlers[key] = handler.bind(scope);
    return this;
  }

  public off(key: string): Keyboard {
    delete this._handlers[key];
    return this;
  }

  public destroy(): void {
    this._element.removeEventListener('keydown', this._onKeyDown, false);
    this._element.removeEventListener('keyup', this._onKeyUp, false);
    for (const key in this._handlers) {
      delete this._handlers[key];
    }
  }
}


}  // namespace Darblast
