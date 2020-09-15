import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { AccountIdAndIndex } from '../types';
import { Observable } from 'rxjs';
import { ApiInterfaceRx } from '@polkadot/api/types';
/**
 * @name idAndIndex
 * @param {(Address | AccountId | AccountIndex | string | null)} address - An accounts address in various formats.
 * @description  An array containing the [[AccountId]] and [[AccountIndex]] as optional values.
 * @example
 * <BR>
 *
 * ```javascript
 * api.derive.accounts.idAndIndex('F7Hs', ([id, ix]) => {
 *   console.log(`AccountId #${id} with corresponding AccountIndex ${ix}`);
 * });
 * ```
 */
export declare function idAndIndex(instanceId: string, api: ApiInterfaceRx): (address?: Address | AccountId | AccountIndex | string | null) => Observable<AccountIdAndIndex>;
