Squad Maker Challenge


Technology used: Backend -> Json-server (Serves static json files) Frontend -> Mithril.js (Single page app)

Mithril positins itself as a compact but powerful modern client-side
JavaScript framework. The API is designed to give developers enterprise power in a single page application, while keeping a very
small footprint. 

Choice of frontend was due to size of the challenge, since the app only needed to show a single page using Mithril was a great choice.

How to run the Squad Maker Challenge:

(All commands are run from within the squadmaker directory) You must have npm installed to run this demo


Start json-server: npm run json

To rebuild app.js you can run webpack:

If the webpack is not build you can run: npm run pac

All testing is run by: npm run test

But for testing you must uncomment the global.* calls and place all the functions inside the module.exports object.