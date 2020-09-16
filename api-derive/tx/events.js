"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.events = events;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function events(instanceId, api) {
  return (0, _util.memo)(instanceId, at => (0, _rxjs.combineLatest)([api.query.system.events.at(at), api.rpc.chain.getBlock(at)]).pipe((0, _operators.map)(([events, block]) => ({
    block,
    events
  }))));
}