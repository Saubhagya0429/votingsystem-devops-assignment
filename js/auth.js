// ============================================
// Authentication Module
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAuthPage();
});

/**
 * Initialize authentication page functionality
 */
function initializeAuthPage() {
    const toggleLoginBtn = document.getElementById('toggle-login');
    const toggleRegisterBtn = document.getElementById('toggle-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authError = document.getElementById('auth-error');

    // Toggle between login and register sections
    toggleRegisterBtn.addEventListener('click', function() {
        switchAuthSection('register');
    });

    toggleLoginBtn.addEventListener('click', function() {
        switchAuthSection('login');
    });

    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
}

/**
 * Switch between login and register sections
 * @param {string} section - 'login' or 'register'
 */
function switchAuthSection(section) {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');

    if (section === 'login') {
        loginSection.classList.add('active');
        registerSection.classList.remove('active');
    } else {
        registerSection.classList.add('active');
        loginSection.classList.remove('active');
    }
}

/**
 * Handle login form submission
 * @param {Event} e - Form submission event
 */
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Validate input
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    // Send POST to /api/auth/login
    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const msg = data.message || 'Login failed';
            throw new Error(msg);
        }
        return data;
    })
    .then(data => {
        const token = data.token || data.jwt || data.accessToken;
        if (token) {
            localStorage.setItem('jwt', token);
        }
        showAlert('Login successful! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'vote.html', 800);
    })
    .catch(err => {
        showAlert(err.message || 'Invalid email or password', 'error');
    });
}

/**
 * Handle register form submission
 * @param {Event} e - Form submission event
 */
function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    // Validate input
    if (!name || !email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    if (!validatePasswordStrength(password)) {
        showAlert('Password must be at least 8 characters long', 'error');
        return;
    }

    // Send POST to /api/auth/register
    fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const msg = data.message || 'Registration failed';
            throw new Error(msg);
        }
        return data;
    })
    .then(data => {
        showAlert('Registration successful! Please log in.', 'success');
        switchAuthSection('login');
    })
    .catch(err => {
        showAlert(err.message || 'Registration failed', 'error');
    });
}

/**
 * Validate login credentials (mock validation)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {boolean} - True if valid
 */
function validateLogin(email, password) {
    // Mock: In a real app, this would check against a database
    // For now, accept any valid email and password
    return validateEmail(email) && password.length >= 6;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if valid
 */
function validatePasswordStrength(password) {
    return password.length >= 8;
}

/**
 * Validate voter ID format
 * @param {string} voterId - Voter ID to validate
 * @returns {boolean} - True if valid
 */
function validateVoterId(voterId) {
    // Mock: Accept alphanumeric voter IDs
    return /^[A-Z0-9]{6,}$/.test(voterId.toUpperCase());
}

/**
 * Check if user exists (mock check)
 * @param {string} email - Email to check
 * @returns {boolean} - True if user exists
 */
function userExists(email) {
    return false;
}

/**
 * Show alert message to user
 * @param {string} message - Message to display
 * @param {string} type - Alert type ('success', 'error', 'warning', 'info')
 */
function showAlert(message, type = 'info') {
    const inline = document.getElementById('auth-error');
    if (inline) {
        inline.textContent = message;
        inline.classList.remove('hidden');
        inline.classList.remove('alert-success', 'alert-info', 'alert-warning', 'alert-error');
        inline.classList.add(type === 'success' ? 'alert-success' : (type === 'warning' ? 'alert-warning' : 'alert-error'));
        if (type === 'success') {
            setTimeout(() => inline.classList.add('hidden'), 3000);
        }
        return;
    }

    // Fallback: floating alert
    let alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        document.body.insertBefore(alertContainer, document.body.firstChild);
        alertContainer.style.cssText = `position: fixed;top: 20px;right: 20px;z-index: 10000;width: auto;max-width: 400px;`;
    }

    const alert = document.createElement('div');
    alert.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'}`;
    alert.innerHTML = `<p>${message}</p>`;
    alertContainer.appendChild(alert);
    setTimeout(() => alert.remove(), 4000);
}
