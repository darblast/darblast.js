/// <reference path="../Utilities.ts"/>
/// <reference path="Record.ts"/>


namespace Darblast {
export namespace Collections {


export class Index {
  public constructor(public readonly keys: string[]) {}
}


function validateSchema(fields: FieldDefinition[], indices: Index[]): void {
  if (!fields.length) {
    throw new Error('at least one field must be specified');
  }
  const names = new Set<string>();
  for (const field of fields) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.name)) {
      throw new Error(`invalid field name ${JSON.stringify(field.name)}`);
    }
    if (field.name in names) {
      throw new Error(`duplicate name ${JSON.stringify(field.name)}`);
    } else {
      names.add(field.name);
    }
  }
  if (!indices.length) {
    throw new Error('at least one index must be defined');
  }
  for (const index of indices) {
    if (!index.keys.length) {
      throw new Error('an index cannot be empty');
    }
    for (const key of index.keys) {
      if (!(key in names)) {
        throw new Error(`unknown field ${key}`);
      }
    }
  }
}


/**
 * Compiles a JavaScript class to construct fast AVL trees.
 *
 * TODO(jim): provide more details.
 */
export const compileAVL = TemplateClass(
    (fields: FieldDefinition[], indices: Index[]): string =>
{
  validateSchema(fields, indices);

  const allFields = fields.slice();
  indices.forEach((_, index) => {
    allFields.push(
        new FieldDefinition(`$parent${index}`, 'uint32'),
        new FieldDefinition(`$left${index}`, 'uint32'),
        new FieldDefinition(`$right${index}`, 'uint32'),
        new FieldDefinition(`$balance${index}`, 'int8'));
  });

  const definition = new RecordDefinition(allFields);

  const fieldMap: {[name: string]: FieldDefinition} = Object.create(null);
  for (const field of allFields) {
    fieldMap[field.name] = field;
  }

  const getNodeField = (node: string, name: string) =>
      `this._views${fieldMap[name].type}[
          ${node} * ${definition.byteSize >>> fieldMap[name].logSize} +
          ${definition.getFieldIndex(name)}]`;

  const setNodeField = (node: string, name: string, value: string) =>
      `${getNodeField(node, name)} = ${value};`;

  const getField = (name: string) => getNodeField('node', name);

  const setField = (name: string, value: string) =>
      setNodeField('node', name, value);

  return `
    class AVL {
      _data = new ArrayBuffer(${definition.byteSize});
      _capacity = 1;
      _size = 0;

      _views = {
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

      ${indices.map((_, index) => `
          _root${index} = 0;`).join('')}

      _realloc(capacity) {
        const target = new Uint8Array(capacity * ${definition.byteSize});
        target.set(this._views.uint8);
        this._data = target.buffer;
        this._capacity = capacity;
        this._views.int8 = new Int8Array(this._data);
        this._views.uint8 = new Uint8Array(this._data);
        this._views.uint8c = new Uint8ClampedArray(this._data);
        this._views.int16 = new Int16Array(this._data);
        this._views.uint16 = new Uint16Array(this._data);
        this._views.int32 = new Int32Array(this._data);
        this._views.uint32 = new Uint32Array(this._data);
        this._views.float32 = new Float32Array(this._data);
        this._views.float64 = new Float64Array(this._data);
      }

      get size() {
        return this._size;
      }

      get capacity() {
        return this._capacity;
      }

      _fillRecord(node, output) {
        ${fields.map(field => `
          output.${field} = ${getField(field.name)};
        `).join('')}
        return output;
      }

      _record = Object.create(null);

      ${indices.map((_, index) => {
        const keys = indices[index].keys;
        const keyArgs = keys.join(', ');
        return `
          _comparePartial${index}(keys) {
            ${keys.map((key, i) => `
              if (keys.length > ${i}) {
                const value = ${getField(key)};
                if (keys[${i}] !== value) {
                  return value - keys[${i}];
                }
              }
            `).join('')}
            return 0;
          }

          *_scan${index}(node, keys) {
            if (!node) {
              return;
            }
            const cmp = this._comparePartial${index}(node, keys);
            if (cmp < 0) {
              yield* this._scan(${getField(`$left${index}`)}, keys);
            } else if (cmp > 0) {
              yield* this._scan(${getField(`$right${index}`)}, keys);
            } else {
              yield* this._scan(${getField(`$left${index}`)}, keys);
              yield node;
              yield* this._scan(${getField(`$right${index}`)}, keys);
            }
          }

          *scan${index}_(...keys) {
            for (const node of this._scan${index}(this._root${index}, keys)) {
              if (yield this._fillRecord(node, this._record)) {
                return false;
              }
            }
            return true;
          }

          *scan${index}(...keys) {
            for (const node of this._scan${index}(this._root${index}, keys)) {
              if (yield this._fillRecord(node, Object.create(null))) {
                return false;
              }
            }
            return true;
          }

          *_lowerBound${index}(node, keys) {
            if (!node) {
              return;
            }
            const cmp = this._comparePartial${index}(node, keys);
            if (cmp >= 0) {
              yield* this._scan(${getField(`$left${index}`)}, keys);
              yield node;
              yield* this._scan(${getField(`$right${index}`)}, keys);
            }
          }

          *lowerBound${index}_(...keys) {
            for (const node of this._lowerBound${index}(
                this._root${index}, keys))
            {
              if (yield this._fillRecord(node, this._record)) {
                return false;
              }
            }
            return true;
          }

          *lowerBound${index}(...keys) {
            for (const node of this._lowerBound${index}(
                this._root${index}, keys))
            {
              if (yield this._fillRecord(node, Object.create(null))) {
                return false;
              }
            }
            return true;
          }

          *_upperBound${index}(node, keys) {
            if (!node) {
              return;
            }
            const cmp = this._comparePartial${index}(node, keys);
            if (cmp < 0) {
              yield* this._scan(${getField(`$left${index}`)}, keys);
              yield node;
              yield* this._scan(${getField(`$right${index}`)}, keys);
            }
          }

          *upperBound${index}_(...keys) {
            for (const node of this._upperBound${index}(
                this._root${index}, keys))
            {
              if (yield this._fillRecord(node, this._record)) {
                return false;
              }
            }
            return true;
          }

          *upperBound${index}(...keys) {
            for (const node of this._upperBound${index}(
                this._root${index}, keys))
            {
              if (yield this._fillRecord(node, Object.create(null))) {
                return false;
              }
            }
            return true;
          }

          _compare${index}(node, ${keyArgs}) {
            ${keys.map(key => `
              {
                const value = ${getField(key)};
                if (${key} !== value) {
                  return value - ${key};
                }
              }
            `).join('')}
            return 0;
          }

          _lookup${index}(node, ${keyArgs}) {
            if (!node) {
              return 0;
            }
            const cmp = this._compare(node, ${keyArgs});
            if (cmp < 0) {
              return this._lookup(${getField(`$left${index}`)}, ${keyArgs});
            } else if (cmp > 0) {
              return this._lookup(${getField(`$right${index}`)}, ${keyArgs});
            } else {
              return node;
            }
          }

          lookup${index}_(${keyArgs}) {
            const node = this._lookup${index}(${keyArgs});
            if (node) {
              return this._fillRecord(node, this._record);
            } else {
              throw new Error('element not found');
            }
          }

          lookup${index}(${keyArgs}) {
            const node = this._lookup${index}(${keyArgs});
            if (node) {
              return this._fillRecord(node, Object.create(null));
            } else {
              throw new Error('element not found');
            }
          }
        `;
      }).join('')}

      scan_ = scan0_;
      scan = scan0;
      lowerBound_ = lowerBound0_;
      lowerBound = lowerBound0;
      upperBound_ = upperBound0_;
      upperBound = upperBound0;
      lookup_ = lookup0_;
      lookup = lookup0;
    }
  `;
});


/**
 * Provides methods to compile AVL trees.
 *
 * The provided methods are just convenience wrappers for
 * {@link Darblast.Collections.compileAVL}.
 */
export class AVL {
  /**
   * Alias for {@link Darblast.Collections.compileAVL}.
   */
  public static readonly compile = compileAVL;

  /**
   * Convenience function to compile an AVL tree class from a {@link Schema}.
   *
   * @param schema  A {@link Schema} describing the fields of the
   *                {@link Record}s to store in the tree.
   * @param keys  List of fields to use as keys. This has the same meaning as in
   *              the {@link compileAVL} function.
   */
  public static fromSchema(schema: Schema, indices: string[][]) {
    const fields: FieldDefinition[] = [];
    for (const name in schema) {
      if (schema.hasOwnProperty(name)) {
        fields.push(new FieldDefinition(name, schema[name]));
      }
    }
    return compileAVL(fields, indices.map(keys => new Index(keys)));
  }
};


}  // namespace Collections
}  // namespace Darblast


const compileAVL = Darblast.Collections.compileAVL;
const AVL = Darblast.Collections.AVL;
