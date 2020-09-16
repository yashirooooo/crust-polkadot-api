"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

var _U8aFixed = _interopRequireDefault(require("../codec/U8aFixed"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/** @internal */
function decodeAccountId(value) {
  if ((0, _util.isU8a)(value) || Array.isArray(value)) {
    return (0, _util.u8aToU8a)(value);
  } else if ((0, _util.isHex)(value) || (0, _utilCrypto.isEthereumAddress)(value)) {
    return (0, _util.hexToU8a)(value.toString());
  } else if ((0, _util.isString)(value)) {
    return (0, _util.u8aToU8a)(value.toString());
  }

  return value;
}
/**
 * @name EthereumAccountId
 * @description
 * A wrapper around an Ethereum-compatible AccountId. Since we are dealing with
 * underlying addresses (20 bytes in length), we extend from U8aFixed which is
 * just a Uint8Array wrapper with a fixed length.
 */


class AccountId extends _U8aFixed.default {
  constructor(registry, value = new Uint8Array()) {
    super(registry, decodeAccountId(value), 160);
  }

  static encode(value) {
    return (0, _utilCrypto.ethereumEncode)(value);
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */


  eq(other) {
    return super.eq(decodeAccountId(other));
  }
  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */


  toHuman() {
    return this.toJSON();
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */


  toJSON() {
    return this.toString();
  }
  /**
   * @description Returns the string representation of the value
   */


  toString() {
    return AccountId.encode(this);
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return 'AccountId';
  }

}

exports.default = AccountId;