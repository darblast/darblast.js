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

  private _compare(index: number, recordIndex: number, keys: number[]): number {
    for (let i = 0; i < keys.length; i++) {
      const value = this._getField(recordIndex, this._indices[index].keys[i]);
      if (keys[i] < value) {
        return -1;
      }
      if (keys[i] > value) {
        return 1;
      }
    }
    return 0;
  }

  private _checkKeys(index: number, keys: number[]): number[] {
    const cardinality = this._indices.length;
    if (index < 0 || index >= cardinality) {
      throw new Error(
          `invalid index ${index}, must be within [0, ${cardinality})`);
    }
    if (keys.length > cardinality) {
      throw new Error(`invalid key ${JSON.stringify(keys)} for index ${
          JSON.stringify(this._indices[index].keys)}`);
    }
    return keys;
  }

  private* _scanSubTree(
      index: number, recordIndex: number,
      keys: number[]): Generator<number, void>
  {
    if (recordIndex < 0) {
      return;
    }
    const cmp = this._compare(index, recordIndex, keys);
    if (cmp < 0) {
      yield* this._scanSubTree(
          index, this._getLeftChild(index, recordIndex), keys);
    } else if (cmp > 0) {
      yield* this._scanSubTree(
          index, this._getRightChild(index, recordIndex), keys);
    } else {
      yield* this._scanSubTree(
          index, this._getLeftChild(index, recordIndex), keys);
      yield recordIndex;
      yield* this._scanSubTree(
          index, this._getRightChild(index, recordIndex), keys);
    }
  }

  private _scan(index: number, keys: number[]): Generator<number, void> {
    return this._scanSubTree(
        index, this._roots[index], this._checkKeys(index, keys));
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
    for (const recordIndex of this._scan(index, this._checkKeys(index, keys))) {
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

  private _lookup(index: number, recordIndex: number, keys: number[]): number {
    if (recordIndex < 0) {
      return -1;
    }
    const cmp = this._compare(index, recordIndex, keys);
    if (cmp < 0) {
      return this._lookup(
          index, this._getLeftChild(index, recordIndex), keys);
    } else if (cmp > 0) {
      return this._lookup(
          index, this._getRightChild(index, recordIndex), keys);
    } else {
      return recordIndex;
    }
  }

  public contains(index: number, ...keys: number[]): boolean {
    return this._lookup(index, this._roots[index], keys) >= 0;
  }

  public getField(name: FieldName, index: number, ...keys: number[]): number {
    const recordIndex = this._lookup(index, this._roots[index], keys);
    if (recordIndex < 0) {
      throw new Error(`element not found: ${JSON.stringify(keys)}`);
    }
    return this._getField(recordIndex, this._userFieldTags[name]);
  }

  // TODO: setField

  public getRecord_(index: number, ...keys: number[]): Record {
    const recordIndex = this._lookup(index, this._roots[index], keys);
    if (recordIndex < 0) {
      throw new Error(`element not found: ${JSON.stringify(keys)}`);
    }
    return this._fillRecord(this._record, recordIndex);
  }

  public getRecord(index: number, ...keys: number[]): Record {
    const recordIndex = this._lookup(index, this._roots[index], keys);
    if (recordIndex < 0) {
      throw new Error(`element not found: ${JSON.stringify(keys)}`);
    }
    return this._fillRecord(Object.create(null), recordIndex);
  }
}


}  // namespace Collections
}  // namespace Darblast


type AVL = Darblast.Collections.AVL;
const AVL = Darblast.Collections.AVL;
