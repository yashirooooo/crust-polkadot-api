"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("@polkadot/util");

var _util2 = require("../util");

// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function dataAsString(data) {
  return data.isRaw ? (0, _util.u8aToString)(data.asRaw.toU8a(true)) : data.isNone ? undefined : data.toHex();
}

function retrieveNick(api, accountId) {
  var _api$query$nicks;

  return (accountId && ((_api$query$nicks = api.query.nicks) === null || _api$query$nicks === void 0 ? void 0 : _api$query$nicks.nameOf) ? api.query.nicks.nameOf(accountId) : (0, _rxjs.of)(undefined)).pipe((0, _operators.map)(nameOf => (nameOf === null || nameOf === void 0 ? void 0 : nameOf.isSome) ? (0, _util.u8aToString)(nameOf.unwrap()[0]).substr(0, api.consts.nicks.maxLength.toNumber()) : undefined));
}

function extractIdentity(identityOfOpt, superOf) {
  if (!(identityOfOpt === null || identityOfOpt === void 0 ? void 0 : identityOfOpt.isSome)) {
    return {
      judgements: []
    };
  }

  const {
    info,
    judgements
  } = identityOfOpt.unwrap();
  const topDisplay = dataAsString(info.display);
  return {
    display: superOf ? dataAsString(superOf[1]) || topDisplay : topDisplay,
    displayParent: superOf ? topDisplay : undefined,
    email: dataAsString(info.email),
    image: dataAsString(info.image),
    judgements,
    legal: dataAsString(info.legal),
    other: info.additional.reduce((other, [_key, _value]) => {
      const key = dataAsString(_key);
      const value = dataAsString(_value);

      if (key && value) {
        other[key] = value;
      }

      return other;
    }, {}),
    parent: superOf ? superOf[0] : undefined,
    pgp: info.pgpFingerprint.isSome ? info.pgpFingerprint.unwrap().toHex() : undefined,
    riot: dataAsString(info.riot),
    twitter: dataAsString(info.twitter),
    web: dataAsString(info.web)
  };
}

function retrieveIdentity(api, accountId) {
  var _api$query$identity;

  return (accountId && ((_api$query$identity = api.query.identity) === null || _api$query$identity === void 0 ? void 0 : _api$query$identity.identityOf) ? api.queryMulti([[api.query.identity.identityOf, accountId], [api.query.identity.superOf, accountId]]) : (0, _rxjs.of)([undefined, undefined])).pipe((0, _operators.switchMap)(([identityOfOpt, superOfOpt]) => {
    if (identityOfOpt === null || identityOfOpt === void 0 ? void 0 : identityOfOpt.isSome) {
      // this identity has something set
      return (0, _rxjs.of)([identityOfOpt, undefined]);
    } else if (superOfOpt === null || superOfOpt === void 0 ? void 0 : superOfOpt.isSome) {
      const superOf = superOfOpt.unwrap(); // we have a super

      return (0, _rxjs.combineLatest)([api.query.identity.identityOf(superOf[0]), (0, _rxjs.of)(superOf)]);
    } // nothing of value returned


    return (0, _rxjs.of)([undefined, undefined]);
  }), (0, _operators.map)(([identityOfOpt, superOf]) => extractIdentity(identityOfOpt, superOf)));
}
/**
 * @name info
 * @description Returns aux. info with regards to an account, current that includes the accountId, accountIndex and nickname
 */


function info(instanceId, api) {
  return (0, _util2.memo)(instanceId, address => api.derive.accounts.idAndIndex(address).pipe((0, _operators.switchMap)(([accountId, accountIndex]) => (0, _rxjs.combineLatest)([(0, _rxjs.of)({
    accountId,
    accountIndex
  }), retrieveIdentity(api, accountId), retrieveNick(api, accountId)])), (0, _operators.map)(([{
    accountId,
    accountIndex
  }, identity, nickname]) => ({
    accountId,
    accountIndex,
    identity,
    nickname
  }))));
}