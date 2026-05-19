document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // SYSTEM CLOCK & INITIAL STATE
  // ==========================================================================
  function updateTime() {
    const timeEl = document.getElementById('current-time');
    if (timeEl) {
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: true });
    }
  }
  setInterval(updateTime, 1000);
  updateTime();

  // Draw initial barcode preview bars
  updateBarcodePreview('678-17892-2334');

  // ==========================================================================
  // TAB NAVIGATION SYSTEM
  // ==========================================================================
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.tab-panel');

  navItems.forEach(item => {
    const btn = item.querySelector('button');
    btn.addEventListener('click', () => {
      const targetTab = item.dataset.tab;
      
      // Update active nav class
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Update active panel class
      panels.forEach(panel => {
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add('active-panel');
        } else {
          panel.classList.remove('active-panel');
        }
      });
    });
  });

  // ==========================================================================
  // REACTOR TELEMETRY SIMULATOR (Dials and metrics)
  // ==========================================================================
  const r1State = { temp: 64.8, press: 2.41, ventOpen: false };
  const r2State = { temp: 88.5, press: 1.18, ventOpen: false };
  const r3State = { temp: 24.2, press: 0.98, ventOpen: false };

  // Dial Circumference for R=40 is 2 * PI * R = 251.2
  const dialCircumference = 251.2;

  function updateReactorDials() {
    // 1. Nitric Reactor R-01 (Vent open drops temp and pressure)
    r1State.temp += (Math.random() - (r1State.ventOpen ? 0.6 : 0.5)) * 0.4;
    r1State.press += (Math.random() - (r1State.ventOpen ? 0.65 : 0.5)) * 0.05;
    if (r1State.temp < 10) r1State.temp = 10;
    if (r1State.press < 0) r1State.press = 0;

    // 2. Sulfuric Reactor R-02
    r2State.temp += (Math.random() - (r2State.ventOpen ? 0.6 : 0.5)) * 0.5;
    r2State.press += (Math.random() - (r2State.ventOpen ? 0.65 : 0.5)) * 0.06;
    if (r2State.temp < 10) r2State.temp = 10;
    if (r2State.press < 0) r2State.press = 0;

    // 3. Hyaluronic Reactor R-03
    r3State.temp += (Math.random() - (r3State.ventOpen ? 0.55 : 0.5)) * 0.1;
    r3State.press += (Math.random() - (r3State.ventOpen ? 0.6 : 0.5)) * 0.01;
    if (r3State.temp < 10) r3State.temp = 10;
    if (r3State.press < 0) r3State.press = 0;

    // Render R1
    updateDialValue('r1-temp', r1State.temp, 120, '°C');
    updateDialValue('r1-press', r1State.press, 4, ' BAR');
    
    // Render R2
    updateDialValue('r2-temp', r2State.temp, 120, '°C');
    updateDialValue('r2-press', r2State.press, 4, ' BAR');

    // Render R3
    updateDialValue('r3-temp', r3State.temp, 120, '°C');
    updateDialValue('r3-press', r3State.press, 4, ' BAR');
  }

  function updateDialValue(prefix, val, maxVal, unit) {
    const valText = document.querySelector(`.${prefix}-txt`);
    const valBar = document.querySelector(`.${prefix}-bar`);
    if (valText && valBar) {
      valText.textContent = val.toFixed(prefix.includes('press') ? 2 : 1) + unit;
      const percentage = Math.min(Math.max((val / maxVal) * 100, 0), 100);
      const offset = dialCircumference - (percentage / 100) * dialCircumference;
      valBar.style.strokeDashoffset = offset;
    }
  }

  // Hook up Vent Toggles in JS logic
  const r1Vent = document.querySelector('.r1-vent-switch');
  if (r1Vent) r1Vent.addEventListener('change', (e) => r1State.ventOpen = e.target.checked);
  
  const r2Vent = document.querySelector('.r2-vent-switch');
  if (r2Vent) r2Vent.addEventListener('change', (e) => r2State.ventOpen = e.target.checked);

  const r3Vent = document.querySelector('.r3-vent-switch');
  if (r3Vent) r3Vent.addEventListener('change', (e) => r3State.ventOpen = e.target.checked);

  setInterval(updateReactorDials, 1500);
  updateReactorDials();


  // ==========================================================================
  // REACTOR PANEL FILTERING
  // ==========================================================================
  const subNavBtns = document.querySelectorAll('.sub-nav-btn');
  const reactorCards = document.querySelectorAll('.reactor-card');

  subNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subNavBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetReactor = btn.dataset.reactor;
      reactorCards.forEach(card => {
        if (targetReactor === 'all' || card.dataset.reactorId === targetReactor) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ==========================================================================
  // DIAGNOSTIC GRAPH WAVEFORM GENERATOR
  // ==========================================================================
  const chartPath = document.getElementById('live-chart-path');
  let graphTick = 0;

  function animateGraph() {
    if (!chartPath) return;
    graphTick += 0.15;
    
    // Wave points matching "P (Next Neighbour) vs Position [mm]"
    const xCoords = [40, 90, 156, 210, 272, 330, 388, 446, 504, 562, 620];
    const baseAmplitudes = [180, 140, 160, 100, 80, 110, 130, 90, 60, 50, 30];
    
    // Calculate new path string with sine oscillations
    let pathString = `M ${xCoords[0]} ${baseAmplitudes[0] + Math.sin(graphTick) * 5}`;
    for (let i = 1; i < xCoords.length; i++) {
      const wobble = Math.sin(graphTick + i) * 6;
      pathString += ` L ${xCoords[i]} ${baseAmplitudes[i] + wobble}`;
    }
    
    chartPath.setAttribute('d', pathString);
  }
  setInterval(animateGraph, 150);


  // ==========================================================================
  // FORMULATION BUILDER CONTROLS & LIVE PREVIEW
  // ==========================================================================
  const form = document.getElementById('formulation-form');
  const inputName = document.getElementById('formula-name');
  const inputBatch = document.getElementById('batch-id');
  const inputCas = document.getElementById('cas-number');
  const selectCarrier = document.getElementById('base-carrier');
  const inputVolume = document.getElementById('volume-input');
  const inputRange = document.getElementById('concentration-range');
  const valRangeLabel = document.getElementById('concentration-val');
  
  // Volume buttons
  const volPlus = document.getElementById('vol-plus-btn');
  const volMinus = document.getElementById('vol-minus-btn');

  // Preview elements
  const prevName = document.getElementById('prev-name-display');
  const prevVol = document.getElementById('prev-volume-display');
  const prevLido = document.getElementById('prev-lido-display');
  const prevCas = document.getElementById('prev-cas-display');
  const prevBarcodeTxt = document.getElementById('prev-barcode-text');

  // Preview NFPA Val Labels
  const nfpaH = document.getElementById('nfpa-health-val');
  const nfpaF = document.getElementById('nfpa-fire-val');
  const nfpaR = document.getElementById('nfpa-react-val');
  const nfpaS = document.getElementById('nfpa-special-val');

  // Hazard Icon Elements
  const icoCorrosive = document.getElementById('ico-corrosive');
  const icoToxic = document.getElementById('ico-toxic');

  // Range slider handler
  if (inputRange && valRangeLabel) {
    inputRange.addEventListener('input', (e) => {
      valRangeLabel.textContent = e.target.value + '%';
    });
  }

  // Stepper handlers
  if (volPlus && inputVolume) {
    volPlus.addEventListener('click', () => {
      let currentVal = parseInt(inputVolume.value, 10);
      if (currentVal < 500) {
        inputVolume.value = currentVal + 5;
        triggerPreviewUpdates();
      }
    });
  }

  if (volMinus && inputVolume) {
    volMinus.addEventListener('click', () => {
      let currentVal = parseInt(inputVolume.value, 10);
      if (currentVal > 5) {
        inputVolume.value = currentVal - 5;
        triggerPreviewUpdates();
      }
    });
  }

  // Monitor updates for sticker preview
  const previewTriggers = [inputName, inputBatch, inputCas, selectCarrier];
  previewTriggers.forEach(input => {
    if (input) {
      input.addEventListener('input', triggerPreviewUpdates);
      input.addEventListener('change', triggerPreviewUpdates);
    }
  });

  // Radios for stabilizer stage
  const radioBuffers = document.querySelectorAll('input[name="buffer-agent"]');
  radioBuffers.forEach(radio => {
    radio.addEventListener('change', triggerPreviewUpdates);
  });

  // Checkbox state updates for preview
  const checkCorrosive = document.getElementById('hazard-corrosive');
  const checkToxic = document.getElementById('hazard-toxic');
  const checkFlammable = document.getElementById('hazard-flammable');
  const checkHealth = document.getElementById('hazard-health');
  
  [checkCorrosive, checkToxic, checkFlammable, checkHealth].forEach(chk => {
    if (chk) chk.addEventListener('change', triggerPreviewUpdates);
  });

  function triggerPreviewUpdates() {
    // 1. Text displays
    if (prevName && inputName) {
      prevName.textContent = inputName.value ? inputName.value.toUpperCase() : 'HYALURONIC FORMULA 60A';
    }
    if (prevVol && inputVolume) {
      prevVol.textContent = `${inputVolume.value}mL Single Use`;
    }
    if (prevCas && inputCas) {
      prevCas.textContent = `CAS REF: ${inputCas.value ? inputCas.value : '7697-37-2'}`;
    }
    if (prevBarcodeTxt && inputBatch) {
      const serial = inputBatch.value ? inputBatch.value : '678-17892-2334';
      prevBarcodeTxt.textContent = `${serial}(03)`;
      updateBarcodePreview(serial);
    }

    // 2. Buffer details display
    if (prevLido) {
      const selectedRadio = document.querySelector('input[name="buffer-agent"]:checked');
      if (selectedRadio) {
        prevLido.textContent = selectedRadio.value;
      }
    }

    // 3. Dynamic NFPA calculations based on inputs and hazards checked
    let healthRating = 1;
    let fireRating = 0;
    let reactRating = 0;
    let specialRating = '-';

    if (checkCorrosive && checkCorrosive.checked) {
      healthRating = Math.max(healthRating, 3);
      reactRating = Math.max(reactRating, 2);
      specialRating = 'OX';
    }
    if (checkToxic && checkToxic.checked) {
      healthRating = Math.max(healthRating, 4);
    }
    if (checkFlammable && checkFlammable.checked) {
      fireRating = Math.max(fireRating, 3);
    }
    if (checkHealth && checkHealth.checked) {
      healthRating = Math.max(healthRating, 2);
    }

    // Adjust specific acids if selected
    if (selectCarrier && selectCarrier.value) {
      if (selectCarrier.value === 'nitric') {
        healthRating = 3; fireRating = 0; reactRating = 2; specialRating = 'OX';
      } else if (selectCarrier.value === 'sulfuric') {
        healthRating = 3; fireRating = 0; reactRating = 2; specialRating = 'W';
      } else if (selectCarrier.value === 'acetic') {
        healthRating = 3; fireRating = 2; reactRating = 1; specialRating = '-';
      } else if (selectCarrier.value === 'hyaluronic') {
        healthRating = 1; fireRating = 1; reactRating = 0; specialRating = '-';
      }
    }

    if (nfpaH) nfpaH.textContent = healthRating;
    if (nfpaF) nfpaF.textContent = fireRating;
    if (nfpaR) nfpaR.textContent = reactRating;
    if (nfpaS) nfpaS.textContent = specialRating;

    // Toggle icons active classes
    if (icoCorrosive && checkCorrosive) {
      if (checkCorrosive.checked || (selectCarrier && ['nitric', 'sulfuric', 'acetic'].includes(selectCarrier.value))) {
        icoCorrosive.classList.add('active');
      } else {
        icoCorrosive.classList.remove('active');
      }
    }
    if (icoToxic && checkToxic) {
      if (checkToxic.checked || (selectCarrier && ['nitric', 'sulfuric'].includes(selectCarrier.value))) {
        icoToxic.classList.add('active');
      } else {
        icoToxic.classList.remove('active');
      }
    }

    // Safety Estimates update
    const estDensity = document.getElementById('est-density');
    const estHeat = document.getElementById('est-heat');
    const estSolute = document.getElementById('est-solute');
    
    if (estDensity && estHeat && estSolute && selectCarrier) {
      if (selectCarrier.value === 'nitric') {
        estDensity.textContent = '1.42 g/cm³';
        estHeat.textContent = 'Exothermic (+28.2 kJ)';
        estSolute.textContent = '70.00 mg/mL';
      } else if (selectCarrier.value === 'sulfuric') {
        estDensity.textContent = '1.84 g/cm³';
        estHeat.textContent = 'High Exothermic (+95.6 kJ)';
        estSolute.textContent = '98.00 mg/mL';
      } else if (selectCarrier.value === 'acetic') {
        estDensity.textContent = '1.05 g/cm³';
        estHeat.textContent = 'Mild (+10.4 kJ)';
        estSolute.textContent = '100.00 mg/mL';
      } else {
        estDensity.textContent = '1.18 g/cm³';
        estHeat.textContent = 'Endothermic (-4.2 kJ)';
        estSolute.textContent = '60.00 mg/mL';
      }
    }
  }

  function updateBarcodePreview(serial) {
    const barcodeBarsGroup = document.getElementById('dynamic-barcode-bars');
    if (!barcodeBarsGroup) return;

    // Generate pseudo deterministic barcode bars based on serial hash
    let hash = 0;
    for (let i = 0; i < serial.length; i++) {
      hash = serial.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    barcodeBarsGroup.innerHTML = '';
    let xOffset = 0;
    
    // Create ~16 elements
    for (let i = 0; i < 20; i++) {
      const randWidth = Math.abs((hash >> i) % 4) + 1;
      const randGap = Math.abs((hash >> (i + 1)) % 3) + 1;
      
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', xOffset);
      rect.setAttribute('y', 0);
      rect.setAttribute('width', randWidth);
      rect.setAttribute('height', 30);
      barcodeBarsGroup.appendChild(rect);
      
      xOffset += randWidth + randGap;
      if (xOffset >= 120) break;
    }
  }

  // Trigger initial values
  triggerPreviewUpdates();


  // ==========================================================================
  // FORM SUBMISSION & VALIDATION
  // ==========================================================================
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let formIsValid = true;

      // Validate Formula Name
      if (!inputName.value.trim()) {
        showError(inputName);
        formIsValid = false;
      } else {
        hideError(inputName);
      }

      // Validate Batch ID
      const batchPattern = /^[0-9\-]+$/;
      if (!inputBatch.value.trim() || !batchPattern.test(inputBatch.value)) {
        showError(inputBatch);
        formIsValid = false;
      } else {
        hideError(inputBatch);
      }

      // Validate CAS
      if (!inputCas.value.trim()) {
        showError(inputCas);
        formIsValid = false;
      } else {
        hideError(inputCas);
      }

      // Validate carrier dropdown
      if (!selectCarrier.value) {
        showError(selectCarrier);
        formIsValid = false;
      } else {
        hideError(selectCarrier);
      }

      if (!formIsValid) {
        return; // Validation failed
      }

      // Collect data on success
      const batchData = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        serial: inputBatch.value.trim(),
        name: inputName.value.trim(),
        carrier: selectCarrier.options[selectCarrier.selectedIndex].text,
        volume: inputVolume.value + ' mL',
        hazards: getCheckedHazardsText(),
        statusClass: getCheckedHazardsText().includes('CORROSIVE') || getCheckedHazardsText().includes('TOXIC') ? 'danger-bg' : 'success-bg',
        statusText: getCheckedHazardsText().includes('CORROSIVE') || getCheckedHazardsText().includes('TOXIC') ? 'SYNTHESIZED' : 'DISPENSED'
      };

      // Add to inventory database logs
      addInventoryLog(batchData);

      // Show alert overlay
      showFlashAlert(`BATCH SYNTHESIS PIPELINE INITIATED<br><strong>${batchData.name.toUpperCase()}</strong> has been dispatched.`);

      // Reset form
      form.reset();
      valRangeLabel.textContent = '60%';
      inputVolume.value = 60;
      
      // Clear errors
      document.querySelectorAll('.input-group').forEach(group => group.classList.remove('invalid'));

      // Switch to Inventory tab immediately so user sees the result
      setTimeout(() => {
        const inventoryNav = document.querySelector('[data-tab="inventory"]');
        if (inventoryNav) inventoryNav.querySelector('button').click();
        triggerPreviewUpdates();
      }, 1500);

    });
  }

  function showError(inputEl) {
    const parentGroup = inputEl.closest('.input-group');
    if (parentGroup) parentGroup.classList.add('invalid');
  }

  function hideError(inputEl) {
    const parentGroup = inputEl.closest('.input-group');
    if (parentGroup) parentGroup.classList.remove('invalid');
  }

  function getCheckedHazardsText() {
    const list = [];
    if (checkCorrosive && checkCorrosive.checked) list.push('CORROSIVE');
    if (checkToxic && checkToxic.checked) list.push('TOXIC');
    if (checkFlammable && checkFlammable.checked) list.push('FLAMMABLE');
    if (checkHealth && checkHealth.checked) list.push('HEALTH');
    
    return list.length > 0 ? list.join(', ') : 'STABLE';
  }

  function addInventoryLog(data) {
    const tbody = document.getElementById('logs-table-body');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${data.timestamp}</td>
      <td>${data.serial}</td>
      <td>${data.name}</td>
      <td>${data.carrier}</td>
      <td>${data.volume}</td>
      <td><span class="hazard-badge-text">${data.hazards}</span></td>
      <td><span class="badge ${data.statusClass}">${data.statusText}</span></td>
    `;
    // Insert at beginning of log table
    tbody.insertBefore(row, tbody.firstChild);

    updateLogCount();
  }

  function updateLogCount() {
    const tbody = document.getElementById('logs-table-body');
    const countText = document.getElementById('log-count-text');
    if (tbody && countText) {
      const rows = tbody.querySelectorAll('tr').length;
      countText.textContent = `SHOWING ${rows} BATCH LOG ENTRIES`;
    }
  }

  function showFlashAlert(message) {
    // Check if alert container exists
    let alertContainer = document.getElementById('custom-console-alert');
    if (!alertContainer) {
      alertContainer = document.createElement('div');
      alertContainer.id = 'custom-console-alert';
      alertContainer.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #000;
        border: 2px solid #EBE6DF;
        color: #EBE6DF;
        padding: 20px 24px;
        font-family: 'Space Mono', monospace;
        z-index: 1000;
        box-shadow: 0 0 15px rgba(255, 30, 30, 0.2);
        max-width: 400px;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
      `;
      document.body.appendChild(alertContainer);
    }
    
    alertContainer.innerHTML = `
      <div style="border-bottom: 1px solid #EBE6DF; padding-bottom: 8px; margin-bottom: 8px; font-weight: bold; color: hsl(38, 95%, 50%); display:flex; align-items:center; gap:8px;">
        <span style="display:inline-block; width:8px; height:8px; background:hsl(38, 95%, 50%); border-radius:50%; animation: blink-soft 0.8s infinite;"></span>
        CONSOLES_SECURE_NOTIFICATION
      </div>
      <p style="font-size: 0.8rem; line-height: 1.4;">${message}</p>
    `;

    // Trigger animate-in
    setTimeout(() => {
      alertContainer.style.opacity = '1';
      alertContainer.style.transform = 'translateY(0)';
    }, 100);

    // Auto animate-out after 3.5s
    setTimeout(() => {
      alertContainer.style.opacity = '0';
      alertContainer.style.transform = 'translateY(20px)';
    }, 3800);
  }


  // ==========================================================================
  // SAFETY configurator (Diamond and MSDS tabs)
  // ==========================================================================
  const selCtrlHealth = document.getElementById('ctrl-health');
  const selCtrlFire = document.getElementById('ctrl-fire');
  const selCtrlReact = document.getElementById('ctrl-react');
  const selCtrlSpecial = document.getElementById('ctrl-special');

  const largeHealth = document.getElementById('large-health-val');
  const largeFire = document.getElementById('large-fire-val');
  const largeReact = document.getElementById('large-react-val');
  const largeSpecial = document.getElementById('large-special-val');

  if (selCtrlHealth && largeHealth) {
    selCtrlHealth.addEventListener('change', (e) => largeHealth.textContent = e.target.value);
  }
  if (selCtrlFire && largeFire) {
    selCtrlFire.addEventListener('change', (e) => largeFire.textContent = e.target.value);
  }
  if (selCtrlReact && largeReact) {
    selCtrlReact.addEventListener('change', (e) => largeReact.textContent = e.target.value);
  }
  if (selCtrlSpecial && largeSpecial) {
    selCtrlSpecial.addEventListener('change', (e) => {
      largeSpecial.textContent = e.target.value === '-' ? '' : e.target.value;
    });
  }

  // MSDS sheet buttons
  const msdsBtns = document.querySelectorAll('.msds-btn');
  const warningCardTitle = document.getElementById('warning-card-title');
  const warningHeader = document.getElementById('warning-main-header');
  const warningDesc = document.getElementById('warning-desc-text');
  const msdsFirstAid = document.getElementById('msds-firstaid');
  const msdsPpe = document.getElementById('msds-ppe');

  const msdsSheets = {
    nitric: {
      title: 'NITRIC ACID WARNING SHEET',
      header: 'HNO3 - EXTREME OXIDIZER & CORROSIVE',
      desc: 'DANGER! COLLISION WITH ORGANICS CAUSES IGNITION. SEVERE SKIN BURNS AND EYE DAMAGE. VAPOR EXTREMELY INHALATION TOXIC.',
      firstaid: 'Flush skin and eyes immediately with water for 15+ minutes. In case of inhalation, move subject to fresh air and trigger oxygen system.',
      ppe: 'Full face vapor shield, acid-resistant protective suit, butyl rubber chemical gloves, local exhaust ventilation stack.'
    },
    sulfuric: {
      title: 'SULFURIC ACID WARNING SHEET',
      header: 'H2SO4 - TOXIC & DEHYDRATING AGENT',
      desc: 'DANGER! CORROSIVE CAUSES SEVERE CHARS. REACTS VIOLENTLY WITH WATER RELEASING IMMENSE HEAT. HARMFUL OR FATAL IF SWALLOWED.',
      firstaid: 'DO NOT add water directly to large spills. Wipe dry if possible, then flush with massive quantities of water. Seek immediate medical therapy.',
      ppe: 'Neoprene gauntlets, chemical apron, safety goggles + face shield combination, class-B respirator cartridge.'
    },
    acetic: {
      title: 'ACETIC ACID GLACIAL WARNING SHEET',
      header: 'CH3COOH - FLAMMABLE CORROSIVE LIQUID',
      desc: 'WARNING! VAPOR EXPLOSION HAZARD ABOVE 39°C. CAUSES IRRITATION AND CORROSION. COMPATIBLE WITH CONVENTIONAL METALS.',
      firstaid: 'In case of fire, use water spray, alcohol-resistant foam, or dry chemical. Wash contact points with mild soap and water solutions.',
      ppe: 'Standard laboratory goggles, nitrile protective gloves, ventilation fume hood flow > 100 lfm.'
    },
    hyaluronic: {
      title: 'HYALURONIC MATRIX SPECIFICATION',
      header: 'COMPOUND HYALURONIC + LIDOCAINE',
      desc: 'NOTICE: HIGH VISCOSITY STERILE SOLUTION. NON-TOXIC COSMETIC COMPONENT. PROTECT FROM ATMOSPHERIC BACTERIA.',
      firstaid: 'Non-hazardous under regular laboratory exposure. In case of minor eye contact, rinse out with standard sterile saline drops.',
      ppe: 'Sanitized latex/nitrile gloves, sterile surgical gown, hair restraint bonnet.'
    }
  };

  msdsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      msdsBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = msdsSheets[btn.dataset.msds];
      if (data) {
        if (warningCardTitle) warningCardTitle.textContent = data.title;
        if (warningHeader) warningHeader.textContent = data.header;
        if (warningDesc) warningDesc.textContent = data.desc;
        if (msdsFirstAid) msdsFirstAid.textContent = data.firstaid;
        if (msdsPpe) msdsPpe.textContent = data.ppe;
      }
    });
  });


  // ==========================================================================
  // INVENTORY LIVE FILTER & SEARCH
  // ==========================================================================
  const searchInput = document.getElementById('log-search-input');
  const tableBody = document.getElementById('logs-table-body');
  const noResults = document.getElementById('no-results');

  if (searchInput && tableBody) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const rows = tableBody.querySelectorAll('tr');
      let visibleCount = 0;

      rows.forEach(row => {
        const textContent = row.textContent.toLowerCase();
        if (textContent.includes(query)) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      // Handle no results message
      if (noResults) {
        if (visibleCount === 0 && query.length > 0) {
          noResults.style.display = 'block';
        } else {
          noResults.style.display = 'none';
        }
      }

      // Update footer indicator
      const countText = document.getElementById('log-count-text');
      if (countText) {
        countText.textContent = `SHOWING ${visibleCount} OF ${rows.length} BATCH LOG ENTRIES`;
      }
    });
  }

  // Export report dummy function
  const exportBtn = document.getElementById('export-report-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      showFlashAlert('EXPORT DATA BATCH SUCCESSFUL<br>File <strong>AG_SYNTHESIS_LOGS.xlsx</strong> downloaded.');
    });
  }

});
