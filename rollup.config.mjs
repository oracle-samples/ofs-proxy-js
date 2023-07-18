/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
export default {
    input: "src/OFS.ts",
    output: {
        name: "OFS",
        file: "dist/ofs.es.js",
        format: "es",
    },
    plugins: [
        typescript(),
        terser({
            compress: {
                unsafe: true,
            },
            mangle: true,
            keep_fnames: true,
            keep_classnames: true,
        }),
    ],
};
