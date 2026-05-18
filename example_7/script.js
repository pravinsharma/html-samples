/* ==========================================================================
   NEUMORPHIC / CLAYMORPHIC FORM CONTROLLER
   Manages interactive checkbox rows, counter bindings, drag-drop, and logs
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. CHECKBOX ROW MORPHING & SELECTION COUNT BINDING
    // ----------------------------------------------------------------------
    const checkboxRows = document.querySelectorAll('.neumorphic-checkbox-row');
    const counterDisplay = document.getElementById('counter-display');
    const deselectBtn = document.getElementById('deselect-all-btn');

    // Function to calculate and update the counter display
    const updateSelectionCount = () => {
        if (counterDisplay) {
            const checkedCount = document.querySelectorAll('input[name="renderOptions"]:checked').length;
            counterDisplay.textContent = checkedCount;
        }
    };

    // Attach click listeners to rows to properly morph styles and set checkboxes
    checkboxRows.forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        
        if (checkbox) {
            // Sync initial state on load (in case browsers remember checks)
            if (checkbox.checked) {
                row.classList.add('active-pill');
            } else {
                row.classList.remove('active-pill');
            }
            
            // Listen to checkbox changes
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    row.classList.add('active-pill');
                } else {
                    row.classList.remove('active-pill');
                }
                updateSelectionCount();
            });
        }
    });

    // Handle "Deselect All" button action
    if (deselectBtn) {
        deselectBtn.addEventListener('click', () => {
            checkboxRows.forEach(row => {
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = false;
                    row.classList.remove('active-pill');
                }
            });
            updateSelectionCount();
        });
    }

    // Set initial count
    updateSelectionCount();

    // ----------------------------------------------------------------------
    // 2. NEUMORPHIC RANGE SLIDER VALUE UPDATER
    // ----------------------------------------------------------------------
    const fogSlider = document.getElementById('fogDensity');
    const fogVal = document.getElementById('fog-val');
    
    if (fogSlider && fogVal) {
        fogVal.textContent = `${fogSlider.value}%`;
        
        fogSlider.addEventListener('input', (e) => {
            fogVal.textContent = `${e.target.value}%`;
        });
    }

    // ----------------------------------------------------------------------
    // 3. CLAY DRAG & DROP FILE ZONE HANDLER
    // ----------------------------------------------------------------------
    const dropzone = document.getElementById('clay-dropzone');
    const fileInput = document.getElementById('terrainTexture');
    const fileTag = document.getElementById('clay-file-name');
    
    if (dropzone && fileInput && fileTag) {
        dropzone.addEventListener('click', () => fileInput.click());
        
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
        
        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files && files.length > 0) {
                fileInput.files = files;
                updateFileName(files[0].name);
            }
        });
        
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                updateFileName(fileInput.files[0].name);
            }
        });
        
        const updateFileName = (name) => {
            fileTag.textContent = name;
            fileTag.style.display = 'inline-block';
        };
    }

    // ----------------------------------------------------------------------
    // 4. RETRO COMPILE MODAL OVERLAY & DOWNLOAD SEQUENCE
    // ----------------------------------------------------------------------
    const form = document.getElementById('clay-form');
    const logOverlay = document.getElementById('log-overlay');
    const closeOverlayBtn = document.getElementById('close-overlay-btn');
    const dismissOverlayBtn = document.getElementById('dismiss-overlay-btn');
    const terminalLog = document.getElementById('clay-terminal-log');
    const downloadClayJson = document.getElementById('download-clay-json');
    
    let compiledBlueprintJson = null;
    
    if (form && logOverlay) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const subsystems = formData.getAll('renderOptions');
            
            const blueprint = {
                projectName: formData.get('projectName'),
                blueprintCategory: formData.get('spaceType'),
                fogDensity: parseInt(formData.get('fogDensity')),
                meshDensity: formData.get('meshDensity'),
                activeSubsystems: subsystems,
                textureFile: fileInput.files.length > 0 ? fileInput.files[0].name : "default_heightmap.raw",
                notes: formData.get('spaceNotes') || "",
                creationDate: new Date().toISOString(),
                coreVersion: "CLAY-1.07"
            };
            
            compiledBlueprintJson = JSON.stringify(blueprint, null, 4);
            
            logOverlay.classList.add('show');
            animateTerminalLog(blueprint.projectName, subsystems.length);
        });
        
        const animateTerminalLog = (projName, subSystemCount) => {
            const logs = [
                `[CLAYCORE] Init build sequence for blueprint: "${projName.toUpperCase()}"...`,
                `[CLAYCORE] Loading 3D low-poly environment clusters...`,
                `[CLAYCORE] Attaching shaders to [${subSystemCount}] active subsystems...`,
                `[CLAYCORE] Setting environmental fog to: ${fogSlider.value}%`,
                `[CLAYCORE] Generating JSON config matrices...`,
                `[SUCCESS] Space Blueprint successfully generated! Code: CLAY-07.`,
                `[INFO] Compilation finished. Press Download to save workspace state.`
            ];
            
            terminalLog.innerHTML = "";
            let idx = 0;
            
            const printLine = () => {
                if (idx < logs.length) {
                    terminalLog.innerHTML += (idx === 0 ? "" : "\n") + logs[idx];
                    terminalLog.scrollTop = terminalLog.scrollHeight;
                    idx++;
                    setTimeout(printLine, 200);
                }
            };
            
            printLine();
        };
        
        const hideModal = () => {
            logOverlay.classList.remove('show');
        };
        
        if (closeOverlayBtn) closeOverlayBtn.addEventListener('click', hideModal);
        if (dismissOverlayBtn) dismissOverlayBtn.addEventListener('click', hideModal);
        
        if (downloadClayJson) {
            downloadClayJson.addEventListener('click', () => {
                if (compiledBlueprintJson) {
                    const blob = new Blob([compiledBlueprintJson], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'space-blueprint.json';
                    document.body.appendChild(a);
                    a.click();
                    
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            });
        }
    }

    // ----------------------------------------------------------------------
    // 5. RESTORING CLAY SYSTEM DEFAULTS ON RESET
    // ----------------------------------------------------------------------
    if (form) {
        form.addEventListener('reset', () => {
            setTimeout(() => {
                // Re-evaluate checkboxes classes
                checkboxRows.forEach(row => {
                    const checkbox = row.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        if (checkbox.checked) {
                            row.classList.add('active-pill');
                        } else {
                            row.classList.remove('active-pill');
                        }
                    }
                });
                
                // Reset counter display
                updateSelectionCount();
                
                // Reset range displays
                if (fogSlider) fogVal.textContent = `${fogSlider.value}%`;
                
                // Reset file chooser
                if (fileTag) {
                    fileTag.textContent = 'No texture chosen';
                    fileTag.style.display = 'none';
                }
            }, 10);
        });
    }

});
