/* ==========================================================================
   EXAMPLE 12: 3D CLAYMORPHIC DASHBOARD & FORM LOGIC
   Manages tabs, custom sliders, validations, dynamic theme accent modifications,
   drag-and-drop upload streams, and modal compilation sheets.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. STATE MANAGERS & SECTOR UTILITIES
    // ==========================================
    const state = {
        activeTab: 'panel-ui',
        uploadedFile: null,
        accentColor: '#0284c7',
        uiMetrics: {
            evaluation: 150,
            evaluationSub: 40,
            exploration: 120,
            explorationSub: 30
        }
    };

    const TABS_ORDER = ['panel-ui', 'panel-ux', 'panel-accessibility', 'panel-editor'];
    const PROGRESS_VALUES = {
        'panel-ui': '25%',
        'panel-ux': '50%',
        'panel-accessibility': '75%',
        'panel-editor': '100%'
    };

    // ==========================================
    // 2. TABS NAVIGATION & VIEW CONTROLLERS
    // ==========================================
    const tabs = document.querySelectorAll('.tab-pill-btn');
    const panels = document.querySelectorAll('.form-content-panel');
    const progressFillText = document.getElementById('text-gauge-percentage');
    const progressCapsule = document.getElementById('gauge-container-capsule');
    const btnPrev = document.getElementById('btn-step-prev');
    const btnNext = document.getElementById('btn-step-next');
    const btnNextLabel = document.getElementById('label-next-btn-text');
    const btnNextIcon = document.getElementById('icon-next-btn-svg');

    function switchPanel(panelId) {
        state.activeTab = panelId;

        // Update tabs active state
        tabs.forEach(tab => {
            const isTarget = tab.getAttribute('data-panel') === panelId;
            tab.classList.toggle('active', isTarget);
            tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
        });

        // Toggle panel display visibility
        panels.forEach(panel => {
            panel.classList.toggle('active', panel.id === panelId);
        });

        // Update progress capsule values
        const progressVal = PROGRESS_VALUES[panelId];
        progressFillText.textContent = progressVal;
        
        // Update color and visual glow of progress depending on active step
        if (progressCapsule) {
            const pct = parseInt(progressVal);
            progressCapsule.style.background = `linear-gradient(to right, var(--theme-accent) 0%, var(--theme-accent) ${pct}%, #1e293b ${pct}%, #1e293b 100%)`;
        }

        // Adjust navigation footer button states
        const currentIndex = TABS_ORDER.indexOf(panelId);
        btnPrev.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';

        if (currentIndex === TABS_ORDER.length - 1) {
            btnNextLabel.textContent = 'Compile Blueprint';
            btnNextIcon.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="22 11.08 12 19 2 11.08"></polyline>
                    <polyline points="22 4 12 12 2 4"></polyline>
                </svg>
            `;
        } else {
            btnNextLabel.textContent = 'Next Section';
            btnNextIcon.innerHTML = `<path d="M5 12h14M12 5l7 7-7 7"></path>`;
        }

        // Scroll back to dashboard top smoothly
        document.getElementById('main-dashboard-frame').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.getAttribute('data-panel');
            switchPanel(targetPanel);
        });
    });

    btnPrev.addEventListener('click', () => {
        const currentIndex = TABS_ORDER.indexOf(state.activeTab);
        if (currentIndex > 0) {
            switchPanel(TABS_ORDER[currentIndex - 1]);
        }
    });

    btnNext.addEventListener('click', () => {
        const currentIndex = TABS_ORDER.indexOf(state.activeTab);
        if (currentIndex < TABS_ORDER.length - 1) {
            switchPanel(TABS_ORDER[currentIndex + 1]);
        } else {
            // Trigger Form Compilation & Submission
            handleFormSubmit();
        }
    });

    // ==========================================
    // 3. TACTILE 3D SLIDERS INTERACTIVE LOGIC
    // ==========================================
    const sliderUiEval = document.getElementById('input-ui-evaluation');
    const sliderUiEvalSub = document.getElementById('input-ui-evaluation-sub');
    const sliderUiExp = document.getElementById('input-ui-exploration');
    const sliderUiExpSub = document.getElementById('input-ui-exploration-sub');

    const fillUiEval = document.getElementById('ui-eval-fill-track');
    const fillUiEvalSub = document.getElementById('ui-eval-sub-fill');
    const fillUiExp = document.getElementById('ui-exp-fill-track');
    const fillUiExpSub = document.getElementById('ui-exp-sub-fill');

    const lblUiEvalPct = document.getElementById('ui-eval-percent-val');
    const lblUiExpPct = document.getElementById('ui-exp-percent-val');

    function updateSlider(input, fillElement, labelElement = null, maxVal = 100) {
        if (!input || !fillElement) return;
        const currentVal = parseFloat(input.value);
        const percentage = (currentVal / maxVal) * 100;
        fillElement.style.width = percentage + '%';
        if (labelElement) {
            labelElement.textContent = currentVal + '%';
        }
    }

    if (sliderUiEval) {
        sliderUiEval.addEventListener('input', () => {
            updateSlider(sliderUiEval, fillUiEval, lblUiEvalPct, 200);
            state.uiMetrics.evaluation = parseInt(sliderUiEval.value);
        });
    }

    if (sliderUiEvalSub) {
        sliderUiEvalSub.addEventListener('input', () => {
            updateSlider(sliderUiEvalSub, fillUiEvalSub, null, 100);
            state.uiMetrics.evaluationSub = parseInt(sliderUiEvalSub.value);
        });
    }

    if (sliderUiExp) {
        sliderUiExp.addEventListener('input', () => {
            updateSlider(sliderUiExp, fillUiExp, lblUiExpPct, 200);
            state.uiMetrics.exploration = parseInt(sliderUiExp.value);
        });
    }

    if (sliderUiExpSub) {
        sliderUiExpSub.addEventListener('input', () => {
            updateSlider(sliderUiExpSub, fillUiExpSub, null, 100);
            state.uiMetrics.explorationSub = parseInt(sliderUiExpSub.value);
        });
    }

    // ==========================================
    // 4. UX PROFILE VALIDATION & ACCOUNT LOGIC
    // ==========================================
    const inputEmail = document.getElementById('input-email-address');
    const badgeEmailValid = document.getElementById('badge-email-valid');
    const badgeEmailInvalid = document.getElementById('badge-email-invalid');

    if (inputEmail) {
        inputEmail.addEventListener('input', () => {
            const emailVal = inputEmail.value.trim();
            if (emailVal === '') {
                badgeEmailValid.style.display = 'none';
                badgeEmailInvalid.style.display = 'none';
                inputEmail.classList.remove('is-valid', 'is-invalid');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(emailVal);

            if (isValid) {
                badgeEmailValid.style.display = 'block';
                badgeEmailInvalid.style.display = 'none';
                inputEmail.classList.add('is-valid');
                inputEmail.classList.remove('is-invalid');
            } else {
                badgeEmailValid.style.display = 'none';
                badgeEmailInvalid.style.display = 'block';
                inputEmail.classList.add('is-invalid');
                inputEmail.classList.remove('is-valid');
            }
        });
    }

    // Password Strengths & Eye Switch
    const inputPass = document.getElementById('input-password-field');
    const passGauge = document.getElementById('pass-strength-gauge');
    const passText = document.getElementById('pass-strength-text');
    const btnTogglePass = document.getElementById('btn-pass-toggle');
    const eyeOpenSvg = document.getElementById('eye-open-svg');
    const eyeClosedSvg = document.getElementById('eye-closed-svg');

    if (btnTogglePass && inputPass) {
        btnTogglePass.addEventListener('click', () => {
            const isPassword = inputPass.getAttribute('type') === 'password';
            inputPass.setAttribute('type', isPassword ? 'text' : 'password');
            eyeOpenSvg.style.display = isPassword ? 'none' : 'block';
            eyeClosedSvg.style.display = isPassword ? 'block' : 'none';
        });
    }

    if (inputPass) {
        inputPass.addEventListener('input', () => {
            const passVal = inputPass.value;
            if (passVal === '') {
                passGauge.style.width = '0%';
                passGauge.style.backgroundColor = 'transparent';
                passText.textContent = 'Strength: Empty';
                return;
            }

            let score = 0;
            if (passVal.length >= 6) score += 1;
            if (passVal.length >= 10) score += 1;
            if (/[0-9]/.test(passVal)) score += 1;
            if (/[A-Z]/.test(passVal)) score += 1;
            if (/[^A-Za-z0-9]/.test(passVal)) score += 1;

            // Score cap is 4 visually
            const pct = Math.min((score / 5) * 100, 100);
            passGauge.style.width = pct + '%';

            if (score <= 1) {
                passGauge.style.backgroundColor = '#ef4444'; // Red
                passText.textContent = 'Strength: Weak';
                passText.style.color = '#ef4444';
            } else if (score === 2 || score === 3) {
                passGauge.style.backgroundColor = '#f59e0b'; // Orange/Yellow
                passText.textContent = 'Strength: Moderate';
                passText.style.color = '#f59e0b';
            } else if (score === 4) {
                passGauge.style.backgroundColor = '#0ea5e9'; // Theme Blue
                passText.textContent = 'Strength: Strong';
                passText.style.color = '#0284c7';
            } else {
                passGauge.style.backgroundColor = '#22c55e'; // Green
                passText.textContent = 'Strength: Secure!';
                passText.style.color = '#22c55e';
            }
        });
    }

    // Custom select dropdown logic
    const customSelectField = document.getElementById('custom-role-select-box');
    const selectedDisplay = document.getElementById('selected-role-display');
    const optionsList = document.getElementById('list-role-options');
    const textCurrentRole = document.getElementById('text-role-current');
    const hiddenRoleInput = document.getElementById('input-selected-role-hidden');

    if (selectedDisplay && optionsList) {
        selectedDisplay.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedDisplay.classList.toggle('open');
            optionsList.classList.toggle('open');
        });

        document.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const displayVal = item.textContent;
                const innerVal = item.getAttribute('data-value');

                textCurrentRole.textContent = displayVal;
                textCurrentRole.style.color = 'var(--color-text-dark)';
                hiddenRoleInput.value = innerVal;

                selectedDisplay.classList.remove('open');
                optionsList.classList.remove('open');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            selectedDisplay.classList.remove('open');
            optionsList.classList.remove('open');
        });
    }

    // ==========================================
    // 5. ACCESSIBILITY & SYSTEMS CONTROLLERS
    // ==========================================
    const radioSelectionCards = document.querySelectorAll('.radio-selection-card');
    const envRadios = document.getElementsByName('system-env-node');

    radioSelectionCards.forEach(card => {
        card.addEventListener('click', () => {
            const inputInside = card.querySelector('input[type="radio"]');
            if (inputInside) {
                inputInside.checked = true;
                
                // Toggle active style trigger on labels
                radioSelectionCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            }
        });
    });

    // ==========================================
    // 6. EDITOR CONFIGURATORS & Accent Modifications
    // ==========================================
    
    // Custom Accent Color Repainting
    const accentPicker = document.getElementById('input-accent-color-picker');
    const badgeAccentHex = document.getElementById('badge-color-accent-hex');
    const colorPickerOrb = document.querySelector('.color-picker-orb-container');

    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    if (accentPicker) {
        accentPicker.addEventListener('input', () => {
            const hexColor = accentPicker.value;
            state.accentColor = hexColor;
            badgeAccentHex.textContent = hexColor.toUpperCase();
            
            // Apply visual background style on wrapper bubble itself
            if (colorPickerOrb) {
                colorPickerOrb.style.backgroundColor = hexColor;
            }

            // Set custom properties globally on :root
            const rgb = hexToRgb(hexColor);
            if (rgb) {
                document.documentElement.style.setProperty('--theme-accent', hexColor);
                document.documentElement.style.setProperty('--theme-accent-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`);
                document.documentElement.style.setProperty('--theme-accent-tint', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`);
            }
        });
    }

    // Drag & Drop File Upload Listener Stream
    const dropZone = document.getElementById('blueprint-drag-drop-zone');
    const fileNativeInput = document.getElementById('input-blueprint-file');
    const dropIdleState = document.getElementById('drop-zone-idle');
    const fileStatusCard = document.getElementById('file-status-card');
    const lblFileName = document.getElementById('loaded-file-name-lbl');
    const lblFileSize = document.getElementById('loaded-file-size-lbl');
    const progressFillBar = document.getElementById('file-upload-progress-fill-bar');
    const btnRemoveFile = document.getElementById('btn-clear-blueprint-file');

    function simulateFileUpload(file) {
        state.uploadedFile = file;

        // Hide idle layout and expose details card
        dropIdleState.style.display = 'none';
        fileStatusCard.style.display = 'flex';

        lblFileName.textContent = file.name;
        
        // Convert bytes size to formatted text
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        lblFileSize.textContent = sizeMb + ' MB';

        // Animate progression bar
        progressFillBar.style.width = '0%';
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressFillBar.style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 80);
    }

    if (dropZone) {
        dropZone.addEventListener('click', () => {
            fileNativeInput.click();
        });

        fileNativeInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                simulateFileUpload(e.target.files[0]);
            }
        });

        // Hover drag-and-drop modifiers
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('dragover');
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dataTransfer = e.dataTransfer;
            if (dataTransfer && dataTransfer.files.length > 0) {
                simulateFileUpload(dataTransfer.files[0]);
            }
        });
    }

    if (btnRemoveFile) {
        btnRemoveFile.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering dropZone click handler
            state.uploadedFile = null;
            fileNativeInput.value = ''; // Reset files array

            fileStatusCard.style.display = 'none';
            dropIdleState.style.display = 'flex';
            progressFillBar.style.width = '0%';
        });
    }

    // ==========================================
    // 7. COMPILATION MODAL SUBMISSION HANDLER
    // ==========================================
    const modalOverlay = document.getElementById('compilation-modal-overlay');
    const btnDismissModal = document.getElementById('btn-modal-dismiss');
    const btnCloseModalX = document.getElementById('btn-close-submission-overlay');
    const btnDownloadBlueprint = document.getElementById('btn-modal-download-blueprint');

    const manifestTbody = document.getElementById('modal-table-data-tbody');
    const manifestScoreText = document.getElementById('modal-metric-percentage');
    const manifestScoreRing = document.getElementById('radial-score-indicator-circle');
    const manifestValNode = document.getElementById('manifest-val-node');
    const manifestValName = document.getElementById('manifest-val-name');
    const manifestValRole = document.getElementById('manifest-val-role');
    const manifestValSync = document.getElementById('manifest-val-sync');

    function getSelectedEnvValue() {
        let val = 'Development';
        envRadios.forEach(radio => {
            if (radio.checked) {
                val = radio.value;
            }
        });
        // Capitalize environmental values nicely
        return val.charAt(0).toUpperCase() + val.slice(1);
    }

    function checkUXValidation() {
        const inputName = document.getElementById('input-full-name');
        
        // Ensure name exists
        if (!inputName || inputName.value.trim() === '') {
            alert('UX Profile Configuration Error: Full Name field is required.');
            switchPanel('panel-ux');
            inputName.focus();
            inputName.classList.add('is-invalid');
            return false;
        }

        // Check if email format is invalid
        if (inputEmail && inputEmail.value.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(inputEmail.value.trim())) {
                alert('UX Profile Configuration Error: Email Address format is invalid.');
                switchPanel('panel-ux');
                inputEmail.focus();
                return false;
            }
        }

        return true;
    }

    function handleFormSubmit() {
        // Validate prior parameters (focusing particularly on profile validations)
        if (!checkUXValidation()) {
            return;
        }

        // Expose overlay
        modalOverlay.style.display = 'flex';

        // Gather all completed config states
        const nameVal = document.getElementById('input-full-name').value.trim();
        const emailVal = document.getElementById('input-email-address').value.trim() || 'Not Provided';
        const rawRoleVal = hiddenRoleInput.value;
        const roleText = textCurrentRole.textContent;
        const envVal = getSelectedEnvValue();
        const contrastVal = document.getElementById('toggle-high-contrast').checked ? 'Enabled' : 'Disabled';
        const readerVal = document.getElementById('toggle-screen-reader').checked ? 'Enabled' : 'Disabled';
        const targetDate = document.getElementById('input-target-date').value || 'Immediate launch';
        const targetTime = document.getElementById('input-target-time').value || '09:00';
        const colorVal = state.accentColor.toUpperCase();
        const documentVal = state.uploadedFile ? state.uploadedFile.name : 'No Security Key Loaded';

        // Update modal metadata columns
        manifestValNode.textContent = envVal + ' Cluster';
        manifestValName.textContent = nameVal;
        manifestValRole.textContent = rawRoleVal ? roleText : 'Platform Guest';
        manifestValSync.textContent = state.uploadedFile ? 'Encrypted Stream' : 'Bypass Stream';

        // Populate details data table rows
        const compiledData = [
            { el: 'UI Evaluation slider', val: state.uiMetrics.evaluation + '%' },
            { el: 'UI Secondary adjuster', val: state.uiMetrics.evaluationSub + '%' },
            { el: 'UI Exploration slider', val: state.uiMetrics.exploration + '%' },
            { el: 'UI Secondary Exploration', val: state.uiMetrics.explorationSub + '%' },
            { el: 'Architect Full Name', val: nameVal },
            { el: 'Primary Contact Email', val: emailVal },
            { el: 'High Contrast UI Mode', val: contrastVal },
            { el: 'Screen Reader Support', val: readerVal },
            { el: 'Target Release Date', val: targetDate + ' @ ' + targetTime },
            { el: 'Selected Style Hex Accent', val: colorVal },
            { el: 'Upload Credentials file', val: documentVal }
        ];

        manifestTbody.innerHTML = '';
        compiledData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.el}</td>
                <td>${row.val}</td>
            `;
            manifestTbody.appendChild(tr);
        });

        // Compute Completion Score dynamically
        let filledParamsCount = 0;
        let totalParamsCount = 8; // Mandatory checking parameters

        if (nameVal !== '') filledParamsCount++;
        if (emailVal !== 'Not Provided') filledParamsCount++;
        if (rawRoleVal !== '') filledParamsCount++;
        if (state.uploadedFile !== null) filledParamsCount++;
        if (document.getElementById('input-target-date').value !== '') filledParamsCount++;
        if (document.getElementById('chk-newsletter').checked) filledParamsCount++;
        if (document.getElementById('chk-privacy-policy').checked) filledParamsCount++;
        if (state.uiMetrics.evaluation !== 150) filledParamsCount++; // Slider touched count as custom metric

        // Always guarantee at least 60% completion if submitted
        const completionPct = Math.max(Math.round((filledParamsCount / totalParamsCount) * 100), 65);
        manifestScoreText.textContent = completionPct + '%';

        // Animate the radial circular path completion stroke-dashoffset
        // Full perimeter is 314.15 (radius 50)
        const offset = 314.15 - (314.15 * completionPct) / 100;
        manifestScoreRing.style.strokeDashoffset = offset;

        // Custom logs delays simulation
        const consoleLogs = document.getElementById('modal-compilation-console-logs');
        if (consoleLogs) {
            consoleLogs.textContent = '';
            const logs = [
                `[BLUEPRINT-CORE] Initiating form validation compiler stream...`,
                `[BLUEPRINT-CORE] Verifying applicant identities: [${nameVal}]...`,
                `[BLUEPRINT-CORE] Core system environment: [${envVal} cluster node]`,
                `[BLUEPRINT-CORE] Mapping dynamic slider specifications (UI Evaluation: ${state.uiMetrics.evaluation}%)`,
                `[BLUEPRINT-CORE] Contrast filters: [${contrastVal}], Reader: [${readerVal}]`,
                `[BLUEPRINT-CORE] Credentials integrity check: [${documentVal}]`,
                `[BLUEPRINT-CORE] Applied theme color signature: [${colorVal}]`,
                `[SUCCESS] System Blueprint fully compiled with ${completionPct}% eligibility rating. Ready for download.`
            ];

            let line = 0;
            const logInterval = setInterval(() => {
                if (line < logs.length) {
                    consoleLogs.textContent += logs[line] + '\n';
                    consoleLogs.scrollTop = consoleLogs.scrollHeight;
                    line++;
                } else {
                    clearInterval(logInterval);
                }
            }, 120);
        }
    }

    function closeModal() {
        modalOverlay.style.display = 'none';
    }

    if (btnDismissModal) btnDismissModal.addEventListener('click', closeModal);
    if (btnCloseModalX) btnCloseModalX.addEventListener('click', closeModal);

    // Dynamic Download JSON configuration blueprint
    if (btnDownloadBlueprint) {
        btnDownloadBlueprint.addEventListener('click', () => {
            const dataToDownload = {
                compilation_timestamp: new Date().toISOString(),
                architect_identity: document.getElementById('input-full-name').value.trim(),
                contact_email: document.getElementById('input-email-address').value.trim() || null,
                selected_role: hiddenRoleInput.value || 'guest',
                system_cluster_node: getSelectedEnvValue().toLowerCase(),
                accessibility_parameters: {
                    high_contrast_theme: document.getElementById('toggle-high-contrast').checked,
                    screen_reader_compatibility: document.getElementById('toggle-screen-reader').checked
                },
                styling_signature: {
                    active_accent_hex: state.accentColor,
                    ui_evaluation_ratio: state.uiMetrics.evaluation,
                    ui_exploration_ratio: state.uiMetrics.exploration
                },
                uploaded_cert_file: state.uploadedFile ? state.uploadedFile.name : null,
                target_launch_schedule: document.getElementById('input-target-date').value || 'immediate'
            };

            const jsonStr = JSON.stringify(dataToDownload, null, 4);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Create a mock download link
            const a = document.createElement('a');
            a.href = url;
            a.download = `system_blueprint_${dataToDownload.architect_identity.toLowerCase().replace(/\s+/g, '_') || 'config'}.json`;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup references
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Initialize all custom sliders background visual fills on startup
    updateSlider(sliderUiEval, fillUiEval, lblUiEvalPct, 200);
    updateSlider(sliderUiEvalSub, fillUiEvalSub, null, 100);
    updateSlider(sliderUiExp, fillUiExp, lblUiExpPct, 200);
    updateSlider(sliderUiExpSub, fillUiExpSub, null, 100);

    // Initial progress bar trigger
    switchPanel('panel-ui');

});
