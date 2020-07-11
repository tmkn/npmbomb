import * as path from "path";
import * as fs from "fs";

import { Extractor } from "../../packageanalyzer/src/extractor";

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
        description: pa.getData("description")
    }));
})();

function createOutDir(outDir: string): void {
    fs.mkdirSync(outDir, { recursive: true });
}
