document.addEventListener('DOMContentLoaded', () => {
    // Check which page is loaded
    const isDashboard = window.location.pathname.includes('dashboard.html');
    const themeToggle = document.getElementById('theme-toggle');

    // Load theme
    loadTheme();
    themeToggle.addEventListener('click', toggleTheme);

    if (isDashboard) {
        // Dashboard page logic
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            window.location.href = 'index.html';
            return;
        }
        document.getElementById('user-name').textContent = loggedInUser.username;
    } else {
        // Login/Register page logic
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            window.location.href = 'dashboard.html';
            return;
        }
    }
});

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-error').textContent = '';
    document.getElementById('register-error').textContent = '';
}

function showRegister() {
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('login-error').textContent = '';
    document.getElementById('register-error').textContent = '';
}

function register() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const error = document.getElementById('register-error');

    if (!username || !email || !password) {
        error.textContent = 'All fields are required.';
        return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        error.textContent = 'Invalid email format.';
        return;
    }

    if (password.length < 6) {
        error.textContent = 'Password must be at least 6 characters.';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email === email)) {
        error.textContent = 'Email already registered.';
        return;
    }

    const hashedPassword = simpleHash(password);
    users.push({ username, email, password: hashedPassword });
    localStorage.setItem('users', JSON.stringify(users));
    error.textContent = 'Registration successful! Please login.';
    setTimeout(showLogin, 1000);
}

function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const error = document.getElementById('login-error');

    if (!email || !password) {
        error.textContent = 'All fields are required.';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === simpleHash(password));

    if (!user) {
        error.textContent = 'Invalid email or password.';
        return;
    }

    localStorage.setItem('loggedInUser', JSON.stringify({ username: user.username, email: user.email }));
    window.location.href = 'dashboard.html';
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
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