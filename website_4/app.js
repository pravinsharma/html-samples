// State Management
const state = {
  nodes: [
    {
      id: 1,
      title: "User Initializing",
      desc: "Initializing for Automation",
      type: "user",
      x: 450,
      y: 150,
      width: 250,
      height: 70, // Approximated height
      metrics: null
    },
    {
      id: 2,
      title: "Data Collection",
      desc: "Gathering Data Connected",
      type: "data-coll",
      x: 120,
      y: 320,
      width: 250,
      height: 120,
      metrics: { box: 11, rocket: 27, check: 41, bolt: 72 }
    },
    {
      id: 3,
      title: "Trigger Automation",
      desc: "Workflows on Triggers",
      type: "data-coll",
      x: 780,
      y: 320,
      width: 250,
      height: 120,
      metrics: { box: 11, rocket: 27, check: 41, bolt: 72 }
    },
    {
      id: 4,
      title: "Data Validation",
      desc: "Ensuring Data Accuracy",
      type: "validation",
      x: 450,
      y: 490,
      width: 250,
      height: 120,
      metrics: { box: 91, error: 18, check: 20, bolt: 21 }
    },
    {
      id: 5,
      title: "Action Trigger",
      desc: "Performing Tasks Conditions",
      type: "action-trig",
      x: 450,
      y: 690,
      width: 250,
      height: 120,
      metrics: { box: 87, rocket: 34, error: 17, bolt: 18 }
    },
    {
      id: 6,
      title: "Output Generation",
      desc: "Compiling Delivering Outputs",
      type: "output",
      x: 450,
      y: 890,
      width: 250,
      height: 120,
      metrics: { rocket: 15, check: 55, greenCheck: 41, bolt: 69 }
    }
  ],
  connections: [
    { id: "c1", from: 1, to: 2, label: "Initialize Data", color: "blue" },
    { id: "c2", from: 1, to: 3, label: "Setup Automation", color: "green" },
    { id: "c3", from: 2, to: 3, label: "Execute Triggered", color: "orange" },
    { id: "c4", from: 2, to: 4, label: "Combine Results", color: "purple" },
    { id: "c5", from: 3, to: 4, label: "", color: "purple" }, // Joins the same path pill
    { id: "c6", from: 4, to: 5, label: "", color: "blue" },
    { id: "c7", from: 5, to: 6, label: "", color: "blue" }
  ],
  selectedNodeId: null,
  panX: 0,
  panY: 0,
  isPanning: false,
  isDraggingNode: false,
  draggedNodeId: null,
  dragOffset: { x: 0, y: 0 },
  isSimulating: false
};

// SVG Icon Definitions
const icons = {
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  'data-coll': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  validation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
  'action-trig': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  output: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`
};

// DOM Elements
const viewport = document.getElementById("canvas-viewport");
const canvasContent = document.getElementById("canvas-content");
const nodesContainer = document.getElementById("nodes-container");
const connectionsSvg = document.getElementById("connections-svg");
const inspector = document.getElementById("node-inspector");
const closeInspectorBtn = document.getElementById("close-inspector-btn");
const nodeEditorForm = document.getElementById("node-editor-form");
const deleteNodeBtn = document.getElementById("btn-delete-node");
const playBtn = document.getElementById("play-btn");
const statusIndicator = document.querySelector(".status-indicator");
const statusMessage = document.querySelector(".status-message");
const searchInput = document.getElementById("search-input");
const objectivesList = document.getElementById("objectives-list");
const createNodeModal = document.getElementById("create-node-modal");
const createNodeForm = document.getElementById("create-node-form");
const createModalClose = document.getElementById("create-modal-close");
const btnCancelCreate = document.getElementById("btn-cancel-create");

let doubleClickPos = { x: 0, y: 0 };

// Initialize Application
function init() {
  renderNodes();
  renderConnections();
  setupEventListeners();
  centerCanvas();
}

// Center the canvas on viewport load
function centerCanvas() {
  const vpWidth = viewport.clientWidth;
  const vpHeight = viewport.clientHeight;
  // Center roughly around x: 500, y: 400
  state.panX = Math.round((vpWidth - 1100) / 2);
  state.panY = 60;
  updateCanvasTransform();
}

function updateCanvasTransform() {
  canvasContent.style.transform = `translate(${state.panX}px, ${state.panY}px)`;
}

// Render all nodes
function renderNodes() {
  // Clear previous nodes (but keep SVGs/event elements if any, nodes-layer is fully cleared)
  nodesContainer.innerHTML = "";
  
  state.nodes.forEach(node => {
    const nodeEl = document.createElement("div");
    nodeEl.className = `flow-node ${node.type} ${state.selectedNodeId === node.id ? 'selected' : ''}`;
    nodeEl.style.left = `${node.x}px`;
    nodeEl.style.top = `${node.y}px`;
    nodeEl.dataset.id = node.id;

    // Header Content
    let headerHtml = `
      <div class="flow-node-header">
        <div class="node-icon-wrapper ${node.type}">
          ${icons[node.type] || icons.user}
        </div>
        <div class="node-title-area">
          <h4 class="node-title">${node.title}</h4>
          <p class="node-subtitle">${node.desc}</p>
        </div>
        <div class="node-drag-indicator">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
            <circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="19" r="1"></circle>
            <circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="19" r="1"></circle>
          </svg>
        </div>
      </div>
    `;

    // Metrics Row (if metrics exist)
    let metricsHtml = "";
    if (node.metrics) {
      metricsHtml = `<div class="node-stats-row">`;
      Object.entries(node.metrics).forEach(([key, val]) => {
        let badgeClass = "gray";
        let iconClass = "icon-box";
        
        if (key === "rocket") {
          iconClass = "icon-rocket";
        } else if (key === "check") {
          badgeClass = node.type === "validation" ? "gray" : "green";
          iconClass = "icon-check";
        } else if (key === "greenCheck") {
          badgeClass = "green";
          iconClass = "icon-check";
        } else if (key === "error") {
          badgeClass = "red";
          iconClass = "icon-close";
        } else if (key === "bolt") {
          badgeClass = "purple";
          iconClass = "icon-bolt";
        }
        
        metricsHtml += `
          <span class="stat-badge ${badgeClass}">
            <i class="badge-icon ${iconClass}"></i>
            <span class="stat-val" data-metric="${key}">${val}</span>
          </span>
        `;
      });
      metricsHtml += `</div>`;
    }

    nodeEl.innerHTML = headerHtml + metricsHtml;
    nodesContainer.appendChild(nodeEl);
  });
}

// Calculate the ports logic based on relative positions
function getPortCoordinates(fromNode, toNode) {
  const w = 250; // standard width
  // Compute approximate height from node layout or state
  const h = fromNode.metrics ? 120 : 70;
  const toH = toNode.metrics ? 120 : 70;

  // Let's determine coordinates
  let startX = fromNode.x + w / 2;
  let startY = fromNode.y + h;
  let endX = toNode.x + w / 2;
  let endY = toNode.y;

  // Specific custom positioning to perfectly match mockup flow
  if (fromNode.id === 1 && toNode.id === 2) {
    // User Initializing -> Data Collection
    startX = fromNode.x; // Left port
    startY = fromNode.y + h / 2;
    endX = toNode.x + w / 2; // Top port
    endY = toNode.y;
  } else if (fromNode.id === 1 && toNode.id === 3) {
    // User Initializing -> Trigger Automation
    startX = fromNode.x + w; // Right port
    startY = fromNode.y + h / 2;
    endX = toNode.x + w / 2; // Top port
    endY = toNode.y;
  } else if (fromNode.id === 2 && toNode.id === 3) {
    // Data Collection -> Trigger Automation
    startX = fromNode.x + w; // Right port
    startY = fromNode.y + h / 2;
    endX = toNode.x; // Left port
    endY = toNode.y + toH / 2;
  } else if (fromNode.id === 2 && toNode.id === 4) {
    // Data Collection -> Data Validation (goes down left-ish)
    startX = fromNode.x + w / 2;
    startY = fromNode.y + h;
    endX = toNode.x; // Left port
    endY = toNode.y + toH / 2;
  } else if (fromNode.id === 3 && toNode.id === 4) {
    // Trigger Automation -> Data Validation
    startX = fromNode.x + w / 2;
    startY = fromNode.y + h;
    endX = toNode.x + w; // Right port
    endY = toNode.y + toH / 2;
  } else {
    // Default flow: Bottom -> Top
    startX = fromNode.x + w / 2;
    startY = fromNode.y + h;
    endX = toNode.x + w / 2;
    endY = toNode.y;
  }

  return { startX, startY, endX, endY };
}

// Draw Bezier connections and position midpoint pills
function renderConnections() {
  // Remove existing path elements and pills
  document.querySelectorAll(".connection-path").forEach(el => el.remove());
  document.querySelectorAll(".pulse-path").forEach(el => el.remove());
  document.querySelectorAll(".path-pill").forEach(el => el.remove());

  state.connections.forEach(conn => {
    const fromNode = state.nodes.find(n => n.id === conn.from);
    const toNode = state.nodes.find(n => n.id === conn.to);

    if (!fromNode || !toNode) return;

    const { startX, startY, endX, endY } = getPortCoordinates(fromNode, toNode);

    // Calculate Bezier offset
    let offset = Math.max(Math.abs(endY - startY) / 2, 40);
    // Draw nice rounded corner routing or horizontal Bezier curves
    let pathD = `M ${startX} ${startY}`;

    // Standard smooth horizontal Bezier
    pathD += ` C ${startX} ${startY + offset}, ${endX} ${endY - offset}, ${endX} ${endY}`;
    
    // Create base path
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathD);
    path.setAttribute("class", `connection-path active`);
    path.setAttribute("id", `path-${conn.id}`);
    connectionsSvg.appendChild(path);

    // Create simulation pulse overlay path
    const pulsePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pulsePath.setAttribute("d", pathD);
    pulsePath.setAttribute("class", `pulse-path`);
    pulsePath.setAttribute("id", `pulse-${conn.id}`);
    pulsePath.style.setProperty("--pulse-color", getPillColorHex(conn.color));
    connectionsSvg.appendChild(pulsePath);

    // Midpoint pill placement
    if (conn.label) {
      // Cubic Bezier Midpoint (t=0.5) formula
      // P(0.5) = 0.125*P0 + 0.375*P1 + 0.375*P2 + 0.125*P3
      const cp1y = startY + offset;
      const cp2y = endY - offset;

      const midX = 0.125 * startX + 0.375 * startX + 0.375 * endX + 0.125 * endX;
      const midY = 0.125 * startY + 0.375 * cp1y + 0.375 * cp2y + 0.125 * endY;

      const pill = document.createElement("div");
      pill.className = `path-pill ${conn.color}`;
      pill.style.left = `${midX}px`;
      pill.style.top = `${midY}px`;
      pill.innerText = conn.label;
      pill.dataset.connId = conn.id;
      canvasContent.appendChild(pill);
    }
  });
}

function getPillColorHex(colorName) {
  switch (colorName) {
    case 'blue': return '#0ea5e9';
    case 'green': return '#10b981';
    case 'orange': return '#f59e0b';
    case 'purple': return '#8b5cf6';
    default: return '#3b82f6';
  }
}

// Setup Interaction Handlers
function setupEventListeners() {
  // Panning & Selecting Canvas Click
  viewport.addEventListener("mousedown", e => {
    // If clicking directly on viewport or canvas content, start panning
    if (e.target === viewport || e.target === canvasContent || e.target === connectionsSvg) {
      state.isPanning = true;
      viewport.style.cursor = "grabbing";
      closeInspector();
      deselectAllNodes();
    }
  });

  window.addEventListener("mousemove", e => {
    // Handle Canvas Panning
    if (state.isPanning) {
      state.panX += e.movementX;
      state.panY += e.movementY;
      updateCanvasTransform();
      return;
    }

    // Handle Node Dragging
    if (state.isDraggingNode && state.draggedNodeId !== null) {
      const node = state.nodes.find(n => n.id === state.draggedNodeId);
      if (node) {
        // Calculate raw coords on grid content
        const rect = canvasContent.getBoundingClientRect();
        // Mouse location inside canvasContent coordinates
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        node.x = Math.max(0, Math.round(mouseX - state.dragOffset.x));
        node.y = Math.max(0, Math.round(mouseY - state.dragOffset.y));

        // Update node position in DOM directly for ultimate performance
        const nodeEl = document.querySelector(`.flow-node[data-id="${node.id}"]`);
        if (nodeEl) {
          nodeEl.style.left = `${node.x}px`;
          nodeEl.style.top = `${node.y}px`;
        }

        renderConnections();
      }
    }
  });

  window.addEventListener("mouseup", () => {
    if (state.isPanning) {
      state.isPanning = false;
      viewport.style.cursor = "grab";
    }
    if (state.isDraggingNode) {
      state.isDraggingNode = false;
      state.draggedNodeId = null;
    }
  });

  // Mousedown on nodes layer (delegate to nodes)
  nodesContainer.addEventListener("mousedown", e => {
    const nodeEl = e.target.closest(".flow-node");
    if (!nodeEl) return;

    const id = parseInt(nodeEl.dataset.id);
    
    // Select Node
    selectNode(id);

    // Init Drag offset
    const node = state.nodes.find(n => n.id === id);
    const rect = nodeEl.getBoundingClientRect();
    const contentRect = canvasContent.getBoundingClientRect();
    
    state.isDraggingNode = true;
    state.draggedNodeId = id;
    state.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    e.stopPropagation();
  });

  // Double click canvas viewport to create node
  viewport.addEventListener("dblclick", e => {
    if (e.target === viewport || e.target === canvasContent || e.target === connectionsSvg) {
      const rect = canvasContent.getBoundingClientRect();
      doubleClickPos.x = Math.round(e.clientX - rect.left);
      doubleClickPos.y = Math.round(e.clientY - rect.top);
      
      openCreateNodeModal();
    }
  });

  // Inspector Close
  closeInspectorBtn.addEventListener("click", closeInspector);

  // Inspector Save
  nodeEditorForm.addEventListener("submit", e => {
    e.preventDefault();
    saveNodeProperties();
  });

  // Delete Node
  deleteNodeBtn.addEventListener("click", () => {
    deleteSelectedNode();
  });

  // Simulation Trigger
  playBtn.addEventListener("click", startWorkflowSimulation);

  // Search Input Behavior
  searchInput.addEventListener("input", e => {
    const query = e.target.value.toLowerCase().trim();
    filterSidebarObjectives(query);
    highlightNodesBySearch(query);
  });

  // Accordion Toggle
  document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", () => {
      header.parentElement.classList.toggle("collapsed");
    });
  });

  // Setup Drag-and-Drop Library sources
  const draggableCards = document.querySelectorAll(".objective-drag-card");
  draggableCards.forEach(card => {
    card.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", JSON.stringify({
        type: card.dataset.type,
        title: card.dataset.title,
        desc: card.dataset.desc
      }));
      card.style.opacity = "0.5";
    });

    card.addEventListener("dragend", () => {
      card.style.opacity = "1";
    });
  });

  // Dropzone on viewport
  viewport.addEventListener("dragover", e => {
    e.preventDefault(); // Required to allow drop
    viewport.classList.add("drag-over");
  });

  viewport.addEventListener("dragleave", () => {
    viewport.classList.remove("drag-over");
  });

  viewport.addEventListener("drop", e => {
    e.preventDefault();
    viewport.classList.remove("drag-over");

    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const rect = canvasContent.getBoundingClientRect();
      const dropX = Math.round(e.clientX - rect.left - 125); // center node
      const dropY = Math.round(e.clientY - rect.top - 50);

      createNewNodeFromLibrary(data, dropX, dropY);
    } catch (err) {
      console.error("Drop failed: ", err);
    }
  });

  // Modal Controls
  createModalClose.addEventListener("click", closeCreateNodeModal);
  btnCancelCreate.addEventListener("click", closeCreateNodeModal);
  createNodeForm.addEventListener("submit", e => {
    e.preventDefault();
    submitCreateNode();
  });

  // Dismiss Coverage Card
  document.querySelector(".card-dismiss").addEventListener("click", e => {
    e.target.closest(".coverage-card").style.display = "none";
  });
}

// Select Node Actions
function selectNode(id) {
  state.selectedNodeId = id;
  
  // Highlight node
  document.querySelectorAll(".flow-node").forEach(n => {
    if (parseInt(n.dataset.id) === id) {
      n.classList.add("selected");
    } else {
      n.classList.remove("selected");
    }
  });

  // Open inspector & fill details
  const node = state.nodes.find(n => n.id === id);
  if (node) {
    document.getElementById("edit-node-id").value = node.id;
    document.getElementById("edit-node-title").value = node.title;
    document.getElementById("edit-node-desc").value = node.desc;
    document.getElementById("edit-node-type").value = node.type;

    // Fill metrics forms
    if (node.metrics) {
      document.querySelector(".stats-editors").style.display = "flex";
      
      const stat1 = document.getElementById("edit-stat-1");
      const stat2 = document.getElementById("edit-stat-2");
      const stat3 = document.getElementById("edit-stat-3");
      const stat4 = document.getElementById("edit-stat-4");
      const stat3Label = document.getElementById("edit-stat-3-label");

      // Reset values
      stat1.value = node.metrics.box || node.metrics.rocket || 0;
      stat2.value = node.metrics.rocket || node.metrics.error || 0;
      stat3.value = node.metrics.check || node.metrics.greenCheck || 0;
      stat4.value = node.metrics.bolt || 0;

      // Handle custom tags for validation nodes which have 'error' metric instead of rocket
      if (node.type === "validation" || node.type === "action-trig") {
        stat3Label.innerHTML = `<i class="badge-icon icon-close"></i> Error`;
        stat3.value = node.metrics.error || 0;
        stat2.value = node.metrics.rocket || 0;
      } else {
        stat3Label.innerHTML = `<i class="badge-icon icon-check"></i> Success`;
        stat3.value = node.metrics.check || node.metrics.greenCheck || 0;
      }
    } else {
      document.querySelector(".stats-editors").style.display = "none";
    }

    inspector.classList.remove("collapsed");
  }
}

function deselectAllNodes() {
  state.selectedNodeId = null;
  document.querySelectorAll(".flow-node").forEach(n => n.classList.remove("selected"));
}

function closeInspector() {
  inspector.classList.add("collapsed");
}

// Update Node Properties
function saveNodeProperties() {
  const id = parseInt(document.getElementById("edit-node-id").value);
  const nodeIndex = state.nodes.findIndex(n => n.id === id);

  if (nodeIndex !== -1) {
    const node = state.nodes[nodeIndex];
    node.title = document.getElementById("edit-node-title").value;
    node.desc = document.getElementById("edit-node-desc").value;
    node.type = document.getElementById("edit-node-type").value;

    if (node.metrics) {
      if (node.type === "validation" || node.type === "action-trig") {
        node.metrics.box = parseInt(document.getElementById("edit-stat-1").value) || 0;
        node.metrics.rocket = parseInt(document.getElementById("edit-stat-2").value) || 0;
        node.metrics.error = parseInt(document.getElementById("edit-stat-3").value) || 0;
        node.metrics.bolt = parseInt(document.getElementById("edit-stat-4").value) || 0;
      } else {
        node.metrics.box = parseInt(document.getElementById("edit-stat-1").value) || 0;
        node.metrics.rocket = parseInt(document.getElementById("edit-stat-2").value) || 0;
        if (node.metrics.greenCheck !== undefined) {
          node.metrics.greenCheck = parseInt(document.getElementById("edit-stat-3").value) || 0;
        } else {
          node.metrics.check = parseInt(document.getElementById("edit-stat-3").value) || 0;
        }
        node.metrics.bolt = parseInt(document.getElementById("edit-stat-4").value) || 0;
      }
    }

    renderNodes();
    renderConnections();
    closeInspector();
    
    // Add small notification status
    triggerTemporaryStatus("success", `Updated properties of node "${node.title}"`);
  }
}

// Delete Selected Node
function deleteSelectedNode() {
  const id = parseInt(document.getElementById("edit-node-id").value);
  if (!id) return;

  // Filter out node
  state.nodes = state.nodes.filter(n => n.id !== id);
  // Filter out connections connected to node
  state.connections = state.connections.filter(c => c.from !== id && c.to !== id);

  renderNodes();
  renderConnections();
  closeInspector();
  triggerTemporaryStatus("ready", `Node deleted successfully.`);
}

// Create new node from Library Drag & Drop
function createNewNodeFromLibrary(data, x, y) {
  const newId = state.nodes.length > 0 ? Math.max(...state.nodes.map(n => n.id)) + 1 : 1;

  // Determine standard starting stats for objectives templates
  let metrics = null;
  if (data.type === "output") {
    metrics = { rocket: 15, check: 55, greenCheck: 41, bolt: 69 };
  } else if (data.type === "lorem") {
    metrics = { box: 11, rocket: 27, check: 41, bolt: 72 };
  } else if (data.type === "trigger") {
    metrics = { box: 87, rocket: 34, error: 17, bolt: 18 };
  } else if (data.type === "validation") {
    metrics = { box: 91, error: 18, check: 20, bolt: 21 };
  }

  const newNode = {
    id: newId,
    title: data.title,
    desc: data.desc,
    type: data.type === "lorem" ? "data-coll" : (data.type === "trigger" ? "action-trig" : data.type),
    x: x,
    y: y,
    metrics: metrics
  };

  state.nodes.push(newNode);
  renderNodes();
  renderConnections();

  // Try to find auto-connection (connect closest node)
  autoConnectClosestNode(newNode);
  triggerTemporaryStatus("success", `Added custom node "${newNode.title}" via drag-and-drop.`);
}

// Simple Auto-Connection heuristic to keep graphs clean
function autoConnectClosestNode(newNode) {
  if (state.nodes.length <= 1) return;

  let bestNode = null;
  let minDistance = Infinity;

  // Find node directly above within reasonable bounds
  state.nodes.forEach(node => {
    if (node.id === newNode.id) return;
    
    // We want to connect from nodes that are physically above the new node
    if (node.y < newNode.y) {
      const dist = Math.hypot(newNode.x - node.x, newNode.y - node.y);
      if (dist < minDistance) {
        minDistance = dist;
        bestNode = node;
      }
    }
  });

  if (bestNode && minDistance < 400) {
    const newConnId = `c_${bestNode.id}_${newNode.id}`;
    state.connections.push({
      id: newConnId,
      from: bestNode.id,
      to: newNode.id,
      label: "",
      color: "blue"
    });
    renderConnections();
  }
}

// Modal Form create Custom Node
function openCreateNodeModal() {
  createNodeModal.classList.add("active");
  document.getElementById("create-node-title").focus();
}

function closeCreateNodeModal() {
  createNodeModal.classList.remove("active");
  createNodeForm.reset();
}

function submitCreateNode() {
  const title = document.getElementById("create-node-title").value;
  const desc = document.getElementById("create-node-desc").value;
  const iconType = document.getElementById("create-node-icon").value;

  const newId = state.nodes.length > 0 ? Math.max(...state.nodes.map(n => n.id)) + 1 : 1;

  // Basic default stats
  const metrics = { box: 10, rocket: 5, check: 10, bolt: 10 };

  const newNode = {
    id: newId,
    title: title,
    desc: desc,
    type: iconType,
    x: doubleClickPos.x - 125, // center on double click pos
    y: doubleClickPos.y - 45,
    metrics: metrics
  };

  state.nodes.push(newNode);
  renderNodes();
  renderConnections();
  autoConnectClosestNode(newNode);

  closeCreateNodeModal();
  triggerTemporaryStatus("success", `Created custom node "${title}" at click point.`);
}

// Sidebar Search List filter
function filterSidebarObjectives(query) {
  const cards = objectivesList.querySelectorAll(".objective-drag-card");
  cards.forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const desc = card.dataset.desc.toLowerCase();
    if (title.includes(query) || desc.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Search matches highlighting nodes
function highlightNodesBySearch(query) {
  document.querySelectorAll(".flow-node").forEach(nodeEl => {
    if (!query) {
      nodeEl.classList.remove("search-highlight");
      return;
    }

    const title = nodeEl.querySelector(".node-title").innerText.toLowerCase();
    const desc = nodeEl.querySelector(".node-subtitle").innerText.toLowerCase();
    
    if (title.includes(query) || desc.includes(query)) {
      nodeEl.classList.add("search-highlight");
    } else {
      nodeEl.classList.remove("search-highlight");
    }
  });
}

// Temporary Status Messages
function triggerTemporaryStatus(type, msg) {
  statusIndicator.className = `status-indicator ${type}`;
  statusMessage.innerText = msg;

  if (type === "success") {
    setTimeout(() => {
      if (!state.isSimulating) {
        statusIndicator.className = "status-indicator ready";
        statusMessage.innerText = "System Idle. Click 'Run' to simulate flow. Double-click canvas to create a custom node.";
      }
    }, 4000);
  }
}

// SIMULATION ENGINE
function startWorkflowSimulation() {
  if (state.isSimulating) return;

  state.isSimulating = true;
  playBtn.classList.add("running");
  statusIndicator.className = "status-indicator running";
  statusMessage.innerText = "Executing live automation pipeline...";
  deselectAllNodes();
  closeInspector();

  // Reset all active classes on elements
  document.querySelectorAll(".flow-node").forEach(n => n.classList.remove("sim-active"));
  document.querySelectorAll(".pulse-path").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".path-pill").forEach(p => p.classList.remove("sim-active"));

  // Build sequential workflow path
  // Step 1: Trigger User Initializing
  setTimeout(() => highlightSimNode(1), 0);

  // Step 2: Send pulses through c1 & c2
  setTimeout(() => {
    triggerSimPulse("c1");
    triggerSimPulse("c2");
    highlightSimPill("c1");
    highlightSimPill("c2");
  }, 1000);

  // Step 3: Activate Data Collection (2) and Trigger Automation (3)
  setTimeout(() => {
    highlightSimNode(2);
    highlightSimNode(3);
    fluctuateNodeMetrics(2);
    fluctuateNodeMetrics(3);
  }, 2200);

  // Step 4: Data Collection triggers Execute Automation (c3)
  setTimeout(() => {
    triggerSimPulse("c3");
    highlightSimPill("c3");
  }, 3200);

  // Step 5: Send Combine Results paths (c4, c5)
  setTimeout(() => {
    triggerSimPulse("c4");
    triggerSimPulse("c5");
    highlightSimPill("c4");
  }, 4400);

  // Step 6: Data Validation (4)
  setTimeout(() => {
    highlightSimNode(4);
    fluctuateNodeMetrics(4);
  }, 5600);

  // Step 7: Send path (c6)
  setTimeout(() => {
    triggerSimPulse("c6");
  }, 6800);

  // Step 8: Action Trigger (5)
  setTimeout(() => {
    highlightSimNode(5);
    fluctuateNodeMetrics(5);
  }, 7800);

  // Step 9: Send output (c7)
  setTimeout(() => {
    triggerSimPulse("c7");
  }, 8800);

  // Step 10: Output Generation (6)
  setTimeout(() => {
    highlightSimNode(6);
    fluctuateNodeMetrics(6);
    updateWorkflowSidebarStats();
  }, 9800);

  // Clean up
  setTimeout(() => {
    state.isSimulating = false;
    playBtn.classList.remove("running");
    statusIndicator.className = "status-indicator ready";
    statusMessage.innerText = "Simulation completed successfully. Pipeline idle.";
    
    // Clear styles
    document.querySelectorAll(".flow-node").forEach(n => n.classList.remove("sim-active"));
    document.querySelectorAll(".pulse-path").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".path-pill").forEach(p => p.classList.remove("sim-active"));
  }, 11500);
}

// Simulation helpers
function highlightSimNode(id) {
  const nodeEl = document.querySelector(`.flow-node[data-id="${id}"]`);
  if (nodeEl) {
    nodeEl.classList.add("sim-active");
    // Play subtle sound or pulse effect
  }
}

function triggerSimPulse(connId) {
  const pulseEl = document.getElementById(`pulse-${connId}`);
  if (pulseEl) {
    pulseEl.classList.add("active");
  }
}

function highlightSimPill(connId) {
  const pillEl = document.querySelector(`.path-pill[data-conn-id="${connId}"]`);
  if (pillEl) {
    pillEl.classList.add("sim-active");
  }
}

function fluctuateNodeMetrics(nodeId) {
  const node = state.nodes.find(n => n.id === nodeId);
  if (!node || !node.metrics) return;

  // Increment some counters to simulate processing
  const nodeEl = document.querySelector(`.flow-node[data-id="${nodeId}"]`);
  if (!nodeEl) return;

  Object.keys(node.metrics).forEach(key => {
    // increment by a small random offset
    const inc = Math.floor(Math.random() * 3) + 1;
    node.metrics[key] += inc;

    // update DOM
    const valSpan = nodeEl.querySelector(`.stat-val[data-metric="${key}"]`);
    if (valSpan) {
      valSpan.innerText = node.metrics[key];
      valSpan.style.transform = "scale(1.3)";
      valSpan.style.transition = "transform 0.15s";
      setTimeout(() => {
        valSpan.style.transform = "scale(1)";
      }, 200);
    }
  });
}

function updateWorkflowSidebarStats() {
  // Update segment bars and status numbers in sidebar to reflect successful run
  const wfA = document.getElementById("wf-a");
  const wfB = document.getElementById("wf-b");

  if (wfA) {
    const taskVal = wfA.querySelector(".tag-badge.red .val");
    const doneVal = wfA.querySelector(".tag-badge.green .val");
    taskVal.innerText = parseInt(taskVal.innerText) + 3;
    doneVal.innerText = parseInt(doneVal.innerText) + 5;
  }

  if (wfB) {
    const execVal = wfB.querySelector(".tag-badge.blue .val");
    const doneVal = wfB.querySelector(".tag-badge.green .val");
    execVal.innerText = parseInt(execVal.innerText) + 4;
    doneVal.innerText = parseInt(doneVal.innerText) + 7;
  }

  // Update coverage animation slightly
  const coverageFill = document.querySelector(".progress-bar-fill");
  const highlightSpan = document.querySelector(".coverage-card .highlight");
  if (coverageFill) {
    coverageFill.style.width = "78%";
    if (highlightSpan) highlightSpan.innerText = "78%";
  }
}

// Trigger initial setup
window.onload = init;
