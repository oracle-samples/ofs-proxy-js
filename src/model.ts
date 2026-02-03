export interface OFSLinkTemplate {
    linkTemplateId: string;
    name: string;
    description?: string;
    linkType: string;
    sourceType: string;
    targetType: string;
    links?: any;
}

export interface OFSLinkTemplatesData {
    totalResults: number;
    items: OFSLinkTemplate[];
    links?: any;
}

// ...existing code...
// Move OFSLinkTemplatesResponse after OFSResponse
// ...existing code...
// ...existing code...
// ...existing code...
// ...existing code...
// ...existing code...
// ...existing code...
// ...existing code...
// ...existing code...
// Place this after OFSResponse class
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

export class OFSLinkTemplatesResponse extends OFSResponse {
    data: {
        totalResults: number;
        items: OFSLinkTemplate[];
        links?: any;
    } = {
        totalResults: 0,
        items: [],
        links: undefined,
    };
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

export interface OFSLinkedActivitiesData {
    totalResults: number;
    items: ActivityResponse[];
    links?: any;
}

export class OFSLinkedActivitiesResponse extends OFSResponse {
    data: OFSLinkedActivitiesData = {
        totalResults: 0,
        items: [],
        links: undefined,
    };
}

export interface OFSActivityLinkTypeData {
    linkType: string;
    links?: any;
}

export class OFSActivityLinkTypeResponse extends OFSResponse {
    data: OFSActivityLinkTypeData = {
        linkType: '',
        links: undefined
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

export interface OFSGetResourceParams {
    expand?: string[];
    fields?: string[];
}

export class OFSSingleResourceResponse extends OFSResponse {
    data: OFSResource = {
        resourceId: '',
        name: '',
        status: '',
        resourceType: '',
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

// Capacity API: showBookingGrid
export interface OFSShowBookingGridParams {
    activity: Record<string, any>;
    dateFrom: string;
    dateTo?: string;
    identifyActivityBy?: 'activityId' | 'apptNumber' | 'apptNumberPlusCustomerNumber';
    includeResourcesDictionary?: boolean;
    includeTimeSlotsDictionary?: boolean;
    returnReasons?: boolean;
    resourceFields?: string[];
    lateStartMitigation?: number;
    forecastDuringBooking?: Record<string, any>;
}

export interface OFSBookingGridTimeSlot {
    label: string;
    originalQuota?: number;
    remainingQuota?: number;
    reason?: string;
    recommendationInfo?: {
        additionalTravel?: number;
        travelKeyMatch?: boolean;
    };
    setPositionInRoute?: string;
}

export interface OFSBookingGridDate {
    date: string;
    timeSlots: OFSBookingGridTimeSlot[];
}

export interface OFSBookingGridArea {
    label: string;
    name?: string;
    bucket?: string;
    timeZone?: string;
    timeZoneDiff?: number;
    areaTimeSlots?: string[];
    averageBucketTravel?: number;
    dates: OFSBookingGridDate[];
}

export interface OFSTimeSlotDictionary {
    label: string;
    name?: string;
    timeStart?: string;
    timeEnd?: string;
    active?: boolean;
    isAllDay?: boolean;
}

export interface OFSResourceDictionary {
    resourceId: string;
    [key: string]: any;
}

export interface OFSShowBookingGridData {
    actualAtTime?: string;
    duration?: number;
    travelTime?: number;
    workZone?: string;
    areas: OFSBookingGridArea[];
    resourcesDictionary?: OFSResourceDictionary[];
    timeSlotsDictionary?: OFSTimeSlotDictionary[];
}

export class OFSShowBookingGridResponse extends OFSResponse {
    data: OFSShowBookingGridData = {
        areas: [],
    };
}

// Capacity API: getActivityBookingOptions
export interface OFSGetActivityBookingOptionsParams {
    /** The type of the activity. Based on the activity type, predefined company-specific rules are applied (required) */
    activityType: string;
    /** The dates for which the booking options are requested in YYYY-MM-DD format (required) */
    dates: string[];
    /** Capacity area labels; if omitted and determineAreaByWorkZone=false, processes all visible areas */
    areas?: string[];
    /** Capacity category labels for filtering */
    categories?: string[];
    /** Customer city location; used for geocoding */
    city?: string;
    /** Customer postal code; used for geocoding */
    postalCode?: string;
    /** Customer state/province; used for geocoding */
    stateProvince?: string;
    /** Customer street address; used for geocoding */
    streetAddress?: string;
    /** Activity location latitude coordinate in degrees (-90 to 90) */
    latitude?: number;
    /** Activity location longitude coordinate in degrees (-180 to 180) */
    longitude?: number;
    /** If true, estimates activity duration using statistics. Default: true */
    estimateDuration?: boolean;
    /** If true, estimates travel time using statistics when configured. Default: true */
    estimateTravelTime?: boolean;
    /** If true, determines categories from work skill conditions. Default: true */
    determineCategory?: boolean;
    /** If true, determines work zone automatically; requires all work zone key fields. Default: true */
    determineAreaByWorkZone?: boolean;
    /** Duration in minutes when estimation disabled or statistical record unavailable. Default: activity type default */
    defaultDuration?: number;
    /** For day-0 bookings: only returns intervals starting after currentTime + this value (minutes) */
    minTimeBeforeArrival?: number;
    /** If true, returns areas with at least one matching category. Default: false */
    includePartiallyDefinedCategories?: boolean;
    /** Allow additional custom parameters as key-value pairs */
    [key: string]: string | string[] | number | boolean | undefined;
}

export interface OFSBookingOptionsTimeSlot {
    label: string;
    originalQuota?: number;
    remainingQuota?: number;
    reason?: string;
    recommendationInfo?: {
        additionalTravel?: number;
        travelKeyMatch?: boolean;
    };
}

export interface OFSBookingOptionsArea {
    label: string;
    name?: string;
    bucket?: string;
    timeZone?: string;
    timeZoneDiff?: number;
    averageBucketTravel?: number;
    averageTravelKeyTravel?: number;
    timeSlots: OFSBookingOptionsTimeSlot[];
    reason?: string;
}

export interface OFSBookingOptionsDate {
    date: string;
    areas: OFSBookingOptionsArea[];
}

export interface OFSGetActivityBookingOptionsData {
    actualAtTime?: string;
    duration?: number;
    travelTime?: number;
    workZone?: string;
    categories?: string[];
    dates: OFSBookingOptionsDate[];
    timeSlotsDictionary?: OFSTimeSlotDictionary[];
}

export class OFSGetActivityBookingOptionsResponse extends OFSResponse {
    data: OFSGetActivityBookingOptionsData = {
        dates: [],
    };
}