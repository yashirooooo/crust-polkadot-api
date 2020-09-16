"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _types = require("@polkadot/types");

var _Extrinsic = require("@polkadot/types/extrinsic/Extrinsic");

var _typesKnown = require("@polkadot/types-known");

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

var _Decorate = _interopRequireDefault(require("./Decorate"));

// Copyright 2017-2020 @polkadot/api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
const KEEPALIVE_INTERVAL = 15000;
const DEFAULT_BLOCKNUMBER = {
  unwrap: () => _util.BN_ZERO
};
const l = (0, _util.logger)('api/init');

var _healthTimer = (0, _classPrivateFieldLooseKey2.default)("healthTimer");

var _registries = (0, _classPrivateFieldLooseKey2.default)("registries");

var _updateSub = (0, _classPrivateFieldLooseKey2.default)("updateSub");

var _onProviderConnect = (0, _classPrivateFieldLooseKey2.default)("onProviderConnect");

var _onProviderDisconnect = (0, _classPrivateFieldLooseKey2.default)("onProviderDisconnect");

var _onProviderError = (0, _classPrivateFieldLooseKey2.default)("onProviderError");

class Init extends _Decorate.default {
  constructor(options, type, decorateMethod) {
    super(options, type, decorateMethod);
    Object.defineProperty(this, _healthTimer, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _registries, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _updateSub, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onProviderConnect, {
      writable: true,
      value: async () => {
        this.emit('connected');

        this._isConnected.next(true);

        try {
          const [hasMeta, cryptoReady] = await Promise.all([this._loadMeta(), this._options.initWasm === false ? Promise.resolve(true) : (0, _utilCrypto.cryptoWaitReady)()]);

          if (hasMeta && !this._isReady && cryptoReady) {
            this._isReady = true;
            this.emit('ready', this);
          }

          (0, _classPrivateFieldLooseBase2.default)(this, _healthTimer)[_healthTimer] = setInterval(() => {
            this._rpcCore.system.health().toPromise().catch(() => {// ignore
            });
          }, KEEPALIVE_INTERVAL);
        } catch (_error) {
          const error = new Error(`FATAL: Unable to initialize the API: ${_error.message}`);
          l.error(error);
          this.emit('error', error);
        }
      }
    });
    Object.defineProperty(this, _onProviderDisconnect, {
      writable: true,
      value: () => {
        this.emit('disconnected');

        this._isConnected.next(false);

        if ((0, _classPrivateFieldLooseBase2.default)(this, _healthTimer)[_healthTimer]) {
          clearInterval((0, _classPrivateFieldLooseBase2.default)(this, _healthTimer)[_healthTimer]);
          (0, _classPrivateFieldLooseBase2.default)(this, _healthTimer)[_healthTimer] = null;
        }
      }
    });
    Object.defineProperty(this, _onProviderError, {
      writable: true,
      value: error => {
        this.emit('error', error);
      }
    });

    if (!this.hasSubscriptions) {
      l.warn('Api will be available in a limited mode since the provider does not support subscriptions');
    } // all injected types added to the registry for overrides


    this.registry.setKnownTypes(options); // We only register the types (global) if this is not a cloned instance.
    // Do right up-front, so we get in the user types before we are actually
    // doing anything on-chain, this ensures we have the overrides in-place

    if (!options.source) {
      this.registerTypes(options.types);
    } else {
      (0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries] = (0, _classPrivateFieldLooseBase2.default)(options.source, _registries)[_registries];
    }

    this._rpc = this._decorateRpc(this._rpcCore, this._decorateMethod);
    this._rx.rpc = this._decorateRpc(this._rpcCore, this._rxDecorateMethod);
    this._queryMulti = this._decorateMulti(this._decorateMethod);
    this._rx.queryMulti = this._decorateMulti(this._rxDecorateMethod);
    this._rx.signer = options.signer;

    this._rpcCore.setRegistrySwap(hash => this.getBlockRegistry(hash));

    this._rpcCore.provider.on('disconnected', (0, _classPrivateFieldLooseBase2.default)(this, _onProviderDisconnect)[_onProviderDisconnect]);

    this._rpcCore.provider.on('error', (0, _classPrivateFieldLooseBase2.default)(this, _onProviderError)[_onProviderError]);

    this._rpcCore.provider.on('connected', (0, _classPrivateFieldLooseBase2.default)(this, _onProviderConnect)[_onProviderConnect]); // If the provider was instantiated earlier, and has already emitted a
    // 'connected' event, then the `on('connected')` won't fire anymore. To
    // cater for this case, we call manually `this._onProviderConnect`.


    if (this._rpcCore.provider.isConnected) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (0, _classPrivateFieldLooseBase2.default)(this, _onProviderConnect)[_onProviderConnect]();
    }
  }
  /**
   * @description Sets up a registry based on the block hash defined
   */


  async getBlockRegistry(blockHash) {
    // shortcut in the case where we have an immediate-same request
    const lastBlockHash = (0, _util.u8aToU8a)(blockHash);

    const existingViaHash = (0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries].find(r => r.lastBlockHash && (0, _util.u8aEq)(lastBlockHash, r.lastBlockHash));

    if (existingViaHash) {
      return existingViaHash;
    } // ensure we have everything required


    (0, _util.assert)(this._genesisHash && this._runtimeVersion, 'Cannot retrieve data on an uninitialized chain'); // We have to assume that on the RPC layer the calls used here does not call back into
    // the registry swap, so getHeader & getRuntimeVersion should not be historic

    const header = this._genesisHash.eq(blockHash) ? {
      number: DEFAULT_BLOCKNUMBER,
      parentHash: this._genesisHash
    } : await this._rpcCore.chain.getHeader(blockHash).toPromise();
    (0, _util.assert)((header === null || header === void 0 ? void 0 : header.parentHash) && !header.parentHash.isEmpty, 'Unable to retrieve header and parent from supplied hash'); // get the runtime version, either on-chain or via an known upgrade history

    const [firstVersion, lastVersion] = (0, _typesKnown.getUpgradeVersion)(this._genesisHash, header.number.unwrap());
    const version = firstVersion && (lastVersion || firstVersion.specVersion.eq(this._runtimeVersion.specVersion)) ? {
      specName: this._runtimeVersion.specName,
      specVersion: firstVersion.specVersion
    } : await this._rpcCore.state.getRuntimeVersion(header.parentHash).toPromise(); // check for pre-existing registries

    const existingViaVersion = (0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries].find(r => r.specVersion.eq(version.specVersion));

    if (existingViaVersion) {
      existingViaVersion.lastBlockHash = lastBlockHash;
      return existingViaVersion;
    } // nothing has been found, construct new


    const registry = new _types.TypeRegistry();
    registry.setChainProperties(this.registry.getChainProperties());
    registry.setKnownTypes(this._options);
    registry.register((0, _typesKnown.getSpecTypes)(registry, this._runtimeChain, version.specName, version.specVersion));

    if (registry.knownTypes.typesBundle) {
      this._adjustBundleTypes(registry, this._runtimeChain, version.specName);
    } // retrieve the metadata now that we have all types set


    const metadata = await this._rpcCore.state.getMetadata(header.parentHash).toPromise();
    const result = {
      isDefault: false,
      lastBlockHash,
      metadata,
      metadataConsts: null,
      registry,
      specVersion: version.specVersion
    }; // TODO: Not convinced (yet) that we really want to re-decorate, keep on ice since it does muddle-up
    // this.injectMetadata(metadata, false);

    registry.setMetadata(metadata);

    (0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries].push(result);

    return result;
  }

  async _loadMeta() {
    var _this$_options$source;

    const genesisHash = await this._rpcCore.chain.getBlockHash(0).toPromise(); // on re-connection to the same chain, we don't want to re-do everything from chain again

    if (this._isReady && !this._options.source && genesisHash.eq(this._genesisHash)) {
      return true;
    }

    if (this._genesisHash) {
      l.warn('Connection to new genesis detected, re-initializing');
    }

    this._genesisHash = genesisHash;

    if ((0, _classPrivateFieldLooseBase2.default)(this, _updateSub)[_updateSub]) {
      (0, _classPrivateFieldLooseBase2.default)(this, _updateSub)[_updateSub].unsubscribe();
    }

    const {
      metadata = {}
    } = this._options; // only load from on-chain if we are not a clone (default path), alternatively
    // just use the values from the source instance provided

    this._runtimeMetadata = ((_this$_options$source = this._options.source) === null || _this$_options$source === void 0 ? void 0 : _this$_options$source._isReady) ? await this._metaFromSource(this._options.source) : await this._metaFromChain(metadata);
    return this._initFromMeta(this._runtimeMetadata);
  } // eslint-disable-next-line @typescript-eslint/require-await


  async _metaFromSource(source) {
    this._extrinsicType = source.extrinsicVersion;
    this._runtimeChain = source.runtimeChain;
    this._runtimeVersion = source.runtimeVersion;
    this._genesisHash = source.genesisHash;
    const methods = []; // manually build a list of all available methods in this RPC, we are
    // going to filter on it to align the cloned RPC without making a call

    Object.keys(source.rpc).forEach(section => {
      Object.keys(source.rpc[section]).forEach(method => {
        methods.push(`${section}_${method}`);
      });
    });

    this._filterRpcMethods(methods);

    return source.runtimeMetadata;
  } // subscribe to metadata updates, inject the types on changes


  _subscribeUpdates() {
    if ((0, _classPrivateFieldLooseBase2.default)(this, _updateSub)[_updateSub] || !this.hasSubscriptions) {
      return;
    }

    (0, _classPrivateFieldLooseBase2.default)(this, _updateSub)[_updateSub] = this._rpcCore.state.subscribeRuntimeVersion().pipe((0, _operators.switchMap)(version => {
      var _this$_runtimeVersion;

      return (// only retrieve the metadata when the on-chain version has been changed
        ((_this$_runtimeVersion = this._runtimeVersion) === null || _this$_runtimeVersion === void 0 ? void 0 : _this$_runtimeVersion.specVersion.eq(version.specVersion)) ? (0, _rxjs.of)(false) : this._rpcCore.state.getMetadata().pipe((0, _operators.map)(metadata => {
          l.log(`Runtime version updated to spec=${version.specVersion.toString()}, tx=${version.transactionVersion.toString()}`);
          this._runtimeMetadata = metadata;
          this._runtimeVersion = version;
          this._rx.runtimeVersion = version; // update the default registry version

          const thisRegistry = (0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries].find(({
            isDefault
          }) => isDefault);

          (0, _util.assert)(thisRegistry, 'Initialization error, cannot find the default registry');
          thisRegistry.metadata = metadata;
          thisRegistry.metadataConsts = null;
          thisRegistry.specVersion = version.specVersion;
          thisRegistry.registry.register((0, _typesKnown.getSpecTypes)(thisRegistry.registry, this._runtimeChain, version.specName, version.specVersion));
          this.injectMetadata(metadata, false, thisRegistry.registry);
          return true;
        }))
      );
    })).subscribe();
  }

  _adjustBundleTypes(registry, chain, specName) {
    // adjust known type aliases
    registry.knownTypes.typesAlias = (0, _typesKnown.getSpecAlias)(registry, chain, specName); // FIXME For the first round, we are not adjusting the user-injected RPCs
    // inject any user-level RPCs now that we have the chain/spec
    // this._rpcCore.addUserInterfaces(getSpecRpc(this.registry, chain, specName));
    // const extraRpc = this._decorateRpc(this._rpcCore, this._decorateMethod);
    // // FIXME this is a mess
    // Object.entries(extraRpc).forEach(([section, value]): void => {
    //   if (this._rpc) {
    //     if (!this._rpc[section as 'author']) {
    //       this._rpc[section as 'author'] = {} as DecoratedRpcSection<ApiType, RpcInterface['author']>;
    //     }
    //     Object.entries(value).forEach(([name, method]): void => {
    //       if (this._rpc && !this._rpc[section as 'author'][name as 'hasKey']) {
    //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //         this._rpc[section as 'author'][name as 'hasKey'] = method;
    //       }
    //     });
    //   }
    // });
  }

  async _metaFromChain(optMetadata) {
    var _this$_genesisHash;

    const [runtimeVersion, chain, chainProps] = await Promise.all([this._rpcCore.state.getRuntimeVersion().toPromise(), this._rpcCore.system.chain().toPromise(), this._rpcCore.system.properties().toPromise()]); // set our chain version & genesisHash as returned

    this._runtimeChain = chain;
    this._runtimeVersion = runtimeVersion;
    this._rx.runtimeVersion = runtimeVersion; // adjust types based on bundled info

    if (this.registry.knownTypes.typesBundle) {
      this._adjustBundleTypes(this.registry, chain, runtimeVersion.specName);
    } // do the setup for the specific chain


    this.registry.setChainProperties(chainProps);
    this.registerTypes((0, _typesKnown.getSpecTypes)(this.registry, chain, runtimeVersion.specName, runtimeVersion.specVersion));

    this._subscribeUpdates(); // filter the RPC methods (this does an rpc-methods call)


    await this._filterRpc(); // retrieve metadata, either from chain  or as pass-in via options

    const metadataKey = `${((_this$_genesisHash = this._genesisHash) === null || _this$_genesisHash === void 0 ? void 0 : _this$_genesisHash.toHex()) || '0x'}-${runtimeVersion.specVersion.toString()}`;
    const metadata = metadataKey in optMetadata ? new _types.Metadata(this.registry, optMetadata[metadataKey]) : await this._rpcCore.state.getMetadata().toPromise(); // setup the initial registry, when we have none

    if (!(0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries].length) {
      (0, _classPrivateFieldLooseBase2.default)(this, _registries)[_registries].push({
        isDefault: true,
        lastBlockHash: null,
        metadata,
        metadataConsts: null,
        registry: this.registry,
        specVersion: runtimeVersion.specVersion
      });
    } // get unique types & validate


    metadata.getUniqTypes(false);
    return metadata;
  }

  async _initFromMeta(metadata) {
    // inject types based on metadata, if applicable
    this.registerTypes((0, _typesKnown.getMetadataTypes)(this.registry, metadata.version));
    const metaExtrinsic = metadata.asLatest.extrinsic; // only inject if we are not a clone (global init)

    if (metaExtrinsic.version.gt(_util.BN_ZERO)) {
      this._extrinsicType = metaExtrinsic.version.toNumber();
    } else if (!this._options.source) {
      // detect the extrinsic version in-use based on the last block
      const {
        block: {
          extrinsics: [firstTx]
        }
      } = await this._rpcCore.chain.getBlock().toPromise(); // If we haven't sync-ed to 1 yes, this won't have any values

      this._extrinsicType = firstTx ? firstTx.type : _Extrinsic.LATEST_EXTRINSIC_VERSION;
    }

    this._rx.extrinsicType = this._extrinsicType;
    this._rx.genesisHash = this._genesisHash;
    this._rx.runtimeVersion = this._runtimeVersion;
    this.injectMetadata(metadata, true); // derive is last, since it uses the decorated rx

    this._rx.derive = this._decorateDeriveRx(this._rxDecorateMethod);
    this._derive = this._decorateDerive(this._decorateMethod);
    return true;
  }

}

exports.default = Init;