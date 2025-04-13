let strCurrentProjectID = ''

function onClickBtnMenuPanelProjects() {
    console.log('Project side bar button clicked')
    clearDashboard() 

    // this header goes at the top of the dashboard
    const objProjectsHeader = document.createElement('h1')
    objProjectsHeader.innerHTML = 'Projects'
    document.querySelector('#divDashboard').appendChild(objProjectsHeader)

    const objUserProjectData = fetchUserProjects() // fetch the projects the user is in from the API
    
    // we must convert the projects to the form accepted by the populate dashboard function
    let arrDashboardData = []
    objUserProjectData.forEach(project => {
        arrDashboardData.push(
            {
                header: project.name,
                subheader: ' ',
                uid: project.projectid
            }
        )
    })

    // Now that we have built the dashboard data, we can let the populate dashboard func handle the rest
    // We pass in the loadProject function so that each dashboard element knows what to do when it is clicked
    populateDashboard(arrDashboardData, loadProject)
}

// Return an array of all the groups in a given project
function fetchGroups(strProjectID) {

    // We need to find the specific project that was clicked on, so we filter by the uuid of the project
    const objUserProjectData = fetchUserProjects()
    const objProject = objUserProjectData.filter(project => project.projectid == strProjectID)[0]
    return objProject.groups

}

// This function is called when a project is clicked on the projects page
function loadProject(strProjectID) {
    console.log(`strProjectID = ${strProjectID}`)

    // This is needed because the function is reused for btnSideBarProjectGroups
    // When that button is clicked, no strProjectID is passed in, because we are
    // already in the correct project. The current project is kept track of through
    // the strCurrentProjectID global variable. 
    if (typeof strProjectID === "string") {
        strCurrentProjectID = strProjectID
    }



    console.log(`CurrentProjectID = ${strCurrentProjectID}`)
    console.log(`Loading ${strCurrentProjectID} project...`)
    clearDashboard()

    // Place a header at the top of the dashboard, the default tab in the projects page is the groups in the projet
    addHeaderToDashboard('Groups in Project')

    populateSideBar(objSideBarConfigs.objProjectPageConfig) // The side bar is populated with new buttons to manage the project that was clicked

    
    const objUserProjectData = fetchUserProjects() // Call the API to retrieve the project data

    // We need to find the specific project that was clicked on, so we filter by the uuid of the project
    const objProject = objUserProjectData.filter(project => project.projectid == strCurrentProjectID)[0]
    
    // Since the default tab of project management is 'Groups in Project', we must display every group that is in the project in the dashboard
    let arrGroups = []
    objProject.groups.forEach(group => {
        arrGroups.push(
            {
                header: group.name,
                subheader: '',
                uid: group.groupid
            }
        )
    })
    populateDashboard(arrGroups, (strUid) => {
        console.log(`${strUid} group clicked`)
    })
}

// Adds surveys that have been made to the dashboard so that the user can decide which survey to view data for
function onClickBtnSideBarViewResponses() {
    console.log('View responses button clicked')

    clearDashboard()

    let objViewResponsesHeader = document.createElement('h1')
    objViewResponsesHeader.innerHTML = "Select Which Survey's Data to View"
    document.querySelector('#divDashboard').appendChild(objViewResponsesHeader)

    // Iterate over every survey and add them to the dashboard
    const arrSurveys = fetchProjectLeaderSurveys() // Make the API call to get the surveys that the user had made
    let arrDashboardData = []
    arrSurveys.forEach(survey => {
        arrDashboardData.push(
            {
                header: survey.title,
                subheader: survey.description,
                uid: survey.surveyid
            }
        )
    })
    populateDashboard(arrDashboardData, onClickSurvey)
}

