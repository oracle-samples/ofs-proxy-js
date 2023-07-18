/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

export type OFSCredentials = {
    instance: string;
    clientId: string;
    clientSecret: string;
};

export interface OFSResponseInterface {
    status: number;
    description: string | undefined;
    data: any;
    url: URL;
}

export class OFSResponse implements OFSResponseInterface {
    status: number = -1;
    description: string | undefined;
    data: any;
    url: URL;

    constructor(url: URL, status: number, description?: string, data?: any) {
        this.status = status;
        this.description = description;
        this.data = data;
        this.url = url;
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

export class OFSSubscriptionResponse extends OFSResponse {
    data!: SubscriptionListResponse;
}

export class OFSActivityResponse extends OFSResponse {
    data!: ActivityResponse;
}
