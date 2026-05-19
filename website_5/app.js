/**
 * Medit - Health & Wellness Dashboard
 * Application Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // INITIAL STATE
  // ==========================================
  
  const state = {
    userProfile: {
      name: "Hugo Olofsson",
      email: "hugo@project.io",
      age: 29,
      bloodType: "B+",
      bio: "Diagnosed with mild hypertension. Tracking daily supplement intake and bi-weekly cardiogram / blood pressure tests."
    },
    activeTab: "dashboard",
    currentFilter: "all",
    currentTestIndex: 0,
    currentSuppIndex: 0,
    selectedTimelineDay: "Fri",
    
    // Clinical Test Records
    tests: [
      {
        id: "bp-test",
        title: "Blood Pressure Test",
        doctor: "Dr. Wesley Cain",
        doctorTitle: "Cardiologist",
        doctorImg: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop&crop=faces",
        date: "15 Feb",
        fullDate: "15 February, 2022",
        type: "tests",
        value: "128 / 82 mmHg",
        status: "Normal",
        notes: "Systolic is slightly elevated but within normal daily variance. Continue low-sodium diet and monitor bi-weekly.",
        chartType: "bar",
        data: [120, 122, 118, 125, 128, 121, 124, 128] // diastolic matches approx
      },
      {
        id: "cardio-test",
        title: "Cardiogram Test",
        doctor: "Dr. Sofia Frank",
        doctorTitle: "Cardiologist",
        doctorImg: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=faces",
        date: "20 Feb",
        fullDate: "20 February, 2022",
        type: "tests",
        value: "74 bpm",
        status: "Optimal",
        notes: "ECG shows a highly regular sinus rhythm. Rest heart rate is excellent. No signs of arrhythmia.",
        chartType: "wave",
        data: [72, 70, 75, 71, 74, 76, 73, 74]
      },
      {
        id: "blood-sugar-test",
        title: "Blood Sugar Fasting",
        doctor: "Dr. Sarah Jenkins",
        doctorTitle: "Endocrinologist",
        doctorImg: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=100&h=100&fit=crop&crop=faces",
        date: "25 Feb",
        fullDate: "25 February, 2022",
        type: "labs",
        value: "92 mg/dL",
        status: "Optimal",
        notes: "Fasting glucose is well within the healthy range (70-99 mg/dL). Metabolic panels are clean.",
        chartType: "bar",
        data: [90, 95, 93, 89, 92, 94, 91, 92]
      },
      {
        id: "advice-diet",
        title: "Sodium Diet Advisory",
        doctor: "Dr. Wesley Cain",
        doctorTitle: "Cardiologist",
        doctorImg: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop&crop=faces",
        date: "10 Oct",
        fullDate: "10 October, 2022",
        type: "advice",
        value: "Reduce Sodium intake",
        status: "Active",
        notes: "Limit daily sodium to 1500mg. Increase potassium-rich food intakes like avocados and spinach.",
        chartType: "none"
      }
    ],
    
    // Supplements cabinet
    supplements: [
      { id: "omega3", num: "01", name: "OMEGA 3", dosage: "2.5 mg", count: 48, image: "omega3.png" },
      { id: "aflubin", num: "02", name: "Aflubin", dosage: "200 mg", count: 24, image: "aflubin.png" },
      { id: "timestin", num: "03", name: "Timestin", dosage: "300 mg", count: 62, image: "timestin.png" },
      { id: "vitaminc", num: "04", name: "Vitamin C", dosage: "1.8 mg", count: 85, image: "vitaminc.png" }
    ],

    // Calendar & Schedule Data
    schedule: {
      "Mon": [
        { time: "2:00 pm", title: "Blood Pressure Test", type: "Test", doctor: "Dr. Wesley Cain", detail: "2 Tests", completed: true },
        { time: "4:00 pm", title: "Blood Sugar Fasting", type: "Test", doctor: "Dr. Sarah Jenkins", detail: "1 Lab", completed: true }
      ],
      "Tue": [
        { time: "2:00 pm", title: "Vitamin C Supplement", type: "Supplement", detail: "Vitamin C 1.8 mg", completed: true }
      ],
      "Wed": [
        { time: "4:00 pm", title: "OMEGA 3 Supplement", type: "Supplement", detail: "OMEGA 3 2.5 mg", completed: false }
      ],
      "Thu": [
        { time: "4:00 pm", title: "OMEGA 3 Supplement", type: "Supplement", detail: "OMEGA 3 2.5 mg", completed: false }
      ],
      "Fri": [
        { time: "3:00 pm", title: "Cardiology Review", type: "Advice", doctor: "Dr. Sofia Frank", detail: "1 Advice", completed: false }
      ],
      "Sat": [
        { time: "4:00 pm", title: "Aflubin Supplement", type: "Supplement", detail: "Aflubin 200 mg", completed: false }
      ],
      "Sun": [
        { time: "4:00 pm", title: "Timestin Supplement", type: "Supplement", detail: "Timestin 300 mg", completed: false }
      ]
    }
  };

  // Days list metadata
  const daysInfo = [
    { day: "Mon", date: 6, label: "2 Tests" },
    { day: "Tue", date: 7, label: "Vitamin C" },
    { day: "Wed", date: 8, label: "OMEGA 3" },
    { day: "Thu", date: 9, label: "OMEGA 3" },
    { day: "Fri", date: 10, label: "1 Advice", highlight: true },
    { day: "Sat", date: 11, label: "Aflubin" },
    { day: "Sun", date: 12, label: "Timestin" }
  ];

  // ==========================================
  // ELEMENT SELECTORS
  // ==========================================
  
  // Navigation
  const navItems = document.querySelectorAll('.nav-item');
  const tabViews = document.querySelectorAll('.tab-view');
  const profileTrigger = document.getElementById('profile-trigger');
  
  // Profile displays
  const userNameDisplays = [document.getElementById('user-name-display'), document.getElementById('settings-name')];
  const userEmailDisplays = [document.getElementById('user-email-display'), document.getElementById('settings-email')];
  const userAvatarDisplay = document.getElementById('user-avatar-display');

  // Carousels
  const testCardsContainer = document.getElementById('test-cards-container');
  const prevTestBtn = document.getElementById('prev-test-btn');
  const nextTestBtn = document.getElementById('next-test-btn');
  
  const supplementsContainer = document.getElementById('supplements-container');
  const prevSuppBtn = document.getElementById('prev-supp-btn');
  const nextSuppBtn = document.getElementById('next-supp-btn');
  const suppIndicatorsContainer = document.getElementById('supp-indicators');
  
  // Bottom Timeline
  const daysContainer = document.getElementById('days-container');
  const scheduleDetailsContainer = document.getElementById('schedule-details-container');
  
  // Modals
  const addEventModal = document.getElementById('add-event-modal');
  const addSuppModal = document.getElementById('add-supp-modal');
  const recordDetailModal = document.getElementById('record-detail-modal');
  
  // Modal triggers & close buttons
  const openEventBtn = document.getElementById('open-add-event-modal');
  const openSuppBtn = document.getElementById('open-add-supp-modal');
  const closeEventBtn = document.getElementById('close-event-modal');
  const closeSuppBtn = document.getElementById('close-supp-modal');
  const closeDetailBtn = document.getElementById('close-detail-modal');
  
  // Forms
  const addEventForm = document.getElementById('add-event-form');
  const addSuppForm = document.getElementById('add-supp-form');
  const profileForm = document.getElementById('profile-settings-form');
  
  // Preferences
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  // DNA Canvas
  const canvas = document.getElementById('dna-canvas');

  // ==========================================
  // VIEW NAVIGATION (TAB ROUTER)
  // ==========================================
  
  function switchTab(tabId) {
    state.activeTab = tabId;
    
    // Update active tab buttons
    navItems.forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update active tab views
    tabViews.forEach(view => {
      if (view.id === `${tabId}-view`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Run views initialization logic
    if (tabId === 'dashboard') {
      resizeCanvas();
    } else if (tabId === 'analytics') {
      renderAnalyticsCharts();
    } else if (tabId === 'supplements') {
      renderSuppCabinet();
    } else if (tabId === 'calendar') {
      renderAppointmentCalendar();
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchTab(item.dataset.tab);
    });
  });

  // Profile click opens settings tab
  profileTrigger.addEventListener('click', () => {
    switchTab('settings');
  });

  // ==========================================
  // DNA CANVAS 3D HELIX SIMULATION
  // ==========================================
  
  let ctx = canvas.getContext('2d');
  let animationFrameId;
  let angle = 0;
  let isMouseOver = false;
  let rotationSpeed = 0.015;
  let mouseRotationX = 0;
  let targetRotationX = 0;
  let dragStartMouseX = 0;
  let isDragging = false;

  // DNA Particles Node List
  const nodes = [];
  const totalBasePairs = 22;
  const helixRadius = 55;
  const helixPitch = 280; // height of one full turn
  const helixHeight = 350;

  function initDNANodes() {
    nodes.length = 0;
    for (let i = 0; i < totalBasePairs; i++) {
      const t = (i / totalBasePairs) - 0.5; // range -0.5 to 0.5
      const y = t * helixHeight;
      const phi = t * Math.PI * 3.5; // turns around the axis
      
      // Node A (first strand)
      nodes.push({
        y: y,
        phi: phi,
        strand: 'A',
        index: i
      });
      // Node B (second strand - 180 degrees phase offset)
      nodes.push({
        y: y,
        phi: phi + Math.PI,
        strand: 'B',
        index: i
      });
    }
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', () => {
    if (state.activeTab === 'dashboard') {
      resizeCanvas();
    }
  });

  function drawDNA() {
    if (state.activeTab !== 'dashboard') return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const cx = width / 2;
    const cy = height / 2;
    
    // Auto rotation
    angle += rotationSpeed;
    
    // Smooth drag rotation
    mouseRotationX += (targetRotationX - mouseRotationX) * 0.1;
    const currentAngle = angle + mouseRotationX;
    
    // Project nodes to 2D
    const projected = nodes.map(node => {
      // Rotate around Y axis
      const theta = node.phi + currentAngle;
      const x3d = Math.cos(theta) * helixRadius;
      const z3d = Math.sin(theta) * helixRadius;
      
      // Perspective scale factor
      const zOffset = 180;
      const scale = zOffset / (zOffset + z3d);
      
      return {
        x: cx + x3d * scale,
        y: cy + node.y * scale,
        z: z3d,
        scale: scale,
        strand: node.strand,
        index: node.index
      };
    });

    // Sort by depth (Z-buffer style) so back elements draw first
    projected.sort((a, b) => b.z - a.z);

    // Draw connecting rungs (bonds) first
    for (let i = 0; i < projected.length; i++) {
      const node = projected[i];
      // Find matching base pair node
      const peer = projected.find(p => p.index === node.index && p.strand !== node.strand);
      
      if (peer) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(peer.x, peer.y);
        
        // Depth/shading opacity for rungs
        const avgZ = (node.z + peer.z) / 2;
        const opacity = Math.max(0.1, 0.45 - (avgZ / (helixRadius * 2)));
        
        // Base pair color gradient
        ctx.strokeStyle = `rgba(160, 174, 192, ${opacity})`;
        ctx.lineWidth = 1.5 * ((node.scale + peer.scale) / 2);
        ctx.stroke();
      }
    }

    // Draw backbone spheres
    projected.forEach(node => {
      ctx.beginPath();
      // Draw sphere shadow/glow
      const radius = 6.5 * node.scale;
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      
      // Shading based on depth Z (helixRadius to -helixRadius)
      const brightness = Math.round(100 - ((node.z + helixRadius) / (helixRadius * 2)) * 30);
      
      let color;
      if (node.strand === 'A') {
        // Strand A: Neumorphic Violet/Blue Accent
        color = `hsla(250, 75%, ${brightness}%, ${node.scale})`;
      } else {
        // Strand B: Orange Accent
        color = `hsla(25, 100%, ${brightness + 10}%, ${node.scale})`;
      }
      
      ctx.fillStyle = color;
      ctx.fill();

      // Highlight spot on sphere for 3D illusion
      ctx.beginPath();
      ctx.arc(node.x - radius * 0.25, node.y - radius * 0.25, radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.45 * node.scale})`;
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(drawDNA);
  }

  // Mouse drag handler on Canvas
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartMouseX = e.clientX;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartMouseX;
    targetRotationX += deltaX * 0.007;
    dragStartMouseX = e.clientX;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('mouseenter', () => { isMouseOver = true; rotationSpeed = 0.005; });
  canvas.addEventListener('mouseleave', () => { isMouseOver = false; rotationSpeed = 0.015; });

  // Initialize DNA nodes and render
  initDNANodes();
  resizeCanvas();
  drawDNA();

  // ==========================================
  // RENDER DYNAMIC CAROUSELS & FILTERING
  // ==========================================

  // Filter Pill Toggles
  const filterBtns = document.querySelectorAll('.pill-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentFilter = btn.dataset.filter;
      renderTestCards();
    });
  });

  // SVG Sparkline Creators
  function createSparklineSVG(id, data, chartType) {
    if (chartType === 'none') return '';
    
    const svgWidth = 240;
    const svgHeight = 60;
    
    if (chartType === 'wave') {
      // Draw smooth line wave chart
      const maxVal = Math.max(...data) * 1.1;
      const minVal = Math.min(...data) * 0.9;
      const range = maxVal - minVal;
      
      const points = data.map((val, idx) => {
        const x = (idx / (data.length - 1)) * svgWidth;
        const y = svgHeight - ((val - minVal) / range) * svgHeight;
        return `${x},${y}`;
      });
      
      const pathD = `M ${points.join(' L ')}`;
      
      return `
        <svg class="spark-svg" viewBox="0 0 ${svgWidth} ${svgHeight}">
          <path class="spark-path spark-path-pulse" d="${pathD}" />
        </svg>
      `;
    } else if (chartType === 'bar') {
      // Draw bar chart
      const maxVal = Math.max(...data) * 1.15;
      const barCount = data.length;
      const gap = 6;
      const barWidth = (svgWidth - (gap * (barCount - 1))) / barCount;
      
      let barsHTML = '';
      data.forEach((val, idx) => {
        const height = (val / maxVal) * svgHeight;
        const x = idx * (barWidth + gap);
        const y = svgHeight - height;
        barsHTML += `<rect class="spark-bar" x="${x}" y="${y}" width="${barWidth}" height="${height}" />`;
      });
      
      return `
        <svg class="spark-svg" viewBox="0 0 ${svgWidth} ${svgHeight}">
          ${barsHTML}
        </svg>
      `;
    }
    return '';
  }

  // Render Test/Analysis Cards
  function renderTestCards() {
    testCardsContainer.innerHTML = '';
    
    const filteredTests = state.tests.filter(test => {
      if (state.currentFilter === 'all') return true;
      return test.type === state.currentFilter;
    });

    if (filteredTests.length === 0) {
      testCardsContainer.innerHTML = `
        <div class="test-card text-center" style="cursor:default;box-shadow:none;">
          <p style="color:var(--text-secondary);padding: 20px;">No test logs found in this category.</p>
        </div>
      `;
      return;
    }

    filteredTests.forEach(test => {
      const card = document.createElement('div');
      card.className = 'test-card';
      card.dataset.id = test.id;
      
      const headerHTML = test.doctor ? `
        <div class="test-card-header">
          <div class="doc-avatar-container">
            <img class="doc-avatar" src="${test.doctorImg}" alt="${test.doctor}">
          </div>
          <div class="doc-info">
            <span class="doc-name">${test.doctor}</span>
            <span class="doc-title">${test.doctorTitle}</span>
          </div>
        </div>
      ` : '';

      const chartHTML = test.chartType !== 'none' ? `
        <div class="test-chart-container">
          ${createSparklineSVG(test.id, test.data, test.chartType)}
        </div>
      ` : `<div style="height: 20px;"></div>`;

      card.innerHTML = `
        ${headerHTML}
        <div class="test-card-body">
          <span class="test-title">${test.title}</span>
          <span class="test-date">${test.date}</span>
        </div>
        <div class="test-card-footer" style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
          <span style="font-size:15px; font-weight:700; color:var(--primary-color);">${test.value}</span>
          <span style="font-size:11px; font-weight:600; padding:2px 8px; border-radius:10px; background-color:var(--primary-light); color:var(--primary-color);">${test.status}</span>
        </div>
        ${chartHTML}
      `;

      card.addEventListener('click', () => {
        openRecordDetailModal(test);
      });

      testCardsContainer.appendChild(card);
    });

    // Reset slide position
    state.currentTestIndex = 0;
    updateTestCarouselSlide();
  }

  // Slide tests track
  function updateTestCarouselSlide() {
    const cardWidth = testCardsContainer.firstElementChild ? testCardsContainer.firstElementChild.getBoundingClientRect().width : 0;
    const gap = 16;
    const translateVal = -state.currentTestIndex * (cardWidth + gap);
    testCardsContainer.style.transform = `translateX(${translateVal}px)`;
  }

  prevTestBtn.addEventListener('click', () => {
    const filteredCount = state.tests.filter(t => state.currentFilter === 'all' ? true : t.type === state.currentFilter).length;
    if (state.currentTestIndex > 0) {
      state.currentTestIndex--;
      updateTestCarouselSlide();
    }
  });

  nextTestBtn.addEventListener('click', () => {
    const filteredCount = state.tests.filter(t => state.currentFilter === 'all' ? true : t.type === state.currentFilter).length;
    if (state.currentTestIndex < filteredCount - 1) {
      state.currentTestIndex++;
      updateTestCarouselSlide();
    }
  });

  // Render Supplements in Side Carousel
  function renderSupplementsCarousel() {
    supplementsContainer.innerHTML = '';
    
    // We group supplements in pages of 2x2 grid. Each page represents a grid container.
    const itemsPerPage = 4;
    const pagesCount = Math.ceil(state.supplements.length / itemsPerPage);
    
    // Render carousel indicators
    suppIndicatorsContainer.innerHTML = '';
    for (let p = 0; p < pagesCount; p++) {
      const dot = document.createElement('span');
      dot.className = `dot ${p === state.currentSuppIndex ? 'active' : ''}`;
      dot.dataset.index = p;
      dot.addEventListener('click', () => {
        state.currentSuppIndex = p;
        updateSuppCarouselSlide();
      });
      suppIndicatorsContainer.appendChild(dot);
    }

    for (let p = 0; p < pagesCount; p++) {
      const gridPage = document.createElement('div');
      gridPage.className = 'supp-grid-page';
      
      const pageItems = state.supplements.slice(p * itemsPerPage, (p + 1) * itemsPerPage);
      pageItems.forEach(supp => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'supp-item';
        itemDiv.innerHTML = `
          <span class="supp-num">${supp.num}</span>
          <div class="supp-info">
            <span class="supp-name">${supp.name}</span>
            <span class="supp-dosage">${supp.dosage}</span>
          </div>
          <div class="supp-img-container">
            <img class="supp-img" src="assets/${supp.image}" alt="${supp.name}">
          </div>
        `;
        
        itemDiv.addEventListener('click', () => {
          switchTab('supplements');
        });

        gridPage.appendChild(itemDiv);
      });
      
      supplementsContainer.appendChild(gridPage);
    }
    
    updateSuppCarouselSlide();
  }

  function updateSuppCarouselSlide() {
    const pageWidth = supplementsContainer.firstElementChild ? supplementsContainer.firstElementChild.getBoundingClientRect().width : 0;
    const gap = 16;
    const translateVal = -state.currentSuppIndex * (pageWidth + gap);
    supplementsContainer.style.transform = `translateX(${translateVal}px)`;
    
    // Update dots
    const dots = suppIndicatorsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      if (idx === state.currentSuppIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  prevSuppBtn.addEventListener('click', () => {
    if (state.currentSuppIndex > 0) {
      state.currentSuppIndex--;
      updateSuppCarouselSlide();
    }
  });

  nextSuppBtn.addEventListener('click', () => {
    const pagesCount = Math.ceil(state.supplements.length / 4);
    if (state.currentSuppIndex < pagesCount - 1) {
      state.currentSuppIndex++;
      updateSuppCarouselSlide();
    }
  });

  // ==========================================
  // WEEKLY TIMELINE CALENDAR & AGENDA
  // ==========================================
  
  function renderTimelineDays() {
    daysContainer.innerHTML = '';
    
    daysInfo.forEach(info => {
      const card = document.createElement('div');
      card.className = `day-card ${info.day === state.selectedTimelineDay ? 'active-day' : ''} ${info.highlight ? 'orange-highlight' : ''}`;
      
      // Calculate how many completed events
      const daySchedule = state.schedule[info.day] || [];
      const totalEvents = daySchedule.length;
      const activeLabel = totalEvents === 0 ? 'No events' : `${totalEvents} Event${totalEvents > 1 ? 's' : ''}`;
      
      card.innerHTML = `
        <span class="day-name">${info.day}</span>
        <span class="day-val">${info.date}</span>
        <span class="day-time-sub">${info.label}</span>
        <span class="day-status">${activeLabel}</span>
      `;
      
      card.addEventListener('click', () => {
        state.selectedTimelineDay = info.day;
        // update day classes
        const dayCards = daysContainer.querySelectorAll('.day-card');
        dayCards.forEach(c => c.classList.remove('active-day'));
        card.classList.add('active-day');
        
        renderTimelineAgenda();
      });
      
      daysContainer.appendChild(card);
    });

    renderTimelineAgenda();
  }

  function renderTimelineAgenda() {
    scheduleDetailsContainer.innerHTML = '';
    
    const dayEvents = state.schedule[state.selectedTimelineDay] || [];
    
    if (dayEvents.length === 0) {
      scheduleDetailsContainer.innerHTML = `
        <div class="schedule-empty-state">
          <p>No health events, tests, or supplements logged for ${state.selectedTimelineDay}.</p>
        </div>
      `;
      return;
    }
    
    const list = document.createElement('ul');
    list.className = 'schedule-list';
    
    dayEvents.forEach((event, idx) => {
      const li = document.createElement('li');
      li.className = `schedule-item ${event.completed ? 'completed' : ''}`;
      
      const tagClass = event.type.toLowerCase();
      const subtext = event.doctor ? `${event.doctor} • ${event.detail}` : event.detail;
      
      li.innerHTML = `
        <div class="sched-left">
          <span class="sched-time">${event.time}</span>
          <div class="sched-info">
            <span class="sched-title">${event.title}</span>
            <span class="sched-sub">${subtext}</span>
          </div>
        </div>
        <div class="sched-right">
          <span class="sched-tag ${tagClass}">${event.type}</span>
          <button class="sched-check-btn" title="${event.completed ? 'Mark incomplete' : 'Complete event'}">
            <i data-lucide="${event.completed ? 'check-circle' : 'circle'}"></i>
          </button>
        </div>
      `;
      
      // Toggle complete action
      li.querySelector('.sched-check-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        event.completed = !event.completed;
        renderTimelineDays(); // Re-render triggers full state update
      });
      
      list.appendChild(li);
    });
    
    scheduleDetailsContainer.appendChild(list);
    lucide.createIcons();
  }

  // ==========================================
  // ANALYTICS GRAPH GENERATOR (SVG-based)
  // ==========================================
  
  function renderAnalyticsCharts() {
    const largeHeartChart = document.getElementById('large-heart-chart');
    const largeBPChart = document.getElementById('large-bp-chart');
    
    // 1. Heart Rate Line Chart
    // Generating ECG-like smooth curve coordinates
    const ecgPoints = [
      { x: 0, y: 150 }, { x: 50, y: 150 }, { x: 70, y: 130 }, { x: 80, y: 190 }, 
      { x: 90, y: 40 }, { x: 100, y: 170 }, { x: 110, y: 150 }, { x: 160, y: 150 },
      { x: 210, y: 150 }, { x: 230, y: 120 }, { x: 240, y: 180 }, { x: 250, y: 50 }, 
      { x: 260, y: 160 }, { x: 270, y: 150 }, { x: 320, y: 150 }, { x: 370, y: 150 },
      { x: 390, y: 110 }, { x: 400, y: 200 }, { x: 410, y: 30 }, { x: 420, y: 170 },
      { x: 430, y: 150 }, { x: 480, y: 150 }, { x: 530, y: 150 }, { x: 550, y: 130 },
      { x: 560, y: 190 }, { x: 570, y: 45 }, { x: 580, y: 170 }, { x: 590, y: 150 },
      { x: 640, y: 150 }, { x: 690, y: 150 }, { x: 710, y: 125 }, { x: 720, y: 185 },
      { x: 730, y: 40 }, { x: 740, y: 165 }, { x: 750, y: 150 }, { x: 800, y: 150 }
    ];
    
    const pathD = `M ${ecgPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
    
    largeHeartChart.innerHTML = `
      <!-- Grid lines -->
      <line x1="0" y1="50" x2="800" y2="50" stroke="var(--text-muted)" stroke-dasharray="4" opacity="0.2" />
      <line x1="0" y1="100" x2="800" y2="100" stroke="var(--text-muted)" stroke-dasharray="4" opacity="0.2" />
      <line x1="0" y1="150" x2="800" y2="150" stroke="var(--text-muted)" stroke-dasharray="4" opacity="0.3" />
      <line x1="0" y1="200" x2="800" y2="200" stroke="var(--text-muted)" stroke-dasharray="4" opacity="0.2" />
      
      <!-- Gradient Fill -->
      <path d="${pathD} L 800,250 L 0,250 Z" fill="url(#heart-grad)" opacity="0.1" />
      
      <!-- Wave Path -->
      <path class="spark-path" d="${pathD}" stroke="var(--primary-color)" stroke-width="3" fill="none" />
      
      <!-- Gradient Def -->
      <defs>
        <linearGradient id="heart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary-color)" />
          <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0" />
        </linearGradient>
      </defs>
    `;
    
    // 2. Blood Pressure Columns Bar Chart
    const bpSystolic = [120, 118, 125, 128, 121, 124, 128, 120];
    const bpDiastolic = [80, 78, 82, 84, 79, 81, 83, 78];
    const bpDates = ["1 Feb", "5 Feb", "10 Feb", "15 Feb", "20 Feb", "25 Feb", "1 Mar", "5 Mar"];
    
    const svgWidth = 800;
    const svgHeight = 250;
    const barWidth = 32;
    const space = (svgWidth - (barWidth * bpSystolic.length)) / (bpSystolic.length + 1);
    
    let bpHTML = '';
    
    // Draw Grid lines
    bpHTML += `
      <line x1="0" y1="50" x2="800" y2="50" stroke="var(--text-muted)" stroke-dasharray="4" opacity="0.2" />
      <line x1="0" y1="100" x2="800" y2="100" stroke="var(--text-muted)" stroke-dasharray="4" opacity="0.2" />
      <line x1="0" y1="150" x2="800" y2="150" stroke="var(--text-muted)" stroke-dasharray="4" opacity="0.2" />
      <line x1="0" y1="200" x2="800" y2="200" stroke="var(--text-muted)" stroke-dasharray="4" opacity="0.2" />
    `;
    
    bpSystolic.forEach((sys, idx) => {
      const dia = bpDiastolic[idx];
      const x = space + idx * (barWidth + space);
      
      // Map readings 0-160 to 0-210px in height
      const sysHeight = (sys / 160) * (svgHeight - 40);
      const diaHeight = (dia / 160) * (svgHeight - 40);
      
      const sysY = (svgHeight - 30) - sysHeight;
      const diaY = (svgHeight - 30) - diaHeight;
      
      bpHTML += `
        <!-- Systolic Bar (Violet) -->
        <rect x="${x}" y="${sysY}" width="${barWidth}" height="${sysHeight}" fill="var(--primary-color)" opacity="0.85" rx="6" />
        <!-- Diastolic Bar (Orange overlay/inner) -->
        <rect x="${x + 4}" y="${diaY}" width="${barWidth - 8}" height="${diaHeight}" fill="var(--orange-color)" opacity="0.9" rx="4" />
        
        <!-- Label dates -->
        <text x="${x + barWidth/2}" y="${svgHeight - 8}" fill="var(--text-secondary)" font-size="11" text-anchor="middle" font-weight="500">${bpDates[idx]}</text>
      `;
    });
    
    largeBPChart.innerHTML = bpHTML;
  }

  // ==========================================
  // CABINET SUPPLEMENTS VIEW
  // ==========================================
  
  function renderSuppCabinet() {
    const cabinetGrid = document.getElementById('full-supp-grid');
    cabinetGrid.innerHTML = '';
    
    state.supplements.forEach(supp => {
      const card = document.createElement('div');
      card.className = 'cabinet-card neumorphic-card';
      
      card.innerHTML = `
        <button class="delete-supp-btn" title="Remove supplement"><i data-lucide="trash-2"></i></button>
        <div class="cabinet-img-box">
          <img class="cabinet-img" src="assets/${supp.image}" alt="${supp.name}">
        </div>
        <div class="cabinet-details">
          <span class="cabinet-name">${supp.name}</span>
          <span class="cabinet-dosage">${supp.dosage}</span>
          <span class="cabinet-freq">Daily reminder</span>
        </div>
        <div class="cabinet-counter">
          <button class="counter-btn minus-btn">-</button>
          <span class="counter-val">${supp.count} left</span>
          <button class="counter-btn plus-btn">+</button>
        </div>
      `;
      
      // Minus Pill count
      card.querySelector('.minus-btn').addEventListener('click', () => {
        if (supp.count > 0) {
          supp.count--;
          card.querySelector('.counter-val').textContent = `${supp.count} left`;
          renderSupplementsCarousel(); // Sync dashboard view
        }
      });
      
      // Plus Pill count
      card.querySelector('.plus-btn').addEventListener('click', () => {
        supp.count += 10;
        card.querySelector('.counter-val').textContent = `${supp.count} left`;
        renderSupplementsCarousel(); // Sync dashboard view
      });

      // Delete supplement
      card.querySelector('.delete-supp-btn').addEventListener('click', () => {
        state.supplements = state.supplements.filter(s => s.id !== supp.id);
        renderSuppCabinet();
        renderSupplementsCarousel();
      });
      
      cabinetGrid.appendChild(card);
    });
    
    lucide.createIcons();
  }

  // ==========================================
  // APPOINTMENT CALENDAR VIEW
  // ==========================================
  
  function renderAppointmentCalendar() {
    const remindersList = document.getElementById('calendar-reminders-list');
    const daysGrid = document.getElementById('calendar-days-grid');
    
    // 1. Sidebar reminders
    remindersList.innerHTML = '';
    const allEvents = [];
    Object.keys(state.schedule).forEach(day => {
      state.schedule[day].forEach(e => {
        allEvents.push({ ...e, dayName: day });
      });
    });
    
    if (allEvents.length === 0) {
      remindersList.innerHTML = `
        <li class="reminder-item" style="box-shadow:none;background:none;color:var(--text-secondary);font-style:italic;">
          No upcoming reminders set.
        </li>
      `;
    } else {
      allEvents.slice(0, 4).forEach(e => {
        const dotColor = e.type === 'Advice' ? 'orange' : '';
        const item = document.createElement('li');
        item.className = 'reminder-item';
        item.innerHTML = `
          <div class="reminder-dot ${dotColor}"></div>
          <div class="reminder-info">
            <span class="reminder-title">${e.title}</span>
            <span class="reminder-time">${e.dayName} • ${e.time}</span>
          </div>
        `;
        remindersList.appendChild(item);
      });
    }

    // 2. Calendar Cells (October 2022 starts on Saturday = day 6 index)
    daysGrid.innerHTML = '';
    const startOffset = 5; // Oct 1, 2022 was a Saturday. Index 5 (Mon=0, Tue=1... Sat=5)
    const daysInMonth = 31;
    
    // Add gray empty cells for previous month (September)
    for (let i = 0; i < startOffset; i++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-cell other-month';
      cell.innerHTML = `<span class="cell-num">${26 + i}</span>`;
      daysGrid.appendChild(cell);
    }
    
    // Add cells for October
    for (let dayVal = 1; dayVal <= daysInMonth; dayVal++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-cell';
      if (dayVal === 10) cell.classList.add('today'); // Let's set 10th Oct as current active today
      
      // Determine what day of the week this date is
      const dayIndex = (startOffset + dayVal - 1) % 7;
      const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const dayName = weekdays[dayIndex];
      
      const daySchedule = state.schedule[dayName] || [];
      
      let eventsHTML = '';
      daySchedule.forEach(evt => {
        const eventTag = evt.type.toLowerCase();
        eventsHTML += `<span class="cell-event ${eventTag}">${evt.title}</span>`;
      });
      
      cell.innerHTML = `
        <span class="cell-num">${dayVal}</span>
        <div class="cell-events">
          ${eventsHTML}
        </div>
      `;
      
      cell.addEventListener('click', () => {
        state.selectedTimelineDay = dayName;
        switchTab('dashboard');
        
        // Scroll to timeline and focus
        const dayCards = daysContainer.querySelectorAll('.day-card');
        dayCards.forEach(c => {
          if (c.querySelector('.day-name').textContent === dayName) {
            c.click();
            c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      });
      
      daysGrid.appendChild(cell);
    }
  }

  // ==========================================
  // MODALS DIALOGS ACTIONS
  // ==========================================
  
  function openModal(modal) {
    modal.classList.add('open');
  }
  
  function closeModal(modal) {
    modal.classList.remove('open');
  }

  // Add Event
  openEventBtn.addEventListener('click', () => {
    // pre-fill day selector with selected timeline day
    document.getElementById('event-day').value = state.selectedTimelineDay;
    openModal(addEventModal);
  });
  closeEventBtn.addEventListener('click', () => closeModal(addEventModal));
  
  // Quick Trigger from Calendar page
  document.getElementById('calendar-add-event-btn').addEventListener('click', () => {
    document.getElementById('event-day').value = "Mon";
    openModal(addEventModal);
  });

  addEventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('event-title').value;
    const doctor = document.getElementById('event-doctor').value;
    const day = document.getElementById('event-day').value;
    const timeVal = document.getElementById('event-time').value;
    const type = document.querySelector('input[name="event-type"]:checked').value;
    const detail = document.getElementById('event-detail').value;

    // Convert time 24h to 12h
    const [hours, minutes] = timeVal.split(':');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const hour12 = hours % 12 || 12;
    const formattedTime = `${hour12}:${minutes} ${ampm}`;

    const newEvent = {
      time: formattedTime,
      title: title,
      type: type,
      doctor: doctor || null,
      detail: detail || (type === 'Supplement' ? 'Dosage intake' : '1 Log'),
      completed: false
    };

    if (!state.schedule[day]) {
      state.schedule[day] = [];
    }
    state.schedule[day].push(newEvent);

    // Save and Re-render
    closeModal(addEventModal);
    addEventForm.reset();
    renderTimelineDays();
    if (state.activeTab === 'calendar') {
      renderAppointmentCalendar();
    }
  });

  // Add Supplement
  openSuppBtn.addEventListener('click', () => openModal(addSuppModal));
  closeSuppBtn.addEventListener('click', () => closeModal(addSuppModal));

  addSuppForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('supp-name').value;
    const dosage = document.getElementById('supp-dosage').value;
    const frequency = document.getElementById('supp-frequency').value;
    const image = document.getElementById('supp-image-select').value;
    
    const nextNum = String(state.supplements.length + 1).padStart(2, '0');
    const newSupp = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      num: nextNum,
      name: name,
      dosage: dosage,
      count: 60, // default bottle capacity
      image: image
    };

    state.supplements.push(newSupp);
    
    closeModal(addSuppModal);
    addSuppForm.reset();
    renderSupplementsCarousel();
    if (state.activeTab === 'supplements') {
      renderSuppCabinet();
    }
  });

  // Detailed clinical record Modal
  function openRecordDetailModal(test) {
    document.getElementById('record-detail-title').textContent = test.title;
    document.getElementById('record-detail-doctor').textContent = test.doctor || 'N/A';
    document.getElementById('record-detail-date').textContent = test.fullDate;
    document.getElementById('record-detail-value').textContent = test.value;
    document.getElementById('record-detail-notes').textContent = test.notes;
    
    const statusBadge = document.getElementById('record-detail-status');
    statusBadge.textContent = test.status;
    statusBadge.className = `status-badge ${test.status.toLowerCase() === 'optimal' || test.status.toLowerCase() === 'normal' ? 'normal' : ''}`;
    
    openModal(recordDetailModal);
  }
  closeDetailBtn.addEventListener('click', () => closeModal(recordDetailModal));

  // Close modals when clicking overlay
  [addEventModal, addSuppModal, recordDetailModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // ==========================================
  // PROFILE SETTINGS & DARK THEME TOGGLE
  // ==========================================

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('settings-name').value;
    const email = document.getElementById('settings-email').value;
    
    state.userProfile.name = name;
    state.userProfile.email = email;
    state.userProfile.age = document.getElementById('settings-age').value;
    state.userProfile.bloodType = document.getElementById('settings-blood-type').value;
    state.userProfile.bio = document.getElementById('settings-bio').value;
    
    // Update top header profile info
    userNameDisplays[0].textContent = name;
    userEmailDisplays[0].textContent = email;
    
    // Show quick feedback
    const saveBtn = profileForm.querySelector('.save-settings-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "Saved Successfully!";
    saveBtn.style.backgroundColor = "var(--green-color)";
    
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.style.backgroundColor = "var(--primary-color)";
    }, 2000);
  });

  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  });

  // ==========================================
  // APP INITIALIZATION
  // ==========================================
  
  function init() {
    renderTestCards();
    renderSupplementsCarousel();
    renderTimelineDays();
    lucide.createIcons();
  }
  
  init();

});
