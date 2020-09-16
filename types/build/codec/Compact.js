"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _util = require("@polkadot/util");

var _defaults = require("@polkadot/util/compact/defaults");

var _typeToConstructor = _interopRequireDefault(require("./utils/typeToConstructor"));

var _Raw = _interopRequireDefault(require("./Raw"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var _Type = (0, _classPrivateFieldLooseKey2.default)("Type");

var _raw = (0, _classPrivateFieldLooseKey2.default)("raw");

/**
 * @name Compact
 * @description
 * A compact length-encoding codec wrapper. It performs the same function as Length, however
 * differs in that it uses a variable number of bytes to do the actual encoding. This is mostly
 * used by other types to add length-prefixed encoding, or in the case of wrapped types, taking
 * a number and making the compact representation thereof
 */
class Compact {
  constructor(registry, Type, value = 0) {
    this.registry = void 0;
    Object.defineProperty(this, _Type, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _raw, {
      writable: true,
      value: void 0
    });
    this.registry = registry;
    (0, _classPrivateFieldLooseBase2.default)(this, _Type)[_Type] = (0, _typeToConstructor.default)(registry, Type);
    (0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw] = Compact.decodeCompact(registry, (0, _classPrivateFieldLooseBase2.default)(this, _Type)[_Type], value);
  }

  static with(Type) {
    return class extends Compact {
      constructor(registry, value) {
        super(registry, Type, value);
      }

    };
  }
  /**
   * Prepend a Uint8Array with its compact length.
   *
   * @param u8a - The Uint8Array to be prefixed
   */


  static stripLengthPrefix(u8a, bitLength = _defaults.DEFAULT_BITLENGTH) {
    const [, value] = (0, _util.compactStripLength)(u8a, bitLength);
    return value;
  }
  /** @internal */


  static decodeCompact(registry, Type, value) {
    if (value instanceof Compact) {
      return new Type(registry, (0, _classPrivateFieldLooseBase2.default)(value, _raw)[_raw]);
    } else if ((0, _util.isString)(value) || (0, _util.isNumber)(value) || (0, _util.isBn)(value) || (0, _util.isBigInt)(value)) {
      return new Type(registry, value);
    }

    const [, _value] = Compact.decodeU8a(value, new Type(registry, 0).bitLength());
    return new Type(registry, _value);
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    return this.toU8a().length;
  }
  /**
   * @description returns a hash of the contents
   */


  get hash() {
    return new _Raw.default(this.registry, this.registry.hash(this.toU8a()));
  }
  /**
   * @description Checks if the value is an empty value
   */


  get isEmpty() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw].isEmpty;
  }
  /**
   * @description Returns the number of bits in the value
   */


  bitLength() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw].bitLength();
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */


  eq(other) {
    return (0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw].eq(other instanceof Compact ? (0, _classPrivateFieldLooseBase2.default)(other, _raw)[_raw] : other);
  }
  /**
   * @description Returns a BigInt representation of the number
   */


  toBigInt() {
    return BigInt(this.toString());
  }
  /**
   * @description Returns the BN representation of the number
   */


  toBn() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw].toBn();
  }
  /**
   * @description Returns a hex string representation of the value. isLe returns a LE (number-only) representation
   */


  toHex(isLe) {
    return (0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw].toHex(isLe);
  }
  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */


  toHuman(isExtended) {
    return (0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw].toHuman(isExtended);
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */


  toJSON() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw].toJSON();
  }
  /**
   * @description Returns the number representation for the value
   */


  toNumber() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw].toNumber();
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return `Compact<${this.registry.getClassName((0, _classPrivateFieldLooseBase2.default)(this, _Type)[_Type]) || (0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw].toRawType()}>`;
  }
  /**
   * @description Returns the string representation of the value
   */


  toString() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw].toString();
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  toU8a(isBare) {
    return Compact.encodeU8a((0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw].toBn());
  }
  /**
   * @description Returns the embedded [[UInt]] or [[Moment]] value
   */


  unwrap() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _raw)[_raw];
  }

}

exports.default = Compact;
Compact.addLengthPrefix = _util.compactAddLength;
Compact.decodeU8a = _util.compactFromU8a;
Compact.encodeU8a = _util.compactToU8a;