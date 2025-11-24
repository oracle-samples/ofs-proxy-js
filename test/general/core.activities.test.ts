/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { createReadStream, readFileSync } from "fs";
import { OFSCredentials, OFSBulkUpdateRequest } from "../../src/model";
import { OFS } from "../../src/OFS";
import { getTestCredentials } from "../test_credentials";
import { faker } from "@faker-js/faker";

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
    // Use a date range from last week to today
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    const dateFrom = lastWeek.toISOString().split("T")[0];
    const dateTo = today.toISOString().split("T")[0];
    var result = await myProxy.searchForActivities(
        {
            dateFrom,
            dateTo,
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
        expect(result.data.items[0]).toHaveProperty("activityId");
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

test("Get Submitted Forms for Activity", async () => {
    var aid = 3954799; // Activity with known submitted forms
    var result = await myProxy.getSubmittedForms(aid);
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("items");
    expect(result.data).toHaveProperty("totalResults");
    expect(result.data).toHaveProperty("hasMore");
    expect(result.data).toHaveProperty("offset");
    expect(result.data).toHaveProperty("limit");
    expect(Array.isArray(result.data.items)).toBe(true);

    // Verify structure of submitted forms if any exist
    if (result.data.items.length > 0) {
        const firstForm = result.data.items[0];
        expect(firstForm).toHaveProperty("time");
        expect(firstForm).toHaveProperty("user");
        expect(firstForm).toHaveProperty("formIdentifier");
        expect(firstForm.formIdentifier).toHaveProperty("formSubmitId");
        expect(firstForm.formIdentifier).toHaveProperty("formLabel");
        expect(firstForm).toHaveProperty("formDetails");
    }
});

test("Get Submitted Forms with Pagination", async () => {
    var aid = 3954799;
    var result = await myProxy.getSubmittedForms(aid, { offset: 0, limit: 2 });
    expect(result.status).toBe(200);
    expect(result.data.limit).toBe(2);
    expect(result.data.offset).toBe(0);
    expect(Array.isArray(result.data.items)).toBe(true);
});

test("Get Submitted Forms for Non-existent Activity", async () => {
    var aid = -1;
    var result = await myProxy.getSubmittedForms(aid);
    // API returns 200 with empty results for non-existent activities
    expect(result.status).toBe(200);
    expect(result.data.items).toEqual([]);
    expect(result.data.totalResults).toBe(0);
});

test("Get Submitted Forms with Real Data - Activity 3954799", async () => {
    var aid = 3954799;
    var result = await myProxy.getSubmittedForms(aid);

    // Log the complete result for verification
    console.log(`\n========== Submitted Forms for Activity ${aid} ==========`);
    console.log(`Status: ${result.status}`);
    console.log(`Total Results: ${result.data.totalResults}`);
    console.log(`Has More: ${result.data.hasMore}`);
    console.log(`Offset: ${result.data.offset}`);
    console.log(`Limit: ${result.data.limit}`);
    console.log(`Number of items: ${result.data.items.length}`);
    console.log(`Full Response:`, JSON.stringify(result.data, null, 2));
    console.log("==========================================================\n");

    // Verify successful response
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("totalResults");
    expect(result.data).toHaveProperty("items");
    expect(Array.isArray(result.data.items)).toBe(true);

    // If we have data, verify structure
    if (result.data.totalResults > 0 && result.data.items.length > 0) {
        const firstForm = result.data.items[0];
        expect(firstForm).toHaveProperty("time");
        expect(firstForm).toHaveProperty("user");
        expect(typeof firstForm.time).toBe("string");
        expect(typeof firstForm.user).toBe("string");

        // Verify formIdentifier structure
        expect(firstForm.formIdentifier).toHaveProperty("formSubmitId");
        expect(firstForm.formIdentifier).toHaveProperty("formLabel");
        expect(typeof firstForm.formIdentifier.formSubmitId).toBe("string");
        expect(typeof firstForm.formIdentifier.formLabel).toBe("string");

        // Verify formDetails is an object
        expect(firstForm.formDetails).toBeDefined();
        expect(typeof firstForm.formDetails).toBe("object");

        console.log(
            `✓ Verified form structure for: ${firstForm.formIdentifier.formLabel}`
        );
    } else {
        console.log("⚠ No submitted forms found for this activity");
    }
});

test("Get Linked Activities for Activity", async () => {
    var aid = 3951808; // sample activity id
    var result = await myProxy.getLinkedActivities(aid);
    // API may return 200 with an items array or 200 with empty result
    expect(result.status).toBeGreaterThanOrEqual(200);
    expect(result.status).toBeLessThan(400);
    // If data contains items, ensure it's an array
    if (result.data && result.data.items) {
        expect(Array.isArray(result.data.items)).toBe(true);
    }
});

test("Get Activity Link Type", async () => {
    var aid = 3951808; // updated activity id

    // Get linked activities to find an existing link
    var linkedActivitiesResult = await myProxy.getLinkedActivities(aid);
    expect(linkedActivitiesResult.status).toBeGreaterThanOrEqual(200);
    expect(linkedActivitiesResult.status).toBeLessThan(400);

    // Skip test if no linked activities exist
    if (!Array.isArray(linkedActivitiesResult.data.items) ||
        linkedActivitiesResult.data.items.length === 0) {
        console.log(`No linked activities found for activity ${aid}, skipping link type test`);
        return;
    }

    // The linked activity response contains fromActivityId, toActivityId, and linkType
    var linkedActivity = linkedActivitiesResult.data.items[0];
    var linkedActivityId = linkedActivity.toActivityId;
    var knownLinkType = linkedActivity.linkType;

    // Skip if we couldn't determine the linked activity ID or link type
    if (!linkedActivityId || !knownLinkType) {
        console.log(`Could not determine linked activity ID or link type. Response structure:`, JSON.stringify(linkedActivity, null, 2));
        return;
    }

    console.log(`Testing link between activities ${aid} and ${linkedActivityId} with linkType: ${knownLinkType}`);

    // Use the linkType from the linked activity response
    var result = await myProxy.getActivityLinkType(
        aid,
        linkedActivityId,
        knownLinkType
    );

    // A 200 status confirms the link type exists between these activities
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("links");
    expect(Array.isArray(result.data.links)).toBe(true);
    console.log(`Successfully verified link type '${knownLinkType}' exists between activities ${aid} and ${linkedActivityId}`);
});
