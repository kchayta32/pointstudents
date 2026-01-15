// Main Application Logic
import { database, ref, set, get, push, onValue, update, remove } from './firebase-config.js';

// ============================================
// Initial Data - Groups
// ============================================
const initialGroups = {
    "1": { members: ["แนน", "นก", "เฟรช", "มา", "มี่", "ไอซ์"] },
    "2": { members: ["ตัน", "โรบอท", "พี", "ปาร์ม", "ดล"] },
    "3": { members: ["ต้า", "เขต", "เนย", "น้ำ", "หญิง", "โอ๊ค"] },
    "4": { members: ["ม่อน", "ปลื่ม", "บิ๊ก", "สตางค์"] },
    "5": { members: ["ซี", "กิด", "มอส"] },
    "6": { members: ["เอฟขนอม", "เน๊ะบางบ่อ", "ทิมนคร", "เกมส์สุราษฎร์", "เพลงสุพรรณ"] },
    "7": { members: ["เจ๋งซอยมังกร", "ปั๊บโป๊เตโต้", "แฟ้มลาซาล", "บูมบางแค", "แคร์บางคน", "อลัม"] },
    "8": { members: ["เซน", "บอส", "ปอย", "ปาย", "โบ้"] },
    "9": { members: ["โอ๊ต", "เต้", "โฟน", "เขต", "อาท", "ฟลุ๊ค"] },
    "10": { members: ["มิ้น", "กาญ", "เนย"] },
    "11": { members: ["บอส", "โต้", "น้อยหน่า", "จู้", "กี้", "พี่อาม"] },
    "12": { members: ["กิจ", "โอม"] }
};

// ============================================
// State
// ============================================
let groups = {};
let assignments = {};
let scoreChart = null;

// ============================================
// DOM Elements
// ============================================
const themeToggle = document.getElementById('themeToggle');
const addAssignmentBtn = document.getElementById('addAssignmentBtn');
const assignmentModal = document.getElementById('assignmentModal');
const scoreModal = document.getElementById('scoreModal');
const assignmentForm = document.getElementById('assignmentForm');
const scoreForm = document.getElementById('scoreForm');
const groupsGrid = document.getElementById('groupsGrid');
const assignmentsGrid = document.getElementById('assignmentsGrid');
const rankingTableBody = document.getElementById('rankingTableBody');
const viewBtns = document.querySelectorAll('.view-btn');

// ============================================
// Theme Toggle
// ============================================
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.dataset.theme || 'dark';
    document.body.dataset.theme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.body.dataset.theme);
});

// Load saved theme - default to light
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.dataset.theme = savedTheme;

// ============================================
// View Toggle
// ============================================
viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const view = btn.dataset.view;
        if (view === 'list') {
            groupsGrid.classList.add('list-view');
        } else {
            groupsGrid.classList.remove('list-view');
        }
    });
});

// ============================================
// Tab Navigation
// ============================================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        // Update buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `tab-${targetTab}`) {
                content.classList.add('active');
            }
        });

        // Reinitialize chart when switching to leaderboard tab
        if (targetTab === 'leaderboard' && scoreChart) {
            setTimeout(() => {
                scoreChart.resize();
            }, 100);
        }
    });
});

// ============================================
// Modal Controls
// ============================================
addAssignmentBtn.addEventListener('click', () => {
    assignmentModal.classList.add('active');
});

document.getElementById('closeAssignmentModal').addEventListener('click', () => {
    assignmentModal.classList.remove('active');
    assignmentForm.reset();
});

document.getElementById('cancelAssignment').addEventListener('click', () => {
    assignmentModal.classList.remove('active');
    assignmentForm.reset();
});

document.getElementById('closeScoreModal').addEventListener('click', () => {
    scoreModal.classList.remove('active');
    scoreForm.reset();
});

document.getElementById('cancelScore').addEventListener('click', () => {
    scoreModal.classList.remove('active');
    scoreForm.reset();
});

// Close modal on outside click
[assignmentModal, scoreModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// ============================================
// Firebase Operations
// ============================================
async function initializeData() {
    try {
        console.log('Initializing Firebase data...');
        const coursesRef = ref(database, 'courses/CPE5010');
        const snapshot = await get(coursesRef);

        if (!snapshot.exists()) {
            // Initialize course data
            console.log('No existing data, initializing...');
            await set(coursesRef, {
                name: "การออกแบบและพัฒนาเกม",
                code: "CPE5010 (001) 47/4734",
                groups: initialGroups,
                assignments: {}
            });
            console.log('Initialized course data');
        } else {
            console.log('Data exists, loading...');
        }

        // Listen for data changes
        listenToData();
    } catch (error) {
        console.error('Firebase initialization error:', error);
        showNotification('ไม่สามารถเชื่อมต่อ Firebase ได้', 'error');

        // Use local data as fallback
        groups = initialGroups;
        renderGroups();
    }
}

function listenToData() {
    // Listen to groups
    const groupsRef = ref(database, 'courses/CPE5010/groups');
    onValue(groupsRef, (snapshot) => {
        groups = snapshot.val() || initialGroups;
        console.log('Groups loaded:', Object.keys(groups).length);
        renderGroups();
        updateLeaderboard();
    });

    // Listen to assignments
    const assignmentsRef = ref(database, 'courses/CPE5010/assignments');
    onValue(assignmentsRef, (snapshot) => {
        assignments = snapshot.val() || {};
        console.log('Assignments loaded:', Object.keys(assignments).length);
        renderAssignments();
        renderGroups(); // Re-render groups with updated assignments
        updateLeaderboard();
    });
}

// ============================================
// Assignment Form Submit
// ============================================
assignmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const name = document.getElementById('assignmentName').value;
        const maxScore = parseInt(document.getElementById('maxScore').value);
        const dueDate = document.getElementById('dueDate').value;

        console.log('Saving assignment:', { name, maxScore, dueDate });

        const assignmentsRef = ref(database, 'courses/CPE5010/assignments');
        const newAssignmentRef = push(assignmentsRef);

        await set(newAssignmentRef, {
            name,
            maxScore,
            dueDate: dueDate || null,
            createdAt: new Date().toISOString()
        });

        console.log('Assignment saved successfully!');

        assignmentModal.classList.remove('active');
        assignmentForm.reset();

        showNotification('เพิ่มงานใหม่สำเร็จ!', 'success');
    } catch (error) {
        console.error('Error saving assignment:', error);
        showNotification('เกิดข้อผิดพลาด: ' + error.message, 'error');
    }
});

// ============================================
// Score Form Submit
// ============================================
scoreForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const groupId = document.getElementById('currentGroupId').value;
        const assignmentId = document.getElementById('assignmentFilter').value;

        if (!assignmentId) {
            showNotification('กรุณาเลือกงานที่จะบันทึก', 'error');
            return;
        }

        const score = parseFloat(document.getElementById('scoreValue').value) || 0;
        const link = document.getElementById('submissionLink').value;
        const status = document.getElementById('submissionStatus').value;
        const submissionDateTime = document.getElementById('submissionDateTime').value;

        // Convert local datetime to ISO string
        const submittedAt = submissionDateTime
            ? new Date(submissionDateTime).toISOString()
            : new Date().toISOString();

        console.log('Saving score:', { groupId, assignmentId, score, status, submittedAt });

        // Update single assignment in Firebase
        const submissionRef = ref(database, `courses/CPE5010/groups/${groupId}/submissions/${assignmentId}`);
        await set(submissionRef, {
            score,
            status,
            link: link || null,
            submittedAt
        });

        console.log('Score saved successfully!');

        scoreModal.classList.remove('active');
        scoreForm.reset();
        document.getElementById('scoreSingleEntry').style.display = 'none';
        document.getElementById('assignmentFilter').value = '';
        currentGroupForScore = null;

        showNotification('บันทึกคะแนนสำเร็จ!', 'success');
    } catch (error) {
        console.error('Error saving score:', error);
        showNotification('เกิดข้อผิดพลาด: ' + error.message, 'error');
    }
});

// ============================================
// Render Functions
// ============================================
function renderGroups() {
    if (!groupsGrid) return;

    groupsGrid.innerHTML = '';

    const sortedGroups = Object.entries(groups)
        .map(([id, group]) => ({
            id,
            ...group,
            totalScore: calculateGroupScore(group)
        }))
        .sort((a, b) => parseInt(a.id) - parseInt(b.id));

    sortedGroups.forEach(group => {
        const card = createGroupCard(group);
        groupsGrid.appendChild(card);
    });
}

function createGroupCard(group) {
    const card = document.createElement('div');
    card.className = 'group-card';
    card.onclick = () => openScoreModal(group.id);

    const totalScore = group.totalScore;
    const grade = getGrade(totalScore);
    const completionStatus = getCompletionStatus(group);

    card.innerHTML = `
        <div class="group-header">
            <div class="group-number">
                <div class="group-badge">${group.id}</div>
                <span class="group-title">กลุ่มที่ ${group.id}</span>
            </div>
            <div class="group-score">
                <div class="group-score-value">${totalScore.toFixed(1)}%</div>
                <div class="group-score-label">คะแนนรวม</div>
            </div>
        </div>
        <div class="group-members">
            ${group.members.map(m => `<span class="member-tag">${m}</span>`).join('')}
        </div>
        <div class="group-status">
            <span class="status-dot ${completionStatus.isComplete ? 'submitted' : 'not_submitted'}"></span>
            <span>${completionStatus.isComplete ? 'ส่งครบแล้ว' : `ยังไม่ครบ (${completionStatus.submitted}/${completionStatus.total})`}</span>
        </div>
        ${renderGroupAssignments(group)}
    `;

    return card;
}

function renderGroupAssignments(group) {
    if (Object.keys(assignments).length === 0) {
        return '<div class="group-assignments"><div class="no-data">ยังไม่มีงาน</div></div>';
    }

    let html = '<div class="group-assignments">';

    Object.entries(assignments).forEach(([assignmentId, assignment]) => {
        const submission = group.submissions?.[assignmentId];
        const score = submission?.score ?? '-';
        const maxScore = assignment.maxScore;
        const scoreClass = getScoreClass(score, maxScore);
        const submittedAt = submission?.submittedAt ? formatDateTime(submission.submittedAt) : '';
        const status = submission?.status || 'not_submitted';
        const statusText = getStatusText(status);
        const hasSubmission = submission?.score !== undefined;

        html += `
            <div class="assignment-row">
                <div class="assignment-info">
                    <div class="assignment-name-row">
                        <span class="assignment-name">${assignment.name}</span>
                        <span class="assignment-status-badge ${status}">${hasSubmission ? statusText : 'ยังไม่ส่ง'}</span>
                    </div>
                    ${submittedAt ? `<div class="submission-time"><span class="time-icon">🕐</span> ${submittedAt}</div>` : ''}
                </div>
                <span class="assignment-score ${scoreClass}">${score}/${maxScore}</span>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

// Get completion status helper
function getCompletionStatus(group) {
    const totalAssignments = Object.keys(assignments).length;
    if (totalAssignments === 0) return { isComplete: false, submitted: 0, total: 0 };

    let submitted = 0;
    Object.keys(assignments).forEach(assignmentId => {
        const submission = group.submissions?.[assignmentId];
        if (submission?.score !== undefined) {
            submitted++;
        }
    });

    return {
        isComplete: submitted === totalAssignments,
        submitted,
        total: totalAssignments
    };
}

function renderAssignments() {
    if (!assignmentsGrid) return;

    if (Object.keys(assignments).length === 0) {
        assignmentsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">ยังไม่มีงาน คลิก "เพิ่มงาน" เพื่อเริ่มต้น</div>
            </div>
        `;
        return;
    }

    assignmentsGrid.innerHTML = '';

    Object.entries(assignments).forEach(([id, assignment]) => {
        const stats = calculateAssignmentStats(id);
        const card = document.createElement('div');
        card.className = 'assignment-card';

        card.innerHTML = `
            <div class="assignment-header">
                <div class="assignment-title">${assignment.name}</div>
                <div class="assignment-max-score">${assignment.maxScore} คะแนน</div>
            </div>
            ${assignment.dueDate ? `
                <div class="assignment-due">
                    📅 กำหนดส่ง: ${formatDate(assignment.dueDate)}
                </div>
            ` : ''}
            <div class="assignment-stats">
                <div class="stat-item">
                    <div class="stat-value">${stats.submitted}</div>
                    <div class="stat-label">ส่งแล้ว</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.pending}</div>
                    <div class="stat-label">รอส่ง</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.average.toFixed(1)}</div>
                    <div class="stat-label">คะแนนเฉลี่ย</div>
                </div>
            </div>
        `;

        assignmentsGrid.appendChild(card);
    });
}

// ============================================
// Leaderboard
// ============================================
function updateLeaderboard() {
    const rankings = Object.entries(groups)
        .map(([id, group]) => ({
            id,
            name: `กลุ่ม ${id}`,
            members: group.members,
            score: calculateGroupScore(group)
        }))
        .sort((a, b) => b.score - a.score);

    // Update podium
    updatePodium(rankings);

    // Update table
    updateRankingTable(rankings);

    // Update chart
    updateChart(rankings);
}

function updatePodium(rankings) {
    const podiumPositions = [
        { elem: document.querySelector('#podium1'), rank: 0 },
        { elem: document.querySelector('#podium2'), rank: 1 },
        { elem: document.querySelector('#podium3'), rank: 2 }
    ];

    podiumPositions.forEach(({ elem, rank }) => {
        if (!elem) return;

        const data = rankings[rank];
        if (data) {
            elem.querySelector('.podium-name').textContent = data.name;
            elem.querySelector('.podium-score').textContent = `${data.score.toFixed(1)}%`;
        } else {
            elem.querySelector('.podium-name').textContent = '-';
            elem.querySelector('.podium-score').textContent = '0%';
        }
    });
}

function updateRankingTable(rankings) {
    if (!rankingTableBody) return;

    rankingTableBody.innerHTML = rankings.map((item, index) => {
        const grade = getGrade(item.score);
        const rankBadgeClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'default';
        const gradeBadgeClass = getGradeBadgeClass(grade);

        return `
            <tr>
                <td><span class="rank-badge ${rankBadgeClass}">${index + 1}</span></td>
                <td>${item.name}</td>
                <td><strong>${item.score.toFixed(1)}%</strong></td>
                <td><span class="grade-badge ${gradeBadgeClass}">${grade}</span></td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${item.score}%"></div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function updateChart(rankings) {
    const ctx = document.getElementById('scoreChart');
    if (!ctx) return;

    const labels = rankings.map(r => r.name);
    const data = rankings.map(r => r.score);
    const colors = rankings.map((_, i) => {
        if (i === 0) return 'rgba(251, 191, 36, 0.8)';
        if (i === 1) return 'rgba(148, 163, 184, 0.8)';
        if (i === 2) return 'rgba(205, 127, 50, 0.8)';
        return 'rgba(124, 58, 237, 0.6)';
    });

    if (scoreChart) {
        scoreChart.data.labels = labels;
        scoreChart.data.datasets[0].data = data;
        scoreChart.data.datasets[0].backgroundColor = colors;
        scoreChart.update();
    } else {
        scoreChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'คะแนนรวม (%)',
                    data,
                    backgroundColor: colors,
                    borderColor: colors.map(c => c.replace('0.6', '1').replace('0.8', '1')),
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 15, 26, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(124, 58, 237, 0.5)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: (context) => `คะแนน: ${context.raw.toFixed(1)}%`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            callback: (value) => value + '%'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
}

// ============================================
// Score Modal
// ============================================
let currentGroupForScore = null;

function openScoreModal(groupId) {
    const group = groups[groupId];
    if (!group) return;

    currentGroupForScore = group;

    document.getElementById('modalGroupName').textContent = `กลุ่ม ${groupId}`;
    document.getElementById('currentGroupId').value = groupId;

    // Display members
    const membersDisplay = document.getElementById('modalMembers');
    membersDisplay.innerHTML = group.members.map(m =>
        `<span class="member-tag">${m}</span>`
    ).join('');

    // Populate assignment filter dropdown
    const assignmentFilter = document.getElementById('assignmentFilter');
    const scoreSingleEntry = document.getElementById('scoreSingleEntry');

    // Reset
    scoreSingleEntry.style.display = 'none';
    document.getElementById('scoreValue').value = '';
    document.getElementById('submissionLink').value = '';
    document.getElementById('submissionDateTime').value = '';
    document.getElementById('submissionStatus').value = 'submitted';

    if (Object.keys(assignments).length === 0) {
        assignmentFilter.innerHTML = '<option value="">ยังไม่มีงาน กรุณาเพิ่มงานก่อน</option>';
        assignmentFilter.disabled = true;
    } else {
        assignmentFilter.disabled = false;
        assignmentFilter.innerHTML = '<option value="">-- เลือกงาน --</option>' +
            Object.entries(assignments).map(([id, assignment]) => {
                const submission = group.submissions?.[id];
                const hasScore = submission?.score !== undefined;
                const statusIcon = hasScore ? '✓' : '';
                return `<option value="${id}">${assignment.name} ${statusIcon}</option>`;
            }).join('');
    }

    scoreModal.classList.add('active');
}

// Assignment filter change handler
document.getElementById('assignmentFilter').addEventListener('change', (e) => {
    const assignmentId = e.target.value;
    const scoreSingleEntry = document.getElementById('scoreSingleEntry');

    if (!assignmentId || !currentGroupForScore) {
        scoreSingleEntry.style.display = 'none';
        return;
    }

    const assignment = assignments[assignmentId];
    const submission = currentGroupForScore.submissions?.[assignmentId];

    // Show the score entry section
    scoreSingleEntry.style.display = 'block';

    // Update max score display
    document.getElementById('maxScoreDisplay').textContent = `/ ${assignment.maxScore}`;
    document.getElementById('scoreValue').max = assignment.maxScore;

    // Fill in existing data if available
    if (submission) {
        document.getElementById('scoreValue').value = submission.score ?? '';
        document.getElementById('submissionLink').value = submission.link || '';
        document.getElementById('submissionStatus').value = submission.status || 'submitted';

        // Format datetime for input (local timezone)
        if (submission.submittedAt) {
            const date = new Date(submission.submittedAt);
            // Convert to local datetime string for input
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
            document.getElementById('submissionDateTime').value = localDateTime;
        }
    } else {
        // Set default datetime to now
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        document.getElementById('submissionDateTime').value = localDateTime;
        document.getElementById('scoreValue').value = '';
        document.getElementById('submissionLink').value = '';
        document.getElementById('submissionStatus').value = 'submitted';
    }
});

// ============================================
// Utility Functions
// ============================================
function calculateGroupScore(group) {
    if (Object.keys(assignments).length === 0) return 0;

    let totalScore = 0;
    let totalMaxScore = 0;

    Object.entries(assignments).forEach(([id, assignment]) => {
        const submission = group.submissions?.[id];
        if (submission) {
            totalScore += submission.score || 0;
        }
        totalMaxScore += assignment.maxScore;
    });

    if (totalMaxScore === 0) return 0;
    return (totalScore / totalMaxScore) * 100;
}

function calculateAssignmentStats(assignmentId) {
    let submitted = 0;
    let pending = 0;
    let totalScore = 0;
    let scoreCount = 0;

    Object.values(groups).forEach(group => {
        const submission = group.submissions?.[assignmentId];
        if (submission && submission.status !== 'not_submitted') {
            submitted++;
            if (submission.score !== undefined) {
                totalScore += submission.score;
                scoreCount++;
            }
        } else {
            pending++;
        }
    });

    return {
        submitted,
        pending,
        average: scoreCount > 0 ? totalScore / scoreCount : 0
    };
}

function getGrade(score) {
    if (score >= 80) return 'A';
    if (score >= 75) return 'A-';
    if (score >= 70) return 'B+';
    if (score >= 65) return 'B';
    if (score >= 60) return 'B-';
    if (score >= 55) return 'C+';
    if (score >= 50) return 'C';
    if (score >= 45) return 'D+';
    if (score >= 40) return 'D';
    return 'F';
}

function getGradeBadgeClass(grade) {
    if (grade.startsWith('A')) return 'grade-a';
    if (grade.startsWith('B')) return 'grade-b';
    if (grade.startsWith('C')) return 'grade-c';
    if (grade.startsWith('D')) return 'grade-d';
    return 'grade-f';
}

function getScoreClass(score, maxScore) {
    if (score === '-') return '';
    const percentage = (score / maxScore) * 100;
    if (percentage >= 70) return 'score-good';
    if (percentage >= 50) return 'score-medium';
    return 'score-low';
}

function getLastSubmissionStatus(group) {
    if (!group.submissions) return 'not_submitted';
    const submissions = Object.values(group.submissions);
    if (submissions.length === 0) return 'not_submitted';
    return submissions[submissions.length - 1].status || 'not_submitted';
}

function getStatusText(status) {
    const statusMap = {
        'submitted': 'ส่งแล้ว',
        'late': 'ส่งช้า',
        'not_submitted': 'ยังไม่ส่ง',
        'resubmit': 'ส่งแก้ไข'
    };
    return statusMap[status] || 'ยังไม่ส่ง';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');

    // Determine background color based on type
    let bgColor;
    if (type === 'success') {
        bgColor = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    } else if (type === 'error') {
        bgColor = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    } else {
        bgColor = 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)';
    }

    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${bgColor};
        color: white;
        border-radius: 12px;
        font-family: 'Kanit', sans-serif;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
});
