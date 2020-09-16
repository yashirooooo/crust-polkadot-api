"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _bn = _interopRequireDefault(require("bn.js"));

var _create = require("../create");

var _U = _interopRequireDefault(require("../primitive/U64"));

var _Date = _interopRequireDefault(require("./Date"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('Date', () => {
  const registry = new _create.TypeRegistry();
  describe('decode', () => {
    const testDecode = (type, input, expected, toJSON = false) => it(`can decode from ${type}`, () => {
      expect(new _Date.default(registry, input)[toJSON ? 'toJSON' : 'toISOString']()).toBe(expected);
    });

    testDecode('Date', new Date(1537968546280), '2018-09-26T13:29:06.280Z');
    testDecode('CodecDate', new _Date.default(registry, 1234), 1234, true);
    testDecode('number', 1234, 1234, true);
    testDecode('U64', new _U.default(registry, 69), 69, true);
  });
  describe('encode', () => {
    const testEncode = (to, expected) => it(`can encode ${to}`, () => {
      expect(new _Date.default(registry, 421)[to]()).toEqual(expected);
    });

    testEncode('toBigInt', 421n);
    testEncode('toBn', new _bn.default(421));
    testEncode('toJSON', 421);
    testEncode('toISOString', '1970-01-01T00:07:01.000Z');
    testEncode('toNumber', 421);
    testEncode('toU8a', Uint8Array.from([165, 1, 0, 0, 0, 0, 0, 0]));
    it('can encode toString', () => {
      const date = new Date(Date.UTC(1970, 0, 1, 2, 3, 4));
      date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
      expect(new _Date.default(registry, date).toString()).toMatch(/^Thu Jan 01 1970 02:03:04/);
    });
    it('encodes default BE hex', () => {
      expect(new _Date.default(registry, 3).toHex()).toEqual('0x0000000000000003');
    });
    it('encodes options LE hex', () => {
      expect(new _Date.default(registry, 3).toHex(true)).toEqual('0x0300000000000000');
    });
  });
  describe('utils', () => {
    it('compares values', () => {
      expect(new _Date.default(registry, 123).eq(123)).toBe(true);
    });
    it('compares values (non-match)', () => {
      expect(new _Date.default(registry, 123).eq(456)).toBe(false);
    });
  });
});