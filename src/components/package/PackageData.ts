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

export async function getPackageInfo(
    pkgName: string,
    scope: string | undefined
): Promise<IPackageInfo> {
    const dataUrl: string = scope ? `${scope}/${pkgName}` : pkgName;
    const resp = await fetch(`/data/${dataUrl}.json`);
    const json = await resp.json();

    return json;
}
