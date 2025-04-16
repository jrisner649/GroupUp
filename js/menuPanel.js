/*
    This file contains the logic for handling the menu panel.
    All of the possible button configurations are stored in
    an object. When a page transition occurs, the populateMenuPanel
    function is called and the menu panel buttons change.
*/


// class list for MenuPanel button
var strMenuPanelBtnClassList = "btn-menu-panel p-3 col-12 mb-1 mt-1 text-center";
var strBackBtnClassList = "p-3 col-6 mt-4 text-center";

var intCurrentPageId = 1 // used for back button logic

// Menu panel configs
// Every page has its own config
const objMenuPanelConfigs = {
    // Page that displays the projects the user leads and the groups the user is in
    objHomePageConfig: {
        pageInfo: {
            defaultDashboard: onClickBtnMenuPanelProjects, // What should load when the user clicks the back button to get here?
            pageId: 1 // Used for tracking the current page for the back button logic
        },
        buttons: [
            {
                id: 'btnMenuPanelProjects',
                innerHTML: 'Projects',
                onClick: onClickBtnMenuPanelProjects
            },
            {
                id: 'btnMenuPanelGroups',
                innerHTML: 'Groups',
                onClick: onClickBtnMenuPanelGroups
            }
        ]
    },
    // Project management page
    objProjectPageConfig: {
        pageInfo: {
            defaultDashboard: loadProject,
            pageId: 2
        },
        buttons: [
            // groups in a specific project button
            {
                id: 'btnMenuPanelProjectGroups',
                innerHTML: 'Groups',
                onClick: loadProject
            },
            // build survey
            {
                id: 'btnMenuPanelBuildSurvey',
                innerHTML: 'Send Survey',
                onClick: loadSurveyBuilder
            },
            // view responses
            {
                id: 'btnMenuPanelViewResponses',
                innerHTML: 'View Responses',
                onClick: onClickBtnMenuPanelViewResponses
            }
        ]
    },
    // Page where the project leader views data about a survey
    objViewResponsesConfig: {
        pageInfo: {
            defaultDashboard: onClickSurvey,
            pageId: 3
        },
        buttons: [
            {
                id: 'btnMenuPanelViewProjectData',
                innerHTML: 'View Project Data',
                onClick: onClickSurvey
            },
            {
                id: 'btnMenuPanelViewGroupData',
                innerHTML: 'View Group Data',
                onClick: onClickBtnMenuPanelViewGroupData
            }
        ]
    },
    // Page where the user views data about a group they are in
    objGroupPageConfig: {
        pageInfo: {
            pageId: 4,
            defaultDashboard: displayGroupMembers
        },
        buttons: [
            // members button
            {
                id: 'btnMenuPanelMembers',
                innerHTML: 'Members',
                onClick: displayGroupMembers
            },
            // surveys button
            {
                id: 'btnMenuPanelSurveys',
                innerHTML: 'Surveys',
                onClick: viewIssuedSurveys
            },
            // feedback button
            {
                id: 'btnMenuPanelFeedback',
                innerHTML: 'Feedback',
                onClick: viewFeedback
            }
        ]
    }
}

// We call this function anytime we change a page. It accepts a configuration listed above, and 
// changes the menu panel buttons accordingly.
function populateMenuPanel(objConfig) {
    clearMenuPanel()
    let divMenuPanel = document.querySelector('#divMenuPanel')

    intCurrentPageId = objConfig.pageInfo.pageId // we need to keep track of what page we are on for the back button
    
    // Iterate through the buttons in the config and add them to the menu panel
    objConfig.buttons.forEach(button => {
        let btnMenuPanelButton = document.createElement('div')
        btnMenuPanelButton.id = button.id
        btnMenuPanelButton.innerHTML = button.innerHTML
        btnMenuPanelButton.classList = strMenuPanelBtnClassList
        btnMenuPanelButton.addEventListener('click', button.onClick)
        document.querySelector('#divMenuPanelContents').appendChild(btnMenuPanelButton)
    });

    // We also need to create a back button
    let btnBackButton = document.createElement('div')
    btnBackButton.id = 'btnBackButton'
    btnBackButton.innerHTML = '<h6>Back</h6>'
    btnBackButton.classList = strBackBtnClassList
    document.querySelector('#divMenuPanelContents').appendChild(btnBackButton)
    btnBackButton.addEventListener('click', onClickBackButton)
}

// Take the user back one page in the tree.
// The tree can be found in GroupUp.png
function onClickBackButton() {

    console.log('Current Page ID: ' + intCurrentPageId)
    switch (intCurrentPageId) {
        case 1:
            // If the previous page is the home page, no further back navigation is needed
            console.log('Already at the home page')
            break
        case 2:
            // If the previous page is the project page, set the previous page to the home page
            intCurrentPageId = 1
            break
        case 3:
            // If the previous page is the view responses page, set the previous page to the project page
            intCurrentPageId = 2
            break
        default:
            console.error('Unknown page ID')
            break
    }
    
    const objPrevPage = findPreviousPage()

    
    
    // In order to go back, we must load both the menu bar buttons and the default dashboard of the corresponding previous page
    objPrevPage.pageInfo.defaultDashboard()
    populateMenuPanel(objPrevPage)

    

}

function findPreviousPage() {
    // Iterate over the keys of objMenuPanelConfigs
    for (const configKey of Object.keys(objMenuPanelConfigs)) {
        const config = objMenuPanelConfigs[configKey];
        console.log(config.pageInfo.pageId);

        // Check if the pageId matches intPreviousPageId
        if (config.pageInfo.pageId === intCurrentPageId) {
            return config; // Return the matching config
        }
    }

    // If no match is found, return null or undefined
    console.error('Previous page not found');
    return null;
}

function clearMenuPanel() {
    let divMenuPanel = document.querySelector('#divMenuPanelContents')
    divMenuPanel.innerHTML = ''
}

// create event listener for menu panel on screen resize
window.addEventListener('resize', () => {

    const divMenuPanel = document.querySelector('#divMenuPanel');
    const boolLargeScreen = window.innerWidth >= 992;

    // actively set display at larger sizes
    if (boolLargeScreen) {

        divMenuPanel.style.display = 'block';

    }
    // actively hide at smaller sizes
    else {

        divMenuPanel.style.display = 'none';

    }


});

// create event listener for hamburger
document.querySelector('#btnHamburger').addEventListener('click', () => {

    console.log('Hamburger button clicked');
    $('#divMenuPanel').slideToggle(1000);

});

// Load the default config as soon as the script is loaded
populateMenuPanel(objMenuPanelConfigs.objHomePageConfig)
