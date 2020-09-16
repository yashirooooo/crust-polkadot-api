"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Raw = _interopRequireDefault(require("./Raw"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name Base
 * @description A type extends the Base class, when it holds a value
 */
class Base {
  constructor(registry, value) {
    this.registry = void 0;
    this._raw = void 0;
    this.registry = registry;
    this._raw = value;
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
    return this._raw.isEmpty;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */


  eq(other) {
    return this._raw.eq(other);
  }
  /**
   * @description Returns a hex string representation of the value. isLe returns a LE (number-only) representation
   */


  toHex(isLe) {
    return this._raw.toHex(isLe);
  }
  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */


  toHuman(isExtended) {
    return this._raw.toHuman(isExtended);
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */


  toJSON() {
    return this._raw.toJSON();
  }
  /**
   * @description Returns the string representation of the value
   */


  toString() {
    return this._raw.toString();
  }
  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */


  toU8a(isBare) {
    return this._raw.toU8a(isBare);
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return 'Base';
  }

}

exports.default = Base;