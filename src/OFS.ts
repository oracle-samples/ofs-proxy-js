/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { PathLike, readFileSync } from "fs";
import {
    OFSActivityResponse,
    OFSCredentials,
    OFSResponse,
    OFSSubscriptionResponse,
} from "./model";

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
        this._baseURL = new URL(
            `https://${this.instance}.${OFS.DEFAULT_DOMAIN}`
        );
    }

    public get authorization(): string {
        return this._hash;
    }

    constructor(credentials: OFSCredentials) {
        this.credentials = credentials;
    }

    public get instance(): string {
        return this.credentials.instance;
    }

    private static authenticateUser(credentials: OFSCredentials): string {
        var token =
            credentials.clientId +
            "@" +
            credentials.instance +
            ":" +
            credentials.clientSecret;
        var hash = Buffer.from(token).toString("base64");
        return "Basic " + hash;
    }

    private _get(partialURL: string): Promise<OFSResponse> {
        var theURL = new URL(partialURL, this._baseURL);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", this.authorization);
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
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
    async getSubscriptions(): Promise<OFSSubscriptionResponse> {
        const partialURL = "/rest/ofscCore/v1/events/subscriptions";
        return this._get(partialURL);
    }

    // Core: Activity Management
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
    async updateActivity(aid: number, data: any): Promise<OFSResponse> {
        const partialURL = `/rest/ofscCore/v1/activities/${aid}`;
        return this._patch(partialURL, data);
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
}
