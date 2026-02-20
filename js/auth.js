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

    // Simulate API call
    console.log('Login attempt:', { email, password });

    // Store user session (in real app, this would be from server)
    const user = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0],
        role: 'voter'
    };

    // Check if user exists and password is correct (mock validation)
    if (validateLogin(email, password)) {
        sessionStorage.setItem('user', JSON.stringify(user));
        showAlert('Login successful! Redirecting...', 'success');

        // Redirect to voting page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'vote.html';
        }, 1500);
    } else {
        showAlert('Invalid email or password', 'error');
    }
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
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const voterId = document.getElementById('register-voter-id').value;

    // Validate input
    if (!name || !email || !password || !confirmPassword || !voterId) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    // Validate password strength
    if (!validatePasswordStrength(password)) {
        showAlert('Password must be at least 8 characters long', 'error');
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    // Validate voter ID format
    if (!validateVoterId(voterId)) {
        showAlert('Please enter a valid voter ID', 'error');
        return;
    }

    // Simulate API call to register user
    console.log('Registration attempt:', { name, email, voterId });

    // Mock - check if user already exists
    if (userExists(email)) {
        showAlert('Email already registered', 'error');
        return;
    }

    // Create new user
    const user = {
        id: Date.now(),
        name: name,
        email: email,
        voterId: voterId,
        role: 'voter'
    };

    // Store user session
    sessionStorage.setItem('user', JSON.stringify(user));
    showAlert('Registration successful! Redirecting...', 'success');

    // Redirect to voting page after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'vote.html';
    }, 1500);
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
    // Mock: In a real app, this would check against a database
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    return registeredUsers.some(user => user.email === email);
}

/**
 * Show alert message to user
 * @param {string} message - Message to display
 * @param {string} type - Alert type ('success', 'error', 'warning', 'info')
 */
function showAlert(message, type = 'info') {
    // Create alert element if it doesn't exist
    let alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        document.body.insertBefore(alertContainer, document.body.firstChild);
        alertContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            width: auto;
            max-width: 400px;
        `;
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<p>${message}</p>`;

    alertContainer.appendChild(alert);

    // Auto-remove alert after 4 seconds
    setTimeout(() => {
        alert.remove();
    }, 4000);
}
