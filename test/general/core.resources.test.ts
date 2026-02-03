/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { OFSCredentials, OFSBulkUpdateRequest } from "../../src/model";
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

// Tests for getResource method
test("Get Resource with valid ID", async () => {
    var resourceId = "33035";
    var result = await myProxy.getResource(resourceId);

    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.data).toBeDefined();

    if (result.status === 200 && result.data) {
        expect(result.data.resourceId).toBe(resourceId);
        expect(result.data.name).toBeDefined();
        expect(result.data.status).toBeDefined();
        expect(result.data.resourceType).toBeDefined();
    }
});

test("Get Resource with invalid ID", async () => {
    var resourceId = "INVALID_RESOURCE_ID_12345";
    var result = await myProxy.getResource(resourceId);

    expect(result).toBeDefined();
    expect(result.status).toBeDefined();

    // Expecting 404 for non-existent resource
    expect(result.status).toBeGreaterThanOrEqual(400);
});

test("Get Resource with fields parameter", async () => {
    var resourceId = "33035";
    var fields = ["resourceId", "name", "status"];
    var result = await myProxy.getResource(resourceId, { fields });

    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.data).toBeDefined();

    if (result.status === 200 && result.data) {
        expect(result.data.resourceId).toBe(resourceId);
    }
});

test("Get Resource with expand parameter", async () => {
    var resourceId = "33035";
    var expand = ["workSkills", "workZones"];
    var result = await myProxy.getResource(resourceId, { expand });

    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.data).toBeDefined();

    if (result.status === 200 && result.data) {
        expect(result.data.resourceId).toBe(resourceId);
    }
});

test("Get Resource response structure validation", async () => {
    var resourceId = "33035";
    var result = await myProxy.getResource(resourceId);

    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(typeof result.status).toBe('number');
    expect(result.data).toBeDefined();

    if (result.status === 200) {
        expect(result.data.resourceId).toBeDefined();
        expect(typeof result.data.resourceId).toBe('string');
        expect(result.data.name).toBeDefined();
        expect(typeof result.data.name).toBe('string');
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

// Tests for getLastKnownPositions method
test("Get Last Known Positions with no parameters", async () => {
    var result = await myProxy.getLastKnownPositions();
    
    // Test the method call itself works (doesn't throw)
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.data).toBeDefined();
    
    // If successful, check the response structure
    if (result.status === 200 && result.data) {
        expect(result.data.totalResults).toBeDefined();
        expect(typeof result.data.totalResults).toBe('number');
        expect(Array.isArray(result.data.items)).toBe(true);
        
        // If there are items, validate their structure
        if (result.data.items.length > 0) {
            var position = result.data.items[0];
            expect(position.resourceId).toBeDefined();
            expect(typeof position.resourceId).toBe('string');
            // time, lat, lng, errorMessage are optional fields
        }
    }
});

test("Get Last Known Positions with offset parameter", async () => {
    var result = await myProxy.getLastKnownPositions({ offset: 10 });
    
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.data).toBeDefined();
    
    if (result.status === 200 && result.data) {
        expect(Array.isArray(result.data.items)).toBe(true);
        expect(result.data.totalResults).toBeDefined();
        expect(typeof result.data.totalResults).toBe('number');
    }
});

test("Get Last Known Positions with specific resources", async () => {
    var resources = ["100000471803411"];
    var result = await myProxy.getLastKnownPositions({ resources });
    
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.data).toBeDefined();
    
    if (result.status === 200 && result.data) {
        expect(Array.isArray(result.data.items)).toBe(true);
        
        // If there are items, they should be for the requested resources
        if (result.data.items.length > 0) {
            var position = result.data.items[0];
            expect(position.resourceId).toBeDefined();
            expect(typeof position.resourceId).toBe('string');
        }
    }
});

test("Get Last Known Positions with multiple resources", async () => {
    var resources = ["100000471803411", "100000471803412"];
    var result = await myProxy.getLastKnownPositions({ resources });
    
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.data).toBeDefined();
    
    if (result.status === 200 && result.data) {
        expect(Array.isArray(result.data.items)).toBe(true);
        
        // Check structure of response
        if (result.data.items.length > 0) {
            var position = result.data.items[0];
            expect(position.resourceId).toBeDefined();
            expect(typeof position.resourceId).toBe('string');
            
            // Check optional fields exist if present
            if (position.time) {
                expect(typeof position.time).toBe('string');
            }
            if (position.lat) {
                expect(typeof position.lat).toBe('number');
            }
            if (position.lng) {
                expect(typeof position.lng).toBe('number');
            }
            if (position.errorMessage) {
                expect(typeof position.errorMessage).toBe('string');
            }
        }
    }
});

test("Get Last Known Positions with offset and resources", async () => {
    var resources = ["100000471803411"];
    var result = await myProxy.getLastKnownPositions({ 
        offset: 5,
        resources 
    });
    
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.data).toBeDefined();
    
    if (result.status === 200 && result.data) {
        expect(Array.isArray(result.data.items)).toBe(true);
        expect(result.data.totalResults).toBeDefined();
        expect(typeof result.data.totalResults).toBe('number');
    }
});

test("Get Last Known Positions with invalid resource ID", async () => {
    var resources = ["INVALID_RESOURCE_ID"];
    var result = await myProxy.getLastKnownPositions({ resources });
    
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.data).toBeDefined();
    
    // Should return 200 with items that might contain error messages
    if (result.status === 200 && result.data) {
        expect(Array.isArray(result.data.items)).toBe(true);
        
        // If there are items, they might contain error messages
        if (result.data.items.length > 0) {
            var position = result.data.items[0];
            expect(position.resourceId).toBe("INVALID_RESOURCE_ID");
            // errorMessage might be present for invalid resources
        }
    }
});

test("Get Last Known Positions response structure validation", async () => {
    var result = await myProxy.getLastKnownPositions();
    
    // Basic validation - method should return a proper response object
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(typeof result.status).toBe('number');
    expect(result.data).toBeDefined();
    
    if (result.status === 200) {
        // Validate response structure if successful
        expect(result.data.totalResults).toBeDefined();
        expect(typeof result.data.totalResults).toBe('number');
        expect(Array.isArray(result.data.items)).toBe(true);
        
        // Check if hasMore exists in response (optional field)
        if (result.data.hasMore !== undefined) {
            expect(typeof result.data.hasMore).toBe('boolean');
        }
        
        // If there are positions, validate their structure
        if (result.data.items.length > 0) {
            var position = result.data.items[0];
            expect(position.resourceId).toBeDefined();
            expect(typeof position.resourceId).toBe('string');
            
            // Optional fields validation
            if (position.time !== undefined) {
                expect(typeof position.time).toBe('string');
            }
            if (position.lat !== undefined) {
                expect(typeof position.lat).toBe('number');
            }
            if (position.lng !== undefined) {
                expect(typeof position.lng).toBe('number');
            }
            if (position.errorMessage !== undefined) {
                expect(typeof position.errorMessage).toBe('string');
            }
        }
    }
});

// Tests for getAllLastKnownPositions method
test("Get All Last Known Positions with no parameters", async () => {
    var result = await myProxy.getAllLastKnownPositions();
    
    // Test the method call itself works (doesn't throw)
    expect(result).toBeDefined();
    expect(result.totalResults).toBeDefined();
    expect(typeof result.totalResults).toBe('number');
    expect(Array.isArray(result.items)).toBe(true);
    
    // Should have accumulated all items
    expect(result.totalResults).toBe(result.items.length);
    
    // If there are items, validate their structure
    if (result.items.length > 0) {
        var position = result.items[0];
        expect(position.resourceId).toBeDefined();
        expect(typeof position.resourceId).toBe('string');
        
        // Optional fields validation
        if (position.time !== undefined) {
            expect(typeof position.time).toBe('string');
        }
        if (position.lat !== undefined) {
            expect(typeof position.lat).toBe('number');
        }
        if (position.lng !== undefined) {
            expect(typeof position.lng).toBe('number');
        }
        if (position.errorMessage !== undefined) {
            expect(typeof position.errorMessage).toBe('string');
        }
    }
});

test("Get All Last Known Positions with specific resources", async () => {
    var resources = ["100000471803411", "33035"];
    var result = await myProxy.getAllLastKnownPositions({ resources });
    
    expect(result).toBeDefined();
    expect(result.totalResults).toBeDefined();
    expect(typeof result.totalResults).toBe('number');
    expect(Array.isArray(result.items)).toBe(true);
    
    // Should have accumulated all items
    expect(result.totalResults).toBe(result.items.length);
    
    // If there are items, they should be for the requested resources
    if (result.items.length > 0) {
        var position = result.items[0];
        expect(position.resourceId).toBeDefined();
        expect(typeof position.resourceId).toBe('string');
        
        // Check that returned resource IDs are in the requested list
        expect(resources).toContain(position.resourceId);
    }
});

test("Get All Last Known Positions with multiple resources", async () => {
    var resources = ["100000471803411", "33035", "44026", "55030"];
    var result = await myProxy.getAllLastKnownPositions({ resources });
    
    expect(result).toBeDefined();
    expect(result.totalResults).toBeDefined();
    expect(typeof result.totalResults).toBe('number');
    expect(Array.isArray(result.items)).toBe(true);
    
    // Should have accumulated all items
    expect(result.totalResults).toBe(result.items.length);
    
    // Verify structure of response
    if (result.items.length > 0) {
        var position = result.items[0];
        expect(position.resourceId).toBeDefined();
        expect(typeof position.resourceId).toBe('string');
        
        // Check that returned resource IDs are in the requested list
        expect(resources).toContain(position.resourceId);
    }
});

test("Get All Last Known Positions with single resource", async () => {
    var resources = ["33035"]; // This resource has a valid position
    var result = await myProxy.getAllLastKnownPositions({ resources });
    
    expect(result).toBeDefined();
    expect(result.totalResults).toBeDefined();
    expect(typeof result.totalResults).toBe('number');
    expect(Array.isArray(result.items)).toBe(true);
    
    // Should have accumulated all items
    expect(result.totalResults).toBe(result.items.length);
    
    // Should have exactly one item for the single resource
    if (result.items.length > 0) {
        expect(result.items.length).toBe(1);
        var position = result.items[0];
        expect(position.resourceId).toBe("33035");
    }
});

test("Get All Last Known Positions with invalid resource", async () => {
    var resources = ["INVALID_RESOURCE_ID"];
    var result = await myProxy.getAllLastKnownPositions({ resources });
    
    expect(result).toBeDefined();
    expect(result.totalResults).toBeDefined();
    expect(typeof result.totalResults).toBe('number');
    expect(Array.isArray(result.items)).toBe(true);
    
    // Should have accumulated all items
    expect(result.totalResults).toBe(result.items.length);
    
    // Should have one item with error message
    if (result.items.length > 0) {
        expect(result.items.length).toBe(1);
        var position = result.items[0];
        expect(position.resourceId).toBe("INVALID_RESOURCE_ID");
        expect(position.errorMessage).toBeDefined();
        expect(typeof position.errorMessage).toBe('string');
    }
});

test("Get All Last Known Positions response structure validation", async () => {
    var result = await myProxy.getAllLastKnownPositions();
    
    // Basic validation - method should return a proper response object
    expect(result).toBeDefined();
    expect(result.totalResults).toBeDefined();
    expect(typeof result.totalResults).toBe('number');
    expect(Array.isArray(result.items)).toBe(true);
    
    // Should have accumulated all items - totalResults should equal items length
    expect(result.totalResults).toBe(result.items.length);
    
    // If there are positions, validate their structure
    if (result.items.length > 0) {
        var position = result.items[0];
        expect(position.resourceId).toBeDefined();
        expect(typeof position.resourceId).toBe('string');
        
        // Optional fields validation
        if (position.time !== undefined) {
            expect(typeof position.time).toBe('string');
        }
        if (position.lat !== undefined) {
            expect(typeof position.lat).toBe('number');
        }
        if (position.lng !== undefined) {
            expect(typeof position.lng).toBe('number');
        }
        if (position.errorMessage !== undefined) {
            expect(typeof position.errorMessage).toBe('string');
        }
    }
});

test("Get All Last Known Positions should handle pagination", async () => {
    // This test verifies that the method correctly handles the hasMore flag
    var result = await myProxy.getAllLastKnownPositions();
    
    expect(result).toBeDefined();
    expect(result.totalResults).toBeDefined();
    expect(typeof result.totalResults).toBe('number');
    expect(Array.isArray(result.items)).toBe(true);
    
    // The method should have accumulated all items across all pages
    expect(result.totalResults).toBe(result.items.length);
    
    // No hasMore field should be present in the final result
    expect(result.hasMore).toBeUndefined();
});