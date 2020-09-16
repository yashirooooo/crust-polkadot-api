"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Struct = _interopRequireDefault(require("../../codec/Struct"));

var _constants = require("../constants");

var _ExtrinsicPayload = _interopRequireDefault(require("./ExtrinsicPayload"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name GenericExtrinsicSignatureV1
 * @description
 * A container for the [[Signature]] associated with a specific [[Extrinsic]]
 */
class ExtrinsicSignatureV1 extends _Struct.default {
  // Signature Information.
  //   1/3/5/9/33 bytes: The signing account identity, in Address format
  //   64 bytes: The sr25519/ed25519 signature of the Signing Payload
  //   1-8 bytes: The Compact<Nonce> of the signing account
  //   1/2 bytes: The Transaction Era
  constructor(registry, value, {
    isSigned
  } = {}) {
    super(registry, {
      signer: 'Address',
      // eslint-disable-next-line sort-keys
      signature: 'Signature',
      // eslint-disable-next-line sort-keys
      nonce: 'Compact<Index>',
      // eslint-disable-next-line sort-keys
      era: 'ExtrinsicEra'
    }, ExtrinsicSignatureV1.decodeExtrinsicSignature(value, isSigned));
  }
  /** @internal */


  static decodeExtrinsicSignature(value, isSigned = false) {
    if (!value) {
      return _constants.EMPTY_U8A;
    } else if (value instanceof ExtrinsicSignatureV1) {
      return value;
    }

    return isSigned ? value : _constants.EMPTY_U8A;
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    return this.isSigned ? super.encodedLength : 0;
  }
  /**
   * @description `true` if the signature is valid
   */


  get isSigned() {
    return !this.signature.isEmpty;
  }
  /**
   * @description The [[ExtrinsicEra]] (mortal or immortal) this signature applies to
   */


  get era() {
    return this.get('era');
  }
  /**
   * @description The [[Index]] for the signature
   */


  get nonce() {
    return this.get('nonce');
  }
  /**
   * @description The actual [[Signature]] hash
   */


  get signature() {
    return this.get('signature');
  }
  /**
   * @description The [[Address]] that signed
   */


  get signer() {
    return this.get('signer');
  }
  /**
   * @description Forwards compat
   */


  get tip() {
    return this.registry.createType('Compact<Balance>', 0);
  }

  _injectSignature(signer, signature, {
    era,
    nonce
  }) {
    this.set('era', era);
    this.set('nonce', nonce);
    this.set('signer', signer);
    this.set('signature', signature);
    return this;
  }
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
    nonce
  }) {
    return new _ExtrinsicPayload.default(this.registry, {
      blockHash,
      era: era || _constants.IMMORTAL_ERA,
      genesisHash,
      method: method.toHex(),
      nonce,
      // unused for v1, added for compat
      specVersion: 0,
      tip: 0,
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
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */


  toU8a(isBare) {
    return this.isSigned ? super.toU8a(isBare) : _constants.EMPTY_U8A;
  }

}

exports.default = ExtrinsicSignatureV1;