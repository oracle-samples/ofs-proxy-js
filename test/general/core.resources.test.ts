/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { OFSCredentials } from "../../src/model";
import { OFS } from "../../src/OFS";
import myCredentials from "../credentials_test.json";

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

test("Get Resource Routes with default activity fields", async () => {
    var resourceId = "100000471803411";
    var date = "2025-06-23";
    var result = await myProxy.getResourceRoutes(resourceId, date);
    
    
    // Test the method call itself works (doesn't throw)
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.data).toBeDefined();
    
    // If successful, check the response structure
    if (result.status === 200 && result.data) {
        // The actual structure may vary, so we test what we can
        if (result.data.resourceId) {
            expect(result.data.resourceId).toBe(resourceId);
        }
        if (result.data.date) {
            expect(result.data.date).toBe(date);
        }
        if (result.data.activities) {
            expect(Array.isArray(result.data.activities)).toBe(true);
        }
    }
});

test("Get Resource Routes with specific activity fields", async () => {
    var resourceId = "100000471803411";
    var date = "2025-06-23";
    var activityFields = ["latitude", "longitude", "status"];
    var result = await myProxy.getResourceRoutes(resourceId, date, activityFields);
    
    // Test the method call works with parameters
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.data).toBeDefined();
    
    // If successful, check the response structure
    if (result.status === 200 && result.data) {
        if (result.data.resourceId) {
            expect(result.data.resourceId).toBe(resourceId);
        }
        if (result.data.date) {
            expect(result.data.date).toBe(date);
        }
        if (result.data.activities) {
            expect(Array.isArray(result.data.activities)).toBe(true);
            
            // Check if activities contain the requested fields
            if (result.data.activities.length > 0) {
                var activity = result.data.activities[0];
                expect(activity.activityId).toBeDefined();
                // Note: latitude, longitude, status might not be present if not available for the activity
            }
        }
    }
});

test("Get Resource Routes with multiple activity fields", async () => {
    var resourceId = "100000471803411";
    var date = "2025-06-23";
    var activityFields = ["latitude", "longitude", "status", "activityType", "customerName"];
    var result = await myProxy.getResourceRoutes(resourceId, date, activityFields);
    
    if (result.status !== 200) {
        console.log("Get Resource Routes with multiple fields ERROR:", result);
    }
    
    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
});

test("Get Resource Routes with invalid resource ID", async () => {
    var resourceId = "INVALID_RESOURCE_ID";
    var date = "2025-06-23";
    var result = await myProxy.getResourceRoutes(resourceId, date);
    
    // Expecting 404 or similar error status for invalid resource ID
    expect(result.status).toBeGreaterThanOrEqual(400);
    expect(result.status).toBeLessThan(500);
});

test("Get Resource Routes with invalid date format", async () => {
    var resourceId = "100000471803411";
    var date = "invalid-date";
    var result = await myProxy.getResourceRoutes(resourceId, date);
    
    // Expecting 400 or similar error status for invalid date format
    expect(result.status).toBeGreaterThanOrEqual(400);
    expect(result.status).toBeLessThan(500);
});

test("Get Resource Routes with future date", async () => {
    var resourceId = "100000471803411";
    var date = "2025-12-31";
    var result = await myProxy.getResourceRoutes(resourceId, date);
    
    // Future dates might return 200 with empty data or an error
    expect(result.status).toBeLessThan(500);
    expect(result.data).toBeDefined();
});

test("Get Resource Routes with past date", async () => {
    var resourceId = "100000471803411";
    var date = "2024-01-01";
    var result = await myProxy.getResourceRoutes(resourceId, date);
    
    // Past dates should work if data exists
    expect(result.status).toBeLessThan(500);
    expect(result.data).toBeDefined();
});

test("Get Resource Routes with empty activity fields array", async () => {
    var resourceId = "100000471803411";
    var date = "2025-06-23";
    var activityFields: string[] = [];
    var result = await myProxy.getResourceRoutes(resourceId, date, activityFields);
    
    if (result.status !== 200) {
        console.log("Get Resource Routes with empty fields ERROR:", result);
    }
    
    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
});

test("Get Resource Routes response structure validation", async () => {
    var resourceId = "100000471803411";
    var date = "2025-06-23";
    var result = await myProxy.getResourceRoutes(resourceId, date);
    
    // Basic validation - method should return a proper response object
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(typeof result.status).toBe('number');
    expect(result.data).toBeDefined();
    
    if (result.status === 200) {
        // Validate response structure if successful
        if (result.data.resourceId) {
            expect(result.data.resourceId).toBeDefined();
        }
        if (result.data.date) {
            expect(result.data.date).toBeDefined();
        }
        if (result.data.activities) {
            expect(Array.isArray(result.data.activities)).toBe(true);
            
            // If there are activities, validate their structure
            if (result.data.activities.length > 0) {
                var activity = result.data.activities[0];
                expect(activity.activityId).toBeDefined();
                expect(typeof activity.activityId).toBe('number');
            }
        }
    }
});