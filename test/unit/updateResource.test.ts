/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { OFS } from "../../src/OFS";
import { OFSUpdateResourceRequest } from "../../src/model";

const originalFetch = global.fetch;
const fetchMock = jest.fn();

function jsonResponse(status: number, data: any, statusText = "OK"): Response {
  return {
    status,
    statusText,
    headers: new Headers({ "Content-Type": "application/json" }),
    json: jest.fn().mockResolvedValue(data),
  } as unknown as Response;
}

function createProxy(): OFS {
  return new OFS({
    baseURL: "https://example.test",
    token: "test-token",
  });
}

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

afterAll(() => {
  global.fetch = originalFetch;
});

test("updateResource sends PATCH to the resource endpoint", async () => {
  const payload: OFSUpdateResourceRequest = {
    name: "Updated Technician",
    status: "active",
    customTextProperty: "kept",
  };
  const responseData = {
    resourceId: "TECH_1",
    name: "Updated Technician",
    status: "active",
    resourceType: "field_resource",
    customTextProperty: "kept",
  };
  fetchMock.mockResolvedValue(jsonResponse(200, responseData));

  const result = await createProxy().updateResource("TECH_1", payload);
  const [url, options] = fetchMock.mock.calls[0];

  expect(url.toString()).toBe(
    "https://example.test/rest/ofscCore/v1/resources/TECH_1"
  );
  expect(options.method).toBe("PATCH");
  expect(options.body).toBe(JSON.stringify(payload));
  expect(options.headers.get("Authorization")).toBe("Bearer test-token");
  expect(options.headers.get("Content-Type")).toBe("application/json");
  expect(result.status).toBe(200);
  expect(result.data).toEqual(responseData);
});

test("updateResource serializes identifyResourceBy", async () => {
  fetchMock.mockResolvedValue(
    jsonResponse(200, {
      resourceId: "TECH_2",
      name: "Updated Technician",
      status: "active",
      resourceType: "field_resource",
    })
  );

  await createProxy().updateResource(
    "12345",
    { resourceId: "TECH_2" },
    { identifyResourceBy: "resourceInternalId" }
  );
  const [url] = fetchMock.mock.calls[0];

  expect(url.toString()).toBe(
    "https://example.test/rest/ofscCore/v1/resources/12345?identifyResourceBy=resourceInternalId"
  );
});

test("updateResource preserves error status and response body", async () => {
  const errorData = {
    title: "Invalid resource",
    detail: "Resource does not exist",
  };
  fetchMock.mockResolvedValue(jsonResponse(404, errorData, "Not Found"));

  const result = await createProxy().updateResource("UNKNOWN", {});

  expect(result.status).toBe(404);
  expect(result.description).toBe("Not Found");
  expect(result.data).toEqual(errorData);
});
