/*
 * Copyright © 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License (UPL), Version 1.0  as shown at https://oss.oracle.com/licenses/upl/
 */

import { OFSCredentials } from '../src/model';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';

export function getTestCredentials(): OFSCredentials {
    // First, try environment variables
    const envCredentials: OFSCredentials = {
        instance: process.env.OFS_INSTANCE || '',
        clientId: process.env.OFS_CLIENT_ID || '',
        clientSecret: process.env.OFS_CLIENT_SECRET || '',
    };

    // Check if environment variables are set (either instance-based or token-based)
    const hasEnvCredentials = envCredentials.instance && envCredentials.clientId && envCredentials.clientSecret;

    if (hasEnvCredentials) {
        return envCredentials;
    }

    // Fall back to credentials file
    const credentialsPath = join(dirname(__filename), 'credentials_test.json');
    if (existsSync(credentialsPath)) {
        try {
            const fileContent = readFileSync(credentialsPath, 'utf-8');
            const fileCredentials = JSON.parse(fileContent) as OFSCredentials;

            // Check if file has valid credentials (either token+baseURL or instance-based)
            if ((fileCredentials.token && fileCredentials.baseURL) ||
                (fileCredentials.instance && fileCredentials.clientId && fileCredentials.clientSecret)) {
                return fileCredentials;
            }
        } catch (error) {
            console.warn('Failed to read credentials file:', error);
        }
    }

    // No valid credentials found
    console.warn('OFS test credentials not found.');
    console.warn('Options: 1) Set environment variables: OFS_INSTANCE, OFS_CLIENT_ID, OFS_CLIENT_SECRET');
    console.warn('         2) Create test/credentials_test.json with token and baseURL');

    return envCredentials;
}