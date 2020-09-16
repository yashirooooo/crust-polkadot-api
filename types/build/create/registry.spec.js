"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

var _Struct = _interopRequireDefault(require("../codec/Struct"));

var _DoNotConstruct = _interopRequireDefault(require("../primitive/DoNotConstruct"));

var _Text = _interopRequireDefault(require("../primitive/Text"));

var _U = _interopRequireDefault(require("../primitive/U32"));

var _registry = require("./registry");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
describe('TypeRegistry', () => {
  const registry = new _registry.TypeRegistry();
  it('handles non exist type', () => {
    expect(registry.get('non-exist')).toBeUndefined();
  });
  it('throws on non-existent via getOrThrow', () => {
    expect(() => registry.getOrThrow('non-exist')).toThrow('type non-exist not found');
    expect(() => registry.getOrThrow('non-exist', 'foo bar blah')).toThrow('foo bar blah');
  });
  it('handles non exist type as Unknown (via getOrUnknown)', () => {
    const Type = registry.getOrUnknown('non-exist');
    expect(Type).toBeDefined(); // eslint-disable-next-line no-prototype-builtins

    expect((0, _util.isChildClass)(_DoNotConstruct.default, Type));
  });
  it('can register single type', () => {
    registry.register(_Text.default);
    expect(registry.get('Text')).toBe(_Text.default);
  });
  it('can register type with a different name', () => {
    registry.register('TextRenamed', _Text.default);
    expect((0, _util.isChildClass)(_Text.default, registry.get('TextRenamed'))).toBe(true);
  });
  describe('object registration', () => {
    it('can register multiple types', () => {
      registry.register({
        Text: _Text.default,
        U32Renamed: _U.default
      });
      expect((0, _util.isChildClass)(_Text.default, registry.get('Text'))).toBe(true);
      expect((0, _util.isChildClass)(_U.default, registry.get('U32Renamed'))).toBe(true);
    });
    it('can register recursive types', () => {
      registry.register({
        Recursive: {
          next: 'Option<Recursive>'
        }
      });
      expect(registry.hasDef('Recursive')).toBe(true);
      expect(registry.hasClass('Recursive')).toBe(false);
      const Recursive = registry.getOrThrow('Recursive');
      expect(registry.hasClass('Recursive')).toBe(true);
      const last = new Recursive(registry, {
        next: null
      });
      const first = new Recursive(registry, {
        next: last
      });
      expect(first.next.isSome).toBe(true); // eslint-disable-next-line @typescript-eslint/no-unsafe-call

      expect(first.next.unwrap().next.isSome).toBe(false);
    });
    it('can register non-embedded recursive types', () => {
      registry.register({
        Operation: {
          data: 'OperationData'
        },
        OperationData: {
          ops: 'Vec<Operation>'
        },
        Rule: {
          data: 'RuleData'
        },
        RuleData: {
          ops: 'Vec<Operation>'
        }
      });
      expect(registry.hasDef('Rule')).toBe(true);
      expect(registry.hasClass('Rule')).toBe(false);
      const Rule = registry.getOrThrow('Rule');
      expect(registry.hasClass('Rule')).toBe(true);
      const instance = new Rule(registry);
      expect(instance.toRawType()).toEqual('{"data":"RuleData"}');
    });
    it('can register cross-referencing types', () => {
      registry.register({
        A: {
          next: 'B'
        },
        B: {
          _enum: {
            End: null,
            Other: 'A'
          }
        }
      });
      const A = registry.getOrThrow('A');
      const B = registry.getOrThrow('B');
      expect(registry.hasClass('Recursive')).toBe(true);
      const last = new B(registry, {
        End: null
      });
      const first = new B(registry, {
        Other: new A(registry, {
          next: last
        })
      });
      expect(first.isOther).toBe(true);
    });
    it('can create types from string', () => {
      registry.register({
        U32Renamed: 'u32'
      });
      const Type = registry.getOrThrow('U32Renamed');
      expect(new Type(registry) instanceof _U.default).toBe(true);
    });
    it('can create structs via definition', () => {
      registry.register({
        SomeStruct: {
          bar: 'Text',
          foo: 'u32'
        }
      });
      const SomeStruct = registry.getOrThrow('SomeStruct');
      const struct = new SomeStruct(registry, {
        bar: 'testing',
        foo: 42
      });
      expect(struct instanceof _Struct.default).toBe(true); // eslint-disable-next-line @typescript-eslint/no-unsafe-call

      expect(struct.foo.toNumber()).toEqual(42); // eslint-disable-next-line @typescript-eslint/no-unsafe-call

      expect(struct.bar.toString()).toEqual('testing');
    });
  });
  it('hashes via blake2 by default', () => {
    expect(registry.hash((0, _util.u8aToU8a)('abc'))).toEqual(new Uint8Array([189, 221, 129, 60, 99, 66, 57, 114, 49, 113, 239, 63, 238, 152, 87, 155, 148, 150, 78, 59, 177, 203, 62, 66, 114, 98, 200, 192, 104, 213, 35, 25]));
  });
  it('hashes via override hasher', () => {
    registry.setHasher(_utilCrypto.keccakAsU8a);
    expect(registry.hash((0, _util.u8aToU8a)('test value'))).toEqual((0, _util.u8aToU8a)('0x2d07364b5c231c56ce63d49430e085ea3033c750688ba532b24029124c26ca5e'));
    registry.setHasher();
    expect(registry.hash((0, _util.u8aToU8a)('abc'))).toEqual(new Uint8Array([189, 221, 129, 60, 99, 66, 57, 114, 49, 113, 239, 63, 238, 152, 87, 155, 148, 150, 78, 59, 177, 203, 62, 66, 114, 98, 200, 192, 104, 213, 35, 25]));
  });
});