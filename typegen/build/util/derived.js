"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDerivedTypes = getDerivedTypes;
exports.getSimilarTypes = getSimilarTypes;

var _types = require("@polkadot/types/create/types");

var _create = require("@polkadot/types/create");

var _AbstractInt = _interopRequireDefault(require("@polkadot/types/codec/AbstractInt"));

var _Compact = _interopRequireDefault(require("@polkadot/types/codec/Compact"));

var _Enum = _interopRequireDefault(require("@polkadot/types/codec/Enum"));

var _Option = _interopRequireDefault(require("@polkadot/types/codec/Option"));

var _Struct = _interopRequireDefault(require("@polkadot/types/codec/Struct"));

var _Vec = _interopRequireDefault(require("@polkadot/types/codec/Vec"));

var _Tuple = _interopRequireDefault(require("@polkadot/types/codec/Tuple"));

var _definitions = require("@polkadot/types/interfaces/democracy/definitions");

var _AccountId = _interopRequireDefault(require("@polkadot/types/generic/AccountId"));

var _LookupSource = _interopRequireDefault(require("@polkadot/types/generic/LookupSource"));

var _Vote = _interopRequireDefault(require("@polkadot/types/generic/Vote"));

var _Null = _interopRequireDefault(require("@polkadot/types/primitive/Null"));

var primitiveClasses = _interopRequireWildcard(require("@polkadot/types/primitive"));

var _util = require("@polkadot/util");

var _class = require("./class");

var _formatting = require("./formatting");

var _imports = require("./imports");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function arrayToStrType(arr) {
  return `${arr.map(c => `'${c}'`).join(' | ')}`;
}

const voteConvictions = arrayToStrType(_definitions.AllConvictions); // From `T`, generate `Compact<T>, Option<T>, Vec<T>`

/** @internal */

function getDerivedTypes(definitions, type, primitiveName, imports) {
  // `primitiveName` represents the actual primitive type our type is mapped to
  const isCompact = (0, _class.isCompactEncodable)(primitiveClasses[primitiveName]);
  const def = (0, _create.getTypeDef)(type);
  (0, _imports.setImports)(definitions, imports, ['Option', 'Vec', isCompact ? 'Compact' : '']);
  const types = [{
    info: _types.TypeDefInfo.Option,
    sub: def,
    type
  }, {
    info: _types.TypeDefInfo.Vec,
    sub: def,
    type
  }];

  if (isCompact) {
    types.unshift({
      info: _types.TypeDefInfo.Compact,
      sub: def,
      type
    });
  }

  const result = types.map(t => (0, _formatting.formatType)(definitions, t, imports)).map(t => `'${t}': ${t};`);
  result.unshift(`${type}: ${type};`);
  return result;
} // Make types a little bit more flexible
// - if param instanceof AbstractInt, then param: u64 | Uint8array | AnyNumber
// etc

/** @internal */


function getSimilarTypes(definitions, registry, _type, imports) {
  const typeParts = _type.split('::');

  const type = typeParts[typeParts.length - 1];
  const possibleTypes = [type];

  if (type === 'Extrinsic') {
    (0, _imports.setImports)(definitions, imports, ['IExtrinsic']);
    return ['IExtrinsic'];
  } else if (type === 'StorageKey') {
    // TODO We can do better
    return ['StorageKey', 'string', 'Uint8Array', 'any'];
  } else if (type === '()') {
    return ['null'];
  }

  const Clazz = (0, _create.ClassOfUnsafe)(registry, type);

  if ((0, _util.isChildClass)(_Vec.default, Clazz)) {
    const vecDef = (0, _create.getTypeDef)(type);
    const subDef = vecDef.sub; // this could be that we define a Vec type and refer to it by name

    if (subDef) {
      if (subDef.info === _types.TypeDefInfo.Plain) {
        possibleTypes.push(`(${getSimilarTypes(definitions, registry, subDef.type, imports).join(' | ')})[]`);
      } else if (subDef.info === _types.TypeDefInfo.Tuple) {
        const subs = subDef.sub.map(({
          type
        }) => getSimilarTypes(definitions, registry, type, imports).join(' | '));
        possibleTypes.push(`([${subs.join(', ')}])[]`);
      } else {
        throw new Error(`Unhandled subtype in Vec, ${JSON.stringify(subDef)}`);
      }
    }
  } else if ((0, _util.isChildClass)(_Enum.default, Clazz)) {
    const e = new Clazz(registry);

    if (e.isBasic) {
      possibleTypes.push(arrayToStrType(e.defKeys), 'number');
    } else {
      // TODO We don't really want any here, these should be expanded
      possibleTypes.push(...e.defKeys.map(key => `{ ${key}: any }`), 'string');
    }

    possibleTypes.push('Uint8Array');
  } else if ((0, _util.isChildClass)(_AbstractInt.default, Clazz) || (0, _util.isChildClass)(_Compact.default, Clazz)) {
    possibleTypes.push('AnyNumber', 'Uint8Array');
  } else if ((0, _util.isChildClass)(_LookupSource.default, Clazz)) {
    possibleTypes.push('Address', 'AccountId', 'AccountIndex', 'LookupSource', 'string', 'Uint8Array');
  } else if ((0, _util.isChildClass)(_AccountId.default, Clazz)) {
    possibleTypes.push('string', 'Uint8Array');
  } else if ((0, _util.isChildClass)(registry.createClass('bool'), Clazz)) {
    possibleTypes.push('boolean', 'Uint8Array');
  } else if ((0, _util.isChildClass)(_Null.default, Clazz)) {
    possibleTypes.push('null');
  } else if ((0, _util.isChildClass)(_Struct.default, Clazz)) {
    const s = new Clazz(registry);
    const obj = s.defKeys.map(key => `${key}?: any`).join('; ');
    possibleTypes.push(`{ ${obj} }`, 'string', 'Uint8Array');
  } else if ((0, _util.isChildClass)(_Option.default, Clazz)) {
    // TODO inspect container
    possibleTypes.push('null', 'object', 'string', 'Uint8Array');
  } else if ((0, _util.isChildClass)(_Vote.default, Clazz)) {
    possibleTypes.push(`{ aye: boolean; conviction?: ${voteConvictions} | number }`, 'boolean', 'string', 'Uint8Array');
  } else if ((0, _util.isChildClass)(Uint8Array, Clazz)) {
    possibleTypes.push('string', 'Uint8Array');
  } else if ((0, _util.isChildClass)(String, Clazz)) {
    possibleTypes.push('string');
  } else if ((0, _util.isChildClass)(_Tuple.default, Clazz)) {
    const tupDef = (0, _create.getTypeDef)(type);
    const subDef = tupDef.sub; // this could be that we define a Tuple type and refer to it by name

    if (Array.isArray(subDef)) {
      const subs = subDef.map(({
        type
      }) => getSimilarTypes(definitions, registry, type, imports).join(' | '));
      possibleTypes.push(`[${subs.join(', ')}]`);
    }
  }

  return possibleTypes;
}