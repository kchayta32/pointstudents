// Main Application Logic
import { database, ref, set, get, push, onValue, update, remove } from './firebase-config.js';

// ============================================
// Initial Data - Groups
// ============================================
const initialGroups = {
    "1": { members: ["แนน", "นก", "เฟรช", "มา", "มี่", "ไอซ์"] },
    "2": { members: ["ต้น", "โรบอท", "พี", "ปาล์ม", "ดล"] },
    "3": { members: ["ต้า", "เขต", "เนย", "น้ำ", "หญิง", "โอ๊ค"] },
    "4": { members: ["ม่อน", "ปลื่ม", "บิ๊ก", "สตางค์"] },
    "5": { members: ["ซี", "กิด", "มอส"] },
    "6": { members: ["เอฟขนอม", "เน๊ะบางบ่อ", "ทีมนคร", "เกมส์สุราษฎร์", "เพลงสุพรรณ"] },
    "7": { members: ["เจ๋งซอยมังกร", "ปั๊บโป๊เตโต้", "แฟ้มลาซาล", "บูมบางแค", "แคร์บางคน", "อลัม"] },
    "8": { members: ["เซน", "บอส", "ปอย", "ปาย", "โบ้"] },
    "9": { members: ["โอ๊ต", "เต้", "โฟน", "เขต", "อาท", "ฟลุ๊ค"] },
    "10": { members: ["มิ้น", "กาญ", "สุนิสา"] },
    "11": { members: ["บอส", "โต้", "น้อยหน่า", "จู้", "กี้", "พี่อาม"] },
    "12": { members: ["กิจ", "โอม"] }
};

// ============================================
// Member Data - Student ID & Full Name
// ============================================
const memberData = {
    // กลุ่มที่ 1
    "แนน": { studentId: "66122519085", fullName: "นางสาวมลตณรัตน์ วิวัฒน์เมทากร" },
    "นก": { studentId: "66122519060", fullName: "นางสาวเกศินี แซสันเทียะ" },
    "เฟรช": { studentId: "66122519059", fullName: "นางสาวอนันตญา จันทร์เจริญ" },
    "มา": { studentId: "66122519083", fullName: "นางสาวอริษรา ชาญแท้" },
    "มี่": { studentId: "66122519035", fullName: "นางสาวณภัทร แซ่ตั้ง" },
    "ไอซ์": { studentId: "66122519092", fullName: "นางสาวชุติกาญจน์ เพิ่มศิลป์" },

    // กลุ่มที่ 2
    "ต้น": { studentId: "66122519032", fullName: "นายกิตติ ชัยตา" },
    "โรบอท": { studentId: "66122519012", fullName: "นายศตวรรษ อินทรักษ์" },
    "พี": { studentId: "66122519044", fullName: "นายภาณุวิชญ์ คงสุริยา" },
    "ปาล์ม": { studentId: "66122519026", fullName: "นายธเนศพล แซ่เอีย" },
    "ดล": { studentId: "66122519023", fullName: "นายกฤษนัย กิ้นโบราณ" },

    // กลุ่มที่ 3
    "ต้า": null,
    "เขต": { studentId: "66122519076", fullName: "นายฐิติโชติ โสดาจันทร์" },
    "เนย": null,
    "น้ำ": { studentId: "66122519041", fullName: "นางสาวสุธิดา สารบรรณ" },
    "หญิง": { studentId: "66122519021", fullName: "นางสาวอารียา สะอาดเอี่ยม" },
    "โอ๊ค": null,

    // กลุ่มที่ 4
    "ม่อน": { studentId: "66122519069", fullName: "นายตรีเพชร รุ่งเรือง" },
    "ปลื่ม": null,
    "บิ๊ก": null,
    "สตางค์": { studentId: "66122519080", fullName: "นางสาวเพชรพลอย วงศ์มณี" },

    // กลุ่มที่ 5
    "ซี": { studentId: "66122519054", fullName: "นายภาณุวัฒน์ อามาตย์" },
    "กิด": { studentId: "66122519047", fullName: "นายศักดิ์นรินทร์ ศรีจันทร์" },
    "มอส": { studentId: "66122519067", fullName: "นายอภิชัย ประมาณ" },

    // กลุ่มที่ 6
    "เอฟขนอม": { studentId: "66122519007", fullName: "นายพฤฒินันท์ เล่าสกุลสุข" },
    "เน๊ะบางบ่อ": { studentId: "66122519039", fullName: "นายธีรศักดิ์ บุญเกิดรัมย์" },
    "ทีมนคร": { studentId: "66122519028", fullName: "นายนลธวัช จิตต์รัว" },
    "เกมส์สุราษฎร์": { studentId: "66122519008", fullName: "นายศุภณัฐ ชุมช้าง" },
    "เพลงสุพรรณ": { studentId: "66122519036", fullName: "นายสรวีย์ ผลวงษ์" },

    // กลุ่มที่ 7
    "เจ๋งซอยมังกร": { studentId: "66122519045", fullName: "นายธนกร แสงสุระ" },
    "ปั๊บโป๊เตโต้": null,
    "แฟ้มลาซาล": { studentId: "66122519034", fullName: "นายกฤษณพงศ์ มนต์แก้ว" },
    "บูมบางแค": null,
    "แคร์บางคน": null,
    "อลัม": { studentId: "66122519042", fullName: "นายมูฮัมมัดอาหลัม มามุ" },

    // กลุ่มที่ 8
    "เซน": { studentId: "66122519010", fullName: "นายอับดุลฮากิม เรืองประดิษฐ์" },
    "บอส": null,
    "ปอย": { studentId: "66122519091", fullName: "นางสาวทิฆัมพร มาให้ทรัพย์" },
    "ปาย": null,
    "โบ้": null,

    // กลุ่มที่ 9
    "โอ๊ต": { studentId: "66122519061", fullName: "นายจตุรเทพ รัตนวรเศวต" },
    "เต้": null,
    "โฟน": null,
    "อาท": null,
    "ฟลุ๊ค": null,

    // กลุ่มที่ 10
    "มิ้น": { studentId: "66122519084", fullName: "นางสาวธนภร วิรัชมงคลชัย" },
    "กาญ": { studentId: "66122519075", fullName: "นางสาวกัญญาณัฐ ลุนชาติ" },

    // กลุ่มที่ 11
    "โต้": { studentId: "66122519029", fullName: "นายณัฐวุฒิ บุญปลื้ม" },
    "น้อยหน่า": { studentId: "66122519009", fullName: "นางสาวศศิวิมล จันทร์เย็น" },
    "จู้": { studentId: "66122519027", fullName: "นางสาวจิราภา มาทา" },
    "กี้": { studentId: "66122519030", fullName: "นายนวพล อุรีภาศ" },
    "พี่อาม": { studentId: "66122519025", fullName: "นางสาวธัญสุดา พันธ์นุช" },

    // กลุ่มที่ 12
    "กิจ": { studentId: "66122519003", fullName: "นายธนกฤต วรรณรังษี" },
    "โอม": { studentId: "66122519024", fullName: "นายภานุวัฒน์ นิ่มนวล" }
};

// Special cases for duplicate names (need group context)
const memberDataByGroup = {
    "3": {
        "เนย": null
    },
    "10": {
        "สุนิสา": { studentId: "66122519089", fullName: "นางสาวสุนิสา โพธิดา" }
    },
    "11": {
        "บอส": { studentId: "66122519031", fullName: "นายกฤศ เจริญทรัพย์" }
    }
};

// Function to get member info with group context
function getMemberInfo(nickname, groupId) {
    // Check group-specific data first (for duplicates)
    if (memberDataByGroup[groupId] && memberDataByGroup[groupId][nickname] !== undefined) {
        return memberDataByGroup[groupId][nickname];
    }
    return memberData[nickname] || null;
}

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
// Role Selection System
// ============================================
const ADMIN_PASSWORD = '1212312121';
let isAdminMode = false;

const roleModal = document.getElementById('roleModal');
const viewOnlyBtn = document.getElementById('viewOnlyBtn');
const adminBtn = document.getElementById('adminBtn');
const passwordSection = document.getElementById('passwordSection');
const roleOptions = document.querySelector('.role-options');
const adminPassword = document.getElementById('adminPassword');
const passwordError = document.getElementById('passwordError');
const backToRoles = document.getElementById('backToRoles');
const confirmPassword = document.getElementById('confirmPassword');

// View Only Mode
viewOnlyBtn.addEventListener('click', () => {
    setRole('view');
    roleModal.classList.remove('active');
});

// Admin Mode - Show Password Input
adminBtn.addEventListener('click', () => {
    roleOptions.style.display = 'none';
    passwordSection.style.display = 'block';
    adminPassword.focus();
});

// Back to Role Selection
backToRoles.addEventListener('click', () => {
    passwordSection.style.display = 'none';
    roleOptions.style.display = 'flex';
    adminPassword.value = '';
    passwordError.style.display = 'none';
});

// Confirm Password
confirmPassword.addEventListener('click', () => {
    verifyPassword();
});

// Enter key for password
adminPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        verifyPassword();
    }
});

function verifyPassword() {
    if (adminPassword.value === ADMIN_PASSWORD) {
        setRole('admin');
        roleModal.classList.remove('active');
        adminPassword.value = '';
        passwordError.style.display = 'none';
    } else {
        passwordError.style.display = 'block';
        adminPassword.value = '';
        adminPassword.focus();
    }
}

function setRole(role) {
    document.body.dataset.role = role;
    isAdminMode = role === 'admin';

    // Add role indicator to header
    const headerInfo = document.querySelector('.header-info');
    const existingIndicator = headerInfo.querySelector('.role-indicator');
    if (existingIndicator) existingIndicator.remove();

    const indicator = document.createElement('span');
    indicator.className = `role-indicator ${role}`;
    indicator.innerHTML = role === 'admin'
        ? '👨‍💼 แอดมิน'
        : '👀 ดูอย่างเดียว';
    headerInfo.insertBefore(indicator, headerInfo.firstChild);

    console.log('Role set to:', role);
}

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

        // Block leaderboard access for view mode
        if (targetTab === 'leaderboard' && !isAdminMode) {
            showNotification('ต้องเข้าสู่ระบบแอดมินเพื่อดูลีดเดอร์บอร์ด', 'error');
            return;
        }

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
    delete assignmentForm.dataset.editId;
    document.querySelector('#assignmentForm .btn-submit').textContent = '💾 บันทึก';
});

document.getElementById('cancelAssignment').addEventListener('click', () => {
    assignmentModal.classList.remove('active');
    assignmentForm.reset();
    delete assignmentForm.dataset.editId;
    document.querySelector('#assignmentForm .btn-submit').textContent = '💾 บันทึก';
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
            console.log('Data exists, syncing members from initialGroups...');
            // Sync members from initialGroups but keep submissions
            const existingGroups = snapshot.val().groups || {};
            const updatedGroups = {};

            for (const [groupId, groupData] of Object.entries(initialGroups)) {
                updatedGroups[groupId] = {
                    members: groupData.members, // Use latest members from code
                    submissions: existingGroups[groupId]?.submissions || {} // Keep existing submissions
                };
            }

            // Update groups in Firebase
            const groupsRef = ref(database, 'courses/CPE5010/groups');
            await set(groupsRef, updatedGroups);
            console.log('Synced members with Firebase');
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
        const editId = assignmentForm.dataset.editId;

        console.log('Saving assignment:', { name, maxScore, dueDate, editId });

        if (editId) {
            // Update existing assignment
            const assignmentRef = ref(database, `courses/CPE5010/assignments/${editId}`);
            await update(assignmentRef, {
                name,
                maxScore,
                dueDate: dueDate || null,
                updatedAt: new Date().toISOString()
            });
            showNotification('อัพเดทงานสำเร็จ!', 'success');
        } else {
            // Create new assignment
            const assignmentsRef = ref(database, 'courses/CPE5010/assignments');
            const newAssignmentRef = push(assignmentsRef);

            await set(newAssignmentRef, {
                name,
                maxScore,
                dueDate: dueDate || null,
                createdAt: new Date().toISOString()
            });
            showNotification('เพิ่มงานใหม่สำเร็จ!', 'success');
        }

        console.log('Assignment saved successfully!');

        assignmentModal.classList.remove('active');
        assignmentForm.reset();
        delete assignmentForm.dataset.editId;
        document.querySelector('#assignmentForm .btn-submit').textContent = '💾 บันทึก';
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
    card.onclick = () => {
        if (isAdminMode) {
            openScoreModal(group.id);
        }
    };

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
            ${group.members.map(m => {
        const info = getMemberInfo(m, group.id);
        const hasInfo = info !== null;
        return `<span class="member-tag${hasInfo ? ' has-info' : ''}" data-nickname="${m}" data-group-id="${group.id}">${m}</span>`;
    }).join('')}
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
            <div class="assignment-actions">
                <button class="action-btn edit-btn" data-id="${id}" title="แก้ไข">✏️</button>
                <button class="action-btn delete-btn" data-id="${id}" title="ลบ">🗑️</button>
            </div>
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

        // Add event listeners
        card.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openEditAssignmentModal(id);
        });

        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteAssignment(id);
        });

        assignmentsGrid.appendChild(card);
    });
}

// Edit Assignment Modal
function openEditAssignmentModal(assignmentId) {
    const assignment = assignments[assignmentId];
    if (!assignment) return;

    // Populate form with existing data
    document.getElementById('assignmentName').value = assignment.name;
    document.getElementById('maxScore').value = assignment.maxScore;
    document.getElementById('dueDate').value = assignment.dueDate || '';

    // Store the assignment ID for update
    assignmentForm.dataset.editId = assignmentId;

    // Change button text
    document.querySelector('#assignmentForm .btn-submit').textContent = '💾 อัพเดท';

    assignmentModal.classList.add('active');
}

// Delete Assignment
async function deleteAssignment(assignmentId) {
    const assignment = assignments[assignmentId];
    if (!assignment) return;

    if (!confirm(`ยืนยันการลบงาน "${assignment.name}"?\nการลบจะรวมถึงข้อมูลคะแนนที่นักศึกษาส่งมาแล้วด้วย`)) {
        return;
    }

    try {
        // Delete assignment from Firebase
        const assignmentRef = ref(database, `courses/CPE5010/assignments/${assignmentId}`);
        await remove(assignmentRef);

        // Delete all submissions for this assignment from all groups
        for (const groupId of Object.keys(groups)) {
            const submissionRef = ref(database, `courses/CPE5010/groups/${groupId}/submissions/${assignmentId}`);
            await remove(submissionRef);
        }

        showNotification('ลบงานสำเร็จ!', 'success');
    } catch (error) {
        console.error('Error deleting assignment:', error);
        showNotification('เกิดข้อผิดพลาด: ' + error.message, 'error');
    }
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

        // Show reset button when there's existing data
        document.getElementById('resetSubmission').style.display = 'block';

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
        // Hide reset button for new submissions
        document.getElementById('resetSubmission').style.display = 'none';

        // Set default datetime to now
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        document.getElementById('submissionDateTime').value = localDateTime;
        document.getElementById('scoreValue').value = '';
        document.getElementById('submissionLink').value = '';
        document.getElementById('submissionStatus').value = 'submitted';
    }
});

// Reset submission handler
document.getElementById('resetSubmission').addEventListener('click', async () => {
    const groupId = document.getElementById('currentGroupId').value;
    const assignmentId = document.getElementById('assignmentFilter').value;

    if (!assignmentId || !groupId) {
        showNotification('กรุณาเลือกงานก่อน', 'error');
        return;
    }

    const assignmentName = assignments[assignmentId]?.name || 'งาน';

    if (!confirm(`ยืนยันการรีเซ็ตข้อมูลการส่ง "${assignmentName}" ของกลุ่ม ${groupId}?`)) {
        return;
    }

    try {
        // Remove submission from Firebase
        const submissionRef = ref(database, `courses/CPE5010/groups/${groupId}/submissions/${assignmentId}`);
        await remove(submissionRef);

        // Reset form
        document.getElementById('scoreValue').value = '';
        document.getElementById('submissionLink').value = '';
        document.getElementById('submissionDateTime').value = '';
        document.getElementById('submissionStatus').value = 'submitted';
        document.getElementById('resetSubmission').style.display = 'none';

        showNotification('รีเซ็ตข้อมูลสำเร็จ!', 'success');

        // Close modal
        scoreModal.classList.remove('active');
        scoreForm.reset();
        document.getElementById('scoreSingleEntry').style.display = 'none';
        document.getElementById('assignmentFilter').value = '';
        currentGroupForScore = null;
    } catch (error) {
        console.error('Error resetting submission:', error);
        showNotification('เกิดข้อผิดพลาด: ' + error.message, 'error');
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
// Member Hologram Popup System
// ============================================
let currentPopup = null;
let popupTimeout = null;

function createPopup(nickname, groupId) {
    const info = getMemberInfo(nickname, groupId);
    if (!info) return null;

    const popup = document.createElement('div');
    popup.className = 'member-popup';

    // Create random particles
    const particlesHtml = Array.from({ length: 6 }, (_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 2;
        return `<div class="hologram-particle" style="left: ${left}%; top: ${top}%; animation-delay: ${delay}s;"></div>`;
    }).join('');

    popup.innerHTML = `
        <div class="popup-arrow top"></div>
        <div class="hologram-card">
            <div class="hologram-particles">${particlesHtml}</div>
            <div class="popup-content">
                <div class="popup-profile">
                    <img class="profile-image" src="images/${nickname}.png" alt="${nickname}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="profile-fallback" style="display:none;">👤</div>
                </div>
                <div class="popup-info">
                    <div class="popup-student-id">
                        <div class="id-icon">🎓</div>
                        <div class="id-text">${info.studentId}</div>
                    </div>
                    <div class="popup-fullname">
                        <div class="name-text">${info.fullName}</div>
                    </div>
                    <div class="popup-nickname">ชื่อเล่น: ${nickname}</div>
                </div>
            </div>
        </div>
    `;

    return popup;
}

function showPopup(element) {
    const nickname = element.dataset.nickname;
    const groupId = element.dataset.groupId;

    // Check if member has info
    const info = getMemberInfo(nickname, groupId);
    if (!info) return;

    // Remove existing popup
    hidePopup();

    // Create new popup
    currentPopup = createPopup(nickname, groupId);
    if (!currentPopup) return;

    document.body.appendChild(currentPopup);

    // Calculate position
    const rect = element.getBoundingClientRect();
    const popupRect = currentPopup.getBoundingClientRect();

    let left = rect.left + (rect.width / 2) - (popupRect.width / 2);
    let top = rect.bottom + 15;

    // Adjust if popup goes off screen
    if (left < 10) left = 10;
    if (left + popupRect.width > window.innerWidth - 10) {
        left = window.innerWidth - popupRect.width - 10;
    }

    // If popup goes below viewport, show it above the element
    if (top + popupRect.height > window.innerHeight - 10) {
        top = rect.top - popupRect.height - 15;
        currentPopup.querySelector('.popup-arrow').className = 'popup-arrow bottom';
    }

    currentPopup.style.left = `${left}px`;
    currentPopup.style.top = `${top}px`;

    // Trigger animation
    requestAnimationFrame(() => {
        currentPopup.classList.add('visible');
    });
}

function hidePopup() {
    if (currentPopup) {
        currentPopup.classList.remove('visible');
        setTimeout(() => {
            if (currentPopup && currentPopup.parentNode) {
                currentPopup.remove();
            }
            currentPopup = null;
        }, 300);
    }
}

// Event delegation for member tags
document.addEventListener('mouseenter', (e) => {
    if (e.target.classList.contains('member-tag') && e.target.classList.contains('has-info')) {
        clearTimeout(popupTimeout);
        popupTimeout = setTimeout(() => {
            showPopup(e.target);
        }, 150);
    }
}, true);

document.addEventListener('mouseleave', (e) => {
    if (e.target.classList.contains('member-tag') && e.target.classList.contains('has-info')) {
        clearTimeout(popupTimeout);
        popupTimeout = setTimeout(() => {
            hidePopup();
        }, 100);
    }
}, true);

// Hide popup when scrolling
document.addEventListener('scroll', () => {
    hidePopup();
}, true);

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
});
