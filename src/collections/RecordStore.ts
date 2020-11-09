/// <reference path="Record.ts"/>


namespace Darblast {
export namespace Collections {


/**
 * Memory store for binary data based on TypedArrays.
 *
 * The store acts as a dynamic array of records, each record being defined by a
 * set of fields as per {@link RecordDefinition}.
 */
export class RecordStore {
  private readonly _definition: RecordDefinition;

  private _data: ArrayBuffer;
  private _size: number;
  private _capacity: number;

  private readonly _views: {[name: string]: AnyView} = Object.create(null);

  /**
   * @param fields  List of fields in each record.
   */
  public constructor(fields: FieldDefinition[]) {
    this._definition = new RecordDefinition(fields);
    this._reset();
  }

  private _resetViews(): void {
    for (const field of this._definition.fields) {
      this._views[field.name] = new field.viewConstructor(this._data);
    }
  }

  private _reset(): void {
    this._data = new ArrayBuffer(this._definition.byteSize);
    this._size = 0;
    this._capacity = 1;
    this._resetViews();
  }

  /**
   * @returns The number of records in the store.
   */
  public get size(): number {
    return this._size;
  }

  /**
   * @returns The capacity of the store, which may be higher than the size
   *          because the store tries to minimize reallocations by doubling the
   *          capacity at every reallocation.
   */
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

  private _checkIndex(index: number): void {
    if (index < 0 || index >= this._size) {
      throw new Error(`index ${index} out of range [0, ${this._size})`);
    }
  }

  /**
   * Reads a field from a record in the store.
   *
   * @param index  Record index. Must be within the range [0, size).
   * @param name  Name of the field to read.
   * @returns The field value.
   * @throws If `index` is out of range.
   */
  public getField(index: number, name: FieldName): number {
    this._checkIndex(index);
    const definition = this._definition;
    return this._views[name][
        index * (definition.byteSize >>> definition.getField(name).logSize) +
        definition.getFieldOffset(name)];
  }

  /**
   * Writes to a field of a record in the store.
   *
   * @param index  Record index. Must be within the range [0, size).
   * @param name  Name of the field to read.
   * @param value  The value to write.
   * @throws If `index` is out of range.
   */
  public setField(index: number, name: FieldName, value: number): void {
    this._checkIndex(index);
    const definition = this._definition;
    this._views[name][
        index * (definition.byteSize >>> definition.getField(name).logSize) +
        definition.getFieldOffset(name)] = value;
  }

  private _fillRecord(output: Record, index: number): Record {
    this._checkIndex(index);
    const definition = this._definition;
    for (const field of definition.fields) {
      output[field.name] = this._views[field.name][
          index * (definition.byteSize >>> field.logSize) +
          definition.getFieldOffset(field.name)];
    }
    return output;
  }

  private readonly _record: Record = Object.create(null);

  /**
   * Reads a record from the store.
   *
   * NOTE: in order to reduce strain on the garbage collector, rather than
   * returning a new object at every call, this method reuses an internal
   * object. **Do not reuse the returned object across calls**. If you need to
   * generate a new, reusable object, please call {@link getRecord}.
   *
   * @param index  Index of the record to read. Must be within the range
   *               [0, size).
   * @returns A {@link Record} object with the read values.
   * @throws If `index` is out of range.
   */
  public getRecord_(index: number): Record {
    return this._fillRecord(this._record, index);
  }

  /**
   * Reads a record from the store.
   *
   * @param index  Index of the record to read. Must be within the range
   *               [0, size).
   * @returns A {@link Record} object with the read values.
   * @throws If `index` is out of range.
   */
  public getRecord(index: number): Record {
    const record: Record = Object.create(null);
    return this._fillRecord(record, index);
  }

  /**
   * Writes a record to the store.
   *
   * @param index  Index of the record to write. Must be within the range
   *               [0, size).
   * @param record  A {@link Record} object containing the values to write.
   * @throws If `index` is out of range.
   */
  public setRecord(index: number, record: Record): void {
    this._checkIndex(index);
    const definition = this._definition;
    for (const field of definition.fields) {
      this._views[field.name][
          index * (definition.byteSize >>> field.logSize) +
          definition.getFieldOffset(field.name)] = record[field.name];
    }
  }

  /**
   * Inserts a new record at the end of the store.
   *
   * @param record  A {@link Record} object with the values to write.
   * @returns The index of the new record.
   */
  public push(record: Record): number {
    const index = this._size++;
    if (this._size > this._capacity) {
      this._realloc(this._capacity * 2);
    }
    const definition = this._definition;
    for (const field of definition.fields) {
      this._views[field.name][
          index * (definition.byteSize >>> field.logSize) +
          definition.getFieldOffset(field.name)] = record[field.name];
    }
    return index;
  }

  /**
   * Inserts the specified values in a new record at the end of the store.
   *
   * @param values  The values corresponding to the fields of the record. There
   *                must be one value for each {@link FieldDefinition} object
   *                specified in the {@link RecordStore} constructor, and the
   *                values must be specified in the same order as the field
   *                definitions.
   * @returns The index of the new record.
   */
  public emplace(...values: number[]): number {
    const index = this._size++;
    if (this._size > this._capacity) {
      this._realloc(this._capacity * 2);
    }
    const definition = this._definition;
    for (let i = 0; i < definition.fields.length; i++) {
      const field = definition.fields[i];
      this._views[field.name][
          index * (definition.byteSize >>> field.logSize) +
          definition.getFieldOffset(field.name)] = values[i];
    }
    return index;
  }

  /**
   * Removes the last record from the store.
   *
   * This method shrinks the underlying storage if no more than half of the
   * capacity is used after popping, and it's equivalent to a {@link quickPop}
   * call followed by a {@link shrink}.
   *
   * @throws If the store is empty.
   */
  public pop(): void {
    this.quickPop();
    this.shrink();
  }

  /**
   * Removes the last record from the store.
   *
   * This method does not try to shrink the storage, it only decreases the
   * {@link size}. Therefore it is potentially faster than {@link pop} because
   * it doesn't do any reallocations.
   *
   * @throws If the store is empty.
   */
  public quickPop(): void {
    if (this._size < 1) {
      throw new Error('cannot pop from an empty RecordStore');
    }
    this._size--;
  }

  /**
   * Checks if the underlying storage can be downsized, and if so it performs a
   * reallocation.
   *
   * Downsizing is performed if no more than half of the capacity is being used.
   *
   * @returns A boolean indicating whether downsizing happened.
   */
  public shrink(): boolean {
    if (this._size > 0) {
      const capacity = this._capacity >>> 1;
      if (capacity > 0 && this._size <= capacity) {
        this._realloc(capacity);
        return true;
      }
    }
    return false;
  }

  /**
   * Copies a record over to another record slot.
   *
   * @param sourceIndex  Index of the record to copy.
   * @param destinationIndex  Index of the destination slot.
   * @throws If either index is out of the range [0, size).
   */
  public copy(sourceIndex: number, destinationIndex: number): void {
    this._checkIndex(sourceIndex);
    this._checkIndex(destinationIndex);
    const recordSize = this._definition.byteSize;
    const sourceView = new Uint8Array(
        this._data, sourceIndex * recordSize, recordSize);
    const destinationView = new Uint8Array(
        this._data, destinationIndex * recordSize, recordSize);
    destinationView.set(sourceView);
  }

  /**
   * Swaps the content of two records.
   *
   * @param index1  Index of the first record.
   * @param index2  Index of the second record.
   * @throws If either index is out of the range [0, size).
   */
  public swap(index1: number, index2: number): void {
    this._checkIndex(index1);
    this._checkIndex(index2);
    const recordSize = this._definition.byteSize;
    const view1 = new Uint8Array(this._data, index1 * recordSize, recordSize);
    const view2 = new Uint8Array(this._data, index2 * recordSize, recordSize);
    const temp = new Uint8Array(new ArrayBuffer(recordSize));
    temp.set(view1);
    view1.set(view2);
    view2.set(temp);
  }
}


}  // namespace Collections
}  // namespace Darblast


type RecordStore = Darblast.Collections.RecordStore;
const RecordStore = Darblast.Collections.RecordStore;
