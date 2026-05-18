/* ==========================================================================
   TACTICAL SKEUOMORPHIC LOGIC ENGINE - CONSOLE S-18
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const calibrationForm = document.getElementById('skeuo-calibration-form');
    
    // Identity elements
    const operatorSigInput = document.getElementById('operator-signature');
    const loadInput = document.getElementById('load-coefficient');
    const btnLoadMinus = document.getElementById('btn-load-minus');
    const btnLoadPlus = document.getElementById('btn-load-plus');
    
    // Dropdown elements
    const bandSelectContainer = document.getElementById('band-select-container');
    const selectTrigger = bandSelectContainer.querySelector('.select-trigger');
    const selectSelectedLabel = bandSelectContainer.querySelector('.select-selected-label');
    const selectOptions = bandSelectContainer.querySelectorAll('.option-item');
    const nativeSelect = bandSelectContainer.querySelector('.native-hidden-select');
    
    // Segmented tabs
    const powerTabsContainer = document.getElementById('power-segmented-tabs');
    const powerTabs = powerTabsContainer.querySelectorAll('.segment-tab');
    const powerStateInput = document.getElementById('power-state-input');
    
    // Toggles
    const toggleThermal = document.getElementById('toggle-thermal');
    const toggleGrav = document.getElementById('toggle-grav');
    
    // Single Slider
    const rangeResonance = document.getElementById('range-resonance');
    const tooltipResonance = document.getElementById('tooltip-resonance');
    
    // Dual Slider
    const dualFrequencyWidget = document.getElementById('dual-range-frequency');
    const freqMinHandle = document.getElementById('freq-min-handle');
    const freqMaxHandle = document.getElementById('freq-max-handle');
    const freqMinBubble = document.getElementById('bubble-min');
    const freqMaxBubble = document.getElementById('bubble-max');
    const frequencyActiveTrack = document.getElementById('frequency-active-track');
    const freqMinInput = document.getElementById('freq-min-input');
    const freqMaxInput = document.getElementById('freq-max-input');
    
    // Rotary Knobs
    const knobSpin = document.getElementById('knob-spin');
    const knobAmp = document.getElementById('knob-amp');
    const bubbleKnobSpin = document.getElementById('bubble-knob-spin');
    const bubbleKnobAmp = document.getElementById('bubble-knob-amp');
    const inputKnobSpin = document.getElementById('input-knob-spin');
    const inputKnobAmp = document.getElementById('input-knob-amp');
    
    // Telemetry Scope & Terminal Logger
    const logConsole = document.getElementById('log-console');
    const valFluxX = document.getElementById('val-flux-x');
    const valFluxY = document.getElementById('val-flux-y');
    
    // Action panel
    const btnBail = document.getElementById('btn-bail');
    const btnReset = document.getElementById('btn-reset');
    
    // Overlay Drawer
    const calibrationOverlay = document.getElementById('calibration-overlay');
    const btnCloseTicket = document.getElementById('btn-close-ticket');

    // Ticket text nodes
    const tSignature = document.getElementById('t-signature');
    const tLoad = document.getElementById('t-load');
    const tBand = document.getElementById('t-band');
    const tPower = document.getElementById('t-power');
    const tThermal = document.getElementById('t-thermal');
    const tGravity = document.getElementById('t-gravity');
    const tResonance = document.getElementById('t-resonance');
    const tFreq = document.getElementById('t-freq');
    const tSpin = document.getElementById('t-spin');
    const tAmp = document.getElementById('t-amp');
    const tStab = document.getElementById('t-stab');
    const tDamp = document.getElementById('t-damp');
    const tStance = document.getElementById('t-stance');
    const ticketTime = document.getElementById('ticket-time');
    const ticketId = document.getElementById('ticket-id');


    // ==========================================================================
    // TERMINAL LOG HELPER
    // ==========================================================================
    function addLog(text, isAlert = false) {
        const line = document.createElement('div');
        line.className = 'log-line';
        if (isAlert) {
            line.style.color = 'var(--color-orange)';
            line.style.fontWeight = '800';
        }
        line.textContent = `> ${text.toUpperCase()}`;
        logConsole.appendChild(line);
        logConsole.scrollTop = logConsole.scrollHeight;
    }


    // ==========================================================================
    // STEPPER LOGIC (LOAD WEIGHT)
    // ==========================================================================
    btnLoadMinus.addEventListener('click', () => {
        let val = parseInt(loadInput.value, 10);
        const min = parseInt(loadInput.min, 10);
        if (val > min) {
            val -= 5;
            loadInput.value = val;
            addLog(`LOAD DEDUCTED: ${val} KG`);
        }
    });

    btnLoadPlus.addEventListener('click', () => {
        let val = parseInt(loadInput.value, 10);
        const max = parseInt(loadInput.max, 10);
        if (val < max) {
            val += 5;
            loadInput.value = val;
            addLog(`LOAD INCREASED: ${val} KG`);
        }
    });


    // ==========================================================================
    // CUSTOM DROPDOWN SELECT
    // ==========================================================================
    selectTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        bandSelectContainer.classList.toggle('open');
    });

    selectOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const val = opt.getAttribute('data-value');
            const label = opt.textContent.replace('▶', '').trim();
            
            // Highlight selected option
            selectOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            
            // Set trigger text and hidden select
            selectSelectedLabel.textContent = label;
            nativeSelect.value = val;
            
            addLog(`OPERATIONAL BAND SWITCHED: [${val.toUpperCase()}]`);
            bandSelectContainer.classList.remove('open');
        });
    });

    // Close select drawer if clicking outside
    document.addEventListener('click', () => {
        bandSelectContainer.classList.remove('open');
    });


    // ==========================================================================
    // POWER SEGMENTED CONTROLS
    // ==========================================================================
    powerTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const val = tab.getAttribute('data-value');
            
            powerTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            powerStateInput.value = val;
            
            if (val === 'on') {
                addLog('MAIN POWER SOURCE ACTIVE', false);
            } else {
                addLog('MAIN POWER SOURCE DEACTIVATED', true);
            }
        });
    });


    // ==========================================================================
    // LINE TOGGLE SWITCHES
    // ==========================================================================
    toggleThermal.addEventListener('change', () => {
        const state = toggleThermal.checked ? 'ENGAGED' : 'DISENGAGED';
        addLog(`THERMAL BOOST RELAY: [${state}]`);
    });

    toggleGrav.addEventListener('change', () => {
        const state = toggleGrav.checked ? 'ENGAGED' : 'DISENGAGED';
        addLog(`GRAVITY DEFLATOR COIL: [${state}]`, !toggleGrav.checked);
    });


    // ==========================================================================
    // SINGLE RANGE SLIDER (RESONANCE)
    // ==========================================================================
    function updateSingleSliderTooltip() {
        const val = parseInt(rangeResonance.value, 10);
        const min = parseInt(rangeResonance.min, 10);
        const max = parseInt(rangeResonance.max, 10);
        
        tooltipResonance.textContent = `${val} dB`;
        
        // Calculate absolute offset of handle to align speech bubble
        const percent = (val - min) / (max - min);
        // Correct thumb diameter shift (thumb width = 22px)
        tooltipResonance.style.left = `calc(${percent * 100}% - ${(percent - 0.5) * 22}px)`;
    }

    rangeResonance.addEventListener('input', () => {
        updateSingleSliderTooltip();
    });

    rangeResonance.addEventListener('change', () => {
        addLog(`RESONANCE FIELD MODULATION: ${rangeResonance.value} dB`);
    });

    // Initialize tooltip
    updateSingleSliderTooltip();


    // ==========================================================================
    // DUAL RANGE SLIDER LOGIC (FREQUENCY BOUNDS)
    // ==========================================================================
    // Limits
    const freqMinLimit = 100;
    const freqMaxLimit = 800;
    const minSpacing = 50; // Buffer space to prevent handle overlap
    
    // State
    let currentMinVal = 200;
    let currentMaxVal = 450;

    function updateDualSliderWidget() {
        const trackWidth = dualFrequencyWidget.clientWidth;
        
        // Map values to percent
        const minPct = (currentMinVal - freqMinLimit) / (freqMaxLimit - freqMinLimit);
        const maxPct = (currentMaxVal - freqMinLimit) / (freqMaxLimit - freqMinLimit);
        
        // Update handle positions
        freqMinHandle.style.left = `${minPct * 100}%`;
        freqMaxHandle.style.left = `${maxPct * 100}%`;
        
        // Update bubble text values
        freqMinBubble.textContent = `${currentMinVal} Hz`;
        freqMaxBubble.textContent = `${currentMaxVal} Hz`;
        
        // Update center highlighted active bar track
        frequencyActiveTrack.style.left = `${minPct * 100}%`;
        frequencyActiveTrack.style.width = `${(maxPct - minPct) * 100}%`;
        
        // Write values to hidden form selectors
        freqMinInput.value = currentMinVal;
        freqMaxInput.value = currentMaxVal;
    }

    // Interactive Drag handlers for Dual Sliders
    function initDualHandleDrag(handle, type) {
        let isDragging = false;
        
        const dragStart = (e) => {
            e.preventDefault();
            isDragging = true;
            document.body.style.cursor = 'grabbing';
            handle.style.cursor = 'grabbing';
        };
        
        const dragMove = (e) => {
            if (!isDragging) return;
            
            // Get drag position relative to widget bounds
            const rect = dualFrequencyWidget.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const offsetX = clientX - rect.left;
            
            // Clamp percentage [0, 1]
            let pct = offsetX / rect.width;
            if (pct < 0) pct = 0;
            if (pct > 1) pct = 1;
            
            // Calculate corresponding frequency
            let freqVal = Math.round(freqMinLimit + pct * (freqMaxLimit - freqMinLimit));
            
            if (type === 'min') {
                // Bounds checks
                if (freqVal > currentMaxVal - minSpacing) {
                    freqVal = currentMaxVal - minSpacing;
                }
                currentMinVal = freqVal;
            } else {
                if (freqVal < currentMinVal + minSpacing) {
                    freqVal = currentMinVal + minSpacing;
                }
                currentMaxVal = freqVal;
            }
            
            updateDualSliderWidget();
        };
        
        const dragEnd = () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = 'default';
                handle.style.cursor = 'grab';
                addLog(`FREQ CONDUIT DOCKED: [${currentMinVal}Hz - ${currentMaxVal}Hz]`);
            }
        };

        // Bind Mouse
        handle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
        
        // Bind Touch
        handle.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('touchend', dragEnd);
    }

    // Initialize drag logic
    initDualHandleDrag(freqMinHandle, 'min');
    initDualHandleDrag(freqMaxHandle, 'max');
    
    // Trigger initial positioning
    updateDualSliderWidget();


    // ==========================================================================
    // ROTARY KNOB DIALS (SPIN FLUX & AMPLITUDE LEVEL)
    // ==========================================================================
    function initKnobLogic(knob, tooltip, input, callback) {
        let isDragging = false;
        let startY = 0;
        let startVal = parseInt(knob.getAttribute('data-value'), 10);
        
        const minVal = parseInt(knob.getAttribute('data-min'), 10);
        const maxVal = parseInt(knob.getAttribute('data-max'), 10);
        
        const dragStart = (e) => {
            e.preventDefault();
            isDragging = true;
            startY = e.touches ? e.touches[0].clientY : e.clientY;
            startVal = parseInt(knob.getAttribute('data-value'), 10);
            document.body.style.cursor = 'ns-resize';
            knob.style.cursor = 'grabbing';
        };
        
        const dragMove = (e) => {
            if (!isDragging) return;
            
            const currentY = e.touches ? e.touches[0].clientY : e.clientY;
            const deltaY = startY - currentY; // Upward drag increases value
            
            // Adjust sensitivity (drag 150px to cover full [0, 100] range)
            const sensitivity = 0.65;
            let val = Math.round(startVal + (deltaY * sensitivity));
            
            // Clamp bounds
            if (val < minVal) val = minVal;
            if (val > maxVal) val = maxVal;
            
            // Save state attributes
            knob.setAttribute('data-value', val);
            input.value = val;
            
            // Rotate dial visually
            // Standard skeuo knob rotations span from -135deg (min) to +135deg (max)
            const anglePct = (val - minVal) / (maxVal - minVal);
            const degree = -135 + (anglePct * 270);
            knob.style.transform = `rotate(${degree}deg)`;
            
            // Update tooltip bubble
            tooltip.textContent = `${val}%`;
            
            if (callback) callback(val);
        };
        
        const dragEnd = () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = 'default';
                knob.style.cursor = 'grab';
                addLog(`ROTARY FIELD STABILIZED: ${knob.id.replace('knob-', '').toUpperCase()} AT ${knob.getAttribute('data-value')}%`);
            }
        };

        // Bind Mouse
        knob.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
        
        // Bind Touch
        knob.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('touchend', dragEnd);

        // Position rotation angle initially
        const anglePct = (startVal - minVal) / (maxVal - minVal);
        const degree = -135 + (anglePct * 270);
        knob.style.transform = `rotate(${degree}deg)`;
        tooltip.textContent = `${startVal}%`;
    }

    // Initialize our two premium dials
    initKnobLogic(knobSpin, bubbleKnobSpin, inputKnobSpin);
    initKnobLogic(knobAmp, bubbleKnobAmp, inputKnobAmp);


    // ==========================================================================
    // OSCILLOSCOPE MONITOR READOUT FLUCUATOR
    // ==========================================================================
    setInterval(() => {
        // Random fluctuations to coordinate readouts (+/- 10)
        let cx = parseInt(valFluxX.textContent, 10);
        let cy = parseInt(valFluxY.textContent, 10);
        
        cx += Math.floor(Math.random() * 5) - 2;
        cy += Math.floor(Math.random() * 5) - 2;
        
        // Clamp values to keep it visually stable
        if (cx < 10) cx = 15;
        if (cx > 90) cx = 85;
        if (cy < -60) cy = -55;
        if (cy > 10) cy = 5;
        
        valFluxX.textContent = cx;
        valFluxY.textContent = cy;
    }, 850);


    // ==========================================================================
    // ACTIONS & EMERGENCY BAIL
    // ==========================================================================
    btnBail.addEventListener('click', () => {
        addLog('CRITICAL WARN: EMERGENCY SHUTDOWN ENGAGED!', true);
        addLog('DECOUPLING STABILITY LOOPS...', true);
        
        // Disengage all checkboxes & toggles
        toggleThermal.checked = false;
        toggleGrav.checked = false;
        
        document.querySelectorAll('.checkbox-collection-column input').forEach(box => {
            box.checked = false;
        });
        
        // Trigger a console alert overlay flash
        document.body.style.backgroundColor = '#f2dfdb';
        setTimeout(() => {
            document.body.style.backgroundColor = 'var(--bg-canvas)';
        }, 300);
        
        addLog('SYSTEM RELAYS SAFE. TERMINAL LOCKDOWN STABLE.');
    });

    btnReset.addEventListener('click', () => {
        // Trigger a nice 360 degree spin on reset reload icon
        const svgIcon = btnReset.querySelector('.reset-icon-svg');
        svgIcon.classList.add('rotating');
        setTimeout(() => {
            svgIcon.classList.remove('rotating');
        }, 400);

        // Reset text / number inputs
        operatorSigInput.value = '';
        loadInput.value = 80;
        
        // Reset Custom Select
        selectSelectedLabel.textContent = 'BAND ALPHA (OPTIMAL)';
        selectOptions.forEach(o => o.classList.remove('selected'));
        selectOptions[0].classList.add('selected');
        nativeSelect.value = 'alpha';

        // Reset Segmented control state
        powerTabs.forEach(t => t.classList.remove('active'));
        powerTabs[0].classList.add('active');
        powerStateInput.value = 'on';

        // Reset Toggles
        toggleThermal.checked = true;
        toggleGrav.checked = false;

        // Reset Single Slider
        rangeResonance.value = 250;
        updateSingleSliderTooltip();

        // Reset Dual Slider
        currentMinVal = 200;
        currentMaxVal = 450;
        updateDualSliderWidget();

        // Reset Knobs
        knobSpin.setAttribute('data-value', 45);
        inputKnobSpin.value = 45;
        knobSpin.style.transform = 'rotate(-13.5deg)';
        bubbleKnobSpin.textContent = '45%';

        knobAmp.setAttribute('data-value', 72);
        inputKnobAmp.value = 72;
        knobAmp.style.transform = 'rotate(59.4deg)';
        bubbleKnobAmp.textContent = '72%';

        // Reset Checkboxes / Radios
        document.getElementsByName('stability_lock')[0].checked = true;
        document.getElementsByName('fluid_dampener')[0].checked = false;
        document.getElementsByName('stance_tuning')[0].checked = true; // carve

        // Clear console logs
        logConsole.innerHTML = '';
        addLog('CONSOLE RECOVERED. STATUS COLD BOOT COMPLETE.');
    });


    // ==========================================================================
    // FORM COMMIT & CALIBRATION CERTIFICATE TICKET
    // ==========================================================================
    calibrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Quick visual check on signature input
        const signature = operatorSigInput.value.trim();
        if (!signature) {
            operatorSigInput.focus();
            addLog('ERR: SIGNATURE DATA INTEGRITY TIMEOUT', true);
            // Flash input wrapper highlight
            const wrap = operatorSigInput.parentElement;
            wrap.style.backgroundColor = '#f2dfdb';
            setTimeout(() => wrap.style.backgroundColor = '#d8dde2', 300);
            return;
        }

        addLog('COMPILING S-18 SYSTEM METRICS...');
        addLog('CALCULATING ENCRYPTION TELEMETRY STABILITY...');
        
        // Compile Ticket Data Readout
        tSignature.textContent = signature.toUpperCase();
        tLoad.textContent = `${loadInput.value} KG`;
        
        // Band
        const activeBand = nativeSelect.value.toUpperCase();
        tBand.textContent = activeBand;
        
        // Power Mode
        const powerMode = powerStateInput.value.toUpperCase();
        tPower.textContent = powerMode;
        
        // Toggles
        tThermal.textContent = toggleThermal.checked ? 'ACTIVE' : 'INACTIVE';
        tGravity.textContent = toggleGrav.checked ? 'ACTIVE' : 'INACTIVE';
        
        // Sliders
        tResonance.textContent = `${rangeResonance.value} dB`;
        tFreq.textContent = `${currentMinVal} Hz - ${currentMaxVal} Hz`;
        
        // Knobs
        tSpin.textContent = `${knobSpin.getAttribute('data-value')}%`;
        tAmp.textContent = `${knobAmp.getAttribute('data-value')}%`;
        
        // Checkboxes & Radios
        const isStab = document.getElementsByName('stability_lock')[0].checked;
        tStab.textContent = isStab ? 'ACTIVE' : 'INACTIVE';
        
        const isDamp = document.getElementsByName('fluid_dampener')[0].checked;
        tDamp.textContent = isDamp ? 'ACTIVE' : 'INACTIVE';
        
        // Tuning
        const tuningVal = document.querySelector('input[name="stance_tuning"]:checked').value;
        const tuningLabels = {
            carve: 'CARVING WAVE PROFILE',
            velocity: 'VELOCITY STABILITY DECK',
            pro: 'PRO COMP INTEGRATOR'
        };
        tStance.textContent = tuningLabels[tuningVal];

        // Format Date/Time Stamp
        const now = new Date();
        const dateStr = String(now.getDate()).padStart(2, '0') + '-' + 
                        String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                        now.getFullYear();
        ticketTime.textContent = `DATE: ${dateStr}`;
        
        // Generate random unique certificate calibration hash code
        const hashHex = Math.floor(1000 + Math.random() * 9000);
        ticketId.textContent = `HASH: #S18-${hashHex}`;
        
        // Trigger overlays slide
        setTimeout(() => {
            calibrationOverlay.classList.add('open');
            addLog('CALIBRATION COMMITTED: TICKET PRINTED SUCCESSFULLY!');
        }, 450);
    });

    btnCloseTicket.addEventListener('click', () => {
        calibrationOverlay.classList.remove('open');
        addLog('TICKET CLOSED. CONSOLE RETURNING TO TELEMETRY STREAM.');
    });

    // Make dropdown close on Escape keypress
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            calibrationOverlay.classList.remove('open');
            bandSelectContainer.classList.remove('open');
        }
    });

});
