// Initialize Lucide icons on load
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Initialize Chart
  renderPixelChart('monthly');
  
  // Render Mock Data Tables
  renderDashboardData();
  renderProductsTable();
  renderCustomersTable();
  renderTransactionsTable();
});

// Mock Database
const db = {
  products: [
    { id: 1, name: 'SaaS Platform Template', category: 'Design', price: 89.00, stock: 42, status: 'active', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100' },
    { id: 2, name: 'SEO Auditing Checklist', category: 'Marketing', price: 29.00, stock: 150, status: 'active', image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=100' },
    { id: 3, name: 'Figma Component Library', category: 'Design', price: 149.00, stock: 0, status: 'out', image: 'https://images.unsplash.com/photo-1581291518655-9523c932eecf?auto=format&fit=crop&q=80&w=100' },
    { id: 4, name: 'NextJS Boilerplate Pack', category: 'Development', price: 199.00, stock: 24, status: 'active', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=100' },
    { id: 5, name: 'Copywriting Playbook', category: 'Marketing', price: 49.00, stock: 85, status: 'draft', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=100' },
  ],
  customers: [
    { id: 101, name: 'Alexander Wright', email: 'alex@wright.design', joined: '2025-10-12', spend: 320.00, status: 'active' },
    { id: 102, name: 'Clara Oswald', email: 'clara@tardis.org', joined: '2025-11-01', spend: 149.00, status: 'active' },
    { id: 103, name: 'Marcus Aurelius', email: 'marcus@rome.gov', joined: '2025-11-15', spend: 890.00, status: 'active' },
    { id: 104, name: 'Sarah Connor', email: 'sconnor@cyberdyne.co', joined: '2025-12-05', spend: 29.00, status: 'inactive' },
    { id: 105, name: 'Arthur Dent', email: 'arthur@guide.galaxy', joined: '2026-01-20', spend: 199.00, status: 'active' },
  ],
  transactions: [
    { id: 'TX-9082', customer: 'Marcus Aurelius', category: 'Design', amount: 149.00, status: 'success', date: 'May 18, 2026' },
    { id: 'TX-9081', customer: 'Clara Oswald', category: 'Marketing', amount: 29.00, status: 'success', date: 'May 17, 2026' },
    { id: 'TX-9080', customer: 'Alexander Wright', category: 'Design', amount: 89.00, status: 'success', date: 'May 16, 2026' },
    { id: 'TX-9079', customer: 'Arthur Dent', category: 'Development', amount: 199.00, status: 'pending', date: 'May 15, 2026' },
    { id: 'TX-9078', customer: 'Sarah Connor', category: 'Marketing', amount: 49.00, status: 'failed', date: 'May 10, 2026' },
  ],
  performers: [
    { name: 'Pravin Sharma', role: 'Lead Developer', score: '98%', status: 'Active Now', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
    { name: 'Diana Prince', role: 'UI/UX Designer', score: '95%', status: '2h ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    { name: 'Bruce Wayne', role: 'Product Manager', score: '92%', status: 'Yesterday', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  ]
};

// Pixel Chart Datasets (30 Blocks total vertical height, 2k per block)
const chartDataSets = {
  weekly: [
    { label: 'W1', existing: 4, new: 7 },
    { label: 'W2', existing: 6, new: 8 },
    { label: 'W3', existing: 5, new: 10 },
    { label: 'W4', existing: 7, new: 12 },
    { label: 'W5', existing: 9, new: 14 },
    { label: 'W6', existing: 10, new: 15 },
    { label: 'W7', existing: 8, new: 11 },
    { label: 'W8', existing: 6, new: 9 }
  ],
  monthly: [
    { label: 'Jan', existing: 4, new: 3 },
    { label: 'Feb', existing: 6, new: 5 },
    { label: 'Mar', existing: 3, new: 4 },
    { label: 'Apr', existing: 4, new: 6 },
    { label: 'May', existing: 2, new: 8 },
    { label: 'Jun', existing: 9, new: 19 }, // Jun 2025: Existing 18k (9 * 2k), New 38k (19 * 2k)
    { label: 'Jul', existing: 5, new: 6 },
    { label: 'Aug', existing: 4, new: 5 },
    { label: 'Sep', existing: 5, new: 6 },
    { label: 'Oct', existing: 6, new: 4 },
    { label: 'Nov', existing: 3, new: 5 },
    { label: 'Dec', existing: 7, new: 4 }
  ],
  yearly: [
    { label: '2021', existing: 10, new: 8 },
    { label: '2022', existing: 12, new: 11 },
    { label: '2023', existing: 15, new: 12 },
    { label: '2024', existing: 14, new: 13 },
    { label: '2025', existing: 18, new: 10 },
    { label: '2026', existing: 16, new: 12 }
  ]
};

// Render Pixel Chart
function renderPixelChart(period) {
  const container = document.getElementById('chartColumns');
  const xAxis = document.getElementById('chartXAxis');
  const tooltip = document.getElementById('chartTooltip');
  
  if (!container || !xAxis) return;
  
  container.innerHTML = '';
  xAxis.innerHTML = '';
  
  const data = chartDataSets[period];
  const maxBlocks = 30;
  
  // Calculate relative column widths
  const colWidth = 100 / data.length;

  data.forEach((item, index) => {
    // Create column wrapper
    const colWrapper = document.createElement('div');
    colWrapper.className = 'chart-column-wrapper';
    colWrapper.style.width = `${colWidth - 2}%`; // subtract margin
    
    // Default Jun 2025 highlight
    if (period === 'monthly' && item.label === 'Jun') {
      colWrapper.classList.add('active');
    }
    
    // Create stack container
    const stack = document.createElement('div');
    stack.className = 'chart-column-pixel-stack';
    
    const existingCount = item.existing;
    const newCount = item.new;
    const emptyCount = maxBlocks - existingCount - newCount;
    
    // Append existing blocks (bottom)
    for (let i = 0; i < existingCount; i++) {
      const block = document.createElement('div');
      block.className = 'pixel-block existing';
      stack.appendChild(block);
    }
    
    // Append new blocks (middle)
    for (let i = 0; i < newCount; i++) {
      const block = document.createElement('div');
      block.className = 'pixel-block new';
      stack.appendChild(block);
    }
    
    // Append empty blocks (top)
    for (let i = 0; i < emptyCount; i++) {
      const block = document.createElement('div');
      block.className = 'pixel-block empty';
      stack.appendChild(block);
    }
    
    colWrapper.appendChild(stack);
    container.appendChild(colWrapper);
    
    // Create X label
    const xLabel = document.createElement('div');
    xLabel.className = 'chart-x-label';
    xLabel.style.width = `${colWidth}%`;
    xLabel.textContent = item.label;
    xAxis.appendChild(xLabel);
    
    // Setup Hover Events
    colWrapper.addEventListener('mouseenter', (e) => {
      // Clear other active highlights
      document.querySelectorAll('.chart-column-wrapper').forEach(w => w.classList.remove('active'));
      colWrapper.classList.add('active');
      
      const rect = colWrapper.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      
      // Calculate tooltip position
      const leftPos = rect.left - parentRect.left + (rect.width / 2);
      // Tooltip is placed near the top of the stack height
      const filledBlocksHeight = (existingCount + newCount) * 8; // 8px approx height per block + gap
      const topPos = parentRect.height - filledBlocksHeight - 20;
      
      // Update Tooltip values
      const labelSuffix = period === 'monthly' ? ' 2025' : '';
      document.getElementById('tooltipHeader').textContent = `${item.label}${labelSuffix}`;
      document.getElementById('tooltipNewVal').textContent = `${newCount * 2}k`;
      document.getElementById('tooltipExistingVal').textContent = `${existingCount * 2}k`;
      
      tooltip.style.left = `${leftPos}px`;
      tooltip.style.top = `${topPos}px`;
      tooltip.classList.add('visible');
    });
    
    colWrapper.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
      // If leaving, we can restore the Jun 2025 active highlight if monthly
      if (period === 'monthly') {
        const junCol = container.children[5]; // Jun is index 5
        if (junCol) junCol.classList.add('active');
      }
    });
  });
}

// Chart Filter Tabs Click Handler
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
    pill.classList.add('active');
    
    const period = pill.getAttribute('data-period');
    renderPixelChart(period);
  });
});

// Sidebar Navigation Tab Manager
const menuItems = document.querySelectorAll('.menu-item');
const pageViews = document.querySelectorAll('.page-view');
const breadcrumbCurrent = document.getElementById('currentBreadcrumb');

menuItems.forEach(item => {
  item.addEventListener('click', (e) => {
    // Prevent normal anchor link jump but update hash
    const tabName = item.getAttribute('data-tab');
    if (!tabName) return;
    
    // Update active menu link
    menuItems.forEach(mi => mi.classList.remove('active'));
    item.classList.add('active');
    
    // Switch views
    pageViews.forEach(pv => pv.classList.remove('active'));
    const activeView = document.getElementById(`${tabName}-view`);
    if (activeView) {
      activeView.classList.add('active');
    }
    
    // Update Breadcrumbs
    const parentTitle = item.closest('.menu-group')?.querySelector('.menu-group-title')?.textContent || 'Dashboard';
    const cleanParent = parentTitle.charAt(0) + parentTitle.slice(1).toLowerCase();
    document.querySelector('.breadcrumb-parent').textContent = cleanParent;
    breadcrumbCurrent.textContent = item.textContent.trim();
    
    // Close sidebar on mobile after clicking
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
    }
  });
});

// Mobile Sidebar Toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
  
  // Close sidebar on clicking outside it
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
    }
  });
}

// Render Dashboard Small Widget Lists
function renderDashboardData() {
  // Recent Transactions
  const tbody = document.getElementById('dashboardTransactionsTable');
  if (tbody) {
    tbody.innerHTML = '';
    // Show top 3 transactions
    db.transactions.slice(0, 3).forEach(tx => {
      const tr = document.createElement('tr');
      
      const statusBadge = tx.status === 'success' ? '<span class="badge success">Success</span>' : 
                          tx.status === 'pending' ? '<span class="badge warning">Pending</span>' :
                          '<span class="badge danger">Failed</span>';
                          
      tr.innerHTML = `
        <td><strong>${tx.customer}</strong></td>
        <td>${tx.category}</td>
        <td><strong>$${tx.amount.toFixed(2)}</strong></td>
        <td>${statusBadge}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  // Team Performance
  const teamList = document.getElementById('teamPerformanceList');
  if (teamList) {
    teamList.innerHTML = '';
    db.performers.forEach(p => {
      const item = document.createElement('div');
      item.className = 'performer-item';
      item.innerHTML = `
        <div class="performer-profile">
          <img src="${p.avatar}" alt="${p.name}" class="performer-avatar">
          <div>
            <div class="performer-name">${p.name}</div>
            <div class="performer-role">${p.role}</div>
          </div>
        </div>
        <div class="performer-stat">
          <div class="performer-stat-value">${p.score}</div>
          <div class="performer-stat-label">${p.status}</div>
        </div>
      `;
      teamList.appendChild(item);
    });
  }
}

// Render Products Table
function renderProductsTable() {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  db.products.forEach(p => {
    const statusBadge = p.status === 'active' ? '<span class="badge success">Active</span>' : 
                        p.status === 'draft' ? '<span class="badge info">Draft</span>' :
                        '<span class="badge danger">Out of Stock</span>';
                        
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="product-row-info">
          <img src="${p.image}" alt="${p.name}" class="product-thumbnail">
          <div class="product-name-block">
            <span class="product-name-title">${p.name}</span>
            <span class="product-category-subtitle">ID: PROD-00${p.id}</span>
          </div>
        </div>
      </td>
      <td>${p.category}</td>
      <td><strong>$${p.price.toFixed(2)}</strong></td>
      <td>${p.stock} pcs</td>
      <td>${statusBadge}</td>
      <td style="text-align: right;">
        <button class="nav-button delete-prod-btn" data-id="${p.id}" title="Delete Product" style="display:inline-flex;">
          <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  // Re-create icons for new elements
  if (window.lucide) window.lucide.createIcons();
  
  // Attach Delete Events
  document.querySelectorAll('.delete-prod-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.getAttribute('data-id'));
      deleteProduct(id);
    });
  });
}

// Delete Product Function
function deleteProduct(id) {
  const index = db.products.findIndex(p => p.id === id);
  if (index !== -1) {
    const name = db.products[index].name;
    db.products.splice(index, 1);
    renderProductsTable();
    showToast(`Product "${name}" deleted successfully.`);
  }
}

// Render Customers Table
function renderCustomersTable() {
  const tbody = document.getElementById('customersTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  db.customers.forEach(c => {
    const statusBadge = c.status === 'active' ? '<span class="badge success">Active</span>' : '<span class="badge danger">Inactive</span>';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.joined}</td>
      <td><strong>$${c.spend.toFixed(2)}</strong></td>
      <td>${statusBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Transactions Table (Full list)
function renderTransactionsTable() {
  const tbody = document.getElementById('allTransactionsTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  db.transactions.forEach(tx => {
    const statusBadge = tx.status === 'success' ? '<span class="badge success">Success</span>' : 
                        tx.status === 'pending' ? '<span class="badge warning">Pending</span>' :
                        '<span class="badge danger">Failed</span>';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${tx.id}</strong></td>
      <td><strong>${tx.customer}</strong></td>
      <td>${tx.category}</td>
      <td>${tx.date}</td>
      <td><strong>$${tx.amount.toFixed(2)}</strong></td>
      <td>${statusBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Toast Notifications System
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i data-lucide="check-circle" style="color: #4CAF50; width: 16px; height: 16px;"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  
  if (window.lucide) window.lucide.createIcons();
  
  // Slide out after 3 seconds, then delete
  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
}

// Modal Form Controllers (Add Product)
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const addProductForm = document.getElementById('addProductForm');

if (productModal) {
  const openModal = () => productModal.classList.add('active');
  const closeModal = () => {
    productModal.classList.remove('active');
    addProductForm.reset();
  };
  
  if (addProductBtn) addProductBtn.addEventListener('click', openModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
  
  // Form submission
  addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('newProdName').value;
    const category = document.getElementById('newProdCategory').value;
    const price = parseFloat(document.getElementById('newProdPrice').value);
    const stock = parseInt(document.getElementById('newProdStock').value);
    
    const newProduct = {
      id: db.products.length + 1,
      name,
      category,
      price,
      stock,
      status: stock > 0 ? 'active' : 'out',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100' // mock image
    };
    
    db.products.push(newProduct);
    renderProductsTable();
    closeModal();
    showToast(`Product "${name}" added successfully.`);
  });
}

// Settings form submission
const settingsForm = document.getElementById('settingsForm');
if (settingsForm) {
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('setFirstName').value;
    const lastName = document.getElementById('setLastName').value;
    const agencyName = document.getElementById('setAgencyName').value;
    
    // Update agency dropdown text in UI
    const nameSpan = document.querySelector('.agency-name');
    if (nameSpan) {
      nameSpan.textContent = agencyName;
    }
    
    // Update welcome header
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle) {
      welcomeTitle.textContent = `Welcome back, ${firstName}`;
    }
    
    showToast('Profile settings saved successfully.');
  });
}

// Dropdowns and UI Toggles
const agencyDropdown = document.getElementById('agencyDropdown');
if (agencyDropdown) {
  agencyDropdown.addEventListener('click', () => {
    showToast('Dropdown menu options will be loaded shortly.');
  });
}

// Route direct clicks from dashboard view links to matching tabs
const viewAllTransactionsBtn = document.getElementById('viewAllTransactionsBtn');
if (viewAllTransactionsBtn) {
  viewAllTransactionsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const transactionsMenu = document.querySelector('.menu-item[data-tab="transactions"]');
    if (transactionsMenu) transactionsMenu.click();
  });
}

// Global search handling
const globalSearch = document.getElementById('globalSearch');
if (globalSearch) {
  globalSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    // Filter products if products tab active
    const productsView = document.getElementById('products-view');
    if (productsView.classList.contains('active')) {
      const rows = document.querySelectorAll('#productsTableBody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    }
    
    // Filter customers if customers tab active
    const customersView = document.getElementById('customers-view');
    if (customersView.classList.contains('active')) {
      const rows = document.querySelectorAll('#customersTableBody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    }
    
    // Filter transactions if transactions tab active
    const transactionsView = document.getElementById('transactions-view');
    if (transactionsView.classList.contains('active')) {
      const rows = document.querySelectorAll('#allTransactionsTableBody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    }
  });
}
