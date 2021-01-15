namespace Darblast {
export namespace Input {


/**
 * Key handler type.
 *
 * @param key  the
 *             [DOM key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
 *             name.
 */
export type KeyHandler = (key: string) => void;


/**
 * In TypeScript, {@link Keyboard} users should generally keep a reference to
 * this interface rather than a {@link Keyboard} object, so that the former can
 * be mocked in tests.
 */
export interface KeyboardInterface {
  /**
   * Indicates whether the given key is pressed.
   *
   * @param key  the
   *             [DOM key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
   *             name.
   * @returns  `true` if the specified key is pressed, `false` if not.
   */
  isPressed(key: string): boolean;

  /**
   * Sets the handler for `keydown` events.
   *
   * @param key  the
   *             [DOM key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
   *             name.
   * @param handler  user-defined function invoked when the given key is
   *                 pressed.
   * @chainable
   */
  on(key: string, handler: KeyHandler): KeyboardInterface;

  /**
   * Unsets the handler for `keydown` events. Doesn't do anything if no handler
   * is set.
   *
   * @param key  the
   *             [DOM key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
   *             name.
   * @chainable
   */
  off(key: string): KeyboardInterface;

  /**
   * Stops listening to key events and drops all references to any user-provided
   * handlers.
   *
   * Subsequent {@link on} and {@link off} calls will have no effect.
   */
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


}  // namespace Input
}  // namespace Darblast
