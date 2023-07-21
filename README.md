# Oracle Field Service Proxy

A Javascript proxy to access Oracle Field Service cloud via REST API. For more information about the REST API please visit [the oficial documentation](https://www.oracle.com/pls/topic/lookup?ctx=en/cloud/saas/field-service&ID=field-service)

## Prerequisites

In order to use this library you need to have access to an Oracle Field Service instance, via an application ID. Please contact your OFS Administrator to get one.

## Installation


1. Add the dependency to your project
   
   `npm install <LOCAL REPOSITORY DIR>`         (if you have cloned the repository)

   `npm install https://github.com/oracle-samples/ofs-proxy-js`    (when installing directly from GitHub)

2. To use the library in your code:

   `import {OFSPlugin} from "@ofs_users/proxy"`

## Functions implemented

`getActivity(activityId)`: Get activity details

`updateActivity(activityId, activityData)`: Update activity details

`getSubscriptions()`: Get existing subscriptions

`importPlugins(file?, data?)`: Import plugin by path or via an XML string

## Documentation and Examples

Please see the `docs/` directory for documentation and a simple example

## Version History

| Version | Comments |
| ---------| ----------- |
| 0.1| Added `getActivity`, `updateActivity`, `getSubscriptions` |
| 1.1| Added `importPlugins` |

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
