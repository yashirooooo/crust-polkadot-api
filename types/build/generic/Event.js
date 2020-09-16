"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EventData = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _Struct = _interopRequireDefault(require("../codec/Struct"));

var _Tuple = _interopRequireDefault(require("../codec/Tuple"));

var _Null = _interopRequireDefault(require("../primitive/Null"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var _meta = (0, _classPrivateFieldLooseKey2.default)("meta");

var _method = (0, _classPrivateFieldLooseKey2.default)("method");

var _section = (0, _classPrivateFieldLooseKey2.default)("section");

var _typeDef = (0, _classPrivateFieldLooseKey2.default)("typeDef");

/**
 * @name EventData
 * @description
 * Wrapper for the actual data that forms part of an [[Event]]
 */
class EventData extends _Tuple.default {
  constructor(registry, Types, value, typeDef, meta, section, method) {
    super(registry, Types, value);
    Object.defineProperty(this, _meta, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _method, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _section, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _typeDef, {
      writable: true,
      value: void 0
    });
    (0, _classPrivateFieldLooseBase2.default)(this, _meta)[_meta] = meta;
    (0, _classPrivateFieldLooseBase2.default)(this, _method)[_method] = method;
    (0, _classPrivateFieldLooseBase2.default)(this, _section)[_section] = section;
    (0, _classPrivateFieldLooseBase2.default)(this, _typeDef)[_typeDef] = typeDef;
  }
  /**
   * @description The wrapped [[EventMetadata]]
   */


  get meta() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _meta)[_meta];
  }
  /**
   * @description The method as a string
   */


  get method() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _method)[_method];
  }
  /**
   * @description The section as a string
   */


  get section() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _section)[_section];
  }
  /**
   * @description The [[TypeDef]] for this event
   */


  get typeDef() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _typeDef)[_typeDef];
  }

}
/**
 * @name Event
 * @description
 * A representation of a system event. These are generated via the [[Metadata]] interfaces and
 * specific to a specific Substrate runtime
 */


exports.EventData = EventData;

class Event extends _Struct.default {
  // Currently we _only_ decode from Uint8Array, since we expect it to
  // be used via EventRecord
  constructor(registry, _value) {
    const {
      DataType,
      value
    } = Event.decodeEvent(registry, _value);
    super(registry, {
      index: 'EventId',
      // eslint-disable-next-line sort-keys
      data: DataType
    }, value);
  }
  /** @internal */


  static decodeEvent(registry, value = new Uint8Array()) {
    if (!value.length) {
      return {
        DataType: _Null.default
      };
    }

    const index = value.subarray(0, 2);
    return {
      DataType: registry.findMetaEvent(index),
      value: {
        data: value.subarray(2),
        index
      }
    };
  }
  /**
   * @description The wrapped [[EventData]]
   */


  get data() {
    return this.get('data');
  }
  /**
   * @description The [[EventId]], identifying the raw event
   */


  get index() {
    return this.get('index');
  }
  /**
   * @description The [[EventMetadata]] with the documentation
   */


  get meta() {
    return this.data.meta;
  }
  /**
   * @description The method string identifying the event
   */


  get method() {
    return this.data.method;
  }
  /**
   * @description The section string identifying the event
   */


  get section() {
    return this.data.section;
  }
  /**
   * @description The [[TypeDef]] for the event
   */


  get typeDef() {
    return this.data.typeDef;
  }
  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  toHuman(isExpanded) {
    // FIXME May this human-friendly
    return this.toJSON();
  }

}

exports.default = Event;