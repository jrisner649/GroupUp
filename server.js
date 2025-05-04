// libraries
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

// constants
const DB_FILENAME = "GroupUp.db";
const HTTP_PORT = 8000;
const INT_SALT = 10;

// init db
const db = new sqlite3.Database(DB_FILENAME, (err) => {
    if (err) {
        console.error('Error opening database:', err);
        process.exit(1);
    }
    console.log('Connected to SQLite database');

    // Check if tblUsers exists with correct structure
    db.all("PRAGMA table_info(tblUsers)", [], (err, columns) => {
        if (err || columns.length === 0) {
            // Create tblUsers with id column
            db.run(`
                CREATE TABLE IF NOT EXISTS tblUsers (
                    id TEXT PRIMARY KEY,
                    FirstName TEXT NOT NULL,
                    LastName TEXT NOT NULL,
                    Email TEXT NOT NULL UNIQUE,
                    Password TEXT NOT NULL,
                    CreationDateTime TEXT NOT NULL,
                    LastLoginDateTime TEXT
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating tblUsers:', err);
                }
            });
        }
    });

    // Check if tblSessions exists with correct structure
    db.all("PRAGMA table_info(tblSessions)", [], (err, columns) => {
        if (err || columns.length === 0) {
            // Create tblSessions with id column
            db.run(`
                CREATE TABLE IF NOT EXISTS tblSessions (
                    id TEXT PRIMARY KEY,
                    UserID TEXT NOT NULL,
                    StartDateTime TEXT NOT NULL,
                    LastUsedDateTime TEXT NOT NULL,
                    Status TEXT NOT NULL
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating tblSessions:', err);
                }
            });
        }
    });
});

// init express app
var app = express();
app.use(cors());
app.use(express.json());

// routes
// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Query user by email
    db.get(
        'SELECT * FROM tblUsers WHERE Email = ?',
        [email],
        async (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            if (!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Verify password
            try {
                const isMatch = await bcrypt.compare(password, user.Password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid email or password' });
                }

                // Update LastLoginDateTime
                db.run(
                    'UPDATE tblUsers SET LastLoginDateTime = ? WHERE Email = ?',
                    [new Date().toISOString(), email],
                    (err) => {
                        if (err) {
                            console.error('Update error:', err);
                            return res.status(500).json({ message: 'Server error' });
                        }
                    }
                );

                // Create session
                const sessionId = uuidv4();
                const now = new Date().toISOString();
                db.run(
                    `INSERT INTO tblSessions (id, UserID, StartDateTime, LastUsedDateTime, Status)
                     VALUES (?, ?, ?, ?, ?)`,
                    [sessionId, user.id, now, now, 'Active'],
                    (err) => {
                        if (err) {
                            console.error('Insert session error:', err);
                            return res.status(500).json({ message: 'Server error' });
                        }

                        
                        res.json({
                            sessionId,
                            user: { id: user.id, email: user.Email, firstName: user.FirstName }
                        });
                    }
                );
            } catch (err) {
                console.error('Bcrypt error:', err);
                res.status(500).json({ message: 'Server error' });
            }
        }
    );
});

// Add a registration endpoint
app.post('/api/auth/register', async (req, res) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user already exists
        db.get('SELECT * FROM tblUsers WHERE Email = ?', [email], async (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            
            if (user) {
                return res.status(400).json({ message: 'User already exists with this email' });
            }
            
            // Hash the password
            try {
                const hashedPassword = await bcrypt.hash(password, INT_SALT);
                const userId = uuidv4();
                const now = new Date().toISOString();
                
                // Insert new user
                db.run(
                    `INSERT INTO tblUsers (id, FirstName, LastName, Email, Password, CreationDateTime)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [userId, firstName, lastName, email, hashedPassword, now],
                    (err) => {
                        if (err) {
                            console.error('Insert user error:', err);
                            return res.status(500).json({ message: 'Server error creating user' });
                        }
                        
                        // Add phone number if provided
                        if (phoneNumber) {
                            // Insert into tblPhone if needed
                            // This depends on your schema
                        }
                        
                        res.status(201).json({ 
                            message: 'User registered successfully',
                            user: { id: userId, email, firstName }
                        });
                    }
                );
            } catch (err) {
                console.error('Bcrypt error:', err);
                res.status(500).json({ message: 'Server error hashing password' });
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// test route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.listen(HTTP_PORT, () => {
    console.log("Listening on ", HTTP_PORT);
});