var m = require("mithril").default;
let player = require("../models/Players");

/**
 * SquadList buils the UI tables for the desired number of 
 * squads the user has asked for.
 * 
 * @param vnode 
 */
function squadList(vnode) {

    // Set the number of squads
    squadNum = vnode.attrs.id;

    let title = {
        view: () => m("h1", "Squad Maker Pro")
    }

    let lineBreak = {
        view: () => m("br")
    }

    let resetButton = {
        view: () => m("button[type=button]",{id: "resetBtn", 
        class: "rstBtn", href: "/", oncreate: m.route.link}, "Reset")
    }

    // Create a squad header array to store
    // squad title for display
    let squadHeader = [];
    for (let i = 0; i < squadNum; i++) {
        squadHeader.push({"Squad": (i + 1)});
    }

    let waitTitle = () => [m("p", {class: "lblWaitList" ,id: "listPageWait"}, "Waiting List")];
    

    let headerRow = () =>
        m("tr", [
            ["Player", "Shooting", "Skating", "Checking"].map(h => m("th", h))
        ])
   
    // Call buildSquads to preform the analysis of the 
    // incoming json file and return POJO with the 
    // main squads and wait listed squads.
    let orderedSquad = buildSquads(squadNum);

    
    let constructWaitingTable = () => {

        let arr = [];
        let index = 0;
              
        arr[index] = [m("div",waitTitle()), 
        m("table.table", m("thead", headerRow()), 
        m("tbody", waitingTableBody()), )];
    
        return arr;
    }

    let waitingTableBody = () => {
        
        let arr = [];
        let index = 0;
        for (let i = 0; i < (orderedSquad.waitlist.length); i++) {
            
            arr[index] = [
                m("tr",[
                    m("td", orderedSquad.waitlist[i].firstName + ", " + 
                orderedSquad.waitlist[i].lastName),
                m("td", orderedSquad.waitlist[i].skills[0].rating),
                m("td", orderedSquad.waitlist[i].skills[1].rating),
                m("td", orderedSquad.waitlist[i].skills[2].rating)])
            ]
            index = index + 1;
        }
        return arr;
    }

    let waitingTableLayout = {
        view: () => m("section",[constructWaitingTable()])
    }
 



  //-----Main Table Section------------------------------------------------------
    let constructTable = () => {

        let arr = [];
        let index = 0;
        let outsideX = 0;
        
        while(outsideX < squadNum) {

            //Add header to table object
            arr[index] = [m("p", {class: "lblWaitList", id: "squad" + squadHeader[outsideX].Squad},
                "Squad " + squadHeader[outsideX].Squad), 
            m("table.table", m("thead", headerRow()), 
            m("tbody", tableBody(outsideX)), 
            m("tfoot", tableFoot(outsideX)), )];
            index = index + 1;
            outsideX = outsideX + 1; 
        }
        return arr;
    }

    let tableBody = (outX) => {
        
        let arr = [];
        let index = 0;
        for (let i = 0; i < (orderedSquad.main.length); i++) {
            
            arr[index] = [
                m("tr",[
                    m("td", orderedSquad.main[i][outX].firstName + ", " + 
                orderedSquad.main[i][outX].lastName),
                m("td", orderedSquad.main[i][outX].skills[0].rating),
                m("td", orderedSquad.main[i][outX].skills[1].rating),
                m("td", orderedSquad.main[i][outX].skills[2].rating)])
            ]
            index = index + 1;
        }
        return arr;
    }

    let tableFoot = (outX) => {

        let arr = [];
        let index = 0;
        
        arr[index] = [
            m("tr", [
                m("td", "Average"),
                m("td", Math.round(orderedSquad.avg[outX][0])),
                m("td", Math.round(orderedSquad.avg[outX][1])),
                m("td", Math.round(orderedSquad.avg[outX][2]))
            ])
        ]

        index = index + 1;
        
        return arr;
    }

    let squadTableLayout = {
        view: () => m("section",[constructTable()])
    }
 
    //---End of Main Table Section---------------------------------------------------
    
    if (orderedSquad.waitlist.length > 0) {
        //console.log("Values in wait list array")
        return {
            oninit: player.fetch,
            view: () => m("div",
                m(title),
                m(resetButton),
                m(lineBreak),
                m(waitingTableLayout),
                m(squadTableLayout),
            )
        }    
    } else {
        return {
            oninit: player.fetch,
            view: () => m("div",
                m(title),
                m(resetButton),
                m(lineBreak),
                m(squadTableLayout),
            )
        }    
        
    }

}


/**
 * BuildSquads will request the json API and scan through the dataset
 * to build player stat averages then place each player in the required
 * squads.
 * 
 * @param numOfSquads 
 */
function buildSquads(numOfSquads) {

    var avgList = [];  
      
    // Collect avg data
    for(var i = 0; i < player.list.length; i++) {
        avgList.push(computedPlayer = {
            "_id": player.list[i]._id,
            "firstName": player.list[i].firstName,
            "lastName": player.list[i].lastName,
            "skills": [
                {
                    "type": "Shooting",
                    "rating": player.list[i].skills[0].rating
                },
                {
                    "type": "Skating",
                    "rating": player.list[i].skills[1].rating
                },
                {
                    "type": "Checking",
                    "rating": player.list[i].skills[2].rating
                }
            ],
            "score": ((player.list[i].skills[0].rating +
                player.list[i].skills[1].rating + 
                player.list[i].skills[2].rating) / 3),
            "dist": 0
        })    
    }
    let mean = 0;
    avgList.forEach(function(value) {
        mean = mean + value.score;
    });
    mean = (mean / avgList.length);
   

    avgList.forEach(function(value) {
        value.dist = value.score - mean;
    });

    avgList.sort((a, b) => (a.dist < b.dist) ? 1 :((b.dist < a.dist) ? -1 : 0));

   
    //Algorithm for making groups
    //pop the first element off array and then pop the next element from array
    //then keep popping elements from the array until we reach the modulus value,
    //which should be the players who will not be included due to squad size rules.

    let waitlistNum = avgList.length % numOfSquads;

    let activePlayerNum = avgList.length - waitlistNum;

    let arr = [];

    
    for (let i = 0; i < (activePlayerNum / numOfSquads); i++)
    {
        arr[i] = [];
        for (let j = 0; j < numOfSquads; j++) 
        {
            arr[i][j] = avgList.shift(); 
        }   
    }

    //Need to add avg to the bottom of each attrib column on each team
    /*
    console.log("wait list players: ")
    console.log(avgList);
    console.log("Main players: ");
    console.log(arr);

    */
    let indexSquads = 0;

    let shooting = 0;
    let skating = 0;
    let checking = 0;

    let computArr = [];

    let idex;
    while (indexSquads < numOfSquads) {


        computArr[indexSquads] = [];
        for (idex = 0;idex < arr.length; idex++) {

            shooting = shooting + arr[idex][indexSquads].skills[0].rating;
            skating = skating + arr[idex][indexSquads].skills[1].rating;
            checking = checking + arr[idex][indexSquads].skills[2].rating;

        }
        // UNCOMMENT FOR TESTING
        /*
        console.log("Before: ")
        console.log("squad " + (indexSquads + 1));
        console.log("Shooting Avg: " + shooting);
        console.log("Skating Avg: " + skating);
        console.log("Checking Avg: " + checking);
        */
        shooting = (shooting / arr.length);
        skating = (skating / arr.length);
        checking = (checking / arr.length);
        computArr[indexSquads] = [shooting,skating,checking];

        // UNCOMMENT FOR TESTING
        /*
        console.log("After: ")
        console.log("squad " + (indexSquads + 1));
        console.log("Shooting Avg: " + shooting);
        console.log("Skating Avg: " + skating);
        console.log("Checking Avg: " + checking);
        */

        indexSquads = indexSquads + 1;
    }

    //console.log(computArr);
  
    return {
        "waitlist": avgList,
        "main": arr,
        "avg": computArr
    };
   

}

module.exports = squadList