/* ==========================================================================
   ADVANCED METAL SURFACE TECHNOLOGY INTERFACE - CONTROLLER LOGIC (FORM-05)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       01. AUDIO SYNTHESIZER (Native Web Audio API Sci-Fi Sound FX)
       -------------------------------------------------------------------------- */
    let audioCtx = null;

    // Helper to initialize AudioContext on user gesture
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Play synthesized sound effects
    function playSound(type) {
        // Check if audio cues are enabled via the toggle switch
        const audioEnabled = document.getElementById('check-audio').checked;
        if (!audioEnabled) return;

        initAudio();
        if (!audioCtx) return;

        // Resume context if suspended (browser security autoplay policies)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        switch (type) {
            case 'click':
                // Tactical short metallic tick
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
                gainNode.gain.setValueAtTime(0.06, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            case 'tick':
                // Small dial rotational click
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(450, now);
                gainNode.gain.setValueAtTime(0.04, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
                osc.start(now);
                osc.stop(now + 0.02);
                break;

            case 'toggle':
                // Short retro pitch sweep up
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
                break;

            case 'reset':
                // De-energize reverse sweep
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.linearRampToValueAtTime(60, now + 0.25);
                gainNode.gain.setValueAtTime(0.08, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
                break;

            case 'success':
                // Gorgeous mechanical engine power-up hum & chime
                // Tone 1
                osc.type = 'sine';
                osc.frequency.setValueAtTime(261.63, now); // C4
                osc.frequency.setValueAtTime(329.63, now + 0.1); // E4
                osc.frequency.setValueAtTime(392.00, now + 0.2); // G4
                osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.4); // C5
                gainNode.gain.setValueAtTime(0.08, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);

                // Supporting resonant low frequency harmonic engine hum
                const oscHum = audioCtx.createOscillator();
                const gainHum = audioCtx.createGain();
                oscHum.type = 'triangle';
                oscHum.frequency.setValueAtTime(65.41, now); // C2
                oscHum.frequency.linearRampToValueAtTime(130.81, now + 0.6); // C3
                gainHum.gain.setValueAtTime(0.06, now);
                gainHum.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
                oscHum.connect(gainHum);
                gainHum.connect(audioCtx.destination);
                oscHum.start(now);
                oscHum.stop(now + 0.7);
                break;

            case 'alert':
                // Short hazard warning buzz
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, now);
                gainNode.gain.setValueAtTime(0.08, now);
                gainNode.gain.linearRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
        }
    }


    /* --------------------------------------------------------------------------
       02. ACTIVE TELEMETRY TERMINAL FEED
       -------------------------------------------------------------------------- */
    const logScreen = document.getElementById('log-screen');

    function logTelemetry(text, type = 'info') {
        const time = new Date().toLocaleTimeString().split(' ')[0];
        const line = document.createElement('div');
        line.className = `log-line text-${type}`;
        line.textContent = `[${time}] ${text}`;
        logScreen.appendChild(line);
        logScreen.scrollTop = logScreen.scrollHeight;
    }


    /* --------------------------------------------------------------------------
       03. ROTARY DIAL LOGIC (Trigonometric Drag and Scroll Handlers)
       -------------------------------------------------------------------------- */
    const dials = [
        {
            plate: document.getElementById('dial-frequency'),
            readout: document.getElementById('readout-frequency'),
            minVal: 100,
            maxVal: 800,
            unit: ' MHz',
            currVal: 400,
            label: 'CORE FREQUENCY',
            id: 'frequency'
        },
        {
            plate: document.getElementById('dial-voltage'),
            readout: document.getElementById('readout-voltage'),
            minVal: 0.80,
            maxVal: 1.80,
            unit: ' V',
            currVal: 1.20,
            decimals: 2,
            label: 'CORE VOLTAGE FLUX',
            id: 'voltage'
        }
    ];

    dials.forEach(dial => {
        let isDragging = false;
        let startAngle = 0;
        let startRotation = 0;

        // Convert current value to degree rotation (-135deg to +135deg)
        function valToDeg(val) {
            const percent = (val - dial.minVal) / (dial.maxVal - dial.minVal);
            return (percent * 270) - 135;
        }

        // Convert degree rotation to value
        function degToVal(deg) {
            // Constrain degrees between -135 and +135
            const constrained = Math.max(-135, Math.min(135, deg));
            const percent = (constrained + 135) / 270;
            const rawVal = dial.minVal + (percent * (dial.maxVal - dial.minVal));
            
            if (dial.decimals) {
                return parseFloat(rawVal.toFixed(dial.decimals));
            }
            return Math.round(rawVal);
        }

        // Set initial visual position
        let currentRotation = valToDeg(dial.currVal);
        dial.plate.style.transform = `rotate(${currentRotation}deg)`;

        // Calculate angle of coordinate point relative to center of dial element
        function getAngle(clientX, clientY) {
            const rect = dial.plate.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = clientX - centerX;
            const dy = clientY - centerY;
            // atan2 returns radians, convert to degrees
            return Math.atan2(dy, dx) * (180 / Math.PI);
        }

        function updateDialValue(val) {
            if (val === dial.currVal) return;
            dial.currVal = val;
            dial.plate.setAttribute('aria-valuenow', val);
            dial.readout.textContent = val.toFixed(dial.decimals || 0);

            // Trigger a soft sound cue
            playSound('tick');
            logTelemetry(`${dial.label} calibrated to ${val}${dial.unit}`, 'warn');
            calculateProgress();
        }

        // Drag handlers
        function onMouseDown(e) {
            initAudio();
            isDragging = true;
            dial.plate.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';

            startAngle = getAngle(e.clientX, e.clientY);
            startRotation = currentRotation;

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            playSound('click');
        }

        function onMouseMove(e) {
            if (!isDragging) return;
            const currentAngle = getAngle(e.clientX, e.clientY);
            let angleDiff = currentAngle - startAngle;

            // Handle wrapping quadrant boundary
            if (angleDiff < -180) angleDiff += 360;
            if (angleDiff > 180) angleDiff -= 360;

            let newRotation = startRotation + angleDiff;
            // Cap visual spin boundaries
            newRotation = Math.max(-135, Math.min(135, newRotation));
            
            dial.plate.style.transform = `rotate(${newRotation}deg)`;
            currentRotation = newRotation;

            const newVal = degToVal(newRotation);
            updateDialValue(newVal);
        }

        function onMouseUp() {
            isDragging = false;
            dial.plate.style.cursor = 'grab';
            document.body.style.userSelect = 'auto';

            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }

        // Bind drag listeners
        dial.plate.addEventListener('mousedown', onMouseDown);

        // Bind Touch listeners for mobile compatibility
        dial.plate.addEventListener('touchstart', (e) => {
            initAudio();
            isDragging = true;
            const touch = e.touches[0];
            startAngle = getAngle(touch.clientX, touch.clientY);
            startRotation = currentRotation;

            const touchMoveHandler = (ev) => {
                if (!isDragging) return;
                const t = ev.touches[0];
                const currentAngle = getAngle(t.clientX, t.clientY);
                let angleDiff = currentAngle - startAngle;

                if (angleDiff < -180) angleDiff += 360;
                if (angleDiff > 180) angleDiff -= 360;

                let newRotation = startRotation + angleDiff;
                newRotation = Math.max(-135, Math.min(135, newRotation));
                dial.plate.style.transform = `rotate(${newRotation}deg)`;
                currentRotation = newRotation;

                const newVal = degToVal(newRotation);
                updateDialValue(newVal);
            };

            const touchEndHandler = () => {
                isDragging = false;
                window.removeEventListener('touchmove', touchMoveHandler);
                window.removeEventListener('touchend', touchEndHandler);
            };

            window.addEventListener('touchmove', touchMoveHandler, { passive: false });
            window.addEventListener('touchend', touchEndHandler);
        });

        // Mousewheel scrolling support for easy adjustments
        dial.plate.parentElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            initAudio();
            const step = dial.decimals ? 0.05 : 10;
            // Scroll direction
            const direction = e.deltaY < 0 ? 1 : -1;
            let newVal = dial.currVal + (direction * step);
            newVal = Math.max(dial.minVal, Math.min(dial.maxVal, newVal));
            
            if (dial.decimals) {
                newVal = parseFloat(newVal.toFixed(dial.decimals));
            }

            currentRotation = valToDeg(newVal);
            dial.plate.style.transform = `rotate(${currentRotation}deg)`;
            updateDialValue(newVal);
        }, { passive: false });

        // Keyboard Arrow accessibility support
        dial.plate.addEventListener('keydown', (e) => {
            let handled = false;
            const step = dial.decimals ? 0.01 : 5;
            let newVal = dial.currVal;

            if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
                newVal = Math.min(dial.maxVal, dial.currVal + step);
                handled = true;
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
                newVal = Math.max(dial.minVal, dial.currVal - step);
                handled = true;
            }

            if (handled) {
                e.preventDefault();
                if (dial.decimals) newVal = parseFloat(newVal.toFixed(dial.decimals));
                currentRotation = valToDeg(newVal);
                dial.plate.style.transform = `rotate(${currentRotation}deg)`;
                updateDialValue(newVal);
            }
        });
    });


    /* --------------------------------------------------------------------------
       04. HIGH-TECH CUSTOM SELECT DROPDOWN
       -------------------------------------------------------------------------- */
    const selectTrigger = document.getElementById('select-trigger');
    const selectDropdown = document.getElementById('select-dropdown');
    const selectBox = document.getElementById('core-selector');
    const coreValInput = document.getElementById('select-core-value');
    const options = selectDropdown.querySelectorAll('.select-option');

    selectTrigger.addEventListener('click', (e) => {
        initAudio();
        e.stopPropagation();
        const isOpen = selectBox.classList.contains('open');
        closeAllDropdowns();
        
        if (!isOpen) {
            selectBox.classList.add('open');
            playSound('click');
        } else {
            playSound('click');
        }
    });

    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const val = option.getAttribute('data-value');
            const text = option.textContent;

            // Update display states
            options.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectTrigger.querySelector('.trigger-text').textContent = text;
            coreValInput.value = val;
            
            // Dispatch dynamic change event for completion progress
            coreValInput.dispatchEvent(new Event('change'));

            selectBox.classList.remove('open');
            playSound('toggle');
            logTelemetry(`Host Emulation Core selected: ${text}`, 'info');
            calculateProgress();
        });
    });

    // Close select on external clicking
    document.addEventListener('click', () => {
        closeAllDropdowns();
    });

    function closeAllDropdowns() {
        selectBox.classList.remove('open');
    }


    /* --------------------------------------------------------------------------
       05. DYNAMIC INTERACTIVE SWITCHES, RADIOS & SLIDERS
       -------------------------------------------------------------------------- */
    // Subsystem Checkboxes
    const telemetryCheck = document.getElementById('check-telemetry');
    const audioCheck = document.getElementById('check-audio');
    const bypassCheck = document.getElementById('check-bypass');

    telemetryCheck.addEventListener('change', () => {
        playSound('toggle');
        logTelemetry(`Telemetry Output Streaming: ${telemetryCheck.checked ? 'ENABLED' : 'MUTED'}`);
        calculateProgress();
    });

    audioCheck.addEventListener('change', () => {
        // Try enabling Audio Context on change
        if (audioCheck.checked) {
            initAudio();
        }
        playSound('toggle');
        logTelemetry(`Audible Sound Feedback Interface: ${audioCheck.checked ? 'ENABLED' : 'MUTED'}`);
        calculateProgress();
    });

    bypassCheck.addEventListener('change', () => {
        if (bypassCheck.checked) {
            playSound('alert');
            logTelemetry('WARNING: Overclock protection bypass engaged. Subsystem bounds disabled!', 'error');
        } else {
            playSound('toggle');
            logTelemetry('Normal system governors fully active.', 'info');
        }
        calculateProgress();
    });

    // Operational Level Radios
    const radioLevels = document.querySelectorAll('input[name="power-level"]');
    radioLevels.forEach(radio => {
        radio.addEventListener('change', () => {
            playSound('toggle');
            const label = radio.parentElement.querySelector('.radio-label-text').textContent;
            
            if (radio.value === 'overclock') {
                playSound('alert');
                logTelemetry(`INTEGRITY WARNING: Core shifted into ${label}. Higher operational heat limits!`, 'error');
            } else {
                logTelemetry(`Subsystem operating level altered: ${label}`, 'info');
            }
            calculateProgress();
        });
    });

    // Memory Slider Input
    const memSlider = document.getElementById('range-memory');
    const memReadout = document.getElementById('readout-memory');

    memSlider.addEventListener('input', () => {
        const val = memSlider.value;
        memReadout.textContent = val;
        playSound('tick');
    });

    memSlider.addEventListener('change', () => {
        const val = memSlider.value;
        logTelemetry(`Telemetry buffer limit locked: ${val} Gigabytes`, 'info');
        calculateProgress();
    });


    /* --------------------------------------------------------------------------
       06. PASSKEY VISIBILITY & DYNAMIC INTEGRITY STRENGTH METER
       -------------------------------------------------------------------------- */
    const passInput = document.getElementById('input-passkey');
    const togglePassBtn = document.getElementById('btn-toggle-pass');
    const strengthFill = document.getElementById('strength-fill');

    togglePassBtn.addEventListener('click', () => {
        initAudio();
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        playSound('click');
        logTelemetry(`Key visibility state: ${isPass ? 'REVEALED' : 'MASKED'}`);
    });

    passInput.addEventListener('input', () => {
        const pass = passInput.value;
        let score = 0;

        if (pass.length > 4) score += 20;
        if (pass.length > 8) score += 20;
        if (/[A-Z]/.test(pass)) score += 20;
        if (/[0-9]/.test(pass)) score += 20;
        if (/[^A-Za-z0-9]/.test(pass)) score += 20;

        // Apply strength color states
        strengthFill.style.width = `${score}%`;
        if (score <= 40) {
            strengthFill.style.backgroundColor = 'var(--led-glow-red)';
        } else if (score <= 80) {
            strengthFill.style.backgroundColor = 'orange';
        } else {
            strengthFill.style.backgroundColor = 'var(--led-glow-blue)';
            strengthFill.style.boxShadow = '0 0 8px var(--led-glow-blue)';
        }
        calculateProgress();
    });

    // Logging text inputs on blur (unfocused)
    const sigInput = document.getElementById('input-sig');
    sigInput.addEventListener('change', () => {
        logTelemetry(`System signature set to: PILOT-${sigInput.value.toUpperCase()}`, 'info');
        calculateProgress();
    });


    /* --------------------------------------------------------------------------
       07. HUD PROGRESS INTEGRATION STATUS
       -------------------------------------------------------------------------- */
    const progressText = document.getElementById('progress-text');
    const progressLED = document.getElementById('progress-led-bar');

    function calculateProgress() {
        let itemsFilled = 0;
        let totalItems = 7;

        // Field 1: Sign Check
        if (sigInput.value.trim() !== '') itemsFilled++;
        
        // Field 2: Passkey Check
        if (passInput.value.length >= 6) itemsFilled++;

        // Field 3: Select Core
        if (coreValInput.value !== '') itemsFilled++;

        // Field 4: Sliders & Dials (Adjustments from standard default is treated as progress)
        const freqDial = dials.find(d => d.id === 'frequency');
        if (freqDial && freqDial.currVal !== 400) itemsFilled++;

        const voltDial = dials.find(d => d.id === 'voltage');
        if (voltDial && voltDial.currVal !== 1.20) itemsFilled++;

        // Field 5: Buffer Allocation
        if (memSlider.value !== '16') itemsFilled++;

        // Field 6: Subsystem Switch checked
        if (bypassCheck.checked) itemsFilled++;

        const percent = Math.round((itemsFilled / totalItems) * 100);
        // Base minimum progress of 20% to look calibrated
        const finalPercent = Math.max(20, Math.min(100, percent));
        
        progressText.textContent = `${finalPercent}%`;
        progressLED.style.width = `${finalPercent}%`;
    }


    /* --------------------------------------------------------------------------
       08. DIAGNOSTIC CALIBRATION SUBMISSION OVERLAY (Modal logs & files)
       -------------------------------------------------------------------------- */
    const form = document.getElementById('calibration-form');
    const resetBtn = document.getElementById('btn-purge-protocol');
    const overlay = document.getElementById('calibration-overlay');
    const closeOverlayBtn = document.getElementById('btn-close-overlay');
    const downloadConfigBtn = document.getElementById('btn-download-config');

    form.addEventListener('submit', (e) => {
        initAudio();
        playSound('success');

        // Compile fields data
        const signature = `PILOT-${sigInput.value.toUpperCase()}`;
        const targetCoreName = selectTrigger.querySelector('.trigger-text').textContent;
        const coreFreq = dials.find(d => d.id === 'frequency').currVal;
        const coreVolt = dials.find(d => d.id === 'voltage').currVal;
        const memBuffer = memSlider.value;
        const powerMode = document.querySelector('input[name="power-level"]:checked').parentElement.querySelector('.radio-label-text').textContent;

        // Fill Diagnostic HUD overlay elements
        document.getElementById('diag-sig').textContent = signature;
        document.getElementById('diag-core').textContent = targetCoreName;
        document.getElementById('diag-freq').textContent = `${coreFreq} MHz`;
        document.getElementById('diag-volt').textContent = `${coreVolt} V`;
        document.getElementById('diag-mem').textContent = `${memBuffer} GB`;

        // Open screen
        overlay.classList.add('open');
        logTelemetry('Telemetry complete. Displaying diagnostic logs.', 'info');

        // Play interactive compile logs inside overlay
        animateSuccessCompilation(signature, targetCoreName, coreFreq, coreVolt, memBuffer, powerMode);
    });

    function animateSuccessCompilation(sig, core, freq, volt, mem, power) {
        const modalLog = document.getElementById('modal-log-screen');
        modalLog.textContent = ''; // Clear prior logs

        const logs = [
            `[TELEMETRY] Initiating final manifest compilation protocol...`,
            `[TELEMETRY] OPERATOR SECURE SIGNATURE ID: ${sig}`,
            `[TELEMETRY] SYSTEM VECTORS: Core=${core} Mode=${power}`,
            `[TELEMETRY] PERFORMANCE SPECS: Clock=${freq}MHz Bus=${volt}V Buffer=${mem}GB`,
            `[COMPILER] Calibrating high-surface metallic alignment sensors...`,
            `[COMPILER] Checking core thermal distribution... NORMAL (38°C)`,
            `[COMPILER] Overclock security boundaries verified... LOCKED`,
            `[SUCCESS] Simulation config parsed successfully into YAML register.`,
            `[SUCCESS] Emulation host core engine started! READY FOR TELEMETRY FLUX.`
        ];

        let index = 0;
        function printNextLog() {
            if (index < logs.length) {
                modalLog.textContent += logs[index] + '\n';
                modalLog.scrollTop = modalLog.scrollHeight;
                playSound('tick');
                index++;
                setTimeout(printNextLog, 250);
            }
        }
        printNextLog();
    }

    // Dismiss diagnostic overlay screen
    closeOverlayBtn.addEventListener('click', () => {
        initAudio();
        overlay.classList.remove('open');
        playSound('click');
        logTelemetry('Diagnostic console overlay closed.', 'info');
    });

    // Reset Form Calibration Purge Button
    resetBtn.addEventListener('click', () => {
        initAudio();
        playSound('reset');
        
        // Custom reset triggers for form & custom elements
        form.reset();

        // Reset dials to default positions
        dials.forEach(dial => {
            const defaultVal = dial.id === 'frequency' ? 400 : 1.20;
            dial.currVal = defaultVal;
            dial.plate.setAttribute('aria-valuenow', defaultVal);
            dial.readout.textContent = defaultVal.toFixed(dial.decimals || 0);
            // Calculate base degree
            const percent = (defaultVal - dial.minVal) / (dial.maxVal - dial.minVal);
            const deg = (percent * 270) - 135;
            dial.plate.style.transform = `rotate(${deg}deg)`;
        });

        // Reset dropdown
        selectTrigger.querySelector('.trigger-text').textContent = 'Core-Alpha (System Hub)';
        coreValInput.value = 'alpha';
        options.forEach(opt => {
            opt.classList.remove('active');
            if (opt.getAttribute('data-value') === 'alpha') opt.classList.add('active');
        });

        // Reset text boxes and strength bars
        strengthFill.style.width = '0%';
        memReadout.textContent = '16';

        logScreen.innerHTML = ''; // Clear terminal logs
        logTelemetry('SYSTEM HARD PURGE INITIALIZED. Calibrations reset.', 'error');
        calculateProgress();
    });

    // Download Config Telemetry File dynamically
    downloadConfigBtn.addEventListener('click', () => {
        initAudio();
        playSound('click');

        const signature = `PILOT-${sigInput.value.toUpperCase()}`;
        const targetCoreName = selectTrigger.querySelector('.trigger-text').textContent;
        const coreFreq = dials.find(d => d.id === 'frequency').currVal;
        const coreVolt = dials.find(d => d.id === 'voltage').currVal;
        const memBuffer = memSlider.value;
        const powerMode = document.querySelector('input[name="power-level"]:checked').value;
        const extensionCode = document.getElementById('area-manifest').value;

        // Compose file content in YAML telemetry format
        const manifestContent = `# ADVANCED INTERFACE CORE MANIFEST
# COMPILED BY AESTHETIC MISTAKES CONFIGURATION ENGINE
---
metadata:
  signature: "${signature}"
  protocol_class: "05"
  compiled_at: "${new Date().toISOString()}"

engine_core:
  host: "${targetCoreName}"
  power_integrity: "${powerMode}"
  frequency: ${coreFreq}  # MHz
  voltage: ${coreVolt}    # Volts
  memory_buffer_gb: ${memBuffer}

options:
  stream_telemetry: ${telemetryCheck.checked}
  audible_synthesizer: ${audioCheck.checked}
  bypass_limits: ${bypassCheck.checked}

extensions: |
  ${extensionCode.replace(/\n/g, '\n  ')}
`;

        const blob = new Blob([manifestContent], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `core_manifest_${sigInput.value.toLowerCase() || 'telemetry'}.yaml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        logTelemetry('Configuration YAML manifest compiled and downloaded.', 'info');
    });

});
