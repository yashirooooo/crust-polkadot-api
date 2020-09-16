"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateConsts;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _handlebars = _interopRequireDefault(require("handlebars"));

var _static = _interopRequireDefault(require("@polkadot/metadata/Metadata/static"));

var _Metadata = _interopRequireDefault(require("@polkadot/metadata/Metadata"));

var _create = require("@polkadot/types/create");

var defaultDefs = _interopRequireWildcard(require("@polkadot/types/interfaces/definitions"));

var _util = require("@polkadot/util");

var _util2 = require("../util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const template = (0, _util2.readTemplate)('consts');

const generateForMetaTemplate = _handlebars.default.compile(template);
/** @internal */


function generateForMeta(meta, dest, extraTypes, isStrict) {
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
    const modules = meta.asLatest.modules.sort(_util2.compareName).filter(mod => mod.constants.length > 0).map(({
      constants,
      name
    }) => {
      if (!isStrict) {
        (0, _util2.setImports)(allDefs, imports, ['Codec']);
      }

      const items = constants.sort(_util2.compareName).map(({
        documentation,
        name,
        type
      }) => {
        (0, _util2.setImports)(allDefs, imports, [type.toString()]);
        return {
          docs: documentation,
          name: (0, _util.stringCamelCase)(name.toString()),
          type: type.toString()
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


function generateConsts(dest = 'packages/api/src/augment/consts.ts', data = _static.default, extraTypes = {}, isStrict = false) {
  const registry = new _create.TypeRegistry();
  (0, _util2.registerDefinitions)(registry, extraTypes);
  return generateForMeta(new _Metadata.default(registry, data), dest, extraTypes, isStrict);
}