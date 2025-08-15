let expression = '';
let result = '0';

document.addEventListener('DOMContentLoaded', () => {
    const expressionDisplay = document.getElementById('expression');
    const resultDisplay = document.getElementById('result');
    const themeToggle = document.getElementById('theme-toggle');

    // Load theme
    loadTheme();
    themeToggle.addEventListener('click', toggleTheme);

    // Update display
    updateDisplay();

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            appendNumber(e.key);
        } else if (['+', '-', '*', '/'].includes(e.key)) {
            appendOperator(e.key);
        } else if (e.key === 'Enter') {
            calculate();
        } else if (e.key === 'Escape') {
            clearDisplay();
        } else if (e.key === 'Backspace') {
            deleteLast();
        }
    });
});

function appendNumber(number) {
    if (number === '.' && expression.includes('.')) {
        const lastNumber = expression.split(/[\+\-\*\/]/).pop();
        if (lastNumber.includes('.')) return;
    }
    if (expression === '0' && number !== '.') {
        expression = number;
    } else {
        expression += number;
    }
    updateDisplay();
}

function appendOperator(operator) {
    if (expression === '' || expression === '0') return;
    const lastChar = expression[expression.length - 1];
    if (['+', '-', '*', '/'].includes(lastChar)) {
        expression = expression.slice(0, -1) + operator;
    } else {
        expression += operator;
    }
    updateDisplay();
}

function clearDisplay() {
    expression = '';
    result = '0';
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    if (expression === '') result = '0';
    updateDisplay();
}

function calculate() {
    try {
        if (expression === '') return;
        const lastChar = expression[expression.length - 1];
        if (['+', '-', '*', '/'].includes(lastChar)) return;
        result = eval(expression).toString();
        if (result === 'Infinity' || result === '-Infinity') {
            result = 'Error';
        } else if (result.includes('.')) {
            result = parseFloat(result).toFixed(4).replace(/\.?0+$/, '');
        }
        expression = result;
        updateDisplay();
    } catch (e) {
        result = 'Error';
        updateDisplay();
    }
}

function updateDisplay() {
    document.getElementById('expression').textContent = expression || '';
    document.getElementById('result').textContent = result;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.getElementById('theme-toggle').innerHTML = document.body.classList.contains('dark-mode')
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
}