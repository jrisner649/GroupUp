// global var for group Id
var strCurrentGroupId = "";

// When the groups side bar button is clicked, the dashboard should be populated with the groups the user is in
async function onClickBtnMenuPanelGroups() {
    boolInProjectsTab = false // Do this so that the plus button in the header bar knows what to do
    clearDashboard()

    // add a header indicating that groups are being displayed
    addHeaderToDashboard("Groups");

    createPlusButton()

    const objUserGroupData = await fetchUserGroups() // make a call to the API to get all the groups the user is in

    console.log(objUserGroupData)

    let objDashboardData = []
    // iterate over each group and add them to a JSON obj in the form that the dashboard accepts
    // (must have header, subheader, and uid attributes)
    objUserGroupData.forEach(group => { 
        objDashboardData.push(
            {
                header: group.group_name,
                subheader: "Project: " + group.name,
                uid: group.group_id 
            }
        )
    })
    populateDashboard(objDashboardData, displayGroupMembers)
}

// This function displays all of the members of a given group, including their name and contact info
// This is the func that executes when a group element is clicked on the Home Page, and it
// is the default dashboard for the Groups Page.
function displayGroupMembers(strGroupID) {
    clearDashboard()

    addHeaderToDashboard('Group members');

    // set global group id
    strCurrentGroupId = strGroupID;

    // Since we are changing pages, we need to change the menu panel config to be that of the Groups Page
    populateMenuPanel(objMenuPanelConfigs.objGroupPageConfig)

    console.log(`Loading data for Group ID: ${strGroupID}...`)

    // This data will eventually be retrieved from the API, for now just use dummy data
    // We are getting the name and contact information
    const objGroupMemberInfo = fetchGroupMemberInfo()

    // Add a wrapper div for displaying the group members
    // Needed for formatting
    let divGroupMembersWrapper = document.createElement("div")
    divGroupMembersWrapper.setAttribute('class', 'd-flex justify-content-center flex-column align-items-center')
    divGroupMembersWrapper.setAttribute('id', 'divGroupMembersWrapper')
    document.querySelector('#divDashboard').appendChild(divGroupMembersWrapper)

    // Add the header
    let objGroupMembersHeader = document.createElement("h1")
    objGroupMembersHeader.innerHTML = 'Group Members'
    objGroupMembersHeader.setAttribute('class', 'mt-4')
    document.querySelector('#divGroupMembersWrapper').appendChild(objGroupMembersHeader)

    // Iterate over each group member and add them to the dashboard
    objGroupMemberInfo.forEach(member => {
        let objMemberNameHeader = document.createElement('h4')
        objMemberNameHeader.innerHTML = member.name
        document.querySelector('#divGroupMembersWrapper').appendChild(objMemberNameHeader)

        // Iterate over each available contact method
        Object.keys(member.contactInfo).forEach(key => {
            console.log(key + ' - ' + member.contactInfo[key])
            let objContactMethod = document.createElement('p')
            objContactMethod.innerHTML = `${key}: ${member.contactInfo[key]}` // the key is the name of the contact method (e.g. Discord), and the value is their specific username
            document.querySelector('#divGroupMembersWrapper').appendChild(objContactMethod) // we add the info to the list
        })
    });
}

// This function executes when the surveys menu panel button is clicked in the Groups Page
function viewIssuedSurveys() {
    console.log('viewIssuedSurveys called, strCurrentGroupId:', strCurrentGroupId);
    clearDashboard()
    addHeaderToDashboard('Issued Surveys')

    // Fetch data from the API
    fetchProjectLeaderSurveys(strCurrentGroupId).then(objSurveys => {
        console.log('Fetched surveys:', objSurveys);
        if (!objSurveys || objSurveys.length === 0) {
            console.warn('No surveys found for group:', strCurrentGroupId);
            Swal.fire('Info', 'No surveys found for this group', 'info');
            return;
        }

        // We need to add the survey to the dashboard.
        // A survey is sent for every group member. For example, if you are working with two
        // other group members, you will receive two copies of one survey. One for each group
        // member. 
        let arrDashboardData = []
        objSurveys.forEach(objSurvey => {
            console.log('Creating card for survey:', objSurvey.surveyid, objSurvey.title);
            arrDashboardData.push({
                header: objSurvey.title,
                subheader: "", // The user evaluates each group member
                uid: objSurvey.surveyid
            })
        })
        populateDashboard(arrDashboardData, loadSurvey)
    }).catch(err => {
        console.error('Error in viewIssuedSurveys:', err);
        Swal.fire('Error', 'Failed to fetch surveys: ' + err.message, 'error');
    });
}

// Function executes when a survey dashboard element is clicked in the Groups Page.
// It loads a survey into the dashboard for the user to fill out. 
function loadSurvey(strSurveyID) {
    console.log('loadSurvey called, strSurveyID:', strSurveyID, 'strCurrentGroupId:', strCurrentGroupId);
    // Fetch all surveys and find the one matching the given survey ID
    fetchProjectLeaderSurveys(strCurrentGroupId)
    .then(arrSurveys => {
        console.log('Fetched surveys for loadSurvey:', arrSurveys);
        const objSurvey = arrSurveys.find(survey => survey.surveyid == strSurveyID);

        if (!objSurvey) {
            console.error(`Survey with ID ${strSurveyID} not found.`);
            Swal.fire('Error', `Survey with ID ${strSurveyID} not found`, 'error');
            return;
        }

        console.log('Rendering survey:', objSurvey);

        // Clear the dashboard
        clearDashboard();

        // Add a header for the survey
        addHeaderToDashboard(objSurvey.title);

        // Create a wrapper for survey questions
        const divSurveyWrapper = document.createElement('div');
        divSurveyWrapper.className = 'd-flex justify-content-center flex-column align-items-center';
        divSurveyWrapper.id = 'divSurveyWrapper';
        document.querySelector('#divDashboard').appendChild(divSurveyWrapper);

        // Iterate over each question in the survey and generate HTML
        objSurvey.questions.forEach((question, index) => {
            console.log('Rendering question:', question);
            // Create a container for the question
            let divQuestionContainer = document.createElement('div');
            divQuestionContainer.className = 'question-container mb-4 col-8';

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
                inputShortAnswer.rows = '4';
                divQuestionContainer.appendChild(inputShortAnswer);
            }

            // Append the question container to the wrapper
            divSurveyWrapper.appendChild(divQuestionContainer);
        });

        // Create submission button
        let btnSubmitSurvey = document.createElement('button');
        btnSubmitSurvey.className = 'btn btn-success mt-3';
        btnSubmitSurvey.innerHTML = 'Submit Survey';
        divSurveyWrapper.appendChild(btnSubmitSurvey);

        btnSubmitSurvey.addEventListener('click', () => {
            const responses = [];
            let hasError = false;

            objSurvey.questions.forEach((question, index) => {
                let response;
                if (question.questionType === 'likert' || question.questionType === 'multipleChoice') {
                    const selectedOption = document.querySelector(`input[name="question-${question.questionid}"]:checked`);
                    if (!selectedOption) {
                        hasError = true;
                        return;
                    }
                    response = selectedOption.nextElementSibling.innerHTML;
                } else if (question.questionType === 'shortAnswer') {
                    const textarea = document.querySelectorAll(`textarea[placeholder="Short answer text"]`)[index];
                    response = textarea.value.trim();
                    if (!response) {
                        hasError = true;
                        return;
                    }
                }
                if (response) {
                    responses.push({ question_id: question.questionid, response });
                }
            });

            if (hasError) {
                Swal.fire('Error', 'Please answer all questions', 'error');
                return;
            }

            fetch(`${baseURL}/GroupUp/SurveyResponse?session_id=${strSessionID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ survey_id: strSurveyID, responses })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire('Success', 'Survey submitted!', 'success');
                    viewIssuedSurveys();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            })
            .catch(err => {
                console.error('Error submitting survey:', err);
                Swal.fire('Error', 'Failed to submit survey', 'error');
            });
        });
    })
    .catch(err => {
        console.error('Error fetching surveys for loadSurvey:', err);
        Swal.fire('Error', 'Failed to load survey: ' + err.message, 'error');
    });
}

async function viewFeedback() {
    console.log('View feedback button clicked on Groups Page');
    clearDashboard();
    addHeaderToDashboard('View Feedback');

    // Fetch feedback data from the backend
    const arrFeedback = await fetchFeedback(); // Fetch all feedback
    console.log(arrFeedback);

    if (!arrFeedback || arrFeedback.length === 0) {
        console.error('No feedback found.');
        Swal.fire("No Feedback", "No feedback data is available.", "info");
        return;
    }

    // Iterate over each feedback entry
    arrFeedback.forEach(feedback => {
        // Create a card for the feedback
        const feedbackCard = document.createElement('div');
        feedbackCard.className = 'feedback-card mb-4 p-3 border rounded';

        // Add the survey name as the card title
        const surveyName = document.createElement('h3');
        surveyName.textContent = feedback.survey_name;
        feedbackCard.appendChild(surveyName);

        // Add the sender's name
        const senderName = document.createElement('p');
        senderName.innerHTML = `<strong>Sender:</strong> ${feedback.sender_name}`;
        feedbackCard.appendChild(senderName);

        // Iterate over each question in the feedback
        feedback.arrQuestions.forEach(question => {
            const questionContainer = document.createElement('div');
            questionContainer.className = 'mb-3';

            // Add the question text
            const questionText = document.createElement('p');
            questionText.innerHTML = `<strong>${question.question_narrative}</strong>`;
            questionContainer.appendChild(questionText);

            // Display options or answers based on question type
            if (question.question_type === 'likert' || question.question_type === 'multiple choice') {
                // Parse the stringified JSON options
                const options = JSON.parse(question.options);
                console.log('Options:', options);
                console.log('Answers:', question.arrAnswers);

                // Iterate over the options object
                Object.entries(options).forEach(([key, value]) => {
                    const optionLabel = document.createElement('div');
                    optionLabel.classList.add('form-check');

                    // Check if this option was selected by matching the numerical key with the response
                    const isSelected = question.arrAnswers.some(
                        answer => answer.response === key // Compare with the numerical key instead of the text value
                    );

                    optionLabel.innerHTML = `
                        <input class="form-check-input" type="radio" disabled ${isSelected ? 'checked' : ''}>
                        <label class="form-check-label">${value}</label>
                    `;
                    questionContainer.appendChild(optionLabel);
                });
            } else if (question.question_type === 'short answer') {
                // Display the short answer
                const shortAnswerInput = document.createElement('input');
                shortAnswerInput.type = 'text';
                shortAnswerInput.classList.add('form-control');
                shortAnswerInput.placeholder = 'Short answer text';
                shortAnswerInput.value = question.arrAnswers.length > 0 ? question.arrAnswers[0].response : ''; // Change answer_text to response
                shortAnswerInput.disabled = true;
                questionContainer.appendChild(shortAnswerInput);
            }

            // Append the question container to the feedback card
            feedbackCard.appendChild(questionContainer);
        });

        // Append the feedback card to the dashboard
        document.querySelector('#divDashboard').appendChild(feedbackCard);
    });
}