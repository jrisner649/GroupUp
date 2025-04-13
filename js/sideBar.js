
// class list for sidebar button
var strSidebarBtnClassList = "btn btn-sidebar mt-3";

// side bar configs
const objSideBarConfigs = {
    objHomePageConfig: [
        {
            id: 'btnSideBarProjects',
            innerHTML: 'Projects',
            onClick: onClickBtnSideBarProjects
        },
        {
            id: 'btnSideBarGroups',
            innerHTML: 'Groups',
            onClick: onClickBtnSideBarGroups
        }
    ],
    objProjectPageConfig: [
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
    ],
    objViewResponsesConfig: [
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
    ],
    objGroupPageConfig: [
        // members button
        {
            id: 'btnSideBarMembers',
            innerHTML: 'Members',
            onClick: displayGroupMembers
        },
        // surveys button
        {
            id: 'btnSideBarSurveys',
            innerHTML: 'Surveys',
            onClick: null
        },
        // feedback button
        {
            id: 'btnSideBarFeedback',
            innerHTML: 'Feedback',
            onClick: null
        }
    ]
}


function populateSideBar(arrButtons) {
    clearSideBar()
    let divSideBar = document.querySelector('#divSideBar')
    
    arrButtons.forEach(button => {
        let btnSideBarButton = document.createElement('div')
        btnSideBarButton.id = button.id
        btnSideBarButton.innerHTML = button.innerHTML
        btnSideBarButton.classList = strSidebarBtnClassList
        btnSideBarButton.addEventListener('click', button.onClick)
        document.querySelector('#divSideBar').appendChild(btnSideBarButton)
    });
}




function clearSideBar() {
    let divSideBar = document.querySelector('#divSideBar')
    divSideBar.innerHTML = ''
}

// Load the default config as soon as the script is loaded
populateSideBar(objSideBarConfigs.objHomePageConfig)
