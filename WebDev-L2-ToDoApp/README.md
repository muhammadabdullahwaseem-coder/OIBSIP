# OIBSIP Web Development Task 3: WebDev-L2-ToDoApp

An interactive, responsive To-Do List web application built using HTML5, CSS3, and Vanilla JavaScript as part of the Oasis Infobyte Internship Program (OIBSIP) Web Development Level 2 Track.

---

## 🌟 Technical & Functional Features

- **Dual Task Queues**: Maintains two distinct lists—**Pending Tasks** and **Completed Tasks**. Marking a task as complete automatically transfers it between lists.
- **Dynamic Count Badges**: Real-time counter indicators above each list displaying `X Pending` and `Y Completed` tasks, plus header completion percentage metrics.
- **Inline Text Editing**: Edit task descriptions directly within the list card with live save/cancel controls.
- **Permanent Task Deletion**: Delete individual tasks or bulk-clear all completed items.
- **Empty State Graphics**: Custom illustration placeholders that render when either the pending or completed list has zero items.
- **LocalStorage Data Persistence**: Automatically saves tasks to browser storage so user state persists across page reloads.
- **Priority Tags & Search Filtering**: Assign High, Medium, or Low priority tags to tasks, and filter tasks dynamically via keyword search.
- **Pure JavaScript Events**: All event listeners are attached via `addEventListener` without inline `onclick` attributes.

---

## 📁 File Structure

```
OIBSIP/WebDev-L2-ToDoApp/
├── index.html   # Semantic HTML5 markup, forms, and task section containers
├── style.css    # Dark glass dashboard UI, priority tags, and responsive breakpoints
├── script.js    # Object-oriented TaskManager class handling state, LocalStorage, and DOM rendering
└── README.md    # Technical documentation & project guide
```

---

## 💻 Technical Stack

- **HTML5**: Semantic tags (`<main>`, `<section>`, `<header>`, `<form>`, `<input>`, `<select>`).
- **CSS3**: CSS Custom Properties, Flexbox, CSS Grid, Backdrop-Filter, Animations, Glassmorphism.
- **Vanilla JavaScript (ES6+)**: ES6 `TaskManager` class, Event Delegation, DOM API, `localStorage` JSON serialization.

---

## 🚀 How to Run

1. Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
2. Alternatively, serve via a local web server (e.g. `python -m http.server 8002` or VS Code Live Server).
