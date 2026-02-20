// ============================================
// Admin Module
// ============================================

let candidates = [];
let isVotingActive = true;
let refreshInterval = null;
let autoRefreshActive = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPage();
});

/**
 * Initialize admin page functionality
 */
function initializeAdminPage() {
    // Check JWT token and admin role
    const jwt = getJWT();
    const user = getUserSession();
    
    // If no JWT or user not admin, show access denied
    if (!jwt || !user || user.role !== 'admin') {
        showAccessDenied();
        return;
    }

    // Display admin info
    displayAdminInfo();

    // Load candidates from API
    loadCandidatesFromAPI();

    // Load and display results
    loadResults();

    // Setup event listeners
    document.getElementById('admin-logout-btn').addEventListener('click', handleAdminLogout);
    document.getElementById('refresh-results-btn').addEventListener('click', toggleAutoRefresh);
    document.getElementById('export-results-btn').addEventListener('click', exportResults);
    document.getElementById('start-voting-btn').addEventListener('click', startVoting);
    document.getElementById('end-voting-btn').addEventListener('click', endVoting);
}

/**
 * Get JWT token from localStorage
 * @returns {string|null} - JWT token or null if not exists
 */
function getJWT() {
    return localStorage.getItem('jwt');
}

/**
 * Show access denied message
 */
function showAccessDenied() {
    document.getElementById('access-denied').classList.remove('hidden');
    document.getElementById('admin-content').style.display = 'none';
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
 * Load candidates from API
 */
function loadCandidatesFromAPI() {
    showLoading();
    const jwt = getJWT();
    if (!jwt) {
        hideLoading();
        showMessage('Session expired. Please login again.', 'error');
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
            showMessage('Candidates loaded successfully', 'success', 2000);
        }
    })
    .catch(err => {
        console.error('Error loading candidates:', err);
        showMessage('Failed to load candidates: ' + err.message, 'error');
    })
    .finally(() => {
        hideLoading();
    });
}

/**
 * Load and display voting results
 */
function loadResults() {
    // If no candidates loaded yet, use empty array
    if (candidates.length === 0) {
        displayResults([]);
        return;
    }
    
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    
    // Update total votes
    const totalVotes = votes.length;
    document.getElementById('total-votes').textContent = totalVotes;

    // Calculate vote counts
    const voteCounts = {};
    votes.forEach(vote => {
        voteCounts[vote.candidateId] = (voteCounts[vote.candidateId] || 0) + 1;
    });

    // Create candidate results with vote data
    const candidatesWithVotes = candidates.map(candidate => ({
        ...candidate,
        actualVotes: voteCounts[candidate.id] || 0,
        percentage: totalVotes > 0 ? ((voteCounts[candidate.id] || 0) / totalVotes * 100).toFixed(1) : 0
    })).sort((a, b) => b.actualVotes - a.actualVotes);

    displayResults(candidatesWithVotes);
}

/**
 * Display results in table format
 */
function displayResults(candidatesWithVotes) {
    const tableBody = document.getElementById('results-table-body');
    tableBody.innerHTML = '';

    if (candidatesWithVotes.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">No candidates available</td></tr>';
        return;
    }

    candidatesWithVotes.forEach(candidate => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${candidate.name}</strong></td>
            <td>${candidate.party}</td>
            <td><span style="font-weight: 600; color: #007bff; font-size: 1.1rem;">${candidate.actualVotes}</span></td>
            <td>${candidate.percentage}%</td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Toggle auto-refresh of results
 */
function toggleAutoRefresh() {
    const btn = document.getElementById('refresh-results-btn');
    
    if (!autoRefreshActive) {
        // Start auto-refresh
        autoRefreshActive = true;
        btn.textContent = '⏸ Stop Auto-Refresh';
        btn.style.backgroundColor = '#dc3545';
        refreshResults();
        refreshInterval = setInterval(refreshResults, 5000);
        showMessage('✓ Auto-refresh enabled (every 5 seconds)', 'success', 3000);
    } else {
        // Stop auto-refresh
        autoRefreshActive = false;
        btn.textContent = '🔄 Auto-Refresh';
        btn.style.backgroundColor = '';
        clearInterval(refreshInterval);
        showMessage('✓ Auto-refresh disabled', 'info', 3000);
    }
}

/**
 * Refresh results manually
 */
function refreshResults() {
    loadResults();
    if (autoRefreshActive) {
        console.log('Results refreshed at', new Date().toLocaleTimeString());
    }
}

/**
 * Export results to JSON
 */
function exportResults() {
    if (candidates.length === 0) {
        showMessage('⚠️ No candidates data to export', 'warning', 3000);
        return;
    }

    disableButton('export-results-btn');

    try {
        const votes = JSON.parse(localStorage.getItem('votes')) || [];
        const voteCounts = {};
        votes.forEach(vote => {
            voteCounts[vote.candidateId] = (voteCounts[vote.candidateId] || 0) + 1;
        });

        const resultsData = {
            exportDate: new Date().toISOString(),
            totalVotes: votes.length,
            candidates: candidates.map(candidate => ({
                ...candidate,
                actualVotes: voteCounts[candidate.id] || 0,
                percentage: votes.length > 0 ? ((voteCounts[candidate.id] || 0) / votes.length * 100).toFixed(1) : 0
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

        showMessage('✓ Results exported successfully', 'success', 3000);
    } catch (err) {
        showMessage('✗ Failed to export results: ' + err.message, 'error');
    } finally {
        enableButton('export-results-btn');
    }
}

/**
 * Start voting
 */
function startVoting() {
    if (isVotingActive) {
        showMessage('⚠️ Voting is already active', 'warning', 3000);
        return;
    }

    disableButton('start-voting-btn');

    try {
        isVotingActive = true;
        document.getElementById('voting-status').textContent = 'Active';
        document.getElementById('voting-status').style.color = '#28a745';
        showMessage('✓ Voting has been started', 'success', 3000);
    } catch (err) {
        showMessage('✗ Failed to start voting: ' + err.message, 'error');
    } finally {
        enableButton('start-voting-btn');
    }
}

/**
 * End voting
 */
function endVoting() {
    if (!isVotingActive) {
        showMessage('⚠️ Voting is already closed', 'warning', 3000);
        return;
    }

    if (confirm('Are you sure you want to end voting? This cannot be undone.')) {
        disableButton('end-voting-btn');

        try {
            isVotingActive = false;
            document.getElementById('voting-status').textContent = 'Closed';
            document.getElementById('voting-status').style.color = '#dc3545';
            showMessage('✓ Voting has been ended', 'success', 3000);
        } catch (err) {
            showMessage('✗ Failed to end voting: ' + err.message, 'error');
        } finally {
            enableButton('end-voting-btn');
        }
    }
}

/**
 * View candidate details (mock function)
 * @param {number} candidateId - Candidate ID
 */
function viewCandidateDetails(candidateId) {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
        const votes = JSON.parse(localStorage.getItem('votes')) || [];
        const candidateVotes = votes.filter(v => v.candidateId === candidateId);
        alert(`Candidate: ${candidate.name}\nParty: ${candidate.party}\nVotes Received: ${candidateVotes.length}`);
    }
}

/**
 * Handle 401 Unauthorized errors - Clear data and redirect to login
 */
function handleUnauthorized() {
    localStorage.removeItem('jwt');
    sessionStorage.removeItem('user');
    showMessage('✗ Session expired. Admin access revoked.', 'error');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

/**
 * Handle admin logout
 */
function handleAdminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        disableButton('admin-logout-btn');
        sessionStorage.removeItem('user');
        localStorage.removeItem('jwt');
        localStorage.removeItem('hasVoted');
        clearInterval(refreshInterval);
        showMessage('✓ Logged out successfully', 'success', 1500);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

/**
 * Show alert message with auto-dismiss
 * @param {string} message - Message to display
 * @param {string} type - Alert type ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duration in ms (0 = manual close only)
 */
function showMessage(message, type = 'info', duration = 4000) {
    const alertDiv = document.getElementById('admin-alert');
    const alertText = document.getElementById('admin-alert-text');
    
    // Remove existing animation class to restart it
    alertDiv.classList.add('hidden');
    
    // Update alert content
    alertText.textContent = message;
    alertDiv.className = `admin-alert alert alert-${type}`;
    
    // Show alert
    setTimeout(() => {
        alertDiv.classList.remove('hidden');
    }, 10);
    
    // Auto-hide if duration is set
    if (duration > 0) {
        setTimeout(() => {
            closeAlert();
        }, duration);
    }
}

/**
 * Close alert
 */
function closeAlert() {
    const alertDiv = document.getElementById('admin-alert');
    alertDiv.classList.add('hidden');
}

/**
 * Show loading spinner
 */
function showLoading() {
    document.getElementById('loading-spinner').classList.remove('hidden');
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    document.getElementById('loading-spinner').classList.add('hidden');
}

/**
 * Disable button and show loading state
 * @param {string} btnId - Button ID
 */
function disableButton(btnId) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.disabled = true;
        btn.classList.add('loading');
    }
}

/**
 * Enable button and remove loading state
 * @param {string} btnId - Button ID
 */
function enableButton(btnId) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.disabled = false;
        btn.classList.remove('loading');
    }
}
