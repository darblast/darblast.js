/// <reference path="Record.ts"/>


namespace Darblast {
export namespace Collections {


type AnyView =
    Int8Array         |
    Uint8Array        |
    Uint8ClampedArray |
    Int16Array        |
    Uint16Array       |
    Int32Array        |
    Uint32Array       |
    Float32Array      |
    Float64Array;


class Index {
  public constructor(public readonly keys: FieldName[]) {}
}


class TaggedIndex {
  public constructor(public readonly keys: number[]) {}
}


interface LookupScannerInterface {
  lookup(keys: number[]): number;
}


export class AVL {
  public static readonly Index = Index;

  private readonly _pointerType: PointerType;
  private readonly _pointerTypeLogSize: number;

  private readonly _parentFieldTags: number[] = [];
  private readonly _leftChildFieldTags: number[] = [];
  private readonly _rightChildFieldTags: number[] = [];
  private readonly _heightFieldTags: number[] = [];

  private readonly _userFieldTags: {[name: string]: number} =
      Object.create(null);

  private readonly _schema: FieldDefinition[];
  private readonly _definition: RecordDefinition;
  private readonly _indices: TaggedIndex[];
  private readonly _recordSize: number;
  private readonly _offsets: number[];

  private readonly _roots: number[];

  private _capacity: number;
  private _size: number;
  private _data: ArrayBuffer;
  private _views: AnyView[];
  private _pointerView: AnyView;

  private static readonly AbstractScanner = class AbstractScanner {
    public constructor(
        protected readonly _tree: AVL,
        protected readonly _index: number)
    {
      const cardinality = this._tree._indices.length;
      if (this._index < 0 || this._index >= cardinality) {
        throw new Error(
            `invalid index ${this._index}, must be within [0, ${cardinality})`);
      }
    }

    protected _checkKeys(keys: number[]): number[] {
      if (keys.length > this._tree._indices.length) {
        throw new Error(`invalid key ${JSON.stringify(keys)} for index ${
            JSON.stringify(this._tree._indices[this._index].keys)}`);
      }
      return keys;
    }

    protected _compare(recordIndex: number, keys: number[]): number {
      const index = this._tree._indices[this._index];
      for (let i = 0; i < keys.length; i++) {
        const value = this._tree._getField(recordIndex, index.keys[i]);
        if (keys[i] < value) {
          return -1;
        }
        if (keys[i] > value) {
          return 1;
        }
      }
      return 0;
    }
  };

  private static readonly Scanner = class Scanner extends AVL.AbstractScanner {
    private readonly _keys: number[];

    public constructor(tree: AVL, index: number, keys: number[]) {
      super(tree, index);
      this._keys = this._checkKeys(keys);
    }

    private* _scan(recordIndex: number): Generator<number, void> {
      if (recordIndex >= 0) {
        const cmp = this._compare(recordIndex, this._keys);
        if (cmp < 0) {
          yield* this._scan(this._tree._getLeftChild(this._index, recordIndex));
        } else if (cmp > 0) {
          yield* this._scan(this._tree._getRightChild(this._index, recordIndex));
        } else {
          yield* this._scan(this._tree._getLeftChild(this._index, recordIndex));
          yield recordIndex;
          yield* this._scan(this._tree._getRightChild(this._index, recordIndex));
        }
      }
    }

    public scan(): Generator<number, void> {
      return this._scan(this._tree._roots[this._index]);
    }
  };

  private static readonly LookupScanner = class LookupScanner
      extends AVL.AbstractScanner implements LookupScannerInterface
  {
    private _lookup(recordIndex: number, keys: number[]): number {
      if (recordIndex < 0) {
        return -1;
      } else {
        const cmp = this._compare(recordIndex, keys);
        if (cmp < 0) {
          return this._lookup(
              this._tree._getLeftChild(this._index, recordIndex), keys);
        } else if (cmp > 0) {
          return this._lookup(
              this._tree._getRightChild(this._index, recordIndex), keys);
        } else {
          return recordIndex;
        }
      }
    }

    public lookup(keys: number[]): number {
      return this._lookup(
          this._tree._roots[this._index], this._checkKeys(keys));
    }
  };

  private readonly _lookupScanners: LookupScannerInterface[];

  private static _checkSchema(
      fields: FieldDefinition[], indices: Index[]): void
  {
    if (!fields.length) {
      throw new Error('no fields defined');
    }
    const names = new Set<string>();
    for (const field of fields) {
      const name = '' + field.name;
      if (name in names) {
        throw new Error(`duplicate field ${JSON.stringify(field.name)}`);
      } else {
        names.add(name);
      }
    }
    if (!indices.length) {
      throw new Error('no indices defined');
    }
    for (const index of indices) {
      const keys = new Set<string>();
      for (const key of index.keys) {
        const name = '' + key;
        if (name in keys) {
          throw new Error(`duplicate key ${JSON.stringify(key)} in index ${
              JSON.stringify(index.keys)}`);
        } else if (!fields.some(field => field.name == key)) {
          throw new Error(`unknown key ${JSON.stringify(key)}`);
        } else {
          keys.add(name);
        }
      }
    }
  }

  public constructor(
      fields: FieldDefinition[], indices: Index[],
      pointerType: PointerType = 'int32')
  {
    AVL._checkSchema(fields, indices);

    this._pointerType = pointerType;
    switch (pointerType) {
    case 'int8':
      this._pointerTypeLogSize = 0;
      break;
    case 'int16':
      this._pointerTypeLogSize = 1;
      break;
    case 'int32':
      this._pointerTypeLogSize = 2;
      break;
    default:
      throw new Error(`invalid pointer type ${JSON.stringify(pointerType)}`);
    }

    let tag = 0;
    for (let i = 0; i < indices.length; i++) {
      this._schema.push(new FieldDefinition(tag, pointerType));
      this._parentFieldTags.push(tag++);
      this._schema.push(new FieldDefinition(tag, pointerType));
      this._leftChildFieldTags.push(tag++);
      this._schema.push(new FieldDefinition(tag, pointerType));
      this._rightChildFieldTags.push(tag++);
      this._schema.push(new FieldDefinition(tag, pointerType));
      this._heightFieldTags.push(tag++);
    }
    for (const field of fields) {
      this._schema.push(new FieldDefinition(tag, field.type));
      this._userFieldTags[field.name] = tag++;
    }
    this._definition = new RecordDefinition(this._schema);

    this._indices = indices.map(
        index => new TaggedIndex(index.keys.map(
            name => this._userFieldTags[name], this)), this);

    this._recordSize = this._definition.byteSize;

    this._offsets = this._schema.map(
        field => this._definition.getFieldOffset(field.name), this);

    this._roots = indices.map(_ => -1);
    this._lookupScanners = indices.map(
        (_, index) => new AVL.LookupScanner(this, index), this);

    this._reset();
  }

  private _reset(): void {
    this._capacity = 1;
    this._size = 0;
    this._data = new ArrayBuffer(this._recordSize);
    this._views = this._schema.map(
        field => new field.viewConstructor(this._data), this);
    const PointerView = FieldDefinition.getViewConstructor(this._pointerType);
    this._pointerView = new PointerView(this._data);
  }

  public get cardinality(): number {
    return this._indices.length;
  }

  public get capacity(): number {
    return this._capacity;
  }

  public get size(): number {
    return this._size;
  }

  private _getField(recordIndex: number, tag: number): number {
    return this._views[tag][
        recordIndex * (this._recordSize >>> this._schema[tag].logSize) +
        this._offsets[tag]];
  }

  private _setField(recordIndex: number, tag: number, value: number): void {
    this._views[tag][
        recordIndex * (this._recordSize >>> this._schema[tag].logSize) +
        this._offsets[tag]] = value;
  }

  private _getParent(index: number, recordIndex: number): number {
    return this._pointerView[
        recordIndex * (this._recordSize >>> this._pointerTypeLogSize) +
        this._offsets[this._parentFieldTags[index]]];
  }

  private _setParent(index: number, recordIndex: number, value: number): void {
    this._pointerView[
        recordIndex * (this._recordSize >>> this._pointerTypeLogSize) +
        this._offsets[this._parentFieldTags[index]]] = value;
  }

  private _getLeftChild(index: number, recordIndex: number): number {
    return this._pointerView[
        recordIndex * (this._recordSize >>> this._pointerTypeLogSize) +
        this._offsets[this._leftChildFieldTags[index]]];
  }

  private _setLeftChild(
      index: number, recordIndex: number, value: number): void
  {
    this._pointerView[
        recordIndex * (this._recordSize >>> this._pointerTypeLogSize) +
        this._offsets[this._leftChildFieldTags[index]]] = value;
  }

  private _getRightChild(index: number, recordIndex: number): number {
    return this._pointerView[
        recordIndex * (this._recordSize >>> this._pointerTypeLogSize) +
        this._offsets[this._rightChildFieldTags[index]]];
  }

  private _setRightChild(
      index: number, recordIndex: number, value: number): void
  {
    this._pointerView[
        recordIndex * (this._recordSize >>> this._pointerTypeLogSize) +
        this._offsets[this._rightChildFieldTags[index]]] = value;
  }

  private _getHeight(index: number, recordIndex: number): number {
    return this._pointerView[
        recordIndex * (this._recordSize >>> this._pointerTypeLogSize) +
        this._offsets[this._heightFieldTags[index]]];
  }

  private _setHeight(index: number, recordIndex: number, value: number): void {
    this._pointerView[
        recordIndex * (this._recordSize >>> this._pointerTypeLogSize) +
        this._offsets[this._heightFieldTags[index]]] = value;
  }

  private* _scan(index: number, keys: number[]): Generator<number, void> {
    const scanner = new AVL.Scanner(this, index, keys);
    for (const recordIndex of scanner.scan()) {
      if (yield recordIndex) {
        break;
      }
    }
  }

  private readonly _record: Record = Object.create(null);

  private _fillRecord(record: Record, recordIndex: number): Record {
    for (const name in this._userFieldTags) {
      const tag = this._userFieldTags[name];
      const view = this._views[tag];
      const recordOffset = recordIndex * (
          this._recordSize >>> this._schema[tag].logSize);
      record[name] = view[recordOffset + this._offsets[tag]];
    }
    return record;
  }

  public* scanField(
      name: FieldName, index: number,
      ...keys: number[]): Generator<number, boolean, boolean>
  {
    const tag = this._userFieldTags[name];
    const recordSize = this._recordSize >>> this._schema[tag].logSize;
    const offset = this._offsets[tag];
    for (const recordIndex of this._scan(index, keys)) {
      if (yield this._views[tag][recordIndex * recordSize + offset]) {
        return false;
      }
    }
    return true;
  }

  private* _scanRecords(
      output: Record, index: number,
      keys: number[]): Generator<Record, boolean, boolean>
  {
    for (const recordIndex of this._scan(index, keys)) {
      if (yield this._fillRecord(output, recordIndex)) {
        return false;
      }
    }
    return true;
  }

  public scan_(
      index: number, ...keys: number[]): Generator<Record, boolean, boolean>
  {
    return this._scanRecords(this._record, index, keys);
  }

  public scan(
      index: number, ...keys: number[]): Generator<Record, boolean, boolean>
  {
    return this._scanRecords(Object.create(null), index, keys);
  }

  /*
  public getField(name: FieldName, index: number, ...keys: number[]): number {
    // TODO
  }

  public setField(name: FieldName, index: number, ...keys: number[]): void {
    // TODO
  }

  public getRecord_(index: number, ...keys: number[]): Record {
    // TODO
  }

  public getRecord(index: number, ...keys: number[]): Record {
    // TODO
  }
  */
}


}  // namespace Collections
}  // namespace Darblast


type AVL = Darblast.Collections.AVL;
const AVL = Darblast.Collections.AVL;
