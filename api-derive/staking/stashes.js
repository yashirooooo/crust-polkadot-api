"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stashes = stashes;

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @description Retrieve the list of all validator stashes
 */
function stashes(instanceId, api) {
  return (0, _util.memo)(instanceId, () => api.query.staking.validators.creator.meta.type.asMap.linked.isTrue ? api.query.staking.validators().pipe((0, _operators.map)(([stashIds]) => stashIds)) : api.query.staking.validators.keys().pipe((0, _operators.map)(keys => keys.map(key => key.args[0]))));
}