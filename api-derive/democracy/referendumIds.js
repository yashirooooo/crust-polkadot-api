"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.referendumIds = referendumIds;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function referendumIds(instanceId, api) {
  return (0, _util.memo)(instanceId, () => {
    var _api$query$democracy;

    return ((_api$query$democracy = api.query.democracy) === null || _api$query$democracy === void 0 ? void 0 : _api$query$democracy.lowestUnbaked) ? api.queryMulti([api.query.democracy.lowestUnbaked, api.query.democracy.referendumCount]).pipe((0, _operators.map)(([first, total]) => total.gt(first) // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ? [...Array(total.sub(first).toNumber())].map((_, i) => first.addn(i)) : [])) : (0, _rxjs.of)([]);
  });
}