document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // CUSTOM DROPDOWNS INITIALIZATION
  // ==========================================
  function initCustomDropdowns() {
    const nativeSelects = document.querySelectorAll('select.custom-select');
    
    nativeSelects.forEach(select => {
      // Create custom container
      const container = document.createElement('div');
      container.className = 'custom-dropdown';
      
      // Create trigger button
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'custom-dropdown-trigger';
      
      const label = document.createElement('span');
      label.className = 'custom-dropdown-selected-label';
      const selectedOpt = select.options[select.selectedIndex];
      label.textContent = selectedOpt ? selectedOpt.textContent : 'Select option';
      
      const arrow = document.createElement('span');
      arrow.className = 'custom-dropdown-arrow';
      
      trigger.appendChild(label);
      trigger.appendChild(arrow);
      container.appendChild(trigger);
      
      // Create list menu
      const menu = document.createElement('ul');
      menu.className = 'custom-dropdown-menu';
      
      // Populate items
      Array.from(select.options).forEach((opt, idx) => {
        const item = document.createElement('li');
        item.className = 'custom-dropdown-item';
        item.textContent = opt.textContent;
        item.dataset.value = opt.value;
        item.dataset.index = idx;
        
        if (opt.selected) {
          item.classList.add('selected');
        }
        
        // Item click handler
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          
          menu.querySelectorAll('.custom-dropdown-item').forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
          label.textContent = opt.textContent;
          select.selectedIndex = idx;
          container.classList.remove('open');
          
          // Trigger change event on native select so other JS handlers trigger!
          const changeEvent = new Event('change', { bubbles: true });
          select.dispatchEvent(changeEvent);
        });
        
        menu.appendChild(item);
      });
      
      container.appendChild(menu);
      
      // Hide original select and insert custom container
      select.style.display = 'none';
      select.parentNode.insertBefore(container, select);
      
      // Trigger toggle handler
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close all other open dropdowns
        document.querySelectorAll('.custom-dropdown').forEach(d => {
          if (d !== container) d.classList.remove('open');
        });
        
        container.classList.toggle('open');
      });
      
      // Two-way sync: programmatic changes on select element reflect in custom dropdown UI
      select.addEventListener('change', () => {
        const currentIdx = select.selectedIndex;
        const currentOpt = select.options[currentIdx];
        if (currentOpt) {
          label.textContent = currentOpt.textContent;
          menu.querySelectorAll('.custom-dropdown-item').forEach((item, idx) => {
            if (idx === currentIdx) {
              item.classList.add('selected');
            } else {
              item.classList.remove('selected');
            }
          });
        }
      });
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.custom-dropdown').forEach(d => {
        d.classList.remove('open');
      });
    });
  }

  // Run custom dropdown constructor
  initCustomDropdowns();
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const state = {
    theme: 'light',
    activeTab: 'dashboard',
    activeRoomFilter: 'bathroom',
    activeDeviceFilter: 'all',
    lightSettings: {
      brightness: 75.4,
      colorTemp: 2400,
      label: 'Warm'
    },
    thermostat: {
      targetTemp: 71,
      mode: 'cool',
      status: 'Cooling'
    },
    rules: [
      {
        id: 'rule-1',
        name: 'Away Eco Mode',
        trigger: 'motion-sensor',
        condition: 'no-motion',
        target: 'thermostat',
        action: 'turn-off',
        days: ['M', 'T', 'W', 'T', 'F'],
        enabled: true
      },
      {
        id: 'rule-2',
        name: 'Sunset Lights',
        trigger: 'lux-sensor',
        condition: 'lux-below',
        target: 'pendant-light',
        action: 'turn-on',
        days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        enabled: true
      }
    ]
  };

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const body = document.body;
  const timeDisplay = document.getElementById('current-time');
  const simTimeDisplay = document.getElementById('sim-time');
  const liveTimeDisplay = document.getElementById('live-time-display');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIconLight = document.getElementById('theme-icon-light');
  const themeIconDark = document.getElementById('theme-icon-dark');
  
  // Navigation
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // Room filters (Dashboard & Devices)
  const roomFilterBtns = document.querySelectorAll('.sub-nav-btn[data-room]');
  const deviceFilterBtns = document.querySelectorAll('.sub-nav-btn[data-dev-room]');
  const deviceCards = document.querySelectorAll('.dev-card');

  // Dial Widgets
  const dialSvg = document.getElementById('light-dial-svg');
  const dialProgressBar = document.getElementById('dial-progress-bar');
  const dialInteractiveRing = document.getElementById('dial-interactive-ring');
  const dialHandle = document.getElementById('dial-handle-knob');
  const dialPercentageVal = document.getElementById('dial-percentage-val');
  const dialModeLabel = document.getElementById('dial-mode-label');
  const dialKelvinLabel = document.getElementById('dial-kelvin-label');
  const bulbIllustration = document.getElementById('bulb-illustration');
  
  // Mobile Simulator replication
  const simDialProgress = document.getElementById('sim-dial-progress');
  const simDialPct = document.getElementById('sim-dial-pct');

  // Thermostat Stepper
  const tempDownBtn = document.getElementById('temp-down-btn');
  const tempUpBtn = document.getElementById('temp-up-btn');
  const tempDisplay = document.getElementById('target-temp-display');
  const climateModes = document.getElementsByName('climate-mode');
  const thermostatBadge = document.getElementById('thermostat-status-badge');

  // Device Page Controls
  const devLightBrightness = document.getElementById('dev-light-brightness');
  const lightBrightVal = document.getElementById('light-bright-val');
  const devLightPower = document.getElementById('dev-light-power');
  const devLightPreset = document.getElementById('dev-light-preset');
  const volumeSlider = document.getElementById('audio-volume');
  const volumeValLabel = document.getElementById('volume-val');

  // Automation Form & List
  const ruleForm = document.getElementById('automation-rule-form');
  const rulesListContainer = document.getElementById('rules-container-list');

  // Table Search Filter
  const logSearchInput = document.getElementById('log-search-input');
  const logsTableRows = document.querySelectorAll('#logs-table-body tr');

  // ==========================================
  // CLOCK / TIME UPDATER
  // ==========================================
  function updateTime() {
    const now = new Date();
    
    // Header simplified time: 02:41 PM
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 12 instead of 0
    const timeStr = `${hours}:${minutes} ${ampm}`;
    timeDisplay.textContent = timeStr;
    simTimeDisplay.textContent = `${String(now.getHours()).padStart(2, '0')}:${minutes}`;

    // Detailed Live recap format: 05:43PM Monday January 2nd
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = daysOfWeek[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    
    // Ordinal suffix
    let suffix = 'th';
    if (date === 1 || date === 21 || date === 31) suffix = 'st';
    else if (date === 2 || date === 22) suffix = 'nd';
    else if (date === 3 || date === 23) suffix = 'rd';
    
    const detailedStr = `${String(hours).padStart(2, '0')}:${minutes}${ampm} ${dayName} ${monthName} ${date}${suffix}`;
    liveTimeDisplay.textContent = detailedStr;
  }
  
  updateTime();
  setInterval(updateTime, 1000);

  // ==========================================
  // THEME SWITCHING
  // ==========================================
  function toggleTheme() {
    if (state.theme === 'light') {
      state.theme = 'dark';
      body.classList.add('dark-theme');
      themeIconLight.style.display = 'none';
      themeIconDark.style.display = 'block';
    } else {
      state.theme = 'light';
      body.classList.remove('dark-theme');
      themeIconLight.style.display = 'block';
      themeIconDark.style.display = 'none';
    }
  }

  themeToggleBtn.addEventListener('click', toggleTheme);

  // ==========================================
  // NAVIGATION / TAB SWITCHING
  // ==========================================
  navItems.forEach(item => {
    item.querySelector('button').addEventListener('click', () => {
      // Remove active from all nav buttons
      navItems.forEach(nav => nav.classList.remove('active'));
      // Add active to current
      item.classList.add('active');

      // Get target tab
      const tabTarget = item.getAttribute('data-tab');
      state.activeTab = tabTarget;

      // Show target panel, hide others
      tabPanels.forEach(panel => {
        if (panel.id === `panel-${tabTarget}`) {
          panel.classList.add('active-panel');
        } else {
          panel.classList.remove('active-panel');
        }
      });
      
      // Animate Charts on transition to Analytics or Dashboard
      if (tabTarget === 'dashboard') {
        animateBars();
      }
    });
  });

  // ==========================================
  // ROOM FILTERS
  // ==========================================
  // Dashboard filter buttons
  roomFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roomFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeRoomFilter = btn.getAttribute('data-room');
      // In a real app this would filter dashboard statistics
    });
  });

  // Devices filter buttons
  deviceFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deviceFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-dev-room');
      state.activeDeviceFilter = filter;

      deviceCards.forEach(card => {
        const cardRoom = card.getAttribute('data-device-room');
        if (filter === 'all' || cardRoom === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fade-in 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // INTERACTIVE SVG DIAL WIDGET
  // ==========================================
  const r = 80; // Radius of dial path
  const maxDash = 502; // stroke-dasharray circumfrence 2 * pi * r
  let isDragging = false;

  function updateDialUI(percent) {
    percent = Math.max(0, Math.min(100, percent));
    state.lightSettings.brightness = percent;

    // Calculate Dash Offset
    // Dotted dash is empty at 0%, full at 100%
    const offset = maxDash - (percent / 100) * maxDash;
    dialProgressBar.style.strokeDashoffset = offset;

    // Convert percent to angle (starts at -90 degrees which is top)
    const angleDeg = (percent / 100) * 360 - 90;
    const angleRad = angleDeg * Math.PI / 180;

    // Update Handle Knob Coordinates
    const cx = 100 + r * Math.cos(angleRad);
    const cy = 100 + r * Math.sin(angleRad);
    dialHandle.setAttribute('cx', cx);
    dialHandle.setAttribute('cy', cy);

    // Update Text display
    dialPercentageVal.textContent = `${percent.toFixed(1)}%`;

    // Dynamic Kelvin & Labels calculation based on brightness
    let tempKelvin = 2000 + Math.round((percent / 100) * 4500); // 2000K to 6500K
    let tempLabel = 'Warm';
    if (percent < 30) {
      tempLabel = 'Warm Ambient';
    } else if (percent < 70) {
      tempLabel = 'Soft Neutral';
    } else {
      tempLabel = 'Daylight Cool';
    }

    state.lightSettings.colorTemp = tempKelvin;
    state.lightSettings.label = tempLabel;
    
    dialModeLabel.textContent = tempLabel;
    dialKelvinLabel.textContent = `${tempKelvin}k`;

    // Glow effect on hanging bulb illustration
    const bulbGlow = bulbIllustration.querySelector('.lightbulb-glow');
    if (percent > 0) {
      bulbIllustration.classList.add('lightbulb-on');
      bulbGlow.style.opacity = (percent / 100) * 0.45;
    } else {
      bulbIllustration.classList.remove('lightbulb-on');
      bulbGlow.style.opacity = 0;
    }

    // Update mobile mockup sync items
    if (simDialProgress && simDialPct) {
      const simOffset = 251.2 - (percent / 100) * 251.2; // radius is 40 inside mockup
      simDialProgress.style.strokeDashoffset = simOffset;
      simDialPct.textContent = `${Math.round(percent)}%`;
    }

    // Sync state to lighting card inputs if online
    if (devLightBrightness) {
      devLightBrightness.value = percent;
      lightBrightVal.textContent = `${Math.round(percent)}%`;
    }
  }

  // Handle calculations based on pointer coordinates
  function calculateAngle(e) {
    const rect = dialSvg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    // Angle in radians
    let angleRad = Math.atan2(dy, dx);
    
    // Standardize angle: convert to degrees, adjust offset so top is 0 / 360
    let angleDeg = angleRad * 180 / Math.PI;
    let normalizedAngle = angleDeg + 90;
    if (normalizedAngle < 0) {
      normalizedAngle += 360;
    }

    const percent = (normalizedAngle / 360) * 100;
    updateDialUI(percent);
  }

  // Mouse / Touch Event Registrations
  function startDrag(e) {
    isDragging = true;
    calculateAngle(e);
    e.preventDefault();
  }

  function doDrag(e) {
    if (!isDragging) return;
    calculateAngle(e);
    e.preventDefault();
  }

  function stopDrag() {
    isDragging = false;
  }

  // Attach drag events to interactive circles
  dialInteractiveRing.addEventListener('mousedown', startDrag);
  dialHandle.addEventListener('mousedown', startDrag);
  
  window.addEventListener('mousemove', doDrag);
  window.addEventListener('mouseup', stopDrag);

  dialInteractiveRing.addEventListener('touchstart', startDrag, { passive: false });
  dialHandle.addEventListener('touchstart', startDrag, { passive: false });
  window.addEventListener('touchmove', doDrag, { passive: false });
  window.addEventListener('touchend', stopDrag);

  // Initialize Dial to Default 75.4%
  updateDialUI(75.4);

  // ==========================================
  // THERMOSTAT CONTROLLER STEPPER
  // ==========================================
  function updateThermostatUI() {
    tempDisplay.textContent = `${state.thermostat.targetTemp}°`;
    thermostatBadge.textContent = state.thermostat.status;
    
    // Update badge styling depending on mode
    if (state.thermostat.mode === 'cool') {
      thermostatBadge.className = 'badge badge-success';
      thermostatBadge.style.borderColor = 'var(--border-color)';
      thermostatBadge.style.color = 'var(--text-color)';
    } else if (state.thermostat.mode === 'heat') {
      thermostatBadge.className = 'badge';
      thermostatBadge.style.borderColor = 'var(--highlight-color)';
      thermostatBadge.style.color = 'var(--highlight-color)';
    } else {
      thermostatBadge.className = 'badge';
      thermostatBadge.style.borderColor = 'var(--muted-text)';
      thermostatBadge.style.color = 'var(--muted-text)';
    }
  }

  tempDownBtn.addEventListener('click', () => {
    if (state.thermostat.targetTemp > 60) {
      state.thermostat.targetTemp--;
      updateThermostatUI();
    }
  });

  tempUpBtn.addEventListener('click', () => {
    if (state.thermostat.targetTemp < 86) {
      state.thermostat.targetTemp++;
      updateThermostatUI();
    }
  });

  climateModes.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const mode = e.target.value;
      state.thermostat.mode = mode;
      
      if (mode === 'cool') {
        state.thermostat.status = 'Cooling';
      } else if (mode === 'heat') {
        state.thermostat.status = 'Heating';
      } else {
        state.thermostat.status = 'Active Fan';
      }
      updateThermostatUI();
    });
  });

  // ==========================================
  // DEVICES PAGE FORM INPUTS SYNCING
  // ==========================================
  if (devLightBrightness) {
    devLightBrightness.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      lightBrightVal.textContent = `${Math.round(value)}%`;
      updateDialUI(value);
    });
  }

  if (devLightPower) {
    devLightPower.addEventListener('change', (e) => {
      const on = e.target.checked;
      if (on) {
        updateDialUI(devLightBrightness.value ? parseFloat(devLightBrightness.value) : 75);
      } else {
        updateDialUI(0);
      }
    });
  }

  if (devLightPreset) {
    devLightPreset.addEventListener('change', (e) => {
      const preset = e.target.value;
      let pct = 75;
      if (preset === 'warm') pct = 75;
      else if (preset === 'daylight') pct = 95;
      else if (preset === 'reading') pct = 60;
      else if (preset === 'night') pct = 15;
      
      updateDialUI(pct);
      if (devLightBrightness) {
        devLightBrightness.value = pct;
        lightBrightVal.textContent = `${pct}%`;
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      volumeValLabel.textContent = `${e.target.value}%`;
    });
  }

  // ==========================================
  // SVG BAR CHART ENTRY ANIMATIONS
  // ==========================================
  function animateBars() {
    const bars = [
      { id: 'bar-mon', height: 60, y: 50 },
      { id: 'bar-tue', height: 95, y: 15 },
      { id: 'bar-wed', height: 70, y: 40 },
      { id: 'bar-thu', height: 62, y: 48 },
      { id: 'bar-fri', height: 80, y: 30 },
      { id: 'bar-sat', height: 100, y: 10 },
      { id: 'bar-sun', height: 75, y: 35 }
    ];

    bars.forEach(barData => {
      const el = document.getElementById(barData.id);
      if (el) {
        // Start zeroed
        el.setAttribute('height', '0');
        el.setAttribute('y', '110');
        
        // Trigger reflow to apply starting coordinates
        el.getBoundingClientRect();
        
        // Set actual coordinates (smooth transition via CSS)
        setTimeout(() => {
          el.setAttribute('height', barData.height);
          el.setAttribute('y', barData.y);
        }, 100);
      }
    });
  }

  animateBars();

  // ==========================================
  // AUTOMATION RULE CREATOR & LIST
  // ==========================================
  function renderRules() {
    rulesListContainer.innerHTML = '';
    
    state.rules.forEach(rule => {
      const daysStr = rule.days.join(' ');
      
      let triggerText = '';
      if (rule.trigger === 'motion-sensor') triggerText = 'Living Room Motion Detector';
      else if (rule.trigger === 'temp-sensor') triggerText = 'Bedroom Temp Thermostat';
      else if (rule.trigger === 'lux-sensor') triggerText = 'Outdoor Ambient Light Sensor';
      else triggerText = 'Schedule Timer';
      
      let conditionText = '';
      if (rule.condition === 'detects-motion') conditionText = 'detects active motion';
      else if (rule.condition === 'no-motion') conditionText = 'detects no motion (15 min)';
      else if (rule.condition === 'temp-above') conditionText = 'temperature rises above 78°';
      else conditionText = 'light levels drop below 200lx';

      let targetText = '';
      if (rule.target === 'pendant-light') targetText = 'Living Room Pendant Lights';
      else if (rule.target === 'thermostat') targetText = 'Bedroom Climate AC';
      else if (rule.target === 'sound-system') targetText = 'Kitchen Sound System';
      else targetText = 'Main Security System';

      let actionText = '';
      if (rule.action === 'turn-off') actionText = 'turn OFF';
      else if (rule.action === 'turn-on') actionText = 'turn ON';
      else if (rule.action === 'set-eco') actionText = 'set to ECO';
      else actionText = 'trigger notification';

      const ruleCard = document.createElement('div');
      ruleCard.className = 'card rule-item-card';
      ruleCard.style.padding = '20px';
      ruleCard.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div>
            <h4 style="font-size:1rem; font-weight:600;">${rule.name}</h4>
            <span style="font-size:0.75rem; color:var(--muted-text); font-weight:600; text-transform:uppercase;">
              IF ${triggerText} ${conditionText} THEN ${actionText} ${targetText}
            </span>
          </div>
          <button class="card-more-btn delete-rule-btn" data-id="${rule.id}" aria-label="Delete rule" style="color:var(--highlight-color);">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--muted-text);">DAYS: ${daysStr}</span>
          <label class="switch">
            <input type="checkbox" class="rule-toggle-switch" data-id="${rule.id}" ${rule.enabled ? 'checked' : ''}>
            <span class="slider-switch"></span>
          </label>
        </div>
      `;
      
      rulesListContainer.appendChild(ruleCard);
    });

    // Rebind toggles and delete events
    attachRuleEventListeners();
  }

  function attachRuleEventListeners() {
    // Delete buttons
    document.querySelectorAll('.delete-rule-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id') || btn.closest('.delete-rule-btn').getAttribute('data-id');
        state.rules = state.rules.filter(r => r.id !== id);
        renderRules();
        addLogEntry('System', 'Rules Engine', `Deleted automation rule ID: ${id}`, '0.00 kW', 'Success');
      });
    });

    // Active Toggle switches
    document.querySelectorAll('.rule-toggle-switch').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const id = toggle.getAttribute('data-id');
        const checked = e.target.checked;
        const rule = state.rules.find(r => r.id === id);
        if (rule) {
          rule.enabled = checked;
          addLogEntry('System', 'Rules Engine', `Rule "${rule.name}" set to ${checked ? 'Active' : 'Disabled'}`, '0.00 kW', 'Success');
        }
      });
    });
  }

  ruleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const ruleName = document.getElementById('rule-name').value;
    const ruleTrigger = document.getElementById('rule-trigger').value;
    const ruleCondition = document.getElementById('rule-condition').value;
    const ruleTarget = document.getElementById('rule-target').value;
    const ruleActionVal = document.getElementById('rule-action-val').value;
    const isEnabled = document.getElementById('rule-status-enabled').checked;
    
    // Days checkboxes
    const daysChecked = [];
    document.querySelectorAll('input[name="rule-days"]:checked').forEach(cb => {
      daysChecked.push(cb.value);
    });

    if (daysChecked.length === 0) {
      alert('Please select at least one schedule day.');
      return;
    }

    const newRule = {
      id: 'rule-' + Date.now(),
      name: ruleName,
      trigger: ruleTrigger,
      condition: ruleCondition,
      target: ruleTarget,
      action: ruleActionVal,
      days: daysChecked,
      enabled: isEnabled
    };

    state.rules.push(newRule);
    renderRules();
    
    // Add log entry
    addLogEntry('User Interface', 'Rules Engine', `Created new automation: "${ruleName}"`, '0.00 kW', 'Success');
    
    // Reset Form
    ruleForm.reset();
  });

  // Initialize rules list
  attachRuleEventListeners();

  // ==========================================
  // TABLE LOGS FILTER SEARCH & GENERATION
  // ==========================================
  function addLogEntry(device, room, action, draw, status) {
    const tableBody = document.getElementById('logs-table-body');
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${timeStr}</td>
      <td>${device}</td>
      <td>${room}</td>
      <td>${action}</td>
      <td>${draw}</td>
      <td><span class="badge badge-success">${status}</span></td>
    `;
    
    tableBody.insertBefore(newRow, tableBody.firstChild);
    
    // Truncate to keep performance crisp (max 12 rows)
    const rows = tableBody.querySelectorAll('tr');
    if (rows.length > 12) {
      tableBody.removeChild(rows[rows.length - 1]);
    }
  }

  logSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    const currentRows = document.querySelectorAll('#logs-table-body tr');
    currentRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });

  // Sync general slider elements with dynamic logging inputs
  devLightBrightness.addEventListener('change', (e) => {
    addLogEntry('Pendant Lights', 'Living Room', `Brightness adjusted to ${e.target.value}%`, '0.08 kW', 'Success');
  });

  devLightPreset.addEventListener('change', (e) => {
    addLogEntry('Pendant Lights', 'Living Room', `Preset set to ${e.target.value}`, '0.06 kW', 'Success');
  });

  volumeSlider.addEventListener('change', (e) => {
    addLogEntry('Sound System', 'Kitchen', `Volume set to ${e.target.value}%`, '0.03 kW', 'Success');
  });

  // Settings Save forms feedback
  document.getElementById('profile-settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addLogEntry('User Profile', 'System Core', 'Profile administrator details updated', '0.00 kW', 'Success');
    alert('Administrator settings successfully saved.');
  });

  document.getElementById('pref-settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addLogEntry('System Settings', 'System Core', 'System preferences saved', '0.00 kW', 'Success');
    alert('System preferences successfully saved.');
  });
  
});
