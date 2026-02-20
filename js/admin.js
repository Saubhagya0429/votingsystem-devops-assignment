// ============================================
// Admin Module
// ============================================

// Mock candidates data
const CANDIDATES = [
    { id: 1, name: 'John Smith', party: 'Democratic Party', votes: 1250 },
    { id: 2, name: 'Sarah Johnson', party: 'Republican Party', votes: 980 },
    { id: 3, name: 'Michael Chen', party: 'Independent', votes: 650 },
    { id: 4, name: 'Emma Williams', party: 'Green Party', votes: 420 },
    { id: 5, name: 'David Martinez', party: 'Libertarian Party', votes: 310 }
];

let isVotingActive = true;
let refreshInterval = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPage();
});

/**
 * Initialize admin page functionality
 */
function initializeAdminPage() {
    // Check if user is logged in as admin
    const user = getUserSession();
    if (!user || user.role !== 'admin') {
        // For demo purposes, create an admin user
        createAdminSession();
    } else {
        displayAdminInfo();
    }

    // Load and display results
    loadResults();

    // Setup event listeners
    document.getElementById('admin-logout-btn').addEventListener('click', handleAdminLogout);
    document.getElementById('refresh-results-btn').addEventListener('click', refreshResults);
    document.getElementById('export-results-btn').addEventListener('click', exportResults);
    document.getElementById('start-voting-btn').addEventListener('click', startVoting);
    document.getElementById('end-voting-btn').addEventListener('click', endVoting);

    // Auto-refresh results every 5 seconds
    refreshInterval = setInterval(refreshResults, 5000);
}

/**
 * Create admin session (for demo purposes)
 */
function createAdminSession() {
    const admin = {
        id: 'admin-' + Date.now(),
        name: 'Administrator',
        email: 'admin@voting.sys',
        role: 'admin'
    };

    sessionStorage.setItem('user', JSON.stringify(admin));
    displayAdminInfo();
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
 * Display admin information
 */
function displayAdminInfo() {
    const user = getUserSession();
    if (user) {
        document.getElementById('admin-name').textContent = `${user.name} (Admin)`;
    }
}

/**
 * Load and display voting results
 */
function loadResults() {
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    
    // Update total votes
    const totalVotes = votes.length;
    document.getElementById('total-votes').textContent = totalVotes;

    // Calculate vote counts
    const voteCounts = {};
    votes.forEach(vote => {
        voteCounts[vote.candidateId] = (voteCounts[vote.candidateId] || 0) + 1;
    });

    // Display results for each candidate
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    const candidatesWithVotes = CANDIDATES.map(candidate => ({
        ...candidate,
        actualVotes: voteCounts[candidate.id] || 0,
        percentage: totalVotes > 0 ? ((voteCounts[candidate.id] || 0) / totalVotes * 100).toFixed(1) : 0
    })).sort((a, b) => b.actualVotes - a.actualVotes);

    candidatesWithVotes.forEach(candidate => {
        const resultCard = document.createElement('article');
        resultCard.className = 'result-card';

        resultCard.innerHTML = `
            <div class="result-card-header">
                <div>
                    <div class="result-card-name">${candidate.name}</div>
                    <div class="result-card-party">${candidate.party}</div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="viewCandidateDetails(${candidate.id})">View</button>
            </div>
            <div class="result-card-votes">
                <p><strong>Total Votes:</strong> <span class="vote-count">${candidate.actualVotes}</span></p>
                <p><strong>Percentage:</strong> ${candidate.percentage}%</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${candidate.percentage}%">
                        ${candidate.percentage > 5 ? candidate.percentage + '%' : ''}
                    </div>
                </div>
            </div>
        `;

        resultsContainer.appendChild(resultCard);
    });
}

/**
 * Refresh results
 */
function refreshResults() {
    loadResults();
    showMessage('Results refreshed', 'info');
}

/**
 * Export results to JSON
 */
function exportResults() {
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    const resultsData = {
        exportDate: new Date().toISOString(),
        totalVotes: votes.length,
        candidates: CANDIDATES.map(candidate => ({
            ...candidate,
            actualVotes: votes.filter(v => v.candidateId === candidate.id).length
        }))
    };

    const dataStr = JSON.stringify(resultsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voting-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showMessage('Results exported successfully', 'success');
}

/**
 * Start voting
 */
function startVoting() {
    if (isVotingActive) {
        showMessage('Voting is already active', 'warning');
        return;
    }

    isVotingActive = true;
    document.getElementById('voting-status').textContent = 'Active';
    document.getElementById('voting-status').style.color = '#28a745';
    showMessage('Voting has been started', 'success');
}

/**
 * End voting
 */
function endVoting() {
    if (!isVotingActive) {
        showMessage('Voting is already closed', 'warning');
        return;
    }

    if (confirm('Are you sure you want to end voting? This cannot be undone.')) {
        isVotingActive = false;
        document.getElementById('voting-status').textContent = 'Closed';
        document.getElementById('voting-status').style.color = '#dc3545';
        showMessage('Voting has been ended', 'success');
    }
}

/**
 * View candidate details (mock function)
 * @param {number} candidateId - Candidate ID
 */
function viewCandidateDetails(candidateId) {
    const candidate = CANDIDATES.find(c => c.id === candidateId);
    if (candidate) {
        const votes = JSON.parse(localStorage.getItem('votes')) || [];
        const candidateVotes = votes.filter(v => v.candidateId === candidateId);
        alert(`Candidate: ${candidate.name}\nParty: ${candidate.party}\nVotes Received: ${candidateVotes.length}`);
    }
}

/**
 * Handle admin logout
 */
function handleAdminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('user');
        clearInterval(refreshInterval);
        window.location.href = 'index.html';
    }
}

/**
 * Show message to admin
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success', 'error', 'warning', 'info')
 */
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('admin-message');
    const messageText = document.getElementById('admin-message-text');

    // Update classes
    messageDiv.className = `alert alert-${type}`;
    messageText.textContent = message;

    // Show message
    messageDiv.classList.remove('hidden');

    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 3000);
}
