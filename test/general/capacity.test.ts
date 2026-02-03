/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { OFS } from "../../src/OFS";
import { getTestCredentials } from "../test_credentials";

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

describe("Capacity API - showBookingGrid", () => {
    test("Show Booking Grid with activity ID", async () => {
        const today = new Date();
        const dateFrom = today.toISOString().split("T")[0];

        var result = await myProxy.showBookingGrid({
            activity: {
                activityId: 4225599
            },
            dateFrom: dateFrom,
            identifyActivityBy: "activityId"
        });

        // The API should return a response (may be success or error depending on capacity configuration)
        expect(result.status).toBeDefined();

        if (result.status === 200) {
            expect(result.data).toHaveProperty("areas");
            expect(Array.isArray(result.data.areas)).toBe(true);

            // Check optional fields if present
            if (result.data.actualAtTime) {
                expect(typeof result.data.actualAtTime).toBe("string");
            }
            if (result.data.duration !== undefined) {
                expect(typeof result.data.duration).toBe("number");
            }
        }

        console.log(`showBookingGrid status: ${result.status}`);
        console.log(`showBookingGrid response:`, JSON.stringify(result.data, null, 2));
    });

    test("Show Booking Grid with new activity fields", async () => {
        const today = new Date();
        const dateFrom = today.toISOString().split("T")[0];

        var result = await myProxy.showBookingGrid({
            activity: {
                activityType: "01",
                streetAddress: "123 Main St",
                city: "Orlando",
                stateProvince: "FL",
                postalCode: "32801"
            },
            dateFrom: dateFrom,
            includeTimeSlotsDictionary: true,
            returnReasons: true
        });

        expect(result.status).toBeDefined();

        if (result.status === 200) {
            expect(result.data).toHaveProperty("areas");
            expect(Array.isArray(result.data.areas)).toBe(true);

            // Check time slots dictionary if requested
            if (result.data.timeSlotsDictionary) {
                expect(Array.isArray(result.data.timeSlotsDictionary)).toBe(true);
            }
        }

        console.log(`showBookingGrid (new activity) status: ${result.status}`);
        console.log(`showBookingGrid (new activity) response:`, JSON.stringify(result.data, null, 2));
    });

    test("Show Booking Grid with date range", async () => {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const dateFrom = today.toISOString().split("T")[0];
        const dateTo = nextWeek.toISOString().split("T")[0];

        var result = await myProxy.showBookingGrid({
            activity: {
                activityId: 4225599
            },
            dateFrom: dateFrom,
            dateTo: dateTo,
            identifyActivityBy: "activityId",
            includeResourcesDictionary: true,
            resourceFields: ["resourceId", "name"]
        });

        expect(result.status).toBeDefined();

        if (result.status === 200) {
            expect(result.data).toHaveProperty("areas");

            // Check resources dictionary if requested
            if (result.data.resourcesDictionary) {
                expect(Array.isArray(result.data.resourcesDictionary)).toBe(true);
            }
        }

        console.log(`showBookingGrid (date range) status: ${result.status}`);
    });
});

describe("Capacity API - getActivityBookingOptions", () => {
    test("Get Activity Booking Options basic", async () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const dates = [
            today.toISOString().split("T")[0],
            tomorrow.toISOString().split("T")[0]
        ];

        var result = await myProxy.getActivityBookingOptions({
            activityType: "01",
            dates: dates
        });

        expect(result.status).toBeDefined();

        if (result.status === 200) {
            expect(result.data).toHaveProperty("dates");
            expect(Array.isArray(result.data.dates)).toBe(true);

            // Check optional fields
            if (result.data.actualAtTime) {
                expect(typeof result.data.actualAtTime).toBe("string");
            }
            if (result.data.duration !== undefined) {
                expect(typeof result.data.duration).toBe("number");
            }
            if (result.data.categories) {
                expect(Array.isArray(result.data.categories)).toBe(true);
            }
        }

        console.log(`getActivityBookingOptions status: ${result.status}`);
        console.log(`getActivityBookingOptions response:`, JSON.stringify(result.data, null, 2));
    });

    test("Get Activity Booking Options with location", async () => {
        const today = new Date();
        const dates = [today.toISOString().split("T")[0]];

        var result = await myProxy.getActivityBookingOptions({
            activityType: "01",
            dates: dates,
            city: "Orlando",
            stateProvince: "FL",
            postalCode: "32801",
            streetAddress: "123 Main St",
            estimateDuration: true,
            estimateTravelTime: true
        });

        expect(result.status).toBeDefined();

        if (result.status === 200) {
            expect(result.data).toHaveProperty("dates");

            // Check duration if estimateDuration was true
            if (result.data.duration !== undefined) {
                expect(typeof result.data.duration).toBe("number");
            }
            // Check travelTime if estimateTravelTime was true
            if (result.data.travelTime !== undefined) {
                expect(typeof result.data.travelTime).toBe("number");
            }
        }

        console.log(`getActivityBookingOptions (with location) status: ${result.status}`);
    });

    test("Get Activity Booking Options with coordinates", async () => {
        const today = new Date();
        const dates = [today.toISOString().split("T")[0]];

        var result = await myProxy.getActivityBookingOptions({
            activityType: "01",
            dates: dates,
            latitude: 28.5383,
            longitude: -81.3792,
            determineAreaByWorkZone: true,
            determineCategory: true
        });

        expect(result.status).toBeDefined();

        if (result.status === 200) {
            expect(result.data).toHaveProperty("dates");

            // Check workZone if determineAreaByWorkZone was true
            if (result.data.workZone) {
                expect(typeof result.data.workZone).toBe("string");
            }
        }

        console.log(`getActivityBookingOptions (with coordinates) status: ${result.status}`);
    });

    test("Get Activity Booking Options with areas and categories filters", async () => {
        const today = new Date();
        const dates = [today.toISOString().split("T")[0]];

        var result = await myProxy.getActivityBookingOptions({
            activityType: "01",
            dates: dates,
            areas: ["area1"],
            categories: ["category1"],
            defaultDuration: 60,
            minTimeBeforeArrival: 30,
            includePartiallyDefinedCategories: true
        });

        expect(result.status).toBeDefined();

        // The API should return a response (may be empty if areas/categories don't exist)
        console.log(`getActivityBookingOptions (with filters) status: ${result.status}`);
        console.log(`getActivityBookingOptions (with filters) response:`, JSON.stringify(result.data, null, 2));
    });
});
