"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _util = require("@polkadot/util");

var _create = require("../create");

var _Null = _interopRequireDefault(require("../primitive/Null"));

var _Text = _interopRequireDefault(require("../primitive/Text"));

var _U = _interopRequireDefault(require("../primitive/U32"));

var _Enum = _interopRequireDefault(require("./Enum"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('Enum', () => {
  const registry = new _create.TypeRegistry();
  describe('typed enum (previously EnumType)', () => {
    it('provides a clean toString() (value)', () => {
      expect(new _Enum.default(registry, {
        Text: _Text.default,
        U32: _U.default
      }, new Uint8Array([0, 2 << 2, 49, 50])).value.toString()).toEqual('12');
    });
    it('provides a clean toString() (enum)', () => {
      expect(new _Enum.default(registry, {
        Text: _Text.default,
        U32: _U.default
      }, new Uint8Array([1, 2 << 2, 49, 50])).toString()).toEqual('{"U32":3289352}');
    });
    it('decodes from a JSON input (lowercase)', () => {
      expect(new _Enum.default(registry, {
        Text: _Text.default,
        U32: _U.default
      }, {
        text: 'some text value'
      }).value.toString()).toEqual('some text value');
    });
    it('decodes reusing instanciated inputs', () => {
      const foo = new _Text.default(registry, 'bar');
      expect(new _Enum.default(registry, {
        foo: _Text.default
      }, {
        foo
      }).value).toBe(foo);
      expect(new _Enum.default(registry, {
        foo: _Text.default
      }, foo, 0).value).toBe(foo);
      expect(new _Enum.default(registry, {
        foo: _Text.default
      }, new _Enum.default(registry, {
        foo: _Text.default
      }, {
        foo
      })).value).toBe(foo);
    });
    it('decodes from hex', () => {
      expect(new _Enum.default(registry, {
        Text: _Text.default,
        U32: _U.default
      }, '0x0134120000').value.toString()).toEqual('4660'); // 0x1234 in decimal
    });
    it('decodes from hex (string types)', () => {
      expect(new _Enum.default(registry, // eslint-disable-next-line sort-keys
      {
        foo: 'Text',
        bar: 'u32'
      }, '0x0134120000').value.toString()).toEqual('4660'); // 0x1234 in decimal
    });
    it('decodes from a JSON input (mixed case)', () => {
      expect(new _Enum.default(registry, {
        Text: _Text.default,
        U32: _U.default
      }, {
        U32: 42
      }).value.toString()).toEqual('42');
    });
    it('decodes from JSON string', () => {
      expect(new _Enum.default(registry, {
        Null: _Null.default,
        U32: _U.default
      }, 'null').type).toEqual('Null');
    });
    it('has correct isXyz/asXyz (Enum.with)', () => {
      const test = new (_Enum.default.with({
        First: _Text.default,
        Second: _U.default,
        Third: _U.default
      }))(registry, {
        Second: 42
      });
      expect(test.isSecond).toEqual(true);
      expect(test.asSecond.toNumber()).toEqual(42);
      expect(() => test.asThird).toThrow(/Cannot convert 'Second' via asThird/);
    });
    it('stringifies with custom types', () => {
      class A extends _Null.default {}

      class B extends _Null.default {}

      class C extends _Null.default {}

      class Test extends _Enum.default {
        constructor(registry, value, index) {
          super(registry, {
            a: A,
            b: B,
            c: C
          }, value, index);
        }

      }

      expect(new Test(registry).toJSON()).toEqual({
        a: null
      });
    });
    it('creates via with', () => {
      class A extends _Null.default {}

      class B extends _U.default {}

      class C extends _Null.default {}

      const Test = _Enum.default.with({
        A,
        B,
        C
      });

      expect(new Test(registry).toJSON()).toEqual({
        A: null
      });
      expect(new Test(registry, 1234, 1).toJSON()).toEqual({
        B: 1234
      });
      expect(new Test(registry, 0x1234, 1).toU8a()).toEqual(new Uint8Array([1, 0x34, 0x12, 0x00, 0x00]));
      expect(new Test(registry, 0x1234, 1).toU8a(true)).toEqual(new Uint8Array([0x34, 0x12, 0x00, 0x00]));
    });
    it('allows accessing the type and value', () => {
      const text = new _Text.default(registry, 'foo');
      const enumType = new _Enum.default(registry, {
        Text: _Text.default,
        U32: _U.default
      }, {
        Text: text
      });
      expect(enumType.type).toBe('Text');
      expect(enumType.value).toEqual(text);
    });
    describe('utils', () => {
      const DEF = {
        num: _U.default,
        str: _Text.default
      };
      const u8a = new Uint8Array([1, 3 << 2, 88, 89, 90]);
      const test = new _Enum.default(registry, DEF, u8a);
      it('compares against index', () => {
        expect(test.eq(1)).toBe(true);
      });
      it('compares against u8a', () => {
        expect(test.eq(u8a)).toBe(true);
      });
      it('compares against hex', () => {
        expect(test.eq((0, _util.u8aToHex)(u8a))).toBe(true);
      });
      it('compares against another enum', () => {
        expect(test.eq(new _Enum.default(registry, DEF, u8a))).toBe(true);
      });
      it('compares against another object', () => {
        expect(test.eq({
          str: 'XYZ'
        })).toBe(true);
      });
      it('compares against values', () => {
        expect(test.eq('XYZ')).toBe(true);
      });
      it('compares basic enum on string', () => {
        expect(new _Enum.default(registry, ['A', 'B', 'C'], 1).eq('B')).toBe(true);
      });
    });
  });
  describe('string-only construction (old Enum)', () => {
    const testDecode = (type, input, expected) => it(`can decode from ${type}`, () => {
      const e = new _Enum.default(registry, ['foo', 'bar'], input);
      expect(e.toString()).toBe(expected);
    });

    const testEncode = (to, expected) => it(`can encode ${to}`, () => {
      const e = new _Enum.default(registry, ['Foo', 'Bar'], 1);
      expect(e[to]()).toEqual(expected);
    });

    testDecode('Enum', undefined, 'foo');
    testDecode('Enum', new _Enum.default(registry, ['foo', 'bar'], 1), 'bar');
    testDecode('number', 0, 'foo');
    testDecode('number', 1, 'bar');
    testDecode('string', 'bar', 'bar');
    testDecode('Uint8Array', Uint8Array.from([0]), 'foo');
    testDecode('Uint8Array', Uint8Array.from([1]), 'bar');
    testEncode('toJSON', 'Bar');
    testEncode('toNumber', 1);
    testEncode('toString', 'Bar');
    testEncode('toU8a', Uint8Array.from([1]));
    it('provides a clean toString()', () => {
      expect(new _Enum.default(registry, ['foo', 'bar']).toString()).toEqual('foo');
    });
    it('provides a clean toString() (enum)', () => {
      expect(new _Enum.default(registry, ['foo', 'bar'], new _Enum.default(registry, ['foo', 'bar'], 1)).toNumber()).toEqual(1);
    });
    it('converts to and from Uint8Array', () => {
      expect(new _Enum.default(registry, ['foo', 'bar'], new Uint8Array([1])).toU8a()).toEqual(new Uint8Array([1]));
    });
    it('converts from JSON', () => {
      expect(new _Enum.default(registry, ['foo', 'bar', 'baz', 'gaz', 'jaz'], 4).toNumber()).toEqual(4);
    });
    it('has correct isXyz getters (Enum.with)', () => {
      const test = new (_Enum.default.with(['First', 'Second', 'Third']))(registry, 'Second');
      expect(test.isSecond).toEqual(true);
    });
    describe('utils', () => {
      it('compares against the index value', () => {
        expect(new _Enum.default(registry, ['foo', 'bar'], 1).eq(1)).toBe(true);
      });
      it('compares against the index value (false)', () => {
        expect(new _Enum.default(registry, ['foo', 'bar'], 1).eq(0)).toBe(false);
      });
      it('compares against the string value', () => {
        expect(new _Enum.default(registry, ['foo', 'bar'], 1).eq('bar')).toBe(true);
      });
      it('compares against the string value (false)', () => {
        expect(new _Enum.default(registry, ['foo', 'bar'], 1).eq('foo')).toBe(false);
      });
      it('has isNone set, with correct index (i.e. no values are used)', () => {
        const test = new _Enum.default(registry, ['foo', 'bar'], 1);
        expect(test.isNone).toBe(true);
        expect(test.index).toEqual(1);
      });
    });
  });
  describe('index construction', () => {
    it('creates enum where index is specified', () => {
      const Test = _Enum.default.with({
        A: _U.default,
        B: _U.default
      });

      const test = new Test(registry, new _U.default(registry, 123), 1);
      expect(test.type).toEqual('B');
      expect(test.value.toNumber()).toEqual(123);
    });
    it('creates enum when value is an enum', () => {
      const Test = _Enum.default.with({
        A: _U.default,
        B: _U.default
      });

      const test = new Test(registry, new Test(registry, 123, 1));
      expect(test.type).toEqual('B');
      expect(test.value.toNumber()).toEqual(123);
    });
    it('creates via enum with nested enums as the value', () => {
      const Nest = _Enum.default.with({
        C: _U.default,
        D: _U.default
      });

      const Test = _Enum.default.with({
        A: _U.default,
        B: Nest
      });

      const test = new Test(registry, new Nest(registry, 123, 1), 1);
      expect(test.type).toEqual('B');
      expect(test.value.type).toEqual('D');
      expect(test.value.value.toNumber()).toEqual(123);
    });
  });
  describe('outputs', () => {
    describe('toRawType', () => {
      it('has a sane output for basic enums', () => {
        expect(new _Enum.default(registry, ['foo', 'bar']).toRawType()).toEqual(JSON.stringify({
          _enum: ['foo', 'bar']
        }));
      });
      it('has a sane output for typed enums', () => {
        expect( // eslint-disable-next-line sort-keys
        new _Enum.default(registry, {
          foo: _Text.default,
          bar: _U.default
        }).toRawType() // eslint-disable-next-line sort-keys
        ).toEqual(JSON.stringify({
          _enum: {
            foo: 'Text',
            bar: 'u32'
          }
        }));
      });
    });
    describe('toHex', () => {
      it('has a proper hex representation & length', () => {
        const Test = _Enum.default.with({
          A: _Text.default,
          B: _U.default
        });

        const test = new Test(registry, 123, 1);
        expect(test.toHex()).toEqual('0x017b000000');
        expect(test.encodedLength).toEqual(1 + 4);
      });
      it('encodes a single entry correctly', () => {
        const Test = _Enum.default.with({
          A: 'u32'
        });

        const test = new Test(registry, 0x44332211, 0);
        expect(test.toHex()).toEqual('0x' + '00' + // index
        '11223344' // u32 LE encoded
        );
      });
      it('encodes a single entry correctly (with embedded encoding)', () => {
        const Test = _Enum.default.with({
          A: 'Address'
        });

        const test = new Test(registry, registry.createType('AccountId', '0x0001020304050607080910111213141516171819202122232425262728293031'), 0);
        expect(test.toHex()).toEqual('0x' + '00' + // index
        'ff' + // Address indicating an embedded AccountId
        '0001020304050607080910111213141516171819202122232425262728293031' // AccountId
        );
      });
    });
  });
});