"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preimage = preimage;

var _operators = require("rxjs/operators");

var _util = require("../util");

var _util2 = require("./util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function preimage(instanceId, api) {
  return (0, _util.memo)(instanceId, hash => api.query.democracy.preimages(hash).pipe((0, _operators.map)(imageOpt => (0, _util2.parseImage)(api, imageOpt))));
}