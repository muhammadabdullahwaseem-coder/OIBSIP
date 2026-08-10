/**
 * OIBSIP Web Development Level 2 Task 2 - Calculator Engine
 * Author: Antigravity Pair Programmer
 * Technical Features:
 *  - Operator chaining (sequential step-by-step intermediate evaluations)
 *  - Graceful division-by-zero error state handling
 *  - Event delegation via JS addEventListener (No inline HTML onclick)
 *  - Full keyboard shortcuts & visual keypress feedback
 *  - Calculation history drawer with LocalStorage persistence
 *  - Floating point arithmetic precision correction
 */

class Calculator {
    constructor(expressionDisplayElement, mainDisplayElement) {
        this.expressionDisplayElement = expressionDisplayElement;
        this.mainDisplayElement = mainDisplayElement;
        
        // Calculation State
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.isErrorState = false;
        
        // History State
        this.history = this.loadHistoryFromStorage();

        this.updateDisplay();
    }

    /**
     * Resets the calculator state completely (Clear / AC)
     */
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.isErrorState = false;
        this.updateDisplay();
    }

    /**
     * Deletes the last character from current operand (Backspace / DEL)
     */
    deleteBackspace() {
        if (this.isErrorState) {
            this.clear();
            return;
        }

        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
            this.updateDisplay();
            return;
        }

        if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }

    /**
     * Appends a number digit (0-9) to the current operand
     * @param {string} number 
     */
    appendNumber(number) {
        if (this.isErrorState) {
            this.clear();
        }

        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }

        // Prevent multiple leading zeros
        if (this.currentOperand === '0' && number === '0') return;
        
        // Replace initial zero if not adding decimal
        if (this.currentOperand === '0' && number !== '0') {
            this.currentOperand = number;
        } else {
            // Cap max length to prevent display overflow
            if (this.currentOperand.replace(/[^0-9]/g, '').length >= 16) return;
            this.currentOperand += number;
        }

        this.updateDisplay();
    }

    /**
     * Appends a decimal point if not already present
     */
    appendDecimal() {
        if (this.isErrorState) {
            this.clear();
        }

        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }

        if (this.currentOperand.includes('.')) return;

        if (this.currentOperand === '') {
            this.currentOperand = '0.';
        } else {
            this.currentOperand += '.';
        }

        this.updateDisplay();
    }

    /**
     * Selects an arithmetic operator (+, -, ×, ÷)
     * Handles operator chaining (e.g. 5 + 3 * 2)
     * @param {string} op 
     */
    chooseOperation(op) {
        if (this.isErrorState) return;

        // If user selects an operator when an operation is already pending and current input is entered,
        // compute intermediate result first (Operator Chaining)
        if (this.previousOperand !== '' && !this.shouldResetScreen) {
            this.compute(true);
            if (this.isErrorState) return; // Stop if division by zero occurred
        }

        this.operation = op;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    /**
     * Toggles polarity (+/-)
     */
    toggleSign() {
        if (this.isErrorState || this.currentOperand === '0') return;
        
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.substring(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
        this.updateDisplay();
    }

    /**
     * Calculates percentage (/ 100)
     */
    calculatePercentage() {
        if (this.isErrorState) return;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        const result = current / 100;
        this.currentOperand = this.formatNumberResult(result);
        this.updateDisplay();
    }

    /**
     * Performs the actual mathematical evaluation
     * @param {boolean} isChaining - True if called automatically from operator chaining
     */
    compute(isChaining = false) {
        if (this.isErrorState) return;
        if (this.operation === null || this.previousOperand === '') return;

        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        let computation = 0;
        let expressionStr = `${this.formatDisplayNumber(this.previousOperand)} ${this.operation} ${this.formatDisplayNumber(this.currentOperand)}`;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) {
                    this.triggerDivisionByZeroError();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        const formattedResult = this.formatNumberResult(computation);

        // Record history entry
        this.addHistoryEntry(expressionStr, formattedResult);

        // Update state
        this.currentOperand = formattedResult;
        this.previousOperand = isChaining ? formattedResult : '';
        if (!isChaining) {
            this.operation = null;
        }
        this.shouldResetScreen = true;
        this.updateDisplay(expressionStr + ' =');
    }

    /**
     * Triggers division by zero error state
     */
    triggerDivisionByZeroError() {
        this.currentOperand = 'Cannot divide by 0';
        this.isErrorState = true;
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    /**
     * Formats mathematical floating point calculation results to prevent 0.1 + 0.2 = 0.30000000000000004
     * @param {number} num 
     * @returns {string}
     */
    formatNumberResult(num) {
        if (!isFinite(num)) return 'Error';
        
        // Fix floating point precision bugs by using precision rounding
        const precisionResult = parseFloat(num.toPrecision(12));
        
        // Convert to string and return
        return precisionResult.toString();
    }

    /**
     * Formats numbers for screen rendering with comma separators
     * @param {string} numberStr 
     * @returns {string}
     */
    formatDisplayNumber(numberStr) {
        if (this.isErrorState) return numberStr;
        if (!numberStr) return '';
        if (numberStr === '-') return '-';

        const [integerPart, decimalPart] = numberStr.split('.');
        const parsedInt = parseFloat(integerPart);

        let integerDisplay = '';
        if (isNaN(parsedInt)) {
            integerDisplay = '';
        } else {
            integerDisplay = parsedInt.toLocaleString('en-US', { maximumFractionDigits: 0 });
        }

        if (decimalPart !== undefined) {
            return `${integerDisplay}.${decimalPart}`;
        } else {
            return integerDisplay;
        }
    }

    /**
     * Updates the HTML DOM display elements
     * @param {string|null} customExpression 
     */
    updateDisplay(customExpression = null) {
        // Handle Main Display
        if (this.isErrorState) {
            this.mainDisplayElement.textContent = this.currentOperand;
            this.mainDisplayElement.classList.add('error-state');
        } else {
            this.mainDisplayElement.textContent = this.formatDisplayNumber(this.currentOperand);
            this.mainDisplayElement.classList.remove('error-state');
        }

        // Handle Expression Line
        if (customExpression !== null) {
            this.expressionDisplayElement.textContent = customExpression;
        } else if (this.operation !== null && this.previousOperand !== '') {
            this.expressionDisplayElement.textContent = `${this.formatDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.expressionDisplayElement.textContent = '';
        }

        // Dynamically shrink font size if text gets too long
        this.adjustFontSize();
    }

    /**
     * Dynamically adjusts main display font size based on length
     */
    adjustFontSize() {
        const textLength = this.mainDisplayElement.textContent.length;
        if (textLength > 12) {
            this.mainDisplayElement.style.fontSize = '1.5rem';
        } else if (textLength > 9) {
            this.mainDisplayElement.style.fontSize = '1.85rem';
        } else {
            this.mainDisplayElement.style.fontSize = '2.5rem';
        }
    }

    /* --- History Management Methods --- */
    addHistoryEntry(expression, result) {
        const entry = { expression, result, id: Date.now() };
        this.history.unshift(entry);
        if (this.history.length > 20) this.history.pop(); // Keep last 20 entries
        this.saveHistoryToStorage();
        this.renderHistoryList();
    }

    loadHistoryFromStorage() {
        try {
            const saved = localStorage.getItem('oibsip_calc_history');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    saveHistoryToStorage() {
        try {
            localStorage.setItem('oibsip_calc_history', JSON.stringify(this.history));
        } catch (e) {
            console.warn('LocalStorage save error', e);
        }
    }

    clearHistory() {
        this.history = [];
        this.saveHistoryToStorage();
        this.renderHistoryList();
    }

    renderHistoryList() {
        const historyListEl = document.getElementById('history-list');
        if (!historyListEl) return;

        if (this.history.length === 0) {
            historyListEl.innerHTML = '<li class="empty-history">No past calculations yet.</li>';
            return;
        }

        historyListEl.innerHTML = this.history.map(item => `
            <li class="history-item" data-result="${item.result}">
                <span class="history-exp">${item.expression}</span>
                <span class="history-res">= ${item.result}</span>
            </li>
        `).join('');
    }
}

/* ==========================================================================
   DOM Initialization & Event Bindings
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // DOM References
    const expressionDisplay = document.getElementById('expression-display');
    const mainDisplay = document.getElementById('main-display');
    const calculatorGrid = document.getElementById('calculator-grid');

    // Instantiate Calculator Core
    const calculator = new Calculator(expressionDisplay, mainDisplay);
    calculator.renderHistoryList();

    /* --- 1. Event Listeners for Calculator Buttons (Event Delegation) --- */
    calculatorGrid.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        const value = button.dataset.value;

        // Visual press effect
        triggerButtonAnimation(button);

        switch (action) {
            case 'number':
                calculator.appendNumber(value);
                break;
            case 'decimal':
                calculator.appendDecimal();
                break;
            case 'operator':
                calculator.chooseOperation(value);
                break;
            case 'calculate':
                calculator.compute();
                break;
            case 'clear':
                calculator.clear();
                break;
            case 'delete':
                calculator.deleteBackspace();
                break;
            case 'toggle-sign':
                calculator.toggleSign();
                break;
            case 'percent':
                calculator.calculatePercentage();
                break;
        }
    });

    /* --- 2. Keyboard Event Binding --- */
    document.addEventListener('keydown', (e) => {
        // Prevent default browser shortcuts for calculator keys
        if (['/', '*', '-', '+', 'Enter', 'Backspace', 'Escape'].includes(e.key)) {
            // Allow refresh or developer tools
            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
            }
        }

        let buttonToAnimate = null;

        if (e.key >= '0' && e.key <= '9') {
            calculator.appendNumber(e.key);
            buttonToAnimate = document.querySelector(`button[data-action="number"][data-value="${e.key}"]`);
        } else if (e.key === '.') {
            calculator.appendDecimal();
            buttonToAnimate = document.querySelector(`button[data-action="decimal"]`);
        } else if (e.key === '+') {
            calculator.chooseOperation('+');
            buttonToAnimate = document.querySelector(`button[data-value="+"]`);
        } else if (e.key === '-') {
            calculator.chooseOperation('-');
            buttonToAnimate = document.querySelector(`button[data-value="-"]`);
        } else if (e.key === '*') {
            calculator.chooseOperation('×');
            buttonToAnimate = document.querySelector(`button[data-value="×"]`);
        } else if (e.key === '/') {
            calculator.chooseOperation('÷');
            buttonToAnimate = document.querySelector(`button[data-value="÷"]`);
        } else if (e.key === 'Enter' || e.key === '=') {
            calculator.compute();
            buttonToAnimate = document.querySelector(`button[data-action="calculate"]`);
        } else if (e.key === 'Backspace') {
            calculator.deleteBackspace();
            buttonToAnimate = document.querySelector(`button[data-action="delete"]`);
        } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
            calculator.clear();
            buttonToAnimate = document.querySelector(`button[data-action="clear"]`);
        } else if (e.key === '%') {
            calculator.calculatePercentage();
            buttonToAnimate = document.querySelector(`button[data-action="percent"]`);
        }

        if (buttonToAnimate) {
            triggerButtonAnimation(buttonToAnimate);
        }
    });

    /* --- 3. Theme Toggle --- */
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themes = ['theme-dark-glass', 'theme-light-glass', 'theme-cyberpunk'];
    let currentThemeIdx = 0;

    themeBtn.addEventListener('click', () => {
        document.body.classList.remove(themes[currentThemeIdx]);
        currentThemeIdx = (currentThemeIdx + 1) % themes.length;
        document.body.classList.add(themes[currentThemeIdx]);
        
        const themeNames = ['Dark Glass', 'Light Glass', 'Cyberpunk Neon'];
        showToast(`Theme switched to ${themeNames[currentThemeIdx]}`);
    });

    /* --- 4. History Drawer Interactions --- */
    const historyToggleBtn = document.getElementById('history-toggle-btn');
    const historyDrawer = document.getElementById('history-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const historyList = document.getElementById('history-list');

    function toggleHistoryDrawer(show) {
        if (show) {
            historyDrawer.classList.remove('hidden');
            historyDrawer.setAttribute('aria-hidden', 'false');
        } else {
            historyDrawer.classList.add('hidden');
            historyDrawer.setAttribute('aria-hidden', 'true');
        }
    }

    historyToggleBtn.addEventListener('click', () => toggleHistoryDrawer(true));
    closeDrawerBtn.addEventListener('click', () => toggleHistoryDrawer(false));
    drawerOverlay.addEventListener('click', () => toggleHistoryDrawer(false));

    clearHistoryBtn.addEventListener('click', () => {
        calculator.clearHistory();
        showToast('Calculation history cleared');
    });

    // Clicking a history entry loads its result into the calculator
    historyList.addEventListener('click', (e) => {
        const item = e.target.closest('.history-item');
        if (!item) return;

        const resultVal = item.dataset.result;
        calculator.currentOperand = resultVal;
        calculator.shouldResetScreen = true;
        calculator.isErrorState = false;
        calculator.updateDisplay();
        toggleHistoryDrawer(false);
        showToast(`Loaded ${resultVal} into calculator`);
    });

    /* --- 5. Helper Animation & Toast Functions --- */
    function triggerButtonAnimation(btn) {
        btn.classList.add('active-press');
        setTimeout(() => {
            btn.classList.remove('active-press');
        }, 150);
    }

    function showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 2500);
    }
});
