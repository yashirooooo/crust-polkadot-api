"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locks = locks;

var _bn = _interopRequireDefault(require("bn.js"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("@polkadot/util");

var _util2 = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const LOCKUPS = [0, 1, 2, 4, 8, 16, 32];
const ZERO = new _bn.default(0);

function parseLock(api, [referendumId, accountVote], referendum) {
  const {
    balance,
    vote
  } = accountVote.asStandard;
  let unlockAt = ZERO;
  let referendumEnd = ZERO;

  if (referendum.isFinished) {
    const {
      approved,
      end
    } = referendum.asFinished;
    referendumEnd = end;

    if (approved.isTrue && vote.isAye || approved.isFalse && vote.isNay) {
      unlockAt = end.add(api.consts.democracy.enactmentPeriod.muln(LOCKUPS[vote.conviction.index]));
    }
  }

  return {
    balance,
    isDelegated: false,
    isFinished: referendum.isFinished,
    referendumEnd,
    referendumId,
    unlockAt,
    vote
  };
}

function delegateLocks(api, {
  balance,
  conviction,
  target
}) {
  return api.derive.democracy.locks(target).pipe((0, _operators.map)(available => available.map(({
    isFinished,
    referendumEnd,
    referendumId,
    unlockAt,
    vote
  }) => ({
    balance,
    isDelegated: true,
    isFinished,
    referendumEnd,
    referendumId,
    unlockAt: unlockAt.isZero() ? unlockAt : referendumEnd.add(api.consts.democracy.enactmentPeriod.muln(LOCKUPS[conviction.index])),
    vote: api.registry.createType('Vote', {
      aye: vote.isAye,
      conviction
    })
  }))));
}

function directLocks(api, {
  votes
}) {
  if (!votes.length) {
    return (0, _rxjs.of)([]);
  }

  return api.query.democracy.referendumInfoOf.multi(votes.map(([referendumId]) => referendumId)).pipe((0, _operators.map)(referendums => votes.map((vote, index) => [vote, referendums[index].unwrapOr(null)]).filter(item => !!item[1] && (0, _util.isUndefined)(item[1].end) && item[0][1].isStandard).map(([directVote, referendum]) => parseLock(api, directVote, referendum))));
}

function locks(instanceId, api) {
  return (0, _util2.memo)(instanceId, accountId => api.query.democracy.votingOf(accountId).pipe((0, _operators.switchMap)(voting => voting.isDirect ? directLocks(api, voting.asDirect) : voting.isDelegating ? delegateLocks(api, voting.asDelegating) : (0, _rxjs.of)([]))));
}