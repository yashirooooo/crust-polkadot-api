"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateTx;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _handlebars = _interopRequireDefault(require("handlebars"));

var _static = _interopRequireDefault(require("@polkadot/metadata/Metadata/static"));

var _Metadata = _interopRequireDefault(require("@polkadot/metadata/Metadata"));

var defaultDefs = _interopRequireWildcard(require("@polkadot/types/interfaces/definitions"));

var _create = require("@polkadot/types/create");

var _util = require("@polkadot/util");

var _util2 = require("../util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const MAPPED_NAMES = {
  new: 'updated'
};

function mapName(_name) {
  const name = (0, _util.stringCamelCase)(_name.toString());
  return MAPPED_NAMES[name] || name;
}

const template = (0, _util2.readTemplate)('tx');

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
    const modules = meta.asLatest.modules.sort(_util2.compareName).filter(({
      calls
    }) => calls.unwrapOr([]).length !== 0).map(({
      calls,
      name
    }) => {
      (0, _util2.setImports)(allDefs, imports, ['Call', 'Extrinsic', 'SubmittableExtrinsic']);
      const items = calls.unwrap().sort(_util2.compareName).map(({
        args,
        documentation,
        name
      }) => {
        const params = args.map(({
          name,
          type
        }) => {
          const typeStr = type.toString();
          const similarTypes = (0, _util2.getSimilarTypes)(allDefs, registry, typeStr, imports).map(type => (0, _util2.formatType)(allDefs, type, imports));
          const nameStr = mapName(name);
          (0, _util2.setImports)(allDefs, imports, [...similarTypes.filter(type => !type.startsWith('(') && !type.startsWith('{')), typeStr]);
          return `${nameStr}: ${similarTypes.join(' | ')}`;
        }).join(', ');
        return {
          docs: documentation,
          name: (0, _util.stringCamelCase)(name.toString()),
          params
        };
      });
      return {
        items,
        name: (0, _util.stringCamelCase)(name.toString())
      };
    });
    const types = [...Object.keys(imports.localTypes).sort().map(packagePath => ({
      file: packagePath,
      types: Object.keys(imports.localTypes[packagePath])
    })), {
      file: '@polkadot/api/types',
      types: ['ApiTypes', 'SubmittableExtrinsic']
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


function generateTx(dest = 'packages/api/src/augment/tx.ts', data = _static.default, extraTypes = {}, isStrict = false) {
  const registry = new _create.TypeRegistry();
  (0, _util2.registerDefinitions)(registry, extraTypes);
  return generateForMeta(registry, new _Metadata.default(registry, data), dest, extraTypes, isStrict);
}