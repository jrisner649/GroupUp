
// counts for dashboard
var intElementCount = 0;
var intRowCount = 0;
var intItemsPerRow = 3;

// populates elements to dashboard
// data is arr of json objects, each with keys = ("header", "subheader")
function populateDashboard(arrData) {

    // id and class template for each row
    const strRowIdTemplate = "divDashboardRow";
    const strRowClasses = "d-flex flex-row col-12 p-4 mt-3";

    // id and class template for each element
    const strElementIdTemplate = "divDashboardElement";
    const strElementClasses = "card col-3 mx-4 bg-lightgrey-color";

    // fetch element html
    fetch("components/dashboardElement.html")
    .then(response => response.text())
    .then(htmlElementTemplate => {

        arrData.forEach(jsonElement => {
        
            // if need to make a new row
            if (intElementCount % intItemsPerRow == 0) {

                console.log("New row")

                // increment row count
                intRowCount ++;
    
                // create row
                let objNewRow = document.createElement('div');
                objNewRow.setAttribute("id", strRowIdTemplate + intRowCount);
                objNewRow.setAttribute("class", strRowClasses);
    
                // add row
                document.querySelector('#divDashboard').appendChild(objNewRow);
    
            }

            // increment element
            intElementCount ++;
    
            // create new element
            let objNewElement = document.createElement('div');
            let strNewElementId = strElementIdTemplate + intElementCount;
            objNewElement.setAttribute("id", strNewElementId);
            objNewElement.setAttribute("class", strElementClasses);

            // set inner html
            objNewElement.innerHTML = htmlElementTemplate;

            // add element
            document.querySelector(`#${strRowIdTemplate + intRowCount}`).appendChild(objNewElement);

            // set element text
            document.querySelector(`#${strNewElementId} h1`).innerHTML = jsonElement.header;
            document.querySelector(`#${strNewElementId} h4`).innerHTML = jsonElement.subheader;

        });

    });

}

function clearDashboard() {

    // clear html
    document.querySelector('#divDashboard').innerHTML = "";

    // reset counts
    intElementCount = 0;
    intRowCount = 0;

}


populateDashboard([{"header": "CSC 3100", "subheader": "Web Development"}, 
                   {"header": "CSC 4903", "subheader": "Quantum Computing"},
                   {"header": "CSC 2220", "subheader": "DSAI for Everyone"},
                   {"header": "CSC 2400", "subheader": "Design of Algorithms"},
                   {"header": "CSC 2220", "subheader": "DSAI for Everyone"},
                   {"header": "CSC 2400", "subheader": "Design of Algorithms"},
                   {"header": "CSC 2400", "subheader": "Design of Algorithms"}]);