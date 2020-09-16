"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportInterface = exportInterface;
exports.exportType = exportType;
exports.formatType = formatType;
exports.HEADER = void 0;

var _handlebars = _interopRequireDefault(require("handlebars"));

var _types = require("@polkadot/types/create/types");

var _create = require("@polkadot/types/create");

var _utils = require("@polkadot/types/codec/utils");

var _imports = require("./imports");

var _file = require("./file");

// Copyright 2017-2020 @polkadot/typegen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const TYPES_NON_PRIMITIVE = ['Metadata'];

const HEADER = type => `// Auto-generated via \`yarn polkadot-types-from-${type}\`, do not edit\n/* eslint-disable */\n\n`;

exports.HEADER = HEADER;

_handlebars.default.registerPartial({
  footer: _handlebars.default.compile((0, _file.readTemplate)('footer')),
  header: _handlebars.default.compile((0, _file.readTemplate)('header'))
});

_handlebars.default.registerHelper({
  imports() {
    const {
      imports,
      types
    } = this;
    const defs = [{
      file: '@polkadot/types/types',
      types: Object.keys(imports.typesTypes)
    }, {
      file: '@polkadot/types/codec',
      types: Object.keys(imports.codecTypes).filter(name => name !== 'Tuple')
    }, {
      file: '@polkadot/types/extrinsic',
      types: Object.keys(imports.extrinsicTypes)
    }, {
      file: '@polkadot/types/generic',
      types: Object.keys(imports.genericTypes)
    }, {
      file: '@polkadot/types/primitive',
      types: Object.keys(imports.primitiveTypes).filter(name => !TYPES_NON_PRIMITIVE.includes(name))
    }, {
      file: '@polkadot/types',
      types: Object.keys(imports.primitiveTypes).filter(name => TYPES_NON_PRIMITIVE.includes(name))
    }, ...types];
    return defs.reduce((result, {
      file,
      types
    }) => {
      return types.length ? `${result}import { ${types.sort().join(', ')} } from '${file}';\n` : result;
    }, '');
  },

  trim(options) {
    return options.fn(this).trim();
  },

  upper(options) {
    return options.fn(this).toUpperCase();
  }

}); // helper to generate a `export interface <Name> extends <Base> {<Body>}

/** @internal */


function exportInterface(name = '', base, body = '') {
  // * @description extends [[${base}]]
  const doc = `/** @name ${name} */\n`;
  return `${doc}export interface ${name} extends ${base} {${body.length ? '\n' : ''}${body}}`;
} // helper to create an `export type <Name> = <Base>`
// but since we don't want type alias (TS doesn't preserve names) we use
// interface here.

/** @internal */


function exportType(name = '', base) {
  return exportInterface(name, base);
}
/**
 * Given the inner `K` & `V`, return a `BTreeMap<K, V>`  string
 */

/** @internal */


function formatBTreeMap(key, val) {
  return `BTreeMap<${key}, ${val}>`;
}
/**
 * Given the inner `V`, return a `BTreeSet<V>`  string
 */

/** @internal */


function formatBTreeSet(val) {
  return `BTreeSet<${val}>`;
}
/**
 * Given the inner `T`, return a `Compact<T>` string
 */

/** @internal */


function formatCompact(inner) {
  return (0, _utils.paramsNotation)('Compact', inner);
}
/**
 * Simple return
 */

/** @internal */


function formatDoNoConstruct() {
  return 'DoNotConstruct';
}
/**
 * Given the inner `K` & `V`, return a `BTreeMap<K, V>`  string
 */

/** @internal */


function formatHashMap(key, val) {
  return `HashMap<${key}, ${val}>`;
}
/**
 * Given the inner `T`, return a `Vec<T>` string
 */

/** @internal */


function formatLinkage(inner) {
  return (0, _utils.paramsNotation)('Linkage', inner);
}
/**
 * Given the inner `O` & `E`, return a `Result<O, E>`  string
 */

/** @internal */


function formatResult(innerOk, innerError) {
  return `Result<${innerOk}, ${innerError}>`;
}
/**
 * Given the inner `T`, return a `Option<T>` string
 */

/** @internal */


function formatOption(inner) {
  return (0, _utils.paramsNotation)('Option', inner);
}
/**
 * Given the inners `T[]`, return a `ITuple<...T>` string
 */

/** @internal */


function formatTuple(inners) {
  return (0, _utils.paramsNotation)('ITuple', `[${inners.join(', ')}]`);
}
/**
 * Given the inner `T`, return a `Vec<T>` string
 */

/** @internal */


function formatVec(inner) {
  return (0, _utils.paramsNotation)('Vec', inner);
}
/**
 * Correctly format a given type
 */

/** @internal */


function formatType(definitions, type, imports) {
  let typeDef;

  if (typeof type === 'string') {
    // If type is "unorthodox" (i.e. `{ something: any }` for an Enum input or `[a | b | c, d | e | f]` for a Tuple's similar types),
    // we return it as-is
    if (/(^{.+:.+})|^\([^,]+\)|^\(.+\)\[\]|^\[.+\]/.exec(type) && !/\[\w+;\w+\]/.exec(type)) {
      return type;
    }

    typeDef = (0, _create.getTypeDef)(type);
  } else {
    typeDef = type;
  }

  (0, _imports.setImports)(definitions, imports, [typeDef.type]); // FIXME Swap to Record<TypeDefInfo, fn> to check all types

  switch (typeDef.info) {
    case _types.TypeDefInfo.Compact:
      {
        (0, _imports.setImports)(definitions, imports, ['Compact']);
        return formatCompact(formatType(definitions, typeDef.sub.type, imports));
      }

    case _types.TypeDefInfo.DoNotConstruct:
      {
        (0, _imports.setImports)(definitions, imports, ['DoNotConstruct']);
        return formatDoNoConstruct();
      }

    case _types.TypeDefInfo.Option:
      {
        (0, _imports.setImports)(definitions, imports, ['Option']);
        return formatOption(formatType(definitions, typeDef.sub.type, imports));
      }

    case _types.TypeDefInfo.Plain:
      {
        return typeDef.type;
      }

    case _types.TypeDefInfo.Vec:
      {
        (0, _imports.setImports)(definitions, imports, ['Vec']);
        return formatVec(formatType(definitions, typeDef.sub.type, imports));
      }

    case _types.TypeDefInfo.Tuple:
      {
        (0, _imports.setImports)(definitions, imports, ['ITuple']); // `(a,b)` gets transformed into `ITuple<[a, b]>`

        return formatTuple(typeDef.sub.map(sub => formatType(definitions, sub.type, imports)));
      }

    case _types.TypeDefInfo.VecFixed:
      {
        const type = typeDef.sub.type;

        if (type === 'u8') {
          (0, _imports.setImports)(definitions, imports, ['U8aFixed']);
          return 'U8aFixed';
        }

        (0, _imports.setImports)(definitions, imports, ['Vec']);
        return formatVec(formatType(definitions, type, imports));
      }

    case _types.TypeDefInfo.BTreeMap:
      {
        (0, _imports.setImports)(definitions, imports, ['BTreeMap']);
        const [keyDef, valDef] = typeDef.sub;
        return formatBTreeMap(formatType(definitions, keyDef.type, imports), formatType(definitions, valDef.type, imports));
      }

    case _types.TypeDefInfo.BTreeSet:
      {
        (0, _imports.setImports)(definitions, imports, ['BTreeSet']);
        const valDef = typeDef.sub;
        return formatBTreeSet(formatType(definitions, valDef.type, imports));
      }

    case _types.TypeDefInfo.HashMap:
      {
        (0, _imports.setImports)(definitions, imports, ['HashMap']);
        const [keyDef, valDef] = typeDef.sub;
        return formatHashMap(formatType(definitions, keyDef.type, imports), formatType(definitions, valDef.type, imports));
      }

    case _types.TypeDefInfo.Linkage:
      {
        const type = typeDef.sub.type;
        (0, _imports.setImports)(definitions, imports, ['Linkage']);
        return formatLinkage(formatType(definitions, type, imports));
      }

    case _types.TypeDefInfo.Result:
      {
        (0, _imports.setImports)(definitions, imports, ['Result']);
        const [okDef, errorDef] = typeDef.sub;
        return formatResult(formatType(definitions, okDef.type, imports), formatType(definitions, errorDef.type, imports));
      }

    default:
      {
        throw new Error(`Cannot format ${JSON.stringify(type)}`);
      }
  }
}