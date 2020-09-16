"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _create = require("../create");

var _Text = _interopRequireDefault(require("../primitive/Text"));

var _U = _interopRequireDefault(require("../primitive/U32"));

var _Struct = _interopRequireDefault(require("./Struct"));

var _Vec = _interopRequireDefault(require("./Vec"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
describe('Struct', () => {
  const registry = new _create.TypeRegistry();
  describe('decoding', () => {
    const testDecode = (type, input) => it(`can decode from ${type}`, () => {
      const s = new _Struct.default(registry, {
        foo: _Text.default,
        bar: _U.default
      }, input);
      expect([...s.keys()]).toEqual(['foo', 'bar']);
      expect([...s.values()].map(v => v.toString())).toEqual(['bazzing', '69']);
    });

    testDecode('array', ['bazzing', 69]);
    testDecode('hex', '0x1c62617a7a696e6745000000');
    testDecode('object', {
      foo: 'bazzing',
      bar: 69
    });
    testDecode('Uint8Array', Uint8Array.from([28, 98, 97, 122, 122, 105, 110, 103, 69, 0, 0, 0]));
  });
  describe('encoding', () => {
    const testEncode = (to, expected) => it(`can encode ${to}`, () => {
      const s = new _Struct.default(registry, {
        foo: _Text.default,
        bar: _U.default
      }, {
        foo: 'bazzing',
        bar: 69
      });
      expect(s[to]()).toEqual(expected);
    });

    testEncode('toHex', '0x1c62617a7a696e6745000000');
    testEncode('toJSON', {
      foo: 'bazzing',
      bar: 69
    });
    testEncode('toU8a', Uint8Array.from([28, 98, 97, 122, 122, 105, 110, 103, 69, 0, 0, 0]));
    testEncode('toString', '{"foo":"bazzing","bar":69}');
  });
  it('decodes null', () => {
    expect(new (_Struct.default.with({
      txt: _Text.default,
      u32: _U.default
    }))(registry, null).toString()).toEqual('{}');
  });
  it('decodes reusing instanciated inputs', () => {
    const foo = new _Text.default(registry, 'bar');
    expect(new _Struct.default(registry, {
      foo: _Text.default
    }, {
      foo
    }).get('foo')).toBe(foo);
  });
  it('decodes a more complicated type', () => {
    const s = new _Struct.default(registry, {
      foo: _Vec.default.with(_Struct.default.with({
        bar: _Text.default
      }))
    }, {
      foo: [{
        bar: 1
      }, {
        bar: 2
      }]
    });
    expect(s.toString()).toBe('{"foo":[{"bar":"1"},{"bar":"2"}]}');
  });
  it('decodes from a Map input', () => {
    const input = new _Struct.default(registry, {
      a: _U.default,
      txt: _Text.default
    }, {
      a: 42,
      txt: 'fubar'
    });
    const s = new _Struct.default(registry, {
      txt: _Text.default,
      foo: _U.default,
      bar: _U.default
    }, input);
    expect(s.toString()).toEqual('{"txt":"fubar","foo":0,"bar":0}');
  });
  it('throws when it cannot decode', () => {
    expect(() => new (_Struct.default.with({
      txt: _Text.default,
      u32: _U.default
    }))(registry, 'ABC')).toThrowError(/Struct: cannot decode type/);
  });
  it('provides a clean toString()', () => {
    expect(new (_Struct.default.with({
      txt: _Text.default,
      u32: _U.default
    }))(registry, {
      txt: 'foo',
      u32: 0x123456
    }).toString()).toEqual('{"txt":"foo","u32":1193046}');
  });
  it('provides a clean toString() (string types)', () => {
    expect(new (_Struct.default.with({
      txt: 'Text',
      num: 'u32',
      cls: _U.default
    }))(registry, {
      txt: 'foo',
      num: 0x123456,
      cls: 123
    }).toString()).toEqual('{"txt":"foo","num":1193046,"cls":123}');
  });
  it('exposes the properties on the object', () => {
    const struct = new (_Struct.default.with({
      txt: _Text.default,
      u32: _U.default
    }))(registry, {
      txt: 'foo',
      u32: 0x123456
    }); // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call

    expect(struct.txt.toString()).toEqual('foo'); // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call

    expect(struct.u32.toNumber()).toEqual(0x123456);
  });
  it('correctly encodes length', () => {
    expect(new (_Struct.default.with({
      txt: _Text.default,
      u32: _U.default
    }))(registry, {
      foo: 'bazzing',
      bar: 69
    }).encodedLength).toEqual(5);
  });
  it('exposes the types', () => {
    expect(new _Struct.default(registry, {
      foo: _Text.default,
      bar: _Text.default,
      baz: _U.default
    }, {
      foo: 'foo',
      bar: 'bar',
      baz: 3
    }).Type).toEqual({
      foo: 'Text',
      bar: 'Text',
      baz: 'u32'
    });
  });
  it('gets the value at a particular index', () => {
    expect(new (_Struct.default.with({
      txt: _Text.default,
      u32: _U.default
    }))(registry, {
      txt: 'foo',
      u32: 1234
    }).getAtIndex(1).toString()).toEqual('1234');
  });
  describe('utils', () => {
    it('compares against other objects', () => {
      const test = {
        foo: 'foo',
        bar: 'bar',
        baz: 3
      };
      expect(new _Struct.default(registry, {
        foo: _Text.default,
        bar: _Text.default,
        baz: _U.default
      }, test).eq(test)).toBe(true);
    });
  });
  it('allows toString with large numbers', () => {
    // replicate https://github.com/polkadot-js/api/issues/640
    expect(new _Struct.default(registry, {
      blockNumber: registry.createClass('Option<BlockNumber>')
    }, {
      blockNumber: '0x0000000010abcdef'
    }).toString()).toEqual('{"blockNumber":279694831}');
  });
  it('generates sane toRawType', () => {
    expect(new _Struct.default(registry, {
      accountId: 'AccountId',
      balanceCompact: registry.createClass('Compact<Balance>'),
      blockNumber: registry.createClass('BlockNumber'),
      compactNumber: registry.createClass('Compact<BlockNumber>'),
      optionNumber: registry.createClass('Option<BlockNumber>'),
      counter: _U.default,
      vector: _Vec.default.with('AccountId')
    }).toRawType()).toEqual(JSON.stringify({
      accountId: 'AccountId',
      balanceCompact: 'Compact<Balance>',
      // Override in Uint
      blockNumber: 'BlockNumber',
      compactNumber: 'Compact<BlockNumber>',
      optionNumber: 'Option<BlockNumber>',
      counter: 'u32',
      vector: 'Vec<AccountId>'
    }));
  });
  it('generates sane toRawType (via with)', () => {
    const Type = _Struct.default.with({
      accountId: 'AccountId',
      balance: registry.createClass('Balance')
    });

    expect(new Type(registry).toRawType()).toEqual(JSON.stringify({
      accountId: 'AccountId',
      balance: 'Balance' // Override in Uint

    }));
  });
  describe('toU8a', () => {
    const def = {
      foo: 'Bytes',
      method: 'Bytes',
      bar: 'Option<u32>',
      baz: 'bool'
    };
    const val = {
      foo: '0x4269',
      method: '0x99',
      bar: 1,
      baz: true
    };
    it('generates toU8a with undefined', () => {
      expect(new _Struct.default(registry, def, val).toU8a()).toEqual(new Uint8Array([2 << 2, 0x42, 0x69, 1 << 2, 0x99, 1, 1, 0, 0, 0, 1]));
    });
    it('generates toU8a with true', () => {
      expect(new _Struct.default(registry, def, val).toU8a(true)).toEqual(new Uint8Array([0x42, 0x69, 0x99, 1, 0, 0, 0, 1]));
    });
    it('generates toU8a with { method: true }', () => {
      expect(new _Struct.default(registry, def, val).toU8a({
        method: true
      })).toEqual(new Uint8Array([2 << 2, 0x42, 0x69, 0x99, 1, 1, 0, 0, 0, 1]));
    });
  });
});