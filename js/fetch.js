/*
    This file contains fetch functions that will be used to fetch info from the API.
    For now, we will simply use sample data to exhibit the functionalities of the website.
*/

function fetchProjectLeaderSurveys() {
    const arrSurveys = [
        {
            surveyid: '001',
            title: 'Team Collaboration Survey',
            description: 'A survey to evaluate team collaboration and communication.',
            questions: [
                {
                    questionText: 'How satisfied are you with the team collaboration?',
                    questionType: 'likert',
                    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                },
                {
                    questionText: 'How often do you communicate with your team?',
                    questionType: 'multipleChoice',
                    options: ['Daily', 'Weekly', 'Monthly', 'Rarely']
                },
                {
                    questionText: 'What can be improved in team collaboration?',
                    questionType: 'shortAnswer',
                    options: []
                }
            ],
            groupResponses: [
                {
                    groupid: 'ABC',
                    groupName: 'Group A',
                    memberResponses: [
                        {
                            memberName: 'Seth Risner',
                            answers: [
                                { question: 'How satisfied are you with the team collaboration?', answer: 'Strongly Agree' },
                                { question: 'How often do you communicate with your team?', answer: 'Daily' },
                                { question: 'What can be improved in team collaboration?', answer: 'More frequent meetings' }
                            ]
                        },
                        {
                            memberName: 'Franklin Doane',
                            answers: [
                                { question: 'How satisfied are you with the team collaboration?', answer: 'Agree' },
                                { question: 'How often do you communicate with your team?', answer: 'Weekly' },
                                { question: 'What can be improved in team collaboration?', answer: 'Better task delegation' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            surveyid: '002',
            title: 'Project Feedback Survey',
            description: 'A survey to gather feedback on the current project progress.',
            questions: [
                {
                    questionText: 'How clear are the project goals?',
                    questionType: 'likert',
                    options: ['Very Unclear', 'Unclear', 'Neutral', 'Clear', 'Very Clear']
                },
                {
                    questionText: 'How satisfied are you with the project timeline?',
                    questionType: 'likert',
                    options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
                },
                {
                    questionText: 'What challenges have you faced during the project?',
                    questionType: 'shortAnswer',
                    options: []
                }
            ]
        },
        {
            surveyid: '003',
            title: 'Group Satisfaction Survey',
            description: 'A survey to measure group member satisfaction and engagement.',
            questions: [
                {
                    questionText: 'How satisfied are you with your group members?',
                    questionType: 'likert',
                    options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
                },
                {
                    questionText: 'How engaged are you in group activities?',
                    questionType: 'multipleChoice',
                    options: ['Not Engaged', 'Somewhat Engaged', 'Engaged', 'Highly Engaged']
                },
                {
                    questionText: 'What suggestions do you have for improving group satisfaction?',
                    questionType: 'shortAnswer',
                    options: []
                }
            ]
        }
    ];
    return arrSurveys;
}