"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bn = _interopRequireDefault(require("bn.js"));

var _util = require("@polkadot/util");

var _kusama = _interopRequireDefault(require("./kusama"));

var _polkadot = _interopRequireDefault(require("./polkadot"));

var _westend = _interopRequireDefault(require("./westend"));

// Copyright 2017-2020 @polkadot/types-known authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function rawToFinal({
  genesisHash,
  versions
}) {
  return {
    genesisHash: (0, _util.hexToU8a)(genesisHash),
    versions: versions.map(([blockNumber, specVersion]) => ({
      blockNumber: new _bn.default(blockNumber),
      specVersion: new _bn.default(specVersion)
    }))
  };
} // Type overrides for specific spec types & versions as given in runtimeVersion


const upgrades = [rawToFinal(_kusama.default), rawToFinal(_polkadot.default), rawToFinal(_westend.default)];
var _default = upgrades;
exports.default = _default;