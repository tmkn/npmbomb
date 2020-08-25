import * as path from "path";
import * as fs from "fs";

import { Extractor } from "../../packageanalyzer/src/extractor";
import { PackageAnalytics } from "../../packageanalyzer/src/analyzers/package";

import {
    IDependencyTreeStructure,
    IDependencyTreeConfig,
    ITreeData,
    TreeLookupData
} from "./utils";

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
        tree: createDependencyTree(pa)
    }));
})();

function createOutDir(outDir: string): void {
    fs.mkdirSync(outDir, { recursive: true });
}

const getId = (pa: PackageAnalytics) => pa.fullName;

function createDependencyTree(pa: PackageAnalytics): IDependencyTreeConfig {
    return {
        data: createLookup(pa),
        tree: createTree(pa)
    };
}

function createLookup(pa: PackageAnalytics): TreeLookupData[] {
    const lookup: Map<string, ITreeData> = new Map();

    pa.visit(dep => {
        const id = getId(dep);

        if (!lookup.has(id))
            lookup.set(id, {
                name: dep.name,
                version: dep.version,
                count: dep.transitiveDependenciesCount
            });
    }, true);

    return [...lookup.entries()];
}

function createTree(pa: PackageAnalytics): IDependencyTreeStructure {
    const root: IDependencyTreeStructure = {
        id: getId(pa)
    };

    for (const dependency of pa.directDependencies) {
        const dependencies = root?.dependencies ?? [];

        dependencies.push(createTree(dependency));

        root.dependencies = dependencies;
    }

    return root;
}
