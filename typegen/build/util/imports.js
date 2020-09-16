"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setImports = setImports;
exports.createImports = createImports;

var _types = require("@polkadot/types/create/types");

var codecClasses = _interopRequireWildcard(require("@polkadot/types/codec"));

var _create = require("@polkadot/types/create");

var extrinsicClasses = _interopRequireWildcard(require("@polkadot/types/extrinsic"));

var genericClasses = _interopRequireWildcard(require("@polkadot/types/generic"));

var primitiveClasses = _interopRequireWildcard(require("@polkadot/types/primitive"));

// Copyright 2017-2020 @polkadot/typegen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// Maps the types as found to the source location. This is used to generate the
// imports in the output file, dep-duped and sorted

/** @internal */
function setImports(allDefs, imports, types) {
  const {
    codecTypes,
    extrinsicTypes,
    genericTypes,
    ignoredTypes,
    localTypes,
    primitiveTypes,
    typesTypes
  } = imports;
  types.forEach(type => {
    if (ignoredTypes.includes(type)) {// do nothing
    } else if (['AnyNumber', 'CallFunction', 'Codec', 'IExtrinsic', 'ITuple'].includes(type)) {
      typesTypes[type] = true;
    } else if (codecClasses[type]) {
      codecTypes[type] = true;
    } else if (extrinsicClasses[type]) {
      extrinsicTypes[type] = true;
    } else if (genericClasses[type]) {
      genericTypes[type] = true;
    } else if (primitiveClasses[type] || type === 'Metadata') {
      primitiveTypes[type] = true;
    } else if (type.includes('<') || type.includes('(') || type.includes('[') && !type.includes('|')) {
      // If the type is a bit special (tuple, fixed u8, nested type...), then we
      // need to parse it with `getTypeDef`. We skip the case where type ~ [a | b | c ... , ... , ... w | y | z ]
      // since that represents a tuple's similar types, which are covered in the next block
      const typeDef = (0, _create.getTypeDef)(type);
      setImports(allDefs, imports, [_types.TypeDefInfo[typeDef.info]]); // TypeDef.sub is a `TypeDef | TypeDef[]`

      if (Array.isArray(typeDef.sub)) {
        typeDef.sub.forEach(subType => setImports(allDefs, imports, [subType.type]));
      } else if (typeDef.sub && (typeDef.info !== _types.TypeDefInfo.VecFixed || typeDef.sub.type !== 'u8')) {
        // typeDef.sub is a TypeDef in this case
        setImports(allDefs, imports, [typeDef.sub.type]);
      }
    } else if (type.includes('[') && type.includes('|')) {
      // We split the types
      const splitTypes = /\[\s?(.+?)\s?\]/.exec(type)[1].split(/\s?\|\s?/);
      setImports(allDefs, imports, splitTypes);
    } else {
      // find this module inside the exports from the rest
      const [moduleName] = Object.entries(allDefs).find(([, {
        types
      }]) => Object.keys(types).includes(type)) || [null];

      if (moduleName) {
        localTypes[moduleName][type] = true;
      }
    }
  });
} // Create an Imports object, can be pre-filled with `ignoredTypes`

/** @internal */


function createImports(importDefinitions, {
  types
} = {
  types: {}
}) {
  const definitions = {};
  const typeToModule = {};
  Object.entries(importDefinitions).forEach(([packagePath, packageDef]) => {
    Object.entries(packageDef).forEach(([name, moduleDef]) => {
      const fullName = `${packagePath}/${name}`;
      definitions[fullName] = moduleDef;
      Object.keys(moduleDef.types).forEach(type => {
        if (typeToModule[type]) {
          console.warn(`\t\tWARN: Overwriting duplicated type '${type}' ${typeToModule[type]} -> ${fullName}`);
        }

        typeToModule[type] = fullName;
      });
    });
  });
  return {
    codecTypes: {},
    definitions,
    extrinsicTypes: {},
    genericTypes: {},
    ignoredTypes: Object.keys(types),
    localTypes: Object.keys(definitions).reduce((local, mod) => {
      local[mod] = {};
      return local;
    }, {}),
    primitiveTypes: {},
    typeToModule,
    typesTypes: {}
  };
}