"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = main;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fs = _interopRequireDefault(require("fs"));

var _Decorated = _interopRequireDefault(require("@polkadot/metadata/Decorated"));

var _static = _interopRequireDefault(require("@polkadot/metadata/Metadata/static"));

var _Call = _interopRequireDefault(require("@polkadot/types/generic/Call"));

var _StorageKey = require("@polkadot/types/primitive/StorageKey");

var _create = require("@polkadot/types/create");

var _codec = require("@polkadot/types/codec");

var definitions = _interopRequireWildcard(require("@polkadot/types/interfaces/definitions"));

var _util = require("@polkadot/util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const STATIC_TEXT = '\n\n(NOTE: These were generated from a static/snapshot view of a recent Substrate master node. Some items may not be available in older nodes, or in any customized implementations.)';
const DESC_CONSTANTS = `The following sections contain the module constants, also known as parameter types. These can only be changed as part of a runtime upgrade. On the api, these are exposed via \`api.consts.<module>.<method>\`. ${STATIC_TEXT}`;
const DESC_EXTRINSICS = `The following sections contain Extrinsics methods are part of the default Substrate runtime. On the api, these are exposed via \`api.tx.<module>.<method>\`. ${STATIC_TEXT}`;
const DESC_ERRORS = `This page lists the errors that can be encountered in the different modules. ${STATIC_TEXT}`;
const DESC_EVENTS = `Events are emitted for certain operations on the runtime. The following sections describe the events that are part of the default Substrate runtime. ${STATIC_TEXT}`;
const DESC_RPC = 'The following sections contain RPC methods that are Remote Calls available by default and allow you to interact with the actual node, query, and submit.';
const DESC_STORAGE = `The following sections contain Storage methods are part of the default Substrate runtime. On the api, these are exposed via \`api.query.<module>.<method>\`. ${STATIC_TEXT}`;
/** @internal */

function documentationVecToMarkdown(docLines, indent = 0) {
  const md = docLines.map(docLine => docLine && docLine.substring(1)) // trim the leading space
  .reduce((md, docLine) => // generate paragraphs
  !docLine.trim().length ? `${md}\n\n` // empty line
  : /^[*-]/.test(docLine.trimStart()) && !md.endsWith('\n\n') ? `${md}\n\n${docLine}` // line calling for a preceding linebreak
  : `${md}${docLine // line continuing the preceding line
  .replace(/^# <weight>$/g, '\\# \\<weight>\n\n').replace(/^# <\/weight>$/g, '\n\n\\# \\</weight>').replace(/^#{1,3} /, '#### ')} `, ''); // prefix each line with indentation

  return md && md.split('\n\n').map(line => `${' '.repeat(indent)}${line}`).join('\n\n');
}

function renderPage(page) {
  let md = `## ${page.title}\n\n`;

  if (page.description) {
    md += `${page.description}\n\n`;
  } // index


  page.sections.forEach(section => {
    md += `- **[${(0, _util.stringCamelCase)(section.name)}](#${(0, _util.stringCamelCase)(section.name).toLowerCase()})**\n\n`;
  }); // contents

  page.sections.forEach(section => {
    md += `\n___\n\n\n## ${section.name}\n`;

    if (section.description) {
      md += `\n_${section.description}_\n`;
    }

    section.items.forEach(item => {
      md += ` \n### ${item.name}`;
      Object.keys(item).filter(i => i !== 'name').forEach(bullet => {
        md += `\n- **${bullet}**: ${// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        item[bullet] instanceof _codec.Vec ? documentationVecToMarkdown(item[bullet], 2).toString() : item[bullet]}`;
      });
      md += '\n';
    });
  });
  return md;
}

function sortByName(a, b) {
  // case insensitive (all-uppercase) sorting
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  return a.name.toString().toUpperCase().localeCompare(b.name.toString().toUpperCase());
}
/** @internal */


function addRpc() {
  const sections = Object.keys(definitions).filter(key => Object.keys(definitions[key].rpc || {}).length !== 0);
  return renderPage({
    description: DESC_RPC,
    sections: sections.sort().map(sectionName => {
      const section = definitions[sectionName];
      return {
        // description: section.description,
        items: Object.keys(section.rpc).sort().map(methodName => {
          const method = section.rpc[methodName];
          const args = method.params.map(({
            isOptional,
            name,
            type
          }) => {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            return name + (isOptional ? '?' : '') + ': `' + type + '`';
          }).join(', ');
          const type = '`' + method.type + '`';
          return _objectSpread({
            interface: '`' + `api.rpc.${sectionName}.${methodName}` + '`',
            jsonrpc: '`' + `${sectionName}_${methodName}` + '`',
            name: `${methodName}(${args}): ${type}`
          }, method.description && {
            summary: method.description
          });
        }),
        name: sectionName
      };
    }),
    title: 'JSON-RPC'
  });
}
/** @internal */


function addConstants(metadata) {
  return renderPage({
    description: DESC_CONSTANTS,
    sections: metadata.modules.sort(sortByName).filter(moduleMetadata => !moduleMetadata.constants.isEmpty).map(moduleMetadata => {
      const sectionName = (0, _util.stringLowerFirst)(moduleMetadata.name.toString());
      return {
        items: moduleMetadata.constants.sort(sortByName).map(func => {
          const methodName = (0, _util.stringCamelCase)(func.name.toString());
          return _objectSpread({
            interface: '`' + `api.consts.${sectionName}.${methodName}` + '`',
            name: `${methodName}: ` + '`' + func.type.toString() + '`'
          }, func.documentation.length && {
            summary: func.documentation
          });
        }),
        name: sectionName
      };
    }),
    title: 'Constants'
  });
}
/** @internal */


function addStorage(metadata) {
  const moduleSections = metadata.modules.sort(sortByName).filter(moduleMetadata => !moduleMetadata.storage.isNone).map(moduleMetadata => {
    const sectionName = (0, _util.stringLowerFirst)(moduleMetadata.name.toString());
    return {
      items: moduleMetadata.storage.unwrap().items.sort(sortByName).map(func => {
        const arg = func.type.isMap ? '`' + func.type.asMap.key.toString() + '`' : func.type.isDoubleMap ? '`' + func.type.asDoubleMap.key1.toString() + ', ' + func.type.asDoubleMap.key2.toString() + '`' : '';
        const methodName = (0, _util.stringLowerFirst)(func.name.toString());
        const outputType = (0, _StorageKey.unwrapStorageType)(func.type, func.modifier.isOptional);
        return _objectSpread({
          interface: '`' + `api.query.${sectionName}.${methodName}` + '`',
          name: `${methodName}(${arg}): ` + '`' + outputType + '`'
        }, func.documentation.length && {
          summary: func.documentation
        });
      }),
      name: sectionName
    };
  }); // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

  const knownSection = JSON.parse(_fs.default.readFileSync('docs/substrate/storage-known-section.json', 'utf8'));
  return renderPage({
    description: DESC_STORAGE,
    sections: moduleSections.concat([knownSection]),
    title: 'Storage'
  });
}
/** @internal */


function addExtrinsics(metadata) {
  return renderPage({
    description: DESC_EXTRINSICS,
    sections: metadata.modules.sort(sortByName).filter(meta => !meta.calls.isNone && meta.calls.unwrap().length !== 0).map(meta => {
      const sectionName = (0, _util.stringCamelCase)(meta.name.toString());
      return {
        items: meta.calls.unwrap().sort(sortByName).map(func => {
          const methodName = (0, _util.stringCamelCase)(func.name.toString());

          const args = _Call.default.filterOrigin(func).map(({
            name,
            type
          }) => `${name.toString()}: ` + '`' + type.toString() + '`').join(', ');

          return _objectSpread({
            interface: '`' + `api.tx.${sectionName}.${methodName}` + '`',
            name: `${methodName}(${args})`
          }, func.documentation.length && {
            summary: func.documentation
          });
        }),
        name: sectionName
      };
    }),
    title: 'Extrinsics'
  });
}
/** @internal */


function addEvents(metadata) {
  return renderPage({
    description: DESC_EVENTS,
    sections: metadata.modules.sort(sortByName).filter(meta => !meta.events.isNone && meta.events.unwrap().length !== 0).map(meta => ({
      items: meta.events.unwrap().sort(sortByName).map(func => {
        const methodName = func.name.toString();
        const args = func.args.map(type => '`' + type.toString() + '`').join(', ');
        return _objectSpread({
          name: `${methodName}(${args})`
        }, func.documentation.length && {
          summary: func.documentation
        });
      }),
      name: (0, _util.stringCamelCase)(meta.name.toString())
    })),
    title: 'Events'
  });
}
/** @internal */


function addErrors(metadata) {
  return renderPage({
    description: DESC_ERRORS,
    sections: metadata.modules.sort(sortByName).filter(moduleMetadata => !moduleMetadata.errors.isEmpty).map(moduleMetadata => ({
      items: moduleMetadata.errors.sort(sortByName).map(error => _objectSpread({
        name: error.name.toString()
      }, error.documentation.length && {
        summary: error.documentation
      })),
      name: (0, _util.stringLowerFirst)(moduleMetadata.name.toString())
    })),
    title: 'Errors'
  });
}
/** @internal */


function writeFile(name, ...chunks) {
  const writeStream = _fs.default.createWriteStream(name, {
    encoding: 'utf8',
    flags: 'w'
  });

  writeStream.on('finish', () => {
    console.log(`Completed writing ${name}`);
  });
  chunks.forEach(chunk => {
    writeStream.write(chunk);
  });
  writeStream.end();
}

function main() {
  const registry = new _create.TypeRegistry();
  const metadata = new _Decorated.default(registry, _static.default).metadata.asLatest;
  writeFile('docs/substrate/rpc.md', addRpc());
  writeFile('docs/substrate/constants.md', addConstants(metadata));
  writeFile('docs/substrate/storage.md', addStorage(metadata));
  writeFile('docs/substrate/extrinsics.md', addExtrinsics(metadata));
  writeFile('docs/substrate/events.md', addEvents(metadata));
  writeFile('docs/substrate/errors.md', addErrors(metadata));
}