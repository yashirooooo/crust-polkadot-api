"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRpcTypes = generateRpcTypes;
exports.default = generateDefaultRpcTypes;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _handlebars = _interopRequireDefault(require("handlebars"));

var _create = require("@polkadot/types/create");

var defaultDefinitions = _interopRequireWildcard(require("@polkadot/types/interfaces/definitions"));

var _util = require("../util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const StorageKeyTye = 'StorageKey | string | Uint8Array | any';
const template = (0, _util.readTemplate)('rpc');

const generateRpcTypesTemplate = _handlebars.default.compile(template);
/** @internal */


function generateRpcTypes(importDefinitions, dest) {
  (0, _util.writeFile)(dest, () => {
    const registry = new _create.TypeRegistry();
    const imports = (0, _util.createImports)(importDefinitions);
    const definitions = imports.definitions;
    const allDefs = Object.entries(importDefinitions).reduce((defs, [path, obj]) => {
      return Object.entries(obj).reduce((defs, [key, value]) => _objectSpread(_objectSpread({}, defs), {}, {
        [`${path}/${key}`]: value
      }), defs);
    }, {});
    const rpcKeys = Object.keys(definitions).filter(key => Object.keys(definitions[key].rpc || {}).length !== 0).sort();
    const modules = rpcKeys.map(sectionFullName => {
      const rpc = definitions[sectionFullName].rpc;
      const section = sectionFullName.split('/').pop();
      const allMethods = Object.keys(rpc).sort().map(methodName => {
        const def = rpc[methodName];
        let args;
        let type;
        let generic; // These are too hard to type with generics, do manual overrides

        if (section === 'state') {
          (0, _util.setImports)(allDefs, imports, ['Codec', 'Hash', 'StorageKey', 'Vec']);

          if (methodName === 'getStorage') {
            generic = 'T = Codec';
            args = [`key: ${StorageKeyTye}, block?: Hash | Uint8Array | string`];
            type = 'T';
          } else if (methodName === 'queryStorage') {
            generic = 'T = Codec[]';
            args = [`keys: Vec<StorageKey> | (${StorageKeyTye})[], fromBlock?: Hash | Uint8Array | string, toBlock?: Hash | Uint8Array | string`];
            type = '[Hash, T][]';
          } else if (methodName === 'queryStorageAt') {
            generic = 'T = Codec[]';
            args = [`keys: Vec<StorageKey> | (${StorageKeyTye})[], at?: Hash | Uint8Array | string`];
            type = 'T';
          } else if (methodName === 'subscribeStorage') {
            generic = 'T = Codec[]';
            args = [`keys?: Vec<StorageKey> | (${StorageKeyTye})[]`];
            type = 'T';
          }
        }

        if (args === undefined) {
          (0, _util.setImports)(allDefs, imports, [def.type]);
          args = def.params.map(param => {
            const similarTypes = (0, _util.getSimilarTypes)(definitions, registry, param.type, imports);
            (0, _util.setImports)(allDefs, imports, [param.type, ...similarTypes]);
            return `${param.name}${param.isOptional ? '?' : ''}: ${similarTypes.join(' | ')}`;
          });
          type = (0, _util.formatType)(allDefs, def.type, imports);
          generic = '';
        }

        return {
          args: args.join(', '),
          docs: [def.description],
          generic,
          name: methodName,
          type
        };
      });
      return {
        items: allMethods,
        name: section
      };
    });
    imports.typesTypes.Observable = true;
    const types = [...Object.keys(imports.localTypes).sort().map(packagePath => ({
      file: packagePath,
      types: Object.keys(imports.localTypes[packagePath])
    }))];
    return generateRpcTypesTemplate({
      headerType: 'chain',
      imports,
      modules,
      types
    });
  });
}

function generateDefaultRpcTypes() {
  generateRpcTypes({
    '@polkadot/types/interfaces': defaultDefinitions
  }, 'packages/api/src/augment/rpc.ts');
}