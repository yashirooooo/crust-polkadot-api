"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sqrtElectorate = sqrtElectorate;

var _operators = require("rxjs/operators");

var _util = require("@polkadot/util");

var _util2 = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function sqrtElectorate(instanceId, api) {
  return (0, _util2.memo)(instanceId, () => api.query.balances.totalIssuance().pipe((0, _operators.map)(totalIssuance => (0, _util.bnSqrt)(totalIssuance))));
}