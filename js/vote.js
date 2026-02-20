// ============================================
// Voting Module
// ============================================

// Mock candidates data
const CANDIDATES = [
    { id: 1, name: 'John Smith', party: 'Democratic Party', votes: 1250 },
    { id: 2, name: 'Sarah Johnson', party: 'Republican Party', votes: 980 },
    { id: 3, name: 'Michael Chen', party: 'Independent', votes: 650 },
    { id: 4, name: 'Emma Williams', party: 'Green Party', votes: 420 },
    { id: 5, name: 'David Martinez', party: 'Libertarian Party', votes: 310 }
];

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
    if (checkIfVoted(user.id)) {
        hasVoted = true;
        displayVotedStatus();
    }

    // Load candidates
    loadCandidates();

    // Setup event listeners
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('submit-vote-btn').addEventListener('click', handleSubmitVote);
    document.getElementById('cancel-vote-btn').addEventListener('click', handleCancelVote);
    document.getElementById('confirm-vote-btn').addEventListener('click', handleConfirmVote);
    document.getElementById('cancel-confirm-btn').addEventListener('click', closeConfirmation);
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
 * Check if user has already voted
 * @param {number} userId - User ID
 * @returns {boolean} - True if user has voted
 */
function checkIfVoted(userId) {
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    return votes.some(vote => vote.userId === userId);
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
 * Load candidates and display them
 */
function loadCandidates() {
    const candidatesList = document.getElementById('candidates-list');
    candidatesList.innerHTML = '';

    CANDIDATES.forEach(candidate => {
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
 * Handle confirm vote
 */
function handleConfirmVote() {
    const user = getUserSession();

    if (!selectedCandidate || !user) {
        showAlert('Error: Invalid vote data', 'error');
        return;
    }

    // Record the vote
    const vote = {
        userId: user.id,
        userEmail: user.email,
        candidateId: selectedCandidate.id,
        candidateName: selectedCandidate.name,
        timestamp: new Date().toISOString()
    };

    // Store vote in localStorage
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    votes.push(vote);
    localStorage.setItem('votes', JSON.stringify(votes));

    // Update candidate vote count
    const updatedCandidates = CANDIDATES.map(candidate => {
        if (candidate.id === selectedCandidate.id) {
            return { ...candidate, votes: candidate.votes + 1 };
        }
        return candidate;
    });

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
 * Handle logout
 */
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    }
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
