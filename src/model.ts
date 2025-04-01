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
export interface OFSBulkUpdateResponseResultInterace {
    activityKeys: any;
    errors: any[];
    operationsFailed: any[];
    operationsPerformed: any[];
    warnings: any[];
}
export class OFSBulkUpdateResponseResult
    implements OFSBulkUpdateResponseResultInterace
{
    activityKeys: any = {};
    errors: any[] = [];
    operationsFailed: any[] = [];
    operationsPerformed: any[] = [];
    warnings: any[] = [];
    constructor(
        activityKeys?: any,
        errors?: any[],
        operationsFailed?: any[],
        operationsPerformed?: any[],
        warnings?: any[]
    ) {
        if (activityKeys) {
            this.activityKeys = activityKeys;
        }
        if (errors) {
            this.errors = errors;
        }
        if (operationsFailed) {
            this.operationsFailed = operationsFailed;
        }
        if (operationsPerformed) {
            this.operationsPerformed = operationsPerformed;
        }
        if (warnings) {
            this.warnings = warnings;
        }
    }
}
export interface OFSBulkUpdateResponseInterface {
    results: OFSBulkUpdateResponseResultInterace[];
}
export class OFSBulkUpdateResponse implements OFSBulkUpdateResponseInterface {
    results: OFSBulkUpdateResponseResult[] = [];

    constructor(results?: OFSBulkUpdateResponseResult[]) {
        if (results) {
            this.results = results;
        }
    }

    addResult(result: OFSBulkUpdateResponseResult): void {
        this.results.push(result);
    }
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
