/* ==========================================================================
   GLASSMORPHIC INTERACTIVE CONTROLLER
   Coordinates parallax mouse-depth, slider telemetry, toggles, and compiles
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. DYNAMIC MOUSE PARALLAX DEPTH EFFECT (AMBIENT REFRACTION BLOBS)
    // ----------------------------------------------------------------------
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 35;
        const y = (window.innerHeight / 2 - e.clientY) / 35;
        
        const blobs = document.querySelectorAll('.blob');
        blobs.forEach((blob, idx) => {
            // Give each blob a slightly different translation factor to create depth
            const depthFactor = (idx + 1) * 0.6;
            blob.style.transform = `translate(${x * depthFactor}px, ${y * depthFactor}px)`;
        });
    });

    // ----------------------------------------------------------------------
    // 2. CHECKBOX ACTIVE PILL MORPHING
    // ----------------------------------------------------------------------
    const checkboxRows = document.querySelectorAll('.glass-checkbox-row');
    
    checkboxRows.forEach(row => {
        const input = row.querySelector('input[type="checkbox"]');
        
        if (input) {
            // Initial load sync
            if (input.checked) {
                row.classList.add('active-check');
            } else {
                row.classList.remove('active-check');
            }
            
            // Toggle row style on change
            input.addEventListener('change', () => {
                if (input.checked) {
                    row.classList.add('active-check');
                } else {
                    row.classList.remove('active-check');
                }
            });
        }
    });

    // ----------------------------------------------------------------------
    // 3. RANGE SLIDER DYNAMIC FEEDBACK
    // ----------------------------------------------------------------------
    const slider = document.getElementById('opacityLevel');
    const display = document.getElementById('blur-val');
    
    if (slider && display) {
        display.textContent = `${slider.value}%`;
        
        slider.addEventListener('input', (e) => {
            display.textContent = `${e.target.value}%`;
        });
    }

    // ----------------------------------------------------------------------
    // 4. DRAG & DROP FILE ZONE HANDLER
    // ----------------------------------------------------------------------
    const dropzone = document.getElementById('glass-dropzone');
    const fileInput = document.getElementById('glassAsset');
    const fileTag = document.getElementById('glass-file-tag');
    
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
    // 5. COMPILER DIALOG OVERLAY & DOWNLOAD SEED FLOW
    // ----------------------------------------------------------------------
    const form = document.getElementById('glass-form');
    const glassOverlay = document.getElementById('glass-overlay');
    const closeOverlay = document.getElementById('close-overlay');
    const dismissOverlay = document.getElementById('dismiss-overlay');
    const terminal = document.getElementById('glass-terminal');
    const downloadJsonBtn = document.getElementById('download-json');
    
    let generatedSeedJson = null;
    
    if (form && glassOverlay) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const activePipes = formData.getAll('corePipe');
            
            const seed = {
                workspaceName: formData.get('projectName'),
                priorityTier: formData.get('spaceLimit'),
                networkTunnelingEnabled: formData.get('networkSync') ? true : false,
                blurIndexPercentage: parseInt(formData.get('opacityLevel')),
                pipelineFeatures: activePipes,
                assetSeedName: fileInput.files.length > 0 ? fileInput.files[0].name : "aura_default.seed",
                notes: formData.get('notes') || "",
                timestamp: new Date().toISOString(),
                compilerCode: "013-ACRYLIC"
            };
            
            generatedSeedJson = JSON.stringify(seed, null, 4);
            
            // Show Glass overlay modal
            glassOverlay.classList.add('show');
            animateGlassTerminal(seed.workspaceName, activePipes.length);
        });
        
        const animateGlassTerminal = (name, pipesCount) => {
            const logs = [
                `[CORE] Initializing glass dispersion parameters...`,
                `[CORE] Aligning background parallax vectors...`,
                `[CORE] Binding [${pipesCount}] active core filters...`,
                `[CORE] Refracting workspace name: "${name.toUpperCase()}"...`,
                `[CORE] Creating downloadable seed configuration...`,
                `[SUCCESS] Aura Workspace successfully compiled! Code: 013-GLASS.`
            ];
            
            terminal.innerHTML = "";
            let idx = 0;
            
            const printLine = () => {
                if (idx < logs.length) {
                    terminal.innerHTML += (idx === 0 ? "" : "\n") + logs[idx];
                    terminal.scrollTop = terminal.scrollHeight;
                    idx++;
                    setTimeout(printLine, 180);
                }
            };
            
            printLine();
        };
        
        const hideModal = () => {
            glassOverlay.classList.remove('show');
        };
        
        if (closeOverlay) closeOverlay.addEventListener('click', hideModal);
        if (dismissOverlay) dismissOverlay.addEventListener('click', hideModal);
        
        if (downloadJsonBtn) {
            downloadJsonBtn.addEventListener('click', () => {
                if (generatedSeedJson) {
                    const blob = new Blob([generatedSeedJson], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'workspace-seed.json';
                    document.body.appendChild(a);
                    a.click();
                    
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            });
        }
    }

    // ----------------------------------------------------------------------
    // 6. FORM RESET MANAGER
    // ----------------------------------------------------------------------
    if (form) {
        form.addEventListener('reset', () => {
            setTimeout(() => {
                // Reset checkbox active classes
                checkboxRows.forEach(row => {
                    const input = row.querySelector('input[type="checkbox"]');
                    if (input) {
                        if (input.checked) {
                            row.classList.add('active-check');
                        } else {
                            row.classList.remove('active-check');
                        }
                    }
                });
                
                // Reset slider displays
                if (slider) display.textContent = `${slider.value}%`;
                
                // Reset file chooser tag
                if (fileTag) {
                    fileTag.textContent = 'No template';
                    fileTag.style.display = 'none';
                }
            }, 10);
        });
    }

});
