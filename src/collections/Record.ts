namespace Darblast {
export namespace Collections {


export type AnyView =
    Int8Array         |
    Uint8Array        |
    Uint8ClampedArray |
    Int16Array        |
    Uint16Array       |
    Int32Array        |
    Uint32Array       |
    Float32Array      |
    Float64Array;


export type FieldName = string | number;
export type FieldType =
    'int8'    |
    'uint8'   |
    'uint8c'  |
    'int16'   |
    'uint16'  |
    'int32'   |
    'uint32'  |
    'float32' |
    'float64';


export type PointerType = 'int8' | 'int16' | 'int32';


export class FieldDefinition {
  public readonly name: FieldName;
  public readonly type: FieldType;
  public readonly byteSize: number;
  public readonly logSize: number;
  public readonly viewConstructor;

  public constructor(name: FieldName, type: FieldType) {
    this.name = name;
    this.type = type;
    this.byteSize = FieldDefinition.getByteSize(type);
    this.logSize = FieldDefinition.getLogSize(type);
    this.viewConstructor = FieldDefinition.getViewConstructor(type);
  }

  public static getByteSize(type: FieldType): number {
    switch (type) {
    case 'int8':
    case 'uint8':
    case 'uint8c':
      return 1;
    case 'int16':
    case 'uint16':
      return 2;
    case 'int32':
    case 'uint32':
    case 'float32':
      return 4;
    case 'float64':
      return 8;
    default:
      throw new Error(`invalid type in field definition: ${type}`);
    }
  }

  public static getLogSize(type: FieldType): number {
    switch (type) {
    case 'int8':
    case 'uint8':
    case 'uint8c':
      return 0;
    case 'int16':
    case 'uint16':
      return 1;
    case 'int32':
    case 'uint32':
    case 'float32':
      return 2;
    case 'float64':
      return 3;
    default:
      throw new Error(`invalid type in field definition: ${type}`);
    }
  }

  public static getViewConstructor(type: FieldType) {
    switch (type) {
    case 'int8':
      return Int8Array;
    case 'uint8':
      return Uint8Array;
    case 'uint8c':
      return Uint8ClampedArray;
    case 'int16':
      return Int16Array
    case 'uint16':
      return Uint16Array;
    case 'int32':
      return Int32Array
    case 'uint32':
      return Uint32Array;
    case 'float32':
      return Float32Array
    case 'float64':
      return Float64Array;
    default:
      throw new Error(`invalid type in field definition: ${type}`);
    }
  }
}


class Bin {
  public capacity: number = 8;
  public items: FieldDefinition[] = [];

  public add(field: FieldDefinition): void {
    this.capacity -= field.byteSize;
    this.items.push(field);
  }
}


class BinPacker {
  private readonly _fields: FieldDefinition[];
  private readonly _bins: Bin[] = [];
  private readonly _offsets: {[name: string]: number} = Object.create(null);

  public constructor(fields: FieldDefinition[]) {
    this._fields = fields.slice().sort(
        (field1, field2) => field2.byteSize - field1.byteSize);
    this._fillBins();
    this._calculateOffsets();
  }

  private _fillBins(): void {
    const bins = this._bins;
    let i = -1;
    for (const field of this._fields) {
      if (i < 0 || !bins[i].capacity) {
        bins.push(new Bin());
        i++;
      }
      bins[i].add(field);
    }
  }

  private _calculateOffsets(): void {
    const bins = this._bins;
    for (let i = 0; i < bins.length; i++) {
      const items = bins[i].items;
      let offset = i * 8;
      for (let j = 0; j < items.length; j++) {
        const field = items[j];
        this._offsets[field.name] = offset;
        offset += field.byteSize;
      }
    }
  }

  public get offsets(): {[name: string]: number} {
    return this._offsets;
  }

  public get totalSize(): number {
    return this._bins.length * 8;
  }
}


export class RecordDefinition {
  public readonly fields: FieldDefinition[];
  private readonly _fieldsByName: {[name: string]: FieldDefinition} = Object.create(null);
  private readonly _sizes: {[name: string]: number} = Object.create(null);
  private readonly _logSizes: {[name: string]: number} = Object.create(null);
  private readonly _offsets: {[name: string]: number} = Object.create(null);
  private readonly _totalSize: number;

  public constructor(fields: FieldDefinition[]) {
    this.fields = fields;
    for (const field of fields) {
      if (field.name in this._fieldsByName) {
        throw new Error(`duplicate field ${JSON.stringify(field.name)}`);
      } else {
        this._fieldsByName[field.name] = field;
      }
    }
    this._sizes = this._getSizes();
    this._logSizes = this._getLogSizes();
    const packer = new BinPacker(fields);
    this._offsets = packer.offsets;
    this._totalSize = packer.totalSize;
  }

  private _getSizes(): {[name: string]: number} {
    const sizes: {[name: string]: number} = Object.create(null);
    for (const field of this.fields) {
      sizes[field.name] = field.byteSize;
    }
    return sizes;
  }

  private _getLogSizes(): {[name: string]: number} {
    const logSizes: {[name: string]: number} = Object.create(null);
    for (const field of this.fields) {
      logSizes[field.name] = field.logSize;
    }
    return logSizes;
  }

  public get byteSize(): number {
    return this._totalSize;
  }

  public getField(name: FieldName): FieldDefinition {
    return this._fieldsByName[name];
  }

  public getFieldOffset(name: FieldName): number {
    return this._offsets[name];
  }

  public getFieldIndex(name: FieldName): number {
    return this._offsets[name] >>> this._logSizes[name];
  }
}


export type Record = {[name: string]: number};


}  // namespace Collections
}  // namespace Darblast


type AnyView = Darblast.Collections.AnyView;
type FieldName = Darblast.Collections.FieldName;
type FieldType = Darblast.Collections.FieldType;
type PointerType = Darblast.Collections.PointerType;

type FieldDefinition = Darblast.Collections.FieldDefinition;
const FieldDefinition = Darblast.Collections.FieldDefinition;

type RecordDefinition = Darblast.Collections.RecordDefinition;
const RecordDefinition = Darblast.Collections.RecordDefinition;
