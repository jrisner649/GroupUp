// When the groups side bar button is clicked, the dashboard should be populated with the groups the user is in
function onClickBtnMenuPanelGroups() {
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

    const arrSurveys = fetchProjectLeaderSurveys()

    console.log(arrSurveys)

    let arrDashboardData = []
    arrSurveys.forEach(survey => {
        arrDashboardData.push({
            header: survey.title,
            subheader: survey.description,
            uid: survey.surveyid
        })
    })
    populateDashboard(arrDashboardData, loadSurvey)
}


function loadSurvey(strSurveyID) {
    // Fetch all surveys and find the one matching the given survey ID
    const arrSurveys = fetchProjectLeaderSurveys();
    const objSurvey = arrSurveys.find(survey => survey.surveyid == strSurveyID);

    if (!objSurvey) {
        console.error(`Survey with ID ${strSurveyID} not found.`);
        return;
    }

    console.log(objSurvey);

    // Clear the dashboard
    clearDashboard();

    // Add a header for the survey
    addHeaderToDashboard(objSurvey.title);

    // Iterate over each question in the survey and generate HTML
    objSurvey.questions.forEach(question => {
        // Create a container for the question
        let divQuestionContainer = document.createElement('div');
        divQuestionContainer.className = 'question-container mb-4';

        // Add the question text
        let objQuestionText = document.createElement('h4');
        objQuestionText.innerHTML = question.questionText;
        divQuestionContainer.appendChild(objQuestionText);

        // Generate the options or input field based on the question type
        if (question.questionType === 'likert' || question.questionType === 'multipleChoice') {
            question.options.forEach(option => {
                let divOption = document.createElement('div');
                divOption.className = 'form-check';

                let inputOption = document.createElement('input');
                inputOption.className = 'form-check-input';
                inputOption.type = 'radio';
                inputOption.name = `question-${question.questionid}`;
                inputOption.id = `option-${question.questionid}-${option}`;
                inputOption.disabled = false; // Disable input since this is for viewing

                let labelOption = document.createElement('label');
                labelOption.className = 'form-check-label';
                labelOption.setAttribute('for', `option-${question.questionid}-${option}`);
                labelOption.innerHTML = option;

                divOption.appendChild(inputOption);
                divOption.appendChild(labelOption);
                divQuestionContainer.appendChild(divOption);
            });
        } else if (question.questionType === 'shortAnswer') {
            let inputShortAnswer = document.createElement('textarea');
            inputShortAnswer.className = 'form-control';
            inputShortAnswer.placeholder = 'Short answer text';
            inputShortAnswer.disabled = false; // Disable input since this is for viewing
            divQuestionContainer.appendChild(inputShortAnswer);
        }

        // Append the question container to the dashboard
        document.querySelector('#divDashboard').appendChild(divQuestionContainer);

        
    });
    // Create submission button
    let btnSubmitSurvey = document.createElement('button')
    btnSubmitSurvey.type = 'button'
    btnSubmitSurvey.class = 'btn btn-success mt-3'
    btnSubmitSurvey.innerHTML = 'Submit Survey'
    document.querySelector('#divDashboard').appendChild(btnSubmitSurvey)
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