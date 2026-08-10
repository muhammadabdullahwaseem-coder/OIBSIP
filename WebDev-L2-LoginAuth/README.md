# OIBSIP Web Development Task 4: WebDev-L2-LoginAuth

A full-stack user authentication system built with **Node.js**, **Express**, **SQLite3**, **bcryptjs**, and **express-session**. Developed as part of the Oasis Infobyte Internship Program (OIBSIP) Web Development Level 2 Track.

---

## 🌟 Security & Functional Highlights

- **Bcrypt Password Hashing**: Hashes all user passwords with `bcryptjs` (salt rounds = 10) before storing them in the SQLite database.
- **Password Complexity Validation**: Enforces strict password validation requiring a minimum of 8 characters and at least 1 numeric digit.
- **Duplicate Registration Protection**: Prevents duplicate username or email registrations and returns an explicit user error message.
- **Generic Error Messaging**: Protects against username enumeration attacks by displaying a generic error message (*"Invalid username/email or password"*) for incorrect login credentials.
- **Session Protection**: Protects the `/dashboard` route using `express-session` middleware (`requireAuth`). Direct unauthenticated requests are automatically redirected to `/login`.
- **Session Destruction**: Provides a Logout button on the dashboard that completely destroys the server-side session and clears authentication cookies.

---

## 📁 File Structure

```
OIBSIP/WebDev-L2-LoginAuth/
├── package.json         # Node.js project manifest & dependencies
├── server.js            # Express server, SQLite database, bcrypt & session middleware
├── database.sqlite      # Local SQLite database file (auto-created on server start)
├── public/
│   └── style.css        # Dark glassmorphism authentication UI stylesheet
├── views/
│   ├── register.html    # Registration page
│   ├── login.html       # Login page
│   └── dashboard.html   # Protected dashboard page
└── README.md            # Technical documentation & running instructions
```

---

## 💻 Tech Stack

- **Backend**: Node.js, Express.js framework
- **Database**: SQLite3 (`sqlite3` module)
- **Security**: `bcryptjs` (password hashing), `express-session` (cookie session management)
- **Frontend**: HTML5, CSS3 (Glassmorphism theme), Vanilla JavaScript Fetch API

---

## 🚀 How to Run the Server

### 1. Install Dependencies
Navigate to the project subdirectory and install NPM packages:
```bash
cd OIBSIP/WebDev-L2-LoginAuth
npm install
```

### 2. Start the Application Server
Run the Node.js server:
```bash
npm start
```

The server will initialize SQLite database tables and start listening at:
`http://localhost:3000`

---

## 🧪 Testing Guide

1. **Register**: Navigate to `http://localhost:3000/register`. Create a new user (e.g. `johndoe` / `john@example.com` / `Secret123`).
2. **Duplicate Prevention**: Try registering with the same username or email again. Verify the duplicate error message.
3. **Password Validation**: Try registering with a weak password like `short`. Verify the complexity error message.
4. **Login**: Navigate to `http://localhost:3000/login`.
   - Enter invalid credentials (e.g. `johndoe` / `wrongpass`) -> verify the generic error message.
   - Enter valid credentials (`johndoe` / `Secret123`) -> verify redirect to `/dashboard`.
5. **Session Guard**: Open a new incognito window and navigate directly to `http://localhost:3000/dashboard`. Verify it redirects to `/login`.
6. **Logout**: Click the **Log Out** button on the dashboard and verify the session is destroyed.
