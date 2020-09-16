"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _emptyCheck = _interopRequireDefault(require("./emptyCheck"));

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const CheckMortality = {
  extra: {
    blockHash: 'Hash'
  },
  types: {
    era: 'ExtrinsicEra'
  }
};
var _default = {
  ChargeTransactionPayment: {
    extra: {},
    types: {
      tip: 'Compact<Balance>'
    }
  },
  CheckBlockGasLimit: _emptyCheck.default,
  CheckEra: CheckMortality,
  CheckGenesis: {
    extra: {
      genesisHash: 'Hash'
    },
    types: {}
  },
  CheckMortality,
  CheckNonce: {
    extra: {},
    types: {
      nonce: 'Compact<Index>'
    }
  },
  CheckSpecVersion: {
    extra: {
      specVersion: 'u32'
    },
    types: {}
  },
  CheckTxVersion: {
    extra: {
      transactionVersion: 'u32'
    },
    types: {}
  },
  CheckVersion: {
    extra: {
      specVersion: 'u32'
    },
    types: {}
  },
  CheckWeight: _emptyCheck.default,
  LockStakingStatus: _emptyCheck.default,
  ValidateEquivocationReport: _emptyCheck.default
};
exports.default = _default;