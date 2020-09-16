"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preimages = preimages;

var _operators = require("rxjs/operators");

var _util = require("../util");

var _util2 = require("./util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function preimages(instanceId, api) {
  return (0, _util.memo)(instanceId, hashes => api.query.democracy.preimages.multi(hashes).pipe((0, _operators.map)(images => images.map(imageOpt => (0, _util2.parseImage)(api, imageOpt)))));
}