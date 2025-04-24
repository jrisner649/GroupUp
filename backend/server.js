
// libraries
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// constants
const DB_FILENAME = "GroupUp.db";
const HTTP_PORT = 8000;

// init db
const db = new sqlite3.Database(DB_FILENAME);

// init express app
var app = express();
app.use(cors());
app.use(express.json());













app.listen(HTTP_PORT, () => {

    console.log("Listening on ", HTTP_PORT);
    
});

