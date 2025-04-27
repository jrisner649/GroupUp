// libraries
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');


// constants
const DB_FILENAME = "GroupUp.db";
const HTTP_PORT = 8000;
const intSalt = 10;

// init db
const db = new sqlite3.Database(DB_FILENAME);

// init express app
var app = express();
app.use(cors());
app.use(express.json());


// naked domain fetch
app.get("/", (req,res,next) => {

    res.status(200).json({"message": "I am alive!"});

})


// create new project
app.post("/GroupUp/Project", (req,res,next) => {

    // get info from body and verify
    let strUser = req.body.userEmail;
    let strProjectName = req.body.name;
    let strProjectDesc = req.body.desc;

    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

    // error parameters
    let boolError = false;
    let strErrorMsg = "";
    let boolWarning = false;
    let strWarningMsg = "";

    // verify that all 3 were passed
    if (!regEmail.test(strUser)) {

        boolError = true;
        strErrorMsg += "Must pass a valid user email address. ";

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
    
    // return if error
    if (boolError) {

        console.log(JSON.stringify({status: "error", message: strErrorMsg}));

        res.status(400).json({status: "error", message: strErrorMsg});

    }
    else {

        // create new ID
        let strProjectId = uuidv4();

        // run sql command
        let strInsertCmd = 'INSERT INTO tblProjects VALUES (?,?,?,?)';
        db.run(strInsertCmd, [strProjectId, strProjectName, strProjectDesc, strUser], (err, result) => {

            // return error
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


app.listen(HTTP_PORT, () => {
    console.log("Listening on", HTTP_PORT);  
});

