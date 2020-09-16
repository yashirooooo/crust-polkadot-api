"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateQuery;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _handlebars = _interopRequireDefault(require("handlebars"));

var _static = _interopRequireDefault(require("@polkadot/metadata/Metadata/static"));

var _Metadata = _interopRequireDefault(require("@polkadot/metadata/Metadata"));

var defaultDefs = _interopRequireWildcard(require("@polkadot/types/interfaces/definitions"));

var _StorageKey = require("@polkadot/types/primitive/StorageKey");

var _create = require("@polkadot/types/create");

var _util = require("@polkadot/util");

var _util2 = require("../util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// From a storage entry metadata, we return [args, returnType]

/** @internal */
function entrySignature(allDefs, registry, storageEntry, imports) {
  const format = type => (0, _util2.formatType)(allDefs, type, imports);

  const outputType = (0, _StorageKey.unwrapStorageType)(storageEntry.type, storageEntry.modifier.isOptional);

  if (storageEntry.type.isPlain) {
    (0, _util2.setImports)(allDefs, imports, [storageEntry.type.asPlain.toString()]);
    return ['', (0, _util2.formatType)(allDefs, outputType, imports)];
  } else if (storageEntry.type.isMap) {
    // Find similar types of the `key` type
    const similarTypes = (0, _util2.getSimilarTypes)(allDefs, registry, storageEntry.type.asMap.key.toString(), imports);
    (0, _util2.setImports)(allDefs, imports, [...similarTypes, storageEntry.type.asMap.value.toString()]);
    return [`arg: ${similarTypes.map(format).join(' | ')}`, (0, _util2.formatType)(allDefs, outputType, imports)];
  } else if (storageEntry.type.isDoubleMap) {
    // Find similar types of `key1` and `key2` types
    const similarTypes1 = (0, _util2.getSimilarTypes)(allDefs, registry, storageEntry.type.asDoubleMap.key1.toString(), imports);
    const similarTypes2 = (0, _util2.getSimilarTypes)(allDefs, registry, storageEntry.type.asDoubleMap.key2.toString(), imports);
    (0, _util2.setImports)(allDefs, imports, [...similarTypes1, ...similarTypes2, storageEntry.type.asDoubleMap.value.toString()]);
    const key1Types = similarTypes1.map(format).join(' | ');
    const key2Types = similarTypes2.map(format).join(' | ');
    return [`key1: ${key1Types}, key2: ${key2Types}`, (0, _util2.formatType)(allDefs, outputType, imports)];
  }

  throw new Error(`entryArgs: Cannot parse args of entry ${storageEntry.name.toString()}`);
}

const template = (0, _util2.readTemplate)('query');

const generateForMetaTemplate = _handlebars.default.compile(template);
/** @internal */


function generateForMeta(registry, meta, dest, extraTypes, isStrict) {
  (0, _util2.writeFile)(dest, () => {
    const allTypes = _objectSpread({
      '@polkadot/types/interfaces': defaultDefs
    }, extraTypes);

    const imports = (0, _util2.createImports)(allTypes);
    const allDefs = Object.entries(allTypes).reduce((defs, [path, obj]) => {
      return Object.entries(obj).reduce((defs, [key, value]) => _objectSpread(_objectSpread({}, defs), {}, {
        [`${path}/${key}`]: value
      }), defs);
    }, {});
    const modules = meta.asLatest.modules.sort(_util2.compareName).filter(mod => !mod.storage.isNone).map(({
      name,
      storage
    }) => {
      const items = storage.unwrap().items.sort(_util2.compareName).map(storageEntry => {
        const [args, returnType] = entrySignature(allDefs, registry, storageEntry, imports);
        let entryType = 'AugmentedQuery';

        if (storageEntry.type.isDoubleMap) {
          entryType = `${entryType}DoubleMap`;
        }

        return {
          args,
          docs: storageEntry.documentation,
          entryType,
          name: (0, _util.stringCamelCase)(storageEntry.name.toString()),
          returnType
        };
      });
      return {
        items,
        name: (0, _util.stringCamelCase)(name.toString())
      };
    });
    imports.typesTypes.Observable = true;
    const types = [...Object.keys(imports.localTypes).sort().map(packagePath => ({
      file: packagePath,
      types: Object.keys(imports.localTypes[packagePath])
    })), {
      file: '@polkadot/api/types',
      types: ['ApiTypes']
    }];
    return generateForMetaTemplate({
      headerType: 'chain',
      imports,
      isStrict,
      modules,
      types
    });
  });
} // Call `generateForMeta()` with current static metadata

/** @internal */


function generateQuery(dest = 'packages/api/src/augment/query.ts', data = _static.default, extraTypes = {}, isStrict = false) {
  const registry = new _create.TypeRegistry();
  (0, _util2.registerDefinitions)(registry, extraTypes);
  return generateForMeta(registry, new _Metadata.default(registry, data), dest, extraTypes, isStrict);
}