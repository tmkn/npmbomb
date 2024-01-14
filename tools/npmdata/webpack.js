const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: {
        npmdata: "./tools/npmdata/npmdata.ts"
    },
    mode: "production",
    target: "node",
    node: {
        __dirname: false,
        __filename: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: [/node_modules/]
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [new CleanWebpackPlugin()],
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "build")
    }
};
