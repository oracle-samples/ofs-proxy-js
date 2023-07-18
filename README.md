# Oracle Field Service Proxy

A Javascript proxy to access Oracle Field Service cloud via REST API. For more information about the REST API please visit [the oficial documentation](https://www.oracle.com/pls/topic/lookup?ctx=en/cloud/saas/field-service&ID=field-service)
## Installation

1. Clone the repository

2. Add the dependency to your project
   
   `npm install <LOCAL REPOSITORY DIR>`

3. To use the library in your code:

   `import {OFSPlugin} from "@ofs_users/proxy"`

## Functions implemented

`getActivity(activityId)`: Get activity details

`updateActivity(activityId, activityData)`: Update activity details

`getSubscriptions()`: Get existing subscriptions

`importPlugins(file?, data?)`: Import plugin by path or via an XML string

## Documentation and Examples

<!-- Developer-oriented documentation can be published on GitHub, but all product
     documentation must be published on <https://docs.oracle.com>. -->

Please see the `docs/` directory for documentation and a simple example

## Version History

| Version | Comments |
| ---------| ----------- |
| 0.1| Added `getActivity`, `updateActivity`, `getSubscriptions` |
| 1.1| Added `importPlugins` |


## Contributing

<!-- If your project has specific contribution requirements, update the
    CONTRIBUTING.md file to ensure those requirements are clearly explained. -->

This project welcomes contributions from the community. Before submitting a pull
request, please [review our contribution guide](./CONTRIBUTING.md).

## Security

Please consult the [security guide](./SECURITY.md) for our responsible security
vulnerability disclosure process.

## License

<!-- The correct copyright notice format for both documentation and software
    is "Copyright (c) [year,] year Oracle and/or its affiliates."
    You must include the year the content was first released (on any platform) and
    the most recent year in which it was revised. -->

Copyright (c) 2022 Oracle and/or its affiliates.

<!-- Replace this statement if your project is not licensed under the UPL -->

Released under the Universal Permissive License v1.0 as shown at
<https://oss.oracle.com/licenses/upl/>.

ORACLE AND ITS AFFILIATES DO NOT PROVIDE ANY WARRANTY WHATSOEVER, EXPRESS OR IMPLIED, FOR ANY SOFTWARE, MATERIAL OR CONTENT OF ANY KIND CONTAINED OR PRODUCED WITHIN THIS REPOSITORY, AND IN PARTICULAR SPECIFICALLY DISCLAIM ANY AND ALL IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, AND FITNESS FOR A PARTICULAR PURPOSE.  FURTHERMORE, ORACLE AND ITS AFFILIATES DO NOT REPRESENT THAT ANY CUSTOMARY SECURITY REVIEW HAS BEEN PERFORMED WITH RESPECT TO ANY SOFTWARE, MATERIAL OR CONTENT CONTAINED OR PRODUCED WITHIN THIS REPOSITORY.  IN ADDITION, AND WITHOUT LIMITING THE FOREGOING, THIRD PARTIES MAY HAVE POSTED SOFTWARE, MATERIAL OR CONTENT TO THIS REPOSITORY WITHOUT ANY REVIEW. USE AT YOUR OWN RISK.