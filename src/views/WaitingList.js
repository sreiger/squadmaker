var m = require("mithril").default;
let player = require("../models/Players");

/**
 * WaitingList is the initial screen the user interacts with
 * as such this function will build the default wait listed
 * players, until the user enters the number of squads required.
 * 
 */
function waitingList() {

    let title = {
        view: () => m("h1", "Squad Maker Pro")
    }

    let infoSection = {
        view: () => m("p", {class: "infoSec", id: "infoSection"},
        "Welcome to squad maker pro, you can create\
        a squad from 1 to " + player.list.length)
    }
    let subtitle = {
        view: () => m("p", {class: "lblWaitList", id: "stWaitList"}, "Waiting List")
    }
    let lineBreak = {
        view: () => m("br")
    }

    let headerRow = () =>
        m("tr", [
            ["Player", "Shooting", "Skating", "Checking"].map(h => m("th", h))
        ])

    let playerList = {
        view: () => 
            m(".table",
                m("thead", [ headerRow() ]),
                m("tbody", [ playerRows() ])
            )
    }

    let playerRows = () => player.list.map(track => m("tr", [
        m("td", track.firstName + " " + track.lastName),
        track.skills.map(sub => m("td", sub.rating)),
    ]))

  
    // Default number of squads
    let squadCount = 1;

    let createSquads = {
        view: () => m(".squad",
            m("input.squad-input", {
                type: "text",
                onchange: function(e) {

                    n = parseFloat(e.target.value);

                    if (!isNaN(n) && n >= 1 && n <= player.list.length) {
                        squadCount = e.target.value;

                    } else {

                        alert("Value must be a postive number between 1 and " +
                        player.list.length);
                    }    
                },
                value: squadCount,
            }),
            m("button.squad-button", {href: "/squads/" + squadCount, oncreate: m.route.link},  "Build Squads")
            )
    }

    return {
        oninit: player.fetch,
        view: () => m("div",
            m(title),
            m(infoSection),
            m(createSquads),
            m(lineBreak),
            m(subtitle),
            m(playerList),

        )
    }    
    
}

// Export function for use outside of WaitingList.js
module.exports = waitingList;