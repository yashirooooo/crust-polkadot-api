"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("@polkadot/util");

var _Raw = _interopRequireDefault(require("./Raw"));

var _utils = require("./utils");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/** @internal */
function decodeJson(value) {
  return Object.entries(value || {});
}
/**
 * @name Json
 * @description
 * Wraps the a JSON structure retrieve via RPC. It extends the standard JS Map with. While it
 * implements a Codec, it is limited in that it can only be used with input objects via RPC,
 * i.e. no hex decoding. Unlike a struct, this waps a JSON object with unknown keys
 * @noInheritDoc
 */


class StructAny extends Map {
  constructor(registry, value) {
    const decoded = decodeJson(value);
    super(decoded);
    this.registry = void 0;
    this.registry = registry; // like we are doing with structs, add the keys as getters

    decoded.forEach(([key]) => {
      // do not clobber existing properties on the object
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!(0, _util.isUndefined)(this[key])) {
        return;
      }

      Object.defineProperty(this, key, {
        enumerable: true,
        get: () => this.get(key)
      });
    });
  }
  /**
   * @description Always 0, never encodes as a Uint8Array
   */


  get encodedLength() {
    return 0;
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
    return [...this.keys()].length === 0;
  }
  /**
   * @description Compares the value of the input to see if there is a match
   */


  eq(other) {
    return (0, _utils.compareMap)(this, other);
  }
  /**
   * @description Unimplemented, will throw
   */


  toHex() {
    throw new Error('Unimplemented');
  }
  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */


  toHuman() {
    return this.toJSON();
  }
  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */


  toJSON() {
    return [...this.entries()].reduce((json, [key, value]) => {
      json[key] = value;
      return json;
    }, {});
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return 'Json';
  }
  /**
   * @description Returns the string representation of the value
   */


  toString() {
    return JSON.stringify(this.toJSON());
  }
  /**
   * @description Unimplemented, will throw
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  toU8a(isBare) {
    throw new Error('Unimplemented');
  }

}

exports.default = StructAny;