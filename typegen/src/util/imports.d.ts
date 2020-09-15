export interface ModuleTypes {
    types: Record<string, unknown>;
}
declare type TypeExist = Record<string, boolean>;
declare type TypeExistMap = Record<string, TypeExist>;
export interface TypeImports {
    codecTypes: TypeExist;
    extrinsicTypes: TypeExist;
    genericTypes: TypeExist;
    ignoredTypes: string[];
    localTypes: TypeExistMap;
    primitiveTypes: TypeExist;
    typesTypes: TypeExist;
    definitions: Record<string, ModuleTypes>;
    typeToModule: Record<string, string>;
}
/** @internal */
export declare function setImports(allDefs: Record<string, ModuleTypes>, imports: TypeImports, types: string[]): void;
/** @internal */
export declare function createImports(importDefinitions: Record<string, Record<string, ModuleTypes>>, { types }?: ModuleTypes): TypeImports;
export {};
