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
      throw new Error('indices must have at least one key');
    }
    index.keys.forEach(key => {
      if (!(key in names)) {
        throw new Error(`unknown field ${JSON.stringify(key)}`);
      }
    });
  }
}


export const AVL = TemplateClass(
    (fields: FieldDefinition[], indices: Index[]) =>
{
  validateSchema(fields, indices);

  const allFields: FieldDefinition[] = [];
  indices.forEach((_, index) => {
    allFields.push(new FieldDefinition('$parent', 'uint32'));
    allFields.push(new FieldDefinition('$left', 'uint32'));
    allFields.push(new FieldDefinition('$right', 'uint32'));
    allFields.push(new FieldDefinition('$balance', 'int8'));
  });
  allFields.push.apply(allFields, fields);

  const definition = new RecordDefinition(allFields);

  const fieldMap: {[name: string]: FieldDefinition} = Object.create(null);
  for (const field of allFields) {
    fieldMap[field.name] = field;
  }

  const getField = (name: string) => `this._views${fieldMap[name].type}[
      node * ${definition.byteSize >>> fieldMap[name].logSize} +
      ${definition.getFieldIndex(name)}]`;

  return `
    class AVL {
      static Index = Darblast.Collections.Index;

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

      _roots = ${JSON.stringify(Array.from(indices, _ => 0))};

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

      _fillRecord(node, output) {
        ${fields.map(field => `
          output.${field} = ${getField(field.name)};
        `).join('')}
        return output;
      }

      _record = Object.create(null);

      ${indices.map((_, index) => {
        let code = '';
        indices[index].keys.forEach(key => {
          code += `if (${key} < ${getField(key)}) { return -1; } else `;
          code += `if (${key} < ${getField(key)}) { return -1; } else `;
        });
        return `
          _compare${index}(node, ${indices[index].keys.join(', ')}) {
            ${code} { return 0; }
          }
        `;
      }).join('\n')}

      ${indices.map((_, index) => {
        const keys = indices[index].keys.join(', ');
        return `
          _lookup${index}(node, ${keys}) {
            if (!node) {
              return 0;
            }
            const cmp = this._compare${index}(node, ${keys});
            if (cmp < 0) {
              return this._lookup${index}(${getField('$left')}, ${keys});
            } else if (cmp > 0) {
              return this._lookup${index}(${getField('$right')}, ${keys});
            } else {
              return node;
            }
          }

          lookup${index}_(node, ${keys}) {
            const node = this._lookup${index}(this._roots[${index}], ${keys});
            if (node > 0) {
              return this._fillRecord(node, this._record);
            } else {
              throw new Error(
                  \`element with key ${JSON.stringify([keys])} not found\`);
            }
          }

          lookup${index}(node, ${keys}) {
            const node = this._lookup${index}(this._roots[${index}], ${keys});
            if (node > 0) {
              return this._fillRecord(node, Object.create(null));
            } else {
              throw new Error(
                  \`element with key ${JSON.stringify([keys])} not found\`);
            }
          }
        `;
      }).join('\n')}

      lookup_ = this.lookup0_;
      lookup = this.lookup0;

      ${indices.map((_, index) => {
        const keys = indices[index].keys.join(', ');
        return `
          *_scan${index}(node, ${keys}) {
            if (!node) {
              return 0;
            }
            const cmp = this._compare${index}(node, ${keys});
            if (cmp < 0) {
              yield* this._scan${index}(${getField('$left')}, ${keys});
            } else if (cmp > 0) {
              yield* this._scan${index}(${getField('$right')}, ${keys});
            } else {
              yield* this._scan${index}(${getField('$left')}, ${keys});
              yield node;
              yield* this._scan${index}(${getField('$right')}, ${keys});
            }
          }

          scan${index}_(${keys}) {
            for (const node of this._scan${index}(
                this._roots[${index}], ${keys}))
            {
              if (yield this._fillRecord(node, this._record)) {
                return false;
              }
            }
            return true;
          }

          scan${index}(${keys}) {
            for (const node of this._scan${index}(
                this._roots[${index}], ${keys}))
            {
              if (yield this._fillRecord(node, Object.create(null))) {
                return false;
              }
            }
            return true;
          }
        `;
      }).join('\n')}

      scan_ = this.scan0_;
      scan = this.scan0;
    }
  `;
});


}  // namespace Collections
}  // namespace Darblast


const AVL = Darblast.Collections.AVL;
