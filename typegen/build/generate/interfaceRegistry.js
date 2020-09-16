"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateInterfaceTypes = generateInterfaceTypes;
exports.default = generateDefaultInterfaceTypes;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _handlebars = _interopRequireDefault(require("handlebars"));

var _Raw = _interopRequireDefault(require("@polkadot/types/codec/Raw"));

var defaultDefinitions = _interopRequireWildcard(require("@polkadot/types/interfaces/definitions"));

var defaultPrimitives = _interopRequireWildcard(require("@polkadot/types/primitive"));

var _util = require("../util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const primitiveClasses = _objectSpread(_objectSpread({}, defaultPrimitives), {}, {
  Raw: _Raw.default
});

const template = (0, _util.readTemplate)('interfaceRegistry');

const generateInterfaceTypesTemplate = _handlebars.default.compile(template);
/** @internal */


function generateInterfaceTypes(importDefinitions, dest) {
  (0, _util.writeFile)(dest, () => {
    Object.entries(importDefinitions).reduce((acc, def) => Object.assign(acc, def), {});
    const imports = (0, _util.createImports)(importDefinitions);
    const definitions = imports.definitions;
    const items = [];
    Object.keys(primitiveClasses).filter(name => !!name.indexOf('Generic')).forEach(primitiveName => {
      (0, _util.setImports)(definitions, imports, [primitiveName]);
      items.push(...(0, _util.getDerivedTypes)(definitions, primitiveName, primitiveName, imports));
    });
    const existingTypes = {};
    Object.entries(definitions).forEach(([, {
      types
    }]) => {
      (0, _util.setImports)(definitions, imports, Object.keys(types));
      const uniqueTypes = Object.keys(types).filter(type => !existingTypes[type]);
      uniqueTypes.forEach(type => {
        existingTypes[type] = true;
        items.push(...(0, _util.getDerivedTypes)(definitions, type, types[type], imports));
      });
    });
    const types = [...Object.keys(imports.localTypes).sort().map(packagePath => ({
      file: packagePath,
      types: Object.keys(imports.localTypes[packagePath])
    }))];
    return generateInterfaceTypesTemplate({
      headerType: 'defs',
      imports,
      items,
      types
    });
  });
} // Generate `packages/types/src/interfaceRegistry.ts`, the registry of all interfaces


function generateDefaultInterfaceTypes() {
  generateInterfaceTypes({
    '@polkadot/types/interfaces': defaultDefinitions
  }, 'packages/types/src/augment/registry.ts');
}