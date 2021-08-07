namespace Darblast {
export namespace Collections {


/**
 * Available field types, corresponding to TypedArray views.
 */
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


/**
 * Used to express record schemas concisely.
 *
 * Keys are field names, values are field types. Readers of these values must
 * ignore properties of the `Object` prototype such as `hasOwnProperty`. This
 * allows users to specify schemas in object literal notation.
 */
export type Schema = {[fieldName: string]: FieldType};


/**
 * Describes a field in a {@link Record}.
 */
export class FieldDefinition {
  /**
   * Name of the field.
   */
  public readonly name: string;

  /**
   * Type of the field.
   */
  public readonly type: FieldType;

  /**
   * Size of the field, in bytes.
   */
  public readonly byteSize: number;

  /**
   * Base 2 logarithm of the byte size, i.e. 0 for 8-bit integers, 1 for 16-bit
   * integers, etc.
   */
  public readonly logSize: number;

  /**
   * Reference to the TypedArray view constructor for the field's type, e.g.
   * `Int32Array` for 32-bit signed integers.
   */
  public readonly viewConstructor;

  /**
   * Constructs a FieldDefinition to describe a field with the specified name
   * and type.
   *
   * @param name  Field name.
   * @param type  Field type.
   */
  public constructor(name: string, type: FieldType) {
    this.name = name;
    this.type = type;
    this.byteSize = FieldDefinition.getByteSize(type);
    this.logSize = FieldDefinition.getLogSize(type);
    this.viewConstructor = FieldDefinition.getViewConstructor(type);
  }

  /**
   * Calculates the byte size for the given field type.
   *
   * This is used to calculate {@link byteSize}.
   *
   * @param type  A field type.
   * @returns The size of the specified type, in bytes.
   * @throws If an unknown type is specified.
   */
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

  /**
   * Calculates the byte size for the given field type.
   *
   * This is used to calculate {@link logSize}.
   *
   * @param type  A field type.
   * @returns The base 2 logarithmic size of the specified type.
   * @throws If an unknown type is specified.
   */
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

  /**
   * @param type  A field type.
   * @returns The TypedArray view constructor suitable for the specified type,
   *          e.g. `Int32Array` for 32-bit signed integers.
   * @throws If an unknown type is specified.
   */
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


/**
 * Describes the format of a record.
 *
 * In the Darblast Collections framework, a record is a chunk of binary data
 * that can be stored in [typed
 * arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
 * When read back in JavaScript it results in a dictionary (an `Object` with
 * `null` prototype) with string keys and number values.
 */
export class RecordDefinition {
  /**
   * Ordered list of fields stored in the records.
   */
  public readonly fields: FieldDefinition[];

  private readonly _fieldsByName: {[name: string]: FieldDefinition} = Object.create(null);
  private readonly _sizes: {[name: string]: number} = Object.create(null);
  private readonly _logSizes: {[name: string]: number} = Object.create(null);
  private readonly _offsets: {[name: string]: number} = Object.create(null);
  private readonly _totalSize: number;

  /**
   * @param fields  Ordered list of definitions for the fields of the records.
   * @throws If there are two or more fields with the same name.
   */
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

  /**
   * @returns The total size of a record, in bytes. This is always a multiple of
   *          8 because all fields are 64-bit aligned, and padding is added at
   *          the end if necessary.
   */
  public get byteSize(): number {
    return this._totalSize;
  }

  /**
   * @param name  The name of a field of the record.
   * @returns The {@link FieldDefinition} for the specified field.
   */
  public getField(name: string): FieldDefinition {
    return this._fieldsByName[name];
  }

  /**
   * Returns the byte offset of a field from the beginning of a record.
   *
   * @param name  The name of the field.
   * @returns The byte offset.
   */
  public getFieldOffset(name: string): number {
    return this._offsets[name];
  }

  /**
   * Returns an index that can be used to read the specified field in a
   * TypedArray view. This is calculated as the byte offset (as per
   * {@link getFieldOffset}) right-shifted by the
   * {@link FieldDefinition.logSize} of the field, so that the resulting value
   * is an index offset suitable for use in the TypedArray view for the type of
   * field.
   *
   * For example, if a 16-bit field has a byte offset of 6 bytes
   * {@link getFieldOffset} returns 6, but to read the field from an
   * `Int16Array` view we actually need an index offset of `6 >>> log2(2) =
   * 6 >>> 1 = 3`, which is returned by {@link getFieldIndex}.
   *
   * @param name  The field name.
   */
  public getFieldIndex(name: string): number {
    return this._offsets[name] >>> this._logSizes[name];
  }
}


/**
 * A record as it is rendered in JavaScript after being deserialized from a
 * typed array.
 */
export type Record = {[name: string]: number};


}  // namespace Collections
}  // namespace Darblast


const FieldDefinition = Darblast.Collections.FieldDefinition;
const RecordDefinition = Darblast.Collections.RecordDefinition;
