var m = require("mithril").default;

// PlayerData is the request object used to pull in 
// player data needed to construct the squads.
// This method is setup so that when the REST API
// comes online then you just need to change the URL.
let playerData = {
    list: [],
    fetch: function() {
        m.request({
            method: "GET", 
            url: "http://localhost:3000/players",
        })
        .then(function(items) {
            playerData.list = items;
        })
    }
};

module.exports = playerData;