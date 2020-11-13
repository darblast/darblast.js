/// <reference path="../Utilities.ts"/>
/// <reference path="Record.ts"/>


namespace Darblast {
export namespace Collections {


function validateSchema(fields: FieldDefinition[], keys: string[]): void {
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
  if (!keys.length) {
    throw new Error('there must be at least one key');
  }
  for (const key of keys) {
    if (!(key in names)) {
      throw new Error(`unknown field ${JSON.stringify(key)}`);
    }
  }
}


/**
 * Compiles a JavaScript class to construct fast AVL trees.
 *
 * TODO(jim): provide more details.
 */
export const compileAVL = TemplateClass(
    (fields: FieldDefinition[], keys: string[]): string =>
{
  validateSchema(fields, keys);

  const allFields: FieldDefinition[] = [
    new FieldDefinition('$parent', 'uint32'),
    new FieldDefinition('$left', 'uint32'),
    new FieldDefinition('$right', 'uint32'),
    new FieldDefinition('$balance', 'int8'),
  ].concat(fields);

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

  const swapFields = (name: string) => `
      temp = ${getNodeField('node', name)};
      ${getNodeField('node', name)} = ${getNodeField('last', name)};
      ${getNodeField('last', name)} = temp;`;

  const keyArgs = keys.join(', ');

  return `
    class AVL {
      _data = new ArrayBuffer(${definition.byteSize});
      _capacity = 1;
      _size = 0;

      _view = {
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

      _root = 0;

      _realloc(capacity) {
        const sourceView = new Uint8Array(this._data);
        const destinationView = new Uint8Array(new ArrayBuffer(
            capacity * ${definition.byteSize}));
        destinationView.set(sourceView);
        this._data = destinationView.buffer;
        this._capacity = capacity;
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

      get size() {
        return this._size;
      }

      get capacity() {
        return this._capacity;
      }

      _compare(node, ${keyArgs}) {
        ${keys.map(key => `
          if (${key} < ${getField(key)}) { return -1; } else
          if (${key} > ${getField(key)}) { return 1; } else
        `).join('')} { return 0; }
      }

      *_scan(node, ${keyArgs}) {
        if (!node) {
          return;
        }
        const cmp = this._compare(node, ${keyArgs});
        if (cmp < 0) {
          yield* this._scan(${getField('$left')}, ${keyArgs});
        } else if (cmp > 0) {
          yield* this._scan(${getField('$right')}, ${keyArgs});
        } else {
          yield* this._scan(${getField('$left')}, ${keyArgs});
          yield node;
          yield* this._scan(${getField('$right')}, ${keyArgs});
        }
      }

      *_lowerBound(node, ${keyArgs}) {
        if (!node) {
          return;
        }
        const cmp = this._compare(node, ${keyArgs});
        if (cmp >= 0) {
          yield* this._scan(${getField('$left')}, ${keyArgs});
          yield node;
          yield* this._scan(${getField('$right')}, ${keyArgs});
        }
      }

      *_upperBound(node, ${keyArgs}) {
        if (!node) {
          return;
        }
        const cmp = this._compare(node, ${keyArgs});
        if (cmp < 0) {
          yield* this._scan(${getField('$left')}, ${keyArgs});
          yield node;
          yield* this._scan(${getField('$right')}, ${keyArgs});
        }
      }

      _lookup(node, ${keyArgs}) {
        if (!node) {
          return 0;
        }
        const cmp = this._compare(node, ${keyArgs});
        if (cmp < 0) {
          return this._lookup(${getField('$left')}, ${keyArgs});
        } else if (cmp > 0) {
          return this._lookup(${getField('$right')}, ${keyArgs});
        } else {
          return 0;
        }
      }

      _fillRecord(node, output) {
        ${fields.map(field => `
          output.${field} = ${getField(field.name)};
        `).join('')}
        return output;
      }

      _record = Object.create(null);

      *scan_(${keyArgs}) {
        for (const node of this._scan(this._root, ${keyArgs})) {
          if (yield this._fillRecord(node, this._record)) {
            return false;
          }
        }
        return true;
      }

      *scan(${keyArgs}) {
        for (const node of this._scan(this._root, ${keyArgs})) {
          if (yield this._fillRecord(node, Object.create(null))) {
            return false;
          }
        }
        return true;
      }

      *lowerBound_(${keyArgs}) {
        for (const node of this._lowerBound(this._root, ${keyArgs})) {
          if (yield this._fillRecord(node, this._record)) {
            return false;
          }
        }
        return true;
      }

      *lowerBound(${keyArgs}) {
        for (const node of this._lowerBound(this._root, ${keyArgs})) {
          if (yield this._fillRecord(node, Object.create(null))) {
            return false;
          }
        }
        return true;
      }

      *upperBound_(${keyArgs}) {
        for (const node of this._upperBound(this._root, ${keyArgs})) {
          if (yield this._fillRecord(node, this._record)) {
            return false;
          }
        }
        return true;
      }

      *upperBound(${keyArgs}) {
        for (const node of this._upperBound(this._root, ${keyArgs})) {
          if (yield this._fillRecord(node, Object.create(null))) {
            return false;
          }
        }
        return true;
      }

      lookup_(${keyArgs}) {
        const node = this._lookup(this._root, ${keyArgs});
        if (node > 0) {
          return this._fillRecord(node, this._record);
        } else {
          const key = JSON.stringify([${keyArgs}]);
          throw new Error('element with key ' + key + ' not found');
        }
      }

      lookup(${keyArgs}) {
        const node = this._lookup(this._root, ${keyArgs});
        if (node > 0) {
          return this._fillRecord(node, Object.create(null));
        } else {
          const key = JSON.stringify([${keyArgs}]);
          throw new Error('element with key ' + key + ' not found');
        }
      }

      contains(${keyArgs}) {
        const node = this._lookup(this._root, ${keyArgs});
        return node > 0;
      }

      _insert(parent, record) {
        const node = ++this._size;
        if (this._size + 1 > this._capacity) {
          this._realloc(this._capacity * 2);
        }
        ${setField('$parent', 'parent')}
        ${setField('$left', '0')}
        ${setField('$right', '0')}
        ${setField('$balance', '0')}
        ${fields.map(field => setField(
            field.name, `record.${field.name}`)).join('')}
        return node;
      }

      _insertOrUpdate(parent, node, record) {
        if (!node) {
          return this._insert(parent, record);
        }
        const cmp = this._compare(node, ${keys.map(
            key => `record.${key}`).join(', ')});
        if (cmp < 0) {
          ${setField('$left', `this._insertOrUpdate(
              node, ${getField('$left')}, record)`)}
        } else if (cmp > 0) {
          ${setField('$right', `this._insertOrUpdate(
              node, ${getField('$right')}, record)`)}
        } else {
          ${fields.map(field => setField(
              field.name, `record.${field.name}`)).join('')}
          return node;
        }
      }

      insertOrUpdate(record) {
        this._root = this._insertOrUpdate(0, this._root, record);
      }

      _swap(node) {
        const last = this._size--;
        if (node < last) {
          let temp;
          ${swapFields('$parent')}
          ${swapFields('$left')}
          ${swapFields('$right')}
          ${swapFields('$balance')}
          ${fields.map(field => swapFields(field.name)).join('')}
        }
      }

      _swapAndPop(node) {
        this._swap(node);
        const capacity = this._capacity >>> 1;
        if (this._size < capacity) {
          this._realloc(capacity);
        }
      }

      _remove(quick, node, ${keyArgs}) {
        if (!node) {
          return 0;
        }
        const cmp = this._compare(node, ${keyArgs});
        if (cmp < 0) {
          ${setField('$left', `this._remove(
              quick, ${getField('$left')}, ${keyArgs})`)}
          return node;
        } else if (cmp > 0) {
          ${setField('$right', `this._remove(
              quick, ${getField('$right')}, ${keyArgs})`)}
          return node;
        } else {
          if (quick) {
            this._swap(node);
          } else {
            this._swapAndPop(node);
          }
          // TODO
        }
      }

      remove(${keyArgs}) {
        this._root = this._remove(false, this._root, ${keyArgs});
      }

      removeRecord(record) {
        this._root = this._remove(
            false, this._root, ${keys.map(key => `record.${key}`).join(', ')});
      }

      quickRemove(${keyArgs}) {
        this._root = this._remove(true, this._root, ${keyArgs});
      }

      quickRemoveRecord(record) {
        this._root = this._remove(
            true, this._root, ${keys.map(key => `record.${key}`).join(', ')});
      }
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
  public static fromSchema(schema: Schema, keys: string[]) {
    const fields: FieldDefinition[] = [];
    for (const name in schema) {
      if (schema.hasOwnProperty(name)) {
        fields.push(new FieldDefinition(name, schema[name]));
      }
    }
    return compileAVL(fields, keys);
  }
};


}  // namespace Collections
}  // namespace Darblast


const compileAVL = Darblast.Collections.compileAVL;
const AVL = Darblast.Collections.AVL;
