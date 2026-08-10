# OIBSIP Web Development Task 2: WebDev-L2-Calculator

A modern, responsive, browser-based calculator constructed using HTML5, CSS3 (CSS Grid & Glassmorphic styling), and Vanilla JavaScript. Built as part of the Oasis Infobyte Internship Program (OIBSIP) Web Development Level 2 Track.

---

## 🌟 Features

- **CSS Grid Layout**: Clean and structured 4-column responsive keyboard interface.
- **Operator Chaining**: Supports sequential evaluation during chained calculations (e.g., inputting `5 + 3 * 2` calculates `8 * 2 = 16`).
- **Graceful Division-by-Zero Protection**: Catches `n / 0` operations and displays a clear error message (`Cannot divide by 0`) on screen without crashing or returning `Infinity`.
- **Pure JavaScript Event Listeners**: All event bindings use `addEventListener` and event delegation without inline `onclick` attributes in HTML.
- **Full Keyboard Accessibility**: Type numbers and operations directly using your physical keyboard (`0-9`, `.`, `+`, `-`, `*`, `/`, `Enter`, `Backspace`, `Escape`).
- **Calculation History Drawer**: Logs past calculations into `localStorage` so history persists across sessions. Clicking past entries reloads them into the calculator.
- **Dynamic Themes**: Cycle between Dark Glass, Light Glass, and Cyberpunk Neon themes.
- **Floating-Point Precision Correction**: Avoids JavaScript floating-point errors (such as `0.1 + 0.2 = 0.30000000000000004`).

---

## 📁 File Structure

```
OIBSIP/WebDev-L2-Calculator/
├── index.html   # Main HTML5 document structure
├── style.css    # CSS Grid layout, Glassmorphism aesthetic & themes
├── script.js    # Vanilla JS engine handling calculations, events, and keyboard support
└── README.md    # Technical documentation & usage instructions
```

---

## 💻 Tech Stack

- **HTML5**: Semantic markup with clean data attributes for event routing.
- **CSS3**: CSS Grid, Flexbox, CSS Custom Properties (variables), Backdrop Filter, CSS Animations.
- **Vanilla JavaScript (ES6+)**: Object-Oriented Calculator class, Event Delegation, LocalStorage API, DOM Manipulation.

---

## ⌨️ Keyboard Shortcuts

| Key | Calculator Function |
| :--- | :--- |
| `0` - `9` | Input Numbers |
| `.` | Input Decimal Point |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication (`×`) |
| `/` | Division (`÷`) |
| `Enter` or `=` | Compute Result (`=`) |
| `Backspace` | Delete Last Character (`DEL`) |
| `Escape` or `C` / `c` | Clear All (`AC`) |
| `%` | Calculate Percentage |

---

## 🚀 How to Run

1. Open the file `index.html` directly in any modern browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
2. Alternatively, serve via a local development server such as VS Code Live Server or Vite/http-server.
