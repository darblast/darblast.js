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
  const names: {[name: string]: boolean} = Object.create(null);
  for (const field of fields) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.name)) {
      throw new Error(`invalid field name ${JSON.stringify(field.name)}`);
    }
    if (field.name in names) {
      throw new Error(`duplicate name ${JSON.stringify(field.name)}`);
    } else {
      names[field.name] = true;
    }
  }
  if (!indices.length) {
    throw new Error('at least one index must be defined');
  }
  const reference = indices[0].keys.slice().sort();
  for (const key of reference) {
    if (!(key in names)) {
      throw new Error(`unknown field ${key}`);
    }
  }
  for (let i = 1; i < indices.length; i++) {
    const sorted = indices[i].keys.slice().sort();
    if (sorted.length !== reference.length) {
      throw new Error(`index ${JSON.stringify(indices[0].keys)} has different keys than ${JSON.stringify(indices[i].keys)}`);
    }
    if (sorted.some((key, j) => key !== reference[j])) {
      throw new Error(`index ${JSON.stringify(indices[0].keys)} has different keys than ${JSON.stringify(indices[i].keys)}`);
    }
  }
}


/**
 * Compiles a JavaScript class to construct fast AVL trees.
 *
 * The compiled classes returned by this function use typed arrays under the
 * hood, and are highly optimized for speed, memory locality, and low heap
 * footprint. The compiled output depends on the specified fields (the schema is
 * used to infer the layout of the elements in the internal typed array buffer).
 *
 * The tradeoff is that this data structure is limited to numeric fields, so if
 * you need to store strings, dynamic arrays, function closures, or other
 * complex data types, you'll have to use another data structure. If you still
 * need an _ordered_ associative container you may want to take a look at
 * {@link OrderedMap}.
 *
 * The provided data structure is a multi-key and multi-index self-balancing
 * tree. Insertions, deletions, and lookups are all performed in O(log2(N))
 * time, with N = number of elements currently in the tree.
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

  const getRecordField = (name: string) => {
    if (name in fieldMap) {
      return `this.$views.${fieldMap[name].type}[this.$node * ${
          definition.byteSize >>> fieldMap[name].logSize} + ${
          definition.getFieldIndex(name)}]`;
    } else {
      throw new Error(
          `internal error: field ${JSON.stringify(name)} is not defined`);
    }
  };

  const getNodeField = (node: string, name: string) => {
    if (name in fieldMap) {
      return `this._views.${fieldMap[name].type}[${node} * ${
          definition.byteSize >>> fieldMap[name].logSize} + ${
          definition.getFieldIndex(name)}]`;
    } else {
      throw new Error(
          `internal error: field ${JSON.stringify(name)} is not defined`);
    }
  };

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

      static Record = class Record {
        constructor(views, node) {
          this.$views = views;
          this.$node = node;
        }

        ${fields.map(({name}) => `
          get ${name}() {
            return ${getRecordField(name)};
          }

          ${(indices[0].keys.indexOf(name) < 0) ? `
            set ${name}(value) {
              ${getRecordField(name)} = value;
            }
          ` : ''}
        `).join('')}
      };

      ${indices.map((_, index) => `_root${index} = 0;`).join('')}

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

      get length() {
        return this._size;
      }

      isEmpty() {
        return !this._size;
      }

      get capacity() {
        return this._capacity - 1;
      }

      ${indices.map((_, index) => `
        _checkConsistency${index}(node) {
          if (node) {
            const left = ${getField(`$left${index}`)};
            if (left) {
              if (${getNodeField('left', `$parent${index}`)} !== node) {
                throw new Error(
                    'tree #${index} with ' + this._size +
                    ' elements has incorrect left link');
              }
            }
            const right = ${getField(`$right${index}`)};
            if (right) {
              if (${getNodeField('right', `$parent${index}`)} !== node) {
                throw new Error(
                    'tree #${index} with ' + this._size +
                    ' elements has incorrect right link');
              }
            }
            const leftResult = this._checkConsistency${index}(left);
            const rightResult = this._checkConsistency${index}(right);
            const balance = ${getField(`$balance${index}`)};
            const expectedBalance = rightResult.height - leftResult.height;
            if (balance !== expectedBalance) {
              throw new Error(
                  'tree #${index} with ' + this._size +
                  ' elements has wrong balance factor (' + balance +
                  ' instead of ' + expectedBalance + ')');
            }
            if (balance < -1 || balance > 1) {
              throw new Error(
                  'tree #${index} ' + this._size + ' elements is unbalanced');
            }
            return {
              size: 1 + leftResult.size + rightResult.size,
              height: 1 + Math.max(leftResult.height, rightResult.height),
            };
          } else {
            return {
              size: 0,
              height: 0,
            };
          }
        }
      `).join('')}

      _checkConsistency() {
        if (this._root0) {
          if (this._size < 1) {
            throw new Error('wrong size: ' + this._size + ' (should be > 0)');
          }
          ${indices.map((_, index) => `
            if (!this._root${index}) {
              throw new Error('tree #0 has a root but tree #${index} is empty');
            }
            if (${getNodeField(`this._root${index}`, `$parent${index}`)}) {
              throw new Error(
                  'tree #${index} with ' + this._size +
                  ' elements has dangling parent link');
            }
            const results${index} = this._checkConsistency${index}(
                this._root${index});
            if (results${index}.size !== this._size) {
              throw new Error(
                  'wrong size: ' + this._size + ' instead of ' +
                  results${index}.size);
            }
          `).join('')}
        } else {
          if (this._size > 0) {
            throw new Error('wrong size: ' + this._size + ' (should be 0)');
          }
          ${indices.map((_, index) => `
            if (this._root${index}) {
              throw new Error('tree #${index} has a root but tree #0 is empty');
            }
          `).join('')}
        }
      }

      _record = new AVL.Record(this._views, 0);

      ${indices.map((_, index) => {
        const keys = indices[index].keys;
        const keyArgs = keys.join(', ');
        return `
          *_fullScan${index}(node) {
            if (node) {
              yield* this._fullScan${index}(${getField(`$left${index}`)});
              yield node;
              yield* this._fullScan${index}(${getField(`$right${index}`)});
            }
          }

          *fullScan${index}_() {
            for (let node of this._fullScan${index}(this._root${index})) {
              this._record.$node = node;
              yield this._record;
            }
          }

          *fullScan${index}() {
            for (let node of this._fullScan${index}(this._root${index})) {
              yield new AVL.Record(this._views, node);
            }
          }

          *_reverseFullScan${index}(node) {
            if (node) {
              yield* this._reverseFullScan${index}(
                  ${getField(`$right${index}`)});
              yield node;
              yield* this._reverseFullScan${index}(
                  ${getField(`$left${index}`)});
            }
          }

          *reverseFullScan${index}_() {
            for (let node of this._reverseFullScan${index}(
                this._root${index}))
            {
              this._record.$node = node;
              yield this._record;
            }
          }

          *reverseFullScan${index}() {
            for (let node of this._reverseFullScan${index}(
                this._root${index}))
            {
              yield new AVL.Record(this._views, node);
            }
          }

          _comparePartial${index}(keys) {
            ${keys.map((key, i) => `
              if (keys.length > ${i}) {
                const value = ${getField(key)};
                if (keys[${i}] !== value) {
                  return keys[${i}] - value;
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
              yield* this._scan${index}(${getField(`$left${index}`)}, keys);
            } else if (cmp > 0) {
              yield* this._scan${index}(${getField(`$right${index}`)}, keys);
            } else {
              yield* this._scan${index}(${getField(`$left${index}`)}, keys);
              yield node;
              yield* this._scan${index}(${getField(`$right${index}`)}, keys);
            }
          }

          *scan${index}_(...keys) {
            for (const node of this._scan${index}(this._root${index}, keys)) {
              this._record.$node = node;
              if (yield this._record) {
                return false;
              }
            }
            return true;
          }

          *scan${index}(...keys) {
            for (const node of this._scan${index}(this._root${index}, keys)) {
              if (yield new AVL.Record(this._views, node)) {
                return false;
              }
            }
            return true;
          }

          *_reverseScan${index}(node, keys) {
            if (!node) {
              return;
            }
            const cmp = this._comparePartial${index}(node, keys);
            if (cmp < 0) {
              yield* this._reverseScan${index}(
                  ${getField(`$left${index}`)}, keys);
            } else if (cmp > 0) {
              yield* this._reverseScan${index}(
                  ${getField(`$right${index}`)}, keys);
            } else {
              yield* this._reverseScan${index}(
                  ${getField(`$right${index}`)}, keys);
              yield node;
              yield* this._reverseScan${index}(
                  ${getField(`$left${index}`)}, keys);
            }
          }

          *reverseScan${index}_(...keys) {
            for (const node of this._reverseScan${index}(
                this._root${index}, keys))
            {
              this._record.$node = node;
              if (yield this._record) {
                return false;
              }
            }
            return true;
          }

          *reverseScan${index}(...keys) {
            for (const node of this._reverseScan${index}(
                this._root${index}, keys))
            {
              if (yield new AVL.Record(this._views, node)) {
                return false;
              }
            }
            return true;
          }

          *_lowerBound${index}(node, keys) {
            if (!node) {
              return;
            }
            if (this._comparePartial${index}(node, keys) >= 0) {
              yield* this._scan${index}(${getField(`$left${index}`)}, keys);
              yield node;
              yield* this._scan${index}(${getField(`$right${index}`)}, keys);
            }
          }

          *lowerBound${index}_(...keys) {
            for (const node of this._lowerBound${index}(
                this._root${index}, keys))
            {
              this._record.$node = node;
              if (yield this._record) {
                return false;
              }
            }
            return true;
          }

          *lowerBound${index}(...keys) {
            for (const node of this._lowerBound${index}(
                this._root${index}, keys))
            {
              if (yield new AVL.Record(this._views, node)) {
                return false;
              }
            }
            return true;
          }

          *_upperBound${index}(node, keys) {
            if (!node) {
              return;
            }
            if (this._comparePartial${index}(node, keys) < 0) {
              yield* this._scan${index}(${getField(`$left${index}`)}, keys);
              yield node;
              yield* this._scan${index}(${getField(`$right${index}`)}, keys);
            }
          }

          *upperBound${index}_(...keys) {
            for (const node of this._upperBound${index}(
                this._root${index}, keys))
            {
              this._record.$node = node;
              if (yield this._record) {
                return false;
              }
            }
            return true;
          }

          *upperBound${index}(...keys) {
            for (const node of this._upperBound${index}(
                this._root${index}, keys))
            {
              if (yield new AVL.Record(this._views, node)) {
                return false;
              }
            }
            return true;
          }

          *_range${index}(node, lowerBound, upperBound) {
            if (!node) {
              return;
            }
            if (this._comparePartial${index}(node, lowerBound) >= 0 &&
                this._comparePartial${index}(node, upperBound) < 0)
            {
              yield* this._range${index}(
                  ${getField(`$left${index}`)}, lowerBound, upperBound);
              yield node;
              yield* this._range${index}(
                  ${getField(`$right${index}`)}, lowerBound, upperBound);
            }
          }

          *range${index}_(lowerBound, upperBound) {
            for (const node of this._range${index}(
                this._root${index}, lowerBound, upperBound))
            {
              this._record.$node = node;
              if (yield this._record) {
                return false;
              }
            }
            return true;
          }

          *range${index}(lowerBound, upperBound) {
            for (const node of this._range${index}(
                this._root${index}, lowerBound, upperBound))
            {
              if (yield new AVL.Record(this._views, node)) {
                return false;
              }
            }
            return true;
          }

          _compare${index}($node, ${keyArgs}) {
            ${keys.map(key => `
              {
                const $value = ${getNodeField('$node', key)};
                if (${key} !== $value) {
                  return ${key} - $value;
                }
              }
            `).join('')}
            return 0;
          }

          _lookup${index}(${keyArgs}) {
            let $node = this._root${index};
            while ($node) {
              const $cmp = this._compare${index}($node, ${keyArgs});
              if ($cmp < 0) {
                $node = ${getNodeField('$node', `$left${index}`)};
              } else if ($cmp > 0) {
                $node = ${getNodeField('$node', `$right${index}`)};
              } else {
                return $node;
              }
            }
            return 0;
          }

          lookup${index}_(${keyArgs}) {
            const $node = this._lookup${index}(${keyArgs});
            if ($node) {
              this._record.$node = $node;
              return this._record;
            } else {
              return null;
            }
          }

          lookup${index}(${keyArgs}) {
            const $node = this._lookup${index}(${keyArgs});
            if ($node) {
              return new AVL.Record(this._views, $node);
            } else {
              return null;
            }
          }

          ${fields.map(field => `
            lookup${index}_${field.name}(${keyArgs}) {
              const $node = this._lookup${index}(${keyArgs});
              if ($node) {
                return ${getNodeField('$node', field.name)};
              } else {
                return null;
              }
            }
          `).join('')}

          contains${index}(${keyArgs}) {
            return !!this._lookup${index}(${keyArgs});
          }
        `;
      }).join('')}

      fullScan_() {
        return this.fullScan0_();
      }

      fullScan() {
        return this.fullScan0();
      }

      reverseFullScan_() {
        return this.reverseFullScan0_();
      }

      reverseFullScan() {
        return this.reverseFullScan0();
      }

      scan_(...keys) {
        return this.scan0_(...keys);
      }

      scan(...keys) {
        return this.scan0(...keys);
      }

      reverseScan_(...keys) {
        return this.reverseScan0_(...keys);
      }

      reverseScan(...keys) {
        return this.reverseScan0(...keys);
      }

      [Symbol.iterator]() {
        return this.fullScan();
      }

      _reverse = {
        [Symbol.iterator]: () => {
          return this.reverseFullScan();
        },
      };

      get reverse() {
        return this._reverse;
      }

      lowerBound_(...keys) {
        return this.lowerBound0_(...keys);
      }

      lowerBound(...keys) {
        return this.lowerBound0(...keys);
      }

      upperBound_(...keys) {
        return this.upperBound0_(...keys);
      }

      upperBound(...keys) {
        return this.upperBound0(...keys);
      }

      range_(lowerBound, upperBound) {
        return this.range0_(lowerBound, upperBound);
      }

      range(lowerBound, upperBound) {
        return this.range0(lowerBound, upperBound);
      }

      ${(keyArgs => `
        lookup_(${keyArgs}) {
          const $node = this._lookup0(${keyArgs});
          if ($node) {
            this._record.$node = $node;
            return this._record;
          } else {
            return null;
          }
        }

        lookup(${keyArgs}) {
          const $node = this._lookup0(${keyArgs});
          if ($node) {
            return new AVL.Record(this._views, $node);
          } else {
            return null;
          }
        }

        ${fields.map(field => `
          lookup_${field.name}(${keyArgs}) {
            const $node = this._lookup0(${keyArgs});
            if ($node) {
              return ${getNodeField('$node', field.name)};
            } else {
              return null;
            }
          }
        `).join('')}

        contains(${keyArgs}) {
          return !!this._lookup0(${keyArgs});
        }
      `)(indices[0].keys.join(', '))}

      _push(record) {
        const node = ++this._size;
        if (this._size >= this._capacity) {
          this._realloc(this._capacity * 2);
        }
        ${indices.map((_, index) => `
          ${setField(`$parent${index}`, '0')}
          ${setField(`$left${index}`, '0')}
          ${setField(`$right${index}`, '0')}
          ${setField(`$balance${index}`, '0')}
        `).join('')}
        ${fields.map(field => setField(
            field.name, `record.${field.name}`)).join('\n')}
        return node;
      }

      ${indices.map((_, index) => `
        _rotateLeft${index}(parent, node) {
          const child = ${getNodeField('node', `$left${index}`)};
          ${setNodeField('parent', `$right${index}`, 'child')}
          if (child) {
            ${setNodeField('child', `$parent${index}`, 'parent')}
          }
          ${setNodeField('node', `$left${index}`, 'parent')}
          const root = ${getNodeField('parent', `$parent${index}`)};
          ${setNodeField('parent', `$parent${index}`, 'node')}
          ${setNodeField('node', `$parent${index}`, 'root')}
          if (${getNodeField('node', `$balance${index}`)}) {
            ${setNodeField('parent', `$balance${index}`, '0')}
            ${setNodeField('node', `$balance${index}`, '0')}
          } else {
            ${setNodeField('parent', `$balance${index}`, '1')}
            ${setNodeField('node', `$balance${index}`, '-1')}
          }
          return node;
        }

        _rotateRight${index}(parent, node) {
          const child = ${getNodeField('node', `$right${index}`)};
          ${setNodeField('parent', `$left${index}`, 'child')}
          if (child) {
            ${setNodeField('child', `$parent${index}`, 'parent')}
          }
          ${setNodeField('node', `$right${index}`, 'parent')}
          const root = ${getNodeField('parent', `$parent${index}`)};
          ${setNodeField('parent', `$parent${index}`, 'node')}
          ${setNodeField('node', `$parent${index}`, 'root')}
          if (${getNodeField('node', `$balance${index}`)}) {
            ${setNodeField('parent', `$balance${index}`, '0')}
            ${setNodeField('node', `$balance${index}`, '0')}
          } else {
            ${setNodeField('parent', `$balance${index}`, '-1')}
            ${setNodeField('node', `$balance${index}`, '1')}
          }
          return node;
        }

        _rotateRightLeft${index}(parent, node) {
          const child = ${getNodeField('node', `$left${index}`)};
          let inner = ${getNodeField('child', `$right${index}`)};
          ${setNodeField('node', `$left${index}`, 'inner')}
          if (inner) {
            ${setNodeField('inner', `$parent${index}`, 'node')}
          }
          ${setNodeField('child', `$right${index}`, 'node')}
          ${setNodeField('node', `$parent${index}`, 'child')}
          inner = ${getNodeField('child', `$left${index}`)};
          ${setNodeField('parent', `$right${index}`, 'inner')}
          if (inner) {
            ${setNodeField('inner', `$parent${index}`, 'parent')}
          }
          ${setNodeField('child', `$left${index}`, 'parent')}
          const root = ${getNodeField('parent', `$parent${index}`)};
          ${setNodeField('parent', `$parent${index}`, 'child')}
          ${setNodeField('child', `$parent${index}`, 'root')}
          const balance = ${getNodeField('child', `$balance${index}`)};
          if (balance > 0) {
            ${setNodeField('parent', `$balance${index}`, '-1')}
            ${setNodeField('node', `$balance${index}`, '0')}
          } else if (balance < 0) {
            ${setNodeField('parent', `$balance${index}`, '0')}
            ${setNodeField('node', `$balance${index}`, '1')}
          } else {
            ${setNodeField('parent', `$balance${index}`, '0')}
            ${setNodeField('node', `$balance${index}`, '0')}
          }
          ${setNodeField('child', `$balance${index}`, '0')}
          return child;
        }

        _rotateLeftRight${index}(parent, node) {
          const child = ${getNodeField('node', `$right${index}`)};
          let inner = ${getNodeField('child', `$left${index}`)};
          ${setNodeField('node', `$right${index}`, 'inner')}
          if (inner) {
            ${setNodeField('inner', `$parent${index}`, 'node')}
          }
          ${setNodeField('child', `$left${index}`, 'node')}
          ${setNodeField('node', `$parent${index}`, 'child')}
          inner = ${getNodeField('child', `$right${index}`)};
          ${setNodeField('parent', `$left${index}`, 'inner')}
          if (inner) {
            ${setNodeField('inner', `$parent${index}`, 'parent')}
          }
          ${setNodeField('child', `$right${index}`, 'parent')}
          const root = ${getNodeField('parent', `$parent${index}`)};
          ${setNodeField('parent', `$parent${index}`, 'child')}
          ${setNodeField('child', `$parent${index}`, 'root')}
          const balance = ${getNodeField('child', `$balance${index}`)};
          if (balance > 0) {
            ${setNodeField('parent', `$balance${index}`, '1')}
            ${setNodeField('node', `$balance${index}`, '0')}
          } else if (balance < 0) {
            ${setNodeField('parent', `$balance${index}`, '0')}
            ${setNodeField('node', `$balance${index}`, '-1')}
          } else {
            ${setNodeField('parent', `$balance${index}`, '0')}
            ${setNodeField('node', `$balance${index}`, '0')}
          }
          ${setNodeField('child', `$balance${index}`, '0')}
          return child;
        }
      `).join('')}

      _insertContext = {
        keys: [],
        record: null,
        node: 0,
        inserted: false,
        balanced: true,
      };

      ${indices.map((_, index) => `
        _insert${index}(parent, node) {
          if (node) {
            const cmp = this._compare${index}(
                node, ...this._insertContext.keys);
            if (cmp < 0) {
              const child = this._insert${index}(
                  node, ${getField(`$left${index}`)});
              ${setNodeField('node', `$left${index}`, 'child')}
              if (!this._insertContext.balanced) {
                if (${getNodeField('node', `$balance${index}`)} < 0) {
                  if (${getNodeField('child', `$balance${index}`)} > 0) {
                    node = this._rotateLeftRight${index}(node, child);
                  } else {
                    node = this._rotateRight${index}(node, child);
                  }
                  this._insertContext.balanced = true;
                } else if (${getNodeField('node', `$balance${index}`)} > 0) {
                  ${setNodeField('node', `$balance${index}`, '0')}
                  this._insertContext.balanced = true;
                } else {
                  ${setNodeField('node', `$balance${index}`, '-1')}
                }
              }
              return node;
            } else if (cmp > 0) {
              const child = this._insert${index}(
                  node, ${getField(`$right${index}`)});
              ${setNodeField('node', `$right${index}`, 'child')}
              if (!this._insertContext.balanced) {
                if (${getNodeField('node', `$balance${index}`)} > 0) {
                  if (${getNodeField('child', `$balance${index}`)} < 0) {
                    node = this._rotateRightLeft${index}(node, child);
                  } else {
                    node = this._rotateLeft${index}(node, child);
                  }
                  this._insertContext.balanced = true;
                } else if (${getNodeField('node', `$balance${index}`)} < 0) {
                  ${setNodeField('node', `$balance${index}`, '0')}
                  this._insertContext.balanced = true;
                } else {
                  ${setNodeField('node', `$balance${index}`, '1')}
                }
              }
              return node;
            } else {
              ${index > 0 ? `
                throw new Error('internal error');
              ` : `
                ${fields.map(field => setField(
                    field.name, `this._insertContext.record.${
                        field.name}`)).join('\n')}
                this._insertContext.inserted = false;
                this._insertContext.balanced = true;
                return this._insertContext.node = node;
              `}
            }
          } else {
            ${index > 0 ? `
              this._insertContext.balanced = false;
              node = this._insertContext.node;
              ${setNodeField('node', `$parent${index}`, 'parent')}
              return node;
            ` : `
              this._insertContext.inserted = true;
              this._insertContext.balanced = false;
              node = this._push(this._insertContext.record);
              ${setNodeField('node', `$parent${index}`, 'parent')}
              return this._insertContext.node = node;
            `}
          }
        }
      `).join('')}

      ${indices.map((_, index) => `
        _getKeys${index}_() {
          this._insertContext.keys.length = ${indices[index].keys.length};
          ${indices[index].keys.map((key, i) => `
            this._insertContext.keys[${i}] = this._insertContext.record.${
                key};`).join('\n')}
          return this._insertContext.keys;
        }
      `).join('')}

      insertOrUpdate(record) {
        this._insertContext.record = record;
        this._getKeys0_();
        this._root0 = this._insert0(0, this._root0);
        if (this._insertContext.inserted) {
          ${indices.map((_, index) => index > 0 ? `
            this._getKeys${index}_();
            this._root${index} = this._insert${index}(0, this._root${index});
          ` : '').join('')}
        }
        return this._insertContext.inserted;
      }

      insertOrUpdateAll(...records) {
        let result = true;
        for (const record of records) {
          result = result && this.insertOrUpdate(record);
        }
        return result;
      }

      ${fields.map(field => `
        ${indices.map((_, index) => {
          const keyArgs = indices[index].keys.join(', ');
          return `
            update${index}_${field.name}($value, ${keyArgs}) {
              const $node = this._lookup${index}(${keyArgs});
              if ($node) {
                ${setNodeField('$node', field.name, '$value')}
                return true;
              } else {
                return false;
              }
            }
          `;
        }).join('')}

        ${(keyArgs => `
          update_${field.name}($value, ${keyArgs}) {
            const $node = this._lookup0(${keyArgs});
            if ($node) {
              ${setNodeField('$node', field.name, '$value')}
              return true;
            } else {
              return false;
            }
          }
        `)(indices[0].keys.join(', '))}
      `).join('')}
    }
  `;
});


export interface AVLConstructor {
  new(): AVL;
};


/**
 * Provides methods to compile AVL trees.
 *
 * The provided methods are just convenience wrappers for
 * {@link Darblast.Collections.compileAVL}.
 */
export abstract class AVL {
  /**
   * Alias for {@link Darblast.Collections.compileAVL}.
   */
  public static readonly compile = compileAVL;

  /**
   * Convenience function to compile an AVL tree class from a {@link Schema}.
   *
   * Note that this function returns the compiled AVL class. If you want to get
   * an AVL object directly you need to use {@link fromSchema}.
   *
   * @param schema  A {@link Schema} describing the fields of the
   *                {@link Record}s to store in the tree.
   * @param keys  List of fields to use as keys. This has the same meaning as in
   *              the {@link compileAVL} function.
   */
  public static compileFromSchema(
      schema: Schema, indices: string[][]): AVLConstructor
  {
    const fields: FieldDefinition[] = [];
    for (const name in schema) {
      if (schema.hasOwnProperty(name)) {
        fields.push(new FieldDefinition(name, schema[name]));
      }
    }
    return compileAVL(
        fields, indices.map(keys => new Index(keys))) as AVLConstructor;
  }

  /**
   * Convenience function to construct an AVL tree from a {@link Schema}.
   *
   * Notice that the difference between this method and
   * {@link compileFromSchema} is that the latter returns the compiled AVL
   * class, while this function returns an instantiated AVL object.
   *
   * @param schema  A {@link Schema} describing the fields of the
   *                {@link Record}s to store in the tree.
   * @param keys  List of fields to use as keys. This has the same meaning as in
   *              the {@link compileAVL} function.
   */
  public static fromSchema(schema: Schema, indices: string[][]) {
    const AVLClass = AVL.compileFromSchema(schema, indices);
    return new AVLClass() as AVL;
  }

  /**
   * @returns the number of elements in the tree.
   */
  public abstract get size(): number;

  /**
   * Synonymous with {@link size}.
   *
   * @returns the number of elements in the tree.
   */
  public abstract get length(): number;

  /**
   * @returns a boolean indicating whether the tree is empty.
   */
  public abstract isEmpty(): boolean;

  /**
   * @returns the capacity of the underlying buffer, which may be higher than
   *    {@link size}.
   */
  public abstract get capacity(): number;

  /**
   * Performs a full scan of the tree yielding the elements in the order defined
   * by the first index.
   */
  public abstract fullScan0(): Generator<Record, void>;

  /**
   * Like {@link fullScan0} but it recycles the yielded object.
   */
  public abstract fullScan0_(): Generator<Record, void>;

  /**
   * Synonymous with {@link fullScan0}.
   */
  public abstract fullScan(): Generator<Record, void>;

  /**
   * Synonymous with {@link fullScan0_}.
   */
  public abstract fullScan_(): Generator<Record, void>;

  /**
   * Scans the elements in the tree satisfying the constraint that the first _k_
   * keys are equal to the _k_ ones specified. The scanned elements are yielded
   * in the order defined by the first index.
   *
   * Note that _k_ may be less than the number of keys in the index, and it may
   * also be 0:
   *
   * * when _k_ == 0 the full tree is scanned and this method is equivalent to
   *   {@link fullScan0};
   * * when _k_ == the number of keys in the index and the tree is empty, no
   *   elements are yielded;
   * * when _k_ == the number of keys in the index and the tree is not empty,
   *   exactly one element is yielded and this method is equivalent to
   *   {@link lookup0};
   * * when 0 < _k_ < number of keys in the index, more than one element may be
   *   yielded.
   */
  public abstract scan0(...keys: number[]): Generator<Record, void>;

  /**
   * Like {@link scan0} but it recycles the yielded object.
   */
  public abstract scan0_(...keys: number[]): Generator<Record, void>;

  /**
   * Synonymous with {@link scan0}.
   */
  public abstract scan(...keys: number[]): Generator<Record, void>;

  /**
   * Synonymous with {@link scan0_}.
   */
  public abstract scan_(...keys: number[]): Generator<Record, void>;

  /**
   * Makes the AVL tree iterable. The implementation is backed by
   * {@link fullScan}.
   */
  public abstract [Symbol.iterator](): Generator<Record, void>;

  /**
   * Scans the elements in the tree satisfying the constraint that the first _k_
   * keys are greater than or equal to the _k_ ones specified, based on the
   * order defined by the first index. The scanned elements are yielded in the
   * order defined by the first index.
   *
   * Note that _k_ may be less than the number of keys in the index, and it may
   * also be 0. When _k_ == 0 the full tree is scanned and this method is
   * equivalent to {@link fullScan0}.
   */
  public abstract lowerBound0(...keys: number[]): Generator<Record, void>;

  /**
   * Like {@link lowerBound0} but it recycles the yielded object.
   */
  public abstract lowerBound0_(...keys: number[]): Generator<Record, void>;

  /**
   * Synonymous with {@link lowerBound0}.
   */
  public abstract lowerBound(...keys: number[]): Generator<Record, void>;

  /**
  * Synonymous with {@link lowerBound0_}.
   */
  public abstract lowerBound_(...keys: number[]): Generator<Record, void>;

  /**
  * Scans the elements in the tree satisfying the constraint that the first _k_
  * keys are strictly less than the _k_ ones specified, based on the order
  * defined by the first index. The scanned elements are yielded in the order
  * defined by the first index.
  *
  * Note that _k_ may be less than the number of keys in the index, and it may
  * also be 0. When _k_ == 0 the full tree is scanned and this method is
  * equivalent to {@link fullScan0}.
   */
  public abstract upperBound0(...keys: number[]): Generator<Record, void>;

  /**
   * Like {@link upperBound0} but it recycles the yielded object.
   */
  public abstract upperBound0_(...keys: number[]): Generator<Record, void>;

  /**
   * Synonymous with {@link upperBound0}.
   */
  public abstract upperBound(...keys: number[]): Generator<Record, void>;

  /**
   * Synonymous with {@link upperBound0_}.
   */
  public abstract upperBound_(...keys: number[]): Generator<Record, void>;

  /**
   *
   */
  public abstract range0(
      lowerBound: number[], upperBound: number[]): Generator<Record, void>;

  /**
   *
   */
  public abstract range0_(
      lowerBound: number[], upperBound: number[]): Generator<Record, void>;

  /**
   *
   */
  public abstract range(
      lowerBound: number[], upperBound: number[]): Generator<Record, void>;

  /**
   *
   */
  public abstract range_(
      lowerBound: number[], upperBound: number[]): Generator<Record, void>;

  /**
   * Looks up the element identified by the provided keys based on the first
   * index.
   *
   * @returns the requested element, or `null` if not found.
   */
  public abstract lookup0(...keys: number[]): Record | null;

  /**
   * Like {@link lookup0} but it recycles the returned object.
   */
  public abstract lookup0_(...keys: number[]): Record | null;

  /**
   * Synonymous with {@link lookup0}.
   */
  public abstract lookup(...keys: number[]): Record | null;

  /**
   * Synonymous with {@link lookup0_}.
   */
  public abstract lookup_(...keys: number[]): Record | null;

  /**
   * @returns a boolean indicating whether the tree contains an elements
   *    identified by the provided keys (based on the first index).
   */
  public abstract contains0(...keys: number[]): boolean;

  /**
   * Synonymous with {@link contains0}.
   */
  public abstract contains(...keys: number[]): boolean;

  /**
   * Inserts the provided record into the tree. If a record with the same keys
   * is already in the tree, it will be updated with the values from the
   * provided one.
   *
   * @returns `true` if a new record was inserted, `false` if one existed and
   *    was updated.
   */
  public abstract insertOrUpdate(record: Record): boolean;

  /**
   * Inserts or updates all the provided records.
   *
   * The implementation simply calls {@link insertOrUpdate} multiple times.
   */
  public abstract insertOrUpdateAll(...records: Record[]): boolean;
};


}  // namespace Collections
}  // namespace Darblast


/**
 * @hidden
 */
const compileAVL = Darblast.Collections.compileAVL;

/**
 * @hidden
 */
type AVL = Darblast.Collections.AVL;

/**
 * @hidden
 */
const AVL = Darblast.Collections.AVL;
