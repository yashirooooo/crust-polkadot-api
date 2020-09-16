"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memo = memo;

var _memoizee = _interopRequireDefault(require("memoizee"));

var _rxjs = require("rxjs");

var _rxjs2 = require("@polkadot/rpc-core/rxjs");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.v
// Wraps a derive, doing 2 things to optimize calls -
//   1. creates a memo of the inner fn -> Observable, removing when unsubscribed
//   2. wraps the observable in a drr() (which includes an unsub delay)

/** @internal */
function memo(instanceId, inner) {
  const cached = (0, _memoizee.default)((...params) => new _rxjs.Observable(observer => {
    const subscription = inner(...params).subscribe(observer);
    return () => {
      cached.delete(...params);
      subscription.unsubscribe();
    };
  }).pipe((0, _rxjs2.drr)()), {
    // Normalize via JSON.stringify, allow e.g. AccountId -> ss58
    // eslint-disable-next-line @typescript-eslint/unbound-method
    normalizer: args => instanceId + JSON.stringify(args)
  });
  return cached;
}