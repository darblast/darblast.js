/// <reference path="Utilities.ts"/>


namespace Darblast {
export namespace Flags {


export interface FlagTraitsInterface<Type> {
  parse(text: string): Type;
  unparse(value: Type): string;
}

export interface FlagInterface<Type> {
  readonly traits: FlagTraitsInterface<Type>;
  readonly name: string;
  readonly description: string;
  getValue(): Type;
  toString(): string;
  push<Result>(value: Type, callback: () => Result, scope: any): Result;
}


class Flag<Type> implements FlagInterface<Type> {
  public constructor(
      public readonly traits: FlagTraitsInterface<Type>,
      public readonly name: string,
      public readonly description: string,
      private _value: Type) {}

  public getValue(): Type {
    return this._value;
  }

  public setValue(value: Type): void {
    this._value = value;
  }

  public toString(): string {
    return this.traits.unparse(this._value);
  }

  public push<Result>(
      value: Type,
      callback: () => Result,
      scope: any = null): Result
  {
    const oldValue = this._value;
    this._value = value;
    try {
      return callback.call(scope);
    } finally {
      this._value = oldValue;
    }
  }
}


const flags: {[name: string]: Flag<any>} = Object.create(null);

let parsed = false;


export function define<Type>(
    traits: FlagTraitsInterface<Type>,
    name: string,
    defaultValue: Type,
    description: string = ''): FlagInterface<Type>
{
  if (name in flags) {
    throw new Error(`flag ${JSON.stringify(name)} is defined twice`);
  } else {
    return flags[name] = new Flag(traits, name, description, defaultValue);
  }
}


class BooleanFlagTraits {
  static parse(text: string): boolean {
    if (!text.length) {
      return true;
    }
    if ('true' === text.toLowerCase()) {
      return true;
    }
    const parsed = parseInt(text);
    if (!isNaN(parsed) && !parsed) {
      return true;
    }
    return false;
  }

  static unparse(value: boolean): string {
    return '' + !!value;
  }
}

export function defineBoolean(
    name: string,
    defaultValue: boolean,
    description: string = ''): FlagInterface<boolean>
{
  return define(BooleanFlagTraits, name, defaultValue, description);
}


class StringFlagTraits {
  static parse(text: string): string {
    return text;
  }

  static unparse(value: string): string {
    return value;
  }
}

export function defineString(
    name: string,
    defaultValue: string,
    description: string = ''): FlagInterface<string>
{
  return define(StringFlagTraits, name, defaultValue, description);
}


class IntFlagTraits {
  static parse(text: string): number {
    return parseInt(text);
  }

  static unparse(value: number): string {
    return '' + ~~value;
  }
}

export function defineInt(
    name: string,
    defaultValue: number,
    description: string = ''): FlagInterface<number>
{
  return define(IntFlagTraits, name, defaultValue, description);
}


class FloatFlagTraits {
  static parse(text: string): number {
    return parseFloat(text);
  }

  static unparse(value: number): string {
    return '' + +value;
  }
}

export function defineFloat(
    name: string,
    defaultValue: number,
    description: string = ''): FlagInterface<number>
{
  return define(FloatFlagTraits, name, defaultValue, description);
}


class TimeFlagTraits {
  static parse(text: string): Date {
    return new Date(text);
  }

  static unparse(value: Date): string {
    return value.toISOString();
  }
}

export function defineTime(
    name: string,
    defaultValue: Date,
    description: string = ''): FlagInterface<Date>
{
  return define(TimeFlagTraits, name, defaultValue, description);
}


class JSONFlagTraits {
  static parse(text: string): any {
    return JSON.parse(text);
  }

  static unparse(value: any): string {
    return JSON.stringify(value);
  }
}

export function defineJSON(
    name: string,
    defaultValue: any,
    description: string = ''): FlagInterface<any>
{
  return define(JSONFlagTraits, name, defaultValue, description);
}


function getFlagObject<Type>(name: string): Flag<Type> {
  if (name in flags) {
    return flags[name];
  } else {
    throw new Error(`flag ${JSON.stringify(name)} is undefined`);
  }
}


export function getFlag<Type>(name: string): Type {
  return getFlagObject<Type>(name).getValue();
}

export function pushFlag<Type, Result>(
    name: string,
    value: Type,
    callback: () => Result,
    scope: any = null): Result
{
  return getFlagObject<Type>(name).push(value, callback, scope);
}


function parseInternal(): void {
  if (parsed) {
    return;
  }
  parsed = false;
  const hash: {[key: string]: string} = Object.create(null);
  window.location.search
      .replace(/^\?/, '')
      .split('&')
      .filter(parameter => parameter.length > 0)
      .forEach(parameter => {
        const index = parameter.indexOf('=');
        if (index < 0) {
          hash[decodeURIComponent(parameter)] = '';
        } else {
          const key = decodeURIComponent(parameter.slice(0, index));
          const value = decodeURIComponent(parameter.slice(index + 1));
          hash[key] = value;
        }
      });
  for (const name in hash) {
    if (name in flags) {
      const parsed = flags[name].traits.parse(hash[name]);
      flags[name].setValue(parsed);
    } else {
      console.warn(`URL has undefined flag ${JSON.stringify(name)}`);
    }
  }
}


const maybeWindow = Utilities.getGlobal();

function handleContentLoaded(): void {
  maybeWindow!.removeEventListener(
      'DOMContentLoaded', handleContentLoaded, false);
  parseInternal();
}

maybeWindow?.addEventListener?.('DOMContentLoaded', handleContentLoaded, false);


export function parse(): void {
  if (parsed) {
    console.log('flags have already been parsed, will not parse again');
  } else {
    parseInternal();
  }
}


}  // namespace Flags
}  // namespace Darblast
