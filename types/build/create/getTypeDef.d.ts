import { TypeDef } from './types';
interface TypeDefOptions {
    name?: string;
    displayName?: string;
}
export declare function getTypeDef(_type: string, { displayName, name }?: TypeDefOptions, count?: number): TypeDef;
export {};
