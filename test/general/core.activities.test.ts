/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { createReadStream, readFileSync } from "fs";
import { OFSCredentials, OFSBulkUpdateRequest } from "../../src/model";
import { OFS } from "../../src/OFS";
import myCredentials from "../credentials_test.json";
import { faker } from "@faker-js/faker";

var myProxy: OFS;

// Setup info
beforeAll(() => {
    myProxy = new OFS(myCredentials);
    if ("instance" in myCredentials) {
        expect(myProxy.instance).toBe(myCredentials.instance);
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

test("Get Activity Details", async () => {
    var aid = 4225599;
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

test("Bulk Update Activities", async () => {
    // Prepare bulk update data
    var bulkUpdateData: OFSBulkUpdateRequest = {
        activities: [
            {
                apptNumber: "137168134",
                customerName: "Updated Customer 1",
                resourceId: "FLUSA",
            },
            {
                apptNumber: "137167626",
                customerName: "Updated Customer 2",
                resourceId: "FLUSA",
            },
        ],
        updateParameters: {
            identifyActivityBy: "apptNumber",
            ifExistsThenDoNotUpdateFields: [],
            ifInFinalStatusThen: "doNothing",
        },
    };

    // Perform bulk update
    var bulkUpdateResult = await myProxy.bulkUpdateActivity(bulkUpdateData);
    expect(bulkUpdateResult.data.results.length).toBe(2);
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
    var activityData = {
        activityType: "01",
        resourceId: "FLUSA",
    };
    var result = await myProxy.createActivity(activityData);
    expect(result.status).toBe(201);
    var aid = result.data.activityId;
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
    activityList.push(aid);
});

test("Update non valid Activity Details", async () => {
    var aid = -1;
    var result = await myProxy.updateActivity(aid, {});
    expect(result.status).toBe(404);
});

test("Set File Property (Text)", async () => {
    var activityData = {
        activityType: "02",
        resourceId: "NVUSA",
        customerName: faker.person.fullName(),
    };
    var result = await myProxy.createActivity(activityData);
    expect(result.status).toBe(201);
    var aid = result.data.activityId;
    var fileName = "test.txt";
    var fileContent = "Hello World";
    var contentType: string = "text/plain";
    var blob = new Blob([Buffer.from(fileContent)], { type: contentType });
    var result = await myProxy.setActivityFileProperty(
        aid,
        "ATTACHMENT",
        blob,
        fileName,
        contentType
    );
    try {
        expect(result.status).toBe(204);
    } catch (error) {
        console.error(result);
        throw error;
    }
    activityList.push(aid);
});

test("Get File Property (Text)", async () => {
    var activityData = {
        activityType: "02",
        resourceId: "NVUSA",
        customerName: faker.person.fullName(),
    };
    var result = await myProxy.createActivity(activityData);
    expect(result.status).toBe(201);
    var aid = result.data.activityId;
    var fileName = `${faker.lorem.word()}.txt`;
    var fileContent = faker.lorem.paragraphs(5);
    var contentType: string = "text/plain";
    var blob = new Blob([Buffer.from(fileContent)], { type: contentType });
    var result = await myProxy.setActivityFileProperty(
        aid,
        "ATTACHMENT",
        blob,
        fileName,
        contentType
    );
    try {
        expect(result.status).toBe(204);
    } catch (error) {
        console.error(result);
        throw error;
    }
    var result = await myProxy.getActivityFilePropertyMetadata(
        aid,
        "ATTACHMENT"
    );
    try {
        expect(result.status).toBe(200);
        expect(result.data.size).toBe(fileContent.length);
        expect(result.data.mediaType).toBe(contentType);
        expect(result.data.name).toBe(fileName);
    } catch (error) {
        console.error(result);
        throw error;
    }

    var result = await myProxy.getActivityFilePropertyContent(
        aid,
        "ATTACHMENT",
        contentType
    );
    try {
        expect(result.status).toBe(200);
        expect(result.data).toBe(fileContent);
    } catch (error) {
        console.error(result);
        throw error;
    }
    activityList.push(aid);
});

test("Get File Property (Binary)", async () => {
    var activityData = {
        activityType: "02",
        resourceId: "NVUSA",
        customerName: faker.person.fullName(),
    };
    var result = await myProxy.createActivity(activityData);
    expect(result.status).toBe(201);
    var aid = result.data.activityId;
    var fileName = `${faker.lorem.word()}.jpg`;
    var fileContent = readFileSync("test/test_data/test.jpg");
    var contentType: string = "image/jpeg";
    var blob = new Blob([Buffer.from(fileContent)], { type: contentType });
    var result = await myProxy.setActivityFileProperty(
        aid,
        "ATTACHMENT",
        blob,
        fileName,
        contentType
    );
    try {
        expect(result.status).toBe(204);
    } catch (error) {
        console.error(result);
        throw error;
    }
    var result = await myProxy.getActivityFilePropertyMetadata(
        aid,
        "ATTACHMENT"
    );
    try {
        expect(result.status).toBe(200);
        expect(result.data.size).toBe(fileContent.length);
        expect(result.data.mediaType).toBe(contentType);
        expect(result.data.name).toBe(fileName);
    } catch (error) {
        console.error(result);
        throw error;
    }

    var result = await myProxy.getActivityFilePropertyContent(
        aid,
        "ATTACHMENT",
        contentType
    );
    try {
        expect(result.status).toBe(200);
        expect(result.data.size).toBe(fileContent.length);
        //expect(result.data).toBe(fileContent);
    } catch (error) {
        console.error(result);
        throw error;
    }
    activityList.push(aid);
});

test("Get File Property (Full Binary)", async () => {
    var activityData = {
        activityType: "02",
        resourceId: "NVUSA",
        customerName: faker.person.fullName(),
    };
    var result = await myProxy.createActivity(activityData);
    expect(result.status).toBe(201);
    var aid = result.data.activityId;
    var fileName = `${faker.lorem.word()}.jpg`;
    var fileContent = readFileSync("test/test_data/test.jpg");
    var contentType: string = "image/jpeg";
    var blob = new Blob([Buffer.from(fileContent)], { type: contentType });
    var result = await myProxy.setActivityFileProperty(
        aid,
        "ATTACHMENT",
        blob,
        fileName,
        contentType
    );
    try {
        expect(result.status).toBe(204);
    } catch (error) {
        console.error(result);
        throw error;
    }
    var result = await myProxy.getActivityFileProperty(aid, "ATTACHMENT");
    try {
        expect(result.status).toBe(200);
        expect(result.data.size).toBe(fileContent.length);
        expect(result.data.mediaType).toBe(contentType);
        expect(result.data.name).toBe(fileName);
        expect(result.data.content.size).toBe(fileContent.length);
    } catch (error) {
        console.error(result);
        throw error;
    }
});

test("Get Activities", async () => {
    var result = await myProxy.getActivities(
        {
            resources: "SUNRISE",
            dateFrom: "2025-04-01",
            dateTo: "2025-04-02",
        },
        0,
        100
    );
    if (result.status !== 200) {
        console.log(result);
    }
    expect(result.status).toBe(200);
    expect(Array.isArray(result.data.items)).toBe(true);
    // Check if there are items and validate structure
    if (result.data.items.length > 0) {
        expect(result.data.items[0].activityId).toBeGreaterThan(0);
    }
});

test("Search for Activities", async () => {
    var currentDate = new Date().toISOString().split("T")[0];
    var result = await myProxy.searchForActivities(
        {
            dateFrom: currentDate,
            dateTo: currentDate,
            searchForValue: "137165209",
            searchInField: "apptNumber",
        },
        0,
        100
    );
    if (result.status !== 200) {
        console.log(
            `Search for Activities ERROR: ${JSON.stringify(
                result.data,
                null,
                2
            )}`
        );
    } else {
        console.log(
            `Search for Activities Result: ${JSON.stringify(
                result.data,
                null,
                2
            )}`
        );
    }
    expect(result.status).toBe(200);
    expect(Array.isArray(result.data.items)).toBe(true);
    // The exact number may vary, just verify structure
    if (result.data.items.length > 0) {
        expect(result.data.items[0]).toHaveProperty('activityId');
    }
});

test("Get Activities with includeChildren", async () => {
    var result = await myProxy.getActivities(
        {
            resources: "SUNRISE",
            dateFrom: "2025-04-01",
            dateTo: "2025-04-02",
            includeChildren: "all",
        },
        0,
        100
    );
    if (result.status !== 200) {
        console.log(result);
    }
    expect(result.status).toBe(200);
    expect(Array.isArray(result.data.items)).toBe(true);
    // Check if there are items and validate structure
    if (result.data.items.length > 0) {
        expect(result.data.items[0].activityId).toBeGreaterThan(0);
    }
});

test("Get Activities with all the parameters", async () => {
    var result = await myProxy.getActivities(
        {
            resources: "SUNRISE",
            dateFrom: "2025-02-01",
            dateTo: "2025-03-02",
            includeChildren: "all",
            includeNonScheduled: true,
        },
        0,
        100
    );
    if (result.status !== 200) {
        console.log(result);
    }
    expect(result.status).toBe(200);
    expect(Array.isArray(result.data.items)).toBe(true);
    // Check if there are items and validate structure
    if (result.data.items.length > 0) {
        expect(result.data.items[0].activityId).toBeGreaterThan(0);
    }
});

test("Get All Activities with all the parameters", async () => {
    var result = await myProxy.getAllActivities({
        resources: "FLUSA",
        dateFrom: "2025-02-01",
        dateTo: "2025-02-01",
        includeChildren: "all",
        includeNonScheduled: true,
    });
    expect(result.status).toBe(200);
    expect(Array.isArray(result.items)).toBe(true);
    // Check if there are items and validate structure
    if (result.items.length > 0) {
        expect(result.items[0].activityId).toBeGreaterThan(0);
    }
});
test("Get All Activities with incorrect data", async () => {
    var result = await myProxy.getAllActivities({
        resources: "FLUSA",
        dateFrom: "2024-02-01",
        dateTo: "2025-02-01",
        includeChildren: "all",
        includeNonScheduled: true,
    });
    if (result.status !== 200) {
        console.log(result);
    }
    expect(result.status).toBe(400);
    expect(result.data.detail).toContain(
        "Date interval contains more than 31 days"
    );
});
