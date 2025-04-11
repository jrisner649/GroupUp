document.querySelector('#btnSideBarProjects').addEventListener('click', (event) => {
    console.log('Project side bar button clicked')
    clearDashboard()

    const objProjectsHeader = document.createElement('h1')
    objProjectsHeader.innerHTML = 'Projects'
    document.querySelector('#divDashboard').appendChild(objProjectsHeader)

    const objUserProjectData = getUserProjects()
    let objDashboardData = []
    objUserProjectData.forEach(project => {
        objDashboardData.push(
            {
                header: project.name,
                subheader: ' ',
                uid: project.projectid
            }
        )
    })
    populateDashboard(objDashboardData)
})

// API call simulation
function getUserProjects() {
    const objUserProjectData = [
        {
            name: 'Project 1',
            projectid: '123'
        },
        {
            name: 'Project 2',
            projectid: '456'
        }
    ]
    return objUserProjectData
}