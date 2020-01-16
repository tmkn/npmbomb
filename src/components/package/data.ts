import { IPackageInfo } from "./Package";

export const data: Map<string, IPackageInfo> = new Map();
data.set("typescript", {
    name: "typescript",
    version: "3.5.1",
    dependencies: 0,
    description: "TypeScript is a language for application scale JavaScript development"
});
data.set("webpack", {
    name: "webpack",
    version: "4.6.1",
    dependencies: 489,
    description:
        "Packs CommonJs/AMD modules for the browser. Allows to split your codebase into multiple bundles, which can be loaded on demand. Support loaders to preprocess files, i.e. json, jsx, es7, css, less, ... and your custom stuff."
});
data.set("react", {
    name: "react",
    version: "1.0.5",
    dependencies: 15,
    description: "React is a JavaScript library for building user interfaces."
});