//import { CheckerPlugin } from "awesome-typescript-loader";

import * as path from "path";
import * as webpack from "webpack";
import { cwd } from "process"

const config: webpack.Configuration = {
    mode : "development",
    entry : "./src/main.ts",
    output: {
        path: path.resolve("C:\\Users\\stevenz\\Workspace\\puzzlehunt-tools\\grid-editor", "public", "js"),
        filename: "main.js"
    },
    
    resolve: {
        extensions: [ ".js", ".ts", ".tsx"  ]
    },

    devtool: "source-map",

    module: {
        /*loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ],*/
        
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },

    performance: {
        hints: false
    },

    watch: true
};

export default config;
