/* ==========================================================================
   DYNAMIC STEP-BY-STEP ONBOARDING WIZARD
   Orchestrates vertical timeline progressions, summary cards, and profiles
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Wizard step state tracking
    const totalSteps = 4;
    let activeStep = 3; // Initialize at Step 3 to EXACTLY match the sample1.jpg state!

    // DOM Elements
    const stepNodes = [
        document.getElementById('step-node-1'),
        document.getElementById('step-node-2'),
        document.getElementById('step-node-3'),
        document.getElementById('step-node-4')
    ];
    
    const stepViews = [
        document.getElementById('step-view-1'),
        document.getElementById('step-view-2'),
        document.getElementById('step-view-3'),
        document.getElementById('step-view-4')
    ];

    const progressBar = document.getElementById('stepper-progress-bar');
    const btnBack = document.getElementById('btn-back');
    const btnNext = document.getElementById('btn-next');
    
    // Summary Fields (Step 4)
    const sumName = document.getElementById('sum-name');
    const sumPrefs = document.getElementById('sum-prefs');
    const sumCity = document.getElementById('sum-city');

    // Forms & Overlay Modal
    const form = document.getElementById('wizard-form');
    const overlay = document.getElementById('onboard-overlay');
    const closeOverlay = document.getElementById('close-overlay');
    const dismissOverlay = document.getElementById('dismiss-overlay');
    const successLog = document.getElementById('success-log');
    const downloadProfileBtn = document.getElementById('download-blueprint');

    let compiledProfileJson = null;

    // ----------------------------------------------------------------------
    // 1. STEP NAVIGATION CORE RENDER
    // ----------------------------------------------------------------------
    const updateWizardUI = () => {
        // A. Update step views visibility
        stepViews.forEach((view, idx) => {
            if (idx + 1 === activeStep) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        // B. Update stepper nodes classes & statuses
        stepNodes.forEach((node, idx) => {
            const stepNum = idx + 1;
            const statusLabel = node.querySelector('.step-status');
            
            node.className = 'step-node'; // Reset classes
            
            if (stepNum < activeStep) {
                node.classList.add('completed');
                if (statusLabel) statusLabel.textContent = 'Completed';
            } else if (stepNum === activeStep) {
                node.classList.add('active');
                if (statusLabel) statusLabel.textContent = 'In Progress';
            } else {
                node.classList.add('pending');
                if (statusLabel) {
                    statusLabel.textContent = (stepNum === 4) ? 'Pending' : 'Pending';
                }
            }
        });

        // C. Update green progress bar height (Step 1 = 0%, Step 2 = 33%, Step 3 = 66%, Step 4 = 100%)
        const progressPercentage = ((activeStep - 1) / (totalSteps - 1)) * 100;
        if (progressBar) {
            progressBar.style.height = `${progressPercentage}%`;
        }

        // D. Update action buttons display & labels
        if (activeStep === 1) {
            btnBack.style.display = 'none';
            btnNext.textContent = 'Next';
        } else {
            btnBack.style.display = 'inline-block';
            if (activeStep === totalSteps) {
                btnNext.textContent = 'Compile & Submit';
            } else {
                btnNext.textContent = 'Next';
            }
        }

        // E. Populate dynamic review summaries on entering Step 4
        if (activeStep === totalSteps) {
            compileReviewSummary();
        }
    };

    // ----------------------------------------------------------------------
    // 2. COMPILE REVIEW SUMMARY INFORMATION
    // ----------------------------------------------------------------------
    const compileReviewSummary = () => {
        // Name
        const nameVal = document.getElementById('fullName').value.trim();
        sumName.textContent = nameVal ? nameVal : 'Not provided';

        // City
        const citySelect = document.getElementById('city');
        if (citySelect && citySelect.selectedIndex >= 0) {
            const chosenCity = citySelect.options[citySelect.selectedIndex].text;
            sumCity.textContent = chosenCity !== 'Select City' ? chosenCity : 'None chosen';
        } else {
            sumCity.textContent = 'None chosen';
        }

        // Toggles
        const isFullTime = document.getElementById('fulltime').checked;
        const isRemote = document.getElementById('remote').checked;
        
        let prefs = [];
        if (isFullTime) prefs.push('Full-time');
        if (isRemote) prefs.push('Remote');
        
        sumPrefs.textContent = prefs.length > 0 ? prefs.join(' & ') : 'Flexible / Contract';
    };

    // ----------------------------------------------------------------------
    // 3. ACTION EVENT LISTENERS
    // ----------------------------------------------------------------------
    
    // Back Button Click
    btnBack.addEventListener('click', () => {
        if (activeStep > 1) {
            activeStep--;
            updateWizardUI();
        }
    });

    // Next / Submit Button Click
    btnNext.addEventListener('click', () => {
        // Trigger default browser HTML5 validation checks for fields on current active step
        const currentView = stepViews[activeStep - 1];
        const fields = currentView.querySelectorAll('input, select, checkbox, textarea');
        
        let stepIsValid = true;
        fields.forEach(field => {
            if (!field.checkValidity()) {
                field.reportValidity();
                stepIsValid = false;
            }
        });

        if (!stepIsValid) return; // Halt traversal if validation fails

        if (activeStep < totalSteps) {
            activeStep++;
            updateWizardUI();
        } else {
            // Reaching Step 4 and clicking Submit triggers success log compiling
            triggerFinalCompilation();
        }
    });

    // Allow user to click directly on vertical timeline nodes to jump directly
    stepNodes.forEach((node, idx) => {
        node.addEventListener('click', () => {
            const targetStep = idx + 1;
            
            // To ensure validations pass when skipping ahead, only validate if trying to jump forward
            if (targetStep > activeStep) {
                // Validate intermediate steps first
                let validationPassed = true;
                for (let i = activeStep; i < targetStep; i++) {
                    const view = stepViews[i - 1];
                    const fields = view.querySelectorAll('input, select, checkbox');
                    fields.forEach(field => {
                        if (!field.checkValidity()) {
                            field.reportValidity();
                            validationPassed = false;
                        }
                    });
                }
                if (!validationPassed) return;
            }

            activeStep = targetStep;
            updateWizardUI();
        });
    });

    // Initialize UI on load
    updateWizardUI();

    // ----------------------------------------------------------------------
    // 4. COMPILER ENGINE & BLUEPRINT FILE DOWNLOAD
    // ----------------------------------------------------------------------
    const triggerFinalCompilation = () => {
        const formData = new FormData(form);
        
        const profile = {
            ownerDetails: {
                fullName: formData.get('fullName') || "Pravin Sharma",
                email: formData.get('email') || "pravin@domain.com"
            },
            academicProfile: {
                degreeEarned: formData.get('degree') || "None chosen",
                institution: formData.get('institution') || "N/A",
                graduationYear: parseInt(formData.get('gradYear')) || 2024
            },
            skillsPreferences: {
                fullTimeCommitment: formData.get('fulltime') ? true : false,
                remoteCapable: formData.get('remote') ? true : false,
                workspaceCity: formData.get('city') || "Unassigned"
            },
            professionalBio: formData.get('bio') || "",
            agreementStamp: formData.get('agreeTerms') ? "AGREED" : "PENDING",
            dateCompiled: new Date().toISOString(),
            profileVersion: "WIZARD-09"
        };

        compiledProfileJson = JSON.stringify(profile, null, 4);
        
        // Show success modal overlay
        if (overlay) overlay.classList.add('show');
        animateSuccessLog(profile.ownerDetails.fullName);
    };

    const animateSuccessLog = (name) => {
        const logs = [
            `[WIZARD] Aligning step parameters...`,
            `[WIZARD] Compiling Personal Details (Step 1)...`,
            `[WIZARD] Compiling Academic History (Step 2)...`,
            `[WIZARD] Compiling City & Preferences (Step 3)...`,
            `[WIZARD] Bundling data for owner: "${name.toUpperCase()}"...`,
            `[SUCCESS] Onboarding Profile compiled successfully! Build code: INDEX-09.`,
            `[INFO] Compilation completed. Download config blueprint below.`
        ];
        
        successLog.innerHTML = "";
        let idx = 0;
        
        const printLine = () => {
            if (idx < logs.length) {
                successLog.innerHTML += (idx === 0 ? "" : "\n") + logs[idx];
                successLog.scrollTop = successLog.scrollHeight;
                idx++;
                setTimeout(printLine, 180);
            }
        };
        
        printLine();
    };

    const hideModal = () => {
        if (overlay) overlay.classList.remove('show');
    };

    if (closeOverlay) closeOverlay.addEventListener('click', hideModal);
    if (dismissOverlay) dismissOverlay.addEventListener('click', hideModal);

    // Profile download trigger
    if (downloadProfileBtn) {
        downloadProfileBtn.addEventListener('click', () => {
            if (compiledProfileJson) {
                const blob = new Blob([compiledProfileJson], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = 'onboarding-profile.json';
                document.body.appendChild(a);
                a.click();
                
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        });
    }

    // ----------------------------------------------------------------------
    // 5. WIZARD RESET HANDLER (RESTORES DEFAULT WIZARD STATE)
    // ----------------------------------------------------------------------
    if (form) {
        form.addEventListener('reset', () => {
            setTimeout(() => {
                // Return to step 1 on clean reset
                activeStep = 1;
                updateWizardUI();
            }, 10);
        });
    }

});
