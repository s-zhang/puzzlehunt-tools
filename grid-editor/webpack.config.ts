import * as path from "path";
import * as webpack from "webpack";
import { cwd } from "process"

const config: webpack.Configuration = {
    entry : "./src/main.ts",
    output: {
        path: path.resolve(cwd(), "public", "js"),
        filename: "main.js"
    },
    
    resolve: {
        extensions: [ ".js", ".ts", ".tsx"  ]
    },

    devtool: "source-map",

    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },

    performance: {
        hints: false
    }
};

export default config;
