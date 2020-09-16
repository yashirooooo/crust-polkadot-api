"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCompactEncodable = isCompactEncodable;

var _UInt = _interopRequireDefault(require("@polkadot/types/codec/UInt"));

var _util = require("@polkadot/util");

// Copyright 2017-2020 @polkadot/typegen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/** @internal */
function isCompactEncodable(Child) {
  return (0, _util.isChildClass)(_UInt.default, Child);
}