"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _Metadata = _interopRequireDefault(require("@polkadot/metadata/Metadata"));

var _static = _interopRequireDefault(require("@polkadot/metadata/Metadata/static"));

var _create = require("../create");

var _Text = _interopRequireDefault(require("../primitive/Text"));

var _U = _interopRequireDefault(require("../primitive/U32"));

var _U2 = _interopRequireDefault(require("../primitive/U128"));

var _Tuple = _interopRequireDefault(require("./Tuple"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('Tuple', () => {
  const registry = new _create.TypeRegistry();
  let tuple;
  beforeEach(() => {
    tuple = new _Tuple.default(registry, [_Text.default, _U.default], ['bazzing', 69]);
  });
  describe('decoding', () => {
    const testDecode = (type, input) => it(`can decode from ${type}`, () => {
      const t = new _Tuple.default(registry, [_Text.default, _U.default], input);
      expect(t.toJSON()).toEqual(['bazzing', 69]);
    });

    testDecode('array', ['bazzing', 69]);
    testDecode('hex', '0x1c62617a7a696e6745000000');
    testDecode('Uint8Array', Uint8Array.from([28, 98, 97, 122, 122, 105, 110, 103, 69, 0, 0, 0]));
    it('decodes reusing instantiated inputs', () => {
      const foo = new _Text.default(registry, 'bar');
      expect(new _Tuple.default(registry, [_Text.default], [foo])[0]).toBe(foo);
    });
    it('decodes properly from complex types', () => {
      const INPUT = '0xcc0200000000';
      const test = registry.createType('(u32, [u32; 0], u16)', INPUT);
      expect(test.encodedLength).toEqual(4 + 0 + 2);
      expect(test.toHex()).toEqual(INPUT);
    });
  });
  describe('encoding', () => {
    const testEncode = (to, expected) => it(`can encode ${to}`, () => {
      expect(tuple[to]()).toEqual(expected);
    });

    testEncode('toHex', '0x1c62617a7a696e6745000000');
    testEncode('toJSON', ['bazzing', 69]);
    testEncode('toU8a', Uint8Array.from([28, 98, 97, 122, 122, 105, 110, 103, 69, 0, 0, 0]));
    testEncode('toString', '["bazzing",69]');
  });
  it('creates from string types', () => {
    expect(new _Tuple.default(registry, ['Text', 'u32', _U.default], ['foo', 69, 42]).toString()).toEqual('["foo",69,42]');
  });
  it('creates properly via actual hex string', () => {
    // eslint-disable-next-line no-new
    new _Metadata.default(registry, _static.default);
    const test = new (_Tuple.default.with([registry.createClass('BlockNumber'), registry.createClass('VoteThreshold')]))(registry, '0x6219000001');
    expect(test[0].toNumber()).toEqual(6498);
    expect(test[1].toNumber()).toEqual(1);
  });
  it('exposes the Types', () => {
    expect(tuple.Types).toEqual(['Text', 'u32']);
  });
  it('exposes the Types (object creation)', () => {
    const test = new _Tuple.default(registry, {
      BlockNumber: registry.createClass('BlockNumber'),
      VoteThreshold: registry.createClass('VoteThreshold')
    }, []);
    expect(test.Types).toEqual(['BlockNumber', 'VoteThreshold']);
  });
  it('exposes filter', () => {
    expect(tuple.filter(v => v.toJSON() === 69)).toEqual([new _U.default(registry, 69)]);
  });
  it('exposes map', () => {
    expect(tuple.map(v => v.toString())).toEqual(['bazzing', '69']);
  });
  describe('utils', () => {
    it('compares against inputs', () => {
      expect(tuple.eq(['bazzing', 69])).toBe(true);
    });
    it('compares against inputs (mismatch)', () => {
      expect(tuple.eq(['bazzing', 72])).toBe(false);
    });
  });
  describe('toRawType', () => {
    it('generates sane value with array types', () => {
      expect(new _Tuple.default(registry, [_U2.default, registry.createClass('BlockNumber')]).toRawType()).toEqual('(u128,BlockNumber)');
    });
    it('generates sane value with object types', () => {
      expect( // eslint-disable-next-line sort-keys
      new _Tuple.default(registry, {
        number: _U2.default,
        blockNumber: registry.createClass('BlockNumber')
      }).toRawType()).toEqual('(u128,BlockNumber)');
    });
  });
});