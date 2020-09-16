"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _Metadata = _interopRequireDefault(require("@polkadot/metadata/Metadata"));

var _static = _interopRequireDefault(require("@polkadot/metadata/Metadata/static"));

var _create = require("../create");

var _SignedBlock = _interopRequireDefault(require("../json/SignedBlock.003.00.json"));

var _Block = _interopRequireDefault(require("./Block"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const registry = new _create.TypeRegistry(); // eslint-disable-next-line no-new

new _Metadata.default(registry, _static.default);
describe('Block', () => {
  it('has a valid toRawType', () => {
    expect(new _Block.default(registry).toRawType()).toEqual( // each of the containing structures have been stringified on their own
    JSON.stringify({
      header: 'Header',
      extrinsics: 'Vec<Extrinsic>'
    }));
  });
  it('re-encodes digest items correctly', () => {
    const digest = new _Block.default(registry, _SignedBlock.default.result.block).header.digest;
    expect(digest.logs[0].toHex()).toEqual(_SignedBlock.default.result.block.header.digest.logs[0]);
    expect(digest.logs[1].toHex()).toEqual(_SignedBlock.default.result.block.header.digest.logs[1]);
  });
});