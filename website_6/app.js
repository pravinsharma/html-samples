// Medical Dashboard Application Logic

// Mock Data for Biological Systems Analysis
const systemsData = {
  nervous: {
    title: "NERVOUS SYSTEM ANALYSIS",
    doctors: [
      { name: "Dr. Theresa Webb", specialty: "NEURORADIOLOGIST", status: "available" },
      { name: "Dr. Devon Lane", specialty: "RADIOLOGIST", status: "on-operation" },
      { name: "Dr. Kathryn Murphy", specialty: "NEUROLOGY", status: "available" }
    ],
    nmu: "85%",
    ghs: "45%",
    aiTargetPercent: 93,
    radarPoints: "60,25 90,48 76,82 40,78 28,47"
  },
  digestive: {
    title: "DIGESTIVE SYSTEM ANALYSIS",
    doctors: [
      { name: "Dr. Albert Flores", specialty: "GASTROENTEROLOGIST", status: "available" },
      { name: "Dr. Bessie Cooper", specialty: "HEPATOLOGIST", status: "on-operation" }
    ],
    nmu: "62%",
    ghs: "78%",
    aiTargetPercent: 88,
    radarPoints: "60,45 80,50 65,85 45,72 32,58"
  },
  immune: {
    title: "IMMUNE SYSTEM ANALYSIS",
    doctors: [
      { name: "Dr. Dianne Russell", specialty: "IMMUNOLOGIST", status: "available" },
      { name: "Dr. Wade Warren", specialty: "ALLERGIST", status: "available" }
    ],
    nmu: "94%",
    ghs: "15%",
    aiTargetPercent: 97,
    radarPoints: "60,15 100,38 85,92 35,92 20,38"
  },
  respiratory: {
    title: "RESPIRATORY SYSTEM ANALYSIS",
    doctors: [
      { name: "Dr. Jane Cooper", specialty: "PULMONOLOGIST", status: "available" },
      { name: "Dr. Robert Fox", specialty: "THORACIC SURGEON", status: "on-operation" },
      { name: "Dr. Cody Fisher", specialty: "PULMONOLOGIST", status: "available" }
    ],
    nmu: "71%",
    ghs: "60%",
    aiTargetPercent: 89,
    radarPoints: "60,30 82,45 70,80 50,75 35,50"
  },
  urinary: {
    title: "URINARY SYSTEM ANALYSIS",
    doctors: [
      { name: "Dr. Guy Hawkins", specialty: "NEPHROLOGIST", status: "on-operation" },
      { name: "Dr. Esther Howard", specialty: "UROLOGIST", status: "available" }
    ],
    nmu: "50%",
    ghs: "88%",
    aiTargetPercent: 74,
    radarPoints: "60,50 78,55 72,75 42,80 38,62"
  },
  skeletal: {
    title: "SKELETAL SYSTEM ANALYSIS",
    doctors: [
      { name: "Dr. Ronald Richards", specialty: "ORTHOPEDIC SURGEON", status: "available" },
      { name: "Dr. Kristin Watson", specialty: "RHEUMATOLOGIST", status: "available" }
    ],
    nmu: "40%",
    ghs: "92%",
    aiTargetPercent: 81,
    radarPoints: "60,40 95,40 80,70 48,90 22,50"
  },
  gut: {
    title: "DIGESTIVE TRACT ANALYSIS",
    doctors: [
      { name: "Dr. Leslie Alexander", specialty: "PROCTOLOGIST", status: "available" },
      { name: "Dr. Jenny Wilson", specialty: "GASTROENTEROLOGIST", status: "on-operation" }
    ],
    nmu: "79%",
    ghs: "53%",
    aiTargetPercent: 86,
    radarPoints: "60,32 88,44 72,82 46,76 30,52"
  }
};

// Global State
let activeSystem = 'nervous';
let isScanning = false;
let icpWaveOffset = 0;
let doctorsFilterValue = 'all';

// DOM Elements
const bodyEl = document.body;
const sidebarItems = document.querySelectorAll('.nav-item');
const pageTitleEl = document.getElementById('page-title');
const dashboardGrid = document.getElementById('dashboard-grid');
const skeletonLoader = document.getElementById('skeleton-loader');
const searchInput = document.getElementById('search-input');
const filterMenuBtn = document.getElementById('filter-menu-btn');
const filterDropdownMenu = document.getElementById('filter-dropdown-menu');
const doctorsListEl = document.getElementById('doctors-list');
const mainScanImg = document.getElementById('main-scan-img');
const hotspotContainer = document.getElementById('hotspot-container');
const scanStatusBadge = document.getElementById('scan-status-badge');
const scanLaser = document.getElementById('scan-laser');
const lobeInfoCard = document.getElementById('lobe-info-card');
const lobeTitle = document.getElementById('lobe-title');
const lobeDesc = document.getElementById('lobe-desc');
const thumbnailItems = document.querySelectorAll('.thumbnail-item:not(.add-more-btn)');
const addMoreThumbBtn = document.getElementById('add-more-thumb-btn');

// Modals & Toast
const bookingModal = document.getElementById('booking-modal');
const bookingDocName = document.getElementById('booking-doc-name');
const bookingDocSpec = document.getElementById('booking-doc-spec');
const bookingForm = document.getElementById('booking-form');
const closeBookingBtn = document.getElementById('close-booking-btn');

const uploadModal = document.getElementById('upload-modal');
const closeUploadBtn = document.getElementById('close-upload-btn');
const uploadDropzone = document.getElementById('upload-dropzone');
const fileUploader = document.getElementById('file-uploader');
const sampleChips = document.querySelectorAll('.sample-chip');

const notificationToast = document.getElementById('notification-toast');
const saveFileBtn = document.getElementById('save-file-btn');

// AI Analyzer
const runScanBtn = document.getElementById('run-scan-btn');
const aiProgressBar = document.getElementById('ai-progress-bar');
const aiNumber = document.getElementById('ai-number');

// SVGs
const radarDataPolygon = document.getElementById('radar-data-polygon');
const scatterBubbles = document.querySelectorAll('.scatter-bubble');
const scatterTooltip = document.getElementById('scatter-tooltip');

/* ---------------- TABS MANAGEMENT & SKELETON LOADERS ---------------- */
sidebarItems.forEach(item => {
  item.addEventListener('click', () => {
    if (isScanning) return; // Prevent tab change during diagnostics
    const tabName = item.getAttribute('data-tab');
    if (!tabName) return;

    // Remove active from all items, add to this
    sidebarItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    loadSystem(tabName);
  });
});

function loadSystem(systemKey) {
  activeSystem = systemKey;
  const data = systemsData[systemKey];
  if (!data) return;

  // Show Skeleton Loader
  dashboardGrid.style.display = 'none';
  skeletonLoader.classList.add('show');

  // Change Title
  pageTitleEl.textContent = data.title;

  setTimeout(() => {
    // Hide Loader & Show Grid
    skeletonLoader.classList.remove('show');
    dashboardGrid.style.display = 'grid';

    // Populate Fluid Vial Badges
    document.querySelector('.badge-nmu .badge-text').textContent = `${data.nmu} NMU`;
    document.querySelector('.badge-ghs .badge-text').textContent = `${data.ghs} GHs`;

    // Reset AI Diagnostics
    setAIProgress(0);

    // Update Radar Points
    radarDataPolygon.setAttribute('points', data.radarPoints);

    // Swap Scanner View based on System
    setupScannerViewForSystem(systemKey);

    // Populate Recommended Doctors
    populateDoctorsList(data.doctors);

    // Reset details panel
    resetLobeDetails();

  }, 1000);
}

function setupScannerViewForSystem(systemKey) {
  // If Nervous System, use the beautiful brain image thumbnails
  if (systemKey === 'nervous') {
    mainScanImg.style.display = 'block';
    // Clear custom system SVG if any
    const existingSvg = document.getElementById('custom-system-scan-svg');
    if (existingSvg) existingSvg.remove();
    
    mainScanImg.src = 'assets/brain_side.png';
    hotspotContainer.style.display = 'block';
    document.querySelector('.scan-thumbnails-container').style.display = 'flex';
  } else {
    // Hide brain specific assets and draw a themed vector shape dynamically
    mainScanImg.style.display = 'none';
    hotspotContainer.style.display = 'none';
    document.querySelector('.scan-thumbnails-container').style.display = 'none';

    // Clear old vector shape
    const existingSvg = document.getElementById('custom-system-scan-svg');
    if (existingSvg) existingSvg.remove();

    // Create a themed inline SVG
    const svgNamespace = "http://www.w3.org/2000/svg";
    const customSvg = document.createElementNS(svgNamespace, 'svg');
    customSvg.setAttribute('id', 'custom-system-scan-svg');
    customSvg.setAttribute('viewBox', '0 0 100 100');
    customSvg.style.width = '75%';
    customSvg.style.height = '75%';
    customSvg.style.zIndex = '4';

    let pathD = '';
    let strokeColor = '#3b82f6';
    let fillColor = 'rgba(59, 130, 246, 0.05)';

    if (systemKey === 'digestive' || systemKey === 'gut') {
      // Stomach outline shape
      pathD = "M40,30 Q30,45 35,65 Q40,80 55,75 Q70,70 65,50 Q60,30 40,30 Z";
      strokeColor = '#10b981';
      fillColor = 'rgba(16, 185, 129, 0.05)';
    } else if (systemKey === 'immune') {
      // Shield or Lymph Node
      pathD = "M50,20 L80,35 V60 C80,75 65,85 50,90 C35,85 20,75 20,60 V35 Z";
      strokeColor = '#a855f7';
      fillColor = 'rgba(168, 85, 247, 0.05)';
    } else if (systemKey === 'respiratory') {
      // Simple Lungs representation
      pathD = "M30,30 C20,30 20,65 35,75 C42,80 45,65 45,55 L45,30 Z M70,30 C80,30 80,65 65,75 C58,80 55,65 55,55 L55,30 Z";
      strokeColor = '#06b6d4';
      fillColor = 'rgba(6, 182, 212, 0.05)';
    } else if (systemKey === 'urinary') {
      // Kidneys Representation
      pathD = "M30,35 C20,35 25,65 35,60 C40,58 38,40 30,35 Z M70,35 C80,35 75,65 65,60 C60,58 62,40 70,35 Z";
      strokeColor = '#eab308';
      fillColor = 'rgba(234, 179, 8, 0.05)';
    } else if (systemKey === 'skeletal') {
      // Bone Representation
      pathD = "M35,35 C30,30 25,35 30,45 L40,45 L40,55 L30,55 C25,65 30,70 35,65 L65,65 C70,70 75,65 70,55 L60,55 L60,45 L70,45 C75,35 70,30 65,35 Z";
      strokeColor = '#64748b';
      fillColor = 'rgba(100, 116, 139, 0.05)';
    }

    const pathEl = document.createElementNS(svgNamespace, 'path');
    pathEl.setAttribute('d', pathD);
    pathEl.setAttribute('stroke', strokeColor);
    pathEl.setAttribute('stroke-width', '1.5');
    pathEl.setAttribute('fill', fillColor);
    pathEl.setAttribute('stroke-linecap', 'round');
    pathEl.setAttribute('stroke-linejoin', 'round');

    customSvg.appendChild(pathEl);
    mainScanImg.parentNode.appendChild(customSvg);
  }
}

function populateDoctorsList(doctors) {
  doctorsListEl.innerHTML = '';
  doctors.forEach(doc => {
    const statusText = doc.status === 'available' ? 'Available' : 'On operation';
    const statusClass = doc.status === 'available' ? 'available' : 'on-operation';

    const li = document.createElement('li');
    li.className = 'doctor-item';
    li.setAttribute('data-name', doc.name);
    li.setAttribute('data-specialty', doc.specialty);
    li.setAttribute('data-status', doc.status);

    li.innerHTML = `
      <div class="doctor-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <div class="doctor-info">
        <div class="doctor-name">Dr. ${doc.name}</div>
        <div class="doctor-specialty">${doc.specialty.toUpperCase()}</div>
      </div>
      <div class="doctor-status-badge ${statusClass}">${statusText}</div>
      <div class="doctor-action-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    `;

    // Add click handler to book appointment
    li.addEventListener('click', () => {
      openBookingModal(doc.name, doc.specialty);
    });

    doctorsListEl.appendChild(li);
  });
}

function resetLobeDetails() {
  lobeTitle.textContent = "Select a Brain Lobe";
  lobeDesc.textContent = "Hover or tap on glowing nodes on the scan to view neurological details.";
}

/* ---------------- INTERACTIVE SVGs & CHARTS ---------------- */

// 1. MS Progression Rate Scatter Chart Tooltip
scatterBubbles.forEach(bubble => {
  bubble.addEventListener('mousemove', (e) => {
    const val = bubble.getAttribute('data-val');
    scatterTooltip.textContent = val;
    scatterTooltip.style.opacity = '1';
    
    // Position tooltip relative to chart container
    const rect = e.currentTarget.parentNode.getBoundingClientRect();
    const tooltipX = e.clientX - rect.left;
    const tooltipY = e.clientY - rect.top - 15;
    
    scatterTooltip.style.left = `${tooltipX}px`;
    scatterTooltip.style.top = `${tooltipY}px`;
    scatterTooltip.style.transform = 'translate(-50%, -100%) scale(1)';
  });

  bubble.addEventListener('mouseleave', () => {
    scatterTooltip.style.opacity = '0';
    scatterTooltip.style.transform = 'translate(-50%, -100%) scale(0.9)';
  });
});

// 2. Intracranial Pressure Live Animated SVG Sine Wave
function animateICPWave() {
  icpWaveOffset += 0.05;
  const path = document.getElementById('icp-wave-path');
  const dot = document.getElementById('icp-pulse-dot');
  if (path) {
    let points = [];
    const amplitude = 8; // Amplitude of sine wave
    const frequency = 0.08; // Frequency of sine wave

    for (let x = 0; x <= 130; x += 1) {
      // Calculate a shifting sine wave that pulses in amplitude slightly
      const pulseAmplitude = amplitude + Math.sin(icpWaveOffset * 0.4) * 3;
      const y = 25 + Math.sin(x * frequency - icpWaveOffset) * pulseAmplitude;
      points.push(`${x},${y}`);
    }
    
    path.setAttribute('d', 'M' + points.join(' L'));
    
    if (dot) {
      // Lock pulse dot in center of x coordinate
      const centerPulseAmp = amplitude + Math.sin(icpWaveOffset * 0.4) * 3;
      const dotY = 25 + Math.sin(65 * frequency - icpWaveOffset) * centerPulseAmp;
      dot.setAttribute('cy', dotY);
    }
  }
  requestAnimationFrame(animateICPWave);
}

// Start wave animation loop
animateICPWave();

// 3. Brain Scan Hotspots hover
const hotspots = document.querySelectorAll('.hotspot');
hotspots.forEach(spot => {
  spot.addEventListener('mouseenter', () => {
    const lobeName = spot.getAttribute('data-lobe');
    const lobeDetail = spot.getAttribute('data-desc');
    lobeTitle.textContent = lobeName;
    lobeDesc.textContent = lobeDetail;
  });

  spot.addEventListener('mouseleave', () => {
    // Keep showing selected or reset
  });
});


/* ---------------- DIAGNOSTICS & ANALYZER CONTROL ---------------- */
runScanBtn.addEventListener('click', () => {
  if (isScanning) return;
  runAIDiagnostics();
});

function runAIDiagnostics() {
  isScanning = true;
  scanStatusBadge.textContent = "SCANNING...";
  scanStatusBadge.classList.add('pulsing');
  scanLaser.classList.add('scanning');
  
  let currentPercentage = 0;
  const target = systemsData[activeSystem]?.aiTargetPercent || 93;
  setAIProgress(0);

  const duration = 2000; // 2 seconds
  const stepTime = Math.abs(Math.floor(duration / target));

  const timer = setInterval(() => {
    currentPercentage++;
    setAIProgress(currentPercentage);

    if (currentPercentage >= target) {
      clearInterval(timer);
      
      // Scanning complete hooks
      setTimeout(() => {
        isScanning = false;
        scanStatusBadge.textContent = "100% SCANNED";
        scanStatusBadge.classList.remove('pulsing');
        scanLaser.classList.remove('scanning');
        showToast("AI diagnostics system scan complete. 0 critical abnormalities found.");
      }, 300);
    }
  }, stepTime);
}

function setAIProgress(percent) {
  aiNumber.textContent = `${percent}%`;
  // Radial bar calculation
  const circumference = 251.2;
  const offset = circumference - (percent / 100) * circumference;
  aiProgressBar.style.strokeDashoffset = offset;
}


/* ---------------- IMAGE SELECTOR & UPLOAD ---------------- */
thumbnailItems.forEach(thumb => {
  thumb.addEventListener('click', () => {
    if (isScanning) return;
    
    // Switch thumbnail selection
    thumbnailItems.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    // Change main display scan
    const newImgSrc = thumb.getAttribute('data-img');
    const scanType = thumb.getAttribute('data-type');
    mainScanImg.style.opacity = '0';
    mainScanImg.style.transform = 'scale(0.95)';

    setTimeout(() => {
      mainScanImg.src = newImgSrc;
      mainScanImg.style.opacity = '1';
      mainScanImg.style.transform = 'scale(1)';
      
      // Update hotspots and radar data points based on selected scan
      if (scanType === 'top') {
        // Shift hotspots to match top down view
        hotspots[0].style.top = '22%'; hotspots[0].style.left = '50%'; hotspots[0].setAttribute('data-lobe', 'Frontal Lobe (Top)');
        hotspots[1].style.top = '80%'; hotspots[1].style.left = '50%'; hotspots[1].setAttribute('data-lobe', 'Occipital Lobe (Top)');
        hotspots[2].style.top = '50%'; hotspots[2].style.left = '24%'; hotspots[2].setAttribute('data-lobe', 'Left Hemisphere');
        hotspots[3].style.top = '50%'; hotspots[3].style.left = '76%'; hotspots[3].setAttribute('data-lobe', 'Right Hemisphere');
        radarDataPolygon.setAttribute('points', "60,40 76,46 68,68 48,72 38,55");
      } else {
        // Side view hotspots
        hotspots[0].style.top = '30%'; hotspots[0].style.left = '60%'; hotspots[0].setAttribute('data-lobe', 'Frontal Lobe');
        hotspots[1].style.top = '52%'; hotspots[1].style.left = '25%'; hotspots[1].setAttribute('data-lobe', 'Occipital Lobe');
        hotspots[2].style.top = '72%'; hotspots[2].style.left = '35%'; hotspots[2].setAttribute('data-lobe', 'Cerebellum');
        hotspots[3].style.top = '55%'; hotspots[3].style.left = '48%'; hotspots[3].setAttribute('data-lobe', 'Temporal Lobe');
        radarDataPolygon.setAttribute('points', systemsData[activeSystem].radarPoints);
      }
      resetLobeDetails();
    }, 250);
  });
});

// Add more files modal trigger
addMoreThumbBtn.addEventListener('click', () => {
  uploadModal.classList.add('show');
});


/* ---------------- SEARCH & FILTER INTERFACES ---------------- */

// 1. Search Bar Input filter
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const docItems = document.querySelectorAll('.doctor-item');
  
  docItems.forEach(item => {
    const docName = item.getAttribute('data-name').toLowerCase();
    const docSpec = item.getAttribute('data-specialty').toLowerCase();
    const matchesSearch = docName.includes(query) || docSpec.includes(query);
    
    // Apply search filter
    if (matchesSearch) {
      // Respect the radio filter status too
      const status = item.getAttribute('data-status');
      if (doctorsFilterValue === 'all' || status === doctorsFilterValue) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    } else {
      item.style.display = 'none';
    }
  });
});

// 2. Dropdown Filter trigger & Selection
filterMenuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  filterDropdownMenu.classList.toggle('show');
});

// Close dropdown clicking outside
document.addEventListener('click', () => {
  filterDropdownMenu.classList.remove('show');
});

filterDropdownMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Filter selection logic
const filterRadios = document.querySelectorAll('input[name="doctor-filter"]');
filterRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    doctorsFilterValue = radio.value;
    filterDropdownMenu.classList.remove('show');
    
    // Apply filter
    const query = searchInput.value.toLowerCase();
    const docItems = document.querySelectorAll('.doctor-item');
    
    docItems.forEach(item => {
      const status = item.getAttribute('data-status');
      const docName = item.getAttribute('data-name').toLowerCase();
      const docSpec = item.getAttribute('data-specialty').toLowerCase();
      const matchesSearch = docName.includes(query) || docSpec.includes(query);
      
      const matchesStatus = doctorsFilterValue === 'all' || status === doctorsFilterValue;
      
      if (matchesSearch && matchesStatus) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
});


/* ---------------- MODALS & POPUPS EVENT HANDLERS ---------------- */

// 1. Doctor Booking Modal
function openBookingModal(docName, specialty) {
  bookingDocName.textContent = `Schedule with Dr. ${docName}`;
  bookingDocSpec.textContent = specialty.toUpperCase();
  
  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('booking-date').value = tomorrow.toISOString().split('T')[0];
  
  bookingModal.classList.add('show');
}

closeBookingBtn.addEventListener('click', () => {
  bookingModal.classList.remove('show');
});

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  bookingModal.classList.remove('show');
  
  const docName = bookingDocName.textContent.replace('Schedule with ', '');
  const chosenDate = document.getElementById('booking-date').value;
  const chosenTime = document.getElementById('booking-time').value;
  
  showToast(`Appointment booked successfully with ${docName} on ${chosenDate} at ${chosenTime}.`);
  bookingForm.reset();
});

// 2. Upload Modal
closeUploadBtn.addEventListener('click', () => {
  uploadModal.classList.remove('show');
});

uploadDropzone.addEventListener('click', () => {
  fileUploader.click();
});

// Drag and drop events
['dragenter', 'dragover'].forEach(eventName => {
  uploadDropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    uploadDropzone.classList.add('dragging');
  }, false);
});

['dragleave', 'drop'].forEach(eventName => {
  uploadDropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    uploadDropzone.classList.remove('dragging');
  }, false);
});

uploadDropzone.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length > 0) {
    handleUploadedFile(files[0]);
  }
});

fileUploader.addEventListener('change', () => {
  if (fileUploader.files.length > 0) {
    handleUploadedFile(fileUploader.files[0]);
  }
});

// Handle custom preset click inside upload modal
sampleChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const preset = chip.getAttribute('data-preset');
    uploadModal.classList.remove('show');
    
    // Add custom thumbnail to selector
    addNewScanThumbnail(
      preset === 'pet' ? 'assets/brain_top.png' : 'assets/brain_side.png', // Fallbacks
      preset === 'pet' ? 'PET Scan' : 'fMRI Active',
      preset === 'pet' ? 'top' : 'side'
    );
  });
});

function handleUploadedFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast("Unsupported file type. Please upload medical images only.");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    uploadModal.classList.remove('show');
    addNewScanThumbnail(reader.result, file.name.substring(0, 10), 'side');
  };
}

function addNewScanThumbnail(imageSrc, labelName, scanType) {
  const container = document.querySelector('.scan-thumbnails-container');
  const insertPos = document.getElementById('add-more-thumb-btn');
  
  const div = document.createElement('div');
  div.className = 'thumbnail-item';
  div.setAttribute('data-img', imageSrc);
  div.setAttribute('data-type', scanType);
  
  const img = document.createElement('img');
  img.src = imageSrc;
  img.alt = labelName;
  div.appendChild(img);

  // Dynamic swap logic for new thumbnail
  div.addEventListener('click', () => {
    if (isScanning) return;
    
    document.querySelectorAll('.thumbnail-item').forEach(t => t.classList.remove('active'));
    div.classList.add('active');

    mainScanImg.style.opacity = '0';
    mainScanImg.style.transform = 'scale(0.95)';

    setTimeout(() => {
      mainScanImg.src = imageSrc;
      mainScanImg.style.opacity = '1';
      mainScanImg.style.transform = 'scale(1)';
      
      // Update hotspots info
      if (scanType === 'top') {
        hotspots[0].style.top = '22%'; hotspots[0].style.left = '50%'; hotspots[0].setAttribute('data-lobe', 'Frontal Lobe (Top)');
        hotspots[1].style.top = '80%'; hotspots[1].style.left = '50%'; hotspots[1].setAttribute('data-lobe', 'Occipital Lobe (Top)');
        hotspots[2].style.top = '50%'; hotspots[2].style.left = '24%'; hotspots[2].setAttribute('data-lobe', 'Left Hemisphere');
        hotspots[3].style.top = '50%'; hotspots[3].style.left = '76%'; hotspots[3].setAttribute('data-lobe', 'Right Hemisphere');
      } else {
        hotspots[0].style.top = '30%'; hotspots[0].style.left = '60%'; hotspots[0].setAttribute('data-lobe', 'Frontal Lobe');
        hotspots[1].style.top = '52%'; hotspots[1].style.left = '25%'; hotspots[1].setAttribute('data-lobe', 'Occipital Lobe');
        hotspots[2].style.top = '72%'; hotspots[2].style.left = '35%'; hotspots[2].setAttribute('data-lobe', 'Cerebellum');
        hotspots[3].style.top = '55%'; hotspots[3].style.left = '48%'; hotspots[3].setAttribute('data-lobe', 'Temporal Lobe');
      }
      resetLobeDetails();
    }, 250);
  });

  container.insertBefore(div, insertPos);
  
  // Trigger click on newly added scan
  div.click();
  showToast(`Successfully loaded model scan: ${labelName}`);
}

/* ---------------- TOAST NOTIFICATIONS & EXPORTS ---------------- */
function showToast(message) {
  notificationToast.textContent = message;
  notificationToast.classList.add('show');
  
  setTimeout(() => {
    notificationToast.classList.remove('show');
  }, 4000);
}

saveFileBtn.addEventListener('click', () => {
  // Simulate saving a file
  showToast(`Neurological diagnosis report for ${systemsData[activeSystem].title} saved to system files successfully.`);
});

// Close modals on clicking overlay background
window.addEventListener('click', (e) => {
  if (e.target === bookingModal) {
    bookingModal.classList.remove('show');
  }
  if (e.target === uploadModal) {
    uploadModal.classList.remove('show');
  }
});

// Initialize with Nervous System Doctor List
populateDoctorsList(systemsData.nervous.doctors);
// Initialize counter to 93% on startup
setTimeout(() => {
  setAIProgress(93);
}, 500);
