"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _util = require("@polkadot/util");

var _Compact = _interopRequireDefault(require("./Compact"));

var _Raw = _interopRequireDefault(require("./Raw"));

var _utils = require("./utils");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/** @internal */
function decodeSetFromU8a(registry, ValClass, u8a) {
  const output = new Set();

  const [offset, length] = _Compact.default.decodeU8a(u8a);

  const types = [];

  for (let i = 0; i < length.toNumber(); i++) {
    types.push(ValClass);
  }

  const values = (0, _utils.decodeU8a)(registry, u8a.subarray(offset), types);

  for (let i = 0; i < values.length; i++) {
    output.add(values[i]);
  }

  return output;
}
/** @internal */


function decodeSetFromSet(registry, ValClass, value) {
  const output = new Set();
  value.forEach(val => {
    try {
      output.add(val instanceof ValClass ? val : new ValClass(registry, val));
    } catch (error) {
      console.error('Failed to decode BTreeSet key or value:', error.message);
      throw error;
    }
  });
  return output;
}
/**
 * Decode input to pass into constructor.
 *
 * @param ValClass - Type of the map value
 * @param value - Value to decode, one of:
 * - null
 * - undefined
 * - hex
 * - Uint8Array
 * - Set<any>, where both key and value types are either
 *   constructors or decodeable values for their types.
 * @param jsonSet
 * @internal
 */


function decodeSet(registry, valType, value) {
  if (!value) {
    return new Set();
  }

  const ValClass = (0, _utils.typeToConstructor)(registry, valType);

  if ((0, _util.isHex)(value)) {
    return decodeSet(registry, ValClass, (0, _util.hexToU8a)(value));
  } else if ((0, _util.isU8a)(value)) {
    return decodeSetFromU8a(registry, ValClass, (0, _util.u8aToU8a)(value));
  } else if (Array.isArray(value) || value instanceof Set) {
    return decodeSetFromSet(registry, ValClass, value);
  }

  throw new Error('BTreeSet: cannot decode type');
}

var _ValClass = (0, _classPrivateFieldLooseKey2.default)("ValClass");

class BTreeSet extends Set {
  constructor(registry, valType, rawValue) {
    super(decodeSet(registry, valType, rawValue));
    this.registry = void 0;
    Object.defineProperty(this, _ValClass, {
      writable: true,
      value: void 0
    });
    this.registry = registry;
    (0, _classPrivateFieldLooseBase2.default)(this, _ValClass)[_ValClass] = (0, _utils.typeToConstructor)(registry, valType);
  }

  static with(valType) {
    return class extends BTreeSet {
      constructor(registry, value) {
        super(registry, valType, value);
      }

    };
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    let len = _Compact.default.encodeU8a(this.size).length;

    this.forEach(v => {
      len += v.encodedLength;
    });
    return len;
  }
  /**
   * @description Returns a hash of the value
   */


  get hash() {
    return new _Raw.default(this.registry, this.registry.hash(this.toU8a()));
  }
  /**
   * @description Checks if the value is an empty value
   */


  get isEmpty() {
    return this.size === 0;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */


  eq(other) {
    return (0, _utils.compareSet)(this, other);
  }
  /**
   * @description Returns a hex string representation of the value. isLe returns a LE (number-only) representation
   */


  toHex() {
    return (0, _util.u8aToHex)(this.toU8a());
  }
  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */


  toHuman(isExtended) {
    const json = [];
    this.forEach(v => {
      json.push(v.toHuman(isExtended));
    });
    return json;
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */


  toJSON() {
    const json = [];
    this.forEach(v => {
      json.push(v.toJSON());
    });
    return json;
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return `BTreeSet<${this.registry.getClassName((0, _classPrivateFieldLooseBase2.default)(this, _ValClass)[_ValClass]) || new ((0, _classPrivateFieldLooseBase2.default)(this, _ValClass)[_ValClass])(this.registry).toRawType()}>`;
  }
  /**
   * @description Returns the string representation of the value
   */


  toString() {
    return JSON.stringify(this.toJSON());
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */


  toU8a(isBare) {
    const encoded = new Array();

    if (!isBare) {
      encoded.push(_Compact.default.encodeU8a(this.size));
    }

    this.forEach(v => {
      encoded.push(v.toU8a(isBare));
    });
    return (0, _util.u8aConcat)(...encoded);
  }

}

exports.default = BTreeSet;