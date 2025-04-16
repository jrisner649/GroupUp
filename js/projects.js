let strCurrentProjectID = ''

function onClickBtnMenuPanelProjects() {
    console.log('Project side bar button clicked')
    clearDashboard() 

    const divProjectsWrapper = document.createElement('div')
    divProjectsWrapper.className = 'd-flex justify-content-between align-items-center'
    document.querySelector('#divDashboard').appendChild(divProjectsWrapper)

    // this header goes at the top of the dashboard
    const objProjectsHeader = document.createElement('h1')
    objProjectsHeader.innerHTML = 'Projects'
    divProjectsWrapper.appendChild(objProjectsHeader)

    // create the plus button that allows users to either create or join a project
    const btnPlusProject = createPlusButton()
    divProjectsWrapper.appendChild(btnPlusProject)



    const objUserProjectData = fetchUserProjects() // fetch the projects the user is in from the API
    
    // we must convert the projects to the form accepted by the populate dashboard function
    let arrDashboardData = []
    objUserProjectData.forEach(project => {
        arrDashboardData.push(
            {
                header: project.name,
                subheader: "Project Code: " + project.projectid,
                uid: project.projectid
            }
        )
    })

    // Now that we have built the dashboard data, we can let the populate dashboard func handle the rest
    // We pass in the loadProject function so that each dashboard element knows what to do when it is clicked
    populateDashboard(arrDashboardData, loadProject)
}

// Create the plus button that is used to either create or join an existing project
function createPlusButton() { 
    const btnPlusProject = document.createElement('button')
    btnPlusProject.class = 'btn'
    btnPlusProject.type = 'button'
    btnPlusProject.innerHTML = `<i class="bi bi-plus"></i>`
    btnPlusProject.style = "font-size: 4rem; color: lightgreen;"
    btnPlusProject.addEventListener('click', () => {
        Swal.fire({
            title: "Create a project and invite project members, or join an existing project using a project code.",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Create a Project",
            denyButtonText: "Join a Project",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire("Project created!", "", "success");
            } else if (result.isDenied) {
              Swal.fire({title: "Input a project code:", input: "text"}, "");
            }
        });
    })
    return btnPlusProject
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

    intCurrentPageId = 2

    populateMenuPanel(objMenuPanelConfigs.objProjectPageConfig) // The side bar is populated with new buttons to manage the project that was clicked

    
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
function onClickBtnMenuPanelViewResponses() {
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

