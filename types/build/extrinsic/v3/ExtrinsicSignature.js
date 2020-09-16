"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("../constants");

var _ExtrinsicSignature = _interopRequireDefault(require("../v2/ExtrinsicSignature"));

var _ExtrinsicPayload = _interopRequireDefault(require("./ExtrinsicPayload"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name GenericExtrinsicSignatureV3
 * @description
 * A container for the [[Signature]] associated with a specific [[Extrinsic]]
 */
class ExtrinsicSignatureV3 extends _ExtrinsicSignature.default {
  /**
   * @description Adds a raw signature
   */
  addSignature(signer, signature, payload) {
    return this._injectSignature(this.registry.createType('Address', signer), this.registry.createType('Signature', signature), new _ExtrinsicPayload.default(this.registry, payload));
  }
  /**
   * @description Creates a payload from the supplied options
   */


  createPayload(method, {
    blockHash,
    era,
    genesisHash,
    nonce,
    runtimeVersion: {
      specVersion
    },
    tip
  }) {
    return new _ExtrinsicPayload.default(this.registry, {
      blockHash,
      era: era || _constants.IMMORTAL_ERA,
      genesisHash,
      method: method.toHex(),
      nonce,
      specVersion,
      tip: tip || 0,
      transactionVersion: 0
    });
  }
  /**
   * @description Generate a payload and applies the signature from a keypair
   */


  sign(method, account, options) {
    const signer = this.registry.createType('Address', account.addressRaw);
    const payload = this.createPayload(method, options);
    const signature = this.registry.createType('Signature', payload.sign(account));
    return this._injectSignature(signer, signature, payload);
  }
  /**
   * @description Generate a payload and applies a fake signature
   */


  signFake(method, address, options) {
    const signer = this.registry.createType('Address', address);
    const payload = this.createPayload(method, options);
    const signature = this.registry.createType('Signature', new Uint8Array(64).fill(0x42));
    return this._injectSignature(signer, signature, payload);
  }

}

exports.default = ExtrinsicSignatureV3;