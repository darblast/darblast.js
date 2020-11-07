/// <reference path="../GlobalMath.ts"/>
/// <reference path="../Utilities.ts"/>
/// <reference path="Record.ts"/>


namespace Darblast {
export namespace Collections {


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

  private _copyRecord(srcIndex: number, dstIndex: number): void {
    const size = this._definition.byteSize;
    const srcView = new Uint8Array(this._data, srcIndex * size, size);
    const dstView = new Uint8Array(this._data, dstIndex * size, size);
    dstView.set(srcView);
  }

  public swapAndPop(index: number): void {
    this._checkIndex(index);
    this._copyRecord(index, this._size - 1);
    this._size--;
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


type RecordStore = Darblast.Collections.RecordStore;
const RecordStore = Darblast.Collections.RecordStore;
