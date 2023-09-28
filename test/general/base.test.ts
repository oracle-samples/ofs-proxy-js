/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { createReadStream, readFileSync } from "fs";
import { OFSCredentials } from "../../src/model";
import { OFS } from "../../src/OFS";
import myCredentials from "../credentials_test.json";

var myProxy: OFS;

// Setup info
beforeAll(() => {
    myProxy = new OFS(myCredentials);
    expect(myProxy.instance).toBe(myCredentials.instance);
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
    expect(myProxy.instance).toBe(myCredentials.instance);
});

test("Get Activity Details", async () => {
    var aid = 3954799;
    var result = await myProxy.getActivityDetails(aid);
    expect(result.data.activityId).toBe(aid);
});

test("Get non valid Activity Details", async () => {
    var aid = -1;
    var result = await myProxy.getActivityDetails(aid);
    expect(result.status).toBe(400);
});

test("Create Activity", async () => {
    var activityData = {
        activityType: "01",
        resourceId: "FLUSA",
    };
    var result = await myProxy.createActivity(activityData);
    expect(result.status).toBe(201);
    expect(result.data.activityType).toBe(activityData.activityType);
    // For cleanup
    var activityId = result.data.activityId;
    activityList.push(activityId);
});

test("Delete Activity", async () => {
    var activityData = {
        activityType: "01",
        resourceId: "FLUSA",
    };
    var result = await myProxy.createActivity(activityData);
    expect(result.status).toBe(201);
    expect(result.data.activityType).toBe(activityData.activityType);
    var activityId = result.data.activityId;
    activityList.push(activityId);
    var result = await myProxy.deleteActivity(activityId);
    expect(result.status).toBe(204);
});

test("Update Activity Details", async () => {
    var aid = 3954799;
    var initialName = "Gizella Quintero";
    var data = {
        customerName: "NewName",
    };
    var result = await myProxy.updateActivity(aid, data);
    expect(result.data.activityId).toBe(aid);
    expect(result.data.customerName).toBe(data.customerName);
    expect((await myProxy.getActivityDetails(aid)).data.customerName).toBe(
        data.customerName
    );
    expect(
        (await myProxy.updateActivity(aid, { customerName: initialName })).data
            .customerName
    ).toBe(initialName);
});

test("Update non valid Activity Details", async () => {
    var aid = -1;
    var result = await myProxy.updateActivity(aid, {});
    expect(result.status).toBe(404);
});

test("Update Plugin (path)", async () => {
    var result = await myProxy.importPlugins("test/test_plugin.xml");
    expect(result.status).toBe(204);
});

test("Update Plugin (buffer)", async () => {
    var result = await myProxy.importPlugins(
        undefined,
        readFileSync("test/test_plugin.xml").toString()
    );
    expect(result.status).toBe(204);
});
