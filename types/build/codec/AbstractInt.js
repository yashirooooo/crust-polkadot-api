"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DEFAULT_UINT_BITS = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _bn = _interopRequireDefault(require("bn.js"));

var _util = require("@polkadot/util");

var _Raw = _interopRequireDefault(require("./Raw"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const DEFAULT_UINT_BITS = 64;
exports.DEFAULT_UINT_BITS = DEFAULT_UINT_BITS;
const PER_B = new _bn.default(1000000000);
const PER_M = new _bn.default(1000000);
const MUL_P = new _bn.default(10000);

function toPercentage(value, divisor) {
  return `${(value.mul(MUL_P).div(divisor).toNumber() / 100).toFixed(2)}%`;
}
/** @internal */


function decodeAbstracIntU8a(value, bitLength, isNegative) {
  if (!value.length) {
    return '0';
  }

  try {
    // NOTE When passing u8a in (typically from decoded data), it is always Little Endian
    return (0, _util.u8aToBn)(value.subarray(0, bitLength / 8), {
      isLe: true,
      isNegative
    }).toString();
  } catch (error) {
    throw new Error(`AbstractInt: failed on ${JSON.stringify(value)}:: ${error.message}`);
  }
}
/** @internal */


function decodeAbstracInt(value, bitLength, isNegative) {
  // This function returns a string, which will be passed in the BN
  // constructor. It would be ideal to actually return a BN, but there's a
  // bug: https://github.com/indutny/bn.js/issues/206.
  if ((0, _util.isHex)(value, -1, true)) {
    return (0, _util.hexToBn)(value, {
      isLe: false,
      isNegative
    }).toString();
  } else if ((0, _util.isU8a)(value)) {
    return decodeAbstracIntU8a(value, bitLength, isNegative);
  } else if ((0, _util.isString)(value)) {
    return new _bn.default(value.toString(), 10).toString();
  }

  return (0, _util.bnToBn)(value).toString();
}
/**
 * @name AbstractInt
 * @ignore
 * @noInheritDoc
 */
// TODO:
//   - Apart from encoding/decoding we don't actually keep check on the sizes, is this good enough?


var _bitLength = (0, _classPrivateFieldLooseKey2.default)("bitLength");

var _isHexJson = (0, _classPrivateFieldLooseKey2.default)("isHexJson");

var _isSigned = (0, _classPrivateFieldLooseKey2.default)("isSigned");

class AbstractInt extends _bn.default {
  constructor(registry, isSigned, value = 0, bitLength = DEFAULT_UINT_BITS, isHexJson = true) {
    super(decodeAbstracInt(value, bitLength, isSigned));
    this.registry = void 0;
    Object.defineProperty(this, _bitLength, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _isHexJson, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _isSigned, {
      writable: true,
      value: void 0
    });
    this.registry = registry;
    (0, _classPrivateFieldLooseBase2.default)(this, _bitLength)[_bitLength] = bitLength;
    (0, _classPrivateFieldLooseBase2.default)(this, _isHexJson)[_isHexJson] = isHexJson;
    (0, _classPrivateFieldLooseBase2.default)(this, _isSigned)[_isSigned] = isSigned;
    (0, _util.assert)(isSigned || this.gte(_util.BN_ZERO), `${this.toRawType()}: Negative number passed to unsigned type`);
    (0, _util.assert)(super.bitLength() <= bitLength, `${this.toRawType()}: Input too large. Found input with ${super.bitLength()} bits, expected ${bitLength}`);
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _bitLength)[_bitLength] / 8;
  }
  /**
   * @description returns a hash of the contents
   */


  get hash() {
    return new _Raw.default(this.registry, this.registry.hash(this.toU8a()));
  }
  /**
   * @description Checks if the value is a zero value (align elsewhere)
   */


  get isEmpty() {
    return this.isZero();
  }
  /**
   * @description Checks if the value is an unsigned type
   */


  get isUnsigned() {
    return !(0, _classPrivateFieldLooseBase2.default)(this, _isSigned)[_isSigned];
  }
  /**
   * @description Returns the number of bits in the value
   */


  bitLength() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _bitLength)[_bitLength];
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any


  eq(other) {
    // Here we are actually overriding the built-in .eq to take care of both
    // number and BN inputs (no `.eqn` needed) - numbers will be converted
    return super.eq((0, _util.isHex)(other) ? (0, _util.hexToBn)(other.toString(), {
      isLe: false,
      isNegative: (0, _classPrivateFieldLooseBase2.default)(this, _isSigned)[_isSigned]
    }) : (0, _util.bnToBn)(other));
  }
  /**
   * @description True if this value is the max of the type
   */


  isMax() {
    const u8a = this.toU8a().filter(byte => byte === 0xff);
    return u8a.length === (0, _classPrivateFieldLooseBase2.default)(this, _bitLength)[_bitLength] / 8;
  }
  /**
   * @description Returns a BigInt representation of the number
   */


  toBigInt() {
    return BigInt(this.toString());
  }
  /**
   * @description Returns the BN representation of the number. (Compatibility)
   */


  toBn() {
    return this;
  }
  /**
   * @description Returns a hex string representation of the value
   */


  toHex(isLe = false) {
    // For display/JSON, this is BE, for compare, use isLe
    return (0, _util.bnToHex)(this, {
      bitLength: this.bitLength(),
      isLe,
      isNegative: !this.isUnsigned
    });
  }
  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  toHuman(isExpanded) {
    // FIXME we need proper expansion here
    return this instanceof this.registry.createClass('Balance') ? this.isMax() ? 'everything' : (0, _util.formatBalance)(this, {
      decimals: this.registry.chainDecimals,
      withSi: true,
      withUnit: this.registry.chainToken
    }) : this instanceof this.registry.createClass('Perbill') ? toPercentage(this, PER_B) : this instanceof this.registry.createClass('Permill') ? toPercentage(this, PER_M) : (0, _util.formatNumber)(this);
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */


  toJSON() {
    // FIXME this return type should by string | number, but BN's return type
    // is string.
    // Maximum allowed integer for JS is 2^53 - 1, set limit at 52
    return (0, _classPrivateFieldLooseBase2.default)(this, _isHexJson)[_isHexJson] || super.bitLength() > 52 ? this.toHex() : this.toNumber();
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    // NOTE In the case of balances, which have a special meaning on the UI
    // and can be interpreted differently, return a specific value for it so
    // underlying it always matches (no matter which length it actually is)
    return this instanceof this.registry.createClass('Balance') ? 'Balance' : `${this.isUnsigned ? 'u' : 'i'}${this.bitLength()}`;
  }
  /**
   * @description Returns the string representation of the value
   * @param base The base to use for the conversion
   */


  toString(base) {
    // only included here since we do not inherit docs
    return super.toString(base);
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  toU8a(isBare) {
    return (0, _util.bnToU8a)(this, {
      bitLength: this.bitLength(),
      isLe: true,
      isNegative: !this.isUnsigned
    });
  }

}

exports.default = AbstractInt;