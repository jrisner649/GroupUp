// class list for sidebar button
var strSidebarBtnClassList = "btn btn-sidebar mt-3";

var intPreviousPageId = 1
var intCurrentPageId = 1

// side bar configs
const objSideBarConfigs = {
    objHomePageConfig: {
        pageInfo: {
            defaultDashboard: onClickBtnMenuPanelProjects,
            pageId: 1
        },
        buttons: [
            {
                id: 'btnSideBarProjects',
                innerHTML: 'Projects',
                onClick: onClickBtnMenuPanelProjects
            },
            {
                id: 'btnSideBarGroups',
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
                id: 'btnSideBarProjectGroups',
                innerHTML: 'Groups',
                onClick: loadProject
            },
            // build survey
            {
                id: 'btnSideBarBuildSurvey',
                innerHTML: 'Send Survey',
                onClick: loadSurveyBuilder
            },
            // view responses
            {
                id: 'btnSideBarViewResponses',
                innerHTML: 'View Responses',
                onClick: onClickBtnSideBarViewResponses
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
                id: 'btnSideBarViewProjectData',
                innerHTML: 'View Project Data',
                onClick: onClickSurvey
            },
            {
                id: 'btnSideBarViewGroupData',
                innerHTML: 'View Group Data',
                onClick: onClickBtnSideBarViewGroupData
            }
        ]
    }
    // objGroupPageConfig: [
    //     // members button
    //     {
    //         id: 'btnSideBarMembers',
    //         innerHTML: 'Members',
    //         onClick: displayGroupMembers
    //     },
    //     // surveys button
    //     {
    //         id: 'btnSideBarSurveys',
    //         innerHTML: 'Surveys',
    //         onClick: null
    //     },
    //     // feedback button
    //     {
    //         id: 'btnSideBarFeedback',
    //         innerHTML: 'Feedback',
    //         onClick: null
    //     }
    // ]
}


function populateSideBar(objConfig) {
    clearSideBar()
    let divSideBar = document.querySelector('#divSideBar')

    intCurrentPageId = objConfig.pageInfo.pageId
    
    objConfig.buttons.forEach(button => {
        let btnSideBarButton = document.createElement('div')
        btnSideBarButton.id = button.id
        btnSideBarButton.innerHTML = button.innerHTML
        btnSideBarButton.classList = strSidebarBtnClassList
        btnSideBarButton.addEventListener('click', button.onClick)
        document.querySelector('#divSideBar').appendChild(btnSideBarButton)
    });

    let btnBackButton = document.createElement('div')
    btnBackButton.id = 'btnBackButton'
    btnBackButton.innerHTML = 'Back'
    btnBackButton.classList = strSidebarBtnClassList
    document.querySelector('#divSideBar').appendChild(btnBackButton)
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
    populateSideBar(objPrevPage)

    

}

function findPreviousPage() {
    // Iterate over the keys of objSideBarConfigs
    for (const configKey of Object.keys(objSideBarConfigs)) {
        const config = objSideBarConfigs[configKey];
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

function clearSideBar() {
    let divSideBar = document.querySelector('#divSideBar')
    divSideBar.innerHTML = ''
}

// Load the default config as soon as the script is loaded
populateSideBar(objSideBarConfigs.objHomePageConfig)
