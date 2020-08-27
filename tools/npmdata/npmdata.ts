import * as path from "path";
import * as fs from "fs";

import { Extractor } from "../../packageanalyzer/src/extractor";
import { PackageAnalytics } from "../../packageanalyzer/src/analyzers/package";

import { IDependencyTreeStructure, IDependencyTreeConfig, ITreeData } from "./utils";

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
    const lookup = createLookup(pa);

    return {
        data: [...lookup.values()],
        tree: createTree(pa, lookup)
    };
}

function createLookup(pa: PackageAnalytics): Map<string, ITreeData> {
    const lookup: Map<string, ITreeData> = new Map();

    pa.visit(dep => {
        const id = getId(dep);

        if (!lookup.has(id))
            lookup.set(id, {
                id: lookup.size,
                name: dep.name,
                version: dep.version,
                count: dep.transitiveDependenciesCount
            });
    }, true);

    return lookup;
}

function createTree(
    pa: PackageAnalytics,
    lookup: Map<string, ITreeData>
): IDependencyTreeStructure {
    const id = getId(pa);
    const data = lookup.get(id);

    if (typeof data === "undefined") throw new Error(`Couldn't find id (${id}) for ${pa.fullName}`);

    const root: IDependencyTreeStructure = {
        id: data.id
    };

    for (const dependency of pa.directDependencies) {
        const dependencies = root?.dependencies ?? [];

        dependencies.push(createTree(dependency, lookup));

        root.dependencies = dependencies;
    }

    return root;
}
