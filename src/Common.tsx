interface IPackageNaming {
    name: string;
    scope?: string;
    version?: string;
}

export function getPackageNaming(str: string): IPackageNaming {
    throw new Error(`Not implemented`);
}

//todo refactor use getPackageNaming instead
export function getNameVersion(pkg: string): [string, string] {
    const parts = pkg.split("@");

    if (parts.length < 2) {
        return [parts[0], ""];
    }

    return [parts[0], parts[1]];
}
