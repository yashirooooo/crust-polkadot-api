"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ = _interopRequireDefault(require("./"));

// Copyright 2017-2020 @polkadot/rpc-provider authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('decodeResponse', () => {
  let coder;
  beforeEach(() => {
    coder = new _.default();
  });
  it('expects a non-empty input object', () => {
    expect(() => coder.decodeResponse(undefined)).toThrow(/Empty response/);
  });
  it('expects a valid jsonrpc field', () => {
    expect(() => coder.decodeResponse({})).toThrow(/Invalid jsonrpc/);
  });
  it('expects a valid id field', () => {
    expect(() => coder.decodeResponse({
      jsonrpc: '2.0'
    })).toThrow(/Invalid id/);
  });
  it('expects a valid result field', () => {
    expect(() => coder.decodeResponse({
      id: 1,
      jsonrpc: '2.0'
    })).toThrow(/No result/);
  });
  it('throws any error found', () => {
    expect(() => coder.decodeResponse({
      error: {
        code: 123,
        message: 'test error'
      },
      id: 1,
      jsonrpc: '2.0'
    })).toThrow(/123: test error/);
  });
  it('throws any error found, with data', () => {
    expect(() => coder.decodeResponse({
      error: {
        code: 123,
        data: 'Error("Some random error description")',
        message: 'test error'
      },
      id: 1,
      jsonrpc: '2.0'
    })).toThrow(/123: test error: Some random error description/);
  });
  it('allows for number subscription ids', () => {
    expect(coder.decodeResponse({
      id: 1,
      jsonrpc: '2.0',
      method: 'test',
      params: {
        result: 'test result',
        subscription: 1
      }
    })).toEqual('test result');
  });
  it('allows for string subscription ids', () => {
    expect(coder.decodeResponse({
      id: 1,
      jsonrpc: '2.0',
      method: 'test',
      params: {
        result: 'test result',
        subscription: 'abc'
      }
    })).toEqual('test result');
  });
  it('returns the result', () => {
    expect(coder.decodeResponse({
      id: 1,
      jsonrpc: '2.0',
      result: 'some result'
    })).toEqual('some result');
  });
});