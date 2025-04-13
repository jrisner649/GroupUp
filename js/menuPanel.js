
// class list for MenuPanel button
var strMenuPanelBtnClassList = "btn-menu-panel p-3 col-10 mb-3";

// side bar configs
const objMenuPanelConfigs = {
    objHomePageConfig: [
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
    ],
    objProjectPageConfig: [
        {

        }
    ],
    objGroupPageConfig: [
        // members button
        {
            id: 'btnMenuPanelMembers',
            innerHTML: 'Members',
            onClick: onClickBtnMenuPanelGroups
        },
        // surveys button
        {
            id: 'btnMenuPanelSurveys',
            innerHTML: 'Surveys',
            onClick: null
        },
        // feedback button
        {
            id: 'btnMenuPanelFeedback',
            innerHTML: 'Feedback',
            onClick: null
        }
    ]
}


function populateMenuPanel(arrButtons) {
    clearMenuPanel()
    let divMenuPanel = document.querySelector('#divMenuPanel')
    
    arrButtons.forEach(button => {
        let btnMenuPanelButton = document.createElement('button')
        btnMenuPanelButton.id = button.id
        btnMenuPanelButton.innerHTML = button.innerHTML
        btnMenuPanelButton.classList = strMenuPanelBtnClassList
        btnMenuPanelButton.addEventListener('click', button.onClick)
        document.querySelector('#divMenuPanel').appendChild(btnMenuPanelButton)
    });
}


function clearMenuPanel() {
    let divMenuPanel = document.querySelector('#divMenuPanel');
    divMenuPanel.innerHTML = '';
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



populateMenuPanel(objMenuPanelConfigs.objGroupPageConfig)



