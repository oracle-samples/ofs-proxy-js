/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { createReadStream, readFileSync } from "fs";
import { OFSCredentials } from "../../src/model";
import { OFS } from "../../src/OFS";
import { getTestCredentials } from "../test_credentials";
import myOldCredentials from "../credentials_test.json";
import { th } from "@faker-js/faker";

var myProxy: OFS;

// Setup info
beforeAll(() => {
    const credentials = getTestCredentials();
    myProxy = new OFS(credentials);
    if ("instance" in credentials) {
        expect(myProxy.instance).toBe(credentials.instance);
    } else {
        expect(myProxy.baseURL).toBe(myProxy.baseURL);
    }
});

// Teardown info
var activityList: number[] = [];
afterAll(() => {
    activityList.forEach(async (aid) => {
        await myProxy.deleteActivity(aid);
    });
});

test("Get Subscriptions", async () => {
    //const myProxy = new OFS(myCredentials);
    var result = await myProxy.getSubscriptions();
    try {
        expect(result.status).toBe(200);
    } catch (error) {
        console.error(result);
        throw error;
    }
});

test("Get Subscriptions with old credentials style", async () => {
    //const myProxy = new OFS(myCredentials);
    var myProxyOld = new OFS(myOldCredentials);
    var result = await myProxyOld.getSubscriptions();
    try {
        expect(result.status).toBe(200);
    } catch (error) {
        console.error(result);
        throw error;
    }
});

test.skip("Update Plugin (path)", async () => {
    var result = await myProxy.importPlugins("test/test_plugin.xml");
    try {
        expect(result.status).toBe(204);
    } catch (error) {
        console.error(result);
        throw error;
    }
});

test.skip("Update Plugin (buffer)", async () => {
    var result = await myProxy.importPlugins(
        undefined,
        readFileSync("test/test_plugin.xml").toString()
    );
    try {
        expect(result.status).toBe(204);
    } catch (error) {
        console.error(result);
        throw error;
    }
});

test("Get Users No offset", async () => {
    var result = await myProxy.getUsers();
    expect(result.status).toBe(200);
    expect(result.data.totalResults).toBeGreaterThan(200);
    expect(result.data.items.length).toEqual(result.data.limit);
    expect(result.data.items[0].login).toBe("admin");
});

test("Get Users with offset", async () => {
    var result = await myProxy.getUsers(20);
    expect(result.status).toBe(200);
    expect(result.data.totalResults).toBeGreaterThan(200);
    expect(result.data.offset).toBe(20);
    expect(result.data.limit).toBe(100);
    expect(result.data.items.length).toEqual(result.data.limit);
    expect(result.data.items[0].login).not.toBe("admin");
});

test("Get Users with offset and limit", async () => {
    var result = await myProxy.getUsers(20, 75);
    expect(result.status).toBe(200);
    expect(result.data.totalResults).toBeGreaterThan(200);
    expect(result.data.offset).toBe(20);
    expect(result.data.limit).toBe(75);
    expect(result.data.items.length).toEqual(result.data.limit);
    expect(result.data.items[0].login).not.toBe("admin");
});

test("Get User Details", async () => {
    var result = await myProxy.getUserDetails("admin");
    expect(result.status).toBe(200);
    expect(result.data.login).toBe("admin");
});

test("Get all Users", async () => {
    var result = await myProxy.getAllUsers();
    expect(result.totalResults).toBeGreaterThan(200);
    expect(result.items.length).toEqual(result.totalResults);
    expect(result.items[0].login).toBe("admin");
}, 30000);

test("Get Resources No offset", async () => {
    var result = await myProxy.getResources();
    expect(result.status).toBe(200);
    expect(result.data.totalResults).toBeGreaterThan(0);
    expect(result.data.items.length).toBeGreaterThan(0);
    expect(result.data.limit).toBe(100);
    expect(result.data.offset).toBe(0);
    expect(result.data.items[0]).toHaveProperty("resourceId");
    expect(result.data.items[0]).toHaveProperty("name");
    expect(result.data.items[0]).toHaveProperty("status");
    expect(result.data.items[0]).toHaveProperty("resourceType");
});

test("Get Resources with limit", async () => {
    var result = await myProxy.getResources({ limit: 5 });
    expect(result.status).toBe(200);
    expect(result.data.totalResults).toBeGreaterThan(0);
    expect(result.data.items.length).toBeLessThanOrEqual(5);
    expect(result.data.limit).toBe(5);
    expect(result.data.offset).toBe(0);
});

test("Get Resources with offset and limit", async () => {
    var result = await myProxy.getResources({ offset: 2, limit: 3 });
    expect(result.status).toBe(200);
    expect(result.data.totalResults).toBeGreaterThan(0);
    expect(result.data.items.length).toBeLessThanOrEqual(3);
    expect(result.data.limit).toBe(3);
    expect(result.data.offset).toBe(2);
});

test("Get Resources with canBeTeamHolder filter", async () => {
    var result = await myProxy.getResources({ canBeTeamHolder: true });
    expect(result.status).toBe(200);
    expect(result.data.totalResults).toBeGreaterThanOrEqual(0);
    if (result.data.items.length > 0) {
        expect(result.data.items[0]).toHaveProperty("resourceId");
        expect(result.data.items[0]).toHaveProperty("name");
    }
});

test("Get Resources with fields filter", async () => {
    var result = await myProxy.getResources({ fields: ["resourceId", "name", "status"] });
    expect(result.status).toBe(200);
    expect(result.data.totalResults).toBeGreaterThan(0);
    expect(result.data.items.length).toBeGreaterThan(0);
    expect(result.data.items[0]).toHaveProperty("resourceId");
    expect(result.data.items[0]).toHaveProperty("name");
    expect(result.data.items[0]).toHaveProperty("status");
});

test("Get all Resources", async () => {
    var result = await myProxy.getAllResources();
    expect(result.totalResults).toBeGreaterThan(0);
    expect(result.items.length).toEqual(result.totalResults);
    if (result.items.length > 0) {
        expect(result.items[0]).toHaveProperty("resourceId");
        expect(result.items[0]).toHaveProperty("name");
        expect(result.items[0]).toHaveProperty("status");
        expect(result.items[0]).toHaveProperty("resourceType");
    }
}, 30000);
