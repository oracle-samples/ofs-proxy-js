/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { readFileSync } from "fs";
import { OFS } from "../../src/OFS";

describe("Backward compatibility and OJET/AMD compatibility", () => {
    test("package metadata keeps ESM default and exposes AMD subpath", () => {
        const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

        expect(packageJson.main).toBe("dist/ofs.es.js");
        expect(packageJson.module).toBe("dist/ofs.es.js");

        expect(packageJson.exports["."].default).toBe("./dist/ofs.es.js");
        expect(packageJson.exports["."].types).toBe("./dist/OFS.d.ts");
        expect(packageJson.exports["./amd"].default).toBe(
            "./dist/ofs.amd.js"
        );
    });

    test("rollup config includes AMD output artifact", () => {
        const rollupConfig = readFileSync("rollup.config.mjs", "utf8");

        expect(rollupConfig).toContain('file: "dist/ofs.amd.js"');
        expect(rollupConfig).toContain('format: "amd"');
    });

    test("getResourceAssistants keeps default dateFrom behavior", async () => {
        const proxy = new OFS({
            instance: "example",
            clientId: "client",
            clientSecret: "secret",
        });

        const getMock = jest
            .spyOn(proxy as any, "_get")
            .mockResolvedValue({ status: 200, data: { items: [] } } as any);

        await proxy.getResourceAssistants("resource-1");

        expect(getMock).toHaveBeenCalled();
        const [, queryParams] = getMock.mock.calls[0] as any[];
        expect(queryParams.dateFrom).toBeDefined();
    });

    test("getResourceAssistants/getAllResourceAssistants pass dateTo when provided", async () => {
        const proxy = new OFS({
            instance: "example",
            clientId: "client",
            clientSecret: "secret",
        });

        const getMock = jest
            .spyOn(proxy as any, "_get")
            .mockResolvedValue({ status: 200, data: { items: [] } } as any);

        await proxy.getResourceAssistants("resource-1", {
            dateFrom: "2026-01-01",
            dateTo: "2026-01-31",
        });

        const [, assistantsQueryParams] = getMock.mock.calls[0] as any[];
        expect(assistantsQueryParams.dateTo).toBe("2026-01-31");

        getMock.mockClear();

        await proxy.getAllResourceAssistants("resource-1", {
            dateFrom: "2026-01-01",
            dateTo: "2026-01-31",
        });

        const [, allAssistantsQueryParams] = getMock.mock.calls[0] as any[];
        expect(allAssistantsQueryParams.dateTo).toBe("2026-01-31");
    });
});
