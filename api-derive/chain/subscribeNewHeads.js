"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeNewHeads = subscribeNewHeads;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _type = require("../type");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name subscribeNewHeads
 * @returns An array containing the block header and the block author
 * @description An observable of the current block header and it's author
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.chain.subscribeNewHeads((header) => {
 *   console.log(`block #${header.number} was authored by ${header.author}`);
 * });
 * ```
 */
function subscribeNewHeads(instanceId, api) {
  return (0, _util.memo)(instanceId, () => (0, _rxjs.combineLatest)([api.rpc.chain.subscribeNewHeads(), api.query.session ? api.query.session.validators() : (0, _rxjs.of)([])]).pipe((0, _operators.map)(([header, validators]) => new _type.HeaderExtended(api.registry, header, validators))));
}