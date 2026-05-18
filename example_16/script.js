/**
 * Vim & Vigour Coffee Club - Configurator & Subscription Form Interactions
 * State-of-the-art client-side logic for interactive components & receipt calculations
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // STATE MANAGERS & SELECTIONS DEFINITION
    // ==========================================================================
    const state = {
        origin: 'tanzania',
        basePrice: 14.50,
        strength: '06/10',
        grind: 'whole_beans',
        quantity: 1,
        frequency: 'monthly',
        deliveryCycle: 'Monthly Batch'
    };

    // DOM Elements
    const form = document.getElementById('coffee-club-form');
    const submitBtn = document.getElementById('order-submit-btn');
    
    // Receipt Summary Nodes
    const receiptOrigin = document.getElementById('receipt-origin-val');
    const receiptGrind = document.getElementById('receipt-grind-val');
    const receiptStrength = document.getElementById('receipt-strength-val');
    const receiptQty = document.getElementById('receipt-qty-val');
    const receiptFrequency = document.getElementById('receipt-frequency-val');
    const receiptCycle = document.getElementById('receipt-cycle-val');
    const receiptPrice = document.getElementById('receipt-price-val');
    const receiptDate = document.getElementById('receipt-date-val');
    const receiptTicket = document.getElementById('receipt-ticket-id');
    const receiptBarcodeDigits = document.getElementById('receipt-barcode-digits');

    // Success Modal Nodes
    const successOverlay = document.getElementById('success-modal-overlay');
    const dismissBtn = document.getElementById('modal-dismiss-btn');
    const modalUserName = document.getElementById('modal-user-name');
    const modalMemberId = document.getElementById('modal-member-id');
    const modalCoffeeSelection = document.getElementById('modal-coffee-selection');
    const modalDeliveryCycle = document.getElementById('modal-delivery-cycle');
    const modalRoastDate = document.getElementById('modal-roast-date');

    // ==========================================================================
    // INITIALIZE DATE & TICKET REFERENCE (REALTIME DESIGN METADATA)
    // ==========================================================================
    function initializeMetadata() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        
        // Dynamic Receipt Date
        const formattedDate = `${dd}-${mm}-${yyyy}`;
        receiptDate.textContent = `DATE: ${formattedDate}`;

        // Dynamic Unique Ticket reference
        const ticketNum = Math.floor(10000 + Math.random() * 90000);
        const ticketId = `#VV-${ticketNum}`;
        receiptTicket.textContent = `TKT: ${ticketId}`;

        // Dynamic Barcode Digits
        const barcodeVal = `401${dd}${mm}${ticketNum}`;
        receiptBarcodeDigits.textContent = barcodeVal;
    }
    initializeMetadata();

    // ==========================================================================
    // BEANS ORIGIN CARD SWITCHER
    // ==========================================================================
    const originCards = document.querySelectorAll('.origin-card');
    originCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selection class from all cards
            originCards.forEach(c => c.classList.remove('selected'));
            
            // Add to clicked
            card.classList.add('selected');
            
            // Toggle internal radio checked state
            const radio = card.querySelector('.origin-card-radio');
            radio.checked = true;

            // Update State
            state.origin = card.getAttribute('data-value');
            state.basePrice = parseFloat(card.getAttribute('data-price'));
            
            // Update Receipt
            receiptOrigin.textContent = card.querySelector('.origin-title').textContent;
            
            // Trigger recalculation
            calculateTotalPrice();
        });
    });

    // ==========================================================================
    // ROAST STRENGTH STAMPS ACTIVE STATE
    // ==========================================================================
    const strengthItems = document.querySelectorAll('.strength-stamp-item');
    strengthItems.forEach(item => {
        item.addEventListener('click', () => {
            strengthItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const radio = item.querySelector('.strength-stamp-radio');
            radio.checked = true;

            state.strength = item.getAttribute('data-value');
            receiptStrength.textContent = state.strength;
        });
    });

    // ==========================================================================
    // GRIND PROFILE CONFIGURATOR
    // ==========================================================================
    const grindCards = document.querySelectorAll('.grind-card');
    grindCards.forEach(card => {
        card.addEventListener('click', () => {
            grindCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            const radio = card.querySelector('.grind-card-radio');
            radio.checked = true;

            state.grind = card.getAttribute('data-value');
            receiptGrind.textContent = card.getAttribute('data-label');
        });
    });

    // ==========================================================================
    // STEPPER WEIGHT/BAG COUNTER CONTROLLER
    // ==========================================================================
    const decrementBtn = document.querySelector('.decrement-btn');
    const incrementBtn = document.querySelector('.increment-btn');
    const qtyInput = document.querySelector('.stepper-value-input');

    decrementBtn.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val > 1) {
            val -= 1;
            qtyInput.value = val;
            updateQuantity(val);
        }
    });

    incrementBtn.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val < 10) {
            val += 1;
            qtyInput.value = val;
            updateQuantity(val);
        }
    });

    function updateQuantity(val) {
        state.quantity = val;
        // Grams label calculations
        const totalWeightGrams = val * 250;
        const formattedWeight = val === 1 ? '1 Bag (250g)' : `${val} Bags (${totalWeightGrams}g)`;
        receiptQty.textContent = formattedWeight;
        calculateTotalPrice();
    }

    // ==========================================================================
    // CUSTOM FREQUENCY SELECT DROPDOWN LOGIC
    // ==========================================================================
    const selectWrapper = document.getElementById('frequency-select-wrapper');
    const selectTrigger = selectWrapper.querySelector('.select-trigger-bar');
    const currentSelectDisplay = document.getElementById('current-frequency-display');
    const dropdownListOptions = selectWrapper.querySelectorAll('.select-dropdown-list li');
    const nativeSelect = selectWrapper.querySelector('.native-hidden-select');

    // Toggle dropdown open/close
    selectTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        selectWrapper.classList.toggle('open');
    });

    // Options selection
    dropdownListOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Visual checks
            dropdownListOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            
            // Display value update
            const optVal = opt.getAttribute('data-value');
            const optText = opt.textContent;
            currentSelectDisplay.textContent = optText;
            
            // Set native select for native submissions
            nativeSelect.value = optVal;
            
            // Update State
            state.frequency = optVal;
            receiptFrequency.textContent = optText.split(' (')[0]; // strip the ' (Standard)' out for receipt spacing
            
            // Set custom Shipping Cycles notes based on frequency
            if (optVal === 'weekly') {
                state.deliveryCycle = 'Weekly (Fri Roasts)';
            } else if (optVal === 'biweekly') {
                state.deliveryCycle = 'Fortnightly Roasts';
            } else {
                state.deliveryCycle = 'Monthly Batch';
            }
            receiptCycle.textContent = state.deliveryCycle;

            // Close selector
            selectWrapper.classList.remove('open');
        });
    });

    // Click outside handler to close dropdown
    document.addEventListener('click', () => {
        selectWrapper.classList.remove('open');
    });

    // ==========================================================================
    // PRICE CALCULATION LOGIC
    // ==========================================================================
    function calculateTotalPrice() {
        const total = state.basePrice * state.quantity;
        receiptPrice.textContent = `£${total.toFixed(2)}`;
    }

    // ==========================================================================
    // CUSTOM FORM FIELD INTEGRITY VALIDATION & SUBMISSION
    // ==========================================================================
    
    // Focus effect handling for contact inputs to ensure floating labels work correctly
    const inputs = document.querySelectorAll('.floating-input, .floating-textarea');
    inputs.forEach(input => {
        // Run checks on load for pre-filled values
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
        
        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                input.setAttribute('placeholder', ' '); // ensures css selector works
            }
        });
    });

    // Intercept order placement trigger
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Intercepting direct post so we can run custom flow

        // Basic HTML5 validation run
        if (!form.checkValidity()) {
            // Find and highlight first invalid element
            const invalidFields = form.querySelectorAll(':invalid');
            
            // Highlight validation errors visually
            invalidFields.forEach(field => {
                field.style.borderBottomColor = 'red';
                // Reset standard borders on focus
                field.addEventListener('input', function resetError() {
                    field.style.borderBottomColor = '';
                    field.removeEventListener('input', resetError);
                });
            });
            
            // Focus first error field
            if (invalidFields.length > 0) {
                invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                invalidFields[0].focus();
            }
            return;
        }

        // Gather final user info
        const fullName = document.getElementById('input-full-name').value;
        const finalCoffee = receiptOrigin.textContent;
        const finalFrequency = receiptFrequency.textContent;
        const currentTicket = receiptTicket.textContent;

        // Populate success modal fields
        modalUserName.textContent = fullName;
        modalMemberId.textContent = currentTicket;
        modalCoffeeSelection.textContent = `${finalCoffee} Single-Origin (${receiptQty.textContent})`;
        modalDeliveryCycle.textContent = finalFrequency;

        // Calculate tomorrow's roast date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const day = String(tomorrow.getDate()).padStart(2, '0');
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const year = tomorrow.getFullYear();
        modalRoastDate.textContent = `Tomorrow Morning (${day}-${month}-${year})`;

        // Display premium roasting modal overlay
        successOverlay.classList.add('visible');
    });

    // Modal dismissal handler
    dismissBtn.addEventListener('click', () => {
        successOverlay.classList.remove('visible');
        
        // Reset full form elements elegantly
        form.reset();
        
        // Reset Visual Config states to defaults
        originCards.forEach(c => c.classList.remove('selected'));
        originCards[0].classList.add('selected');
        
        strengthItems.forEach(i => i.classList.remove('active'));
        strengthItems[1].classList.add('active'); // default to 06/10
        
        grindCards.forEach(c => c.classList.remove('selected'));
        grindCards[0].classList.add('selected'); // default to Whole beans
        
        qtyInput.value = 1;
        currentSelectDisplay.textContent = 'Every Month (Standard)';
        
        // Reset internal states
        state.origin = 'tanzania';
        state.basePrice = 14.50;
        state.strength = '06/10';
        state.grind = 'whole_beans';
        state.quantity = 1;
        state.frequency = 'monthly';
        state.deliveryCycle = 'Monthly Batch';

        // Re-generate fresh ticket ID & metadata
        initializeMetadata();

        // Update Receipt text nodes
        receiptOrigin.textContent = 'Tanzania';
        receiptGrind.textContent = 'Whole Beans';
        receiptStrength.textContent = '06/10';
        receiptQty.textContent = '1 Bag (250g)';
        receiptFrequency.textContent = 'Every Month';
        receiptCycle.textContent = 'Monthly Batch';
        receiptPrice.textContent = '£14.50';

        // Scroll to top of window smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
