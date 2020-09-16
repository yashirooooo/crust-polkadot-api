"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _centrifugeChain = _interopRequireDefault(require("./centrifuge-chain"));

var _kusama = _interopRequireDefault(require("./kusama"));

var _polkadot = _interopRequireDefault(require("./polkadot"));

var _rococo = _interopRequireDefault(require("./rococo"));

var _westend = _interopRequireDefault(require("./westend"));

// Copyright 2017-2020 @polkadot/types-known authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// Type overrides for specific spec types & versions as given in runtimeVersion
const typesSpec = {
  'centrifuge-chain': _centrifugeChain.default,
  kusama: _kusama.default,
  polkadot: _polkadot.default,
  rococo: _rococo.default,
  westend: _westend.default
};
var _default = typesSpec;
exports.default = _default;