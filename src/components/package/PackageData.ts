import { IDependencyTreeConfig } from "../../../tools/npmdata/utils";

export interface IPackageInfo {
    name: string;
    version: string;
    description: string;
    dependencies: number;
    distinctDependencies: number;
    directDependencies: number;
    /** @deprecated */
    tree: IDependencyTreeConfig;
}
