"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compareSet;

var _util = require("@polkadot/util");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function compareSetArray(a, b) {
  // equal number of entries and each entry in the array should match
  return a.size === b.length && !b.some(entry => !a.has(entry));
} // NOTE These are used internally and when comparing objects, expects that
// when the second is an Set<string, Codec> that the first has to be as well


function compareSet(a, b) {
  if (Array.isArray(b)) {
    return compareSetArray(a, b);
  } else if (b instanceof Set) {
    return compareSetArray(a, [...b.values()]);
  } else if ((0, _util.isObject)(b)) {
    return compareSetArray(a, Object.values(b));
  }

  return false;
}