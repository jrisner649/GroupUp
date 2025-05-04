/*
    This file is used for handling logic for the Project Management Page
*/


let strCurrentProjectID = '' // Keep track with what project the user clicked on

let boolInProjectsTab = true // Used to change the functionality of the plus button depending on if the user is in 
                             // the Project tab or the Group tab on the Home Page


// Fires when the user clicks the projects menu panel button in the Home Page
async function onClickBtnMenuPanelProjects() {
    console.log('Project side bar button clicked')
    boolInProjectsTab = true
    clearDashboard() 

    const divProjectsWrapper = document.createElement('div')
    divProjectsWrapper.className = 'd-flex justify-content-between align-items-center'
    document.querySelector('#divDashboard').appendChild(divProjectsWrapper)

    // this header goes at the top of the dashboard
    addHeaderToDashboard("Projects")

    // create the plus button that allows users to either create or join a project
    createPlusButton()

    const arrUserProjects = await fetchUserProjects() // fetch the projects the user is in from the API
    console.log(arrUserProjects)
    
    // we must convert the projects to the form accepted by the populate dashboard function
    let arrDashboardData = []
    arrUserProjects.forEach(project => {
        arrDashboardData.push(
            {
                header: project.name,
                subheader: "Project Code: " + project.project_id,
                uid: project.project_id
            }
        )
    })

    // Now that we have built the dashboard data, we can let the populate dashboard func handle the rest
    // We pass in the loadProject function so that each dashboard element knows what to do when it is clicked
    populateDashboard(arrDashboardData, loadProject)
}

// Create the plus button that is used to either create or join an existing project
function createPlusButton() { 
   
    // unhide button
    let btnPlusProject = document.querySelector('#btnPlus');
    btnPlusProject.classList.remove('d-none');

    // The plus button acts different according to which tab the user is on in the home page
    btnPlusProject.addEventListener('click', (event) => {

        event.preventDefault();
        if (boolInProjectsTab) {
            Swal.fire({
                title: "Create a project and invite project members, or join an existing project using a project code.",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Create a Project",
                denyButtonText: "Join a Project",
              }).then((result) => {
                // Fire a success alert if they clicked confirm
                if (result.isConfirmed) {

                    // get information
                    Swal.fire({
                        title: "Enter project details",
                        html: `
                            <input id="projectName" class="swal2-input" placeholder="Project Name">
                            <textarea id="projectDescription" class="swal2-textarea" placeholder="Project Description"></textarea>
                        `,
                        focusConfirm: false,
                        preConfirm: () => {
                            const projectName = document.getElementById('projectName').value;
                            const projectDescription = document.getElementById('projectDescription').value;

                            if (!projectName || !projectDescription) {
                                Swal.showValidationMessage('Both fields are required');
                                return false;
                            }

                            return { projectName, projectDescription };
                        }
                    }).then((result) => {

                        // capture project details
                        const { projectName, projectDescription } = result.value;

                        // make call to backend
                        fetch("http://localhost:8000/GroupUp/Project", {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({
                                session_id: strSessionID,
                                name: projectName,
                                desc: projectDescription
                                })
                            }
                        )
                        .then(response => ({ responseStatus: response.status, responseBody: response.json()}))
                        .then(({responseStatus, responseBody}) => {

                            // catch error
                            if (responseStatus != 201) {
                                console.log(`Error during project creation: ${JSON.stringify(responseBody)}`);
                                Swal.fire("Uh oh!", "Something went wrong with creating your project.", "error");
                            }
                            else {

                                Swal.fire("Project created!", "", "success");

                            }

                        });
                        
                    });

                } 
                // Fire an alert containing a text box if they pressed join a project
                // It says result denied because the "deny" button is used for the join button
                else if (result.isDenied) {
                  Swal.fire({title: "Input a project code:", input: "text"}, "");
                }
            });
        }
        else {
            Swal.fire({
                title: "Create a group or join an existing group.",
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: "Create a Group",
                denyButtonText: "Join a Group",
              }).then((result) => {
                // Fire a success alert if they clicked confirm
                if (result.isConfirmed) {
                    (async () => {
                        const { value: formValues } = await Swal.fire({
                            title: 'Create New Group',
                            html:
                                '<input id="swal-input1" class="swal2-input" placeholder="Group Name">' +
                                '<input id="swal-input2" class="swal2-input" placeholder="Project ID">',
                            focusConfirm: false,
                            showCancelButton: true,
                            confirmButtonText: 'Create',
                            cancelButtonText: 'Cancel',
                            preConfirm: () => {
                                const groupName = document.getElementById('swal-input1').value.trim();
                                const projectId = document.getElementById('swal-input2').value.trim();
                                if (!groupName || !projectId) {
                                    Swal.showValidationMessage('Both fields are required!');
                                }
                                return { groupName, projectId };
                            }
                        });

                        if (formValues) {
                            try {

                                const response = await fetch(baseURL + `/GroupUp/Groups?session_id=${strSessionID}`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        groupName: formValues.groupName,
                                        projectId: formValues.projectId,
                                    })
                                });

                                if (!response.ok) {
                                    const errorText = await response.text();
                                    throw new Error(errorText || 'Failed to create group.');
                                }

                                await Swal.fire({
                                    icon: 'success',
                                    title: 'Group Created!',
                                    text: `${formValues.groupName} was successfully created.`,
                                    timer: 2000,
                                    showConfirmButton: false
                                });

                                onClickBtnMenuPanelGroups(); // Reload Groups dashboard
                            } catch (error) {
                                console.error(error);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error Creating Group',
                                    text: error.message || 'Something went wrong.'
                                });
                            }
                        }
                    })();
                // Fire an alert containing a text box if they pressed join a group
                // It says result denied because the "deny" button is used for the join button
                } else if (result.isDenied) {
                  Swal.fire({title: "Input a Group Code:", input: "text"}, "");
                }
            });
        }
       
    })
    return btnPlusProject
}

// This function is called when a project is clicked on the projects page
async function loadProject(strProjectID) {
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

    intCurrentPageId = 2 // We are changing pages to the Project Management Page since the user clicked on a project

    populateMenuPanel(objMenuPanelConfigs.objProjectPageConfig) // The side bar is populated with new buttons to manage the project that was clicked

    const objProjectGroups = await fetchProjectGroups() // Call the API to retrieve the project data

    console.log("Project Groups: " + objProjectGroups);
    
    // Since the default tab of project management is 'Groups in Project', we must display every group that is in the project in the dashboard
    let arrGroups = []
    objProjectGroups.forEach(group => {
        arrGroups.push(
            {
                header: group.group_name,
                subheader: '',
                uid: group.group_id
            }
        )
    })
    populateDashboard(arrGroups, (strUid) => {
        console.log(`${strUid} group clicked`)
    })
}

// Adds surveys that have been made to the dashboard so that the user can decide which survey to view data for
function onClickBtnMenuPanelViewResponses() {
    console.log('View survey responses')

    clearDashboard()

    // Create the header
    addHeaderToDashboard("View survey responses");

    // Iterate over every survey and add them to the dashboard
    // Make the API call to get the surveys that the user had made
    fetchProjectLeaderSurveys(strCurrentProjectID, idType="project_id").then(arrSurveys => {

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

    })
    
}

