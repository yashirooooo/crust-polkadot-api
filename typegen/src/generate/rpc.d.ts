import { Definitions } from '@polkadot/types/types';
/** @internal */
export declare function generateRpcTypes(importDefinitions: {
    [importPath: string]: Record<string, Definitions>;
}, dest: string): void;
export default function generateDefaultRpcTypes(): void;
