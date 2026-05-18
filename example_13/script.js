/* ==========================================================================
   EXAMPLE 13: NEUMORPHIC (SOFT UI) DASHBOARD & INTERACTION ENGINE
   Handles all skeuomorphic feedback, micro-interactions, validations,
   sliding toggle animations, slider repaints, and custom circular loaders.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SYSTEM EVENTS & LOGGER SYSTEM ---
    const logConsole = document.getElementById('logConsole');

    function logEvent(message, type = 'info') {
        const time = new Date().toLocaleTimeString();
        const logLine = document.createElement('div');
        logLine.className = `log-line text-${type}`;
        logLine.innerHTML = `[${time}] &gt; ${message}`;
        logConsole.appendChild(logLine);
        
        // Auto-scroll to the bottom of the console
        logConsole.scrollTop = logConsole.scrollHeight;
    }


    // --- 2. TOAST NOTIFICATION ENGINE ---
    const toastContainer = document.getElementById('toastContainer');

    function showToast(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-msg toast-${type}`;
        
        // Define icons based on notification type
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" width="18" height="18" stroke="#2ec4b6" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" width="18" height="18" stroke="#e63946" stroke-width="3" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        } else {
            iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" width="18" height="18" stroke="#4a6fa5" stroke-width="3" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        }

        toast.innerHTML = `
            ${iconSvg}
            <div class="toast-content">
                <span class="toast-title">${title}</span>
                <span class="toast-text">${message}</span>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger reflow to start transition
        setTimeout(() => toast.classList.add('show'), 50);

        // Slide out and remove toast after 4s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }


    // --- 3. CUSTOM NEUMORPHIC DROPDOWN SELECTOR ---
    const dropdownWrapper = document.querySelector('.dropdown-wrapper');
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const selectedDropdownValue = document.getElementById('selectedDropdownValue');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    // Toggle menu dropdown
    dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownWrapper.classList.contains('open');
        dropdownWrapper.classList.toggle('open', !isOpen);
        dropdownTrigger.setAttribute('aria-expanded', !isOpen);
    });

    // Select custom item option
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            const value = item.getAttribute('data-val');
            
            // Update active states
            dropdownItems.forEach(i => {
                i.classList.remove('active');
                i.setAttribute('aria-selected', 'false');
            });
            item.classList.add('active');
            item.setAttribute('aria-selected', 'true');
            
            // Update trigger layout
            selectedDropdownValue.textContent = value;
            dropdownWrapper.classList.remove('open');
            dropdownTrigger.setAttribute('aria-expanded', 'false');
            
            logEvent(`Navigation channel switched to: ${value}`, 'info');
            showToast('System Channel Changed', `Section path successfully updated to ${value}`, 'info');
        });
    });

    // Close menu when clicking outside of dropdown
    document.addEventListener('click', () => {
        dropdownWrapper.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
    });


    // --- 4. TACTILE RANGE SLIDERS (Gradient fill computations) ---
    const primarySlider = document.getElementById('primarySlider');
    const primarySliderVal = document.getElementById('primarySliderVal');
    const primarySliderFill = document.getElementById('primarySliderFill');

    function updatePrimarySlider() {
        const val = primarySlider.value;
        primarySliderVal.textContent = `${val}%`;
        primarySliderFill.style.width = `${val}%`;
    }

    primarySlider.addEventListener('input', () => {
        updatePrimarySlider();
    });

    primarySlider.addEventListener('change', () => {
        logEvent(`Amplitude Translation level modified: ${primarySlider.value}%`, 'info');
    });

    const secondarySlider = document.getElementById('secondarySlider');
    const secondarySliderVal = document.getElementById('secondarySliderVal');
    const secondarySliderFill = document.getElementById('secondarySliderFill');

    function updateSecondarySlider() {
        const val = secondarySlider.value;
        secondarySliderVal.textContent = `${val}%`;
        secondarySliderFill.style.width = `${val}%`;
    }

    secondarySlider.addEventListener('input', () => {
        updateSecondarySlider();
    });

    secondarySlider.addEventListener('change', () => {
        logEvent(`Auxiliary Damping level modified: ${secondarySlider.value}%`, 'info');
    });


    // --- 5. CAPSULE TOGGLE SWITCHES ---
    const toggleCoherence = document.getElementById('toggleCoherence');
    const toggleIsolation = document.getElementById('toggleIsolation');

    function bindToggle(btn, name) {
        btn.addEventListener('click', () => {
            const isActive = btn.classList.contains('active');
            btn.classList.toggle('active', !isActive);
            btn.setAttribute('aria-pressed', !isActive);
            
            const stateText = !isActive ? 'ENABLED' : 'DISABLED';
            logEvent(`${name} parameters adjusted to: ${stateText}`, isActive ? 'warn' : 'success');
            showToast('Stability Parameter Shifted', `${name} state successfully toggled to ${stateText}`, 'info');
        });
    }

    bindToggle(toggleCoherence, 'Coherence Mode');
    bindToggle(toggleIsolation, 'Isolation Isolation');


    // --- 6. BINARY TEXT SWITCH BUTTONS ---
    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');
    const btnOn = document.getElementById('btnOn');
    const btnOff = document.getElementById('btnOff');

    function setupBinarySet(btnA, btnB, name) {
        btnA.addEventListener('click', () => {
            if (!btnA.classList.contains('active')) {
                btnA.classList.add('active');
                btnA.setAttribute('aria-pressed', 'true');
                btnB.classList.remove('active');
                btnB.setAttribute('aria-pressed', 'false');
                logEvent(`State select in set ${name}: Active choice: YES/ON`, 'success');
            }
        });

        btnB.addEventListener('click', () => {
            if (!btnB.classList.contains('active')) {
                btnB.classList.add('active');
                btnB.setAttribute('aria-pressed', 'true');
                btnA.classList.remove('active');
                btnA.setAttribute('aria-pressed', 'false');
                logEvent(`State select in set ${name}: Active choice: NO/OFF`, 'warn');
            }
        });
    }

    setupBinarySet(btnYes, btnNo, 'Yes/No Binary');
    setupBinarySet(btnOn, btnOff, 'On/Off Switch');


    // --- 7. CHECKBOX GRID SELECTS ---
    const checkOpt1 = document.getElementById('checkOpt1');
    const checkOpt2 = document.getElementById('checkOpt2');

    checkOpt1.addEventListener('change', () => {
        const state = checkOpt1.checked ? 'ENABLED' : 'DISABLED';
        logEvent(`Secure encryption parameters: ${state}`, checkOpt1.checked ? 'success' : 'warn');
    });

    checkOpt2.addEventListener('change', () => {
        const state = checkOpt2.checked ? 'ENABLED' : 'DISABLED';
        logEvent(`Verification integrity channels: ${state}`, checkOpt2.checked ? 'success' : 'warn');
    });


    // --- 8. CIRCULAR PROGRESS ANIMATION SYSTEM ---
    const radialProgressCircle = document.getElementById('radialProgressCircle');
    const radialProgressText = document.getElementById('radialProgressText');
    const btnSyncAction = document.getElementById('btnSyncAction');

    // Circumference of R=48 circle is 301.59 (approx 301.6)
    const strokeCircumference = 301.6;

    function setRadialProgress(percent) {
        const percentClamped = Math.min(100, Math.max(0, percent));
        const strokeOffset = strokeCircumference - (percentClamped / 100) * strokeCircumference;
        radialProgressCircle.style.strokeDashoffset = strokeOffset;
        radialProgressText.textContent = `${Math.round(percentClamped)}%`;
    }

    // Interactive Async sync mock routine
    let syncInterval = null;
    let isSyncing = false;

    btnSyncAction.addEventListener('click', () => {
        if (isSyncing) {
            clearInterval(syncInterval);
            isSyncing = false;
            btnSyncAction.querySelector('.sync-btn-text').textContent = 'RUN SYNC PROCESS';
            btnSyncAction.style.color = '';
            logEvent('Cloud transmission sequence paused by supervisor.', 'warn');
            showToast('Sync Paused', 'Cloud transfer operation suspended', 'warn');
            return;
        }

        isSyncing = true;
        btnSyncAction.querySelector('.sync-btn-text').textContent = 'HALT SYNC PROCESS';
        btnSyncAction.style.color = '#e63946';
        
        let progress = 0;
        setRadialProgress(0);
        logEvent('Beginning high-bandwidth Cloud Sync process...', 'info');

        syncInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 8) + 4;
            if (progress >= 100) {
                progress = 100;
                setRadialProgress(100);
                clearInterval(syncInterval);
                isSyncing = false;
                
                btnSyncAction.querySelector('.sync-btn-text').textContent = 'RUN SYNC PROCESS';
                btnSyncAction.style.color = '';
                
                logEvent('Cloud Sync successfully terminated. All network nodes verified.', 'success');
                showToast('Sync Succeeded', '1.24 GB packet transferred to Secure Storage Node.', 'success');
            } else {
                setRadialProgress(progress);
                if (progress % 20 < 10) {
                    logEvent(`Transferring packets: ${progress}% completed.`, 'info');
                }
            }
        }, 300);
    });


    // --- 9. SECURE FORM LOGIC & VALIDATION ---
    const authForm = document.getElementById('authForm');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const passwordToggle = document.getElementById('passwordToggle');
    const eyeOpenIcon = document.getElementById('eyeOpenIcon');
    const eyeClosedIcon = document.getElementById('eyeClosedIcon');
    
    const usernameFieldWrap = document.getElementById('usernameFieldWrap');
    const passwordFieldWrap = document.getElementById('passwordFieldWrap');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const strengthBar = document.getElementById('strengthBar');
    const rememberMeCheckbox = document.getElementById('rememberMeCheckbox');
    const btnCancel = document.getElementById('btnCancel');
    const btnForgotPass = document.getElementById('btnForgotPass');

    // Toggle Password Visibility Eye Icon
    passwordToggle.addEventListener('click', () => {
        const isPassword = loginPassword.getAttribute('type') === 'password';
        loginPassword.setAttribute('type', isPassword ? 'text' : 'password');
        
        eyeOpenIcon.classList.toggle('hidden', isPassword);
        eyeClosedIcon.classList.toggle('hidden', !isPassword);
        
        logEvent(`Password visibility channel ${isPassword ? 'OPENED' : 'CLOSED'}`, 'info');
    });

    // Password Strength Meter Algorithm
    loginPassword.addEventListener('input', () => {
        const val = loginPassword.value;
        let score = 0;
        
        if (val.length >= 6) score += 1;
        if (val.length >= 10) score += 1;
        if (/[0-9]/.test(val)) score += 1;
        if (/[A-Z]/.test(val)) score += 1;
        if (/[^A-Za-z0-9]/.test(val)) score += 1;

        strengthBar.style.width = `${(score / 5) * 100}%`;
        
        if (score === 0) {
            strengthBar.style.backgroundColor = 'transparent';
        } else if (score <= 2) {
            strengthBar.style.backgroundColor = '#e63946'; // Weak
        } else if (score <= 4) {
            strengthBar.style.backgroundColor = '#ffb703'; // Medium
        } else {
            strengthBar.style.backgroundColor = '#2ec4b6'; // Strong
        }
    });

    // Individual validation trackers
    function validateUsername() {
        const val = loginUsername.value.trim();
        if (val.length === 0) {
            usernameFieldWrap.classList.add('error');
            usernameFieldWrap.classList.remove('success');
            usernameError.textContent = 'LOGIN USERNAME FIELD IS MANDATORY';
            return false;
        } else if (val.length < 4) {
            usernameFieldWrap.classList.add('error');
            usernameFieldWrap.classList.remove('success');
            usernameError.textContent = 'IDENTIFIER MUST BE AT LEAST 4 CHARACTERS';
            return false;
        } else {
            usernameFieldWrap.classList.remove('error');
            usernameFieldWrap.classList.add('success');
            usernameError.textContent = '';
            return true;
        }
    }

    function validatePassword() {
        const val = loginPassword.value;
        if (val.length === 0) {
            passwordFieldWrap.classList.add('error');
            passwordFieldWrap.classList.remove('success');
            passwordError.textContent = 'PASSWORD ENCRYPTION KEY IS MANDATORY';
            return false;
        } else if (val.length < 6) {
            passwordFieldWrap.classList.add('error');
            passwordFieldWrap.classList.remove('success');
            passwordError.textContent = 'SECURITY PASSPHRASE MUST EXCEED 5 CHARACTERS';
            return false;
        } else {
            passwordFieldWrap.classList.remove('error');
            passwordFieldWrap.classList.add('success');
            passwordError.textContent = '';
            return true;
        }
    }

    loginUsername.addEventListener('blur', validateUsername);
    loginUsername.addEventListener('input', () => {
        if (usernameFieldWrap.classList.contains('error')) {
            validateUsername();
        }
    });

    loginPassword.addEventListener('blur', validatePassword);
    loginPassword.addEventListener('input', () => {
        if (passwordFieldWrap.classList.contains('error')) {
            validatePassword();
        }
    });

    // Cancel / Clear Form
    btnCancel.addEventListener('click', () => {
        loginUsername.value = '';
        loginPassword.value = '';
        rememberMeCheckbox.checked = false;
        
        usernameFieldWrap.className = 'input-sunken-wrap';
        passwordFieldWrap.className = 'input-sunken-wrap';
        usernameError.textContent = '';
        passwordError.textContent = '';
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = 'transparent';
        
        logEvent('Interactive Authentication details cleared by console.', 'warn');
        showToast('Form Reset', 'All input credentials have been wiped.', 'info');
    });

    // Form Submit Sequence
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isUserValid = validateUsername();
        const isPassValid = validatePassword();
        
        if (isUserValid && isPassValid) {
            const userVal = loginUsername.value.trim();
            const rememberVal = rememberMeCheckbox.checked ? 'CONNECTED' : 'STANDALONE';
            
            logEvent(`Sending authentication packet to secure core...`, 'info');
            
            // Mock server transmission lag
            const btnSubmit = document.getElementById('btnLoginSubmit');
            btnSubmit.disabled = true;
            btnSubmit.querySelector('.btn-text').textContent = 'CONNECTING...';
            
            setTimeout(() => {
                logEvent(`Authentication granted! Logged in as: ${userVal} (Node: ${rememberVal})`, 'success');
                showToast('Login Granted', `Welcome back, agent ${userVal}. Connection stable.`, 'success');
                
                btnSubmit.disabled = false;
                btnSubmit.querySelector('.btn-text').textContent = 'LOGIN';
                
                // Clear fields on success
                loginUsername.value = '';
                loginPassword.value = '';
                usernameFieldWrap.className = 'input-sunken-wrap';
                passwordFieldWrap.className = 'input-sunken-wrap';
                strengthBar.style.width = '0%';
            }, 1200);

        } else {
            logEvent('Authentication process failed. Correct highlighted keypasses.', 'error');
            showToast('Authentication Error', 'Invalid credential layout detected.', 'error');
        }
    });

    // Forgot password auxiliary plate
    btnForgotPass.addEventListener('click', () => {
        logEvent('Forgotten access code sequence engaged. Core password reset key mailed.', 'warn');
        showToast('Password Recovery Engaged', 'Check registered device frequencies for transmission.', 'info');
    });


    // --- 10. TOOLBAR SQUARED BUTTONS TACTILE SELECTION ---
    const toolbarButtons = document.querySelectorAll('.toolbar-square-btn');

    toolbarButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active status from active buttons
            toolbarButtons.forEach(b => b.classList.remove('active'));
            
            // Set active clicked button
            btn.classList.add('active');
            
            const btnId = btn.getAttribute('id');
            const btnTitle = btn.getAttribute('title');
            
            logEvent(`Toolbar channel switched to focal index: ${btnTitle}`, 'success');
            showToast('Toolbar Channel Modified', `Active viewport aligned with: ${btnTitle}`, 'info');
        });
    });

    // Initialize display states
    updatePrimarySlider();
    updateSecondarySlider();
    setRadialProgress(25);
});
