
// When the groups side bar button is clicked, the dashboard should be populated with the groups the user is in
function onClickBtnMenuPanelGroups() {
    console.log('Groups side bar button clicked')
    clearDashboard()

    const objGroupsHeader = document.createElement('h1')
    objGroupsHeader.innerHTML = 'Groups'
    document.querySelector('#divDashboard').appendChild(objGroupsHeader)

    const objUserGroupData = getUserGroups() // make a call to the API to get all the groups the user is in

    let objDashboardData = []
    // iterate over each group and add them to a JSON obj in the form that the dashboard accepts
    // (must have header, subheader, and uid attributes)
    objUserGroupData.forEach(group => { 
        objDashboardData.push(
            {
                header: group.name,
                subheader: group.projectName,
                uid: group.groupId 
            }
        )
    })
    populateDashboard(objDashboardData)
}

// This function will eventually execute a get request to the API
// to retrieve the groups the user is in. For now, just fetch dummy data.
function getUserGroups(){
    const objUserGroupData = [
        {
            name: 'Group A',
            projectName: 'Project 1',
            groupId: '123'
        },
        {
            name: 'Group B',
            projectName: 'Project 2',
            groupId: '456'
        }
    ]
    return objUserGroupData
}






// function accepts a JSON obj from the API that contains information on each group member
function displayGroupMembers(arrGroupData) {

    // this data will eventually be retrieved from the API, for now just use dummy data
    const testData = [
        {
            name: 'Franklin Doane',
            contactInfo: {
                discord: '@cooldude',
                email: '@fgdoane42@tntech.edu'
            }
        },
        {
            name: 'Seth Risner',
            contactInfo: {
                discord: '@cooldude1',
                email: '@jsrisner42@tntech.edu'
            }
        },
        {
            name: 'Jacob McMurray',
            contactInfo: {
                discord: '@cooldude2',
                email: '@jmmcmurray42@tntech.edu'
            }
        }
    ]


    // Add a wrapper div for displaying the group members
    let divGroupMembersWrapper = document.createElement("div")
    divGroupMembersWrapper.setAttribute('class', 'd-flex justify-content-center flex-column align-items-center')
    divGroupMembersWrapper.setAttribute('id', 'divGroupMembersWrapper')
    document.querySelector('#divDashboard').appendChild(divGroupMembersWrapper)


    // Add the header
    let objGroupMembersHeader = document.createElement("h1")
    objGroupMembersHeader.innerHTML = 'Group Members'
    objGroupMembersHeader.setAttribute('class', 'mt-4')
    document.querySelector('#divGroupMembersWrapper').appendChild(objGroupMembersHeader)

    // iterate over each group member and add them to the dashboard
    arrGroupData.forEach(member => {
        let objMemberNameHeader = document.createElement('h4')
        objMemberNameHeader.innerHTML = member.name
        document.querySelector('#divGroupMembersWrapper').appendChild(objMemberNameHeader)

        // iterate over each available contact method
        Object.keys(member.contactInfo).forEach(key => {
            console.log(key + ' - ' + member.contactInfo[key])
            let objContactMethod = document.createElement('p')
            objContactMethod.innerHTML = `${key}: ${member.contactInfo[key]}` // the key is the name of the contact method (e.g. Discord), and the value is their specific username
            document.querySelector('#divGroupMembersWrapper').appendChild(objContactMethod) // we add the info to the list
        })
    });
}