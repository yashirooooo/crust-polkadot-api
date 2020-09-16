import { ModuleTypes } from '../util/imports';
import { TypeImports } from '../util';
/** @internal */
export declare function createGetter(definitions: Record<string, ModuleTypes>, name: string | undefined, type: string, imports: TypeImports): string;
/** @internal */
export declare function generateTsDef(importDefinitions: {
    [importPath: string]: Record<string, ModuleTypes>;
}, outputDir: string, generatingPackage: string): void;
/** @internal */
export default function generateTsDefDefault(): void;
