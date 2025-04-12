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
            innerHTML: 'Build Survey',
            onClick: onClickSurvey
        },
        // view responses
        {
            id: 'btnSideBarViewResponses',
            innerHTML: 'View Responses',
            onClick: null
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
        let btnSideBarButton = document.createElement('button')
        btnSideBarButton.id = button.id
        btnSideBarButton.innerHTML = button.innerHTML
        btnSideBarButton.addEventListener('click', button.onClick)
        document.querySelector('#divSideBar').appendChild(btnSideBarButton)
    });
}




function clearSideBar() {
    let divSideBar = document.querySelector('#divSideBar')
    divSideBar.innerHTML = ''
}

populateSideBar(objSideBarConfigs.objHomePageConfig)
