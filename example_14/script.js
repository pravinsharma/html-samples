/* ==========================================================================
   EXAMPLE 14: INTERACTIVE FLUID DYNAMICS & SKEUOMORPHIC LOGIC
   Manages Dial rotation, PIN pad authentication, sliders, active OLED sync,
   and real-time logging feedback.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const state = {
        isLocked: true,
        operatorName: 'PILOT ELITE',
        targetTemp: 22.0, // °C, range: 16.0 to 28.0
        climateMode: 'AUTO COMFORT',
        fanSpeed: 'MEDIUM (LEVEL 2)',
        panelBrightness: 'MAX BRIGHT (80%)',
        pinBuffer: '',
        correctPin: '1337',
        ambientFreq: 45,
        ionizerActive: true,
        ecoSyncActive: true,
        dialAngle: 0,
        activeProfile: 'provenance'
    };

    // Preset profile data
    const profiles = {
        provenance: {
            name: 'PROVENANCE DECK',
            operator: 'PILOT ELITE',
            temp: 22.0,
            mode: 'AUTO COMFORT',
            fan: 'MEDIUM (LEVEL 2)',
            brightness: 'MAX BRIGHT (80%)',
            ambient: 45,
            ionizer: true,
            eco: true
        },
        apex: {
            name: 'APEX RACING',
            operator: 'APEX DRIVER',
            temp: 18.0,
            mode: 'TURBO BOOST',
            fan: 'TURBO (LEVEL 4)',
            brightness: 'DIM (20%)',
            ambient: 85,
            ionizer: false,
            eco: false
        },
        nebula: {
            name: 'NEBULA TOURING',
            operator: 'NEBULA TRAVELLER',
            temp: 24.5,
            mode: 'SLEEP QUIET',
            fan: 'LOW (LEVEL 1)',
            brightness: 'AUTO-ADJUST',
            ambient: 25,
            ionizer: true,
            eco: true
        }
    };

    // --- DOM ELEMENT REFERENCES ---
    // Header & Info
    const systemStatusPill = document.getElementById('systemStatusPill');
    const logoPulseDot = document.querySelector('.logo-dot-pulse');
    const activeDropdownProfile = document.getElementById('activeDropdownProfile');
    const profileDropdownBtn = document.getElementById('profileDropdownBtn');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');

    // Dial Controls
    const climateDialAssembly = document.getElementById('climateDialAssembly');
    const rotaryDialWheel = document.getElementById('rotaryDialWheel');
    const btnSystemLockToggle = document.getElementById('btnSystemLockToggle');
    const svgLocked = document.getElementById('svgLocked');
    const svgUnlocked = document.getElementById('svgUnlocked');

    // Mode selection buttons
    const btnClimateMode = document.getElementById('btnClimateMode');
    const btnFanSpeed = document.getElementById('btnFanSpeed');
    const btnPanelBrightness = document.getElementById('btnPanelBrightness');

    // Forms & Inputs
    const operatorName = document.getElementById('operatorName');
    const operatorNameWrap = document.getElementById('operatorNameWrap');
    const nameError = document.getElementById('nameError');
    const pinError = document.getElementById('pinError');
    const pinSlots = document.querySelectorAll('.pin-slot-sunken');
    const keypadButtons = document.querySelectorAll('.keypad-btn');
    const keyClear = document.getElementById('keyClear');
    const keyBack = document.getElementById('keyBack');

    // OLED Display
    const oledDisplayPanel = document.getElementById('oledDisplayPanel');
    const oledSystemState = document.getElementById('oledSystemState');
    const oledOperatorName = document.getElementById('oledOperatorName');
    const oledTargetTemp = document.getElementById('oledTargetTemp');
    const oledClimateMode = document.getElementById('oledClimateMode');
    const oledFanSpeed = document.getElementById('oledFanSpeed');
    const oledBrightness = document.getElementById('oledBrightness');
    const oledFooterStatus = document.getElementById('oledFooterStatus');
    const oledClock = document.getElementById('oledClock');

    // Sliders & Switches
    const ambientSlider = document.getElementById('ambientSlider');
    const ambientSliderFill = document.getElementById('ambientSliderFill');
    const ambientSliderVal = document.getElementById('ambientSliderVal');
    const ambientColorName = document.getElementById('ambientColorName');
    const toggleIonizer = document.getElementById('toggleIonizer');
    const toggleRecirc = document.getElementById('toggleRecirc');

    // Backgrounds & Actions
    const ambientGold = document.getElementById('ambientGold');
    const ambientCyan = document.getElementById('ambientCyan');
    const btnApplySettings = document.getElementById('btnApplySettings');
    const btnPurgeDeck = document.getElementById('btnPurgeDeck');
    const logConsole = document.getElementById('logConsole');
    const toastContainer = document.getElementById('toastContainer');

    // --- CORE LOGGER UTILITY ---
    function log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = `log-line text-${type}`;
        line.innerHTML = `&gt; [${timestamp}] ${message}`;
        logConsole.appendChild(line);
        logConsole.scrollTop = logConsole.scrollHeight;
    }

    // --- OLED SCREEN REAL-TIME CLOCK ---
    function updateClock() {
        const now = new Date();
        oledClock.textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- TOAST NOTIFICATIONS ---
    function showToast(text, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-item ${type}`;
        
        let iconMarkup = '';
        if (type === 'success') {
            iconMarkup = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-emerald)" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === 'error') {
            iconMarkup = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-red)" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        } else {
            iconMarkup = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-amber)" stroke-width="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        }

        toast.innerHTML = `
            ${iconMarkup}
            <span class="toast-text">${text}</span>
        `;
        toastContainer.appendChild(toast);

        // Slide out after 3.2s
        setTimeout(() => {
            toast.classList.add('exit');
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }

    // --- LOCK / UNLOCK INTERACTION MECHANISM ---
    function setSystemState(isLocked) {
        state.isLocked = isLocked;

        if (isLocked) {
            // Lock UI elements
            systemStatusPill.textContent = 'SECURED';
            systemStatusPill.style.color = 'var(--color-red)';
            systemStatusPill.style.borderColor = 'rgba(255, 51, 68, 0.15)';
            
            logoPulseDot.style.backgroundColor = 'var(--color-amber)';
            logoPulseDot.style.boxShadow = '0 0 10px var(--color-amber-glow)';
            
            svgLocked.classList.add('active');
            svgUnlocked.classList.remove('active');
            btnSystemLockToggle.setAttribute('aria-pressed', 'true');

            // OLED readouts
            oledSystemState.textContent = 'SECURED';
            oledSystemState.className = 'cell-val text-red';
            oledFooterStatus.textContent = 'SYSTEM LOCKED';
            oledFooterStatus.className = 'footer-segment text-red';

            // Disable/enable visually
            document.querySelectorAll('.col-left .neumorphic-card:not(#securityFormCard), #atmosphereSlidersCard, .system-actions-group').forEach(el => {
                el.style.opacity = '0.5';
                el.style.pointerEvents = 'none';
            });

            log('Console system locked. Enter security keypass code to gain control authority.', 'warning');
        } else {
            // Unlock UI elements
            systemStatusPill.textContent = 'DECK UNLOCKED';
            systemStatusPill.style.color = 'var(--color-emerald)';
            systemStatusPill.style.borderColor = 'rgba(0, 255, 102, 0.15)';

            logoPulseDot.style.backgroundColor = 'var(--color-emerald)';
            logoPulseDot.style.boxShadow = '0 0 12px var(--color-emerald-glow)';

            svgLocked.classList.remove('active');
            svgUnlocked.classList.add('active');
            btnSystemLockToggle.setAttribute('aria-pressed', 'false');

            // OLED readouts
            oledSystemState.textContent = 'OPERATIONAL';
            oledSystemState.className = 'cell-val text-emerald';
            oledFooterStatus.textContent = 'DECK UNLOCKED';
            oledFooterStatus.className = 'footer-segment text-emerald';

            // Enable visually
            document.querySelectorAll('.col-left .neumorphic-card, #atmosphereSlidersCard, .system-actions-group').forEach(el => {
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
            });

            log('Authentication Verified. System authority granted. Welcome operator.', 'success');
            showToast('DECK SYSTEM ACTIVE', 'success');
        }
    }

    // Centered button inside lock dial
    btnSystemLockToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.isLocked) {
            // Require PIN entry, shake
            log('Verification check failed: Direct unlock request rejected. Please enter a valid PIN code on the security pad.', 'error');
            showToast('PIN REQUIRED TO UNLOCK', 'error');
            animateCardError('securityFormCard');
        } else {
            // Lock directly
            setSystemState(true);
            showToast('DECK SECURED', 'info');
        }
    });

    // Helper to shake module card on errors
    function animateCardError(cardId) {
        const card = document.getElementById(cardId);
        card.style.animation = 'shakeInput 0.4s ease';
        setTimeout(() => card.style.animation = '', 400);
    }

    // --- RECURSIVE ROTARY DIAL MATH & DRAGGING (Ref. sample1.webp dial) ---
    let isDraggingDial = false;
    let dialCenter = { x: 0, y: 0 };

    function calculateAngle(clientX, clientY) {
        const deltaX = clientX - dialCenter.x;
        const deltaY = clientY - dialCenter.y;
        // atan2 returns angle in radians, convert to degrees (0 to 360)
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        // Offset so 0 degrees is at the top
        angle = angle + 90;
        if (angle < 0) angle += 360;
        return angle;
    }

    function onDialStart(e) {
        if (state.isLocked) return;
        isDraggingDial = true;
        
        // Calculate the central point of the dial in screen space
        const rect = rotaryDialWheel.getBoundingClientRect();
        dialCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        climateDialAssembly.classList.add('active');
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
    }

    function onDialMove(e) {
        if (!isDraggingDial || state.isLocked) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const rawAngle = calculateAngle(clientX, clientY);
        
        // Map raw angle (0 to 360) to temperature (16.0 to 28.0)
        // Dial starts at 0 (top, 22.0°C) and wraps clockwise.
        // Let's make the dial rotate continuously, and map 0-360 degrees to 16.0°C - 28.0°C.
        // 0 deg = 22.0°C, 180 deg = 28.0°C, 360 deg/0 deg = 16.0°C.
        // Let's implement a neat formula:
        // Temp = 16.0 + (angle / 360) * 12.0
        // Round to nearest 0.5 degrees step to avoid excessive noise and feel extremely mechanical!
        let calculatedTemp = 16.0 + (rawAngle / 360) * 12.0;
        calculatedTemp = Math.round(calculatedTemp * 2) / 2; // Step size of 0.5°C

        if (calculatedTemp !== state.targetTemp) {
            state.targetTemp = calculatedTemp;
            state.dialAngle = rawAngle;
            
            // Visually rotate wheel
            rotaryDialWheel.style.transform = `rotate(${rawAngle}deg)`;
            
            // Update OLED and log
            oledTargetTemp.textContent = `${state.targetTemp.toFixed(1)}°C`;
            
            // Throttle logs slightly by step
            log(`Climate temperature target modulated to ${state.targetTemp.toFixed(1)}°C.`, 'info');
        }
    }

    function onDialEnd() {
        if (!isDraggingDial) return;
        isDraggingDial = false;
        climateDialAssembly.classList.remove('active');
        document.body.style.cursor = '';
    }

    // Dial mouse and touch triggers
    rotaryDialWheel.addEventListener('mousedown', onDialStart);
    window.addEventListener('mousemove', onDialMove);
    window.addEventListener('mouseup', onDialEnd);

    rotaryDialWheel.addEventListener('touchstart', onDialStart, { passive: false });
    window.addEventListener('touchmove', onDialMove, { passive: false });
    window.addEventListener('touchend', onDialEnd);

    // --- THREE BOTTOM TACTILE MODE BUTTONS ---
    // Cloud: Climate Mode
    const climateModes = ['AUTO COMFORT', 'ECO EFFICIENCY', 'SLEEP QUIET', 'TURBO BOOST', 'CLIMATE OFF'];
    let climateModeIndex = 0;

    btnClimateMode.addEventListener('click', () => {
        if (state.isLocked) return;
        
        climateModeIndex = (climateModeIndex + 1) % climateModes.length;
        state.climateMode = climateModes[climateModeIndex];
        
        // UI feedback
        oledClimateMode.textContent = state.climateMode;
        
        // Trigger visual glow flash
        triggerBtnFlash(btnClimateMode);
        log(`Cabin Atmosphere Mode cycled: ${state.climateMode}`, 'info');
    });

    // Wind: Fan Blower Speeds
    const fanSpeeds = ['LOW (LEVEL 1)', 'MEDIUM (LEVEL 2)', 'HIGH (LEVEL 3)', 'TURBO (LEVEL 4)'];
    let fanSpeedIndex = 1;

    btnFanSpeed.addEventListener('click', () => {
        if (state.isLocked) return;
        
        fanSpeedIndex = (fanSpeedIndex + 1) % fanSpeeds.length;
        state.fanSpeed = fanSpeeds[fanSpeedIndex];
        
        oledFanSpeed.textContent = state.fanSpeed;
        triggerBtnFlash(btnFanSpeed);
        log(`Ventilation speed modulated: ${state.fanSpeed}`, 'info');
    });

    // Sun: Screen Brightness
    const brightnessLevels = ['DIM (20%)', 'MED (50%)', 'MAX BRIGHT (80%)', 'AUTO-ADJUST'];
    let brightnessIndex = 2;

    btnPanelBrightness.addEventListener('click', () => {
        if (state.isLocked) return;
        
        brightnessIndex = (brightnessIndex + 1) % brightnessLevels.length;
        state.panelBrightness = brightnessLevels[brightnessIndex];
        
        oledBrightness.textContent = state.panelBrightness;
        triggerBtnFlash(btnPanelBrightness);
        log(`Panel luminance level calibrated: ${state.panelBrightness}`, 'info');
    });

    function triggerBtnFlash(btn) {
        btn.classList.add('selected');
        setTimeout(() => btn.classList.remove('selected'), 300);
    }

    // --- SECURITY ACCESS PIN CODE ENGAGEMENT ---
    keypadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const val = btn.getAttribute('data-value');
            if (val) {
                inputDigit(val);
            }
        });
    });

    keyClear.addEventListener('click', () => {
        state.pinBuffer = '';
        updatePinDisplay();
        pinError.textContent = '';
    });

    keyBack.addEventListener('click', () => {
        state.pinBuffer = state.pinBuffer.slice(0, -1);
        updatePinDisplay();
        pinError.textContent = '';
    });

    function inputDigit(digit) {
        if (state.pinBuffer.length >= 4) return;
        
        state.pinBuffer += digit;
        updatePinDisplay();
        pinError.textContent = '';

        if (state.pinBuffer.length === 4) {
            // Verify PIN
            setTimeout(verifyPin, 250);
        }
    }

    function updatePinDisplay() {
        pinSlots.forEach((slot, idx) => {
            if (idx < state.pinBuffer.length) {
                slot.classList.add('filled');
            } else {
                slot.classList.remove('filled');
            }
            // Remove success/error flags
            slot.className = 'pin-slot-sunken' + (idx < state.pinBuffer.length ? ' filled' : '');
        });
    }

    function verifyPin() {
        if (state.pinBuffer === state.correctPin) {
            // Correct PIN!
            pinSlots.forEach(slot => {
                slot.classList.add('success');
            });
            log('PIN Verification Check: Approved.', 'success');
            
            setTimeout(() => {
                setSystemState(false);
                state.pinBuffer = '';
                updatePinDisplay();
            }, 500);
        } else {
            // Incorrect PIN
            pinSlots.forEach(slot => {
                slot.classList.add('error');
            });
            animateCardError('securityFormCard');
            pinError.textContent = 'SECURE DECK KEYPASS INVALID';
            log('PIN Security Failure: Entered authorization PIN does not match local node.', 'error');
            showToast('DECK ACCESS DENIED', 'error');

            // Reset slots after delay
            setTimeout(() => {
                state.pinBuffer = '';
                updatePinDisplay();
                pinError.textContent = '';
            }, 1000);
        }
    }

    // --- OPERATOR FIELD INTERACTION ---
    operatorName.addEventListener('input', () => {
        state.operatorName = operatorName.value.trim().toUpperCase();
        if (state.operatorName === '') {
            operatorNameWrap.className = 'input-sunken-wrap error';
            nameError.textContent = 'IDENTIFIER VALUE CANNOT BE VACANT';
        } else {
            operatorNameWrap.className = 'input-sunken-wrap success';
            nameError.textContent = '';
            oledOperatorName.textContent = state.operatorName;
        }
    });

    operatorName.addEventListener('focus', () => {
        operatorNameWrap.classList.add('focus');
    });
    
    operatorName.addEventListener('blur', () => {
        operatorNameWrap.classList.remove('focus');
        if (state.operatorName !== '') {
            operatorNameWrap.className = 'input-sunken-wrap';
        }
    });

    // --- AMBIENT LED SPECTRUM MODULATOR (Ref. sample1.webp spectrum colors) ---
    function updateAmbientSpectrum(val) {
        state.ambientFreq = val;
        ambientSliderVal.textContent = `${val}%`;
        ambientSliderFill.style.width = `${val}%`;

        // Colors mapping: Green -> Cyan -> Gold -> Orange -> Violet
        let colorName = 'CYBER CYAN';
        let mainColor = 'var(--color-cyan)';
        let secondaryColor = 'rgba(0, 240, 255, 0.4)';
        let ambientGradient = 'linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)';

        if (val <= 20) {
            colorName = 'EMERALD LEAF';
            mainColor = 'var(--color-emerald)';
            secondaryColor = 'rgba(0, 255, 102, 0.35)';
            ambientGradient = 'linear-gradient(135deg, #00ff66 0%, #009944 100%)';
        } else if (val <= 40) {
            colorName = 'CYBER CYAN';
            mainColor = 'var(--color-cyan)';
            secondaryColor = 'rgba(0, 240, 255, 0.35)';
            ambientGradient = 'linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)';
        } else if (val <= 60) {
            colorName = 'AMBER SUN';
            mainColor = 'var(--color-amber)';
            secondaryColor = 'rgba(251, 133, 0, 0.35)';
            ambientGradient = 'linear-gradient(135deg, #ffb703 0%, #fb8500 100%)';
        } else if (val <= 80) {
            colorName = 'SOLAR FLARE';
            mainColor = '#ff5100';
            secondaryColor = 'rgba(255, 81, 0, 0.35)';
            ambientGradient = 'linear-gradient(135deg, #ff9900 0%, #ff5100 100%)';
        } else {
            colorName = 'NEBULA VIOLET';
            mainColor = '#d900ff';
            secondaryColor = 'rgba(217, 0, 255, 0.35)';
            ambientGradient = 'linear-gradient(135deg, #d900ff 0%, #7300ff 100%)';
        }

        ambientColorName.textContent = colorName;

        // Apply real-time ambient shift to decorative backgrounds
        ambientCyan.style.background = `radial-gradient(circle, ${mainColor} 0%, rgba(0, 0, 0, 0) 70%)`;
        ambientSliderFill.style.background = ambientGradient;
        ambientSliderFill.style.boxShadow = `0 0 8px ${secondaryColor}`;
        ambientSliderVal.style.color = mainColor;

        // Sync to custom style block to glow OLED screens or header accents
        document.documentElement.style.setProperty('--color-cyan', mainColor);
        document.documentElement.style.setProperty('--color-cyan-glow', secondaryColor);
        document.documentElement.style.setProperty('--gradient-cyan', ambientGradient);
    }

    ambientSlider.addEventListener('input', (e) => {
        updateAmbientSpectrum(e.target.value);
    });

    ambientSlider.addEventListener('change', () => {
        log(`Cabin ambient LED spectrum adjusted to ${state.ambientFreq}% (${ambientColorName.textContent}).`, 'info');
    });

    // --- TACTILE 3D ROCKER SWITCHES ---
    toggleIonizer.addEventListener('click', () => {
        state.ionizerActive = !state.ionizerActive;
        toggleIonizer.classList.toggle('active', state.ionizerActive);
        
        const stateText = state.ionizerActive ? 'ON' : 'OFF';
        toggleIonizer.querySelector('.rocker-text').textContent = stateText;
        
        log(`Cabin air ionization catalyst toggled: ${stateText}`, 'info');
    });

    toggleRecirc.addEventListener('click', () => {
        state.ecoSyncActive = !state.ecoSyncActive;
        toggleRecirc.classList.toggle('active', state.ecoSyncActive);
        
        const stateText = state.ecoSyncActive ? 'ACTIVE' : 'DEACTIVE';
        toggleRecirc.querySelector('.rocker-text').textContent = stateText;
        
        log(`Cabin air thermal recirculation sync status: ${stateText}`, 'info');
    });

    // --- DECK AUTHENTICATION DROPDOWN ---
    profileDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = profileDropdownBtn.getAttribute('aria-expanded') === 'true';
        profileDropdownBtn.setAttribute('aria-expanded', !isOpen);
        profileDropdownBtn.parentElement.classList.toggle('open', !isOpen);
    });

    // Close dropdown on outside click
    window.addEventListener('click', () => {
        profileDropdownBtn.setAttribute('aria-expanded', 'false');
        profileDropdownBtn.parentElement.classList.remove('open');
    });

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            const profileKey = item.getAttribute('data-profile');
            
            // Remove active style from others
            dropdownItems.forEach(i => {
                i.classList.remove('active');
                i.setAttribute('aria-selected', 'false');
            });
            item.classList.add('active');
            item.setAttribute('aria-selected', 'true');

            // Apply profile
            applyProfileValues(profileKey);
        });
    });

    function applyProfileValues(key) {
        const profile = profiles[key];
        if (!profile) return;

        state.activeProfile = key;
        activeDropdownProfile.textContent = profile.name;

        // Operator name
        state.operatorName = profile.operator;
        operatorName.value = profile.operator;
        oledOperatorName.textContent = profile.operator;

        if (!state.isLocked) {
            // Apply other settings directly
            state.targetTemp = profile.temp;
            state.dialAngle = (profile.temp - 16.0) / 12.0 * 360;
            rotaryDialWheel.style.transform = `rotate(${state.dialAngle}deg)`;
            oledTargetTemp.textContent = `${state.targetTemp.toFixed(1)}°C`;

            state.climateMode = profile.mode;
            oledClimateMode.textContent = profile.mode;
            climateModeIndex = climateModes.indexOf(profile.mode);

            state.fanSpeed = profile.fan;
            oledFanSpeed.textContent = profile.fan;
            fanSpeedIndex = fanSpeeds.indexOf(profile.fan);

            state.panelBrightness = profile.brightness;
            oledBrightness.textContent = profile.brightness;
            brightnessIndex = brightnessLevels.indexOf(profile.brightness);

            state.ionizerActive = profile.ionizer;
            toggleIonizer.classList.toggle('active', profile.ionizer);
            toggleIonizer.querySelector('.rocker-text').textContent = profile.ionizer ? 'ON' : 'OFF';

            state.ecoSyncActive = profile.eco;
            toggleRecirc.classList.toggle('active', profile.eco);
            toggleRecirc.querySelector('.rocker-text').textContent = profile.eco ? 'ACTIVE' : 'DEACTIVE';

            // Slider
            ambientSlider.value = profile.ambient;
            updateAmbientSpectrum(profile.ambient);
        }

        log(`Operative Profile Node changed to ${profile.name}. Settings staged.`, 'info');
        showToast(`PROFILE STAGED: ${profile.name}`, 'info');
    }

    // --- PRIMARY ACTION ACTIONS ---
    // Apply Settings
    btnApplySettings.addEventListener('click', () => {
        if (state.isLocked) {
            animateCardError('securityFormCard');
            log('Apply Rejected: System connection locked. Please authorize PIN access beforehand.', 'error');
            showToast('DECK LOCKED - REJECTED', 'error');
            return;
        }

        // Show a brief visual "Saving" state in the OLED Screen
        const prevText = oledFooterStatus.textContent;
        const prevClass = oledFooterStatus.className;
        
        oledFooterStatus.textContent = 'SAVING PROFILES...';
        oledFooterStatus.className = 'footer-segment text-gold pulse';

        log('Staging configuration details to smart central server...', 'info');

        setTimeout(() => {
            oledFooterStatus.textContent = prevText;
            oledFooterStatus.className = prevClass;
            
            log('Profile settings successfully committed! Cockpit telemetry active.', 'success');
            showToast('TELEMETRY STAGED', 'success');
        }, 1200);
    });

    // Emergency Reset / Purge
    btnPurgeDeck.addEventListener('click', () => {
        // Reset state
        state.operatorName = 'PILOT ELITE';
        operatorName.value = 'PILOT ELITE';
        operatorNameWrap.className = 'input-sunken-wrap';
        nameError.textContent = '';
        pinError.textContent = '';

        state.targetTemp = 22.0;
        state.dialAngle = 180;
        rotaryDialWheel.style.transform = `rotate(180deg)`;
        oledTargetTemp.textContent = '22.0°C';

        state.climateMode = 'AUTO COMFORT';
        climateModeIndex = 0;
        oledClimateMode.textContent = 'AUTO COMFORT';

        state.fanSpeed = 'MEDIUM (LEVEL 2)';
        fanSpeedIndex = 1;
        oledFanSpeed.textContent = 'MEDIUM (LEVEL 2)';

        state.panelBrightness = 'MAX BRIGHT (80%)';
        brightnessIndex = 2;
        oledBrightness.textContent = 'MAX BRIGHT (80%)';

        state.pinBuffer = '';
        updatePinDisplay();

        state.ionizerActive = true;
        toggleIonizer.classList.add('active');
        toggleIonizer.querySelector('.rocker-text').textContent = 'ON';

        state.ecoSyncActive = true;
        toggleRecirc.classList.add('active');
        toggleRecirc.querySelector('.rocker-text').textContent = 'ACTIVE';

        ambientSlider.value = 45;
        updateAmbientSpectrum(45);

        // Stage default dropdown
        dropdownItems.forEach(i => {
            i.classList.remove('active');
            i.setAttribute('aria-selected', 'false');
        });
        const provenanceItem = document.querySelector('[data-profile="provenance"]');
        provenanceItem.classList.add('active');
        provenanceItem.setAttribute('aria-selected', 'true');
        activeDropdownProfile.textContent = 'PROVENANCE DECK';

        setSystemState(true);

        log('EMERGENCY PURGE ENGAGED: Local nodes reset. Memory buffers purged. Security LOCK re-established.', 'error');
        showToast('COCKPIT DECK RESET', 'error');
    });

    // Initialize layout default
    setSystemState(true);
    updateAmbientSpectrum(45);
});
