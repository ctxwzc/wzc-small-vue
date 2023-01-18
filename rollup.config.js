import typescript from "@rollup/plugin-typescript"
import json from '@rollup/plugin-json'
export default {
    input: "./src/index.ts",
    output: [
        {
            format: "cjs",
            file: "lib/wzc-vue.cjs.js",
        },
        {
            format: "es",
            file: "lib/wzc-vue.esm.js",
        }
    ],
    plugins: [
        typescript(),
        json(),
    ]
}