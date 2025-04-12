let strCurrentSurveyID = ''

// Navigates the user to the View Responses page for the clicked survey
function onClickSurvey(strSurveyID) {

    // This is needed because the function is reused for btnSideBarViewProjectData
    // When that button is clicked, no strSurveyID is passed in, because we are
    // already in the correct survey. The current survey is kept track of through
    // the strCurrentSurveyID global variable. 
    if (typeof strSurveyID === "string") {
        strCurrentSurveyID = strSurveyID
    }

    console.log(strCurrentProjectID)
    populateSideBar(objSideBarConfigs.objViewResponsesConfig)

    clearDashboard()

    addHeaderToDashboard('Project Data')

    

    // TODO: Fill in the dashboard with charts showing aggregate data for the survey response

}

function onClickBtnSideBarViewGroupData() {
    clearDashboard()
    addHeaderToDashboard("Select Which Group's Data to View")
    const arrGroups = fetchGroups(strCurrentProjectID)
    let arrDashboardData = []
    arrGroups.forEach(group => {
        arrDashboardData.push(
            {
                header: group.name,
                subheader: '',
                uid: group.groupid
            }
        )
    })
    populateDashboard(arrDashboardData, displayGroupResponses)
}

function displayGroupResponses(strGroupID) {
    clearDashboard(); // Clear the dashboard

    const arrSurveys = fetchProjectLeaderSurveys(); // Fetch all surveys
    const objCurrentSurvey = arrSurveys.find(survey => survey.surveyid === strCurrentSurveyID);

    if (!objCurrentSurvey) {
        console.error('Survey not found');
        return;
    }

    const groupResponses = objCurrentSurvey.groupResponses.find(group => group.groupid === strGroupID);

    if (!groupResponses) {
        console.error('Group responses not found for the given group ID.');
        return;
    }

    // Add a header to the dashboard
    addHeaderToDashboard(`Responses for ${groupResponses.groupName}`);

    // Iterate over each member's responses
    groupResponses.memberResponses.forEach(memberResponse => {
        // Create a response card for each member
        const memberCard = document.createElement('div');
        memberCard.className = 'response-card'; // Use the new custom class

        // Add the member's name as the card title
        const memberName = document.createElement('h3');
        memberName.textContent = memberResponse.memberName;
        memberCard.appendChild(memberName);

        // Iterate over each question in the survey
        objCurrentSurvey.questions.forEach(question => {
            const questionContainer = document.createElement('div');
            questionContainer.className = 'mb-4';

            // Add the question text
            const questionText = document.createElement('p');
            questionText.innerHTML = `<strong>${question.questionText}</strong>`;
            questionContainer.appendChild(questionText);

            // Display options based on question type
            if (question.questionType === 'likert' || question.questionType === 'multipleChoice') {
                question.options.forEach(option => {
                    const optionLabel = document.createElement('div');
                    optionLabel.classList.add('form-check');

                    // Check if this option was selected by the member
                    const isSelected = memberResponse.answers.some(
                        answer => answer.question === question.questionText && answer.answer === option
                    );

                    optionLabel.innerHTML = `
                        <input class="form-check-input" type="radio" disabled ${isSelected ? 'checked' : ''}>
                        <label class="form-check-label">${option}</label>
                    `;
                    questionContainer.appendChild(optionLabel);
                });
            } else if (question.questionType === 'shortAnswer') {
                // Find the member's answer for the short answer question
                const memberAnswer = memberResponse.answers.find(
                    answer => answer.question === question.questionText
                );

                const shortAnswerInput = document.createElement('input');
                shortAnswerInput.type = 'text';
                shortAnswerInput.classList.add('form-control');
                shortAnswerInput.placeholder = 'Short answer text';
                shortAnswerInput.value = memberAnswer ? memberAnswer.answer : '';
                shortAnswerInput.disabled = true;
                questionContainer.appendChild(shortAnswerInput);
            }

            // Append the question container to the member card
            memberCard.appendChild(questionContainer);
        });

        // Append the member card to the dashboard
        document.querySelector('#divDashboard').appendChild(memberCard);
    });
}

