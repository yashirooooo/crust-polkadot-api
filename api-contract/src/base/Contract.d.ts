import { ApiTypes, DecorateMethod, ObsInnerType } from '@polkadot/api/types';
import { AccountId, Address } from '@polkadot/types/interfaces';
import { CodecArg, IKeyringPair } from '@polkadot/types/types';
import { ApiObject, ContractABIPre, ContractCallOutcome } from '../types';
import BN from 'bn.js';
import { Observable } from 'rxjs';
import { SubmittableResult } from '@polkadot/api';
import Abi from '../Abi';
import { BaseWithTxAndRpcCall } from './util';
declare type ContractCallTypes = 'tx' | 'rpc';
declare type ContractCallResultSubscription<ApiType extends ApiTypes, CallType extends ContractCallTypes> = ApiType extends 'rxjs' ? Observable<ContractCallResult<CallType>> : Promise<ObsInnerType<ContractCallResult<CallType>>>;
export interface ContractCall<ApiType extends ApiTypes, CallType extends ContractCallTypes> {
    send(account: IKeyringPair | string | AccountId | Address): ContractCallResultSubscription<ApiType, CallType>;
}
export declare type ContractCallResult<CallType extends ContractCallTypes> = CallType extends 'rpc' ? Observable<ContractCallOutcome> : Observable<SubmittableResult>;
export default class Contract<ApiType extends ApiTypes> extends BaseWithTxAndRpcCall<ApiType> {
    readonly address: Address;
    constructor(api: ApiObject<ApiType>, abi: ContractABIPre | Abi, decorateMethod: DecorateMethod<ApiType>, address: string | AccountId | Address);
    call(as: 'rpc', message: string, value: BN | number, gasLimit: BN | number, ...params: CodecArg[]): ContractCall<ApiType, 'rpc'>;
    call(as: 'tx', message: string, value: BN | number, gasLimit: BN | number, ...params: CodecArg[]): ContractCall<ApiType, 'tx'>;
    private _createOutcome;
}
export {};
