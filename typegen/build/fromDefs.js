"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = main;

var _path = _interopRequireDefault(require("path"));

var _yargs = _interopRequireDefault(require("yargs"));

var substrateDefs = _interopRequireWildcard(require("@polkadot/types/interfaces/definitions"));

var _interfaceRegistry = require("./generate/interfaceRegistry");

var _tsDef = require("./generate/tsDef");

// Copyright 2017-2020 @polkadot/typegen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function main() {
  const {
    input,
    package: pkg
  } = _yargs.default.strict().options({
    input: {
      description: 'The directory to use for the user definitions',
      required: true,
      type: 'string'
    },
    package: {
      description: 'The package name & path to use for the user types',
      required: true,
      type: 'string'
    }
  }).argv; // eslint-disable-next-line @typescript-eslint/no-var-requires


  const userDefs = require(_path.default.join(process.cwd(), input, 'definitions.ts'));

  const userKeys = Object.keys(userDefs);
  const filteredBase = Object.entries(substrateDefs).filter(([key]) => {
    if (userKeys.includes(key)) {
      console.warn(`Override found for ${key} in user types, ignoring in @polkadot/types`);
      return false;
    }

    return true;
  }).reduce((defs, [key, value]) => {
    defs[key] = value;
    return defs;
  }, {});
  const allDefs = {
    '@polkadot/types/interfaces': filteredBase,
    [pkg]: userDefs
  };
  (0, _tsDef.generateTsDef)(allDefs, _path.default.join(process.cwd(), input), pkg);
  (0, _interfaceRegistry.generateInterfaceTypes)(allDefs, _path.default.join(process.cwd(), input, 'augment-types.ts'));
}