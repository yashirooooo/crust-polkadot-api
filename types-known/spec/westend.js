"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright 2017-2020 @polkadot/types-known authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const sharedTypes = {
  Address: 'AccountId',
  Keys: 'SessionKeys5',
  LookupSource: 'AccountId',
  ProxyType: {
    // was: SudoBalances
    _enum: ['Any', 'NonTransfer', 'Staking', 'Unused', 'IdentityJudgement']
  }
};
const versioned = [{
  minmax: [1, 2],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    CompactAssignments: 'CompactAssignmentsTo257',
    Multiplier: 'Fixed64',
    OpenTip: 'OpenTipTo225',
    RewardDestination: 'RewardDestinationTo257',
    Weight: 'u32'
  })
}, {
  minmax: [3, 22],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    CompactAssignments: 'CompactAssignmentsTo257',
    OpenTip: 'OpenTipTo225',
    RewardDestination: 'RewardDestinationTo257'
  })
}, {
  minmax: [23, 42],
  types: _objectSpread(_objectSpread({}, sharedTypes), {}, {
    CompactAssignments: 'CompactAssignmentsTo257',
    RewardDestination: 'RewardDestinationTo257'
  })
}, {
  minmax: [43, undefined],
  types: _objectSpread({}, sharedTypes)
}];
var _default = versioned;
exports.default = _default;