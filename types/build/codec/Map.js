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

var _compareMap = _interopRequireDefault(require("./utils/compareMap"));

var _decodeU8a = _interopRequireDefault(require("./utils/decodeU8a"));

var _typeToConstructor = _interopRequireDefault(require("./utils/typeToConstructor"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/** @internal */
function decodeMapFromU8a(registry, KeyClass, ValClass, u8a) {
  const output = new Map();

  const [offset, length] = _Compact.default.decodeU8a(u8a);

  const types = [];

  for (let i = 0; i < length.toNumber(); i++) {
    types.push(KeyClass, ValClass);
  }

  const values = (0, _decodeU8a.default)(registry, u8a.subarray(offset), types);

  for (let i = 0; i < values.length; i += 2) {
    output.set(values[i], values[i + 1]);
  }

  return output;
}
/** @internal */


function decodeMapFromMap(registry, KeyClass, ValClass, value) {
  const output = new Map();
  value.forEach((val, key) => {
    try {
      output.set(key instanceof KeyClass ? key : new KeyClass(registry, key), val instanceof ValClass ? val : new ValClass(registry, val));
    } catch (error) {
      console.error('Failed to decode Map key or value:', error.message);
      throw error;
    }
  });
  return output;
}
/**
 * Decode input to pass into constructor.
 *
 * @param KeyClass - Type of the map key
 * @param ValClass - Type of the map value
 * @param value - Value to decode, one of:
 * - null
 * - undefined
 * - hex
 * - Uint8Array
 * - Map<any, any>, where both key and value types are either
 *   constructors or decodeable values for their types.
 * @param jsonMap
 * @internal
 */


function decodeMap(registry, keyType, valType, value) {
  const KeyClass = (0, _typeToConstructor.default)(registry, keyType);
  const ValClass = (0, _typeToConstructor.default)(registry, valType);

  if (!value) {
    return new Map();
  } else if ((0, _util.isHex)(value)) {
    return decodeMap(registry, KeyClass, ValClass, (0, _util.hexToU8a)(value));
  } else if ((0, _util.isU8a)(value)) {
    return decodeMapFromU8a(registry, KeyClass, ValClass, (0, _util.u8aToU8a)(value));
  } else if (value instanceof Map) {
    return decodeMapFromMap(registry, KeyClass, ValClass, value);
  } else if ((0, _util.isObject)(value)) {
    return decodeMapFromMap(registry, KeyClass, ValClass, new Map(Object.entries(value)));
  }

  throw new Error('Map: cannot decode type');
}

var _KeyClass = (0, _classPrivateFieldLooseKey2.default)("KeyClass");

var _ValClass = (0, _classPrivateFieldLooseKey2.default)("ValClass");

var _type = (0, _classPrivateFieldLooseKey2.default)("type");

class CodecMap extends Map {
  constructor(registry, type, keyType, valType, rawValue) {
    super(decodeMap(registry, keyType, valType, rawValue));
    this.registry = void 0;
    Object.defineProperty(this, _KeyClass, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _ValClass, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _type, {
      writable: true,
      value: void 0
    });
    this.registry = registry;
    (0, _classPrivateFieldLooseBase2.default)(this, _KeyClass)[_KeyClass] = (0, _typeToConstructor.default)(registry, keyType);
    (0, _classPrivateFieldLooseBase2.default)(this, _ValClass)[_ValClass] = (0, _typeToConstructor.default)(registry, valType);
    (0, _classPrivateFieldLooseBase2.default)(this, _type)[_type] = type;
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */


  get encodedLength() {
    let len = _Compact.default.encodeU8a(this.size).length;

    this.forEach((v, k) => {
      len += v.encodedLength + k.encodedLength;
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
    return (0, _compareMap.default)(this, other);
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
    const json = {};
    this.forEach((v, k) => {
      json[k.toString()] = v.toHuman(isExtended);
    });
    return json;
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */


  toJSON() {
    const json = {};
    this.forEach((v, k) => {
      json[k.toString()] = v.toJSON();
    });
    return json;
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return `${(0, _classPrivateFieldLooseBase2.default)(this, _type)[_type]}<${this.registry.getClassName((0, _classPrivateFieldLooseBase2.default)(this, _KeyClass)[_KeyClass]) || new ((0, _classPrivateFieldLooseBase2.default)(this, _KeyClass)[_KeyClass])(this.registry).toRawType()},${this.registry.getClassName((0, _classPrivateFieldLooseBase2.default)(this, _ValClass)[_ValClass]) || new ((0, _classPrivateFieldLooseBase2.default)(this, _ValClass)[_ValClass])(this.registry).toRawType()}>`;
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

    this.forEach((v, k) => {
      encoded.push(k.toU8a(isBare), v.toU8a(isBare));
    });
    return (0, _util.u8aConcat)(...encoded);
  }

}

exports.default = CodecMap;