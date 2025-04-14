// When the groups side bar button is clicked, the dashboard should be populated with the groups the user is in
function onClickBtnMenuPanelGroups() {
    console.log('Groups side bar button clicked')
    clearDashboard()

    const objGroupsHeader = document.createElement('h1')
    objGroupsHeader.innerHTML = 'Groups'
    document.querySelector('#divDashboard').appendChild(objGroupsHeader)

    const objUserGroupData = fetchUserGroups() // make a call to the API to get all the groups the user is in

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
    populateDashboard(objDashboardData, displayGroupMembers)
}

function onClickGroup(strGroupID) {
    console.log(strGroupID)
}


// This function displays all of the members of a given group, including their name and contact info
// This is the func that executes when a group element is clicked on the Home Page, and it
// is the default dashboard for the Groups Page.
function displayGroupMembers(strGroupID) {

    clearDashboard()

    populateMenuPanel(objMenuPanelConfigs.objGroupPageConfig)

    console.log(`Loading data for Group ID: ${strGroupID}...`)

    // this data will eventually be retrieved from the API, for now just use dummy data
    const objGroupMemberInfo = fetchGroupMemberInfo()


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
    objGroupMemberInfo.forEach(member => {
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

function viewIssuedSurveys() {
    console.log('Surveys button clicked on Group Page')
    clearDashboard()
    addHeaderToDashboard('Surveys Your Project Leader Has Issued')
}

function viewFeedback() {
    console.log('View feedback button clicked on Groups Page')
    clearDashboard()
    addHeaderToDashboard('View Feedback Your Group Members Have Given You')

    // Get the feedback from the API. It is returned as an array of JSON objects of the form:
    /*
    {
        name: (who gave the feedback)
        message: (the actual feedback)
    }
    */
    const arrFeedback = fetchFeedback()
    console.log(arrFeedback)

    // Create a card in the dashboard for each feedback the user has received
    arrFeedback.forEach(feedback => {
        createFeedbackCard(feedback)
    })
}

function createFeedbackCard(objFeedback) {

    // Create the card
    let objFeedbackCard = document.createElement('div')
    objFeedbackCard.class = 'card'

    // Create the card body
    let objFeedbackCardBody = document.createElement('div')
    objFeedbackCardBody.class = 'card-body'

    // The header of the card is the name of the feedback giver
    let objFeedbackHeader = document.createElement('h4')
    objFeedbackHeader.innerHTML = objFeedback.name

    // Create a paragraph that contains the actual message of the feedback
    let objFeedbackParagraph = document.createElement('p')
    objFeedbackParagraph.innerHTML = objFeedback.message

    // Now we can add the elements to the dashboard
    document.querySelector('#divDashboard').appendChild(objFeedbackCard)
    objFeedbackCard.appendChild(objFeedbackCardBody)
    objFeedbackCardBody.appendChild(objFeedbackHeader)
    objFeedbackCardBody.appendChild(objFeedbackParagraph)


}