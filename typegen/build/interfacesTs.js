"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = main;

var _consts = _interopRequireDefault(require("./generate/consts"));

var _interfaceRegistry = _interopRequireDefault(require("./generate/interfaceRegistry"));

var _query = _interopRequireDefault(require("./generate/query"));

var _rpc = _interopRequireDefault(require("./generate/rpc"));

var _tsDef = _interopRequireDefault(require("./generate/tsDef"));

var _tx = _interopRequireDefault(require("./generate/tx"));

// Copyright 2017-2020 @polkadot/typegen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function main() {
  (0, _interfaceRegistry.default)();
  (0, _consts.default)();
  (0, _query.default)();
  (0, _tx.default)();
  (0, _rpc.default)();
  (0, _tsDef.default)();
}