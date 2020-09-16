"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UInt = _interopRequireDefault(require("../codec/UInt"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name U64
 * @description
 * A 64-bit unsigned integer
 */
class U64 extends _UInt.default.with(64) {}

exports.default = U64;