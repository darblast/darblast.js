/// <reference path="Record.ts"/>
/// <reference path="RecordStore.ts"/>


namespace Darblast {
export namespace Collections {


/**
 * Describes an index in an AVL tree.
 *
 * An index is defined by an ordered list of one or more fields of the user
 * records. The fields cannot be repeated, i.e. each field may be indexed at
 * most once.
 */
class Index {
  /**
   * @param keys  The list of field names.
   */
  public constructor(public readonly keys: FieldName[]) {}
}


class TaggedIndex {
  public constructor(public readonly keys: number[]) {}
}


/**
 * Multi-key, multi-index, TypedArray-based AVL tree implementation.
 *
 * This class can scale to several billion records while still maintaining
 * maximum performance.
 */
export class AVL {
  /**
   * Used to specify indices in the AVL constructor.
   */
  public static readonly Index = Index;

  /**
   * List of user fields of the stored records.
   *
   * This property is only for reporting purposes, and is not used internally.
   */
  public readonly fields: FieldDefinition[];

  /**
   * List of defined indices.
   *
   * This property is only for reporting purposes, and is not used internally.
   */
  public readonly indices: Index[];

  private readonly _pointerType: PointerType;
  private readonly _pointerTypeLogSize: number;

  private readonly _parentFieldTags: number[] = [];
  private readonly _leftChildFieldTags: number[] = [];
  private readonly _rightChildFieldTags: number[] = [];
  private readonly _balanceFieldTags: number[] = [];

  private readonly _userFieldTags: {[name: string]: number} =
      Object.create(null);

  private readonly _indices: TaggedIndex[];
  private readonly _store: RecordStore;
  private readonly _roots: number[];

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

  /**
   * @param fields  The list of fields stored in each record.
   * @param indices  A list of one or more index definitions to use to index the
   *                 tree.
   * @param pointerType  The type of field used to store internal node pointers.
   *                     This must be one of `int8`, `int16`, or `int32`, and
   *                     effectively defines the maximum level of scalability of
   *                     the data structure: the tree will support at most 127
   *                     nodes if it's set to `int8`, 32768 nodes for `int16`,
   *                     and ~2B for `int32`.
   */
  public constructor(
      fields: FieldDefinition[], indices: Index[],
      pointerType: PointerType = 'int32')
  {
    AVL._checkSchema(fields, indices);

    this.fields = fields;
    this.indices = indices;

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

    const allFields: FieldDefinition[] = [];
    let tag = 0;
    for (let i = 0; i < indices.length; i++) {
      allFields.push(new FieldDefinition(tag, pointerType));
      this._parentFieldTags.push(tag++);
      allFields.push(new FieldDefinition(tag, pointerType));
      this._leftChildFieldTags.push(tag++);
      allFields.push(new FieldDefinition(tag, pointerType));
      this._rightChildFieldTags.push(tag++);
      allFields.push(new FieldDefinition(tag, 'int8'));
      this._balanceFieldTags.push(tag++);
    }
    for (const field of fields) {
      allFields.push(new FieldDefinition(tag, field.type));
      this._userFieldTags[field.name] = tag++;
    }
    this._store = new RecordStore(allFields);

    this._indices = indices.map(
        index => new TaggedIndex(index.keys.map(
            name => this._userFieldTags[name], this)), this);

    this._roots = indices.map(_ => -1);
  }

  private _getLeftChild(index: number, recordIndex: number): number {
    return this._store.getField(recordIndex, this._leftChildFieldTags[index]);
  }

  private _getRightChild(index: number, recordIndex: number): number {
    return this._store.getField(recordIndex, this._rightChildFieldTags[index]);
  }

  private _compare(index: number, recordIndex: number, keys: number[]): number {
    for (let i = 0; i < keys.length; i++) {
      const value = this._store.getField(
          recordIndex, this._indices[index].keys[i]);
      if (keys[i] < value) {
        return -1;
      }
      if (keys[i] > value) {
        return 1;
      }
    }
    return 0;
  }

  private* _scan(
      index: number, recordIndex: number,
      keys: number[]): Generator<number, void>
  {
    if (recordIndex < 0) {
      return;
    }
    const cmp = this._compare(index, recordIndex, keys);
    if (cmp < 0) {
      yield* this._scan(index, this._getLeftChild(index, recordIndex), keys);
    } else if (cmp > 0) {
      yield* this._scan(index, this._getRightChild(index, recordIndex), keys);
    } else {
      yield* this._scan(index, this._getLeftChild(index, recordIndex), keys);
      yield recordIndex;
      yield* this._scan(index, this._getRightChild(index, recordIndex), keys);
    }
  }

  private _fillRecord(output: Record, recordIndex: number): Record {
    const data = this._store.getRecord_(recordIndex);
    for (const field of this.fields) {
      output[field.name] = data[this._userFieldTags[field.name]];
    }
    return output;
  }

  private readonly _record: Record = Object.create(null);

  public* scanFields(
      index: number, name: FieldName,
      ...keys: number[]): Generator<number, boolean, boolean>
  {
    const tag = this._userFieldTags[name];
    for (const recordIndex of this._scan(index, this._roots[index], keys)) {
      if (yield this._store.getField(recordIndex, tag)) {
        return false;
      }
    }
    return true;
  }

  public* scanRecords_(
      index: number, ...keys: number[]): Generator<Record, boolean, boolean>
  {
    for (const recordIndex of this._scan(index, this._roots[index], keys)) {
      if (yield this._fillRecord(this._record, recordIndex)) {
        return false;
      }
    }
    return true;
  }

  public* scanRecords(
      index: number, ...keys: number[]): Generator<Record, boolean, boolean>
  {
    for (const recordIndex of this._scan(index, this._roots[index], keys)) {
      if (yield this._fillRecord(Object.create(null), recordIndex)) {
        return false;
      }
    }
    return true;
  }

  private _lookup(index: number, recordIndex: number, keys: number[]): number {
    if (recordIndex < 0) {
      return -1;
    }
    const cmp = this._compare(index, recordIndex, keys);
    if (cmp < 0) {
      return this._lookup(index, this._getLeftChild(index, recordIndex), keys);
    } else if (cmp > 0) {
      return this._lookup(index, this._getRightChild(index, recordIndex), keys);
    } else {
      return recordIndex;
    }
  }

  public lookupField(
      index: number, name: FieldName, ...keys: number[]): number
  {
    const recordIndex = this._lookup(index, this._roots[index], keys);
    if (recordIndex < 0) {
      throw new Error(`keys ${JSON.stringify(keys)} not found`);
    } else {
      return this._store.getField(recordIndex, this._userFieldTags[name]);
    }
  }

  public lookupRecord_(index: number, ...keys: number[]): Record {
    const recordIndex = this._lookup(index, this._roots[index], keys);
    if (recordIndex < 0) {
      throw new Error(`keys ${JSON.stringify(keys)} not found`);
    } else {
      return this._fillRecord(this._record, recordIndex);
    }
  }

  public lookupRecord(index: number, ...keys: number[]): Record {
    const recordIndex = this._lookup(index, this._roots[index], keys);
    if (recordIndex < 0) {
      throw new Error(`keys ${JSON.stringify(keys)} not found`);
    } else {
      return this._fillRecord(Object.create(null), recordIndex);
    }
  }
}


}  // namespace Collections
}  // namespace Darblast


type AVL = Darblast.Collections.AVL;
const AVL = Darblast.Collections.AVL;
