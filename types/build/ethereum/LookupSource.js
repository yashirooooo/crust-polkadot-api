"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ACCOUNT_ID_PREFIX = void 0;

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

var _Base = _interopRequireDefault(require("../codec/Base"));

var _AccountIndex = _interopRequireDefault(require("../generic/AccountIndex"));

var _AccountId = _interopRequireDefault(require("./AccountId"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const ACCOUNT_ID_PREFIX = new Uint8Array([0xff]);
/** @internal */

exports.ACCOUNT_ID_PREFIX = ACCOUNT_ID_PREFIX;

function decodeString(registry, value) {
  const decoded = (0, _utilCrypto.decodeAddress)(value);
  return decoded.length === 20 ? registry.createType('EthereumAccountId', decoded) : registry.createType('AccountIndex', (0, _util.u8aToBn)(decoded, true));
}
/** @internal */


function decodeU8a(registry, value) {
  // This allows us to instantiate an address with a raw publicKey. Do this first before
  // we checking the first byte, otherwise we may split an already-existent valid address
  if (value.length === 20) {
    return registry.createType('EthereumAccountId', value);
  } else if (value[0] === 0xff) {
    return registry.createType('EthereumAccountId', value.subarray(1));
  }

  const [offset, length] = _AccountIndex.default.readLength(value);

  return registry.createType('AccountIndex', (0, _util.u8aToBn)(value.subarray(offset, offset + length), true));
}
/**
 * @name LookupSource
 * @description
 * A wrapper around an EthereumAccountId and/or AccountIndex that is encoded with a prefix.
 * Since we are dealing with underlying publicKeys (or shorter encoded addresses),
 * we extend from Base with an AccountId/AccountIndex wrapper. Basically the Address
 * is encoded as `[ <prefix-byte>, ...publicKey/...bytes ]` as per spec
 */


class LookupSource extends _Base.default {
  constructor(registry, value = new Uint8Array()) {
    super(registry, LookupSource._decodeAddress(registry, value));
  }
  /** @internal */


  static _decodeAddress(registry, value) {
    if (value instanceof _AccountId.default || value instanceof _AccountIndex.default) {
      return value;
    } else if (value instanceof LookupSource) {
      return value._raw;
    } else if ((0, _util.isBn)(value) || (0, _util.isNumber)(value)) {
      return registry.createType('AccountIndex', value);
    } else if (Array.isArray(value) || (0, _util.isHex)(value) || (0, _util.isU8a)(value)) {
      return decodeU8a(registry, (0, _util.u8aToU8a)(value));
    }

    return decodeString(registry, value);
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    const rawLength = this._rawLength;
    return rawLength + ( // for 1 byte AccountIndexes, we are not adding a specific prefix
    rawLength > 1 ? 1 : 0);
  }
  /**
   * @description The length of the raw value, either AccountIndex or AccountId
   */


  get _rawLength() {
    return this._raw instanceof _AccountIndex.default ? _AccountIndex.default.calcLength(this._raw) : this._raw.encodedLength;
  }
  /**
   * @description Returns a hex string representation of the value
   */


  toHex() {
    return (0, _util.u8aToHex)(this.toU8a());
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return 'Address';
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */


  toU8a(isBare) {
    const encoded = this._raw.toU8a().subarray(0, this._rawLength);

    return isBare ? encoded : (0, _util.u8aConcat)(this._raw instanceof _AccountIndex.default ? _AccountIndex.default.writeLength(encoded) : ACCOUNT_ID_PREFIX, encoded);
  }

}

exports.default = LookupSource;