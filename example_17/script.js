/**
 * NAVIGATOR MODEL N-17 CALIBRATION DECK
 * INTERACTIVE BOARD LOGIC
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. SELECTORS & CORE STATE
    // ==========================================================================
    
    // Sliders
    const rangeOllie = document.getElementById("range-ollie");
    const valOllie = document.getElementById("val-ollie");
    const rangeSteez = document.getElementById("range-steez");
    const valSteez = document.getElementById("val-steez");
    
    // Rotary Dials
    const knobSpin = document.getElementById("knob-spin");
    const readoutSpin = document.getElementById("readout-spin");
    const knobBite = document.getElementById("knob-bite");
    const readoutBite = document.getElementById("readout-bite");
    
    // Custom Select Dropdown
    const selectContainer = document.getElementById("stance-select-container");
    const selectTrigger = selectContainer.querySelector(".select-trigger");
    const selectLabel = selectContainer.querySelector(".select-selected-label");
    const optionsList = selectContainer.querySelector(".select-options-list");
    const optionItems = selectContainer.querySelectorAll(".option-item");
    const nativeSelect = selectContainer.querySelector(".native-hidden-select");
    
    // Toggle LEDs & Switches
    const switchSpeed = document.getElementById("switch-speed");
    const ledSpeed = document.getElementById("led-speed");
    const switchGravity = document.getElementById("switch-gravity");
    const ledGravity = document.getElementById("led-gravity");
    const switchButter = document.getElementById("switch-butter");
    const ledButter = document.getElementById("led-butter");
    const switchTraction = document.getElementById("switch-traction");
    const ledTraction = document.getElementById("led-traction");
    
    // Scope & Readouts
    const balanceScope = document.getElementById("balance-scope");
    const targetDotGroup = document.getElementById("scope-target-group");
    const targetDot = document.getElementById("scope-target-dot");
    const targetRing = document.getElementById("scope-target-ring");
    const valXbal = document.getElementById("val-xbal");
    const valYbal = document.getElementById("val-ybal");
    
    // Logs Terminal
    const logConsole = document.getElementById("log-console");
    
    // Actions & Form
    const btnBail = document.getElementById("btn-bail");
    const calibForm = document.getElementById("navigator-calibrator-form");
    const mainPanel = document.getElementById("main-panel");
    
    // Diagnostic Ticket Overlay
    const overlay = document.getElementById("calibration-overlay");
    const btnCloseTicket = document.getElementById("btn-close-ticket");
    
    // Ticket fields
    const tPilot = document.getElementById("t-pilot");
    const tWeight = document.getElementById("t-weight");
    const tStance = document.getElementById("t-stance");
    const tAngle = document.getElementById("t-angle");
    const tBoost = document.getElementById("t-boost");
    const tOllie = document.getElementById("t-ollie");
    const tSteez = document.getElementById("t-steez");
    const tSpin = document.getElementById("t-spin");
    const tBite = document.getElementById("t-bite");
    const ticketTime = document.getElementById("ticket-time");
    const ticketId = document.getElementById("ticket-id");
    
    // Set ticket date dynamically
    const today = new Date();
    const formattedDate = String(today.getDate()).padStart(2, '0') + "-" + 
                          String(today.getMonth() + 1).padStart(2, '0') + "-" + 
                          today.getFullYear();
    ticketTime.textContent = `DATE: ${formattedDate}`;

    // ==========================================================================
    // 2. TERMINAL TELEMETRY LOGGER
    // ==========================================================================
    function logToConsole(message) {
        const timeStamp = new Date().toLocaleTimeString("en-US", { hour12: false });
        const line = document.createElement("div");
        line.className = "log-line";
        line.textContent = `[${timeStamp}] > ${message.toUpperCase()}`;
        logConsole.appendChild(line);
        
        // Keep scroll at bottom
        logConsole.scrollTop = logConsole.scrollHeight;
        
        // Retain only last 30 logs in DOM to prevent bloating
        while (logConsole.childElementCount > 30) {
            logConsole.removeChild(logConsole.firstChild);
        }
    }

    // ==========================================================================
    // 3. RANGE SLIDERS TELEMETRY
    // ==========================================================================
    rangeOllie.addEventListener("input", (e) => {
        const val = e.target.value;
        valOllie.textContent = `${val}%`;
        updateScopeTargetPosition();
    });
    
    rangeOllie.addEventListener("change", (e) => {
        logToConsole(`Ollie threshold set to ${e.target.value}%`);
    });

    rangeSteez.addEventListener("input", (e) => {
        const val = e.target.value;
        valSteez.textContent = `${val}%`;
    });
    
    rangeSteez.addEventListener("change", (e) => {
        logToConsole(`Steez calibration updated to ${e.target.value}%`);
    });

    // ==========================================================================
    // 4. ROTARY DIALS - DRAG CONTROLLERS
    // ==========================================================================
    function setupKnobDrag(knobElement, readoutElement, parameterName) {
        let isDragging = false;
        let startY = 0;
        let startVal = parseInt(knobElement.getAttribute("data-value")) || 50;
        
        // Calculate degree based on 0-100 scale: mapped to -135deg to +135deg
        function setKnobRotation(pct) {
            const deg = -135 + (pct / 100) * 270;
            knobElement.style.transform = `rotate(${deg}deg)`;
            knobElement.setAttribute("data-value", pct);
            readoutElement.textContent = `${pct}%`;
        }
        
        // Initial setup
        setKnobRotation(startVal);
        
        knobElement.addEventListener("mousedown", (e) => {
            isDragging = true;
            startY = e.clientY;
            startVal = parseInt(knobElement.getAttribute("data-value")) || 50;
            document.body.style.userSelect = "none";
            document.body.style.cursor = "grabbing";
        });
        
        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            // Delta Y: dragging up increases, dragging down decreases
            const deltaY = startY - e.clientY;
            // Scale dragging speed: 1.5px drag = 1% value change
            let newVal = startVal + Math.round(deltaY / 1.5);
            newVal = Math.max(0, Math.min(100, newVal));
            setKnobRotation(newVal);
            updateScopeTargetPosition();
        });
        
        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = "";
                document.body.style.cursor = "";
                logToConsole(`${parameterName} calibrated: ${knobElement.getAttribute("data-value")}%`);
            }
        });
        
        // Touch events fallback for mobile compatibility
        knobElement.addEventListener("touchstart", (e) => {
            isDragging = true;
            startY = e.touches[0].clientY;
            startVal = parseInt(knobElement.getAttribute("data-value")) || 50;
        }, { passive: true });
        
        document.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            const deltaY = startY - e.touches[0].clientY;
            let newVal = startVal + Math.round(deltaY / 1.5);
            newVal = Math.max(0, Math.min(100, newVal));
            setKnobRotation(newVal);
            updateScopeTargetPosition();
        }, { passive: true });
        
        document.addEventListener("touchend", () => {
            if (isDragging) {
                isDragging = false;
                logToConsole(`${parameterName} calibrated: ${knobElement.getAttribute("data-value")}%`);
            }
        });
    }

    setupKnobDrag(knobSpin, readoutSpin, "Spin rotation force");
    setupKnobDrag(knobBite, readoutBite, "Edge bite coefficient");

    // ==========================================================================
    // 5. CUSTOM DROP DOWN WIDGET
    // ==========================================================================
    selectTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        optionsList.classList.toggle("active");
        selectTrigger.querySelector(".select-arrow").style.transform = 
            optionsList.classList.contains("active") ? "rotate(180deg)" : "rotate(0deg)";
    });
    
    optionItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            
            // Remove previous selection
            optionItems.forEach(opt => opt.classList.remove("selected"));
            
            // Add new selection
            item.classList.add("selected");
            const val = item.getAttribute("data-value");
            const label = item.textContent.replace("▶", "").trim();
            
            selectLabel.textContent = label;
            nativeSelect.value = val;
            
            // Log & Update Scope
            logToConsole(`Stance profile altered: ${val}`);
            updateScopeTargetPosition();
            
            // Close dropdown
            optionsList.classList.remove("active");
            selectTrigger.querySelector(".select-arrow").style.transform = "rotate(0deg)";
        });
    });
    
    // Close dropdown on outside click
    document.addEventListener("click", () => {
        optionsList.classList.remove("active");
        selectTrigger.querySelector(".select-arrow").style.transform = "rotate(0deg)";
    });

    // ==========================================================================
    // 6. TOGGLE SWITCH LEDS & LOGGING
    // ==========================================================================
    function setupSwitchListener(checkboxElement, ledElement, label) {
        checkboxElement.addEventListener("change", (e) => {
            const isChecked = e.target.checked;
            if (isChecked) {
                ledElement.classList.add("active");
                logToConsole(`${label} system engage: [on]`);
            } else {
                ledElement.classList.remove("active");
                logToConsole(`${label} system bypass: [off]`);
            }
            updateScopeTargetPosition();
        });
    }
    
    setupSwitchListener(switchSpeed, ledSpeed, "Speed Boost");
    setupSwitchListener(switchGravity, ledGravity, "Gravity Compensator");
    setupSwitchListener(switchButter, ledButter, "Butter Controller");
    setupSwitchListener(switchTraction, ledTraction, "Traction Stabilizer");

    // ==========================================================================
    // 7. RESPONSIVE SVG OSCILLOSCOPE SCOPE
    // ==========================================================================
    function updateScopeTargetPosition() {
        // SVG dimensions: 200 x 200. Center is (100, 100)
        // Let's map target coordinates based on dials and slider settings
        
        let cx = 100;
        let cy = 100;
        
        // X-Coordinate Shift (Stance + Spin dial)
        const stance = nativeSelect.value;
        if (stance === "regular") {
            cx -= 15; // Shift left
        } else if (stance === "goofy") {
            cx += 15; // Shift right
        }
        
        // Spin Force Knob shifts X
        const spinForce = parseInt(knobSpin.getAttribute("data-value")) || 50;
        cx += (spinForce - 50) * 0.7; // map 0-100 to -35 to +35
        
        // Y-Coordinate Shift (Ollie Height + Edge Bite)
        const ollieHeight = parseInt(rangeOllie.value) || 50;
        cy -= (ollieHeight - 50) * 0.9; // higher ollie moves dot UP (lower SVG Y coordinate)
        
        const edgeBite = parseInt(knobBite.getAttribute("data-value")) || 50;
        cy += (edgeBite - 50) * 0.4; // higher edge bite moves dot DOWN
        
        // Butter control system shifts center randomly (vibration simulation)
        if (switchButter.checked) {
            cx += (Math.random() - 0.5) * 8;
            cy += (Math.random() - 0.5) * 8;
        }

        // Keep inside bounds of radar
        cx = Math.max(30, Math.min(170, cx));
        cy = Math.max(30, Math.min(170, cy));
        
        // Update DOM attributes
        targetDot.setAttribute("cx", cx.toFixed(1));
        targetDot.setAttribute("cy", cy.toFixed(1));
        targetRing.setAttribute("cx", cx.toFixed(1));
        targetRing.setAttribute("cy", cy.toFixed(1));
        
        // Map back to instrument console telemetry readouts (-50 to +50)
        const displayX = Math.round(cx - 100);
        const displayY = Math.round(100 - cy); // flip standard Y for pilot readable coordinate
        
        valXbal.textContent = displayX > 0 ? `+${displayX}` : displayX;
        valYbal.textContent = displayY > 0 ? `+${displayY}` : displayY;
    }

    // Set initial position
    updateScopeTargetPosition();

    // Small loop to simulate scope coordinate jitter if butter switch is active
    setInterval(() => {
        if (switchButter.checked) {
            updateScopeTargetPosition();
        }
    }, 120);

    // ==========================================================================
    // 8. EMERGENCY BAIL INDUSTRIAL BUTTON (SHUTDOWN DECK)
    // ==========================================================================
    btnBail.addEventListener("click", () => {
        logToConsole("!! EMERGENCY BAIL KEY PRESS DETECTED !!");
        logToConsole("> CRITICAL: INITIATING COLD SHUTDOWN DECK SEQUENCE...");
        
        // Add temporary screen flash/blackout class to simulate mechanical glitch
        mainPanel.style.opacity = "0.08";
        mainPanel.style.pointerEvents = "none";
        
        setTimeout(() => {
            mainPanel.style.opacity = "0.5";
            logToConsole("> SHUTTING DOWN: BINDING ENGINES SAFE DISCHARGE.");
        }, 300);
        
        setTimeout(() => {
            mainPanel.style.opacity = "0.2";
            logToConsole("> CRITICAL: RESETTING GYROSCOPES CALIBRATIONS.");
        }, 700);

        setTimeout(() => {
            mainPanel.style.opacity = "1";
            mainPanel.style.pointerEvents = "auto";
            
            // Reset all controls to safe defaults
            document.getElementById("rider-name").value = "";
            document.getElementById("rider-weight").value = 75;
            document.getElementById("stance-width").value = 54;
            document.getElementById("calib-key").value = "";
            
            rangeOllie.value = 50;
            valOllie.textContent = "50%";
            rangeSteez.value = 50;
            valSteez.textContent = "50%";
            
            // Reset Knobs
            knobSpin.setAttribute("data-value", 50);
            knobSpin.style.transform = "rotate(0deg)";
            readoutSpin.textContent = "50%";
            
            knobBite.setAttribute("data-value", 50);
            knobBite.style.transform = "rotate(0deg)";
            readoutBite.textContent = "50%";
            
            // Reset switches
            switchSpeed.checked = false;
            ledSpeed.classList.remove("active");
            
            switchGravity.checked = false;
            ledGravity.classList.remove("active");
            
            switchButter.checked = false;
            ledButter.classList.remove("active");
            
            switchTraction.checked = false;
            ledTraction.classList.remove("active");
            
            // Reset stance
            optionItems[0].click(); // Selects regular
            
            // Update scope target coordinates
            updateScopeTargetPosition();
            
            logToConsole("=========================================");
            logToConsole("> COLD BOOT COMPLETE. DECK FULLY RESET.");
            logToConsole("=========================================");
        }, 1500);
    });

    // ==========================================================================
    // 9. FORM VALIDATION & CONFIRMATION DIAGNOSTIC TICKET PRINTING
    // ==========================================================================
    calibForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Basic inputs validations
        const riderNameInput = document.getElementById("rider-name");
        const riderWeightInput = document.getElementById("rider-weight");
        const calibKeyInput = document.getElementById("calib-key");
        
        if (!riderNameInput.value.trim()) {
            logToConsole("validation fail: rider designation code missing");
            riderNameInput.focus();
            return;
        }
        
        if (!riderWeightInput.value || riderWeightInput.value < 40 || riderWeightInput.value > 150) {
            logToConsole("validation fail: pilot weight index outside safe bounds");
            riderWeightInput.focus();
            return;
        }
        
        const keyPattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/i;
        if (!keyPattern.test(calibKeyInput.value.trim())) {
            logToConsole("validation fail: encryption hash structural format mismatch");
            calibKeyInput.focus();
            return;
        }
        
        // Compile diagnostic telemetry values for ticket
        logToConsole("> PACKING DIAGNOSTIC TELEMETRY PARAMETERS...");
        
        // Generate pseudo-random hash sequence
        const randomHex = Math.floor(Math.random()*65535).toString(16).toUpperCase().padStart(4, '0');
        const finalHash = `${calibKeyInput.value.trim().toUpperCase()}-${randomHex}`;
        
        tPilot.textContent = riderNameInput.value.trim().toUpperCase();
        tWeight.textContent = `${riderWeightInput.value} KG (WIDTH: ${document.getElementById("stance-width").value} CM)`;
        tStance.textContent = nativeSelect.value.toUpperCase();
        
        // Stance Angle mapping
        const angleValue = document.querySelector('input[name="binding_angle"]:checked').value;
        let angleLabel = "DUCK STANCE (-15° / +15°)";
        if (angleValue === "carve") angleLabel = "CARVE STANCE (0° / +18°)";
        if (angleValue === "custom") angleLabel = "PRO COMP STANCE (-9° / +21°)";
        tAngle.textContent = angleLabel;
        
        // Active boosts mapping
        const activeBoosts = [];
        if (switchSpeed.checked) activeBoosts.push("SPD_BST");
        if (switchGravity.checked) activeBoosts.push("GRV_CMP");
        if (switchButter.checked) activeBoosts.push("BTR_CTRL");
        if (switchTraction.checked) activeBoosts.push("TRC_STAB");
        tBoost.textContent = activeBoosts.length > 0 ? activeBoosts.join(" + ") : "NONE BYPASS";
        
        tOllie.textContent = `${rangeOllie.value}%`;
        tSteez.textContent = `${rangeSteez.value}%`;
        tSpin.textContent = `${knobSpin.getAttribute("data-value")}%`;
        tBite.textContent = `${knobBite.getAttribute("data-value")}%`;
        ticketId.textContent = `HASH: #${finalHash}`;
        
        // Open Print ticket modal overlay
        logToConsole("> STABILITY CALIBRATIONS VALIDATED. COMMITTING...");
        setTimeout(() => {
            overlay.classList.add("active");
            logToConsole("> SUCCESS: DIAGNOSTIC TELEMETRY CARD PRINTED.");
        }, 600);
    });
    
    // Close overlay print ticket
    btnCloseTicket.addEventListener("click", () => {
        overlay.classList.remove("active");
        logToConsole("> INTERFACE UNCLOGGED. ACTIVE MONITOR STANDBY.");
    });
    
});
