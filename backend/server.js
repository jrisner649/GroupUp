// libraries
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');


// constants
const DB_FILENAME = "GroupUp.db";
const HTTP_PORT = process.env.PORT || 8000;
const intSalt = 10;
const path = require('path');

// init db
const db = new sqlite3.Database(DB_FILENAME);

// init express app
var app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use("/api", require("./routes/api"));
app.use("/component", require("./routes/components"));

app.listen(HTTP_PORT, () => {
    console.log("Listening on", HTTP_PORT);  
});

// naked domain fetch
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// app.get("/signUp", (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/components/signUp.html'));
// });

// create new project
app.post("/GroupUp/Project", async (req,res,next) => {

    // get info from body and verify
    let strSessionID = req.body.session_id;
    let strProjectName = req.body.name;
    let strProjectDesc = req.body.desc;

    // error parameters
    let boolError = false;
    let strErrorMsg = "";
    let boolWarning = false;
    let strWarningMsg = "";

    // verify that all 3 were passed
    if (!strSessionID) {

        boolError = true;
        strErrorMsg += "Must pass a session ID. ";

    }
    else if (!strProjectName) {

        boolError = true;
        strErrorMsg += "Must pass a project name. ";

    }
    else if (!strProjectDesc) {

        boolWarning = true;
        strWarningMsg = "No project description passed.";
        strProjectDesc = "";

    }

    // ensure that the session ID is valid
    console.log("Session ID: " + strSessionID);
    let strQuery = "SELECT user_id FROM tblSessions WHERE session_id = ?";
    let arrParams = [strSessionID];
    const arrRows = await allDb(strQuery, arrParams);
    console.log(arrRows);
    if (arrRows.length === 0) {
        boolError = true;
        strErrorMsg += "Session ID is invalid. ";
    }
    
    // return if error
    if (boolError) {

        console.log(JSON.stringify({status: "error", message: strErrorMsg}));

        res.status(400).json({status: "error", message: strErrorMsg});

    }
    else {

        // create new ID
        let strProjectId = uuidv4();

        // get user ID from session ID
        let strUser = arrRows[0].user_id;
        console.log("User ID: " + strUser);

        // run sql command
        let strInsertCmd = 'INSERT INTO tblProjects VALUES (?,?,?,?)';
        db.run(strInsertCmd, [strProjectId, strProjectName, strProjectDesc, strUser], (err, result) => {

            // return error
            if (err) {

                console.log(err);
                res.status(400).json({status: "error", message: err.message});

            }
            else {

                // check for warning
                if (boolWarning) {

                    res.status(201).json({status: "success", projectId: strProjectId, warning: strWarningMsg});

                }
                else {

                    res.status(201).json({status: "success", projectId: strProjectId});

                }

            }

        });
        
    }

})

// User account registration
// req body should be in the following format:
/*
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "example@example.com",
    "password": "Password123!",
    "phone": "+1 (123) 456-7890", // the format of the phone number is flexible, so 11234567890 would also work, etc.
    "socials": [ // socials is optional
        {
            "type": "twitter",
            "username": "@example"
        },
        {
            "type": "facebook",
            "username": "@example"
        }
    ]



*/
app.post('/GroupUp/User', async (req, res, next) => {
    try {
        // Validate request body
        if (!req.body || !req.body.first_name || !req.body.last_name || !req.body.email || !req.body.password || !req.body.phone) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        // Setup variables to store information about the user's account
        const strFirstName = req.body.first_name;
        const strLastName = req.body.last_name;
        const strEmail = req.body.email.trim().toLowerCase();
        let strPassword = req.body.password;
        const strCreationDate = new Date().toISOString();
        const strLastDateUsed = strCreationDate;
        const arrSocials = req.body.socials;
        const strPhone = req.body.phone;


        // Email validation using regex
        const objEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!objEmailRegex.test(strEmail)) {
            return res.status(400).json({ error: "You must provide a valid email address" });
        }
    
        // Password validation based on NIST standards
        if (strPassword.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }
        if (!/[A-Z]/.test(strPassword)) {
            return res.status(400).json({ error: "Password must contain at least one uppercase letter" });
        }
        if (!/[a-z]/.test(strPassword)) {
            return res.status(400).json({ error: "Password must contain at least one lowercase letter" });
        }
        if (!/[0-9]/.test(strPassword)) {
            return res.status(400).json({ error: "Password must contain at least one number" });
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(strPassword)) {
            return res.status(400).json({ error: "Password must contain at least one special character" });
        }

        // Ensure the phone number is valid
        const objPhone = parsePhoneNumber(strPhone);
        if (!objPhone) {
            return res.status(400).json({error: "You must provide a valid phone number"});
        }

        // Ensure the email does not exist
        let strQuery = "SELECT * FROM tblUsers WHERE email = ?";
        let arrParams = [strEmail];
        const emailResult = await allDb(strQuery, arrParams);
        if (emailResult.length > 0) {
            return res.status(400).json({error: "Email is already associated with an account."});
        }
        
        // Ensure the phone number does not exist
        strQuery = "SELECT * FROM tblPhone WHERE nation_code = ? AND area_code = ? AND phone_number = ?";
        arrParams = [objPhone.nationCode, objPhone.areaCode, objPhone.phoneNumber];
        const phoneResult = await allDb(strQuery, arrParams);
        if (phoneResult.length > 0) {
            return res.status(400).json({error: "Phone number is already assoicated with an account"});
        }


        

        // All checks passed, so we are good to create the account
        // We need to generate a uuid for 3 tables: tblUsers, tblPhone, and tblSocials
        // Generate a uuid for tblUsers
        let strUserID = "";
        let blnUserIDExists = true;
        do {
            strUserID = uuidv4();
            // Check if the user ID already exists in the database
            strQuery = "SELECT * FROM tblUsers WHERE user_id = ?";
            arrParams = [strUserID];
            const userResult = await allDb(strQuery, arrParams);
            if (userResult.length === 0) {
                blnUserIDExists = false; // User ID is unique, exit the loop
            }
            // If it exists, generate a new UUID and check again
        } while (blnUserIDExists);

        // Generate a uuid for tblPhone
        let strPhoneID = "";
        let blnPhoneIDExists = true;
        do {
            strPhoneID = uuidv4();
            // Check if the phone ID already exists in the database
            strQuery = "SELECT * FROM tblPhone WHERE phone_id = ?";
            arrParams = [strPhoneID];
            const phoneResult = await allDb(strQuery, arrParams);
            if (phoneResult.length === 0) {
                blnPhoneIDExists = false; // Phone ID is unique, exit the loop
            }
        } while (blnPhoneIDExists);

        // Generate a uuid for tblSocials
        let strSocialID = "";
        let blnSocialIDExists = true;
        do {
            strSocialID = uuidv4();
            // Check if the social ID already exists in the database
            strQuery = "SELECT * FROM tblSocials WHERE social_id = ?";
            arrParams = [strSocialID];
            const socialResult = await allDb(strQuery, arrParams);
            if (socialResult.length === 0) {
                blnSocialIDExists = false; // Social ID is unique, exit the loop
            }
        } while (blnSocialIDExists);

        // Use a transaction for atomicity
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            try {
                // Insert into tblUsers
                const strUserID = uuidv4();
                strPassword = bcrypt.hashSync(strPassword, intSalt); // Hash the password
                strQuery = `INSERT INTO tblUsers (user_id, first_name, last_name, email, password, creation_datetime, last_used_datetime) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                arrParams = [strUserID, strFirstName, strLastName, strEmail, strPassword, strCreationDate, strLastDateUsed];
                db.run(strQuery, arrParams);

                // Insert into tblPhone
                const strPhoneID = uuidv4();
                strQuery = 'INSERT INTO tblPhone VALUES (?, ?, ?, ?, ?)';
                arrParams = [strPhoneID, objPhone.nationCode, objPhone.areaCode, objPhone.phoneNumber, strUserID];
                db.run(strQuery, arrParams);

                // Insert into tblSocials
                if (arrSocials) {
                    strQuery = 'INSERT INTO tblSocials VALUES (?, ?, ?, ?)';
                    for (const social of arrSocials) {
                        const strSocialID = uuidv4();
                        arrParams = [strSocialID, social.type, social.username, strUserID];
                        db.run(strQuery, arrParams);
                    }
                }

                db.run("COMMIT");
                res.status(200).json({ message: "Account creation successful", user_id: strUserID });
            } catch (err) {
                db.run("ROLLBACK");
                console.error(err);
                res.status(500).json({ error: "An error occurred while creating the account" });
            }
        });


    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while creating the account" });
    }
    

    

});

// Group Creation, add creating user to group immediately
app.post('/GroupUp/Groups', validateSession, (req, res) => {
    const { groupName, projectId } = req.body;

    if (!groupName || !projectId) {
        return res.status(400).json({ error: 'Missing groupName or projectId in request body' });
    }

    // Generate a unique group ID
    const groupId = `G-${uuidv4().slice(0, 8)}`;

    // Insert into tblProjectGroups
    const queryInsertGroup = `
        INSERT INTO tblProjectGroups (group_id, group_name, project_id)
        VALUES (?, ?, ?)
    `;

    db.run(queryInsertGroup, [groupId, groupName, projectId], function(err) {
        if (err) {
            console.error('Error inserting into tblProjectGroups:', err);
            return res.status(500).json({ error: 'Database error when creating group' });
        }

        // Now: Insert into tblGroupMembers
        const groupMemberId = `GM-${uuidv4().slice(0, 8)}`; // Generate unique group member ID

        const queryInsertMember = `
            INSERT INTO tblGroupMembers (group_member_id, group_id, user_id, role)
            VALUES (?, ?, ?, ?)
        `;

        db.run(queryInsertMember, [groupMemberId, groupId, req.user_id, 'leader'], function(err) {
            if (err) {
                console.error('Error inserting into tblGroupMembers:', err);
                return res.status(500).json({ error: 'Database error when adding user to group' });
            }

            res.status(201).json({ 
                message: 'Group created successfully and user added as leader', 
                groupId: groupId,
                groupMemberId: groupMemberId
            });
        });
    });
});

// User Groups
app.get('/GroupUp/Groups', validateSession, async (req, res) => {
    try {
        // Query to get user groups
        const strQuery = `
            SELECT tblProjectGroups.group_id, tblProjects.name, tblProjectGroups.group_name FROM tblProjectGroups
            LEFT JOIN tblProjects ON tblProjectGroups.project_id = tblProjects.project_id
            LEFT JOIN tblGroupMembers ON tblProjectGroups.group_id = tblGroupMembers.group_id
            WHERE tblGroupMembers.user_id = ?;
        `;


        const arrParams = [req.user_id];


        const arrRows = await allDb(strQuery, arrParams);
        console.log(arrRows);
        res.status(200).json(arrRows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching user groups' });
    }
});

//Group member info
app.get('/GroupUp/groupMembers', async (req, res) => {
    try {
        const groupId = req.query.group_id; // Get groupId from query parameters
        if (!groupId) {
            return res.status(400).json({ error: 'Missing groupId in query parameters' });
        }


        // Query to get group member info
        const strQuery = `
            SELECT gm.group_member_id, gm.user_id, gm.role, u.first_name, u.last_name, u.email, p.nation_code, p.area_code, p.phone_number
            FROM tblGroupMembers gm
            JOIN tblUsers u ON gm.user_id = u.user_id
            JOIN tblPhone p ON u.user_id = p.user_id
            WHERE gm.group_id = ?
        `;


        const arrParams = [];


        const rows = await allDb(strQuery, arrParams);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching group member info' });
    }
});

// ai helped edit errors
app.get('/GroupUp/SurveyResponses', validateSession, async (req, res) => {
    const { survey_id, group_id } = req.query;
    console.log('Fetching responses for survey:', survey_id, 'group:', group_id, 'user:', req.user_id);
    if (!survey_id) {
        return res.status(400).json({ status: "error", message: "Missing survey_id" });
    }

    try {
        let query = `
            SELECT sr.response_id, sr.survey_id, sr.question_id, sr.user_id, sr.response, 
                   sq.question_narrative, sq.question_type, sq.options,
                   u.first_name, u.last_name
            FROM tblSurveyResponses sr
            JOIN tblSurveyQuestions sq ON sr.question_id = sq.question_id
            JOIN tblUsers u ON sr.user_id = u.user_id
            WHERE sr.survey_id = ?
        `;
        let params = [survey_id];

        if (group_id) {
            query += `
                AND sr.user_id IN (
                    SELECT user_id FROM tblGroupMembers WHERE group_id = ?
                )
            `;
            params.push(group_id);
        }

        const rows = await allDb(query, params);
        const responses = rows.map(row => ({
            response_id: row.response_id,
            question_id: row.question_id,
            question_text: row.question_narrative,
            question_type: row.question_type,
            options: JSON.parse(row.options || '[]'),
            user_id: row.user_id,
            response: row.response,
            user_name: `${row.first_name} ${row.last_name}`
        }));

        console.log('Fetched responses:', responses.length);
        res.status(200).json(responses);
    } catch (err) {
        console.error('Error fetching survey responses:', err);
        res.status(500).json({ status: "error", message: "Failed to fetch responses" });
    }
});

//ai helped edit errors
app.post('/GroupUp/SurveyResponse', validateSession, async (req, res) => {
    const { survey_id, responses } = req.body;
    console.log('Received survey response:', { survey_id, responses, user_id: req.user_id });
    if (!survey_id || !responses || !Array.isArray(responses)) {
        return res.status(400).json({ status: "error", message: "Missing survey_id or responses" });
    }

    // Verify survey_id exists
    const surveyCheck = await allDb("SELECT survey_id FROM tblSurveys WHERE survey_id = ?", [survey_id]);
    if (!surveyCheck.length) {
        return res.status(400).json({ status: "error", message: "Invalid survey_id" });
    }

    db.serialize(() => {
        db.run("BEGIN TRANSACTION", (err) => {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).json({ status: "error", message: "Failed to start transaction" });
            }

            try {
                const insertStmt = db.prepare(`
                    INSERT INTO tblSurveyResponses (response_id, survey_id, question_id, user_id, response, submitted_datetime, visibility)
                    VALUES (?, ?, ?, ?, ?, datetime('now'), ?)
                `);

                for (const response of responses) {
                    if (!response.question_id) {
                        throw new Error(`Missing question_id in response: ${JSON.stringify(response)}`);
                    }
                    const responseValue = response.response || "";
                    const response_id = uuidv4();
                    console.log('Inserting response:', { response_id, survey_id, question_id: response.question_id, user_id: req.user_id, response: responseValue, visibility: 'private' });
                    insertStmt.run([response_id, survey_id, response.question_id, req.user_id, responseValue, 'private'], (err) => {
                        if (err) {
                            throw new Error(`Failed to insert response for question_id ${response.question_id}: ${err.message}`);
                        }
                    });
                }

                insertStmt.finalize((err) => {
                    if (err) {
                        throw new Error(`Failed to finalize statement: ${err.message}`);
                    }
                    db.run("COMMIT", (err) => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            return res.status(500).json({ status: "error", message: "Failed to commit transaction" });
                        }
                        console.log('Survey responses saved:', survey_id);
                        res.status(200).json({ status: "success", message: "Survey responses saved" });
                    });
                });
            } catch (err) {
                console.error('Error saving survey responses:', err);
                db.run("ROLLBACK", (err) => {
                    if (err) {
                        console.error('Error rolling back transaction:', err);
                    }
                    res.status(500).json({ status: "error", message: `Failed to save responses: ${err.message}` });
                });
            }
        });
    });
});

//
app.get('/GroupUp/survey', validateSession, async (req, res) => {
    // Helper function to fetch questions for a survey
    async function fetchSurveyQuestions(strSurveyId) {
        const strGetQuestionsCmd = "SELECT * FROM tblSurveyQuestions WHERE survey_id = ?";
        const arrQuestions = await allDb(strGetQuestionsCmd, [strSurveyId]);
        return arrQuestions.map(objQuestion => ({
            questionid: objQuestion.question_id, // Include question_id
            questionText: objQuestion.question_narrative,
            questionType: objQuestion.question_type,
            options: JSON.parse(objQuestion.options),
            index: objQuestion.question_order
        }));
    }

    // check for ids
    const strGroupId = req.query.group_id;
    const strProjectId = req.query.project_id;
    const strSurveyId = req.query.survey_id;

    // if no id was passed
    if (!strGroupId && !strProjectId && !strSurveyId) {
        res.status(400).json({status: "error", message: "Survey request needs either group_id, project_id, or survey_id in query string."});
    } else if (strGroupId) {
        // use database to get project ID
        const strGetProjIDCmd = "SELECT project_id FROM tblProjectGroups WHERE group_id = ?;";
        db.get(strGetProjIDCmd, [strGroupId], async (err, row) => {
            if (err) {
                console.log("Error finding project ID: ", err);
                return res.status(400).json({status: "error", message: err});
            } else if (!row.project_id) {
                console.log("Couldn't find project for group ID: ", strGroupId);
                return res.status(400).json({status: "error", message: "Couldn't find project for group ID: " + strGroupId});
            }
            // grab project id
            const strProjectId = row.project_id;
            // run command to get survey IDs
            const strGetSurveyIdCmd = "SELECT * FROM tblSurveys WHERE project_id = ?;";
            const arrSurveyEntries = await allDb(strGetSurveyIdCmd, [strProjectId]);
            let arrSurveys = [];
            // iterate through entries
            for (const objInfo of arrSurveyEntries) {
                // Create a new survey object
                const objNewSurvey = {
                    surveyid: objInfo.survey_id,
                    title: objInfo.name,
                    questions: []
                };
                // Fetch questions for the survey
                objNewSurvey.questions = await fetchSurveyQuestions(objInfo.survey_id);
                // Sort questions by their order
                objNewSurvey.questions.sort((a, b) => a.index - b.index);
                // Push the survey object to the array
                arrSurveys.push(objNewSurvey);
            }
            return res.status(200).json(arrSurveys);
        });
    } else if (strProjectId) {
        // run command to get survey IDs
        const strGetSurveyIdCmd = "SELECT * FROM tblSurveys WHERE project_id = ?;";
        const arrSurveyEntries = await allDb(strGetSurveyIdCmd, [strProjectId]);
        let arrSurveys = [];
        // iterate through entries
        for (const objInfo of arrSurveyEntries) {
            // Create a new survey object
            const objNewSurvey = {
                surveyid: objInfo.survey_id,
                title: objInfo.name,
                questions: []
            };
            // Fetch questions for the survey
            objNewSurvey.questions = await fetchSurveyQuestions(objInfo.survey_id);
            // Sort questions by their order
            objNewSurvey.questions.sort((a, b) => a.index - b.index);
            // Push the survey object to the array
            arrSurveys.push(objNewSurvey);
        }
        return res.status(200).json(arrSurveys);
    } else {
        // run command to get survey IDs
        const strGetSurveyIdCmd = "SELECT * FROM tblSurveys WHERE survey_id = ?;";
        const arrSurveyEntries = await allDb(strGetSurveyIdCmd, [strSurveyId]);
        let arrSurveys = [];
        // iterate through entries
        for (const objInfo of arrSurveyEntries) {
            // Create a new survey object
            const objNewSurvey = {
                surveyid: objInfo.survey_id,
                title: objInfo.name,
                questions: []
            };
            // Fetch questions for the survey
            objNewSurvey.questions = await fetchSurveyQuestions(objInfo.survey_id);
            // Sort questions by their order
            objNewSurvey.questions.sort((a, b) => a.index - b.index);
            // Push the survey object to the array
            arrSurveys.push(objNewSurvey);
        }
        return res.status(200).json(arrSurveys);
    }
});

// AI  helped edit
app.get('/GroupUp/survey', validateSession, async (req,res) => {

    // Helper function to fetch questions for a survey
    async function fetchSurveyQuestions(strSurveyId) {
        const strGetQuestionsCmd = "SELECT * FROM tblSurveyQuestions WHERE survey_id = ?";
        const arrQuestions = await allDb(strGetQuestionsCmd, [strSurveyId]);
        return arrQuestions.map(objQuestion => ({
            questionText: objQuestion.question_narrative,
            questionType: objQuestion.question_type,
            options: JSON.parse(objQuestion.options),
            index: objQuestion.question_order
        }));
    }

    // check for ids
    const strGroupId = req.query.group_id;
    const strProjectId = req.query.project_id;
    const strSurveyId = req.query.survey_id;

    // if no id was passed
    if (!strGroupId && !strProjectId && !strSurveyId) {

        res.status(400).json({status: "error", message: "Survey request needs either group_id, project_id, or survey_id in query string."});

    }
    
    // if group Id was passed
    else if (strGroupId) {

        // use database to get project ID
        const strGetProjIDCmd = "SELECT project_id FROM tblProjectGroups WHERE group_id = ?;";
        db.get(strGetProjIDCmd, [strGroupId], async (err, row) => {

            if (err) {

                console.log("Error finding project ID: ", err);
                return res.status(400).json({status: "error", message: err});

            }
            else if (!row.project_id) {

                console.log("Couldn't find project for group ID: ", strGroupId);
                return res.status(400).json({status: "error", message: "Couldn't find project for group ID: " + strGroupId});

            }

            // grab project id
            const strProjectId = row.project_id;

            // run command to get survey IDs
            const strGetSurveyIdCmd = "SELECT * FROM tblSurveys WHERE project_id = ?;";
            const arrSurveyEntries = await allDb(strGetSurveyIdCmd, [strProjectId]);

            let arrSurveys = []

            // iterate through entries
            for (const objInfo of arrSurveyEntries) {

                // Create a new survey object
                const objNewSurvey = {
                    surveyid: objInfo.survey_id,
                    title: objInfo.name,
                    questions: []
                };

                // Fetch questions for the survey
                objNewSurvey.questions = await fetchSurveyQuestions(objInfo.survey_id);

                // Sort questions by their order
                objNewSurvey.questions.sort((a, b) => a.index - b.index);

                // Push the survey object to the array
                arrSurveys.push(objNewSurvey);

            }

            return res.status(200).json(arrSurveys);

        });

    }

    // if project id was passed
    else if (strProjectId) {

        // run command to get survey IDs
        const strGetSurveyIdCmd = "SELECT * FROM tblSurveys WHERE project_id = ?;";
        const arrSurveyEntries = await allDb(strGetSurveyIdCmd, [strProjectId]);

        let arrSurveys = []

        // iterate through entries
        for (const objInfo of arrSurveyEntries) {

            // Create a new survey object
            const objNewSurvey = {
                surveyid: objInfo.survey_id,
                title: objInfo.name,
                questions: []
            };

            // Fetch questions for the survey
            objNewSurvey.questions = await fetchSurveyQuestions(objInfo.survey_id);

            // Sort questions by their order
            objNewSurvey.questions.sort((a, b) => a.index - b.index);

            // Push the survey object to the array
            arrSurveys.push(objNewSurvey);

        }

        return res.status(200).json(arrSurveys);

    }

    else {

        // run command to get survey IDs
        const strGetSurveyIdCmd = "SELECT * FROM tblSurveys WHERE survey_id = ?;";
        const arrSurveyEntries = await allDb(strGetSurveyIdCmd, [strSurveyId]);

        // iterate through entries
        for (const objInfo of arrSurveyEntries) {

            // Create a new survey object
            const objNewSurvey = {
                surveyid: objInfo.survey_id,
                title: objInfo.name,
                questions: []
            };

            // Fetch questions for the survey
            objNewSurvey.questions = await fetchSurveyQuestions(objInfo.survey_id);

            // Sort questions by their order
            objNewSurvey.questions.sort((a, b) => a.index - b.index);

            // Push the survey object to the array
            arrSurveys.push(objNewSurvey);

        }

        return res.status(200).json(arrSurveys);

    }

});  // ai helped edit ffor errors


// Use this function when you want to run a SELECT
function allDb(strQuery, arrParams) {
    return new Promise((resolve, reject) => {
        db.all(strQuery, arrParams, (err, rows) => {
            if (err) {
                reject(err); // Reject the promise if there's an error
            } else {
                resolve(rows); // Resolve the promise with the query result
            }
        });
    });
}

// Use this function whenever you want to modify the database
function runDb(strQuery, arrParams) {
    return new Promise((resolve, reject) => {
        db.run(strQuery, arrParams, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        })
    })
}

// Parse the phone number to retrieve the nation code, area code, and phone number
const parsePhoneNumber = (phone) => {
    const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?:[-.x ]*(\d+))?\s*$/;
    const match = phone.match(phoneRegex);

    if (!match) {
        return null; // Invalid phone number
    }

    const nationCode = match[1] || "1"; // Default to United States (+1) if nation code is missing
    const areaCode = match[2];
    const phoneNumber = `${match[3]}${match[4]}`; // Combine the remaining parts of the phone number

    return {
        nationCode,
        areaCode,
        phoneNumber
    };
};

// Middleware to validate session ID
function validateSession(req, res, next) {
    const strSessionID = req.query.session_id;
    if (!strSessionID) {
        return res.status(400).json({ error: "Missing session ID" });
    }

    // Query to check if the session ID is valid
    const strQuery = "SELECT user_id FROM tblSessions WHERE session_id = ?";
    const arrParams = [strSessionID];
    allDb(strQuery, arrParams)
        .then(arrRows => {
            if (arrRows.length === 0) {
                return res.status(401).json({ error: "Invalid session ID" });
            }
            // Store the user ID in the request object for later use
            req.user_id = arrRows[0].user_id;
            next();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        });
}

// Retrieves the projects that the user is a leader of
// This is the endpoint that the frontend will call when the user clicks on the "Projects" tab in the home page
app.get('/GroupUp/Projects', validateSession, async (req, res, next) => {

    // Query to get the projects the user is a leader of
    const strQuery = "SELECT * FROM tblProjects WHERE ? = project_leader";
    const arrParams = [req.user_id];
    const arrRows = await allDb(strQuery, arrParams);
    console.log(arrRows);
    if (arrRows.length === 0) {
        return res.status(404).json({ error: "No projects found" });
    }
    res.status(200).json(arrRows);
});

app.get("/GroupUp/Projects/Groups", validateSession, async (req, res, next) => {
    // Query to get the groups the user is a member of
    const strQuery = "SELECT * FROM tblProjectGroups WHERE project_id = ?";
    const arrParams = [req.query.project_id];
    const arrRows = await allDb(strQuery, arrParams);
    console.log(arrRows);
    if (arrRows.length === 0) {
        return res.status(404).json({ error: "No groups found" });
    }
    res.status(200).json(arrRows);
});

// Returns all of the surveys for a specific project
// This is the endpoint that the frontend will call when the user clicks on the "View Responses" button in the project management page
app.get("/GroupUp/Surveys", validateSession, async (req, res) => {
    // Query to get the surveys for a specific project
    const strQuery = "SELECT * FROM tblSurveys WHERE project_id = ?";
    const arrParams = [req.query.project_id];
    const arrRows = await allDb(strQuery, arrParams);
    console.log(arrRows);
    if (arrRows.length === 0) {
        return res.status(404).json({ error: "No surveys found" });
    }
    res.status(200).json(arrRows);
});

// Returns all of the responses for a specific survey
app.get("/GroupUp/Surveys/Responses", validateSession, async (req, res) => {
    // Query to get the surveys for a specific project
    const strQuery = "SELECT * FROM tblSurveyResponses WHERE survey_id = ?";
    const arrParams = [req.query.survey_id];
    const arrRows = await allDb(strQuery, arrParams);
    console.log(arrRows);
    if (arrRows.length === 0) {
        return res.status(404).json({ error: "No responses found" });
    }
    res.status(200).json(arrRows);
});

app.get("/GroupUp/Groups/Feedback", validateSession, async (req, res) => {
    let arrFeedback = [
        {
            "survey_name": "",
            "sender_name": "",
            "arrQuestions": [
                {
                    "question_text": "",
                    "question_type": "",
                    "options": [],
                    "arrAnswers": [
                        {
                            "answer_text": "",
                            "answer_type": ""
                        }
                    ]
                }
            ]
        }
    ]
        // who gave the feedback
        // what survey they gave feedback on


    // Query to get the feedback for the user_id received from the frontend
    let strQuery = "SELECT * FROM tblSurveyTargets WHERE receiver_id = ?";
    let arrParams = [req.user_id];
    console.log(req.user_id);
    const arrSurveys = await allDb(strQuery, arrParams);
    // console.log(arrSurveys);
    if (arrSurveys.length === 0) {
        return res.status(404).json({ error: "No feedback found" });
    }

    let arrRows = [];
    let arrAnswers = [];
    for (let i = 0; i < arrSurveys.length; i++) {
        // Get the name of the survey
        strQuery = "SELECT name FROM tblSurveys WHERE survey_id = ?";
        arrParams = [arrSurveys[i].survey_id];
        arrRows = await allDb(strQuery, arrParams);
        arrFeedback[i].survey_name = arrRows[0].name;

        // Get the name of the sender
        strQuery = "SELECT first_name, last_name FROM tblUsers WHERE user_id = ?";
        arrParams = [arrSurveys[i].sender_id];
        arrRows = await allDb(strQuery, arrParams);
        arrFeedback[i].sender_name = arrRows[0].first_name + " " + arrRows[0].last_name;

        // Get the questions for the survey
        strQuery = "SELECT * FROM tblSurveyQuestions WHERE survey_id = ?";
        arrParams = [arrSurveys[i].survey_id];
        arrRows = await allDb(strQuery, arrParams);
        arrFeedback[i].arrQuestions = arrRows;
        

        // Get the answers for the questions
        for (let j = 0; j < arrRows.length; j++) {
            strQuery = "SELECT response, question_id FROM tblSurveyResponses WHERE question_id = ? AND survey_id = ?";
            arrParams = [arrRows[j].question_id, arrSurveys[i].survey_id];
            arrAnswers = await allDb(strQuery, arrParams);
            arrFeedback[i].arrQuestions[j].arrAnswers = arrAnswers;
        }


    }
    console.log(arrFeedback);
    console.log(arrFeedback[0].arrQuestions);
    console.log(arrFeedback[0].arrQuestions[2].arrAnswers);   

    res.status(200).json(arrFeedback);
});






