"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDefinitions = registerDefinitions;

// Copyright 2017-2020 @polkadot/typegen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function registerDefinitions(registry, extras) {
  Object.values(extras).forEach(def => {
    Object.values(def).forEach(({
      types
    }) => {
      registry.register(types);
    });
  });
}