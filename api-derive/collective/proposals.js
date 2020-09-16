"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proposals = proposals;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("@polkadot/util");

var _util2 = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function parse([hashes, proposals, votes]) {
  return proposals.map((proposalOpt, index) => proposalOpt.isSome ? {
    hash: hashes[index],
    proposal: proposalOpt.unwrap(),
    votes: votes[index].unwrapOr(null)
  } : null).filter(proposal => !!proposal);
}

function proposals(instanceId, api, section) {
  return (0, _util2.memo)(instanceId, () => {
    var _api$query$section;

    return (0, _util.isFunction)((_api$query$section = api.query[section]) === null || _api$query$section === void 0 ? void 0 : _api$query$section.proposals) ? api.query[section].proposals().pipe((0, _operators.switchMap)(hashes => hashes.length ? (0, _rxjs.combineLatest)([(0, _rxjs.of)(hashes), api.query[section].proposalOf.multi(hashes), api.query[section].voting.multi(hashes)]) : (0, _rxjs.of)([[], [], []])), (0, _operators.map)(parse)) : (0, _rxjs.of)([]);
  });
}