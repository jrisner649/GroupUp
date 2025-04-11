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
        {

        }
    ],
    objGroupPageConfig: [
        // members button
        {
            id: 'btnSideBarMembers',
            innerHTML: 'Members',
            onClick: onClickBtnSideBarGroups
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

populateSideBar(objSideBarConfigs.objGroupPageConfig)
