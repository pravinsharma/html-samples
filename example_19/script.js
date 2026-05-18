/**
 * M-19 RETRO-INDUSTRIAL CONSOLE INTERACTION SYSTEM
 * Fully animated progress indicators, custom controls, and terminal diagnostic feed.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    const form = document.getElementById('m19-calibration-form');
    const resetBtn = document.getElementById('form-reset-btn');
    const submitBtn = document.getElementById('btn-submit-form');
    
    // Status Indicators
    const statusDot = document.getElementById('system-status-dot');
    const statusText = document.getElementById('system-status-text');

    // Form inputs
    const operatorInput = document.getElementById('operator-code');
    const stepInput = document.getElementById('calibration-index');
    const btnStepMinus = document.getElementById('btn-step-minus');
    const btnStepPlus = document.getElementById('btn-step-plus');
    
    // Custom Dropdown Select
    const selectContainer = document.getElementById('sector-select-box');
    const selectedSectorLabel = document.getElementById('selected-sector-label');
    const nativeSelect = document.getElementById('sector-vector-native');
    const selectOptions = selectContainer.querySelectorAll('.option-item');
    
    // Segmented Buttons (Cooling System)
    const segmentedContainer = document.getElementById('cooling-segmented-toggles');
    const segmentButtons = segmentedContainer.querySelectorAll('.segment-tab');
    const coolingHiddenInput = document.getElementById('cooling-system-input');
    
    // Range Slider
    const resonanceSlider = document.getElementById('resonance-slider');
    const resonanceReadout = document.getElementById('resonance-readout');
    
    // Safeguard Checkboxes & Radios
    const cyberCheck = document.getElementById('check-cyber');
    const groundCheck = document.getElementById('check-ground');
    const radioModalityList = document.getElementsByName('energy_modality');

    // Telemetry Diagnostics
    const logConsole = document.getElementById('console-log-box');
    
    // Calibration Gauges (Theme Progress indicators)
    const completionTextPercent = document.getElementById('completion-text-percent');
    const stripedFill = document.getElementById('linear-striped-fill');
    const stripedTooltip = document.getElementById('striped-tooltip');
    const circularFill = document.getElementById('circular-fill-elem');
    const circularPercentText = document.getElementById('circular-percent-readout');
    const segmentBlocks = document.querySelectorAll('#linear-segments-bar .progress-block');

    // Overlay Receipt Ticket
    const ticketOverlay = document.getElementById('ticket-overlay-panel');
    const closeTicketBtn = document.getElementById('btn-close-ticket');
    
    // Overlay Fields
    const ticketOperator = document.getElementById('ticket-val-operator');
    const ticketIndex = document.getElementById('ticket-val-index');
    const ticketSector = document.getElementById('ticket-val-sector');
    const ticketCooling = document.getElementById('ticket-val-cooling');
    const ticketEnergy = document.getElementById('ticket-val-energy');
    const ticketResonance = document.getElementById('ticket-val-resonance');
    const ticketDampening = document.getElementById('ticket-val-dampening');
    const ticketStabilizer = document.getElementById('ticket-val-stabilizer');
    const ticketDateStamp = document.getElementById('ticket-date-stamp');
    const ticketHashStamp = document.getElementById('ticket-hash-stamp');

    // --- TELEMETRY CONSOLE FEED WRITER ---
    function logToConsole(message) {
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerText = message;
        logConsole.appendChild(line);
        
        // Remove old lines if log gets too long (max 30 lines)
        while (logConsole.children.length > 30) {
            logConsole.removeChild(logConsole.firstChild);
        }
        
        // Auto scroll to bottom
        logConsole.scrollTop = logConsole.scrollHeight;
    }

    // --- CALCULATE & UPDATE FORM COMPLETENESS GAUGES ---
    function updateProgressIndicators() {
        let progress = 0;
        
        // 1. Operator Code (Text Box): 20%
        if (operatorInput.value.trim().length >= 3) {
            progress += 20;
        }

        // 2. Sector Selection (Dropdown): 20%
        if (nativeSelect.value !== '') {
            progress += 20;
        }

        // 3. Cooling Sub-System Mode: 20%
        // Counts if it has been switched from default, or let's count it if active
        if (coolingHiddenInput.value !== 'off') {
            progress += 20;
        }

        // 4. Resonance Slider: 20%
        // Counts if slider has been moved from default minimum value (100)
        if (parseInt(resonanceSlider.value) > 100) {
            progress += 20;
        }

        // 5. Safeguard Checkboxes: 20%
        // Counts if at least one checkbox is checked
        if (cyberCheck.checked || groundCheck.checked) {
            progress += 20;
        }

        // --- UPDATE VIEWPORT VISUAL ELEMENTS ---

        // Completion Text
        if (progress === 100) {
            completionTextPercent.innerText = "CALIBRATION READY (100%)";
            completionTextPercent.style.color = "var(--color-accent-green)";
        } else {
            completionTextPercent.innerText = `CALIBRATION INCOMPLETE (${progress}%)`;
            completionTextPercent.style.color = "var(--color-charcoal)";
        }

        // Segmented Progress Bar (Directly from sample1.webp top-left)
        // 20 total blocks, each representing 5%
        const activeBlockCount = Math.floor(progress / 5);
        segmentBlocks.forEach((block, idx) => {
            if (idx < activeBlockCount) {
                block.classList.add('active');
            } else {
                block.classList.remove('active');
            }
        });

        // Striped Progress Bar (Theme from sample1.webp middle-right)
        stripedFill.style.width = `${progress}%`;
        stripedTooltip.innerText = `${progress}%`;

        // Segmented Circular Gauge (Theme from sample1.webp bottom row)
        // Circle circumference is 2 * PI * r (for r=40, it's 251.2)
        const circumference = 251.2;
        const offset = circumference - (progress / 100) * circumference;
        circularFill.style.strokeDashoffset = offset;
        circularPercentText.innerText = `${progress}%`;
    }

    // --- STEPPER INDEX CONTROLS ---
    btnStepMinus.addEventListener('click', () => {
        let val = parseInt(stepInput.value);
        if (val > 10) {
            val -= 10;
            stepInput.value = val;
            logToConsole(`Calibration step reduced to ${val} STEP`);
            updateProgressIndicators();
        } else {
            logToConsole(`Error: Step minimum parameter lock reached (10 STEP)`);
        }
    });

    btnStepPlus.addEventListener('click', () => {
        let val = parseInt(stepInput.value);
        if (val < 150) {
            val += 10;
            stepInput.value = val;
            logToConsole(`Calibration step increased to ${val} STEP`);
            updateProgressIndicators();
        } else {
            logToConsole(`Error: Step maximum parameter lock reached (150 STEP)`);
        }
    });

    // --- CUSTOM DROPDOWN CHANNELS ---
    selectContainer.addEventListener('click', (e) => {
        // Toggle the open class
        selectContainer.classList.toggle('open');
        e.stopPropagation();
    });

    selectOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const value = option.getAttribute('data-value');
            const labelText = option.innerText.replace('▶', '').trim();
            
            // Mark option as selected
            selectOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            // Update UI trigger label
            selectedSectorLabel.innerText = labelText;
            selectedSectorLabel.style.color = "var(--color-slate-black)";
            selectedSectorLabel.style.fontWeight = "bold";

            // Update native select
            nativeSelect.value = value;

            // Close container & log to diagnostics
            selectContainer.classList.remove('open');
            logToConsole(`Sector vector range locked: ${labelText.split('(')[0].trim()}`);
            
            updateProgressIndicators();
            e.stopPropagation();
        });
    });

    // Close select if user clicks outside
    document.addEventListener('click', () => {
        selectContainer.classList.remove('open');
    });

    // --- COIL COOLING SEGMENTED TABS ---
    segmentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            segmentButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const value = btn.getAttribute('data-value');
            coolingHiddenInput.value = value;
            
            logToConsole(`Cooling matrix sub-system switched to: [${value.toUpperCase()}]`);
            updateProgressIndicators();
        });
    });

    // --- FREQUENCY RESONANCE SLIDER ---
    resonanceSlider.addEventListener('input', () => {
        const val = resonanceSlider.value;
        resonanceReadout.innerText = val;
        
        // Log changes at specific values or in increments (to prevent log spam)
        if (val % 50 === 0 || val === "900" || val === "100") {
            logToConsole(`Resonance induction configured at ${val} Hz`);
        }
        
        updateProgressIndicators();
    });

    resonanceSlider.addEventListener('change', () => {
        logToConsole(`Resonance locked at parameter ${resonanceSlider.value} Hz`);
        updateProgressIndicators();
    });

    // --- IDENTITY TEXT LOGGING ---
    let operatorTimeout = null;
    operatorInput.addEventListener('input', () => {
        // Debounce logging text input
        clearTimeout(operatorTimeout);
        operatorTimeout = setTimeout(() => {
            const val = operatorInput.value.trim().toUpperCase();
            if (val.length >= 3) {
                logToConsole(`Calibration operator signature: [${val}]`);
            }
            updateProgressIndicators();
        }, 800);
    });

    // --- RADIO MODALITY LOGGING ---
    radioModalityList.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const labelText = radio.closest('.tactile-radio-row').querySelector('.radio-main-label').innerText;
                logToConsole(`Energy modality calibration: ${labelText}`);
            }
        });
    });

    // --- SAFEGUARDS CHECKBOX INTERACTIVITY ---
    cyberCheck.addEventListener('change', () => {
        if (cyberCheck.checked) {
            logToConsole(`Autonomous safety dampener: [ENGAGED]`);
        } else {
            logToConsole(`Warning: Autonomous safety dampener [DISENGAGED]`);
        }
        updateProgressIndicators();
    });

    groundCheck.addEventListener('change', () => {
        if (groundCheck.checked) {
            logToConsole(`Grounded stabilizer system: [ACTIVATED]`);
        } else {
            logToConsole(`Warning: Grounded stabilizer fluid [DRAINED]`);
        }
        updateProgressIndicators();
    });

    // --- SUBMISSION SIMULATION & TELEMETRY LOCK ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Basic validation check
        const operatorCode = operatorInput.value.trim();
        const sectorVector = nativeSelect.value;

        if (operatorCode.length < 3) {
            logToConsole(`Submission Failure: Valid Operator Code signature required.`);
            operatorInput.focus();
            return;
        }
        if (!sectorVector) {
            logToConsole(`Submission Failure: Sector Vector calibration required.`);
            selectContainer.classList.add('open');
            return;
        }

        // Disable commit button to simulate locks
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.6";

        // Animate Console state to amber pulsing warning
        statusDot.className = "status-indicator pulsing";
        statusDot.style.backgroundColor = "var(--color-accent-amber)";
        statusText.innerText = "CONSOLE STATE: COMMITTING CALIBRATION";
        
        logToConsole(`> INITIALIZING MATRIX SHUTTER LOCKS...`);
        logToConsole(`> GENERATING DIAGNOSTIC TELEMETRY CERTIFICATE...`);

        setTimeout(() => {
            // Lock Console Status to green active status
            statusDot.className = "status-indicator";
            statusDot.style.backgroundColor = "var(--color-accent-green)";
            statusText.innerText = "CONSOLE STATE: CALIBRATION LOCKED";
            
            logToConsole(`> CALIBRATION MATRIX WRITTEN TO CHIP REGISTER.`);
            logToConsole(`> SUCCESS! DISPENSING CERTIFICATE TICKET...`);

            // Compile information and write into skeuomorphic overlay receipt ticket
            ticketOperator.innerText = operatorInput.value.trim().toUpperCase();
            ticketIndex.innerText = `${stepInput.value} STEP`;
            
            // Get Sector readable text
            const selectedOpt = Array.from(selectOptions).find(opt => opt.classList.contains('selected'));
            ticketSector.innerText = selectedOpt ? selectedOpt.innerText.replace('▶', '').split('(')[0].trim() : 'NONE';

            // System states
            ticketCooling.innerText = coolingHiddenInput.value.toUpperCase();
            
            // Energy Modality
            let selectedMod = 'DIRECT CURRENT';
            radioModalityList.forEach(radio => {
                if (radio.checked) {
                    selectedMod = radio.closest('.tactile-radio-row').querySelector('.radio-main-label').innerText.replace('MODALITY', '').trim();
                }
            });
            ticketEnergy.innerText = selectedMod;

            ticketResonance.innerText = `${resonanceSlider.value} Hz`;
            ticketDampening.innerText = cyberCheck.checked ? 'ENGAGED' : 'DISENGAGED';
            ticketStabilizer.innerText = groundCheck.checked ? 'ENGAGED (LIQUID NITROGEN)' : 'DISENGAGED';

            // Stamps
            const now = new Date();
            const dateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
            ticketDateStamp.innerText = `DATE: ${dateStr}`;

            const randomHash = `#M19-B${Math.floor(1000 + Math.random() * 9000)}`;
            ticketHashStamp.innerText = `HASH: ${randomHash}`;

            // Open Receipt Ticket
            ticketOverlay.classList.add('active');

            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
        }, 1200);
    });

    // --- OVERLAY TICKET DISMISSAL ---
    closeTicketBtn.addEventListener('click', () => {
        ticketOverlay.classList.remove('active');
        logToConsole(`Diagnostic ticket dismissed. Telemetry online.`);
    });

    // --- FORM RESET SYSTEM ---
    resetBtn.addEventListener('click', () => {
        // Reset raw fields
        form.reset();
        
        // Custom resets
        selectedSectorLabel.innerText = selectedSectorLabel.getAttribute('data-default');
        selectedSectorLabel.style.color = "var(--color-tactical-gray)";
        selectedSectorLabel.style.fontWeight = "normal";
        
        selectOptions.forEach(opt => opt.classList.remove('selected'));
        nativeSelect.value = '';

        coolingHiddenInput.value = 'off';
        segmentButtons.forEach(b => b.classList.remove('active'));
        segmentButtons[0].classList.add('active');

        resonanceReadout.innerText = '100';

        // Diagnostics
        logConsole.innerHTML = '';
        logToConsole('M-19 CONSOLE RESET INITIATED.');
        logToConsole('ALL HARDWARE REGISTERS RESET.');
        logToConsole('INPUT DETECTOR RE-ENGAGED. AWAITING DATA.');

        // Console indicator reset
        statusDot.className = "status-indicator pulsing";
        statusDot.style.backgroundColor = "var(--color-accent-amber)";
        statusText.innerText = "CONSOLE STATE: OPERATIONAL";

        updateProgressIndicators();
    });

    // --- RUN INITIAL GAUGE ADJUSTMENT ---
    updateProgressIndicators();
});
