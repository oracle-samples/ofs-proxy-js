# Oracle Field Service Proxy

A Javascript proxy to access Oracle Field Service cloud via REST API. For more information about the REST API please visit [the official documentation](https://www.oracle.com/pls/topic/lookup?ctx=en/cloud/saas/field-service&ID=field-service)

## Prerequisites

In order to use this library you need to have access to an Oracle Field Service instance, via an application ID. Please contact your OFS Administrator to get one.

## Installation

1. Add the dependency to your project

    `npm install <LOCAL REPOSITORY DIR>` (if you have cloned the repository)

    `npm install https://github.com/oracle-samples/ofs-proxy-js.git` (when installing directly from GitHub)

    `npm install @ofs-users/proxy` (when installing from npm)

2. To use the library in your code:

    `import {OFS} from "@ofs-users/proxy"`

## Functions implemented (may not be complete)

### Core: Activity Management

`getActivities()`: Get existing activities

`getAllActivities()`: Get ALL existing activities

`searchForActivities(params)` : Search a list of activities based on some input params

`createActivity(activityData)`: Create activity

`deleteActivity(activityId)`: Delete activity

`updateActivity(activityId, activityData)`: Update activity details

`bulkUpdateActivity(data)`: Update a list of activities

`moveActivity(activityId, activityData)`: Move activity

`delayActivity(activityId, activityData)`: Delay activity

`reopenActivity(activityId, activityData)`: Reopen activity

`startActivity(activityId, activityData)`: Start activity

`suspendActivity(activityId, activityData)`: Suspend activity

`completeActivity(activityId, activityData)`: Complete activity

`cancelActivity(activityId, activityData)`: Cancel activity

`notDoneActivity(activityId, activityData)`: Set activity to Not Done status

`startPrework(activityId, activityData)`: Start activity prework

`stopTravel(activityId, activityData)`: Stop Travel ( From Enroute to Pending )

`enrouteActivity(activityId, activityData)`: Stop Travel ( From Pending to Enroute )

`setActivityFileProperty(activityId, propertyId, file)`: Set file property

`getActivityFilePropertyMetadata(activityId, propertyId)`: Get file property metadata

`getActivityFilePropertyContent(activityId, propertyId, contentType)`: Get file property content

`getActivityFileProperty(activityId, propertyId)`: Get file property (content and metadata)

### Core: Subscription Management

`getSubscriptions()`: Get existing subscriptions

### Core: User Management

`getUsers()`: Get existing users

`getUserDetails(userId)`: Get user details

`getAllUsers()`: Get all users

### Core: Resource Management

`getResources(params?)`: Get existing resources with optional filtering parameters

- `params.canBeTeamHolder` (boolean): Filter resources that can be team holders
- `params.canParticipateInTeam` (boolean): Filter resources that can participate in teams  
- `params.expand` (array): Include sub-entities like inventories, workZones, workSkills
- `params.fields` (array): Specify which resource fields to return
- `params.limit` (number): Number of items to return (1-100, default 100)
- `params.offset` (number): Starting record number (default 0)

`getAllResources(params?)`: Get all resources using pagination (excludes limit/offset from params)

### Core: Plugin Management

`importPlugins(file?, data?)`: Import plugin by path or via an XML string

### Metadata:

`getTimeslots()` : Get a list of configured timeslots

_Property Management_

`getProperties()`: Get existing properties

`getPropertyDetails(propertyId)`: Get property details

`updateProperty(propertyId, propertyData)`: Update property details

`createReplaceProperty(propertyData)`: Create or replace property

## Documentation and Examples

Please see the `docs/` directory for documentation and a simple example

## Version History

| Version | Comments                                                                              |
| ------- | ------------------------------------------------------------------------------------- |
| 0.1     | Added `getActivityDetails`, `updateActivity`, `getSubscriptions`                      |
| 1.1     | Added `importPlugins`                                                                 |
| 1.2     | Added `createActivity`, `deleteActivity`                                              |
| 1.6     | Added `getUsers`, `getUserDetails`, `getAllUsers`                                     |
| 1.8     | Added `getProperties`, `getPropertyDetails`, `updateProperty` `createReplaceProperty` |

## Contributing

This project welcomes contributions from the community. Before submitting a pull
request, please [review our contribution guide](./CONTRIBUTING.md).

## Security

Please consult the [security guide](./SECURITY.md) for our responsible security
vulnerability disclosure process.

## License

Copyright (c) 2023 Oracle and/or its affiliates.

Released under the Universal Permissive License v1.0 as shown at
<https://oss.oracle.com/licenses/upl/>.

ORACLE AND ITS AFFILIATES DO NOT PROVIDE ANY WARRANTY WHATSOEVER, EXPRESS OR IMPLIED, FOR ANY SOFTWARE, MATERIAL OR CONTENT OF ANY KIND CONTAINED OR PRODUCED WITHIN THIS REPOSITORY, AND IN PARTICULAR SPECIFICALLY DISCLAIM ANY AND ALL IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, AND FITNESS FOR A PARTICULAR PURPOSE.  FURTHERMORE, ORACLE AND ITS AFFILIATES DO NOT REPRESENT THAT ANY CUSTOMARY SECURITY REVIEW HAS BEEN PERFORMED WITH RESPECT TO ANY SOFTWARE, MATERIAL OR CONTENT CONTAINED OR PRODUCED WITHIN THIS REPOSITORY.  IN ADDITION, AND WITHOUT LIMITING THE FOREGOING, THIRD PARTIES MAY HAVE POSTED SOFTWARE, MATERIAL OR CONTENT TO THIS REPOSITORY WITHOUT ANY REVIEW. USE AT YOUR OWN RISK.
