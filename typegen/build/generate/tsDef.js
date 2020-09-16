"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetter = createGetter;
exports.generateTsDef = generateTsDef;
exports.default = generateTsDefDefault;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _types = require("@polkadot/types/create/types");

var _handlebars = _interopRequireDefault(require("handlebars"));

var _path = _interopRequireDefault(require("path"));

var _create = require("@polkadot/types/create");

var defaultDefinitions = _interopRequireWildcard(require("@polkadot/types/interfaces/definitions"));

var _util = require("@polkadot/util");

var _util2 = require("../util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// helper to generate a `readonly <Name>: <Type>;` getter

/** @internal */
function createGetter(definitions, name = '', type, imports) {
  (0, _util2.setImports)(definitions, imports, [type]);
  return `  readonly ${name}: ${type};\n`;
}
/** @internal */
// eslint-disable-next-line @typescript-eslint/no-unused-vars


function errorUnhandled(definitions, def, imports) {
  throw new Error(`Generate: ${def.name || ''}: Unhandled type ${_types.TypeDefInfo[def.info]}`);
}
/** @internal */


function tsExport(definitions, def, imports) {
  return (0, _util2.exportInterface)(def.name, (0, _util2.formatType)(definitions, def, imports));
}

const tsBTreeMap = tsExport;
const tsBTreeSet = tsExport;
const tsCompact = tsExport;
const tsDoNotConstruct = tsExport;
const tsHashMap = tsExport;
const tsOption = tsExport;
const tsPlain = tsExport;
const tsTuple = tsExport;
/** @internal */

function tsEnum(definitions, {
  name: enumName,
  sub
}, imports) {
  (0, _util2.setImports)(definitions, imports, ['Enum']);
  const keys = sub.map(({
    info,
    name = '',
    type
  }) => {
    const getter = (0, _util.stringUpperFirst)((0, _util.stringCamelCase)(name.replace(' ', '_')));
    const asGetter = type === 'Null' ? '' : createGetter(definitions, `as${getter}`, info === _types.TypeDefInfo.Tuple ? (0, _util2.formatType)(definitions, type, imports) : type, imports);
    const isGetter = createGetter(definitions, `is${getter}`, 'boolean', imports);

    switch (info) {
      case _types.TypeDefInfo.Compact:
      case _types.TypeDefInfo.Plain:
      case _types.TypeDefInfo.Tuple:
      case _types.TypeDefInfo.Vec:
      case _types.TypeDefInfo.Option:
        return `${isGetter}${asGetter}`;

      default:
        throw new Error(`Enum: ${enumName || 'undefined'}: Unhandled type ${_types.TypeDefInfo[info]}`);
    }
  });
  return (0, _util2.exportInterface)(enumName, 'Enum', keys.join(''));
}

function tsInt(definitions, def, imports, type = 'Int') {
  (0, _util2.setImports)(definitions, imports, [type]);
  return (0, _util2.exportInterface)(def.name, type);
}
/** @internal */


function tsResultGetter(definitions, resultName = '', getter, def, imports) {
  const {
    info,
    type
  } = def;
  const asGetter = type === 'Null' ? '' : createGetter(definitions, `as${getter}`, info === _types.TypeDefInfo.Tuple ? (0, _util2.formatType)(definitions, def, imports) : type, imports);
  const isGetter = createGetter(definitions, `is${getter}`, 'boolean', imports);

  switch (info) {
    case _types.TypeDefInfo.Plain:
    case _types.TypeDefInfo.Tuple:
    case _types.TypeDefInfo.Vec:
    case _types.TypeDefInfo.Option:
      return `${isGetter}${asGetter}`;

    default:
      throw new Error(`Result: ${resultName}: Unhandled type ${_types.TypeDefInfo[info]}`);
  }
}
/** @internal */


function tsResult(definitions, def, imports) {
  const [okDef, errorDef] = def.sub;
  const inner = [tsResultGetter(definitions, def.name, 'Error', errorDef, imports), tsResultGetter(definitions, def.name, 'Ok', okDef, imports)].join('');
  (0, _util2.setImports)(definitions, imports, [def.type]);
  return (0, _util2.exportInterface)(def.name, (0, _util2.formatType)(definitions, def, imports), inner);
}
/** @internal */


function tsSet(definitions, {
  name: setName,
  sub
}, imports) {
  (0, _util2.setImports)(definitions, imports, ['Set']);
  const types = sub.map(({
    name
  }) => {
    (0, _util.assert)(!!name, 'Invalid TypeDef found, no name specified');
    return createGetter(definitions, `is${name}`, 'boolean', imports);
  });
  return (0, _util2.exportInterface)(setName, 'Set', types.join(''));
}
/** @internal */


function tsStruct(definitions, {
  name: structName,
  sub
}, imports) {
  (0, _util2.setImports)(definitions, imports, ['Struct']);
  const keys = sub.map(typedef => {
    const returnType = (0, _util2.formatType)(definitions, typedef, imports);
    return createGetter(definitions, typedef.name, returnType, imports);
  });
  return (0, _util2.exportInterface)(structName, 'Struct', keys.join(''));
}
/** @internal */


function tsUInt(definitions, def, imports) {
  return tsInt(definitions, def, imports, 'UInt');
}
/** @internal */


function tsVec(definitions, def, imports) {
  const type = def.sub.type;

  if (def.info === _types.TypeDefInfo.VecFixed && type === 'u8') {
    (0, _util2.setImports)(definitions, imports, ['U8aFixed']);
    return (0, _util2.exportType)(def.name, 'U8aFixed');
  }

  return (0, _util2.exportInterface)(def.name, (0, _util2.formatType)(definitions, def, imports));
}
/** @internal */


function generateInterfaces(definitions, {
  types
}, imports) {
  // handlers are defined externally to use - this means that when we do a
  // `generators[typedef.info](...)` TS will show any unhandled types. Rather
  // we are being explicit in having no handlers where we do not support (yet)
  const generators = {
    [_types.TypeDefInfo.BTreeMap]: tsBTreeMap,
    [_types.TypeDefInfo.BTreeSet]: tsBTreeSet,
    [_types.TypeDefInfo.Compact]: tsCompact,
    [_types.TypeDefInfo.DoNotConstruct]: tsDoNotConstruct,
    [_types.TypeDefInfo.Enum]: tsEnum,
    [_types.TypeDefInfo.HashMap]: tsHashMap,
    [_types.TypeDefInfo.Int]: tsInt,
    [_types.TypeDefInfo.Linkage]: errorUnhandled,
    [_types.TypeDefInfo.Null]: errorUnhandled,
    [_types.TypeDefInfo.Option]: tsOption,
    [_types.TypeDefInfo.Plain]: tsPlain,
    [_types.TypeDefInfo.Result]: tsResult,
    [_types.TypeDefInfo.Set]: tsSet,
    [_types.TypeDefInfo.Struct]: tsStruct,
    [_types.TypeDefInfo.Tuple]: tsTuple,
    [_types.TypeDefInfo.UInt]: tsUInt,
    [_types.TypeDefInfo.Vec]: tsVec,
    [_types.TypeDefInfo.VecFixed]: tsVec
  };
  return Object.entries(types).map(([name, type]) => {
    const def = (0, _create.getTypeDef)((0, _util.isString)(type) ? type.toString() : JSON.stringify(type), {
      name
    });
    return [name, generators[def.info](definitions, def, imports)];
  });
}

const templateIndex = (0, _util2.readTemplate)('tsDef/index');

const generateTsDefIndexTemplate = _handlebars.default.compile(templateIndex);

const templateModuleTypes = (0, _util2.readTemplate)('tsDef/moduleTypes');

const generateTsDefModuleTypesTemplate = _handlebars.default.compile(templateModuleTypes);

const templateTypes = (0, _util2.readTemplate)('tsDef/types');

const generateTsDefTypesTemplate = _handlebars.default.compile(templateTypes);
/** @internal */


function generateTsDefFor(importDefinitions, defName, {
  types
}, outputDir) {
  const imports = _objectSpread(_objectSpread({}, (0, _util2.createImports)(importDefinitions, {
    types
  })), {}, {
    interfaces: []
  });

  const definitions = imports.definitions;
  const interfaces = generateInterfaces(definitions, {
    types
  }, imports);
  const items = interfaces.sort((a, b) => a[0].localeCompare(b[0])).map(([, definition]) => definition);
  const importTypes = [...Object.keys(imports.localTypes).sort().map(packagePath => ({
    file: packagePath,
    types: Object.keys(imports.localTypes[packagePath])
  }))];
  (0, _util2.writeFile)(_path.default.join(outputDir, defName, 'types.ts'), () => generateTsDefModuleTypesTemplate({
    headerType: 'defs',
    imports,
    items,
    name: defName,
    types: importTypes
  }), true);
  (0, _util2.writeFile)(_path.default.join(outputDir, defName, 'index.ts'), () => generateTsDefIndexTemplate({
    headerType: 'defs'
  }), true);
}
/** @internal */


function generateTsDef(importDefinitions, outputDir, generatingPackage) {
  (0, _util2.writeFile)(_path.default.join(outputDir, 'types.ts'), () => {
    const definitions = importDefinitions[generatingPackage];
    Object.entries(definitions).forEach(([defName, obj]) => {
      console.log(`\tExtracting interfaces for ${defName}`);
      generateTsDefFor(importDefinitions, defName, obj, outputDir);
    });
    return generateTsDefTypesTemplate({
      headerType: 'defs',
      items: Object.keys(definitions)
    });
  });
  (0, _util2.writeFile)(_path.default.join(outputDir, 'index.ts'), () => generateTsDefIndexTemplate({
    headerType: 'defs'
  }), true);
}
/** @internal */


function generateTsDefDefault() {
  generateTsDef({
    '@polkadot/types/interfaces': defaultDefinitions
  }, 'packages/types/src/interfaces', '@polkadot/types/interfaces');
}