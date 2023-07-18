## Functions implemented

| Function | URL |
| ---------| ----------- |
| `getActivity`| https://docs.oracle.com/en/cloud/saas/field-service/cxfsc/op-rest-ofsccore-v1-activities-activityid-get.html |
| `updateActivity`| https://docs.oracle.com/en/cloud/saas/field-service/cxfsc/op-rest-ofsccore-v1-activities-activityid-patch.html
| `getSubscriptions` | https://docs.oracle.com/en/cloud/saas/field-service/cxfsc/op-rest-ofsccore-v1-events-subscriptions-get.html
| `importPlugins` | https://docs.oracle.com/en/cloud/saas/field-service/cxfsc/op-rest-ofscmetadata-v1-plugins-custom-actions-import-post.html

## Sample

1. Generate the javascript version of the module (`npm run dist`). A new folder called `dist` will be created, containing a javascript module (`ofs.es.js`)
2. Create in the same folder as the sample a file called `credentials_sample.json` with the following content, replacing the placeholders by your own environment data:
```
{
    "instance": "<YOUR OFS INSTANCE NAME>",
    "clientId": "<YOUR APPLICATION CLIENT ID>",
    "clientSecret": "<YOUR APPLICATION CLIENT SECRET>"
}
```
3. Run the sample. The output should be a list of the active event subscriptions in your environment
```
node sample.js
```