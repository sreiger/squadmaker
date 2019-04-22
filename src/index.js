// Polyfill DOM env for mithril
// FOR TESTING LOCAL ONLY
//global.window = require("mithril/test-utils/browserMock.js")();
//global.document = window.document;

var m = require("mithril").default;
const BODY = document.body;
let waitingList = require("./views/WaitingList");
let squadList = require("./views/SquadList");


/***App Begins********************************************** */

/**
 * Main routing of Squad Maker App
 */
m.route.prefix("#")
m.route(BODY, "/", {
    "/": {
        render: function() {
            return m(waitingList);
        }, 
    },
    "/squads/:id": {
        render: function(vnode) {
            return m(squadList, vnode.attrs);
        }
    }
}); // End of Squad Maker
