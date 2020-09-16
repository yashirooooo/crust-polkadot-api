"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Struct = _interopRequireDefault(require("../../codec/Struct"));

var _util = require("../util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @name GenericExtrinsicPayloadV4
 * @description
 * A signing payload for an [[Extrinsic]]. For the final encoding, it is variable length based
 * on the contents included
 */
class ExtrinsicPayloadV4 extends _Struct.default {
  constructor(registry, value) {
    super(registry, _objectSpread(_objectSpread({
      method: 'Bytes'
    }, registry.getSignedExtensionTypes()), registry.getSignedExtensionExtra()), value);
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
   * @description The genesis [[Hash]] the signature applies to (mortal/immortal)
   */


  get genesisHash() {
    return this.get('genesisHash');
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
   * @description The specVersion for this signature
   */


  get specVersion() {
    return this.get('specVersion');
  }
  /**
   * @description The tip [[Balance]]
   */


  get tip() {
    return this.get('tip');
  }
  /**
   * @description The transactionVersion for this signature
   */


  get transactionVersion() {
    return this.get('transactionVersion');
  }
  /**
   * @description Sign the payload with the keypair
   */


  sign(signerPair) {
    // NOTE The `toU8a({ method: true })` argument is absolutely critical - we don't want the method (Bytes)
    // to have the length prefix included. This means that the data-as-signed is un-decodable,
    // but is also doesn't need the extra information, only the pure data (and is not decoded)
    // ... The same applies to V1..V3, if we have a V5, carry move this comment to latest
    return (0, _util.sign)(this.registry, signerPair, this.toU8a({
      method: true
    }), {
      withType: true
    });
  }

}

exports.default = ExtrinsicPayloadV4;