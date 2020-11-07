/// <reference path="../GlobalMath.ts"/>
/// <reference path="../Utilities.ts"/>


namespace Darblast {
export namespace Collections {


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


export class FieldDefinition {
  public constructor(
      public readonly name: FieldName,
      public readonly type: FieldType) {}

  public get byteSize(): number {
    switch (this.type) {
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
      throw new Error(`invalid type in field definition: ${this.type}`);
    }
  }

  public get logSize(): number {
    switch (this.type) {
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
      throw new Error(`invalid type in field definition: ${this.type}`);
    }
  }

  public get viewConstructor() {
    switch (this.type) {
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
      throw new Error(`invalid type in field definition: ${this.type}`);
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


export class RecordStore {
  private readonly _definition: RecordDefinition;

  private _data: ArrayBuffer;
  private _size: number;
  private _capacity: number;

  private _views: {
    int8: Int8Array,
    uint8: Uint8Array,
    uint8c: Uint8ClampedArray,
    int16: Int16Array,
    uint16: Uint16Array,
    int32: Int32Array,
    uint32: Uint32Array,
    float32: Float32Array,
    float64: Float64Array,
  };

  public constructor(fields: FieldDefinition[]) {
    this._definition = new RecordDefinition(fields);
    this.erase();
  }

  private _resetViews(): void {
    this._views = {
      int8: new Int8Array(this._data),
      uint8: new Uint8Array(this._data),
      uint8c: new Uint8ClampedArray(this._data),
      int16: new Int16Array(this._data),
      uint16: new Uint16Array(this._data),
      int32: new Int32Array(this._data),
      uint32: new Uint32Array(this._data),
      float32: new Float32Array(this._data),
      float64: new Float64Array(this._data),
    };
  }

  public get size(): number {
    return this._size;
  }

  public get capacity(): number {
    return this._capacity;
  }

  private _realloc(capacity: number): void {
    this._capacity = capacity;
    const sourceView = new Uint8Array(this._data);
    const destinationView = new Uint8Array(new ArrayBuffer(
        this._capacity * this._definition.byteSize));
    destinationView.set(sourceView);
    this._data = sourceView.buffer;
    this._resetViews();
  }

  public reserve(capacity: number): void {
    if (capacity > this._capacity) {
      this._realloc(capacity);
    }
  }

  public shrink(capacity: number): void {
    capacity = GlobalMath.max(capacity, this._size);
    if (capacity < this._capacity) {
      this._realloc(capacity);
    }
  }

  private _checkIndex(index: number): void {
    if (index < 0 || index >= this._size) {
      throw new Error(`index ${index} out of range [0, ${this._size})`);
    }
  }

  public getField(recordIndex: number, name: FieldName): number {
    this._checkIndex(recordIndex);
    const definition = this._definition;
    const fieldIndex = definition.getFieldIndex(name);
    const field = definition.getField(name);
    const recordOffset = recordIndex * definition.byteSize;
    const index = recordOffset >>> field.logSize + fieldIndex;
    return this._views[field.type][index];
  }

  public setField(
      recordIndex: number, name: FieldName, value: number): RecordStore
  {
    this._checkIndex(recordIndex);
    const definition = this._definition;
    const fieldIndex = definition.getFieldIndex(name);
    const field = definition.getField(name);
    const recordOffset = recordIndex * definition.byteSize;
    const index = recordOffset >>> field.logSize + fieldIndex;
    this._views[field.type][index] = value;
    return this;
  }

  private readonly _record: Record = Object.create(null);

  public getRecord(index: number): Record {
    for (const field of this._definition.fields) {
      this._record[field.name] = this.getField(index, field.name);
    }
    return this._record;
  }

  public cloneRecord(index: number): Record {
    const record: Record = Object.create(null);
    for (const field of this._definition.fields) {
      record[field.name] = this.getField(index, field.name);
    }
    return record;
  }

  public push(record: Record): number {
    const index = this._size++;
    if (this._size > this._capacity) {
      this._realloc(Utilities.npo2(this._capacity + 1));
    }
    for (const field of this._definition.fields) {
      this.setField(index, field.name, record[field.name]);
    }
    return 0;
  }

  private _maybeShrink(): void {
    const capacity = Utilities.npo2(this._capacity) - 1;
    if (this._size <= capacity) {
      this._realloc(capacity);
    }
  }

  public pop(): void {
    if (this._size < 1) {
      throw new Error('cannot pop from an empty store');
    }
    this._size--;
  }

  public popAndShrink(): void {
    this.pop();
    this._maybeShrink();
  }

  public swap(index1: number, index2: number): void {
    this._checkIndex(index1);
    this._checkIndex(index2);
    // TODO
  }

  public swapAndPop(index: number): void {
    this._checkIndex(index);
    // TODO
  }

  public swapPopShrink(index: number): void {
    this.swapAndPop(index);
    this._maybeShrink();
  }

  public truncate(size: number): void {
    if (size < this._size) {
      this._size = size;
    }
  }

  public truncateAndShrink(size: number): void {
    if (size < this._size) {
      this._size = size;
      this._maybeShrink();
    }
  }

  public erase(): void {
    this._data = new ArrayBuffer(this._definition.byteSize);
    this._size = 0;
    this._capacity = 1;
    this._resetViews();
  }
}


}  // namespace Collections
}  // namespace Darblast


type FieldDefinition = Darblast.Collections.FieldDefinition;
const FieldDefinition = Darblast.Collections.FieldDefinition;

type RecordDefinition = Darblast.Collections.RecordDefinition;
const RecordDefinition = Darblast.Collections.RecordDefinition;

type RecordStore = Darblast.Collections.RecordStore;
const RecordStore = Darblast.Collections.RecordStore;
