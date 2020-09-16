"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("@polkadot/util");

var _Compact = _interopRequireDefault(require("./Compact"));

var _utils = require("./utils");

var _AbstractArray = _interopRequireDefault(require("./AbstractArray"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const MAX_LENGTH = 32768;
/**
 * @name Vec
 * @description
 * This manages codec arrays. Internally it keeps track of the length (as decoded) and allows
 * construction with the passed `Type` in the constructor. It is an extension to Array, providing
 * specific encoding/decoding on top of the base type.
 */

class Vec extends _AbstractArray.default {
  constructor(registry, Type, value = []) {
    const Clazz = (0, _utils.typeToConstructor)(registry, Type);
    super(registry, ...Vec.decodeVec(registry, Clazz, value));
    this._Type = void 0;
    this._Type = Clazz;
  }
  /** @internal */


  static decodeVec(registry, Type, value) {
    if (Array.isArray(value)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value.map((entry, index) => {
        try {
          return entry instanceof Type ? entry : new Type(registry, entry);
        } catch (error) {
          console.error(`Unable to decode Vec on index ${index}`, error.message);
          throw error;
        }
      });
    }

    const u8a = (0, _util.u8aToU8a)(value);

    const [offset, length] = _Compact.default.decodeU8a(u8a);

    (0, _util.assert)(length.lten(MAX_LENGTH), `Vec length ${length.toString()} exceeds ${MAX_LENGTH}`);
    return (0, _utils.decodeU8a)(registry, u8a.subarray(offset), new Array(length.toNumber()).fill(Type));
  }

  static with(Type) {
    return class extends Vec {
      constructor(registry, value) {
        super(registry, Type, value);
      }

    };
  }
  /**
   * @description The type for the items
   */


  get Type() {
    return this._Type.name;
  }
  /**
   * @description Finds the index of the value in the array
   */


  indexOf(_other) {
    // convert type first, this removes overhead from the eq
    const other = _other instanceof this._Type ? _other : new this._Type(this.registry, _other);

    for (let i = 0; i < this.length; i++) {
      if (other.eq(this[i])) {
        return i;
      }
    }

    return -1;
  }
  /**
   * @description Returns the base runtime type name for this instance
   */


  toRawType() {
    return `Vec<${this.registry.getClassName(this._Type) || new this._Type(this.registry).toRawType()}>`;
  }

}

exports.default = Vec;