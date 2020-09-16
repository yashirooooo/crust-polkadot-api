"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.member = member;

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @description Get the member info for a society
 */
function member(instanceId, api) {
  return (0, _util.memo)(instanceId, accountId => api.queryMulti([[api.query.society.payouts, accountId], [api.query.society.strikes, accountId], [api.query.society.defenderVotes, accountId], [api.query.society.suspendedMembers, accountId], [api.query.society.vouching, accountId]]).pipe((0, _operators.map)(([payouts, strikes, defenderVotes, suspended, vouching]) => ({
    accountId,
    isSuspended: suspended.isTrue,
    payouts,
    strikes,
    vote: defenderVotes.unwrapOr(undefined),
    vouching: vouching.unwrapOr(undefined)
  }))));
}