# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript library that provides a JavaScript proxy to access Oracle Field Service (OFS) cloud via REST API. It's distributed as both an ES module and includes TypeScript definitions.

## Key Commands

### Development

-   `npm run build` - Compile TypeScript to JavaScript (outputs to ./build/)
-   `npm run start` - Run the application using ts-node
-   `npm run test` - Run Jest tests with coverage
-   `npm run dist` - Build distribution files using Rollup (outputs to ./dist/)

### Testing

-   Tests are located in the `test/` directory
-   Jest configuration is in `jest.config.ts`
-   Uses ts-jest preset for TypeScript support
-   Coverage reports are generated in `coverage/` directory

## Architecture

### Core Structure

-   **src/OFS.ts** - Main OFS class with all API methods
-   **src/model.ts** - TypeScript interfaces and types for API responses
-   **Entry point**: `src/OFS.ts` exports the main OFS class and all model types

### OFS Class Structure

The main OFS class provides methods organized by functional areas:

**Core API Categories:**

-   **Activity Management**: CRUD operations, status changes (start, complete, cancel, etc.)
-   **Resource Management**: Get resources, routes, with filtering and pagination
-   **User Management**: User CRUD operations with pagination support
-   **Subscription Management**: Event subscription handling
-   **Property Management**: Metadata property operations
-   **Plugin Management**: Import/export plugin functionality

**Key Patterns:**

-   Private HTTP methods (`_get`, `_post`, `_patch`, `_put`, `_delete`) handle all API communication
-   Authentication supports both Basic Auth (clientId/secret) and Bearer token
-   Pagination helpers like `getAllActivities()`, `getAllUsers()`, `getAllResources()` fetch complete datasets
-   File operations support blob handling for attachments

### Authentication

-   Supports two authentication modes:
    -   Basic Auth: `clientId` + `clientSecret` + `instance`
    -   Bearer Token: `token` + `instance`
-   Custom baseURL can be provided, defaults to Oracle's cloud domain

### Response Handling

-   All API methods return `OFSResponse` objects with standardized structure
-   Typed response classes for specific endpoints (e.g., `OFSActivityResponse`, `OFSResourceResponse`)
-   Error handling captures both HTTP errors and network failures

## Build Configuration

### TypeScript (tsconfig.json)

-   Target: ES2016
-   Module: ES2022
-   Output: ./build/ directory
-   Strict mode enabled
-   Declaration files generated

### Rollup (rollup.config.mjs)

-   Input: src/OFS.ts
-   Output: dist/ofs.es.js (ES module format)
-   Plugins: TypeScript compilation, Terser minification
-   Generates both JS bundle and TypeScript declarations

### Test Configuration

-   Jest with ts-jest preset
-   Test files: `test/**/*.test.ts`
-   Node environment
-   Coverage collection enabled

## Development Notes

### File Organization

-   Source code: `src/` (only 2 files: OFS.ts and model.ts)
-   Tests: `test/general/` with separate test files for different API areas
-   Build output: `build/` (TypeScript compilation)
-   Distribution: `dist/` (Rollup bundle)

### Testing Approach

-   Integration-style tests that require actual OFS credentials
-   Test configuration files in `test/` directory
-   Separate test files for different API functional areas

### Git Workflow

-   Uses Husky for pre-commit hooks with pretty-quick for code formatting
-   Current branch: `51-add-getlastknowposition`
-   Main branch: `main`
