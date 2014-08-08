#SpaceGDN Bridge

This is basically a direct port of the PHP [spacegdn-bridge](https://github.com/MCProHosting/spacegdn-bridge/) and my attempt to learn and play around with Typescript.

Usage Examples:

```js
var Bridge = require('spacegdn-bridge');
var bridge = new Bridge();

// Sets the location of the GDN
bridge.setEndpoint('gdn.api.xereo.net');

// Gets all jars:
bridge.get('jars').results(function (err, data) {
    // do something amazing
});

// Gets the second page of jars:
bridge
    .get('jars')
    .page(2)
    .results(function (err, data) {
        // do something amazing
    });

// Gets all versions owned by jar #2:
bridge
    .jar(2)
    .get('versions')
    .results(function (err, data) {
        // do something amazing
    });

// Query demonstrating most GDN properties.
bridge
    .jar(2)
    .get('builds')
    .where('build', '>', 1234)
    .orderBy('build', 'desc')
    .results(function (err, data) {
        // do something amazing
    });

// "data" is simply the JSON object returned by the GDN.

```
