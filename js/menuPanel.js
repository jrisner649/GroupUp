// class list for MenuPanel button
var strMenuPanelBtnClassList = "btn-menu-panel p-3 col-12 mb-1 mt-1 text-center";
var strBackBtnClassList = "p-3 col-6 mt-4 text-center";


var intPreviousPageId = 1
var intCurrentPageId = 1

// side bar configs
const objMenuPanelConfigs = {
    objHomePageConfig: {
        pageInfo: {
            defaultDashboard: onClickBtnMenuPanelProjects,
            pageId: 1
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


function populateMenuPanel(objConfig) {
    clearMenuPanel()
    let divMenuPanel = document.querySelector('#divMenuPanel')

    intCurrentPageId = objConfig.pageInfo.pageId
    
    objConfig.buttons.forEach(button => {
        let btnMenuPanelButton = document.createElement('div')
        btnMenuPanelButton.id = button.id
        btnMenuPanelButton.innerHTML = button.innerHTML
        btnMenuPanelButton.classList = strMenuPanelBtnClassList
        btnMenuPanelButton.addEventListener('click', button.onClick)
        document.querySelector('#divMenuPanelContents').appendChild(btnMenuPanelButton)
    });

    let btnBackButton = document.createElement('div')
    btnBackButton.id = 'btnBackButton'
    btnBackButton.innerHTML = 'Back'
    btnBackButton.classList = strBackBtnClassList
    document.querySelector('#divMenuPanelContents').appendChild(btnBackButton)
    btnBackButton.addEventListener('click', onClickBackButton)
}

function onClickBackButton() {

    console.log('Previous Page ID: ' + intPreviousPageId)
    console.log('Current Page ID: ' + intCurrentPageId)
    switch (intCurrentPageId) {
        case 1:
            // If the previous page is the home page, no further back navigation is needed
            console.log('Already at the home page')
            break
        case 2:
            // If the previous page is the project page, set the previous page to the home page
            intPreviousPageId = 1
            intCurrentPageId = 1
            break
        case 3:
            // If the previous page is the view responses page, set the previous page to the project page
            intPreviousPageId = 2
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
        console.log(intPreviousPageId);

        // Check if the pageId matches intPreviousPageId
        if (config.pageInfo.pageId === intPreviousPageId) {
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
