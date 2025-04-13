
// counts for dashboard
var intElementCount = 0;
var intRowCount = 0;
var intItemsPerRow = 3;

// populates elements to dashboard
// data is arr of json objects, each with keys = ("header", "subheader", "uid")
// an on-click method needs to be passed that will accept an arg for a unique id of some sort
function populateDashboard(arrData, funcOnClick) {

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

        // iterate over json elements passed
        arrData.forEach(jsonElement => {
        
            // if need to make a new row
            if (intElementCount % intItemsPerRow == 0) {

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

            // create event listener for that element
            document.querySelector(`#${strNewElementId}`).addEventListener('click', () => {funcOnClick(jsonElement.uid)});

        });

    });

}

// empties out the dashboard
function clearDashboard() {

    // clear html
    document.querySelector('#divDashboard').innerHTML = "";

    // reset counts
    intElementCount = 0;
    intRowCount = 0;

}

// Append an h1 tag to the dashboard
function addHeaderToDashboard(strInnerHTML) {
    let objHeader = document.createElement('h1')
    objHeader.innerHTML = strInnerHTML
    document.querySelector('#divDashboard').appendChild(objHeader)
}

// populateDashboard([{"header": "CSC 3100", "subheader": "Web Development", "uid": "1"}, 
//                    {"header": "CSC 4903", "subheader": "Quantum Computing", "uid": "2"},
//                    {"header": "CSC 2220", "subheader": "DSAI for Everyone", "uid": "3"},
//                    {"header": "CSC 2400", "subheader": "Design of Algorithms", "uid": "4"},
//                    {"header": "CSC 2220", "subheader": "DSAI for Everyone", "uid": "5"},
//                    {"header": "CSC 2400", "subheader": "Design of Algorithms", "uid": "6"},
//                    {"header": "CSC 2400", "subheader": "Design of Algorithms", "uid": "7"}], (strUid) => {console.log(strUid)});
