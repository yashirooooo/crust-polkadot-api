"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Struct = _interopRequireDefault(require("../../codec/Struct"));

var _util = require("../util");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name GenericExtrinsicPayloadV2
 * @description
 * A signing payload for an [[Extrinsic]]. For the final encoding, it is variable length based
 * on the contents included
 */
class ExtrinsicPayloadV2 extends _Struct.default {
  constructor(registry, value) {
    super(registry, {
      method: 'Bytes',
      // eslint-disable-next-line sort-keys
      era: 'ExtrinsicEra',
      nonce: 'Compact<Index>',
      tip: 'Compact<Balance>',
      // eslint-disable-next-line sort-keys
      blockHash: 'Hash'
    }, value);
  }
  /**
   * @description The block [[Hash]] the signature applies to (mortal/immortal)
   */


  get blockHash() {
    return this.get('blockHash');
  }
  /**
   * @description The [[ExtrinsicEra]]
   */


  get era() {
    return this.get('era');
  }
  /**
   * @description The [[Bytes]] contained in the payload
   */


  get method() {
    return this.get('method');
  }
  /**
   * @description The [[Index]]
   */


  get nonce() {
    return this.get('nonce');
  }
  /**
   * @description The tip [[Balance]]
   */


  get tip() {
    return this.get('tip');
  }
  /**
   * @description Sign the payload with the keypair
   */


  sign(signerPair) {
    return (0, _util.sign)(this.registry, signerPair, this.toU8a({
      method: true
    }));
  }

}

exports.default = ExtrinsicPayloadV2;