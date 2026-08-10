#  Oasis Infobyte (OIBSIP) - Web Development Level 2 Internship Portfolio

Welcome to the central repository for the **Oasis Infobyte Web Development & Designing Internship (OIBSIP) - Level 2 Tasks**. This repository contains four fully functional, modern web application projects built with clean architecture, high-aesthetic styling, and strict security practices.

---

## 📂 Repository Structure

```
oasis/
├── README.md                          # Main repository overview & guide (this file)
└── OIBSIP/
    ├── WebDev-L2-Calculator/          # Task 1: Browser-Based Calculator App
    │   ├── index.html
    │   ├── style.css
    │   ├── script.js
    │   └── README.md
    │
    ├── WebDev-L2-TributePage/         # Task 2: Nikola Tesla Tribute Page
    │   ├── index.html
    │   ├── style.css
    │   ├── script.js
    │   ├── README.md
    │   └── images/
    │       └── tesla-hero.png
    │
    ├── WebDev-L2-ToDoApp/             # Task 3: Interactive To-Do List Application
    │   ├── index.html
    │   ├── style.css
    │   ├── script.js
    │   └── README.md
    │
    └── WebDev-L2-LoginAuth/           # Task 4: Full-Stack Login Authentication System
        ├── package.json
        ├── server.js
        ├── database.sqlite
        ├── public/
        │   └── style.css
        ├── views/
        │   ├── register.html
        │   ├── login.html
        │   └── dashboard.html
        └── README.md
```

---

## 🌟 Project Overviews

### 1. 🧮 Calculator Web Application (`OIBSIP/WebDev-L2-Calculator/`)
A glassmorphic, browser-based desktop calculator supporting basic arithmetic and operator chaining.
- **Tech Stack**: HTML5, CSS3 (CSS Grid), Vanilla JavaScript.
- **Key Features**:
  - **CSS Grid Layout**: Responsive 4-column button matrix with active key-press micro-animations.
  - **Operator Chaining**: Evaluates pending expressions sequentially (e.g. `5 + 3 × 2` calculates `8 × 2 = 16`).
  - **Division-by-Zero Handling**: Catches `/ 0` operations gracefully, displaying a formatted `Cannot divide by 0` red alert on screen.
  - **Keyboard Accessibility**: Full physical keyboard shortcut support (`0-9`, `.`, `+`, `-`, `*`, `/`, `Enter`, `Backspace`, `Escape`).
  - **Calculation History**: Maintains past calculations log with `localStorage` persistence.

---

### 2. ⚡ Nikola Tesla Tribute Page (`OIBSIP/WebDev-L2-TributePage/`)
A responsive, high-aesthetic tribute web page celebrating inventor Nikola Tesla ("The Genius Who Lit the World").
- **Tech Stack**: HTML5, CSS3, Vanilla JavaScript, AI-generated hero graphics.
- **Key Features**:
  - **Hero Banner & Custom Portrait**: Includes a prominent hero image of Nikola Tesla in his high-voltage laboratory.
  - **3-Paragraph Biography**: Detailed sections on Early Life, The War of Currents (AC vs DC), and Future Vision & Legacy.
  - **Key Achievements Grid**: 6 styled timeline cards highlighting major milestones (AC Motor, Tesla Coil, Chicago World's Fair, Niagara Hydroelectric Plant, Teleautomaton, Wardenclyffe Tower).
  - **Multi-Tone Background Palette**: 4 distinct section background colors (`#0a0d17`, `#111827`, `#1e1b4b`, `#071524`).
  - **Dual Font Typography**: Headings rendered in `Playfair Display` (Serif) paired with `Inter` (Sans-Serif body).

---

### 3. ✅ Interactive To-Do List Application (`OIBSIP/WebDev-L2-ToDoApp/`)
A modern dashboard application for task management with queue separation and inline editing.
- **Tech Stack**: HTML5, CSS3 (Dark Glass Dashboard), Vanilla JavaScript, LocalStorage API.
- **Key Features**:
  - **Dual Task Queues**: Separates tasks cleanly into **Pending Tasks** and **Completed Tasks** lists.
  - **Dynamic Counters**: Live count badges (`X Pending`, `Y Completed`) and completion percentage metrics.
  - **Inline Text Editing**: Edit task text directly within the card (✏️) with in-place Save/Cancel actions.
  - **Priority Badges & Search**: Assign High, Medium, or Low priority tags and filter tasks dynamically by keyword.
  - **Data Persistence**: Uses browser `localStorage` to save and restore all tasks across page refreshes.

---

### 4. 🔐 Full-Stack Login Authentication System (`OIBSIP/WebDev-L2-LoginAuth/`)
A secure user registration and login web application with database storage and session-protected routes.
- **Tech Stack**: Node.js, Express.js, SQLite3, `bcryptjs`, `express-session`, HTML5, CSS3.
- **Key Features**:
  - **Password Security**: Validates password complexity (min 8 chars, 1 digit) and hashes passwords using `bcryptjs` (salt rounds = 10).
  - **Duplicate User Prevention**: Rejects duplicate username or email registrations.
  - **Generic Error Messaging**: Protects against username enumeration by returning generic error messages (*"Invalid username/email or password"*).
  - **Protected Dashboard Route**: `/dashboard` route is guarded by session middleware (`requireAuth`). Unauthenticated requests redirect to `/login`.
  - **Session Logout**: Destroys active server sessions and clears session cookies on logout.

---

## ⚡ Quick Start & Running Guide

### Running Frontend Projects (Tasks 1, 2 & 3)
Frontend applications can be opened directly in any web browser or served via a local development server:

```bash
# Option 1: Python HTTP Server
python -m http.server 8000

# Open in browser:
# Task 1: http://localhost:8000/OIBSIP/WebDev-L2-Calculator/index.html
# Task 2: http://localhost:8000/OIBSIP/WebDev-L2-TributePage/index.html
# Task 3: http://localhost:8000/OIBSIP/WebDev-L2-ToDoApp/index.html
```

### Running Full-Stack Auth Server (Task 4)
Navigate to the `WebDev-L2-LoginAuth` folder, install Node dependencies, and start the server:

```bash
cd OIBSIP/WebDev-L2-LoginAuth
npm install
npm start
```

Access the authentication app at: `http://localhost:3000`

---

## 🛠️ Compliance & Standards

- **Clean Code Architecture**: Modular code separation between HTML, CSS, JavaScript, and Node backend modules.
- **Event Listener Standard**: 0 inline `onclick` attributes used; all events bound dynamically via `addEventListener`.
- **Responsive Web Design**: Mobile, tablet, and desktop breakpoints implemented across all projects.
- **Security Standard**: Industry-standard salted password hashing and HTTP session authentication.

---

## 👨‍💻 Author

Developed for **Oasis Infobyte (OIBSIP) Web Development & Designing Internship - Level 2**.
