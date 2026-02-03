/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { PathLike, readFileSync } from "fs";
import {
    OFSActivityResponse,
    OFSCredentials,
    OFSPropertyDetailsResponse,
    OFSResponse,
    OFSSubscriptionResponse,
    OFSPropertyDetails,
    OFSPropertyListResponse,
    OFSGetPropertiesParams,
    OFSTimeslotsResponse,
    OFSGetActivitiesParams,
    OFSSearchForActivitiesParams,
    OFSBulkUpdateRequest,
    OFSGetResourcesParams,
    OFSGetResourceParams,
    OFSResourceResponse,
    OFSSingleResourceResponse,
    OFSResourceRoutesResponse,
    OFSGetLastKnownPositionsParams,
    OFSLastKnownPositionsResponse,
    OFSGetSubmittedFormsParams,
    OFSSubmittedFormsResponse,
    OFSActivityLinkTypeResponse,
    OFSLinkTemplatesResponse,
    OFSShowBookingGridParams,
    OFSShowBookingGridResponse,
    OFSGetActivityBookingOptionsParams,
    OFSGetActivityBookingOptionsResponse,
} from "./model";

export * from "./model";
export class OFS {
    private _credentials!: OFSCredentials;
    private _hash!: string;
    private _baseURL!: URL;
    private static DEFAULT_DOMAIN = "fs.ocs.oraclecloud.com";

    public get credentials(): OFSCredentials {
        return this._credentials;
    }
    public set credentials(v: OFSCredentials) {
        this._credentials = v;
        this._hash = OFS.authenticateUser(v);
        if ("baseURL" in v && v.baseURL != "") {
            this._baseURL = new URL(v.baseURL!);
        } else {
            this._baseURL = new URL(
                `https://${this.instance}.${OFS.DEFAULT_DOMAIN}`
            );
        }
    }

    public get authorization(): string {
        return this._hash;
    }

    constructor(credentials: OFSCredentials) {
        this.credentials = credentials;
    }

    public get instance(): string {
        return this.credentials.instance || "";
    }
    public get baseURL(): URL {
        return this._baseURL || "";
    }
    private static authenticateUser(credentials: OFSCredentials): string {
        if ("token" in credentials && credentials.token != "") {
            return "Bearer " + credentials.token;
        } else {
            var token =
                credentials.clientId +
                "@" +
                credentials.instance +
                ":" +
                credentials.clientSecret;
            var hash = Buffer.from(token).toString("base64");
            return "Basic " + hash;
        }
    }

    private _get(
        partialURL: string,
        params: any = undefined,
        extraHeaders: Headers = new Headers()
    ): Promise<OFSResponse> {
        var theURL = new URL(partialURL, this._baseURL);
        if (params != undefined) {
            const urlSearchParams = new URLSearchParams(params);
            theURL.search = urlSearchParams.toString();
        }
        var myHeaders = new Headers();
        myHeaders.append("Authorization", this.authorization);
        extraHeaders.forEach((value, key) => {
            myHeaders.append(key, value);
        });
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
        };
        const fetchPromise = fetch(theURL, requestOptions)
            .then(async function (response) {
                // Your code for handling the data you get from the API
                if (response.status < 400) {
                    var data;
                    if (
                        response.headers.get("Content-Type")?.includes("json")
                    ) {
                        data = await response.json();
                    } else if (
                        response.headers.get("Content-Type")?.includes("text")
                    ) {
                        data = await response.text();
                    } else {
                        data = await response.blob();
                    }
                    return new OFSResponse(
                        theURL,
                        response.status,
                        undefined,
                        data,
                        response.headers.get("Content-Type") || undefined
                    );
                } else {
                    try {
                        var data;
                        if (
                            response.headers
                                .get("Content-Type")
                                ?.includes("json")
                        ) {
                            data = await response.json();
                        } else if (
                            response.headers
                                .get("Content-Type")
                                ?.includes("text")
                        ) {
                            data = await response.text();
                        } else {
                            data = await response.blob();
                        }
                        return new OFSResponse(
                            theURL,
                            response.status,
                            undefined,
                            data,
                            response.headers.get("Content-Type") || undefined
                        );
                    } catch (error) {
                        console.log(
                            "error trying to capture the response with status >400",
                            error
                        );
                        return new OFSResponse(
                            theURL,
                            response.status,
                            response.statusText,
                            undefined
                        );
                    }
                }
            })
            .catch((error) => {
                console.log("error", error);
                return new OFSResponse(theURL, -1);
            });
        return fetchPromise;
    }

    private _patch(partialURL: string, data: any): Promise<OFSResponse> {
        var theURL = new URL(partialURL, this._baseURL);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", this.authorization);
        myHeaders.append("Content-Type", "application/json");
        var requestOptions: RequestInit = {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(data),
        };
        const fetchPromise = fetch(theURL, requestOptions)
            .then(async function (response) {
                // Your code for handling the data you get from the API
                if (response.status < 400) {
                    var data = await response.json();
                    return new OFSResponse(
                        theURL,
                        response.status,
                        undefined,
                        data
                    );
                } else {
                    return new OFSResponse(
                        theURL,
                        response.status,
                        response.statusText,
                        undefined
                    );
                }
            })
            .catch((error) => {
                console.log("error", error);
                return new OFSResponse(theURL, -1);
            });
        return fetchPromise;
    }

    private _put(
        partialURL: string,
        requestData: any,
        contentType: string = "application/json",
        fileName?: string
    ): Promise<OFSResponse> {
        var theURL = new URL(partialURL, this._baseURL);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", this.authorization);
        myHeaders.append("Content-Type", contentType);
        if (contentType == "application/json") {
            requestData = JSON.stringify(requestData);
        }
        if (fileName) {
            myHeaders.append(
                "Content-Disposition",
                `attachment; filename=${fileName}`
            );
        }
        var requestOptions: RequestInit = {
            method: "PUT",
            headers: myHeaders,
            body: requestData,
        };
        const fetchPromise = fetch(theURL, requestOptions)
            .then(async function (response) {
                // Your code for handling the data you get from the API
                if (response.status < 400) {
                    if (response.status == 204) {
                        //No data here
                        return new OFSResponse(
                            theURL,
                            response.status,
                            undefined,
                            undefined
                        );
                    } else {
                        var data = await response.json();
                        return new OFSResponse(
                            theURL,
                            response.status,
                            undefined,
                            data
                        );
                    }
                } else {
                    return new OFSResponse(
                        theURL,
                        response.status,
                        response.statusText,
                        requestData
                    );
                }
            })
            .catch((error) => {
                console.log("error", error);
                return new OFSResponse(theURL, -1);
            });
        return fetchPromise;
    }

    private _post(partialURL: string, data: any): Promise<OFSResponse> {
        var theURL = new URL(partialURL, this._baseURL);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", this.authorization);
        myHeaders.append("Content-Type", "application/json");
        var requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data),
        };
        const fetchPromise = fetch(theURL, requestOptions)
            .then(async function (response) {
                // Your code for handling the data you get from the API
                if (response.status < 400) {
                    var data = await response.json();
                    return new OFSResponse(
                        theURL,
                        response.status,
                        undefined,
                        data
                    );
                } else {
                    return new OFSResponse(
                        theURL,
                        response.status,
                        response.statusText,
                        await response.json()
                    );
                }
            })
            .catch((error) => {
                console.log("error", error);
                return new OFSResponse(theURL, -1);
            });
        return fetchPromise;
    }

    private _postMultiPart(
        partialURL: string,
        data: FormData
    ): Promise<OFSResponse> {
        var theURL = new URL(partialURL, this._baseURL);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", this.authorization);
        //myHeaders.append("Content-Type", "multipart/form-data");

        var requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: data,
        };
        const fetchPromise = fetch(theURL, requestOptions)
            .then(async function (response) {
                // Your code for handling the data you get from the API
                if (response.status < 400) {
                    if (response.status == 204) {
                        //No data here
                        return new OFSResponse(
                            theURL,
                            response.status,
                            undefined,
                            undefined
                        );
                    } else {
                        var data = await response.json();
                        return new OFSResponse(
                            theURL,
                            response.status,
                            undefined,
                            data
                        );
                    }
                } else {
                    return new OFSResponse(
                        theURL,
                        response.status,
                        response.statusText,
                        undefined
                    );
                }
            })
            .catch((error) => {
                console.log("error", error);
                return new OFSResponse(theURL, -1);
            });
        return fetchPromise;
    }

    private _delete(partialURL: string): Promise<OFSResponse> {
        var theURL = new URL(partialURL, this._baseURL);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", this.authorization);
        var requestOptions = {
            method: "DELETE",
            headers: myHeaders,
        };
        const fetchPromise = fetch(theURL, requestOptions)
            .then(async function (response) {
                // Your code for handling the data you get from the API
                if (response.status == 204) {
                    return new OFSResponse(
                        theURL,
                        response.status,
                        undefined,
                        undefined
                    );
                } else {
                    return new OFSResponse(
                        theURL,
                        response.status,
                        response.statusText,
                        await response.json()
                    );
                }
            })
            .catch((error) => {
                console.log("error", error);
                return new OFSResponse(theURL, -1);
            });
        return fetchPromise;
    }

    // Core: Subscription Management
    async getSubscriptions(
        all: boolean = false
    ): Promise<OFSSubscriptionResponse> {
        const partialURL = "/rest/ofscCore/v1/events/subscriptions";
        return this._get(partialURL, { allSubscriptions: all });
    }

    async createSubscription(data: any): Promise<OFSResponse> {
        const partialURL = "/rest/ofscCore/v1/events/subscriptions/";
        return this._post(partialURL, data);
    }

    async deleteSubscription(sid: string): Promise<OFSResponse> {
        const partialURL = `/rest/ofscCore/v1/events/subscriptions/${sid}`;
        return this._delete(partialURL);
    }

    async getSubscriptionDetails(sid: string): Promise<OFSResponse> {
        const partialURL = `/rest/ofscCore/v1/events/subscriptions/${sid}`;
        return this._get(partialURL);
    }

    // Core: Event Management
    async getEvents(
        sid: string,
        page: string = "lastRequested",
        since = null,
        limit: number = 1000
    ): Promise<OFSResponse> {
        var params: {
            subscriptionId: string;
            page?: string;
            limit: number;
            since?: string | null;
        } = {
            subscriptionId: sid,
            page: page,
            limit: limit,
            since: since,
        };
        if (since == null) {
            delete params.since;
        } else {
            delete params.page;
        }

        const partialURL = "/rest/ofscCore/v1/events";
        return this._get(partialURL, params);
    }

    // Core: Activity Management
    async bulkUpdateActivity(data: OFSBulkUpdateRequest): Promise<OFSResponse> {
        const partialURL =
            "/rest/ofscCore/v1/activities/custom-actions/bulkUpdate";
        return this._post(partialURL, data);
    }
    async createActivity(data: any): Promise<OFSResponse> {
        const partialURL = "/rest/ofscCore/v1/activities";
        return this._post(partialURL, data);
    }

    async deleteActivity(aid: number): Promise<OFSResponse> {
        const partialURL = `/rest/ofscCore/v1/activities/${aid}`;
        return this._delete(partialURL);
    }

    async getActivityDetails(aid: number): Promise<OFSActivityResponse> {
        const partialURL = `/rest/ofscCore/v1/activities/${aid}`;
        return this._get(partialURL);
    }
    /**
     * Retrieve activities linked to an existing activity
     * @param aid Activity id to retrieve linked activities for
     */
    async getLinkedActivities(aid: number): Promise<OFSResponse> {
        const partialURL = `/rest/ofscCore/v1/activities/${aid}/linkedActivities`;
        return this._get(partialURL);
    }

    /**
     * Retrieve the link type between two activities
     * @param aid Activity id
     * @param linkedActivityId Linked activity id
     * @param linkType Type of link to retrieve
     */
    async getActivityLinkType(aid: number, linkedActivityId: number, linkType: string): Promise<OFSActivityLinkTypeResponse> {
        const partialURL = `/rest/ofscCore/v1/activities/${aid}/linkedActivities/${linkedActivityId}/linkTypes/${linkType}`;
        return this._get(partialURL);
    }
    async updateActivity(aid: number, data: any): Promise<OFSResponse> {
        const partialURL = `/rest/ofscCore/v1/activities/${aid}`;
        return this._patch(partialURL, data);
    }
    async moveActivity(aid: number, data: any): Promise<OFSResponse> {
        return this._executeActivityAction(aid, data, "move");
    }
    async delayActivity(aid: number, data: any): Promise<OFSResponse> {
        return this._executeActivityAction(aid, data, "delay");
    }
    async reopenActivity(aid: number, data: any): Promise<OFSResponse> {
        return this._executeActivityAction(aid, data, "reopen");
    }
    async startActivity(aid: number, data: any): Promise<OFSResponse> {
        return this._executeActivityAction(aid, data, "start");
    }
    async suspendActivity(aid: number, data: any): Promise<OFSResponse> {
        return this._executeActivityAction(aid, data, "suspend");
    }
    async completeActivity(aid: number, data: any): Promise<OFSResponse> {
        return this._executeActivityAction(aid, data, "complete");
    }
    async stopTravel(aid: number, data: any): Promise<OFSResponse> {
        return this._executeActivityAction(aid, data, "stopTravel");
    }
    async cancelActivity(aid: number, data: any): Promise<OFSResponse> {
        return this._executeActivityAction(aid, data, "cancel");
    }
    async startPrework(aid: number, data: any): Promise<OFSResponse> {
        return this._executeActivityAction(aid, data, "startPrework");
    }
    async enrouteActivity(aid: number, data: any): Promise<OFSResponse> {
        return this._executeActivityAction(aid, data, "enroute");
    }
    async notDoneActivity(aid: number, data: any): Promise<OFSResponse> {
        return this._executeActivityAction(aid, data, "notDone");
    }
    private async _executeActivityAction(
        aid: number,
        data: any,
        action: any
    ): Promise<OFSResponse> {
        const partialURL = `/rest/ofscCore/v1/activities/${aid}/custom-actions/${action}`;
        return this._post(partialURL, data);
    }
    async getActivityFilePropertyContent(
        aid: number,
        propertyLabel: string,
        nediaType: string = "*/*"
    ): Promise<OFSResponse> {
        var myHeaders = new Headers();
        myHeaders.append("Accept", nediaType);
        const partialURL = `/rest/ofscCore/v1/activities/${aid}/${propertyLabel}`;
        return this._get(partialURL, undefined, myHeaders);
    }

    async getActivityFilePropertyMetadata(
        aid: number,
        propertyLabel: string
    ): Promise<OFSResponse> {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "*/*");
        const partialURL = `/rest/ofscCore/v1/activities/${aid}/${propertyLabel}`;
        return this._get(partialURL, undefined, myHeaders);
    }

    async getActivityFileProperty(
        aid: number,
        propertyLabel: string
    ): Promise<OFSResponse> {
        var myHeaders = new Headers();
        const partialURL = `/rest/ofscCore/v1/activities/${aid}/${propertyLabel}`;
        var metadata = await this.getActivityFilePropertyMetadata(
            aid,
            propertyLabel
        );
        if (metadata.status < 400) {
            var contentType = metadata.contentType;
            if (contentType) {
                myHeaders.append("Accept", contentType);
            }
            var content = this._get(partialURL, undefined, myHeaders);
            return new OFSResponse(
                metadata.url,
                metadata.status,
                metadata.description,
                {
                    ...metadata.data,
                    content: (await content).data,
                },
                metadata.contentType
            );
        } else {
            return metadata;
        }
    }

    async setActivityFileProperty(
        aid: number,
        propertyLabel: string,
        blob: Blob,
        fileName: string,
        contentType: string = "*/*"
    ): Promise<OFSResponse> {
        const partialURL = `/rest/ofscCore/v1/activities/${aid}/${propertyLabel}`;
        return this._put(partialURL, blob, contentType, fileName);
    }

    async getSubmittedForms(
        activityId: number,
        params: OFSGetSubmittedFormsParams = {}
    ): Promise<OFSSubmittedFormsResponse> {
        const partialURL = `/rest/ofscCore/v1/activities/${activityId}/submittedForms`;
        const queryParams: any = {
            scope: params.scope !== undefined ? params.scope : 'activity'
        };

        if (params.offset !== undefined) {
            queryParams.offset = params.offset;
        }
        if (params.limit !== undefined) {
            queryParams.limit = params.limit;
        }

        return this._get(partialURL, queryParams);
    }

    // Core: User Management
    async getUsers(
        offset: number = 0,
        limit: number = 100
    ): Promise<OFSResponse> {
        const partialURL = "/rest/ofscCore/v1/users";
        return this._get(partialURL, { offset: offset, limit: limit });
    }

    /**
     * Retrieves all users from the OFS API.
     * @returns An object containing all users.
     */
    async getAllUsers() {
        const partialURL = "/rest/ofscCore/v1/users";
        // Start with offset 0 and keep getting results until we get less than 100
        var offset = 0;
        var limit = 100;
        var result: any = undefined;
        var allResults: any = { totalResults: 0, items: [] };
        do {
            result = await this._get(partialURL, {
                offset: offset,
                limit: limit,
            });
            if (result.status < 400) {
                if (allResults.totalResults == 0) {
                    allResults = result.data;
                } else {
                    allResults.items = allResults.items.concat(
                        result.data.items
                    );
                }
                offset += limit;
            } else {
                return result;
            }
        } while (result.data.items.length == limit);
        return allResults;
    }

    async getUserDetails(uname: string): Promise<OFSResponse> {
        const partialURL = `/rest/ofscCore/v1/users/${uname}`;
        return this._get(partialURL);
    }

    // Core: Resource Management
    async getResources(
        params: OFSGetResourcesParams = {}
    ): Promise<OFSResourceResponse> {
        const partialURL = "/rest/ofscCore/v1/resources";
        const queryParams: any = {};
        
        if (params.canBeTeamHolder !== undefined) {
            queryParams.canBeTeamHolder = params.canBeTeamHolder;
        }
        if (params.canParticipateInTeam !== undefined) {
            queryParams.canParticipateInTeam = params.canParticipateInTeam;
        }
        if (params.expand && params.expand.length > 0) {
            queryParams.expand = params.expand.join(',');
        }
        if (params.fields && params.fields.length > 0) {
            queryParams.fields = params.fields.join(',');
        }
        if (params.limit !== undefined) {
            queryParams.limit = params.limit;
        }
        if (params.offset !== undefined) {
            queryParams.offset = params.offset;
        }

        return this._get(partialURL, queryParams);
    }

    /**
     * Retrieves all resources from the OFS API.
     * @param params Optional parameters for filtering resources
     * @returns An object containing all resources.
     */
    async getAllResources(params: Omit<OFSGetResourcesParams, 'limit' | 'offset'> = {}) {
        const partialURL = "/rest/ofscCore/v1/resources";
        var offset = 0;
        var limit = 100;
        var result: any = undefined;
        var allResults: any = { totalResults: 0, items: [] };
        
        const queryParams: any = {};
        if (params.canBeTeamHolder !== undefined) {
            queryParams.canBeTeamHolder = params.canBeTeamHolder;
        }
        if (params.canParticipateInTeam !== undefined) {
            queryParams.canParticipateInTeam = params.canParticipateInTeam;
        }
        if (params.expand && params.expand.length > 0) {
            queryParams.expand = params.expand.join(',');
        }
        if (params.fields && params.fields.length > 0) {
            queryParams.fields = params.fields.join(',');
        }

        do {
            result = await this._get(partialURL, {
                ...queryParams,
                offset: offset,
                limit: limit,
            });
            if (result.status < 400) {
                if (allResults.totalResults == 0) {
                    allResults = result.data;
                } else {
                    allResults.items = allResults.items.concat(
                        result.data.items
                    );
                }
                offset += limit;
            } else {
                return result;
            }
        } while (result.data.items.length == limit);
        return allResults;
    }

    /**
     * Retrieves a single resource by ID from the OFS API.
     * @param resourceId The ID of the resource to retrieve
     * @param params Optional parameters for expanding or filtering fields
     * @returns The resource details
     */
    async getResource(
        resourceId: string,
        params: OFSGetResourceParams = {}
    ): Promise<OFSSingleResourceResponse> {
        const partialURL = `/rest/ofscCore/v1/resources/${resourceId}`;
        const queryParams: any = {};

        if (params.expand && params.expand.length > 0) {
            queryParams.expand = params.expand.join(',');
        }
        if (params.fields && params.fields.length > 0) {
            queryParams.fields = params.fields.join(',');
        }

        return this._get(partialURL, Object.keys(queryParams).length > 0 ? queryParams : undefined);
    }

    async getResourceRoutes(
        resourceId: string,
        date: string,
        activityFields?: string[]
    ): Promise<OFSResourceRoutesResponse> {
        const partialURL = `/rest/ofscCore/v1/resources/${resourceId}/routes/${date}`;
        const queryParams: any = {};
        
        if (activityFields && activityFields.length > 0) {
            queryParams.activityFields = activityFields.join(',');
        }

        return this._get(partialURL, queryParams);
    }

    async getLastKnownPositions(
        params: OFSGetLastKnownPositionsParams = {}
    ): Promise<OFSLastKnownPositionsResponse> {
        const partialURL = "/rest/ofscCore/v1/resources/custom-actions/lastKnownPositions";
        const queryParams: any = {};
        
        if (params.offset !== undefined) {
            queryParams.offset = params.offset;
        }
        if (params.resources && params.resources.length > 0) {
            queryParams.resources = params.resources.join(',');
        }

        return this._get(partialURL, queryParams);
    }

    /**
     * Retrieves all last known positions from the OFS API using pagination.
     * @param params Optional parameters for filtering resources (excludes offset)
     * @returns An object containing all last known positions.
     */
    async getAllLastKnownPositions(
        params: Omit<OFSGetLastKnownPositionsParams, 'offset'> = {}
    ) {
        const partialURL = "/rest/ofscCore/v1/resources/custom-actions/lastKnownPositions";
        var offset = 0;
        var result: any = undefined;
        var allResults: any = { totalResults: 0, items: [] };
        
        const queryParams: any = {};
        if (params.resources && params.resources.length > 0) {
            queryParams.resources = params.resources.join(',');
        }

        do {
            result = await this._get(partialURL, {
                ...queryParams,
                offset: offset,
            });
            if (result.status < 400) {
                if (allResults.totalResults == 0) {
                    allResults = result.data;
                } else {
                    allResults.items = allResults.items.concat(
                        result.data.items
                    );
                }
                // Update the total count to reflect actual accumulated items
                allResults.totalResults = allResults.items.length;
                
                // Increment offset by the number of items returned
                offset += result.data.items.length;
            } else {
                return result;
            }
        } while (result.data.hasMore === true);
        
        return allResults;
    }

    // Core: Activities Management
    async getActivities(
        params: OFSGetActivitiesParams,
        offset: number = 0,
        limit: number = 100
    ): Promise<OFSResponse> {
        const partialURL = "/rest/ofscCore/v1/activities";
        return this._get(partialURL, {
            ...params,
            offset: offset,
            limit: limit,
        });
    }

    // Core: Activities Management
    async searchForActivities(
        params: OFSSearchForActivitiesParams,
        offset: number = 0,
        limit: number = 100
    ): Promise<OFSResponse> {
        const partialURL = "/rest/ofscCore/v1/activities/custom-actions/search";
        return this._get(partialURL, {
            ...params,
            offset: offset,
            limit: limit,
        });
    }
    /**
     * Retrieves all activities from the OFS API.
     * @returns An object containing all activities.
     */
    async getAllActivities(
        params: OFSGetActivitiesParams,
        limit: number = 1000
    ) {
        const partialURL = "/rest/ofscCore/v1/activities";
        // Start with offset 0 and keep getting results until we get less than 100
        var offset = 0;

        var result: any = undefined;
        var allResults: any = {
            status: 200,
            detail: "",
            title: "",
            totalResults: 0,
            items: [],
        };
        do {
            result = await this._get(partialURL, {
                ...params,
                offset: offset,
                limit: limit,
            });
            if (result.status == 200) {
                if (allResults.totalResults == 0) {
                    allResults = result.data;
                    allResults.status = 200;
                } else {
                    allResults.items = allResults.items.concat(
                        result.data.items
                    );
                }
                allResults.totalResults = allResults.items.length;
                offset += limit;
            } else {
                return result;
            }
        } while (result.data.hasMore == true);
        return allResults;
    }
    // Metadata: Plugin Management
    async importPlugins(file?: PathLike, data?: string): Promise<OFSResponse> {
        const partialURL =
            "/rest/ofscMetadata/v1/plugins/custom-actions/import";
        var formData = new FormData();
        if (file) {
            var blob = new Blob([readFileSync(file)], { type: "text/xml" });

            formData.append("pluginFile", blob, file.toString());
        } else if (data) {
            var blob = new Blob([data], { type: "text/xml" });
            formData.append("pluginFile", blob, "plugin.xml");
        } else {
            throw "Must provide file or data";
        }

        return this._postMultiPart(partialURL, formData);
    }

    //Meta: Property Management

    async getProperties(
        params: OFSGetPropertiesParams = { offset: 0, limit: 100 }
    ): Promise<OFSPropertyListResponse> {
        const partialURL = "/rest/ofscMetadata/v1/properties";
        return this._get(partialURL, params);
    }

    //Meta: Link Templates
    async getLinkTemplates(): Promise<OFSLinkTemplatesResponse> {
        const partialURL = "/rest/ofscMetadata/v1/linkTemplates";
        return this._get(partialURL) as Promise<OFSLinkTemplatesResponse>;
    }

    async getPropertyDetails(pid: string): Promise<OFSPropertyDetailsResponse> {
        const partialURL = `/rest/ofscMetadata/v1/properties/${pid}`;
        return this._get(partialURL);
    }

    async createReplaceProperty(
        data: OFSPropertyDetails
    ): Promise<OFSPropertyDetailsResponse> {
        const partialURL = `/rest/ofscMetadata/v1/properties/${data.label}`;
        return this._put(partialURL, data);
    }

    async updateProperty(
        data: OFSPropertyDetails
    ): Promise<OFSPropertyDetailsResponse> {
        const partialURL = `/rest/ofscMetadata/v1/properties/${data.label}`;
        return this._patch(partialURL, data);
    }

    //Meta: Timeslots
    async getTimeslots(): Promise<OFSTimeslotsResponse> {
        const partialURL = `/rest/ofscMetadata/v1/timeSlots`;
        return this._get(partialURL);
    }

    // Capacity API: Booking Grid
    /**
     * Retrieves the time slots in which an activity can be performed.
     * @param params Parameters for the booking grid request
     * @returns The booking grid response with available time slots
     */
    async showBookingGrid(
        params: OFSShowBookingGridParams
    ): Promise<OFSShowBookingGridResponse> {
        const partialURL = "/rest/ofscCapacity/v1/showBookingGrid";
        return this._post(partialURL, params);
    }

    // Capacity API: Activity Booking Options
    /**
     * Retrieves available booking options for an activity type on specific dates.
     * @param params Parameters for the activity booking options request
     * @returns The activity booking options response with available time slots by date/area
     */
    async getActivityBookingOptions(
        params: OFSGetActivityBookingOptionsParams
    ): Promise<OFSGetActivityBookingOptionsResponse> {
        const partialURL = "/rest/ofscCapacity/v1/activityBookingOptions";
        const queryParams: any = {};

        // Known array parameters that need CSV conversion
        const arrayParams = ['dates', 'areas', 'categories'];

        // Process all parameters
        for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue;

            if (arrayParams.includes(key) && Array.isArray(value)) {
                // Convert arrays to CSV format
                if (value.length > 0) {
                    queryParams[key] = value.join(',');
                }
            } else {
                // Pass through all other parameters as-is
                queryParams[key] = value;
            }
        }

        return this._get(partialURL, queryParams);
    }
}
