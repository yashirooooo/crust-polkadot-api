"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _types = require("@polkadot/types");

var _ = _interopRequireDefault(require("."));

// Copyright 2017-2020 @polkadot/rpc-core authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('methodSend', () => {
  const registry = new _types.TypeRegistry();
  let rpc;
  let methods;
  let provider;
  beforeEach(() => {
    methods = {
      blah: {
        description: 'test',
        params: [{
          name: 'foo',
          type: 'Bytes'
        }],
        type: 'Bytes'
      },
      bleh: {
        description: 'test',
        params: [],
        type: 'Bytes'
      }
    };
    provider = {
      send: jest.fn((method, params) => {
        return Promise.resolve(params[0]);
      })
    };
    rpc = new _.default('987', registry, provider);
  });
  it('checks for mismatched parameters', done => {
    // private method
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const method = rpc._createMethodSend('test', 'bleh', methods.bleh); // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access


    method(1).subscribe(() => undefined, error => {
      expect(error.message).toMatch(/parameters, 1 found instead/);
      done();
    });
  });
  it('calls the provider with the correct parameters', done => {
    // private method
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const method = rpc._createMethodSend('test', 'blah', methods.blah); // Args are length-prefixed, because it's a Bytes
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access


    method(new Uint8Array([2 << 2, 0x12, 0x34])).subscribe(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(provider.send).toHaveBeenCalledWith('test_blah', ['0x1234']);
      done();
    });
  });
});