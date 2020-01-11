import * as path from "path";
import * as fs from "fs";

import { Extractor } from "../../packageanalyzer/src/extractor";

const [,, foo] = process.argv;

console.log(foo);

(async () => {
    const inputData = path.join(__dirname, `..`, `..`, `..`, `packages.txt`);
    const outputDir = path.join(__dirname, `..`, `..`, `..`, `data`);

    createOutDir(outputDir);

    await Extractor.Extract(inputData, foo, outputDir, pa => ({
        name: pa.name,
        dependencies: pa.transitiveDependenciesCount,
        distinct: pa.distinctByVersionCount,
        description: pa.getData("description")
    }));
})();

function createOutDir(outDir: string): void {
    fs.mkdirSync(outDir, { recursive: true });
}
