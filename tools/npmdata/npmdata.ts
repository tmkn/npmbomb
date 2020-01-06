import * as path from "path";
import * as fs from "fs";
import * as readline from "readline";

import { Extractor } from "@tmkn/packageanalyzer";

const [,, foo] = process.argv;

console.log(foo);

(async () => {
    const inputData = path.join(__dirname, `packages.txt`);
    const outputDir = path.join(__dirname, `data`);
    const rl = readline.createInterface({
        input: fs.createReadStream(inputData)
    });
    let i = 1;

    createOutDir(outputDir);

    await Extractor.Extract(inputData, foo, outputDir, pa => JSON.stringify({name: pa.name}) as any);
})();

function createOutDir(outDir: string): void {
    fs.mkdirSync(outDir, { recursive: true });
}
