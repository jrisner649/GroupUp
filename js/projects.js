// document.querySelector('#btnSideBarProjects').addEventListener('click', (event) => {
//     console.log('Project side bar button clicked')
//     clearDashboard()

//     const objProjectsHeader = document.createElement('h1')
//     objProjectsHeader.innerHTML = 'Projects'
//     document.querySelector('#divDashboard').appendChild(objProjectsHeader)

//     const objUserProjectData = getUserProjects()
//     let arrDashboardData = []
//     objUserProjectData.forEach(project => {
//         arrDashboardData.push(
//             {
//                 header: project.name,
//                 subheader: ' ',
//                 uid: project.projectid
//             }
//         )
//     })
//     populateDashboard(arrDashboardData, loadProjectPage)
// })

function onClickBtnSideBarProjects() {
    console.log('Project side bar button clicked')
    clearDashboard()

    const objProjectsHeader = document.createElement('h1')
    objProjectsHeader.innerHTML = 'Projects'
    document.querySelector('#divDashboard').appendChild(objProjectsHeader)

    const objUserProjectData = getUserProjects()
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
    populateDashboard(arrDashboardData, loadProjectPage)
}

// API call simulation
function getUserProjects() {
    const objUserProjectData = [
        {
            name: 'Project 1',
            groups: [
                {
                    name: 'Group A',
                    members: [
                        {
                            name: 'User 1'
                        },
                        {
                            name: 'User 2'
                        }
                    ],
                    groupid: 'ABC'
                },
                {
                    name: 'Group B',
                    members: [
                        {
                            name: 'User 3'
                        },
                        {
                            name: 'User 4'
                        }
                    ],
                    groupid: 'DEF'
                }
            ],
            projectid: '123'
        },
        {
            name: 'Project 2',
            projectid: '456'
        }
    ]
    return objUserProjectData
}

function loadProjectPage(strProjectID) {
    console.log(`Loading ${strProjectID} project...`)
    clearDashboard()

    const objUserProjectData = getUserProjects()
    const objProject = objUserProjectData.filter(project => project.projectid == strProjectID)[0]
    
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