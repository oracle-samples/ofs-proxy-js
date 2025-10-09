/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { off } from "process";

export type OFSCredentials = {
    instance?: string;
    clientId?: string;
    clientSecret?: string;
    token?: string;
    baseURL?: string;
};

export interface OFSResponseInterface {
    status: number;
    description: string | undefined;
    data: any;
    url: URL;
    contentType?: string;
}

export class OFSResponse implements OFSResponseInterface {
    status: number = -1;
    description: string | undefined;
    data: any;
    url: URL;
    contentType?: string;

    constructor(
        url: URL,
        status: number,
        description?: string,
        data?: any,
        contentType?: string
    ) {
        this.status = status;
        this.description = description;
        this.data = data;
        this.url = url;
        this.contentType = contentType;
    }
}

export interface ListResponse {
    totalResults: number;
    items: Array<any>;
    links: any;
}
export interface Subscription {
    subscriptionId: string;
    applicationId: string;
    createdTime: string;
    expirationTime: string;
    subscriptionTitle: string;
    subscriptionConfig: any;
    links: any;
}

export interface ActivityResponse {
    customerName: any;
    activityId: number;
}

export interface SubscriptionListResponse {
    totalResults: number;
    items: Array<Subscription>;
    links: any;
}

export interface ActivityListResponse {
    totalResults: number;
    items: Array<Subscription>;
    links: any;
}

export interface OFSTranslation {
    language: string;
    name: string;
    languageISO: string;
}
export interface OFSPropertyDetails {
    label: string;
    name?: string;
    type?: string;
    entity?: string;
    gui?: string;
    allowDraw?: boolean;
    cloneFlag?: boolean;
    fileSizeLimit?: string;
    getGeolocation?: boolean;
    hint?: string;
    lines?: number;
    maxHeight?: number;
    maxWidth?: number;
    mimeTypes?: [];
    template?: string;
    transformation?: any;
    watermark?: boolean;
    translations?: OFSTranslation[];
    links?: any;
}

export interface OFSGetPropertiesParams {
    entity?: string;
    language?: string;
    limit?: number;
    offset?: number;
    type?: number;
}
export class OFSPropertyList {
    items: OFSPropertyDetails[] = [];
    limit: number = 0;
    offset: number = 0;
    totalResults: number = 0;
}
export class OFSTimeslot {
    active: boolean = false;
    isAllDay: boolean = false;
    timeEnd: string = "";
    timeStart: string = "";
    label: string = "";
    name: string = "";
}
export class OFSTimeslotsList {
    items: OFSTimeslot[] = [];
    limit: number = 0;
    offset: number = 0;
    totalResults: number = 0;
}
export class OFSSubscriptionResponse extends OFSResponse {
    data: SubscriptionListResponse = {
        totalResults: 0,
        items: [],
        links: undefined,
    };
}

export class OFSActivityResponse extends OFSResponse {
    data: ActivityResponse = {
        customerName: undefined,
        activityId: 0,
    };
}

export class OFSPropertyDetailsResponse extends OFSResponse {
    data: OFSPropertyDetails = {
        label: "",
        name: "",
        type: "string",
        entity: "activity",
        gui: "",
        translations: [],
        links: undefined,
    };
}

export class OFSPropertyListResponse extends OFSResponse {
    data: OFSPropertyList = new OFSPropertyList();
}

export class OFSTimeslotsResponse extends OFSResponse {
    data: OFSTimeslotsList = new OFSTimeslotsList();
}

export interface OFSGetActivitiesParams {
    resources: string;
    dateFrom?: string;
    dateTo?: string;
    fields?: string;
    includeChildren?: string;
    includeNonScheduled?: boolean;
    q?: string;
}

export interface OFSSearchForActivitiesParams {
    dateFrom: string;
    dateTo: string;
    searchForValue: string;
    searchInField: string;
    fields?: string;
    includeMultiday?: string;
    includeNonScheduled?: boolean;
}

export interface OFSBulkUpdateRequestInterface {
    activities: any[];
    updateParameters: OFSBulkUpdateRequestParamsInterface;
}

export class OFSBulkUpdateRequest implements OFSBulkUpdateRequestInterface {
    activities: any[] = [];
    updateParameters: OFSBulkUpdateRequestParams = {
        ifInFinalStatusThen: "doNothing",
        identifyActivityBy: "apptNumber",
        ifExistsThenDoNotUpdateFields: [],
    };

    constructor(
        activities: any[],
        updateParameters?: OFSBulkUpdateRequestParams
    ) {
        this.activities = activities;
        this.updateParameters = updateParameters || {
            ifInFinalStatusThen: "doNothing",
            identifyActivityBy: "apptNumber",
            ifExistsThenDoNotUpdateFields: [],
        };
    }
}
export interface OFSBulkUpdateRequestParamsInterface {
    fallbackResourceId?: string;
    identifyActivityBy?: string;
    ifExistsThenDoNotUpdateFields?: any[];
    ifInFinalStatusThen: string;
    inventoryPropertiesUpdateMode?: string;
}

export class OFSBulkUpdateRequestParams
    implements OFSBulkUpdateRequestParamsInterface
{
    fallbackResourceId?: string;
    identifyActivityBy: string = "apptNumber"; // default value
    ifExistsThenDoNotUpdateFields: any[] = [];
    ifInFinalStatusThen: string = "doNothing"; // default value
    inventoryPropertiesUpdateMode?: string;

    constructor(
        fallbackResourceId?: string,
        identifyActivityBy?: string,
        ifExistsThenDoNotUpdateFields?: any[],
        ifInFinalStatusThen?: string,
        inventoryPropertiesUpdateMode?: string
    ) {
        this.fallbackResourceId = fallbackResourceId;
        if (identifyActivityBy) {
            this.identifyActivityBy = identifyActivityBy;
        }
        if (ifExistsThenDoNotUpdateFields) {
            this.ifExistsThenDoNotUpdateFields = ifExistsThenDoNotUpdateFields;
        }
        if (ifInFinalStatusThen) {
            this.ifInFinalStatusThen = ifInFinalStatusThen;
        }
        this.inventoryPropertiesUpdateMode = inventoryPropertiesUpdateMode;
    }
}

export interface OFSGetResourcesParams {
    canBeTeamHolder?: boolean;
    canParticipateInTeam?: boolean;
    expand?: string[];
    fields?: string[];
    limit?: number;
    offset?: number;
}

export interface OFSGetAllResourcesOptions {
    batchSize?: number;
    enableRetry?: boolean;
    retryWaitTime?: number;
    maxRetries?: number;
}

export interface OFSResource {
    resourceId: string;
    name: string;
    status: string;
    resourceType: string;
    email?: string;
    phone?: string;
    language?: string;
    timeZone?: string;
}

export interface OFSResourceListResponse {
    totalResults: number;
    limit: number;
    offset: number;
    items: OFSResource[];
    links?: any;
}

export class OFSResourceResponse extends OFSResponse {
    data: OFSResourceListResponse = {
        totalResults: 0,
        limit: 100,
        offset: 0,
        items: [],
        links: undefined,
    };
}

export interface OFSGetResourceRoutesParams {
    resourceId: string;
    date: string;
    activityFields?: string[];
}

export interface OFSRouteActivity {
    activityId: number;
    latitude?: number;
    longitude?: number;
    status?: string;
    [key: string]: any;
}

export interface OFSResourceRoutesData {
    routeStartTime?: string;
    totalResults: number;
    limit: number;
    offset: number;
    items: OFSRouteActivity[];
    links?: any[];
    [key: string]: any;
}

export class OFSResourceRoutesResponse extends OFSResponse {
    data: OFSResourceRoutesData = {
        totalResults: 0,
        limit: 100,
        offset: 0,
        items: [],
    };
}

export interface OFSGetLastKnownPositionsParams {
    offset?: number;
    resources?: string[];
}

export interface OFSLastKnownPosition {
    resourceId: string;
    time?: string;
    lat?: number;
    lng?: number;
    errorMessage?: string;
}

export interface OFSLastKnownPositionsData {
    totalResults: number;
    items: OFSLastKnownPosition[];
    hasMore?: boolean;
}

export class OFSLastKnownPositionsResponse extends OFSResponse {
    data: OFSLastKnownPositionsData = {
        totalResults: 0,
        items: [],
    };
}

export interface OFSGetSubmittedFormsParams {
    offset?: number;
    limit?: number;
    scope?: string;
}

export interface OFSFormIdentifier {
    formSubmitId: string;
    formLabel: string;
}

export interface OFSSubmittedFormItem {
    time: string;
    user: string;
    formIdentifier: OFSFormIdentifier;
    formDetails: { [key: string]: any };
    activityDetails?: { [key: string]: any };
    resourceDetails?: { [key: string]: any };
}

export interface OFSSubmittedFormsData {
    hasMore: boolean;
    totalResults: number;
    offset: number;
    limit: number;
    items: OFSSubmittedFormItem[];
    links?: any[];
}

export class OFSSubmittedFormsResponse extends OFSResponse {
    data: OFSSubmittedFormsData = {
        hasMore: false,
        totalResults: 0,
        offset: 0,
        limit: 100,
        items: [],
    };
}
1