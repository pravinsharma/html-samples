/* ==========================================================================
   VitalsFlow App State & Database
   ========================================================================== */
const state = {
  activeView: 'panel-dashboard',
  selectedDate: '26',
  currentMonth: 'August 2019',
  
  // Historical Examinations Database
  examinations: [
    { id: 1, date: '21 Jul 2019', title: 'Hypertensive crisis', status: 'Ongoing treatment', type: 'teal', doctor: 'Dr. Isabella Bowers', clinic: 'California Hospital Medical Center' },
    { id: 2, date: '18 Jul 2019', title: 'Osteoporosis', status: 'Incurable', type: 'orange', doctor: 'Dr. Sophia Bennett', clinic: 'Metropolitan Bone Clinic' },
    { id: 3, date: '21 Jul 2019', title: 'Hypertensive crisis', status: 'Examination', type: 'grey', doctor: 'Dr. Isabella Bowers', clinic: 'California Hospital Medical Center' },
    { id: 4, date: '10 Jun 2019', title: 'Allergy screening', status: 'Resolved', type: 'teal', doctor: 'Dr. Liam Vance', clinic: 'North Allergy Care' },
    { id: 5, date: '04 May 2019', title: 'Vertebral alignment check', status: 'Follow-up', type: 'grey', doctor: 'Dr. Isabella Bowers', clinic: 'California Hospital Medical Center' },
    { id: 6, date: '15 Mar 2019', title: 'Cardiogram test', status: 'Stable', type: 'teal', doctor: 'Dr. Sophia Bennett', clinic: 'Cardiac Wellness Center' },
    { id: 7, date: '12 Jan 2019', title: 'Routine dental care', status: 'Completed', type: 'grey', doctor: 'Dr. Chloe Ross', clinic: 'Smile Dental Clinic' }
  ],
  
  // User Payment Cards
  cards: [
    { number: '2345 4645 7865 5432', holder: 'Bess Willis', expiry: '12/24', theme: 'visa-theme', brand: 'VISA' }
  ],
  
  // Available Doctors
  doctors: [
    { id: 'bowers', name: 'Dr. Isabella Bowers', specialty: 'Surgeon', clinic: 'California Hospital Medical Center', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150', rating: '4.9', patients: '1.2k', experience: '12 yrs' },
    { id: 'bennett', name: 'Dr. Sophia Bennett', specialty: 'Cardiologist', clinic: 'Cardiac Wellness Center', avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150', rating: '4.8', patients: '900+', experience: '9 yrs' },
    { id: 'wright', name: 'Dr. Alexander Wright', specialty: 'Neurologist', clinic: 'Neuro Health Institute', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150', rating: '4.7', patients: '800+', experience: '10 yrs' },
    { id: 'ross', name: 'Dr. Chloe Ross', specialty: 'Dentist', clinic: 'Smile Dental Clinic', avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150', rating: '4.9', patients: '2.1k', experience: '15 yrs' }
  ],
  
  // Interactive Chat Messages History
  chats: {
    bowers: [
      { sender: 'doc', text: 'Hello Bess. I reviewed your recent spinal scans. How is your spinal pain today?', time: '10:30 AM' },
      { sender: 'user', text: 'Hi doctor. It feels slightly better than last week, but I still feel stiffness when sitting for long periods.', time: '10:32 AM' },
      { sender: 'doc', text: 'I see. Please make sure to do the recommended lumbar extension stretches every 2 hours. Also, keep track of your pain levels in your dashboard.', time: '10:35 AM' },
      { sender: 'doc', text: 'Let\'s keep our appointment scheduled for Aug 26 at 12:45 AM. We\'ll evaluate your progress then.', time: '10:36 AM' }
    ],
    bennett: [
      { sender: 'doc', text: 'Hi Bess. Your heart rate readings logged yesterday look completely stable.', time: '03:15 PM' },
      { sender: 'user', text: 'That\'s great to hear! Should I continue taking the current dosage of calcium supplements?', time: '03:20 PM' },
      { sender: 'doc', text: 'Yes, please continue the supplements as normal. We will run another bone density scan in two months.', time: '03:22 PM' }
    ]
  },
  
  // Health Curve Datasets
  chartData: {
    D: {
      labels: ['08:00 AM', '12:00 PM', '04:00 PM', '08:00 PM', '12:00 AM'],
      average: [80, 85, 92, 88, 83],
      mydata: [78, 82, 95, 84, 80]
    },
    W: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      average: [78, 80, 82, 81, 79, 83, 80],
      mydata: [75, 83, 80, 84, 78, 86, 82]
    },
    M: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      average: [82, 80, 84, 83],
      mydata: [80, 83, 81, 85]
    },
    Y: {
      // Mirroring graph points in sample1.jpg
      labels: ['2016', '2017', '2018', '2019'],
      average: [45, 55, 48, 52],
      mydata: [50, 48, 53, 35]
    }
  }
};

let healthChartInstance = null;

/* ==========================================================================
   Initialization on Load
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initChart();
  initCalendar();
  initModals();
  initCreditCards();
  initDoctors();
  initChats();
  initVitalsLogger();
});

/* ==========================================================================
   Navigation Panel Switcher
   ========================================================================== */
function initNavigation() {
  const menuButtons = document.querySelectorAll('.menu-item');
  const panels = document.querySelectorAll('.tab-panel');
  
  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      // Update Menu Active States
      menuButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Toggle Panel Views
      panels.forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        state.activeView = targetId;
      }
      
      // Special view triggers
      if (targetId === 'panel-dashboard') {
        setTimeout(() => {
          if (healthChartInstance) {
            healthChartInstance.resize();
            healthChartInstance.update();
          }
        }, 100);
      }
    });
  });
}

/* ==========================================================================
   Chart.js Configurations (Health Curve Graph)
   ========================================================================== */
function initChart() {
  const ctx = document.getElementById('healthChart').getContext('2d');
  
  // Custom Gradients for fills
  const gradMyData = ctx.createLinearGradient(0, 0, 0, 180);
  gradMyData.addColorStop(0, 'rgba(13, 162, 166, 0.2)');
  gradMyData.addColorStop(1, 'rgba(13, 162, 166, 0.0)');
  
  const gradAvg = ctx.createLinearGradient(0, 0, 0, 180);
  gradAvg.addColorStop(0, 'rgba(230, 246, 246, 0.15)');
  gradAvg.addColorStop(1, 'rgba(230, 246, 246, 0.0)');

  const chartConfig = {
    type: 'line',
    data: {
      labels: state.chartData.Y.labels,
      datasets: [
        {
          label: 'Average',
          data: state.chartData.Y.average,
          borderColor: 'rgba(13, 162, 166, 0.2)',
          borderWidth: 2,
          backgroundColor: gradAvg,
          fill: true,
          tension: 0.45,
          pointRadius: 0,
          pointHitRadius: 10,
          borderDash: [5, 5]
        },
        {
          label: 'My Data',
          data: state.chartData.Y.mydata,
          borderColor: '#0da2a6',
          borderWidth: 3,
          backgroundColor: gradMyData,
          fill: true,
          tension: 0.45,
          pointRadius: 4,
          pointBackgroundColor: '#0da2a6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#0da2a6',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Using custom HTML legends
        },
        tooltip: {
          backgroundColor: '#2a3b3d',
          titleFont: { family: 'Outfit', size: 12 },
          bodyFont: { family: 'Outfit', size: 12 },
          padding: 10,
          borderRadius: 8,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw} mmHg`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: '#f0f6f7',
            drawTicks: false
          },
          ticks: {
            font: { family: 'Outfit', size: 11 },
            color: '#8fa0a3'
          },
          border: {
            display: false
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            display: false
          },
          border: {
            display: false
          }
        }
      }
    }
  };
  
  healthChartInstance = new Chart(ctx, chartConfig);

  // Time filter listener
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const timeframe = btn.getAttribute('data-time');
      updateChartTimeframe(timeframe);
    });
  });
}

function updateChartTimeframe(timeframe) {
  if (!healthChartInstance) return;
  
  const dataset = state.chartData[timeframe];
  healthChartInstance.data.labels = dataset.labels;
  healthChartInstance.data.datasets[0].data = dataset.average;
  healthChartInstance.data.datasets[1].data = dataset.mydata;
  
  healthChartInstance.update('active');
}

/* ==========================================================================
   Calendar Picker Carousel (Nearest Treatment)
   ========================================================================== */
function initCalendar() {
  const datesContainer = document.getElementById('dates-slider');
  const dateNodes = document.querySelectorAll('.date-node');
  const prevBtn = document.getElementById('prev-dates');
  const nextBtn = document.getElementById('next-dates');
  
  dateNodes.forEach(node => {
    node.addEventListener('click', () => {
      dateNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      state.selectedDate = node.getAttribute('data-date');
      
      // Update month header if selecting date 01 (Sept) vs others (Aug)
      const monthLabel = document.getElementById('treatment-month-label');
      if (state.selectedDate === '01') {
        monthLabel.innerHTML = 'September 2019 &nbsp;<i class="fa-solid fa-arrow-right"></i>';
      } else {
        monthLabel.innerHTML = 'August 2019 &nbsp;<i class="fa-solid fa-arrow-right"></i>';
      }
    });
  });

  // Carousel Sliding effect (visual shifts)
  let scrollAmount = 0;
  prevBtn.addEventListener('click', () => {
    datesContainer.scrollBy({ left: -80, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    datesContainer.scrollBy({ left: 80, behavior: 'smooth' });
  });
}

/* ==========================================================================
   Modals Controller
   ========================================================================== */
function initModals() {
  // Selectors
  const examsModal = document.getElementById('modal-exams');
  const cardModal = document.getElementById('modal-card');
  const adviceModal = document.getElementById('modal-advice');
  
  const btnOpenExams = document.getElementById('open-exams-modal');
  const btnOpenCard = document.getElementById('open-card-modal');
  const btnOpenAdvice = document.getElementById('advice-btn');
  
  const closeButtons = document.querySelectorAll('.modal-close-btn, .btn-secondary, #cancel-card-btn');
  
  // Open Exams Historical Table
  if (btnOpenExams) {
    btnOpenExams.addEventListener('click', () => {
      populateExamsTable();
      examsModal.classList.add('active');
    });
  }
  
  // Open Add Card modal
  if (btnOpenCard) {
    btnOpenCard.addEventListener('click', () => {
      resetCardForm();
      cardModal.classList.add('active');
    });
  }

  // Open Advice modal
  if (btnOpenAdvice) {
    btnOpenAdvice.addEventListener('click', (e) => {
      e.preventDefault();
      adviceModal.classList.add('active');
    });
  }
  
  // Close Modals
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
      });
    });
  });

  // Close modals clicking on backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
  
  // Real-time table search for Exams history
  const examSearch = document.getElementById('exams-modal-search');
  if (examSearch) {
    examSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      populateExamsTable(q);
    });
  }
}

// Populate Exams Table inside Modal
function populateExamsTable(query = '') {
  const tbody = document.getElementById('modal-exams-table-body');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  const filtered = state.examinations.filter(ex => {
    return ex.title.toLowerCase().includes(query) || 
           ex.doctor.toLowerCase().includes(query) || 
           ex.clinic.toLowerCase().includes(query) ||
           ex.status.toLowerCase().includes(query);
  });
  
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#8fa0a3;">No examination records match your query.</td></tr>`;
    return;
  }
  
  filtered.forEach(ex => {
    const row = document.createElement('tr');
    
    // Status Badge colors
    let badgeClass = 'badge-grey';
    if (ex.type === 'teal') badgeClass = 'badge-teal';
    else if (ex.type === 'orange') badgeClass = 'badge-orange';
    
    row.innerHTML = `
      <td style="font-weight:600;">${ex.date}</td>
      <td style="font-weight:600; color:#2a3b3d;">${ex.title}</td>
      <td>
        <span style="display:block;font-weight:500;">${ex.clinic}</span>
      </td>
      <td>${ex.doctor}</td>
      <td><span class="badge-status ${badgeClass}">${ex.status}</span></td>
    `;
    tbody.appendChild(row);
  });
}

/* ==========================================================================
   Billing & Payment Cards Module
   ========================================================================== */
function initCreditCards() {
  const container = document.getElementById('cards-container');
  const cardForm = document.getElementById('add-card-form');
  
  // Inputs for live card preview
  const inputNum = document.getElementById('card-num-input');
  const inputName = document.getElementById('card-name-input');
  const inputExpiry = document.getElementById('card-expiry-input');
  
  const prevNum = document.getElementById('preview-number');
  const prevName = document.getElementById('preview-holder');
  const prevExpiry = document.getElementById('preview-expiry');
  const prevLogo = document.getElementById('preview-logo');
  const liveCard = document.getElementById('live-card');
  
  // Format Card Number input with spaces
  inputNum.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += value[i];
    }
    e.target.value = formatted;
    prevNum.textContent = formatted || '•••• •••• •••• ••••';
    
    // Simple Card Brand Guesser
    if (value.startsWith('4')) {
      prevLogo.textContent = 'VISA';
      liveCard.className = 'credit-card-item visa-theme live-card-preview';
    } else if (value.startsWith('5')) {
      prevLogo.textContent = 'MC';
      liveCard.className = 'credit-card-item mastercard-theme live-card-preview';
    } else {
      prevLogo.textContent = 'CARD';
      liveCard.className = 'credit-card-item visa-theme live-card-preview';
    }
  });

  // Sync Holder Name
  inputName.addEventListener('input', (e) => {
    prevName.textContent = e.target.value.toUpperCase() || 'CARDHOLDER NAME';
  });

  // Sync Expiry (auto-insert / slash)
  inputExpiry.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
    prevExpiry.textContent = value || 'MM/YY';
  });
  
  // Submit new card logic
  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const num = inputNum.value;
    const holder = inputName.value;
    const expiry = inputExpiry.value;
    const isMastercard = num.startsWith('5');
    
    const newCard = {
      number: num,
      holder: holder || 'Bess Willis',
      expiry: expiry || '12/24',
      theme: isMastercard ? 'mastercard-theme' : 'visa-theme',
      brand: isMastercard ? 'MASTERCARD' : 'VISA'
    };
    
    state.cards.push(newCard);
    renderCardsCarousel();
    
    // Close modal
    document.getElementById('modal-card').classList.remove('active');
  });

  renderCardsCarousel();
}

function renderCardsCarousel() {
  const container = document.getElementById('cards-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  state.cards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = `credit-card-item ${card.theme}`;
    cardEl.innerHTML = `
      <div class="card-logo">${card.brand}</div>
      <div class="card-chip"></div>
      <div class="card-number">${card.number}</div>
      <div class="card-holder-row">
        <span class="holder-name">${card.holder}</span>
        <span class="expiry-date">${card.expiry}</span>
      </div>
    `;
    container.appendChild(cardEl);
  });
}

function resetCardForm() {
  document.getElementById('add-card-form').reset();
  document.getElementById('preview-number').textContent = '•••• •••• •••• ••••';
  document.getElementById('preview-holder').textContent = 'CARDHOLDER NAME';
  document.getElementById('preview-expiry').textContent = 'MM/YY';
  document.getElementById('preview-logo').textContent = 'VISA';
  document.getElementById('live-card').className = 'credit-card-item visa-theme live-card-preview';
}

/* ==========================================================================
   Doctor Finder Panel Module
   ========================================================================== */
function initDoctors() {
  const listEl = document.getElementById('doctors-list');
  const searchInput = document.getElementById('doctor-search');
  const specFilters = document.querySelectorAll('.spec-filter');
  const bookingForm = document.getElementById('appointment-form');
  
  let activeSpec = 'all';
  let searchQuery = '';
  
  function renderDoctors() {
    if (!listEl) return;
    
    listEl.innerHTML = '';
    
    const filtered = state.doctors.filter(doc => {
      const matchSpec = activeSpec === 'all' || doc.specialty === activeSpec;
      const matchSearch = doc.name.toLowerCase().includes(searchQuery) || 
                          doc.specialty.toLowerCase().includes(searchQuery) ||
                          doc.clinic.toLowerCase().includes(searchQuery);
      return matchSpec && matchSearch;
    });
    
    if (filtered.length === 0) {
      listEl.innerHTML = `<div style="grid-column: span 3; text-align:center; padding: 40px; color: var(--text-muted);">No specialist doctors found matching the filter criteria.</div>`;
      return;
    }
    
    filtered.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'doctor-item-card';
      card.innerHTML = `
        <img src="${doc.avatar}" alt="${doc.name}" class="doc-avatar-large">
        <h4>${doc.name}</h4>
        <span class="doc-specialty-badge">${doc.specialty}</span>
        
        <div class="doc-stats-mini">
          <div class="doc-mini-stat">
            <span class="mini-stat-label">Rating</span>
            <span class="mini-stat-val"><i class="fa-solid fa-star" style="color:#f5d061;font-size:10px;"></i> ${doc.rating}</span>
          </div>
          <div class="doc-mini-stat">
            <span class="mini-stat-label">Experience</span>
            <span class="mini-stat-val">${doc.experience}</span>
          </div>
          <div class="doc-mini-stat">
            <span class="mini-stat-label">Patients</span>
            <span class="mini-stat-val">${doc.patients}</span>
          </div>
        </div>
        
        <button class="chat-now-btn" data-docid="${doc.id}">Send Message</button>
      `;
      listEl.appendChild(card);
    });
    
    // Bind chat redirection buttons
    document.querySelectorAll('.chat-now-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-docid');
        redirectToChat(id);
      });
    });
  }

  // Specialty filters
  specFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      specFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSpec = btn.getAttribute('data-spec');
      renderDoctors();
    });
  });
  
  // Real-time search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderDoctors();
    });
  }

  // Appointment form submit
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const docName = document.getElementById('select-doc').value;
      const dateVal = document.getElementById('book-date').value;
      const timeVal = document.getElementById('book-time').value;
      const symptom = document.getElementById('book-symptoms').value;
      
      // Parse doctor avatar matching selected doctor
      const matchedDoc = state.doctors.find(d => d.name === docName);
      const docAvatar = matchedDoc ? matchedDoc.avatar : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150';
      
      // Add a new Appointment Card to the top left Notification Section
      const newCard = {
        id: state.examinations.length + 1,
        date: dateVal,
        title: symptom,
        status: 'Appointment Scheduled',
        type: 'teal',
        doctor: docName,
        clinic: matchedDoc ? matchedDoc.clinic : 'Clinic center'
      };
      
      // Push to examinations
      state.examinations.unshift(newCard);
      
      // Append appointment to HTML directly (dynamically)
      const listContainer = document.querySelector('.notification-list');
      const appCard = document.createElement('div');
      appCard.className = 'notification-card doc-card';
      appCard.innerHTML = `
        <div class="doc-profile-header">
          <img src="${docAvatar}" alt="${docName}" class="doc-small-avatar">
          <div class="doc-info-text">
            <h4 class="doc-name">${docName}</h4>
            <p class="doc-clinic">${newCard.clinic}</p>
          </div>
        </div>
        <div class="appointment-details">
          <h5 class="appointment-reason">Scheduled Consultation</h5>
          <p class="appointment-symptom">${symptom}</p>
          <div class="appointment-time-badge">
            <div class="time-item">
              <span class="badge-label">Date</span>
              <span class="badge-val">${dateVal}</span>
            </div>
            <div class="time-divider"></div>
            <div class="time-item">
              <span class="badge-label">Time</span>
              <span class="badge-val">${timeVal}</span>
            </div>
          </div>
        </div>
      `;
      
      // Insert at top of notifications
      listContainer.insertBefore(appCard, listContainer.firstChild);
      
      alert(`Booking Successful!\nYour consultation with ${docName} on ${dateVal} at ${timeVal} has been scheduled.`);
      bookingForm.reset();
      
      // Switch back to dashboard view to see the new appointment card
      document.getElementById('btn-dashboard').click();
    });
  }
  
  renderDoctors();
}

function redirectToChat(docId) {
  // Find conversation element
  const chatItem = document.querySelector(`.conversation-item[data-doc="${docId}"]`);
  if (chatItem) {
    // Click conversation
    chatItem.click();
    // Switch menu navigation to Contact view
    document.getElementById('btn-contact').click();
  }
}

/* ==========================================================================
   Inbox Chat Simulator
   ========================================================================== */
let activeConversation = 'bowers';

function initChats() {
  const convItems = document.querySelectorAll('.conversation-item');
  const chatForm = document.getElementById('chat-input-form');
  const messageInput = document.getElementById('message-text');
  
  convItems.forEach(item => {
    item.addEventListener('click', () => {
      convItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const doc = item.getAttribute('data-doc');
      activeConversation = doc;
      
      // Update header details
      const docObj = state.doctors.find(d => d.id === doc);
      if (docObj) {
        document.getElementById('chat-header-name').textContent = docObj.name;
        document.getElementById('chat-header-avatar').src = docObj.avatar;
      }
      
      renderMessages();
    });
  });
  
  // Submit new message
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const text = messageInput.value.trim();
      if (!text) return;
      
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Push Message
      state.chats[activeConversation].push({
        sender: 'user',
        text: text,
        time: timeStr
      });
      
      // Update preview in sidebar
      const activeConvEl = document.querySelector(`.conversation-item[data-doc="${activeConversation}"] .conv-preview`);
      if (activeConvEl) {
        activeConvEl.textContent = text;
      }
      
      messageInput.value = '';
      renderMessages();
      
      // Automatic Doctor Reply Simulation
      simulateDoctorReply(activeConversation);
    });
  }
  
  renderMessages();
}

function renderMessages() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  
  container.innerHTML = '';
  const history = state.chats[activeConversation] || [];
  
  history.forEach(msg => {
    const bubble = document.createElement('div');
    bubble.className = `message ${msg.sender === 'user' ? 'msg-sent' : 'msg-received'}`;
    bubble.innerHTML = `
      <div class="message-content">${msg.text}</div>
      <div class="message-time">${msg.time}</div>
    `;
    container.appendChild(bubble);
  });
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function simulateDoctorReply(docId) {
  setTimeout(() => {
    // Only reply if user is still looking at the same conversation
    if (activeConversation !== docId) return;
    
    let replyText = "I will check your charts and get back to you shortly.";
    if (docId === 'bowers') {
      replyText = "Thank you for the update. Ensure you maintain correct posture, and call the office if the spinal pain intensifies.";
    } else if (docId === 'bennett') {
      replyText = "Great! Remember to track your blood pressure values daily using the tracker panel.";
    }
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    state.chats[docId].push({
      sender: 'doc',
      text: replyText,
      time: timeStr
    });
    
    // Update preview in sidebar
    const activeConvEl = document.querySelector(`.conversation-item[data-doc="${docId}"] .conv-preview`);
    if (activeConvEl) {
      activeConvEl.textContent = replyText;
    }
    
    renderMessages();
  }, 1500);
}

/* ==========================================================================
   Health Metric Tracker Module
   ========================================================================== */
function initVitalsLogger() {
  const vitalsForm = document.getElementById('vitals-form');
  
  if (vitalsForm) {
    vitalsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const systolic = parseInt(document.getElementById('vital-systolic').value);
      const diastolic = parseInt(document.getElementById('vital-diastolic').value);
      const glucose = parseInt(document.getElementById('vital-glucose').value);
      const weight = parseFloat(document.getElementById('vital-weight').value);
      
      // Update current averages display
      document.getElementById('current-bp').innerHTML = `${systolic}/${diastolic} <span class="vcard-unit">mmHg</span>`;
      document.getElementById('current-glucose').innerHTML = `${glucose} <span class="vcard-unit">mg/dL</span>`;
      document.getElementById('current-weight').innerHTML = `${weight.toFixed(1)} <span class="vcard-unit">kg</span>`;
      
      // Update left column statistics (Weight)
      const weightStatsVal = document.querySelector('.profile-stats .stat-item:nth-child(3) .stat-value');
      if (weightStatsVal) {
        weightStatsVal.innerHTML = `${weight.toFixed(0)} <span class="stat-unit">kg</span>`;
      }
      
      // Push new reading to charts dataset (e.g. Month or Week)
      // We will append it to our Monthly / Yearly dataset to show interactive update
      state.chartData.Y.mydata.push(systolic - 70); // normalise for visual curve representation
      if (state.chartData.Y.mydata.length > 6) {
        state.chartData.Y.mydata.shift();
      }
      
      // Also update labels if needed
      if (healthChartInstance) {
        updateChartTimeframe('Y');
      }
      
      alert('Vitals logged successfully! Your main health curve trends have been refreshed.');
      vitalsForm.reset();
      
      // Redirect back to dashboard view to observe graph updates
      document.getElementById('btn-dashboard').click();
    });
  }
}
