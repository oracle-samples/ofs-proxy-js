/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { OFSCredentials } from '../src/model';

export function getTestCredentials(): OFSCredentials {
    const credentials: OFSCredentials = {
        instance: process.env.OFS_INSTANCE || '',
        clientId: process.env.OFS_CLIENT_ID || '',
        clientSecret: process.env.OFS_CLIENT_SECRET || '',
    };

    if (!credentials.instance || !credentials.clientId || !credentials.clientSecret) {
        console.warn('OFS test credentials not found in environment variables. Tests will fail.');
        console.warn('Required environment variables: OFS_INSTANCE, OFS_CLIENT_ID, OFS_CLIENT_SECRET');
    }

    return credentials;
}