/**
 * OIBSIP Web Development Level 2 Task 4 - Full-Stack Authentication Server
 * Built with Node.js, Express, SQLite3, bcryptjs, and express-session.
 */

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database at', dbPath);
    }
});

// Create Users Table if not exists
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// Express Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Setup
app.use(session({
    secret: 'oibsip-super-secret-auth-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: false // Set to true in HTTPS production
    }
}));

// Session Authentication Guard Middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Redirect logged-in users away from Auth pages
function redirectIfAuth(req, res, next) {
    if (req.session && req.session.user) {
        res.redirect('/dashboard');
    } else {
        next();
    }
}

/* ==========================================================================
   ROUTES
   ========================================================================== */

// Root Route
app.get('/', (req, res) => {
    if (req.session && req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Register View
app.get('/register', redirectIfAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Register Action
app.post('/register', redirectIfAuth, async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    const trimmedUsername = username ? username.trim() : '';
    const trimmedEmail = email ? email.trim().toLowerCase() : '';
    const rawPassword = password || '';

    // 1. Basic Field Validation
    if (!trimmedUsername || !trimmedEmail || !rawPassword) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (confirmPassword !== undefined && rawPassword !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // 2. Strict Password Validation: Min 8 chars, at least 1 number
    if (rawPassword.length < 8 || !/\d/.test(rawPassword)) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters long and contain at least one number.'
        });
    }

    // 3. Duplicate User Check (Username or Email)
    db.get(
        `SELECT id FROM users WHERE username = ? OR email = ?`,
        [trimmedUsername, trimmedEmail],
        async (err, row) => {
            if (err) {
                console.error('DB query error:', err);
                return res.status(500).json({ error: 'Database server error.' });
            }

            if (row) {
                return res.status(409).json({
                    error: 'An account with that username or email address already exists.'
                });
            }

            try {
                // 4. Password Hashing using Bcrypt (Salt rounds = 10)
                const hashedPassword = await bcrypt.hash(rawPassword, 10);

                // 5. Insert New User
                db.run(
                    `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`,
                    [trimmedUsername, trimmedEmail, hashedPassword],
                    function (insertErr) {
                        if (insertErr) {
                            console.error('DB insert error:', insertErr);
                            return res.status(500).json({ error: 'Failed to create user account.' });
                        }

                        // Success response
                        return res.status(201).json({
                            success: true,
                            message: 'Registration successful! Redirecting to login...'
                        });
                    }
                );
            } catch (hashErr) {
                console.error('Bcrypt error:', hashErr);
                return res.status(500).json({ error: 'Password hashing error.' });
            }
        }
    );
});

// Login View
app.get('/login', redirectIfAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Login Action
app.post('/login', redirectIfAuth, (req, res) => {
    const { loginInput, password } = req.body;

    const identifier = loginInput ? loginInput.trim().toLowerCase() : '';
    const rawPassword = password || '';

    if (!identifier || !rawPassword) {
        return res.status(400).json({ error: 'Please enter both username/email and password.' });
    }

    // Query user by username OR email
    db.get(
        `SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?`,
        [identifier, identifier],
        async (err, user) => {
            if (err) {
                console.error('DB Login query error:', err);
                return res.status(500).json({ error: 'Internal server error.' });
            }

            // Generic error message requirement: DO NOT reveal whether username or password was wrong
            const GENERIC_ERROR = 'Invalid username/email or password.';

            if (!user) {
                return res.status(401).json({ error: GENERIC_ERROR });
            }

            // Compare password with bcrypt hash
            const isMatch = await bcrypt.compare(rawPassword, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({ error: GENERIC_ERROR });
            }

            // Create Session
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.created_at
            };

            return res.status(200).json({
                success: true,
                message: 'Login successful! Redirecting...',
                redirect: '/dashboard'
            });
        }
    );
});

// Protected Dashboard View
app.get('/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Current User API Endpoint for Dashboard
app.get('/api/user', requireAuth, (req, res) => {
    res.json({
        authenticated: true,
        user: req.session.user
    });
});

// Logout Route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Could not log out.' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ success: true, redirect: '/login' });
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`OIBSIP Authentication Server running on port ${PORT}`);
    console.log(`Local Access: http://localhost:${PORT}`);
    console.log(`====================================================`);
});
