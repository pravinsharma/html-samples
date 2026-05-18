/* ==========================================================================
   MINIMALIST THEME FORM CONTROLLER
   Handling telemetry, drag-and-drop, sliders, and form submission
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. DYNAMIC HEADER DATE GENERATOR
    // ----------------------------------------------------------------------
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const now = new Date();
        const formattedDate = `${days[now.getDay()]} — ${now.getDate()} ${months[now.getMonth()]}`;
        dateEl.innerHTML = formattedDate.toUpperCase();
    }

    // ----------------------------------------------------------------------
    // 2. LIVE SLIDER TELEMETRY BINDING
    // ----------------------------------------------------------------------
    const bindSlider = (sliderId, displayId) => {
        const slider = document.getElementById(sliderId);
        const display = document.getElementById(displayId);
        
        if (slider && display) {
            // Initial render
            display.textContent = `${slider.value}%`;
            
            // Drag listener
            slider.addEventListener('input', (e) => {
                display.textContent = `${e.target.value}%`;
            });
        }
    };
    
    bindSlider('brightness', 'brightness-val');
    bindSlider('shadowDensity', 'shadow-val');

    // ----------------------------------------------------------------------
    // 3. DRAG & DROP FILE ZONE HANDLER
    // ----------------------------------------------------------------------
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('modelFile');
    const fileNameDisplay = document.getElementById('file-name-display');
    
    if (dropzone && fileInput && fileNameDisplay) {
        // Trigger click on browse
        dropzone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag events
        const preventDefaults = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => {
                dropzone.classList.add('dragover');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => {
                dropzone.classList.remove('dragover');
            }, false);
        });
        
        // Handle dropped file
        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files && files.length > 0) {
                fileInput.files = files;
                updateFileName(files[0].name);
            }
        });
        
        // Handle chosen file via explorer
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                updateFileName(fileInput.files[0].name);
            }
        });
        
        const updateFileName = (name) => {
            fileNameDisplay.textContent = name;
            fileNameDisplay.style.display = 'inline-block';
        };
    }

    // ----------------------------------------------------------------------
    // 4. ANIMATED FORM SUBMISSION / COMPILE SEQUENCE
    // ----------------------------------------------------------------------
    const form = document.getElementById('minimal-form');
    const successOverlay = document.getElementById('success-overlay');
    const closeOverlay = document.getElementById('close-overlay');
    const dismissSuccess = document.getElementById('dismiss-success');
    const terminalLog = document.getElementById('terminal-log');
    const downloadConfigBtn = document.getElementById('download-config');
    
    let generatedConfigJson = null;
    
    if (form && successOverlay) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather standard form elements
            const formData = new FormData(form);
            
            // Extract values
            const config = {
                workspaceOwner: formData.get('fullName'),
                ownerEmail: formData.get('email'),
                renderingEngine: formData.get('engine'),
                brightnessLevel: parseInt(formData.get('brightness')),
                shadowDensity: parseInt(formData.get('shadowDensity')),
                subsystems: formData.getAll('subsystems'),
                lightingPreset: formData.get('lightingPreset'),
                fileName: fileInput.files.length > 0 ? fileInput.files[0].name : "default_stage.json",
                notes: formData.get('notes') || "",
                compiledTimestamp: new Date().toISOString(),
                buildCode: "013-SUCCESS"
            };
            
            generatedConfigJson = JSON.stringify(config, null, 4);
            
            // Open overlay log console
            successOverlay.classList.add('show');
            animateTerminalLog(config.lightingPreset.toUpperCase(), config.workspaceOwner);
        });
        
        // Animation sequence for monospace compiler screen
        const animateTerminalLog = (lightingMode, userName) => {
            const logs = [
                `[SYSTEM] Initializing build sequence for user: ${userName.toUpperCase()}...`,
                `[SYSTEM] Connecting to local file buffers...`,
                `[SYSTEM] Compiling rendering presets [MODE: ${lightingMode}]...`,
                `[SYSTEM] Verifying system constraints: Maximum nodes set to 35.`,
                `[SYSTEM] Integrating configuration matrix...`,
                `[SYSTEM] Packing JSON environment values...`,
                `[SUCCESS] System compilation finished. Build Code: 013.`,
                `[INFO] Workspace variables successfully saved to local buffer.`
            ];
            
            terminalLog.innerHTML = "";
            let idx = 0;
            
            const printLine = () => {
                if (idx < logs.length) {
                    terminalLog.innerHTML += (idx === 0 ? "" : "\n") + logs[idx];
                    terminalLog.scrollTop = terminalLog.scrollHeight; // Autoscroll to bottom
                    idx++;
                    setTimeout(printLine, 250); // Monospace typeline pause
                }
            };
            
            printLine();
        };
        
        // Close modal triggers
        const hideModal = () => {
            successOverlay.classList.remove('show');
        };
        
        if (closeOverlay) closeOverlay.addEventListener('click', hideModal);
        if (dismissSuccess) dismissSuccess.addEventListener('click', hideModal);
        
        // Download Generated Configuration as JSON
        if (downloadConfigBtn) {
            downloadConfigBtn.addEventListener('click', () => {
                if (generatedConfigJson) {
                    const blob = new Blob([generatedConfigJson], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'workspace-config.json';
                    document.body.appendChild(a);
                    a.click();
                    
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            });
        }
    }

    // ----------------------------------------------------------------------
    // 5. RESTORING DEFAULT GRAPHICS ON RESET
    // ----------------------------------------------------------------------
    if (form) {
        form.addEventListener('reset', () => {
            // Short timeout to allow form to empty inputs before updating display elements
            setTimeout(() => {
                const brightness = document.getElementById('brightness');
                const shadow = document.getElementById('shadowDensity');
                
                if (brightness) document.getElementById('brightness-val').textContent = `${brightness.value}%`;
                if (shadow) document.getElementById('shadow-val').textContent = `${shadow.value}%`;
                
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = 'No file selected';
                    fileNameDisplay.style.display = 'none';
                }
            }, 10);
        });
    }
});
