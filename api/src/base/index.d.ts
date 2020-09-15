import { RpcInterface } from '@polkadot/rpc-core/types';
import { Hash, RuntimeVersion } from '@polkadot/types/interfaces';
import { CallFunction, RegistryError, SignerPayloadRawBase } from '@polkadot/types/types';
import { ApiInterfaceRx, ApiOptions, ApiTypes, DecoratedRpc, DecorateMethod, QueryableConsts, QueryableStorage, QueryableStorageMulti, SubmittableExtrinsics, Signer } from '../types';
import { Metadata, Text } from '@polkadot/types';
import Init from './Init';
interface KeyringSigner {
    sign(message: Uint8Array): Uint8Array;
}
interface SignerRawOptions {
    signer?: Signer;
}
export default abstract class ApiBase<ApiType extends ApiTypes> extends Init<ApiType> {
    /**
     * @description Create an instance of the class
     *
     * @param options Options object to create API instance or a Provider instance
     *
     * @example
     * <BR>
     *
     * ```javascript
     * import Api from '@polkadot/api/promise';
     *
     * const api = new Api().isReady();
     *
     * api.rpc.subscribeNewHeads((header) => {
     *   console.log(`new block #${header.number.toNumber()}`);
     * });
     * ```
     */
    constructor(options: ApiOptions | undefined, type: ApiTypes, decorateMethod: DecorateMethod<ApiType>);
    /**
     * @description Contains the parameter types (constants) of all modules.
     *
     * The values are instances of the appropriate type and are accessible using `section`.`constantName`,
     *
     * @example
     * <BR>
     *
     * ```javascript
     * console.log(api.consts.democracy.enactmentPeriod.toString())
     * ```
     */
    get consts(): QueryableConsts<ApiType>;
    /**
     * @description Derived results that are injected into the API, allowing for combinations of various query results.
     *
     * @example
     * <BR>
     *
     * ```javascript
     * api.derive.chain.bestNumber((number) => {
     *   console.log('best number', number);
     * });
     * ```
     */
    get derive(): ReturnType<ApiBase<ApiType>['_decorateDerive']>;
    /**
     * @description  Returns the version of extrinsics in-use on this chain
     */
    get extrinsicVersion(): number;
    /**
     * @description Contains the genesis Hash of the attached chain. Apart from being useful to determine the actual chain, it can also be used to sign immortal transactions.
     */
    get genesisHash(): Hash;
    /**
     * @description `true` when subscriptions are supported
     */
    get hasSubscriptions(): boolean;
    /**
     * @description true is the underlying provider is connected
     */
    get isConnected(): boolean;
    /**
     * @description The library information name & version (from package.json)
     */
    get libraryInfo(): string;
    /**
     * @description Contains all the chain state modules and their subsequent methods in the API. These are attached dynamically from the runtime metadata.
     *
     * All calls inside the namespace, is denoted by `section`.`method` and may take an optional query parameter. As an example, `api.query.timestamp.now()` (current block timestamp) does not take parameters, while `api.query.system.account(<accountId>)` (retrieving the associated nonce & balances for an account), takes the `AccountId` as a parameter.
     *
     * @example
     * <BR>
     *
     * ```javascript
     * api.query.system.account(<accountId>, ([nonce, balance]) => {
     *   console.log('new free balance', balance.free, 'new nonce', nonce);
     * });
     * ```
     */
    get query(): QueryableStorage<ApiType>;
    /**
     * @description Allows for the querying of multiple storage entries and the combination thereof into a single result. This is a very optimal way to make multiple queries since it only makes a single connection to the node and retrieves the data over one subscription.
     *
     * @example
     * <BR>
     *
     * ```javascript
     * const unsub = await api.queryMulti(
     *   [
     *     // you can include the storage without any parameters
     *     api.query.balances.totalIssuance,
     *     // or you can pass parameters to the storage query
     *     [api.query.system.account, '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY']
     *   ],
     *   ([existential, [, { free }]]) => {
     *     console.log(`You have ${free.sub(existential)} more than the existential deposit`);
     *
     *     unsub();
     *   }
     * );
     * ```
     */
    get queryMulti(): QueryableStorageMulti<ApiType>;
    /**
     * @description Contains all the raw rpc sections and their subsequent methods in the API as defined by the jsonrpc interface definitions. Unlike the dynamic `api.query` and `api.tx` sections, these methods are fixed (although extensible with node upgrades) and not determined by the runtime.
     *
     * RPC endpoints available here allow for the query of chain, node and system information, in addition to providing interfaces for the raw queries of state (using known keys) and the submission of transactions.
     *
     * @example
     * <BR>
     *
     * ```javascript
     * api.rpc.chain.subscribeNewHeads((header) => {
     *   console.log('new header', header);
     * });
     * ```
     */
    get rpc(): DecoratedRpc<ApiType, RpcInterface>;
    /**
     * @description Contains the chain information for the current node.
     */
    get runtimeChain(): Text;
    /**
     * @description Yields the current attached runtime metadata. Generally this is only used to construct extrinsics & storage, but is useful for current runtime inspection.
     */
    get runtimeMetadata(): Metadata;
    /**
     * @description Contains the version information for the current runtime.
     */
    get runtimeVersion(): RuntimeVersion;
    /**
     * @description The underlying Rx API interface
     */
    get rx(): Pick<ApiInterfaceRx, 'tx' | 'rpc'>;
    /**
     * @description The type of this API instance, either 'rxjs' or 'promise'
     */
    get type(): ApiTypes;
    /**
     * @description Contains all the extrinsic modules and their subsequent methods in the API. It allows for the construction of transactions and the submission thereof. These are attached dynamically from the runtime metadata.
     *
     * @example
     * <BR>
     *
     * ```javascript
     * api.tx.balances
     *   .transfer(<recipientId>, <balance>)
     *   .signAndSend(<keyPair>, ({status}) => {
     *     console.log('tx status', status.asFinalized.toHex());
     *   });
     * ```
     */
    get tx(): SubmittableExtrinsics<ApiType>;
    /**
     * @description Connect from the underlying provider, halting all network traffic
     */
    connect(): Promise<void>;
    /**
     * @description Disconnect from the underlying provider, halting all network traffic
     */
    disconnect(): Promise<void>;
    /**
     * @description Finds the definition for a specific [[CallFunction]] based on the index supplied
     */
    findCall(callIndex: Uint8Array | string): CallFunction;
    /**
     * @description Finds the definition for a specific [[RegistryError]] based on the index supplied
     */
    findError(errorIndex: Uint8Array | string): RegistryError;
    /**
     * @description Set an external signer which will be used to sign extrinsic when account passed in is not KeyringPair
     */
    setSigner(signer: Signer): void;
    /**
     * @description Signs a raw signer payload, string or Uint8Array
     */
    sign(address: KeyringSigner | string, data: SignerPayloadRawBase, { signer }?: SignerRawOptions): Promise<string>;
}
export {};
