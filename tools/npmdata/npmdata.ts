import * as path from "path";
import * as fs from "fs";

import { Extractor } from "../../packageanalyzer/src/extractor";
import { PackageAnalytics } from "../../packageanalyzer/src/analyzers/package";

const [, , npmDump] = process.argv;

console.log(npmDump);

(async () => {
    const inputData = path.join(__dirname, `..`, `packages.txt`);
    const outputDir = path.join(__dirname, `..`, `data`);

    createOutDir(outputDir);

    await Extractor.Extract(inputData, npmDump, outputDir, pa => ({
        name: pa.name,
        version: pa.version,
        directDependencies: pa.directDependencyCount,
        dependencies: pa.transitiveDependenciesCount,
        distinctDependencies: pa.distinctByVersionCount,
        description: pa.getData("description"),
        dependencyTree: createDependencyTree(pa)
    }));
})();

function createOutDir(outDir: string): void {
    fs.mkdirSync(outDir, { recursive: true });
}

interface IDependencyTreeData {
    n: string;
    v: string;
    c: number;
    l?: boolean;
    d: IDependencyTreeData[];
}

function createDependencyTree(pa: PackageAnalytics, root?: IDependencyTreeData): IDependencyTreeData {
    const parent: IDependencyTreeData = {
        n: pa.name,
        v: pa.version,
        c: pa.transitiveDependenciesCount,
        d: []
    };

    if(pa.isLoop) {
        parent.l = true;
    }

    for (const dependency of pa.directDependencies) {
        parent.d.push(createDependencyTree(dependency));
    }

    return parent;
}
