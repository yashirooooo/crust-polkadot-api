"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Struct = _interopRequireDefault(require("../codec/Struct"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * @name Block
 * @description
 * A block encoded with header and extrinsics
 */
class Block extends _Struct.default {
  constructor(registry, value) {
    super(registry, {
      header: 'Header',
      // eslint-disable-next-line sort-keys
      extrinsics: 'Vec<Extrinsic>'
    }, value);
  }
  /**
   * @description Encodes a content [[Hash]] for the block
   */


  get contentHash() {
    return this.registry.createType('H256', this.registry.hash(this.toU8a()));
  }
  /**
   * @description The [[Extrinsic]] contained in the block
   */


  get extrinsics() {
    return this.get('extrinsics');
  }
  /**
   * @description Block/header [[Hash]]
   */


  get hash() {
    return this.header.hash;
  }
  /**
   * @description The [[Header]] of the block
   */


  get header() {
    return this.get('header');
  }

}

exports.default = Block;