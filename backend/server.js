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

// User account registration
app.post('/user', async (req, res, next) => {
    try {
        // Setup variables to store information about the user's account
        const strUserID = uuidv4();
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
        let blnPhoneExists = true;
        strQuery = "SELECT * FROM tblPhone WHERE nation_code = ? AND area_code = ? AND phone_number = ?";
        arrParams = [objPhone.nationCode, objPhone.areaCode, objPhone.phoneNumber];
        const phoneResult = await allDb(strQuery, arrParams);
        if (phoneResult.length > 0) {
            return res.status(400).json({error: "Phone number is already assoicated with an account"});
        }

        // All checks passed, so we are good to create the account
        // First, insert into tblUsers
        // Hash the password
        strPassword = bcrypt.hashSync(strPassword, intSalt);
        // Make the query and run it on the database
        strQuery = `INSERT INTO tblUsers (user_id, first_name, last_name, email, password, creation_datetime, last_used_datetime) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        arrParams = [strUserID, strFirstName, strLastName, strEmail, strPassword, strCreationDate, strLastDateUsed];
        await runDb(strQuery, arrParams);

        // Now make an insert into tblPhone
        strPhoneID = uuidv4();
        strQuery = 'INSERT INTO tblPhone VALUES (?, ?, ?, ?, ?)';
        arrParams = [strPhoneID, objPhone.nationCode, objPhone.areaCode, objPhone.phoneNumber, strUserID];
        await runDb(strQuery, arrParams);

        // Finally, insert into tblSocials if any socials are provided
        if (arrSocials) {
            let strSocialID = '';
            strQuery = 'INSERT INTO tblSocials VALUES (?, ?, ?, ?)';
            for (intCurrent = 0; intCurrent < arrSocials.length; intCurrent++) {
                strSocialID = uuidv4();
                arrParams = [strSocialID, arrSocials[intCurrent].type, arrSocials[intCurrent].username, strUserID];
                await runDb(strQuery, arrParams);
            }
            
        }

        res.status(200).json({message: "Account creation successful", user_id: strUserID});


    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while creating the account" });
    }
    

    

});

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


app.listen(HTTP_PORT, () => {
    console.log("Listening on", HTTP_PORT);  
});

