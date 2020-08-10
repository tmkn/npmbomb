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

interface IDependencyTree {
    name: string;
    version: string;
    transitiveCount: number;
    loop: boolean;
    dependencies: IDependencyTree[];
}

function createDependencyTree(pa: PackageAnalytics, root?: IDependencyTree): IDependencyTree {
    const parent: IDependencyTree = {
        name: pa.name,
        version: pa.version,
        transitiveCount: pa.transitiveDependenciesCount,
        loop: pa.isLoop,
        dependencies: []
    };

    for (const dependency of pa.directDependencies) {
        parent.dependencies.push(createDependencyTree(dependency));
    }

    return parent;
}
