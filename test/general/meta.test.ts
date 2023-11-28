import {
    OFSCredentials,
    OFSPropertyDetails,
    OFSPropertyDetailsResponse,
} from "../../src/model";
import { OFS } from "../../src/OFS";
import myCredentials from "../credentials_test.json";

import test_info from "../test_config.json";
import { faker } from "@faker-js/faker";

import type { Config } from "jest";
import { defaults } from "jest-config";

var myProxy: OFS;
var testConfig: any;

interface MetaTestConfiguration {
    numberOfProperties: number;
}
const TEST_CONFIG: Map<string, MetaTestConfiguration> = new Map<string, any>();
TEST_CONFIG.set("23.11", {
    numberOfProperties: 464,
});

// Setup info
beforeAll(() => {
    myProxy = new OFS(myCredentials);
    expect(myProxy.instance).toBe(myCredentials.instance);
    var default_version: string = test_info.ofsVersion;
    testConfig = TEST_CONFIG.get(default_version); // TODO: Store in jest config
});

// Teardown info
var activityList: number[] = [];
afterAll(() => {
    activityList.forEach(async (aid) => {
        await myProxy.deleteActivity(aid);
    });
});

test("Get Properties, default values", async () => {
    var result = await myProxy.getProperties();
    try {
        expect(result.status).toBe(200);
        expect(result.data.items.length).toBe(100);
        expect(result.data.totalResults).toBeGreaterThan(100);
        expect(result.data.totalResults).toBe(testConfig.numberOfProperties);
    } catch (error) {
        console.error(result);
        throw error;
    }
});

test("Get Valid Field Details", async () => {
    var result = await myProxy.getPropertyDetails("date");
    expect(result.status).toBe(200);
    expect(result.data.name).toBe("Date");
    expect(result.data.type).toBe("field");
    expect(result.data.entity).toBe("activity");
    result.data.translations?.forEach((element) => {
        if (element.languageISO == "en-US") {
            expect(element.name).toBe("Date");
            expect(element.language).toBe("en");
        }
    });
});

test("Get Valid Property Details", async () => {
    var result = await myProxy.getPropertyDetails("DISPATCHER_COMMENTS");
    expect(result.status).toBe(200);
    expect(result.data.name).toBe("Dispatcher Comments");
    expect(result.data.type).toBe("string");
    expect(result.data.entity).toBe("activity");
    result.data.translations?.forEach((element) => {
        if (element.languageISO == "en-US") {
            expect(element.name).toBe("Dispatcher Comments");
            expect(element.language).toBe("en");
        }
    });
    console.log(result);
    console.log(result.data.translations?.slice(0, 1));
});

test("Get Invalid Property Details", async () => {
    var result = await myProxy.getPropertyDetails("invalid");
    expect(result.status).toBe(404);
});

test("Create custom property", async () => {
    var propertyLabel = `TEST_${faker.word.noun()}_${faker.number.int()}`;
    var propertyData = {
        name: "Test Property",
        label: propertyLabel,
        type: "string",
        entity: "activity",
        gui: "text",
        translations: [
            {
                language: "en",
                name: "Test Property",
                languageISO: "en-US",
            },
        ],
    };
    var result = await myProxy.createReplaceProperty(propertyData);
    try {
        expect(result.status).toBe(201);
    } catch (error) {
        console.log(result);
        throw error;
    }
    expect(result.data.name).toBe(propertyData.name);
    expect(result.data.type).toBe(propertyData.type);
    expect(result.data.entity).toBe(propertyData.entity);
    expect(result.data.gui).toBe(propertyData.gui);
    //expect(result.data.translations).toStrictEqual(propertyData.translations);
});

test("Replace custom property", async () => {
    var propertyLabel = `TEST_${faker.word.noun()}_${faker.number.int()}`;
    var propertyData = {
        name: "Test Property ORIGINAL",
        label: propertyLabel,
        type: "string",
        entity: "activity",
        gui: "text",
        translations: [
            {
                language: "en",
                name: "Test Property ORIGINAL",
                languageISO: "en-US",
            },
        ],
    };
    var result = await myProxy.createReplaceProperty(propertyData);
    try {
        expect(result.status).toBe(201);
    } catch (error) {
        console.log(result);
        throw error;
    }
    expect(result.data.name).toBe(propertyData.name);
    propertyData.name = "Test Property CHANGED";
    propertyData.type = "string";
    propertyData.translations[0].name = "Test Property CHANGED";
    var result2 = await myProxy.createReplaceProperty(propertyData);
    try {
        expect(result2.status).toBe(200);
        expect(result2.data.name).toBe(propertyData.name);
    } catch (error) {
        console.log(propertyData);
        console.log(result2);
        throw error;
    }
});

test("Update custom property", async () => {
    var propertyLabel = `TEST_${faker.word.noun()}_${faker.number.int()}`;
    var propertyData: OFSPropertyDetails = {
        name: "Test Property ORIGINAL",
        label: propertyLabel,
        type: "string",
        entity: "activity",
        gui: "text",
        translations: [
            {
                language: "en",
                name: "Test Property ORIGINAL",
                languageISO: "en-US",
            },
        ],
    };
    var result: OFSPropertyDetailsResponse =
        await myProxy.createReplaceProperty(propertyData);
    try {
        expect(result.status).toBe(201);
    } catch (error) {
        console.log(result);
        throw error;
    }
    expect(result.data.name).toBe(propertyData.name);
    expect(result.data.cloneFlag).toBe(false);
    var newPropertyData = {
        label: propertyLabel,
        cloneFlag: true,
    };
    var result2 = await myProxy.updateProperty(newPropertyData);
    try {
        expect(result2.status).toBe(200);
        expect(result2.data.name).toBe(propertyData.name);
        expect(result2.data.type).toBe(propertyData.type);
        expect(result2.data.cloneFlag).toBe(true);
    } catch (error) {
        console.log(propertyData);
        console.log(result2);
        throw error;
    }
});
