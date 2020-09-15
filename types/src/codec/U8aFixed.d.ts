import { AnyU8a, Constructor, Registry } from '../types';
import Raw from './Raw';
export declare type BitLength = 8 | 16 | 32 | 64 | 128 | 160 | 256 | 264 | 512 | 520 | 1024 | 2048;
/**
 * @name U8aFixed
 * @description
 * A U8a that manages a a sequence of bytes up to the specified bitLength. Not meant
 * to be used directly, rather is should be subclassed with the specific lengths.
 */
export default class U8aFixed extends Raw {
    constructor(registry: Registry, value?: AnyU8a, bitLength?: BitLength);
    static with(bitLength: BitLength, typeName?: string): Constructor<U8aFixed>;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
