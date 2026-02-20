// ============================================
// Voting Module
// ============================================

let candidates = [];
let selectedCandidate = null;
let hasVoted = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeVotingPage();
});

/**
 * Initialize voting page functionality
 */
function initializeVotingPage() {
    // Check if user is logged in
    const user = getUserSession();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Display user name
    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;

    // Check if user has already voted
    const voteStatus = checkIfUserVoted();
    if (voteStatus) {
        hasVoted = true;
        displayVotedStatus();
    }

    // Setup event listeners
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('submit-vote-btn').addEventListener('click', handleSubmitVote);
    document.getElementById('cancel-vote-btn').addEventListener('click', handleCancelVote);
    document.getElementById('confirm-vote-btn').addEventListener('click', handleConfirmVote);
    document.getElementById('cancel-confirm-btn').addEventListener('click', closeConfirmation);

    // Load candidates from API
    loadCandidatesFromAPI();
}

/**
 * Get user session from storage
 * @returns {Object|null} - User object or null if not logged in
 */
function getUserSession() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

/**
 * Check if user has already voted by checking storage
 * @returns {boolean} - True if user has voted
 */
function checkIfUserVoted() {
    const votedStatus = localStorage.getItem('hasVoted');
    return votedStatus === 'true';
}

/**
 * Get JWT token from localStorage
 * @returns {string|null} - JWT token or null if not exists
 */
function getJWT() {
    return localStorage.getItem('jwt');
}

/**
 * Display voted status message
 */
function displayVotedStatus() {
    document.getElementById('votes-remaining').textContent = '0';
    document.getElementById('voted-status').classList.remove('hidden');
    document.getElementById('submit-vote-btn').disabled = true;
    
    // Disable candidate selection
    const candidateCards = document.querySelectorAll('.candidate-card');
    candidateCards.forEach(card => {
        card.style.pointerEvents = 'none';
        card.style.opacity = '0.6';
    });
}

/**
 * Load candidates from API and display them
 */
function loadCandidatesFromAPI() {
    const jwt = getJWT();
    if (!jwt) {
        showAlert('Session expired. Please login again.', 'error');
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }

    fetch('/api/candidates', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        }
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        
        // Handle 401 Unauthorized
        if (res.status === 401) {
            handleUnauthorized();
            return;
        }
        
        if (!res.ok) {
            throw new Error(data.message || 'Failed to load candidates');
        }
        return data;
    })
    .then(data => {
        if (data && data.candidates) {
            candidates = data.candidates;
            renderCandidates();
        }
    })
    .catch(err => {
        console.error('Error loading candidates:', err);
        showAlert('Failed to load candidates: ' + err.message, 'error');
    });
}

/**
 * Render candidates to the DOM
 */
function renderCandidates() {
    const candidatesList = document.getElementById('candidates-list');
    candidatesList.innerHTML = '';

    candidates.forEach(candidate => {
        const card = document.createElement('article');
        card.className = 'candidate-card';
        card.setAttribute('data-candidate-id', candidate.id);

        card.innerHTML = `
            <div class="candidate-card-content">
                <div class="candidate-name">${candidate.name}</div>
                <div class="candidate-party">${candidate.party}</div>
                <button 
                    type="button"
                    class="btn btn-primary candidate-vote-btn"
                    data-candidate-id="${candidate.id}"
                    ${hasVoted ? 'disabled' : ''}
                >
                    Vote
                </button>
            </div>
        `;

        card.addEventListener('click', function(e) {
            if (!hasVoted && e.target.classList.contains('candidate-vote-btn')) {
                selectCandidate(candidate.id, candidate.name);
            }
        });

        candidatesList.appendChild(card);
    });
}

/**
 * Select a candidate
 * @param {number} candidateId - ID of selected candidate
 * @param {string} candidateName - Name of selected candidate
 */
function selectCandidate(candidateId, candidateName) {
    if (hasVoted) return;

    // Remove previous selection
    const previousSelected = document.querySelector('.candidate-card.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }

    // Select new candidate
    const selectedCard = document.querySelector(`[data-candidate-id="${candidateId}"]`);
    selectedCard.classList.add('selected');

    selectedCandidate = { id: candidateId, name: candidateName };
    document.getElementById('submit-vote-btn').disabled = false;
}

/**
 * Handle submit vote action
 */
function handleSubmitVote() {
    if (!selectedCandidate) {
        showAlert('Please select a candidate first', 'warning');
        return;
    }

    // Show confirmation modal
    document.getElementById('selected-candidate-name').textContent = selectedCandidate.name;
    document.getElementById('vote-confirmation').classList.remove('hidden');
}

/**
 * Handle confirm vote - Send vote to API
 */
function handleConfirmVote() {
    if (!selectedCandidate) {
        showAlert('Error: Invalid vote data', 'error');
        return;
    }

    const jwt = getJWT();
    if (!jwt) {
        showAlert('Session expired. Please login again.', 'error');
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }

    // Disable button to prevent double submission
    document.getElementById('confirm-vote-btn').disabled = true;

    // Send vote to API
    fetch('/api/vote', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            candidateId: selectedCandidate.id
        })
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        
        // Handle 401 Unauthorized
        if (res.status === 401) {
            handleUnauthorized();
            return;
        }
        
        if (!res.ok) {
            throw new Error(data.message || 'Failed to submit vote');
        }
        return data;
    })
    .then(() => {
        // Mark as voted in localStorage
        localStorage.setItem('hasVoted', 'true');
        
        // Close modal
        closeConfirmation();

        // Display success message
        document.getElementById('vote-confirmation').classList.add('hidden');
        document.getElementById('success-message').classList.remove('hidden');

        // Mark as voted
        hasVoted = true;
        displayVotedStatus();

        // Redirect to admin results page after 2 seconds
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 2000);
    })
    .catch(err => {
        console.error('Error submitting vote:', err);
        showAlert('Failed to submit vote: ' + err.message, 'error');
        // Re-enable button on error
        document.getElementById('confirm-vote-btn').disabled = false;
    });
}

/**
 * Handle cancel vote
 */
function handleCancelVote() {
    selectedCandidate = null;
    document.querySelector('.candidate-card.selected')?.classList.remove('selected');
    document.getElementById('submit-vote-btn').disabled = true;
}

/**
 * Close confirmation modal
 */
function closeConfirmation() {
    document.getElementById('vote-confirmation').classList.add('hidden');
}

/**
 * Handle logout - Clear all session data
 */
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all stored data
        sessionStorage.removeItem('user');
        localStorage.removeItem('jwt');
        localStorage.removeItem('hasVoted');
        window.location.href = 'index.html';
    }
}

/**
 * Handle 401 Unauthorized errors - Clear data and redirect to login
 */
function handleUnauthorized() {
    // Clear stored tokens
    localStorage.removeItem('jwt');
    sessionStorage.removeItem('user');
    showAlert('Session expired. Please login again.', 'error');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

/**
 * Show alert message to user
 * @param {string} message - Message to display
 * @param {string} type - Alert type ('success', 'error', 'warning', 'info')
 */
function showAlert(message, type = 'info') {
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
            max-width: 400px;
        `;
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<p>${message}</p>`;

    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 4000);
}
