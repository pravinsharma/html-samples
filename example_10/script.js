/* ==========================================================================
   EXAMPLE 10: ADVANCED ASSESSMENT SYSTEM JAVASCRIPT
   Brings the interactive assessment mock portal to life with logic, 
   state-handling, dynamic question pools, countdown timers, and results modals.
   ========================================================================== */

// Question Database (12 highly professional technical questions)
const QUESTION_BANK = [
    {
        id: 1,
        category: "System Architecture",
        difficulty: "Hard",
        text: "You are designing a low-latency video streaming system. To minimize rebuffering for mobile clients in highly volatile network zones, which technique will yield the most optimal result at the edge layer?",
        options: [
            "HTTP/2 Server Push to feed video frames into client cache preemptively",
            "Implementing adaptive bitrate streaming (ABR) using Dynamic HLS with Edge-computed bandwidth estimation",
            "Broadcasting UDP packets with custom packet sequence recovery directly from centralized origin nodes",
            "Utilizing persistent WebSocket connection grids to stream uncompressed raw MP4 containers"
        ],
        correctAnswer: 1,
        code: null
    },
    {
        id: 2,
        category: "Algorithmic Complexity",
        difficulty: "Hard",
        text: "Examine the following utility function used inside a cache eviction processor. What is the Big-O asymptotic runtime complexity of this eviction routine relative to the cache size N?",
        options: [
            "O(1) Constant Time Complexity",
            "O(Log N) Logarithmic Time Complexity",
            "O(N) Linear Time Complexity",
            "O(N Log N) Linear-Logarithmic Time Complexity"
        ],
        correctAnswer: 1,
        code: `// Dynamic cache partition eviction routine
function evictOutdatedCacheEntries(cachePartition) {
    let heapIndex = Math.floor(cachePartition.length / 2) - 1;
    while (heapIndex >= 0) {
        sinkNodeDown(cachePartition, heapIndex, cachePartition.length);
        heapIndex--;
    }
    return cachePartition.shift(); // Evicts highest latency node
}`
    },
    {
        id: 3,
        category: "Distributed Databases",
        difficulty: "Medium",
        text: "According to the CAP Theorem, in the presence of an unavoidable network partition (P) inside a high-throughput banking ledger repository, which operational configuration is mathematically impossible?",
        options: [
            "Sacrificing Availability (A) to guarantee strict transaction consistency (C)",
            "Sacrificing Consistency (C) to guarantee 99.999% application Availability (A)",
            "Simultaneously achieving strict, instantaneous Consistency (C) and absolute Availability (A)",
            "Partitioning the data into secondary read-only nodes that display eventually-consistent balances"
        ],
        correctAnswer: 2,
        code: null
    },
    {
        id: 4,
        category: "Cybersecurity Protocols",
        difficulty: "Medium",
        text: "A web application needs to securely store candidate profile credentials. Which hashing configuration represents the strongest protection against offline dictionary attacks and brute-force GPU-parallelized cracking?",
        options: [
            "SHA-256 with a static 16-character salt run through 5,000 SHA cycles",
            "Argon2id with a work factor memory parameter set to 64MB and parallelization set to 4 threads",
            "MD5 hashing combined with Base64 encoding for standard text normalization",
            "HMAC-SHA512 using a system-level private token stored inside global environment arrays"
        ],
        correctAnswer: 1,
        code: null
    },
    {
        id: 5,
        category: "System Integration",
        difficulty: "Hard",
        text: "Review this microservice inter-node communication wrapper. When an API node fails to response, what failure recovery pattern is actively being triggered here?",
        options: [
            "Exponential Backoff & Jitter retry orchestration",
            "Circuit Breaker fallback routing with State tripwire",
            "Dead Letter Queue (DLQ) event-sourcing forwarding",
            "Optimistic Lock Version Reconciliation routing"
        ],
        correctAnswer: 1,
        code: `// Inter-node connection proxy
async function dispatchRemoteCall(requestObject) {
    if (serviceState.tripwireTripped) {
        return loadFallbackLocalCache(requestObject);
    }
    try {
        const response = await fetchWithTimeout(requestObject.targetUrl, 2000);
        serviceState.successCounter++;
        return response;
    } catch (networkError) {
        serviceState.failureCounter++;
        if (serviceState.failureCounter >= 5) {
            serviceState.tripwireTripped = true;
            triggerSystemAlert("Node state: TRIPPED_OPEN");
        }
        return loadFallbackLocalCache(requestObject);
    }
}`
    },
    {
        id: 6,
        category: "Web Infrastructure",
        difficulty: "Medium",
        text: "You are setting up DNS routing for multiple workspace zones. Which type of record should be implemented to dynamically redirect root subdomain routes to a separate canonical web name?",
        options: [
            "An A (Address) record referencing target host IPv4 indices",
            "A CNAME (Canonical Name) record forwarding subdomain vectors",
            "An MX (Mail Exchanger) routing priority directory mapping",
            "A TXT record containing security domain verifications"
        ],
        correctAnswer: 1,
        code: null
    },
    {
        id: 7,
        category: "distributed Systems",
        difficulty: "Hard",
        text: "In a pub/sub message broker grid, how is 'at-least-once' delivery guarantee achieved between the broker and consumer nodes?",
        options: [
            "The broker automatically assumes success upon dispatching the packet payload to the network buffer",
            "Consumers must explicitly return an Acknowledgment (ACK) signal before the broker purges the offset",
            "Utilizing synchronous TLS handshakes for every payload exchange to verify thread locks",
            "Doubling the message broadcast stream to ensure duplicate packets arrive sequentially"
        ],
        correctAnswer: 1,
        code: null
    },
    {
        id: 8,
        category: "Database Engineering",
        difficulty: "Hard",
        text: "Examine this transactional database lock wrapper. What fatal architectural problem is this SQL operation susceptible to under heavy parallel thread volumes?",
        options: [
            "Dirty read state anomaly",
            "Cascading query timeout aborts",
            "Deadlock conditions between overlapping transaction sessions",
            "Write-ahead log buffer overflows"
        ],
        correctAnswer: 2,
        code: `-- High-concurrency wallet transactions
BEGIN TRANSACTION;
SELECT ledger_balance FROM core_accounts WHERE acc_id = 9539 FOR UPDATE;
UPDATE core_accounts SET ledger_balance = ledger_balance - 500 WHERE acc_id = 9539;
SELECT wallet_balance FROM card_registry WHERE user_id = 1017 FOR UPDATE;
UPDATE card_registry SET wallet_balance = wallet_balance + 500 WHERE user_id = 1017;
COMMIT;`
    },
    {
        id: 9,
        category: "System Integration",
        difficulty: "Medium",
        text: "When implementing server-sent events (SSE) for dynamic updates, what specific HTTP header must be verified inside edge-level proxy systems to prevent buffered transmission delays?",
        options: [
            "Cache-Control: no-cache and Content-Type: text/event-stream",
            "Connection: Keep-Alive and Transfer-Encoding: chunked",
            "X-Content-Type-Options: nosniff",
            "Accept-Ranges: bytes"
        ],
        correctAnswer: 0,
        code: null
    },
    {
        id: 10,
        category: "Cloud Engineering",
        difficulty: "Medium",
        text: "Which health check status will cause a load balancer to automatically withdraw an instance from active rotation?",
        options: [
            "A 302 Found redirect route",
            "A 401 Unauthorized API reply",
            "Five consecutive connection timeout events (5xx series errors)",
            "A 204 No Content heartbeat reply"
        ],
        correctAnswer: 2,
        code: null
    },
    {
        id: 11,
        category: "Distributed Databases",
        difficulty: "Hard",
        text: "Which algorithm is commonly utilized in distributed systems to maintain consistent data partitioning across a dynamically expanding pool of database shard nodes?",
        options: [
            "Consistent Hashing using an active ring and virtual nodes",
            "Round-robin priority queue index dispatching",
            "Dijkstra's dynamic topological shortest path mapper",
            "Fisher-Yates partition shuffler matrix"
        ],
        correctAnswer: 0,
        code: null
    },
    {
        id: 12,
        category: "System Architecture",
        difficulty: "Medium",
        text: "What architectural benefit does the Backend-for-Frontend (BFF) pattern provide in microservice structures?",
        options: [
            "Eliminates database latency entirely by merging queries into localized memory databases",
            "Allows separate client platforms (web, mobile) to query tailored APIs optimized for their layouts",
            "Forces absolute strict security loops inside client browsers using WASM wrappers",
            "Bypasses DNS resolution layers to query services directly via static IP pools"
        ],
        correctAnswer: 1,
        code: null
    }
];

// Assessment State Manager
let state = {
    currentQuestionIndex: 0,
    userAnswers: new Array(QUESTION_BANK.length).fill(null), // Stores selected index or null
    flaggedQuestions: new Array(QUESTION_BANK.length).fill(false), // Stores boolean
    timeRemaining: 300, // 5 minutes in seconds (300)
    timerInterval: null,
    isCompleted: false,
    startTime: Date.now()
};

// DOM Selector references
const dom = {
    navGrid: document.getElementById('question-nav-grid'),
    badgeIndex: document.getElementById('question-index-badge'),
    badgeCategory: document.getElementById('question-category-tag'),
    badgeDiff: document.getElementById('question-difficulty-tag'),
    btnFlag: document.getElementById('btn-flag-question'),
    textQuestion: document.getElementById('question-text-content'),
    codeBlockContainer: document.getElementById('question-code-block-container'),
    codeContent: document.getElementById('question-code-content'),
    optionsPanel: document.getElementById('options-panel-container'),
    btnPrev: document.getElementById('btn-prev-question'),
    btnNext: document.getElementById('btn-next-question'),
    btnSubmit: document.getElementById('btn-submit-action'),
    
    // Stats elements
    statAnswered: document.getElementById('stat-answered'),
    statFlagged: document.getElementById('stat-flagged'),
    statRemaining: document.getElementById('stat-remaining'),
    sidebarProgressPercent: document.getElementById('sidebar-progress-percent'),
    sidebarProgressFill: document.getElementById('sidebar-progress-fill'),
    
    // Stepper elements
    stepperProgress: document.getElementById('stepper-progress'),
    stepperNodes: document.querySelectorAll('.horizontal-stepper .step-node'),
    
    // Timer
    timerClock: document.getElementById('timer-clock'),
    timerPill: document.querySelector('.timer-pill-bubble'),
    
    // Modal Overlay
    submissionOverlay: document.getElementById('submission-overlay'),
    closeOverlayBtn: document.getElementById('close-overlay-btn'),
    dismissOverlayBtn: document.getElementById('btn-dismiss-overlay'),
    downloadCertBtn: document.getElementById('btn-download-blueprint'),
    modalScorePercent: document.getElementById('modal-score-percent'),
    modalScoreRatio: document.getElementById('modal-score-ratio'),
    modalScoreRing: document.getElementById('modal-score-ring'),
    modalStatAnswered: document.getElementById('modal-stat-answered'),
    modalStatTime: document.getElementById('modal-stat-time'),
    modalStatGrade: document.getElementById('modal-stat-grade'),
    modalConsoleLog: document.getElementById('success-log')
};

/* ==========================================================================
   INITIALIZATION & MAIN SETUP
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup question navigation sidebar grid
    initializeNavigatorGrid();
    
    // 2. Load the first question
    loadQuestion(0);
    
    // 3. Start ticking countdown timer
    startTimer();
    
    // 4. Setup parameter configuration interactions
    setupParameterInteractions();
    
    // 5. Connect UI events
    connectEventHandlers();
});

/* ==========================================================================
   INTERACTIVE COMPONENT BINDING
   ========================================================================== */
function connectEventHandlers() {
    // Flag current question button
    dom.btnFlag.addEventListener('click', toggleFlagQuestion);
    
    // Bottom actions
    dom.btnPrev.addEventListener('click', () => navigateQuestion(-1));
    dom.btnNext.addEventListener('click', () => navigateQuestion(1));
    dom.btnSubmit.addEventListener('click', triggerExamSubmission);
    
    // Modal controls
    dom.closeOverlayBtn.addEventListener('click', closeModal);
    dom.dismissOverlayBtn.addEventListener('click', closeModal);
    dom.downloadCertBtn.addEventListener('click', downloadBlueprintCertificate);
    
    // Window resize logic for mobile responsiveness adjustments
    window.addEventListener('resize', adjustResponsiveness);
}

// 8-Cell parameters configuration (Exact copy style of sample1.jpg theme)
function setupParameterInteractions() {
    // Row 1: Pill Selectors (Switch Active Mode state)
    const pills = document.querySelectorAll('.pill-selector');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            // Premium microinteraction sound / log simulation
            console.log(`[ASSESS-PORTAL] Switched Mode parameter to: ${pill.textContent.trim()}`);
        });
    });

    // Row 2: Custom Dropdowns (Toggles options panel smoothly)
    const selectFields = document.querySelectorAll('.select-field');
    selectFields.forEach(field => {
        const dropdown = field.querySelector('.custom-dropdown');
        const trigger = field.querySelector('.dropdown-selected');
        const list = field.querySelector('.dropdown-list');
        const listOptions = field.querySelectorAll('.dropdown-list li');
        
        // Toggle Open Dropdown
        field.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close other dropdowns
            selectFields.forEach(f => {
                if (f !== field) f.classList.remove('open');
            });
            
            field.classList.toggle('open');
        });
        
        // Select Option Item click
        listOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Update selected text display
                trigger.textContent = opt.textContent;
                
                // Remove selection classes
                listOptions.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                
                // Close dropdown
                field.classList.remove('open');
                
                console.log(`[ASSESS-PORTAL] Updated exam filter [${field.querySelector('.select-label').textContent}]: ${opt.textContent.trim()}`);
            });
        });
    });

    // Close open dropdowns when clicking outside
    document.addEventListener('click', () => {
        selectFields.forEach(field => field.classList.remove('open'));
    });
}

/* ==========================================================================
   NAVIGATION GRID INITIALIZATION
   ========================================================================== */
function initializeNavigatorGrid() {
    dom.navGrid.innerHTML = '';
    
    for (let i = 0; i < QUESTION_BANK.length; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-grid-btn';
        btn.id = `nav-btn-${i}`;
        btn.textContent = i + 1;
        
        // Navigation grid click
        btn.addEventListener('click', () => {
            if (state.isCompleted) return;
            loadQuestion(i);
        });
        
        dom.navGrid.appendChild(btn);
    }
}

/* ==========================================================================
   QUESTION LOADING ENGINE
   ========================================================================== */
function loadQuestion(index) {
    if (index < 0 || index >= QUESTION_BANK.length) return;
    
    // Save current index
    state.currentQuestionIndex = index;
    const question = QUESTION_BANK[index];
    
    // 1. Update Navigation Grid States
    syncNavigationGridUI();
    
    // 2. Render Question Meta Tags
    dom.badgeIndex.textContent = `Question ${index + 1} of ${QUESTION_BANK.length}`;
    dom.badgeCategory.textContent = question.category;
    dom.badgeDiff.textContent = question.difficulty;
    
    // Style difficulty badge
    if (question.difficulty === "Hard") {
        dom.badgeDiff.className = "question-badge diff hard";
    } else {
        dom.badgeDiff.className = "question-badge diff";
    }
    
    // 3. Sync Flag Question Button State
    if (state.flaggedQuestions[index]) {
        dom.btnFlag.classList.add('active');
        dom.btnFlag.querySelector('.btn-flag-text').textContent = "Flagged";
    } else {
        dom.btnFlag.classList.remove('active');
        dom.btnFlag.querySelector('.btn-flag-text').textContent = "Flag Question";
    }
    
    // 4. Set Question Text
    dom.textQuestion.textContent = question.text;
    
    // 5. Load Code Snippet if present (Dynamic rendering)
    if (question.code) {
        dom.codeBlockContainer.style.display = "block";
        dom.codeContent.textContent = question.code;
    } else {
        dom.codeBlockContainer.style.display = "none";
    }
    
    // 6. Populate MCQ Options Panel (with dynamic slide items)
    dom.optionsPanel.innerHTML = '';
    question.options.forEach((optText, optIndex) => {
        const optionCard = document.createElement('div');
        optionCard.className = 'option-card';
        if (state.userAnswers[index] === optIndex) {
            optionCard.classList.add('selected');
        }
        
        // HTML inner elements
        optionCard.innerHTML = `
            <div class="option-circle"></div>
            <span class="option-text">${optText}</span>
        `;
        
        // Click event selection
        optionCard.addEventListener('click', () => handleOptionSelect(optIndex));
        dom.optionsPanel.appendChild(optionCard);
    });
    
    // 7. Toggle Actions Buttons Visibility
    dom.btnPrev.style.visibility = index === 0 ? "hidden" : "visible";
    
    if (index === QUESTION_BANK.length - 1) {
        dom.btnNext.style.display = "none";
        dom.btnSubmit.style.display = "block";
    } else {
        dom.btnNext.style.display = "flex";
        dom.btnSubmit.style.display = "none";
    }
    
    // 8. Dynamic Stepper Fill Timeline Update (Step 3 Assessment completed fill visual)
    updateTopStepperUI();
}

/* ==========================================================================
   SELECTION & STATS COMPUTATION
   ========================================================================== */
function handleOptionSelect(optionIndex) {
    const currentIndex = state.currentQuestionIndex;
    
    // Update answer database state
    state.userAnswers[currentIndex] = optionIndex;
    
    // Update active UI card highlight
    const optionCards = dom.optionsPanel.querySelectorAll('.option-card');
    optionCards.forEach((card, idx) => {
        if (idx === optionIndex) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    // Auto sync layout indicators
    syncNavigationGridUI();
    computeSidebarStats();
}

function toggleFlagQuestion() {
    const currentIndex = state.currentQuestionIndex;
    
    // Toggle state
    state.flaggedQuestions[currentIndex] = !state.flaggedQuestions[currentIndex];
    
    // Sync Button visuals
    if (state.flaggedQuestions[currentIndex]) {
        dom.btnFlag.classList.add('active');
        dom.btnFlag.querySelector('.btn-flag-text').textContent = "Flagged";
    } else {
        dom.btnFlag.classList.remove('active');
        dom.btnFlag.querySelector('.btn-flag-text').textContent = "Flag Question";
    }
    
    // Sync Navigator
    syncNavigationGridUI();
    computeSidebarStats();
}

function navigateQuestion(direction) {
    const targetIndex = state.currentQuestionIndex + direction;
    loadQuestion(targetIndex);
}

/* ==========================================================================
   UI SYNCHRONIZERS
   ========================================================================== */
function syncNavigationGridUI() {
    for (let i = 0; i < QUESTION_BANK.length; i++) {
        const btn = document.getElementById(`nav-btn-${i}`);
        if (!btn) continue;
        
        // Clear all state classes first
        btn.className = 'nav-grid-btn';
        
        // Apply appropriate state hierarchies
        if (i === state.currentQuestionIndex) {
            btn.classList.add('current');
        }
        
        if (state.userAnswers[i] !== null) {
            btn.classList.add('answered');
        }
        
        if (state.flaggedQuestions[i]) {
            btn.classList.add('flagged');
        }
    }
}

function computeSidebarStats() {
    let answered = 0;
    let flagged = 0;
    
    state.userAnswers.forEach(ans => {
        if (ans !== null) answered++;
    });
    
    state.flaggedQuestions.forEach(flag => {
        if (flag) flagged++;
    });
    
    const remaining = QUESTION_BANK.length - answered;
    const progressPercent = Math.round((answered / QUESTION_BANK.length) * 100);
    
    // Push stats to DOM
    dom.statAnswered.textContent = answered;
    dom.statFlagged.textContent = flagged;
    dom.statRemaining.textContent = remaining;
    
    // Progress meters
    dom.sidebarProgressPercent.textContent = `${progressPercent}%`;
    dom.sidebarProgressFill.style.width = `${progressPercent}%`;
}

// Sync Horizontal Stepper UI based on overall completion
function updateTopStepperUI() {
    // If exam is completed, fill timeline 100%, set Step 3 Completed and Step 4 Active
    if (state.isCompleted) {
        dom.stepperProgress.style.width = '100%';
        
        // Node 3 Completed
        const node3 = document.getElementById('step-node-3');
        node3.className = 'step-node completed';
        node3.querySelector('.floating-skewed-banner').style.display = 'none';
        
        // Node 4 Active
        const node4 = document.getElementById('step-node-4');
        node4.className = 'step-node active';
        
        return;
    }
    
    // Static visual from sample1.jpg: Step 1, 2 complete, Step 3 Active (Progress bar at 66%)
    dom.stepperProgress.style.width = '66%';
    
    // Sync node nodes class arrays
    const step1 = document.getElementById('step-node-1');
    const step2 = document.getElementById('step-node-2');
    const step3 = document.getElementById('step-node-3');
    const step4 = document.getElementById('step-node-4');
    
    step1.className = 'step-node completed';
    step2.className = 'step-node completed';
    step3.className = 'step-node active';
    step4.className = 'step-node pending';
    
    step3.querySelector('.floating-skewed-banner').style.display = 'block';
}

/* ==========================================================================
   DYNAMIC COUNTDOWN TIMER LOOP
   ========================================================================== */
function startTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    
    state.timerInterval = setInterval(() => {
        if (state.timeRemaining <= 0) {
            clearInterval(state.timerInterval);
            autoSubmitOnTimeout();
            return;
        }
        
        state.timeRemaining--;
        updateTimerDisplay();
        
        // Warning triggers under 60 seconds (1 minute remaining!)
        if (state.timeRemaining < 60) {
            dom.timerPill.classList.add('warning-state');
        } else {
            dom.timerPill.classList.remove('warning-state');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(state.timeRemaining / 60);
    const secs = state.timeRemaining % 60;
    
    // Pad numbers with leading zeroes
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');
    
    dom.timerClock.textContent = `${formattedMins}:${formattedSecs}`;
}

/* ==========================================================================
   EXAM SUBMISSION SCORING & MODAL ENGINE
   ========================================================================== */
function triggerExamSubmission() {
    clearInterval(state.timerInterval);
    state.isCompleted = true;
    
    // 1. Sync Stepper timeline to completion state!
    updateTopStepperUI();
    
    // 2. Score calculation
    let correctCount = 0;
    let answeredCount = 0;
    
    QUESTION_BANK.forEach((q, idx) => {
        const userAns = state.userAnswers[idx];
        if (userAns !== null) {
            answeredCount++;
            if (userAns === q.correctAnswer) {
                correctCount++;
            }
        }
    });
    
    const percentage = Math.round((correctCount / QUESTION_BANK.length) * 100);
    
    // 3. Compute elapsed test time
    const timeElapsedSecs = 300 - state.timeRemaining;
    const elapsedMins = Math.floor(timeElapsedSecs / 60);
    const elapsedSecs = timeElapsedSecs % 60;
    const formattedTime = `${elapsedMins.toString().padStart(2, '0')}:${elapsedSecs.toString().padStart(2, '0')}`;
    
    // 4. Generate Grade scale
    let grade = "C-Class Associate";
    if (percentage >= 90) grade = "S-Class Architect";
    else if (percentage >= 75) grade = "A-Tier Engineer";
    else if (percentage >= 50) grade = "B-Tier Developer";
    
    // 5. Populate Modal DOM elements
    dom.modalScorePercent.textContent = `${percentage}%`;
    dom.modalScoreRatio.textContent = `${correctCount}/${QUESTION_BANK.length}`;
    dom.modalStatAnswered.textContent = `${answeredCount}/${QUESTION_BANK.length}`;
    dom.modalStatTime.textContent = formattedTime;
    dom.modalStatGrade.textContent = grade;
    
    // Set custom grade colors
    if (percentage >= 75) {
        dom.modalStatGrade.className = "report-stat-val text-green";
    } else {
        dom.modalStatGrade.className = "report-stat-val text-slate";
    }
    
    // 6. Animate Circular Score SVG Ring
    // Dash Offset formula = Perimeter (314.15) - (Perimeter * % / 100)
    const perimeter = 2 * Math.PI * 50; // Radius is 50 -> 314.159
    const strokeDashOffset = perimeter - (perimeter * percentage) / 100;
    dom.modalScoreRing.style.strokeDashoffset = strokeDashOffset;
    
    // 7. Inject detailed log reports in console simulator
    dom.modalConsoleLog.textContent = `
[ASSESS-ENGINE] Initiating final exam compilation...
[ASSESS-ENGINE] Verifying candidate profile ID 2026-9539...
[ASSESS-ENGINE] Syncing answer array nodes with origin server host...
[ASSESS-ENGINE] Processing MCQ question vector nodes [1-12]...
--------------------------------------------------
>> RESULTS COMPILER SUMMARY:
   Total Solved:   ${answeredCount} / ${QUESTION_BANK.length}
   Correct Nodes:  ${correctCount} / ${QUESTION_BANK.length}
   Flagged Nodes:  ${state.flaggedQuestions.filter(x => x).length}
   Score Vector:   ${percentage}% [Accreditation: ${grade}]
--------------------------------------------------
[SUCCESS] Candidate exam parameters verified.
[SUCCESS] Certificate index file generated successfully.
    `.trim();
    
    // 8. Open modal overlay
    dom.submissionOverlay.classList.add('show');
}

function autoSubmitOnTimeout() {
    console.log("[ASSESS-PORTAL] Countdown timer hit 00:00! Auto-submitting assessment...");
    triggerExamSubmission();
}

function closeModal() {
    dom.submissionOverlay.classList.remove('show');
}

function downloadBlueprintCertificate() {
    console.log("[ASSESS-PORTAL] Download Blueprint Certificate triggered.");
    alert("Compiling Certificate Blueprint...\nYour candidate course certification has been successfully downloaded.");
}

function adjustResponsiveness() {
    // Dynamic adjustments if needed for smaller viewports
}
