"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signingInfo = signingInfo;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("@polkadot/util");

var _constants = require("./constants");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function latestNonce(api, address) {
  return api.derive.balances.account(address).pipe((0, _operators.map)(({
    accountNonce
  }) => accountNonce));
}

function signingHeader(api) {
  return (0, _rxjs.combineLatest)([api.rpc.chain.getHeader(), api.rpc.chain.getFinalizedHead().pipe((0, _operators.switchMap)(hash => api.rpc.chain.getHeader(hash)))]).pipe((0, _operators.map)(([current, finalized]) => // determine the hash to use, current when lag > max, else finalized
  current.number.unwrap().sub(finalized.number.unwrap()).gt(_constants.MAX_FINALITY_LAG) ? current : finalized));
}

function signingInfo(_instanceId, api) {
  // no memo, we want to do this fresh on each run
  return (address, nonce, era) => (0, _rxjs.combineLatest)([// retrieve nonce if none was specified
  (0, _util.isUndefined)(nonce) ? latestNonce(api, address) : (0, _rxjs.of)(api.registry.createType('Index', nonce)), // if no era (create) or era > 0 (mortal), do block retrieval
  (0, _util.isUndefined)(era) || (0, _util.isNumber)(era) && era > 0 ? signingHeader(api) : (0, _rxjs.of)(null)]).pipe((0, _operators.map)(([nonce, header]) => {
    var _api$consts$babe, _api$consts$timestamp;

    return {
      header,
      mortalLength: _constants.MORTAL_PERIOD.div(((_api$consts$babe = api.consts.babe) === null || _api$consts$babe === void 0 ? void 0 : _api$consts$babe.expectedBlockTime) || ((_api$consts$timestamp = api.consts.timestamp) === null || _api$consts$timestamp === void 0 ? void 0 : _api$consts$timestamp.minimumPeriod.muln(2)) || _constants.FALLBACK_PERIOD).iadd(_constants.MAX_FINALITY_LAG).toNumber(),
      nonce
    };
  }));
}