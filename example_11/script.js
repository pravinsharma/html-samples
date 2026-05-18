/* ==========================================================================
   EXAMPLE 11: PREMIUM REFERENCE FORM DICTIONARY INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let currentStep = 1;
    const totalSteps = 3;
    const requiredFields = [
        { id: 'input-first-name', name: 'First Name', type: 'text' },
        { id: 'input-last-name', name: 'Last Name', type: 'text' },
        { id: 'input-email', name: 'Email Address', type: 'email' },
        { id: 'input-password', name: 'Password', type: 'password' },
        { id: 'check-custom-privacy', name: 'Privacy Agreement', type: 'checkbox' },
        { id: 'input-date-available', name: 'Date Available', type: 'date' }
    ];

    // --- DOM ELEMENT REFERENCES ---
    const form = document.getElementById('premium-reference-form');
    const prevBtn = document.getElementById('btn-prev-step');
    const nextBtn = document.getElementById('btn-next-step');
    const nextBtnText = document.getElementById('next-btn-text');
    const nextBtnIcon = document.getElementById('next-btn-icon');
    const stepperProgress = document.getElementById('stepper-progress');
    const liveProgressPercent = document.getElementById('live-progress-percent');
    
    // Step panels
    const panels = {
        1: document.getElementById('form-panel-1'),
        2: document.getElementById('form-panel-2'),
        3: document.getElementById('form-panel-3')
    };

    // Stepper nodes
    const stepNodes = {
        1: document.getElementById('step-node-1'),
        2: document.getElementById('step-node-2'),
        3: document.getElementById('step-node-3')
    };

    // Skewed Ribbon Banner
    const floatingBanner = document.getElementById('active-step-banner');
    const floatingBannerText = floatingBanner.querySelector('span');

    // ==========================================================================
    // 1. STEP NAVIGATION ROUTER & TIMELINE CONTROL
    // ==========================================================================
    function updateNavigation() {
        // Hide/Show Previous Step Button
        if (currentStep === 1) {
            prevBtn.style.visibility = 'hidden';
        } else {
            prevBtn.style.visibility = 'visible';
        }

        // Update Next Step Button Text/Style
        if (currentStep === totalSteps) {
            nextBtnText.textContent = 'Submit Form';
            nextBtnIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <polyline points="20 6 9 17 4 12"/>
                                     </svg>`;
        } else {
            nextBtnText.textContent = 'Next Step';
            nextBtnIcon.innerHTML = `<path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>`;
        }

        // Toggle visibility of panels with visual slide transition
        Object.keys(panels).forEach(step => {
            const stepNum = parseInt(step);
            if (stepNum === currentStep) {
                panels[stepNum].classList.add('active');
            } else {
                panels[stepNum].classList.remove('active');
            }
        });

        // Update Stepper Node Visual Classes (Completed, Active, Pending)
        Object.keys(stepNodes).forEach(step => {
            const stepNum = parseInt(step);
            const node = stepNodes[stepNum];
            const nodeCircle = node.querySelector('.circle-node');
            const nodeNumText = node.querySelector('.node-num');

            if (stepNum < currentStep) {
                // Completed
                node.className = 'step-node completed';
                // Replace step number with tick mark dynamically
                nodeCircle.innerHTML = `
                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="display: block;">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span class="node-num" style="display: none;">${stepNum}</span>`;
            } else if (stepNum === currentStep) {
                // Active
                node.className = 'step-node active';
                nodeCircle.innerHTML = `<span class="node-num">${stepNum}</span>`;
                // Append Floating Ribbon Banner to the active node
                node.appendChild(floatingBanner);
                
                // Update Ribbon Text dynamically
                if (currentStep === 1) floatingBannerText.textContent = 'Profile & Account';
                else if (currentStep === 2) floatingBannerText.textContent = 'Controls & Options';
                else if (currentStep === 3) floatingBannerText.textContent = 'Upload & Finish';
            } else {
                // Pending
                node.className = 'step-node pending';
                nodeCircle.innerHTML = `<span class="node-num">${stepNum}</span>`;
            }
        });

        // Update Green Progress Timeline Width
        const progressWidths = { 1: 0, 2: 50, 3: 100 };
        stepperProgress.style.width = `${progressWidths[currentStep]}%`;
        
        // Scroll smoothly to top of glass board to keep user focused
        document.querySelector('.glass-board').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Stepper header node direct clicks (Dictionary Reference allows navigation freely)
    Object.keys(stepNodes).forEach(step => {
        const stepNum = parseInt(step);
        stepNodes[stepNum].addEventListener('click', () => {
            if (validateStep(currentStep) || stepNum < currentStep) {
                currentStep = stepNum;
                updateNavigation();
            } else {
                // Shake validation triggers if trying to skip ahead without filling required
                triggerStepValidationVisuals(currentStep);
            }
        });
    });

    // Navigation buttons listeners
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateNavigation();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            if (validateStep(currentStep)) {
                currentStep++;
                updateNavigation();
            } else {
                triggerStepValidationVisuals(currentStep);
            }
        } else {
            // Final submit
            if (validateStep(currentStep)) {
                submitAndCompileForm();
            } else {
                triggerStepValidationVisuals(currentStep);
            }
        }
    });


    // ==========================================================================
    // 2. INPUT VALIDATIONS: EMAIL & PASSWORD STRENGTH
    // ==========================================================================
    const emailInput = document.getElementById('input-email');
    const emailGroup = document.getElementById('email-group');
    const emailSuccessBadge = emailGroup.querySelector('.success-badge');
    const emailErrorBadge = emailGroup.querySelector('.error-badge');

    emailInput.addEventListener('input', () => {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (value === '') {
            emailInput.className = 'form-input';
            emailSuccessBadge.style.display = 'none';
            emailErrorBadge.style.display = 'none';
        } else if (emailRegex.test(value)) {
            emailInput.className = 'form-input is-valid';
            emailSuccessBadge.style.display = 'block';
            emailErrorBadge.style.display = 'none';
        } else {
            emailInput.className = 'form-input is-invalid';
            emailSuccessBadge.style.display = 'none';
            emailErrorBadge.style.display = 'block';
        }
        updateFormCompletionTracker();
    });

    // Password strength evaluator
    const passwordInput = document.getElementById('input-password');
    const strengthFill = document.getElementById('password-strength-fill');
    const strengthText = document.getElementById('password-strength-text');
    const togglePasswordBtn = document.getElementById('btn-toggle-password');

    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        let score = 0;

        if (val.length >= 8) score += 25; // Length
        if (/[A-Z]/.test(val)) score += 25; // Capital Letter
        if (/[0-9]/.test(val)) score += 25; // Numbers
        if (/[^A-Za-z0-9]/.test(val)) score += 25; // Special Character

        // Update fill bar & color
        strengthFill.style.width = `${score}%`;
        
        if (score === 0) {
            strengthFill.style.backgroundColor = 'transparent';
            strengthText.textContent = 'Password Strength: Empty';
            strengthText.style.color = '#94a3b8';
        } else if (score <= 25) {
            strengthFill.style.backgroundColor = '#dc2626'; // Red
            strengthText.textContent = 'Password Strength: Weak (Must include capitals, numbers, specs)';
            strengthText.style.color = '#dc2626';
        } else if (score <= 50) {
            strengthFill.style.backgroundColor = '#f59e0b'; // Orange
            strengthText.textContent = 'Password Strength: Fair (Good, add special characters)';
            strengthText.style.color = '#f59e0b';
        } else if (score <= 75) {
            strengthFill.style.backgroundColor = '#eab308'; // Yellow
            strengthText.textContent = 'Password Strength: Strong (Very Secure)';
            strengthText.style.color = '#eab308';
        } else {
            strengthFill.style.backgroundColor = '#1b8c43'; // Green
            strengthText.textContent = 'Password Strength: Excellent (Highly Certified)';
            strengthText.style.color = '#1b8c43';
        }
        updateFormCompletionTracker();
    });

    // Show/Hide Password Toggle button logic
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const openEye = togglePasswordBtn.querySelector('.eye-open');
        const closedEye = togglePasswordBtn.querySelector('.eye-closed');
        
        if (type === 'text') {
            openEye.style.display = 'none';
            closedEye.style.display = 'block';
        } else {
            openEye.style.display = 'block';
            closedEye.style.display = 'none';
        }
    });

    // Character counter for Remarks Textarea
    const bioTextarea = document.getElementById('input-bio');
    const bioCharCountBadge = document.getElementById('bio-char-count');

    bioTextarea.addEventListener('input', () => {
        const length = bioTextarea.value.length;
        bioCharCountBadge.textContent = `${length} / 250 characters`;
    });


    // ==========================================================================
    // 3. AUTOCOMPLETE COUNTRY COMBOBOX FILTER
    // ==========================================================================
    const countryList = [
        "United States", "United Kingdom", "Canada", "Australia", "Germany", 
        "France", "India", "Japan", "Brazil", "South Africa", "Spain", "Italy", 
        "Singapore", "New Zealand", "Netherlands"
    ];

    const comboboxInput = document.getElementById('input-country');
    const comboboxList = document.getElementById('country-results-list');
    const comboboxChevron = document.querySelector('.combobox-chevron');

    function filterCountries() {
        const query = comboboxInput.value.toLowerCase().trim();
        comboboxList.innerHTML = '';

        const matches = countryList.filter(country => country.toLowerCase().includes(query));

        if (matches.length > 0) {
            matches.forEach(country => {
                const li = document.createElement('li');
                li.textContent = country;
                li.addEventListener('click', () => {
                    comboboxInput.value = country;
                    closeCombobox();
                });
                comboboxList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.className = 'no-results';
            li.textContent = 'No matching countries found';
            comboboxList.appendChild(li);
        }
        comboboxList.classList.add('open');
    }

    function closeCombobox() {
        comboboxList.classList.remove('open');
    }

    comboboxInput.addEventListener('input', filterCountries);
    
    // Toggle on Chevron / input focus
    comboboxInput.addEventListener('focus', filterCountries);
    
    // Close on outside clicks
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#country-combobox-group')) {
            closeCombobox();
        }
    });


    // ==========================================================================
    // 4. CUSTOM PREMIUM ROLE SELECT DROPDOWN
    // ==========================================================================
    const customSelectField = document.getElementById('custom-select-field-role');
    const selectedRoleText = document.getElementById('selected-role-text');
    const roleDropdownList = document.getElementById('dropdown-list-role');
    const hiddenRoleInput = document.getElementById('input-custom-role');

    customSelectField.addEventListener('click', (e) => {
        e.stopPropagation();
        customSelectField.classList.toggle('open');
    });

    roleDropdownList.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Clear current selected item
            roleDropdownList.querySelectorAll('.dropdown-item').forEach(li => li.classList.remove('selected'));
            
            // Mark new select
            item.classList.add('selected');
            const val = item.getAttribute('data-value');
            const text = item.textContent;

            selectedRoleText.textContent = text;
            hiddenRoleInput.value = val;

            customSelectField.classList.remove('open');
            updateFormCompletionTracker();
        });
    });

    // Close role selector on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-group')) {
            customSelectField.classList.remove('open');
        }
    });


    // ==========================================================================
    // 5. RADIOS & SWITCHES & RANGE SLIDER & PILL TAGS
    // ==========================================================================
    // Radio grid layout card selection highlights
    const radioCardInputs = document.querySelectorAll('.radio-card-input');
    radioCardInputs.forEach(input => {
        input.addEventListener('change', () => {
            // Clear current active tags
            document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('active'));
            // Mark parent wrapper label active
            if (input.checked) {
                input.closest('.radio-card').classList.add('active');
            }
        });
    });

    // Experience Range Slider live output badge
    const experienceSlider = document.getElementById('input-slider-experience');
    const experienceBadge = document.getElementById('slider-experience-badge');

    experienceSlider.addEventListener('input', () => {
        const yrs = experienceSlider.value;
        experienceBadge.textContent = yrs === '0' ? 'Beginner (0 Yrs)' : `${yrs} Year${yrs === '1' ? '' : 's'}`;
    });

    // Dynamic Pill Tags selectors (Skills toggle cloud)
    const pillTags = document.querySelectorAll('.pill-tag');
    const hiddenSkillsInput = document.getElementById('input-selected-skills');

    pillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
            
            // Map active pills values
            const activeSkills = [];
            document.querySelectorAll('.pill-tag.active').forEach(activeTag => {
                activeSkills.push(activeTag.getAttribute('data-value'));
            });
            
            hiddenSkillsInput.value = activeSkills.join(',');
        });
    });


    // ==========================================================================
    // 6. ACCENT COLOR CUSTOMIZATION (THEME ADAPTER)
    // ==========================================================================
    const colorPickerInput = document.getElementById('input-color-accent');
    const colorBadgeValue = document.getElementById('color-selected-value');

    colorPickerInput.addEventListener('input', () => {
        const hexColor = colorPickerInput.value;
        colorBadgeValue.textContent = hexColor.toUpperCase();

        // Convert HEX to HSL values dynamically for proper visual overlays
        const hsl = hexToHSL(hexColor);
        
        // Dynamically apply visual design variables to CSS Root
        document.documentElement.style.setProperty('--color-primary-green', hexColor);
        document.documentElement.style.setProperty('--color-green-hover', lightenDarkenColor(hexColor, -15));
        document.documentElement.style.setProperty('--color-green-tint', `hsl(${hsl.h}, ${hsl.s}%, 97%)`);
        document.documentElement.style.setProperty('--color-green-glow', `rgba(${hexToRgb(hexColor).r}, ${hexToRgb(hexColor).g}, ${hexToRgb(hexColor).b}, 0.35)`);
        
        // Also update modal progress fill ring color
        document.getElementById('modal-score-ring').setAttribute('stroke', hexColor);
    });

    // HSL Hex Converter details helper
    function hexToHSL(hex) {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function lightenDarkenColor(col, amt) {
        let usePound = false;
        if (col[0] === "#") {
            col = col.slice(1);
            usePound = true;
        }
        let num = parseInt(col, 16);
        let r = (num >> 16) + amt;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;
        let b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;
        let g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
    }


    // ==========================================================================
    // 7. FILE DRAG & DROP ZONE CONTROLS
    // ==========================================================================
    const dropZone = document.getElementById('file-drop-zone');
    const fileInput = document.getElementById('input-file-document');
    const fileCard = document.getElementById('file-card-state');
    const fileNameBadge = document.getElementById('uploaded-file-name');
    const fileSizeBadge = document.getElementById('uploaded-file-size');
    const progressFill = document.getElementById('upload-progress-fill');
    const removeFileBtn = document.getElementById('btn-remove-file');
    
    let uploadedFile = null;

    // Trigger browse on zone click
    dropZone.addEventListener('click', (e) => {
        if (!e.target.closest('#file-card-state') && !e.target.closest('input')) {
            fileInput.click();
        }
    });

    // Drag-over styling shifts
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        }, false);
    });

    // Drop handler
    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    // Native browse selection handler
    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });

    function handleFiles(files) {
        if (files.length === 0) return;
        const file = files[0];
        
        // Verify constraint size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File exceeds maximum size threshold of 5 megabytes.');
            return;
        }

        // Show layout card
        uploadedFile = file;
        fileNameBadge.textContent = file.name;
        fileSizeBadge.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        
        fileCard.style.display = 'flex';
        progressFill.style.width = '0%';

        // Simulate a smooth 1-second uploading progress visual
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressFill.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                updateFormCompletionTracker();
            }
        }, 80);
    }

    // Cancel / Clear upload file
    removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        uploadedFile = null;
        fileInput.value = '';
        fileCard.style.display = 'none';
        progressFill.style.width = '0%';
        updateFormCompletionTracker();
    });


    // ==========================================================================
    // 8. LIVE REQUIRED FORM PROGRESS CALCULATION
    // ==========================================================================
    requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) {
            const eventType = field.type === 'checkbox' ? 'change' : 'input';
            el.addEventListener(eventType, updateFormCompletionTracker);
        }
    });

    // Trigger update on date pick as well
    document.getElementById('input-date-available').addEventListener('change', updateFormCompletionTracker);

    function updateFormCompletionTracker() {
        let filledCount = 0;

        requiredFields.forEach(field => {
            const el = document.getElementById(field.id);
            if (!el) return;

            if (field.type === 'checkbox') {
                if (el.checked) filledCount++;
            } else if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (el.value.trim() !== '' && emailRegex.test(el.value)) filledCount++;
            } else {
                if (el.value.trim() !== '') filledCount++;
            }
        });

        // Compute percentage of required items filled
        const percent = Math.round((filledCount / requiredFields.length) * 100);
        
        // Update footer clocks
        liveProgressPercent.textContent = `${percent}%`;
    }


    // ==========================================================================
    // 9. STEP VALIDATION ENGINE (BLANK PREVENTERS)
    // ==========================================================================
    function validateStep(step) {
        let isValid = true;

        if (step === 1) {
            // Required: First Name, Last Name, Email, Password
            const fName = document.getElementById('input-first-name');
            const lName = document.getElementById('input-last-name');
            const email = document.getElementById('input-email');
            const pwd = document.getElementById('input-password');

            if (fName.value.trim() === '') { fName.classList.add('is-invalid'); isValid = false; }
            else { fName.classList.remove('is-invalid'); }

            if (lName.value.trim() === '') { lName.classList.add('is-invalid'); isValid = false; }
            else { lName.classList.remove('is-invalid'); }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '' || !emailRegex.test(email.value)) { email.classList.add('is-invalid'); isValid = false; }
            else { email.classList.remove('is-invalid'); }

            if (pwd.value.trim() === '') { pwd.classList.add('is-invalid'); isValid = false; }
            else { pwd.classList.remove('is-invalid'); }
        }

        if (step === 2) {
            // Required: Custom Privacy Policy checkbox checked
            const privacy = document.getElementById('check-custom-privacy');
            const privacyBox = document.querySelector('.custom-checkbox-box');

            if (!privacy.checked) {
                privacyBox.style.borderColor = '#dc2626';
                privacyBox.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.2)';
                isValid = false;
            } else {
                privacyBox.style.borderColor = '';
                privacyBox.style.boxShadow = '';
            }
        }

        if (step === 3) {
            // Required: Earliest date available filled
            const dateAvail = document.getElementById('input-date-available');
            if (dateAvail.value === '') { dateAvail.classList.add('is-invalid'); isValid = false; }
            else { dateAvail.classList.remove('is-invalid'); }
        }

        return isValid;
    }

    // Trigger visual highlights for required components of active step
    function triggerStepValidationVisuals(step) {
        validateStep(step);
        
        // Trigger shaking animation on first missing element on step page
        const firstInvalid = panels[step].querySelector('.is-invalid, .checkbox-label-wrapper');
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Clear validation borders when user starts typing again
    form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid');
        });
    });


    // ==========================================================================
    // 10. SUBMIT AND COMPILE (BLUEPRINT MANIFEST CONSOLE)
    // ==========================================================================
    const submitOverlay = document.getElementById('submission-overlay');
    const closeOverlayBtn = document.getElementById('close-overlay-btn');
    const dismissOverlayBtn = document.getElementById('btn-dismiss-overlay');
    const downloadCertificateBtn = document.getElementById('btn-download-blueprint');
    const manifestTableBody = document.getElementById('manifest-table-body');

    // Score Board elements
    const modalValName = document.getElementById('modal-val-name');
    const modalValSector = document.getElementById('modal-val-sector');
    const modalValLayout = document.getElementById('modal-val-layout');
    const modalScoreRing = document.getElementById('modal-score-ring');
    const modalScorePercent = document.getElementById('modal-score-percent');

    function submitAndCompileForm() {
        // Collect form data values
        const fName = document.getElementById('input-first-name').value.trim();
        const lName = document.getElementById('input-last-name').value.trim();
        const email = document.getElementById('input-email').value.trim();
        const phone = document.getElementById('input-phone').value.trim() || 'Not Provided';
        const country = document.getElementById('input-country').value.trim() || 'Default Global';
        const bio = document.getElementById('input-bio').value.trim() || 'Remarks Left Empty';
        
        const nativeSelect = document.getElementById('select-native-industry');
        const nativeSelectVal = nativeSelect.options[nativeSelect.selectedIndex]?.text || 'None Chosen';
        
        const customSelectVal = selectedRoleText.textContent;
        const announceSub = document.getElementById('check-native-updates').checked ? 'Subscribed' : 'Not Subscribed';
        const cloudAlerts = document.getElementById('toggle-cloud-alerts').checked ? 'Active' : 'Muted';
        const strictCompile = document.getElementById('toggle-strict-compilation').checked ? 'Enabled' : 'Disabled';
        const experienceYrs = experienceSlider.value + ' Years';
        
        const selectedLayout = document.querySelector('input[name="layout-mode"]:checked')?.value || 'None';
        const activeSkills = hiddenSkillsInput.value || 'None Selected';
        const dateAvail = document.getElementById('input-date-available').value;
        const timeContact = document.getElementById('input-time-contact').value;
        const themeAccentHex = colorPickerInput.value.toUpperCase();
        const docFileName = uploadedFile ? uploadedFile.name : 'No file uploaded';

        // 1. Populate Scoreboard
        modalValName.textContent = `${fName} ${lName}`;
        modalValSector.textContent = nativeSelect.options[nativeSelect.selectedIndex]?.value === '' ? 'Core Systems' : nativeSelect.options[nativeSelect.selectedIndex]?.text.split(' ')[0];
        modalValLayout.textContent = selectedLayout.toUpperCase();

        // 2. Map Manifest elements into table body
        const manifestRecords = [
            { id: 'Candidate.Name', val: `${fName} ${lName}` },
            { id: 'Account.Email', val: email },
            { id: 'Profile.Phone', val: phone },
            { id: 'Profile.Country', val: country },
            { id: 'Profile.Biography', val: bio },
            { id: 'Select.IndustryNative', val: nativeSelectVal },
            { id: 'Select.RoleCustom', val: customSelectVal },
            { id: 'Checkbox.Announcements', val: announceSub },
            { id: 'Toggle.CloudAlerts', val: cloudAlerts },
            { id: 'Toggle.StrictCompilation', val: strictCompile },
            { id: 'Slider.Experience', val: experienceYrs },
            { id: 'Radio.LayoutEnvironment', val: selectedLayout.toUpperCase() },
            { id: 'Pills.SkillStack', val: activeSkills },
            { id: 'Picker.DateOnboard', val: dateAvail },
            { id: 'Picker.TimeCallWindow', val: timeContact },
            { id: 'Picker.ThemeHex', val: themeAccentHex },
            { id: 'Document.AttachedName', val: docFileName }
        ];

        manifestTableBody.innerHTML = '';
        manifestRecords.forEach(record => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${record.id}</td>
                <td>${record.val}</td>
            `;
            manifestTableBody.appendChild(tr);
        });

        // 3. Trigger Modal display
        submitOverlay.style.display = 'flex';

        // 4. Animate SVG Circle Ring based on required questions filled (Should always be 100% since required fields are validation blockages)
        modalScorePercent.textContent = '100%';
        // Full circle is circumference 2*pi*50 = 314
        modalScoreRing.style.strokeDashoffset = '0';
    }

    // Modal dismissal
    function dismissOverlay() {
        submitOverlay.style.display = 'none';
    }

    closeOverlayBtn.addEventListener('click', dismissOverlay);
    dismissOverlayBtn.addEventListener('click', dismissOverlay);
    
    // Clicking outside modal content dismisses
    submitOverlay.addEventListener('click', (e) => {
        if (e.target === submitOverlay) {
            dismissOverlay();
        }
    });

    // Simulator Log compilation on blueprint click
    downloadCertificateBtn.addEventListener('click', () => {
        alert('Simulator: Certificate manifest successfully signed and downloaded locally as blueprint-certificate.json');
        console.log('[DOWNLOAD] Compilation Certificate outputted.');
    });

    // Initialize layout setup
    updateNavigation();
    updateFormCompletionTracker();
});
