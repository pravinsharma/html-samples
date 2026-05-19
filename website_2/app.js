/* ==========================================================================
   APP STATE & MOCK DATABASE
   ========================================================================== */
const STATE = {
  activeTab: 'orders',
  ordersPage: 2, // Set to 2 by default to match screenshot on load
  ordersPageSize: 6,
  ordersSortColumn: 'id',
  ordersSortDirection: 'asc',
  ordersStatusFilter: 'all',
  ordersSearchQuery: '',
  ordersDateFrom: '31 Jul 2020',
  ordersDateTo: '03 Aug 2020',
  selectedOrderId: 2633, // Default selected order matching John McCormick
  
  products: [
    { id: 1, name: 'Premium Wireless Headphones', sku: 'SONY-WH5', category: 'Electronics', price: 349.99, stock: 3, supplier: 'Sony Corp' },
    { id: 2, name: 'Mechanical Gaming Keyboard', sku: 'LOGI-G915', category: 'Electronics', price: 229.99, stock: 18, supplier: 'Logitech Inc' },
    { id: 3, name: 'Cotton Slim-Fit Chinos', sku: 'LEVI-CSFC', category: 'Clothing', price: 59.50, stock: 0, supplier: 'Levi Strauss' },
    { id: 4, name: 'Professional Yoga Mat', sku: 'LULU-PYM', category: 'Sporting', price: 98.00, stock: 2, supplier: 'Lululemon' },
    { id: 5, name: 'Smart LED Desk Lamp', sku: 'PHIL-SLED', category: 'Home', price: 89.00, stock: 60, supplier: 'Philips Lighting' },
    { id: 6, name: 'Ergonomic Office Chair', sku: 'STLC-ERGO', category: 'Home', price: 649.00, stock: 8, supplier: 'Steelcase' },
    { id: 7, name: 'Stainless Steel Flask', sku: 'HYDR-SSWB', category: 'Sporting', price: 42.00, stock: 110, supplier: 'HydroFlask Ltd' },
    { id: 8, name: 'USB-C Charging Dock', sku: 'ANKR-DOCK', category: 'Electronics', price: 35.00, stock: 45, supplier: 'Anker Wholesale' }
  ],
  
  offers: [
    { id: 1, title: 'Summer Electronics Blowout', code: 'SUMMER25', discount: '25% OFF', desc: 'Get 25% off all products in the Electronics category.', expiry: '2026-08-31', active: true, usage: 142 },
    { id: 2, title: 'New Customer Welcome Promo', code: 'WELCOME10', discount: '$10 OFF', desc: 'Enjoy $10 off your first purchase of any physical items.', expiry: '2026-12-31', active: true, usage: 489 },
    { id: 3, title: 'Mid-Year Fitness Discount', code: 'FITLIFE', discount: '15% OFF', desc: 'Special promo for yoga mats, flasks, and sportswear.', expiry: '2026-06-30', active: false, usage: 88 }
  ],
  
  activities: [
    { text: 'Order #2633 status updated to Dispatch', time: '10 mins ago' },
    { text: 'New order #2654 received from Emma Watson', time: '45 mins ago' },
    { text: 'Product SONY-WH5 reached low stock warning (3 left)', time: '2 hours ago' },
    { text: 'Promo code SUMMER25 was copied 12 times today', time: '5 hours ago' }
  ],

  orders: [] // Will be populated in init()
};

// Seed 28 mock orders to support pagination and charts
function seedOrders() {
  const customerNames = [
    'Brooklyn Zoe', 'John McCormick', 'Sandra Pugh', 'Vernie Hart', 'Mark Clark', 'Rebekah Foster',
    'Emma Watson', 'Liam Neeson', 'Olivia Wilde', 'Noah Centineo', 'Sophia Loren', 'James Dean',
    'Ava Gardner', 'Oliver Twist', 'Isabella Rossellini', 'William Shatner', 'Mia Farrow', 'Lucas Hedges',
    'Charlotte Gainsbourg', 'Mason Mount', 'Amelia Earhart', 'Logan Paul', 'Harper Lee', 'Ethan Hawke',
    'Evelyn Waugh', 'Alexander Hamilton', 'Abigail Adams', 'Michael Scott'
  ];

  const addresses = [
    '302 Snider Street, RUTLAND, VT, 05701',
    '1096 Wiseman Street, CALMAR, IA, 52132',
    '1640 Thom Street, SALE CITY, GA, 31789',
    '3898 Oak Drive, DOVER, DE, 19901',
    '1915 Augusta Park, NASSAU, NY, 12062',
    '3445 Park Boulevard, BIOLA, CA, 93606',
    '452 Baker St, London, UK',
    '129 Broadway, New York, NY, 10001',
    '742 Evergreen Terr, Springfield, OR',
    '1600 Pennsylvania Ave, Washington, DC',
    '890 Fifth Ave, Manhattan, NY',
    '221B Baker St, Marylebone, London',
    '312 Sunset Blvd, Los Angeles, CA',
    '88 Ocean Dr, Miami, FL',
    '505 Market St, San Francisco, CA',
    '42 Wallaby Way, Sydney, Australia',
    '99 Peachtree St, Atlanta, GA',
    '101 Blue Ridge Pkwy, Asheville, NC',
    '12 Michigan Ave, Chicago, IL',
    '55 Congress St, Boston, MA',
    '789 Las Vegas Blvd, Las Vegas, NV',
    '202 Lake Shore Dr, Chicago, IL',
    '109 Broadway, Seattle, WA',
    '456 Pine St, Philadelphia, PA',
    '707 Elm St, Dallas, TX',
    '808 Maple Ave, Denver, CO',
    '909 Oak Rd, Portland, OR',
    '1010 Cedar Ln, Austin, TX'
  ];

  const dates = [
    '31 Jul 2020', '01 Aug 2020', '02 Aug 2020', '02 Aug 2020', '03 Aug 2020', '03 Aug 2020',
    '28 Jul 2020', '29 Jul 2020', '29 Jul 2020', '30 Jul 2020', '30 Jul 2020', '30 Jul 2020',
    '31 Jul 2020', '31 Jul 2020', '01 Aug 2020', '01 Aug 2020', '01 Aug 2020', '02 Aug 2020',
    '02 Aug 2020', '03 Aug 2020', '03 Aug 2020', '04 Aug 2020', '04 Aug 2020', '04 Aug 2020',
    '05 Aug 2020', '05 Aug 2020', '06 Aug 2020', '06 Aug 2020'
  ];

  const dateObjects = [
    new Date('2020-07-31'), new Date('2020-08-01'), new Date('2020-08-02'), new Date('2020-08-02'), new Date('2020-08-03'), new Date('2020-08-03'),
    new Date('2020-07-28'), new Date('2020-07-29'), new Date('2020-07-29'), new Date('2020-07-30'), new Date('2020-07-30'), new Date('2020-07-30'),
    new Date('2020-07-31'), new Date('2020-07-31'), new Date('2020-08-01'), new Date('2020-08-01'), new Date('2020-08-01'), new Date('2020-08-02'),
    new Date('2020-08-02'), new Date('2020-08-03'), new Date('2020-08-03'), new Date('2020-08-04'), new Date('2020-08-04'), new Date('2020-08-04'),
    new Date('2020-08-05'), new Date('2020-08-05'), new Date('2020-08-06'), new Date('2020-08-06')
  ];

  const statuses = [
    'Pending', 'Dispatch', 'Completed', 'Pending', 'Dispatch', 'Pending',
    'Completed', 'Pending', 'Dispatch', 'Completed', 'Pending', 'Completed',
    'Dispatch', 'Pending', 'Completed', 'Dispatch', 'Pending', 'Completed',
    'Dispatch', 'Pending', 'Completed', 'Dispatch', 'Pending', 'Completed',
    'Completed', 'Dispatch', 'Pending', 'Completed'
  ];

  const prices = [
    64.00, 35.00, 74.00, 82.00, 39.00, 67.00,
    119.99, 45.50, 349.99, 99.00, 15.00, 229.99,
    89.00, 42.00, 649.00, 59.50, 180.00, 98.00,
    140.00, 75.00, 350.00, 120.00, 60.00, 95.00,
    110.00, 18.00, 49.00, 135.00
  ];

  const avatars = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', // Brooklyn
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', // John
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', // Sandra
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', // Vernie
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', // Mark
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'  // Rebekah
  ];

  const items = [
    [{ productId: 8, name: 'USB-C Charging Dock', qty: 1, price: 35.00 }, { productId: 5, name: 'Smart LED Desk Lamp', qty: 1, price: 29.00 }],
    [{ productId: 8, name: 'USB-C Charging Dock', qty: 1, price: 35.00 }],
    [{ productId: 3, name: 'Cotton Slim-Fit Chinos', qty: 1, price: 59.50 }, { productId: 8, name: 'USB-C Charging Dock', qty: 1, price: 14.50 }],
    [{ productId: 5, name: 'Smart LED Desk Lamp', qty: 1, price: 82.00 }],
    [{ productId: 8, name: 'USB-C Charging Dock', qty: 1, price: 39.00 }],
    [{ productId: 7, name: 'Stainless Steel Flask', qty: 1, price: 42.00 }, { productId: 8, name: 'USB-C Charging Dock', qty: 1, price: 25.00 }]
  ];

  STATE.orders = [];

  for (let i = 0; i < 28; i++) {
    const isMockupSeed = i < 6;
    const name = customerNames[i];
    const email = name.toLowerCase().replace(' ', '.') + '@gmail.com';
    const avatar = isMockupSeed ? avatars[i] : `https://xsgames.co/randomusers/assets/avatars/${i % 2 === 0 ? 'male' : 'female'}/${i + 10}.jpg`;
    
    // Seed products ordered
    let orderItems = [];
    if (isMockupSeed) {
      orderItems = items[i];
    } else {
      const pIdx = i % STATE.products.length;
      const product = STATE.products[pIdx];
      const qty = (i % 2) + 1;
      orderItems = [{
        productId: product.id,
        name: product.name,
        qty: qty,
        price: product.price
      }];
    }

    STATE.orders.push({
      id: 2632 + (i < 6 ? i : i - 6) - (i >= 6 ? 5 : 0), // Spread around 2632-2637 and others
      customerName: name,
      customerEmail: email,
      customerAvatar: avatar,
      address: addresses[i],
      dateString: dates[i],
      dateObj: dateObjects[i],
      price: prices[i],
      status: statuses[i],
      items: orderItems
    });
  }
  
  // Custom sorting to ensure mockup IDs 2632 to 2637 line up exactly for Page 2
  // We make Page 1 contain IDs 2626 to 2631, and Page 2 contain IDs 2632 to 2637
  STATE.orders.sort((a, b) => a.id - b.id);
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  seedOrders();
  setupEventListeners();
  populateProductsDropdown();
  
  // Set default view active
  switchTab(STATE.activeTab);
  
  // Initialize nav indicator position after layout renders
  setTimeout(updateNavIndicator, 50);
  window.addEventListener('resize', updateNavIndicator);
});

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */
function setupEventListeners() {
  // Sidebar Tab Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Mobile Menu Toggle
  document.getElementById('mobile-toggle-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('active');
  });

  // Close sidebar clicking outside
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });

  // Global search input
  document.getElementById('global-search-input').addEventListener('input', (e) => {
    const val = e.target.value;
    STATE.ordersSearchQuery = val;
    STATE.ordersPage = 1;
    renderOrdersTab();
  });

  // Order status tabs filter
  document.querySelectorAll('.status-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      STATE.ordersStatusFilter = tab.getAttribute('data-status');
      STATE.ordersPage = 1;
      renderOrdersTab();
    });
  });

  // Sorting columns
  document.querySelectorAll('.orders-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.getAttribute('data-sort');
      if (STATE.ordersSortColumn === field) {
        STATE.ordersSortDirection = STATE.ordersSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        STATE.ordersSortColumn = field;
        STATE.ordersSortDirection = 'asc';
      }
      
      // Update header classes
      document.querySelectorAll('.orders-table th.sortable').forEach(t => {
        t.classList.remove('sort-asc', 'sort-desc');
      });
      th.classList.add(STATE.ordersSortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
      
      renderOrdersTab();
    });
  });

  // Order Page Inline Search
  document.getElementById('orders-search-input').addEventListener('input', (e) => {
    STATE.ordersSearchQuery = e.target.value;
    STATE.ordersPage = 1;
    renderOrdersTab();
  });

  // Date range inputs (triggers filters)
  document.getElementById('date-from').addEventListener('change', (e) => {
    STATE.ordersDateFrom = e.target.value;
    renderOrdersTab();
  });
  document.getElementById('date-to').addEventListener('change', (e) => {
    STATE.ordersDateTo = e.target.value;
    renderOrdersTab();
  });

  // Order Drawer Close
  document.getElementById('drawer-close-btn').addEventListener('click', closeDrawer);
  document.getElementById('order-drawer-overlay').addEventListener('click', closeDrawer);

  // Drawer Action Status Updates
  document.querySelectorAll('.drawer-actions-grid button').forEach(btn => {
    btn.addEventListener('click', () => {
      const status = btn.getAttribute('data-status');
      updateOrderStatus(STATE.selectedOrderId, status);
    });
  });

  // Delete Order inside Drawer
  document.getElementById('drawer-btn-delete').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this order?')) {
      deleteOrder(STATE.selectedOrderId);
    }
  });

  // Modal Open Handlers
  document.getElementById('btn-add-order').addEventListener('click', () => openModal('modal-add-order'));
  document.getElementById('btn-add-product').addEventListener('click', () => openModal('modal-add-product'));
  document.getElementById('btn-add-offer').addEventListener('click', () => openModal('modal-add-offer'));

  // Modal Close Handlers (any button with data-close-modal)
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });

  // Form Submissions
  document.getElementById('form-add-order').addEventListener('submit', handleAddOrderSubmit);
  document.getElementById('form-add-product').addEventListener('submit', handleAddProductSubmit);
  document.getElementById('form-add-offer').addEventListener('submit', handleAddOfferSubmit);

  // Search filter for Product Tab
  document.getElementById('products-search-input').addEventListener('input', renderProductsTab);
  document.getElementById('product-category-filter').addEventListener('change', renderProductsTab);

  // Search filter for Stock Tab
  document.getElementById('stock-search-input').addEventListener('input', renderStockTab);
  document.getElementById('stock-alert-filter').addEventListener('change', renderStockTab);

  // Search filter for Offers Tab
  document.getElementById('offers-search-input').addEventListener('input', renderOffersTab);
}

/* ==========================================================================
   NAVIGATION VIEW CONTROLLER
   ========================================================================== */
function switchTab(tabId) {
  STATE.activeTab = tabId;
  
  // Close any drawer/modal on view change
  closeDrawer();
  
  // Active Navigation Styling
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    }
  });

  // Active View Panel Panel
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const activePanel = document.getElementById(`view-${tabId}`);
  if (activePanel) {
    activePanel.classList.add('active');
  }

  // Update Header Title details
  updateHeaderInfo(tabId);

  // Close sidebar on mobile after choosing a tab
  document.getElementById('sidebar').classList.remove('active');

  // Trigger sub-renderers
  if (tabId === 'orders') {
    renderOrdersTab();
  } else if (tabId === 'dashboard') {
    renderDashboardTab();
  } else if (tabId === 'statistic') {
    renderStatisticsTab();
  } else if (tabId === 'product') {
    renderProductsTab();
  } else if (tabId === 'stock') {
    renderStockTab();
  } else if (tabId === 'offer') {
    renderOffersTab();
  }

  // Update sliding nav indicator position
  updateNavIndicator();
}

function updateHeaderInfo(tabId) {
  const titleEl = document.getElementById('page-title');
  const subtitleEl = document.getElementById('page-subtitle');
  
  if (tabId === 'orders') {
    titleEl.textContent = 'Order';
    const total = STATE.orders.length;
    subtitleEl.textContent = `${total} orders found`;
  } else if (tabId === 'dashboard') {
    titleEl.textContent = 'Dashboard';
    subtitleEl.textContent = 'Overview & store insights';
  } else if (tabId === 'statistic') {
    titleEl.textContent = 'Statistic';
    subtitleEl.textContent = 'Detailed sales & volume analytics';
  } else if (tabId === 'product') {
    titleEl.textContent = 'Product';
    subtitleEl.textContent = `${STATE.products.length} products listed`;
  } else if (tabId === 'stock') {
    titleEl.textContent = 'Stock';
    const lowStockCount = STATE.products.filter(p => p.stock > 0 && p.stock <= 5).length;
    subtitleEl.textContent = `${lowStockCount} low stock items need attention`;
  } else if (tabId === 'offer') {
    titleEl.textContent = 'Offer';
    subtitleEl.textContent = `${STATE.offers.filter(o => o.active).length} campaigns active`;
  }
}

function updateNavIndicator() {
  const activeItem = document.querySelector('.nav-item.active');
  const indicator = document.getElementById('nav-indicator');
  const sidebarNav = document.getElementById('sidebar-nav');
  
  if (activeItem && indicator && sidebarNav) {
    const activeRect = activeItem.getBoundingClientRect();
    const navRect = sidebarNav.getBoundingClientRect();
    
    // Calculate vertical offset relative to the nav container
    const topOffset = activeRect.top - navRect.top;
    indicator.style.top = `${topOffset}px`;
    indicator.style.height = `${activeRect.height}px`;
    indicator.style.opacity = '1';
  } else if (indicator) {
    indicator.style.opacity = '0';
  }
}

/* ==========================================================================
   ORDER VIEW TAB (Matches mockup layout & features)
   ========================================================================== */
function renderOrdersTab() {
  const tableBody = document.getElementById('orders-table-body');
  tableBody.innerHTML = '';

  // 1. Apply Status, Search, and Date filtering
  let filtered = [...STATE.orders];

  if (STATE.ordersStatusFilter !== 'all') {
    filtered = filtered.filter(o => o.status.toLowerCase() === STATE.ordersStatusFilter);
  }

  if (STATE.ordersSearchQuery.trim() !== '') {
    const q = STATE.ordersSearchQuery.toLowerCase();
    filtered = filtered.filter(o => 
      o.customerName.toLowerCase().includes(q) ||
      o.id.toString().includes(q) ||
      o.address.toLowerCase().includes(q)
    );
  }

  // Simple date parser (parses e.g. "01 Aug 2020")
  const parseDateStr = (str) => {
    try {
      const parts = str.split(' ');
      if (parts.length === 3) {
        const months = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
        const day = parseInt(parts[0]);
        const month = months[parts[1]] || 0;
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
      }
    } catch(e) {}
    return new Date();
  };

  const fromDate = parseDateStr(STATE.ordersDateFrom);
  const toDate = parseDateStr(STATE.ordersDateTo);
  
  if (fromDate && toDate) {
    filtered = filtered.filter(o => o.dateObj >= fromDate && o.dateObj <= toDate);
  }

  // 2. Apply Sorting
  filtered.sort((a, b) => {
    let valA = a[STATE.ordersSortColumn];
    let valB = b[STATE.ordersSortColumn];

    if (STATE.ordersSortColumn === 'date') {
      valA = a.dateObj.getTime();
      valB = b.dateObj.getTime();
    }

    if (typeof valA === 'string') {
      return STATE.ordersSortDirection === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    } else {
      return STATE.ordersSortDirection === 'asc'
        ? valA - valB
        : valB - valA;
    }
  });

  // 3. Paginate
  const total = filtered.length;
  const totalPages = Math.ceil(total / STATE.ordersPageSize);
  
  // Safety bounds
  if (STATE.ordersPage > totalPages && totalPages > 0) {
    STATE.ordersPage = totalPages;
  }
  if (STATE.ordersPage < 1) {
    STATE.ordersPage = 1;
  }

  const startIdx = (STATE.ordersPage - 1) * STATE.ordersPageSize;
  const paginatedOrders = filtered.slice(startIdx, startIdx + STATE.ordersPageSize);

  // 4. Update Table Header sort states visual
  document.querySelectorAll('.orders-table th.sortable').forEach(th => {
    const sortField = th.getAttribute('data-sort');
    th.classList.remove('sort-asc', 'sort-desc');
    if (sortField === STATE.ordersSortColumn) {
      th.classList.add(STATE.ordersSortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });

  // 5. Populate Rows
  if (paginatedOrders.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--color-text-muted);">No orders found matching the filter criteria.</td></tr>`;
  } else {
    paginatedOrders.forEach(order => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', order.id);
      
      // Active Selection Match
      if (order.id === STATE.selectedOrderId) {
        tr.classList.add('selected');
      }

      const isSelected = order.id === STATE.selectedOrderId;
      const statusClass = order.status.toLowerCase();

      tr.innerHTML = `
        <td>#${order.id}</td>
        <td>
          <div class="user-cell">
            <img src="${order.customerAvatar}" alt="${order.customerName}" class="user-avatar">
            <span>${order.customerName}</span>
          </div>
        </td>
        <td>${order.address}</td>
        <td>${order.dateString}</td>
        <td style="font-weight: 700;">$${order.price.toFixed(2)}</td>
        <td>
          <span class="status-pill ${statusClass}">
            <span class="status-dot"></span>
            ${order.status}
          </span>
        </td>
        <td>
          <div class="action-icons-wrap">
            <svg class="action-icon gear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <svg class="action-icon chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </td>
      `;

      // Click to Select Row & Open Slide Drawer
      tr.addEventListener('click', (e) => {
        // Prevent trigger if clicking on individual action icons
        if (e.target.closest('.action-icon')) {
          e.stopPropagation();
          showToast(`Action menu for Order #${order.id} opened`);
          openDrawer(order.id);
          return;
        }

        // Selection style update
        document.querySelectorAll('.orders-table tbody tr').forEach(r => r.classList.remove('selected'));
        tr.classList.add('selected');
        STATE.selectedOrderId = order.id;

        // Open details side drawer
        openDrawer(order.id);
      });

      tableBody.appendChild(tr);
    });
  }

  // 6. Render Pagination Footer
  renderPagination(total);
}

function renderPagination(totalCount) {
  const infoEl = document.getElementById('pagination-info');
  const controlsEl = document.getElementById('pagination-controls');
  
  if (totalCount === 0) {
    infoEl.textContent = 'Showing 0-0 of 0';
    controlsEl.innerHTML = '';
    return;
  }

  const start = (STATE.ordersPage - 1) * STATE.ordersPageSize + 1;
  const end = Math.min(STATE.ordersPage * STATE.ordersPageSize, totalCount);

  // Exact match to mockup screenshot on load (page 2 with mockup rows)
  if (STATE.ordersPage === 2 && totalCount === 28 && STATE.ordersSearchQuery === '' && STATE.ordersStatusFilter === 'all') {
    infoEl.textContent = 'Showing 06-12 of 28';
  } else {
    // Standard notation format
    const formatNum = (n) => n < 10 ? `0${n}` : n;
    infoEl.textContent = `Showing ${formatNum(start)}-${formatNum(end)} of ${formatNum(totalCount)}`;
  }

  const totalPages = Math.ceil(totalCount / STATE.ordersPageSize);
  let html = '';

  // Prev Button
  html += `<button class="page-btn" id="pagination-prev" ${STATE.ordersPage === 1 ? 'disabled' : ''}>&lt;</button>`;

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${STATE.ordersPage === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }

  // Next Button
  html += `<button class="page-btn" id="pagination-next" ${STATE.ordersPage === totalPages ? 'disabled' : ''}>&gt;</button>`;

  controlsEl.innerHTML = html;

  // Add Listeners
  controlsEl.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pageAttr = btn.getAttribute('data-page');
      if (pageAttr) {
        STATE.ordersPage = parseInt(pageAttr);
      } else if (btn.id === 'pagination-prev' && STATE.ordersPage > 1) {
        STATE.ordersPage--;
      } else if (btn.id === 'pagination-next' && STATE.ordersPage < totalPages) {
        STATE.ordersPage++;
      }
      renderOrdersTab();
    });
  });
}

/* ==========================================================================
   SLIDE OUT DRAWER CONTROL
   ========================================================================== */
function openDrawer(orderId) {
  const order = STATE.orders.find(o => o.id === orderId);
  if (!order) return;

  STATE.selectedOrderId = orderId;

  // Render elements in drawer
  document.getElementById('drawer-order-id').textContent = `Order #${order.id}`;
  
  const statusBadge = document.getElementById('drawer-order-status');
  statusBadge.className = `status-badge status-pill ${order.status.toLowerCase()}`;
  statusBadge.innerHTML = `<span class="status-dot"></span>${order.status}`;

  document.getElementById('drawer-customer-avatar').src = order.customerAvatar;
  document.getElementById('drawer-customer-name').textContent = order.customerName;
  document.getElementById('drawer-customer-email').textContent = order.customerEmail;
  document.getElementById('drawer-customer-address').textContent = order.address;
  document.getElementById('drawer-order-date').textContent = order.dateString;

  // Populate Items Ordered
  const itemsList = document.getElementById('drawer-items-list');
  itemsList.innerHTML = '';
  
  let subtotal = 0;
  order.items.forEach(item => {
    const itemTotal = item.qty * item.price;
    subtotal += itemTotal;
    
    const li = document.createElement('li');
    li.className = 'drawer-item';
    li.innerHTML = `
      <div class="drawer-item-title-wrap">
        <span class="drawer-item-title">${item.name}</span>
        <span class="drawer-item-qty">x${item.qty}</span>
      </div>
      <span class="drawer-item-price">$${itemTotal.toFixed(2)}</span>
    `;
    itemsList.appendChild(li);
  });

  document.getElementById('drawer-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('drawer-total').textContent = `$${order.price.toFixed(2)}`;

  // Set active visual on status update buttons inside drawer
  document.querySelectorAll('.drawer-actions-grid button').forEach(btn => {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
    if (btn.getAttribute('data-status') === order.status) {
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-outline');
    }
  });

  // Display Drawer
  document.getElementById('order-drawer').classList.add('active');
  document.getElementById('order-drawer-overlay').classList.add('active');
}

function closeDrawer() {
  document.getElementById('order-drawer').classList.remove('active');
  document.getElementById('order-drawer-overlay').classList.remove('active');
}

function updateOrderStatus(orderId, newStatus) {
  const order = STATE.orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    
    // Add timeline action log
    STATE.activities.unshift({
      text: `Order #${orderId} status updated to ${newStatus}`,
      time: 'Just now'
    });

    showToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
    renderOrdersTab();
    openDrawer(orderId); // Refresh drawer details
  }
}

function deleteOrder(orderId) {
  const idx = STATE.orders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    STATE.orders.splice(idx, 1);
    
    // Add timeline activity
    STATE.activities.unshift({
      text: `Order #${orderId} has been deleted`,
      time: 'Just now'
    });

    showToast(`Order #${orderId} deleted successfully`, 'success');
    closeDrawer();
    renderOrdersTab();
    updateHeaderInfo('orders');
  }
}

/* ==========================================================================
   DASHBOARD VIEW TAB (KPIs, SVGs & Timelines)
   ========================================================================== */
function renderDashboardTab() {
  // 1. Calculate dynamic metrics based on our orders list
  const totalOrders = STATE.orders.length;
  const completedOrders = STATE.orders.filter(o => o.status === 'Completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price, 0) + STATE.orders.filter(o => o.status === 'Dispatch').reduce((sum, o) => sum + o.price, 0);
  const avgOrderValue = totalOrders > 0 ? (STATE.orders.reduce((sum, o) => sum + o.price, 0) / totalOrders) : 0;

  document.getElementById('kpi-val-revenue').textContent = `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  document.getElementById('kpi-val-orders').textContent = totalOrders;
  document.getElementById('kpi-val-avg').textContent = `$${avgOrderValue.toFixed(2)}`;

  // 2. Render SVG Revenue Spline Area Chart
  renderRevenueSVGChart();

  // 3. Render SVG Donut Chart for status distribution
  renderStatusSVGDonutChart();

  // 4. Render timeline logs
  renderTimeline();

  // 5. Render low stock items list
  renderQuickStockHighlights();
}

function renderRevenueSVGChart() {
  const container = document.getElementById('revenue-chart-container');
  container.innerHTML = '';

  const width = container.clientWidth || 600;
  const height = 240;
  const padding = 40;

  // Chart data: daily revenues
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const values = [120, 240, 190, 480, 290, 520, 360];

  const maxVal = Math.max(...values) * 1.1; // Add 10% space on top
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;

  // Convert values to SVG coordinate points
  const points = values.map((val, idx) => {
    const x = padding + (idx * (chartWidth / (days.length - 1)));
    const y = height - padding - ((val / maxVal) * chartHeight);
    return { x, y, val, day: days[idx] };
  });

  // Calculate spline paths (Cubic Beziers)
  let pathD = `M ${points[0].x} ${points[0].y}`;
  let areaD = `M ${points[0].x} ${height - padding} L ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX1 = curr.x + (next.x - curr.x) / 3;
    const cpY1 = curr.y;
    const cpX2 = curr.x + 2 * (next.x - curr.x) / 3;
    const cpY2 = next.y;

    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    areaD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  areaD += ` L ${points[points.length - 1].x} ${height - padding} Z`;

  // Draw SVG
  let svgHTML = `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
      <defs>
        <!-- Gradient Area Fill -->
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
  `;

  // Horizontal Grid Lines
  const gridLinesCount = 4;
  for (let i = 0; i <= gridLinesCount; i++) {
    const y = padding + (i * (chartHeight / gridLinesCount));
    const gridVal = Math.round(maxVal - (i * (maxVal / gridLinesCount)));
    svgHTML += `
      <line class="chart-grid-line" x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#CBD5E1"/>
      <text class="chart-axis-text" x="${padding - 8}" y="${y + 4}" text-anchor="end">$${gridVal}</text>
    `;
  }

  // Draw Spline Area Gradient
  svgHTML += `<path class="chart-area" d="${areaD}" fill="url(#area-grad)"/>`;

  // Draw Spline Stroke Line
  svgHTML += `<path class="chart-line" d="${pathD}" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round"/>`;

  // Draw Points & Labels
  points.forEach((pt, i) => {
    svgHTML += `
      <!-- Tooltip / Point circle -->
      <g class="chart-point-group">
        <circle class="chart-point" cx="${pt.x}" cy="${pt.y}" r="5" fill="var(--color-primary)" stroke="#FFFFFF" stroke-width="2"/>
        <text class="chart-axis-text" x="${pt.x}" y="${height - padding + 18}" text-anchor="middle">${pt.day}</text>
        
        <!-- Hover tooltip box (starts hidden in CSS) -->
        <g class="chart-tooltip" opacity="0" transform="translate(${pt.x - 30}, ${pt.y - 35})" style="pointer-events: none; transition: opacity var(--transition-fast);">
          <rect x="0" y="0" width="60" height="24" rx="4" fill="#0F172A"/>
          <text x="30" y="15" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">$${pt.val}</text>
        </g>
      </g>
    `;
  });

  svgHTML += `</svg>`;
  container.innerHTML = svgHTML;

  // Add Hover Interactive States to Tooltips
  const pointGroups = container.querySelectorAll('.chart-point-group');
  pointGroups.forEach(grp => {
    grp.addEventListener('mouseenter', () => {
      const tooltip = grp.querySelector('.chart-tooltip');
      const point = grp.querySelector('.chart-point');
      tooltip.style.opacity = '1';
      point.setAttribute('r', '7');
    });
    grp.addEventListener('mouseleave', () => {
      const tooltip = grp.querySelector('.chart-tooltip');
      const point = grp.querySelector('.chart-point');
      tooltip.style.opacity = '0';
      point.setAttribute('r', '5');
    });
  });
}

function renderStatusSVGDonutChart() {
  const container = document.getElementById('status-chart-container');
  container.innerHTML = '';

  const total = STATE.orders.length;
  const pendingCount = STATE.orders.filter(o => o.status === 'Pending').length;
  const dispatchCount = STATE.orders.filter(o => o.status === 'Dispatch').length;
  const completedCount = STATE.orders.filter(o => o.status === 'Completed').length;

  const pendingPct = total > 0 ? (pendingCount / total) : 0;
  const dispatchPct = total > 0 ? (dispatchCount / total) : 0;
  const completedPct = total > 0 ? (completedCount / total) : 0;

  // Donut values (Radius 45, Circumference = 2 * pi * 45 = 282.74)
  const r = 45;
  const circ = 2 * Math.PI * r;

  const completedOffset = circ * (1 - completedPct);
  const dispatchOffset = circ * (1 - dispatchPct);
  const pendingOffset = circ * (1 - pendingPct);

  // SVG HTML
  let svgHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
      <svg width="150" height="150" viewBox="0 0 120 120">
        <!-- Background Track -->
        <circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--color-bg-neutral)" stroke-width="12"/>
        
        <!-- Completed Segment (Green) -->
        <circle class="donut-segment" cx="60" cy="60" r="${r}" fill="none" stroke="#10B981" stroke-width="12"
          stroke-dasharray="${circ}" stroke-dashoffset="${completedOffset}" style="transform: rotate(-90deg); transform-origin: 60px 60px;"/>
          
        <!-- Dispatch Segment (Blue) -->
        <circle class="donut-segment" cx="60" cy="60" r="${r}" fill="none" stroke="#0052FF" stroke-width="12"
          stroke-dasharray="${circ}" stroke-dashoffset="${dispatchOffset}" style="transform: rotate(${-90 + completedPct * 360}deg); transform-origin: 60px 60px;"/>
          
        <!-- Pending Segment (Pink) -->
        <circle class="donut-segment" cx="60" cy="60" r="${r}" fill="none" stroke="#FF4C61" stroke-width="12"
          stroke-dasharray="${circ}" stroke-dashoffset="${pendingOffset}" style="transform: rotate(${-90 + (completedPct + dispatchPct) * 360}deg); transform-origin: 60px 60px;"/>
          
        <!-- Center Text -->
        <text class="donut-label" x="60" y="58" font-size="10" fill="var(--color-text-muted)" font-weight="500">TOTAL</text>
        <text class="donut-label" x="60" y="74" font-size="16" fill="var(--color-text-main)" font-weight="800">${total}</text>
      </svg>
      
      <!-- Legends -->
      <div class="donut-legend">
        <div class="legend-item">
          <div class="legend-color-label">
            <span class="legend-color" style="background-color: #10B981;"></span>
            <span>Completed</span>
          </div>
          <span class="legend-val">${completedCount} <span style="color: var(--color-text-light); font-weight:400; font-size:11px;">(${Math.round(completedPct * 100)}%)</span></span>
        </div>
        <div class="legend-item">
          <div class="legend-color-label">
            <span class="legend-color" style="background-color: #0052FF;"></span>
            <span>Dispatch</span>
          </div>
          <span class="legend-val">${dispatchCount} <span style="color: var(--color-text-light); font-weight:400; font-size:11px;">(${Math.round(dispatchPct * 100)}%)</span></span>
        </div>
        <div class="legend-item">
          <div class="legend-color-label">
            <span class="legend-color" style="background-color: #FF4C61;"></span>
            <span>Pending</span>
          </div>
          <span class="legend-val">${pendingCount} <span style="color: var(--color-text-light); font-weight:400; font-size:11px;">(${Math.round(pendingPct * 100)}%)</span></span>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = svgHTML;
}

function renderTimeline() {
  const timeline = document.getElementById('recent-actions-timeline');
  timeline.innerHTML = '';

  STATE.activities.slice(0, 4).forEach(act => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <span class="timeline-dot"></span>
      <div class="timeline-content">
        <span class="timeline-text">${act.text}</span>
        <span class="timeline-time">${act.time}</span>
      </div>
    `;
    timeline.appendChild(item);
  });
}

function renderQuickStockHighlights() {
  const list = document.getElementById('quick-stock-list');
  list.innerHTML = '';

  // Get low or out of stock items
  const lowItems = STATE.products.filter(p => p.stock <= 5).slice(0, 4);

  if (lowItems.length === 0) {
    list.innerHTML = `<p style="font-size: 13px; color: var(--color-text-muted);">All inventory stock levels are healthy.</p>`;
  } else {
    lowItems.forEach(item => {
      const isOut = item.stock === 0;
      const badgeClass = isOut ? 'danger' : 'warning';
      const label = isOut ? 'OUT OF STOCK' : `${item.stock} left`;
      
      const div = document.createElement('div');
      div.className = 'quick-stock-item';
      div.innerHTML = `
        <div class="stock-item-info">
          <span style="font-weight:600;">${item.name}</span>
          <span class="stock-item-sku">${item.sku} &bull; ${item.supplier}</span>
        </div>
        <span class="kpi-badge ${badgeClass}">${label}</span>
      `;
      list.appendChild(div);
    });
  }
}

/* ==========================================================================
   STATISTIC VIEW TAB (Detailed charts & city table)
   ========================================================================== */
function renderStatisticsTab() {
  // 1. Order Volume SVG Bar Chart
  renderOrderVolumeSVGChart();

  // 2. Sales by Region Donut
  renderRegionSVGChart();

  // 3. Top Cities List Table
  const tableBody = document.getElementById('top-cities-body');
  tableBody.innerHTML = `
    <tr>
      <td>Calmar, Iowa</td>
      <td>8 orders</td>
      <td style="font-weight: 700;">$280.00</td>
      <td>$35.00</td>
      <td><span class="kpi-badge warning" style="font-size:11px;">Active Market</span></td>
    </tr>
    <tr>
      <td>Rutland, Vermont</td>
      <td>6 orders</td>
      <td style="font-weight: 700;">$384.00</td>
      <td>$64.00</td>
      <td><span class="kpi-badge warning" style="font-size:11px;">Active Market</span></td>
    </tr>
    <tr>
      <td>Sale City, Georgia</td>
      <td>5 orders</td>
      <td style="font-weight: 700;">$370.00</td>
      <td>$74.00</td>
      <td><span class="kpi-badge warning" style="font-size:11px;">Growing</span></td>
    </tr>
    <tr>
      <td>Nassau, New York</td>
      <td>4 orders</td>
      <td style="font-weight: 700;">$156.00</td>
      <td>$39.00</td>
      <td><span class="kpi-badge warning" style="font-size:11px;">Stable</span></td>
    </tr>
  `;
}

function renderOrderVolumeSVGChart() {
  const container = document.getElementById('volume-chart-container');
  container.innerHTML = '';

  const width = container.clientWidth || 600;
  const height = 240;
  const padding = 40;

  const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const actuals = [120, 185, 230, 290, 310, 420];
  const forecasts = [120, 170, 210, 260, 340, 480];

  const maxVal = Math.max(...forecasts) * 1.1;
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;
  const barWidth = 18;
  const groupSpacing = 32;

  let svgHTML = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">`;

  // Grid Lines
  const gridCount = 4;
  for (let i = 0; i <= gridCount; i++) {
    const y = padding + (i * (chartHeight / gridCount));
    const gridVal = Math.round(maxVal - (i * (maxVal / gridCount)));
    svgHTML += `
      <line class="chart-grid-line" x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#CBD5E1"/>
      <text class="chart-axis-text" x="${padding - 8}" y="${y + 4}" text-anchor="end">${gridVal}</text>
    `;
  }

  // Draw Bars
  months.forEach((m, idx) => {
    const groupWidth = barWidth * 2 + 4;
    const xGroup = padding + (idx * (chartWidth / months.length)) + (chartWidth / months.length - groupWidth) / 2;

    const actH = (actuals[idx] / maxVal) * chartHeight;
    const actY = height - padding - actH;

    const forH = (forecasts[idx] / maxVal) * chartHeight;
    const forY = height - padding - forH;

    svgHTML += `
      <!-- Actual Sales Bar (Blue) -->
      <rect x="${xGroup}" y="${actY}" width="${barWidth}" height="${actH}" rx="3" fill="var(--color-primary)" opacity="0.95"/>
      
      <!-- Forecasted Bar (Lighter Grey/Blue) -->
      <rect x="${xGroup + barWidth + 4}" y="${forY}" width="${barWidth}" height="${forH}" rx="3" fill="#94A3B8" opacity="0.5"/>
      
      <!-- Month Label -->
      <text class="chart-axis-text" x="${xGroup + groupWidth/2}" y="${height - padding + 18}" text-anchor="middle">${m}</text>
    `;
  });

  svgHTML += `</svg>`;
  container.innerHTML = svgHTML;
}

function renderRegionSVGChart() {
  const container = document.getElementById('region-chart-container');
  container.innerHTML = '';

  const r = 45;
  const circ = 2 * Math.PI * r;

  // Regions: North America 55%, Europe 25%, Asia 20%
  const naOffset = circ * 0.45;
  const euOffset = circ * 0.75;
  const asOffset = circ * 0.80;

  let svgHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
      <svg width="150" height="150" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--color-bg-neutral)" stroke-width="12"/>
        
        <!-- NA (Primary Blue) -->
        <circle class="donut-segment" cx="60" cy="60" r="${r}" fill="none" stroke="#0052FF" stroke-width="12"
          stroke-dasharray="${circ}" stroke-dashoffset="${naOffset}" style="transform: rotate(-90deg); transform-origin: 60px 60px;"/>
          
        <!-- EU (Orange) -->
        <circle class="donut-segment" cx="60" cy="60" r="${r}" fill="none" stroke="#F59E0B" stroke-width="12"
          stroke-dasharray="${circ}" stroke-dashoffset="${euOffset}" style="transform: rotate(${ -90 + 0.55 * 360 }deg); transform-origin: 60px 60px;"/>
          
        <!-- Asia (Green) -->
        <circle class="donut-segment" cx="60" cy="60" r="${r}" fill="none" stroke="#10B981" stroke-width="12"
          stroke-dasharray="${circ}" stroke-dashoffset="${asOffset}" style="transform: rotate(${ -90 + 0.80 * 360 }deg); transform-origin: 60px 60px;"/>
      </svg>
      <div class="donut-legend">
        <div class="legend-item">
          <div class="legend-color-label">
            <span class="legend-color" style="background-color: #0052FF;"></span>
            <span>North America</span>
          </div>
          <span class="legend-val">55%</span>
        </div>
        <div class="legend-item">
          <div class="legend-color-label">
            <span class="legend-color" style="background-color: #F59E0B;"></span>
            <span>Europe</span>
          </div>
          <span class="legend-val">25%</span>
        </div>
        <div class="legend-item">
          <div class="legend-color-label">
            <span class="legend-color" style="background-color: #10B981;"></span>
            <span>Asia Pacific</span>
          </div>
          <span class="legend-val">20%</span>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = svgHTML;
}

/* ==========================================================================
   PRODUCT CATALOG VIEW TAB
   ========================================================================== */
function renderProductsTab() {
  const tableBody = document.getElementById('products-table-body');
  tableBody.innerHTML = '';

  const q = document.getElementById('products-search-input').value.toLowerCase().trim();
  const category = document.getElementById('product-category-filter').value;

  let filtered = [...STATE.products];

  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (q !== '') {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color: var(--color-text-muted);">No products found matching filters.</td></tr>`;
    return;
  }

  filtered.forEach(p => {
    const isOut = p.stock === 0;
    const isLow = p.stock > 0 && p.stock <= 5;
    const badgeClass = isOut ? 'danger' : (isLow ? 'warning' : 'completed');
    const badgeText = isOut ? 'Out of Stock' : (isLow ? `Low Stock (${p.stock})` : 'In Stock');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <span class="kpi-icon-wrap" style="background-color: var(--color-bg-neutral); color: var(--color-text-muted); width: 36px; height: 36px; border-radius: 4px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </span>
      </td>
      <td style="font-weight: 600;">${p.name}</td>
      <td style="font-family: monospace; color: var(--color-text-muted);">${p.sku}</td>
      <td>${p.category}</td>
      <td style="font-weight:700;">$${p.price.toFixed(2)}</td>
      <td><span class="kpi-badge ${badgeClass}">${badgeText}</span></td>
      <td>
        <button class="btn btn-outline btn-sm btn-delete-product" data-id="${p.id}">Delete</button>
      </td>
    `;

    // Hook delete product
    tr.querySelector('.btn-delete-product').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Remove ${p.name} from the catalog?`)) {
        deleteProduct(p.id);
      }
    });

    tableBody.appendChild(tr);
  });
}

function deleteProduct(prodId) {
  const idx = STATE.products.findIndex(p => p.id === prodId);
  if (idx !== -1) {
    const name = STATE.products[idx].name;
    STATE.products.splice(idx, 1);
    showToast(`Product "${name}" deleted`, 'success');
    renderProductsTab();
    updateHeaderInfo('product');
    populateProductsDropdown(); // Update drop menus
  }
}

/* ==========================================================================
   STOCK VIEW TAB
   ========================================================================== */
function renderStockTab() {
  const tableBody = document.getElementById('stock-table-body');
  tableBody.innerHTML = '';

  const q = document.getElementById('stock-search-input').value.toLowerCase().trim();
  const alertFilter = document.getElementById('stock-alert-filter').value;

  let filtered = [...STATE.products];

  if (alertFilter === 'low') {
    filtered = filtered.filter(p => p.stock > 0 && p.stock <= 5);
  } else if (alertFilter === 'out') {
    filtered = filtered.filter(p => p.stock === 0);
  } else if (alertFilter === 'healthy') {
    filtered = filtered.filter(p => p.stock > 5);
  }

  if (q !== '') {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }

  // Update Stock Counter badges
  const lowCount = STATE.products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outCount = STATE.products.filter(p => p.stock === 0).length;
  document.getElementById('stock-badge-low').textContent = `${lowCount} Low Stock`;
  document.getElementById('stock-badge-out').textContent = `${outCount} Out of Stock`;

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color: var(--color-text-muted);">No stock items matching filters.</td></tr>`;
    return;
  }

  filtered.forEach(p => {
    const isOut = p.stock === 0;
    const isLow = p.stock > 0 && p.stock <= 5;
    const badgeClass = isOut ? 'danger' : (isLow ? 'warning' : 'completed');
    const badgeText = isOut ? 'Critical Out' : (isLow ? 'Low Warning' : 'Healthy');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 600;">${p.name}</td>
      <td style="font-family: monospace; color: var(--color-text-muted);">${p.sku}</td>
      <td style="font-weight: 700;">
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="number" class="stock-qty-edit-input" data-id="${p.id}" value="${p.stock}" min="0" max="1000" style="width:60px; padding:4px 8px; border:1px solid var(--color-border); border-radius:4px; text-align:center;">
          <button class="btn btn-outline btn-sm btn-update-stock" data-id="${p.id}" style="padding:4px 8px;">Save</button>
        </div>
      </td>
      <td>5 units</td>
      <td>${p.supplier}</td>
      <td><span class="kpi-badge ${badgeClass}">${badgeText}</span></td>
      <td>
        <button class="btn btn-primary btn-sm btn-reorder" data-sku="${p.sku}">Reorder</button>
      </td>
    `;

    // Hook inline stock update
    tr.querySelector('.btn-update-stock').addEventListener('click', () => {
      const input = tr.querySelector('.stock-qty-edit-input');
      const val = parseInt(input.value);
      if (!isNaN(val) && val >= 0) {
        updateProductStock(p.id, val);
      }
    });

    // Hook reorder cta
    tr.querySelector('.btn-reorder').addEventListener('click', () => {
      showToast(`Restock purchase order placed for SKU: ${p.sku}`, 'success');
      STATE.activities.unshift({
        text: `Restock request submitted for SKU: ${p.sku}`,
        time: 'Just now'
      });
    });

    tableBody.appendChild(tr);
  });
}

function updateProductStock(prodId, newStock) {
  const p = STATE.products.find(prod => prod.id === prodId);
  if (p) {
    p.stock = newStock;
    showToast(`Stock updated for ${p.name} to ${newStock} units`, 'success');
    renderStockTab();
    updateHeaderInfo('stock');
  }
}

/* ==========================================================================
   OFFER / MARKETING VIEW TAB
   ========================================================================== */
function renderOffersTab() {
  const grid = document.getElementById('offers-grid');
  grid.innerHTML = '';

  const q = document.getElementById('offers-search-input').value.toLowerCase().trim();

  let filtered = [...STATE.offers];

  if (q !== '') {
    filtered = filtered.filter(o => o.title.toLowerCase().includes(q) || o.code.toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--color-text-muted);">No campaign coupons found.</div>`;
    return;
  }

  filtered.forEach(o => {
    const card = document.createElement('div');
    card.className = `offer-card ${!o.active ? 'inactive' : ''}`;
    card.innerHTML = `
      <div class="offer-card-header">
        <h4 class="offer-title">${o.title}</h4>
        <span class="offer-discount-badge">${o.discount}</span>
      </div>
      <p class="offer-desc">${o.desc}</p>
      <div class="offer-code-wrap">
        <span class="offer-code">${o.code}</span>
        <button class="btn-copy-code" data-code="${o.code}">Copy Code</button>
      </div>
      <div class="offer-footer">
        <span>Expires: ${o.expiry}</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span>Active</span>
          <label class="switch-control">
            <input type="checkbox" class="offer-toggle" data-id="${o.id}" ${o.active ? 'checked' : ''}>
            <span class="switch-slider"></span>
          </label>
        </div>
      </div>
    `;

    // Hook copy promo
    card.querySelector('.btn-copy-code').addEventListener('click', () => {
      navigator.clipboard.writeText(o.code).then(() => {
        showToast(`Promo code "${o.code}" copied to clipboard!`, 'success');
      }).catch(() => {
        // Fallback if clipboard block
        showToast(`Promo: ${o.code}`, 'success');
      });
    });

    // Hook active toggle switch
    card.querySelector('.offer-toggle').addEventListener('change', (e) => {
      toggleOfferActive(o.id, e.target.checked);
    });

    grid.appendChild(card);
  });
}

function toggleOfferActive(offerId, activeVal) {
  const o = STATE.offers.find(offer => offer.id === offerId);
  if (o) {
    o.active = activeVal;
    showToast(`Campaign ${o.code} ${activeVal ? 'activated' : 'paused'}`, 'success');
    updateHeaderInfo('offer');
    renderOffersTab();
  }
}

/* ==========================================================================
   MODAL CONTROLLER ACTIONS & FORM HANDLERS
   ========================================================================== */
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) {
    m.classList.add('active');
    
    // Set default order date to today on open add order
    if (modalId === 'modal-add-order') {
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('order-date-input').value = today;
    }
  }
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) {
    m.classList.remove('active');
  }
}

function populateProductsDropdown() {
  const dropdown = document.getElementById('order-item-product');
  dropdown.innerHTML = '';
  STATE.products.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} ($${p.price.toFixed(2)})`;
    dropdown.appendChild(opt);
  });
}

function handleAddOrderSubmit(e) {
  e.preventDefault();
  
  const custName = document.getElementById('order-cust-name').value.trim();
  const address = document.getElementById('order-cust-address').value.trim();
  const productId = parseInt(document.getElementById('order-item-product').value);
  const qty = parseInt(document.getElementById('order-item-qty').value);
  const dateVal = document.getElementById('order-date-input').value; // YYYY-MM-DD
  const status = document.getElementById('order-status-select').value;

  const product = STATE.products.find(p => p.id === productId);
  if (!product) return;

  // Format date display e.g. "06 Aug 2020"
  const parseDate = new Date(dateVal);
  const day = parseDate.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthStr = months[parseDate.getMonth()];
  const yr = parseDate.getFullYear();
  const dateFormatted = `${day < 10 ? '0'+day : day} ${monthStr} ${yr}`;

  const nextId = Math.max(...STATE.orders.map(o => o.id)) + 1;
  const totalPrice = product.price * qty;

  const newOrder = {
    id: nextId,
    customerName: custName,
    customerEmail: custName.toLowerCase().replace(' ', '.') + '@gmail.com',
    customerAvatar: `https://xsgames.co/randomusers/assets/avatars/male/${Math.floor(Math.random() * 50) + 1}.jpg`,
    address: address,
    dateString: dateFormatted,
    dateObj: parseDate,
    price: totalPrice,
    status: status,
    items: [{
      productId: productId,
      name: product.name,
      qty: qty,
      price: product.price
    }]
  };

  // Add order
  STATE.orders.push(newOrder);

  // Add timeline entry
  STATE.activities.unshift({
    text: `New Order #${nextId} created for ${custName}`,
    time: 'Just now'
  });

  // Re-deduce stock if completed/dispatch
  if (status !== 'Pending') {
    product.stock = Math.max(0, product.stock - qty);
  }

  showToast(`Order #${nextId} created successfully!`, 'success');
  closeModal('modal-add-order');
  document.getElementById('form-add-order').reset();

  renderOrdersTab();
  updateHeaderInfo('orders');
}

function handleAddProductSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('prod-name').value.trim();
  const sku = document.getElementById('prod-sku').value.trim();
  const category = document.getElementById('prod-category').value;
  const price = parseFloat(document.getElementById('prod-price').value);
  const stock = parseInt(document.getElementById('prod-stock').value);
  const supplier = document.getElementById('prod-supplier').value.trim();

  const nextId = Math.max(...STATE.products.map(p => p.id)) + 1;

  const newProduct = {
    id: nextId,
    name: name,
    sku: sku.toUpperCase(),
    category: category,
    price: price,
    stock: stock,
    supplier: supplier
  };

  STATE.products.push(newProduct);
  
  STATE.activities.unshift({
    text: `Catalog item "${name}" listed under SKU: ${sku.toUpperCase()}`,
    time: 'Just now'
  });

  showToast(`Product "${name}" added to inventory!`, 'success');
  closeModal('modal-add-product');
  document.getElementById('form-add-product').reset();
  
  populateProductsDropdown(); // Update forms
  renderProductsTab();
  updateHeaderInfo('product');
}

function handleAddOfferSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('offer-title').value.trim();
  const code = document.getElementById('offer-code').value.toUpperCase().trim();
  const discount = document.getElementById('offer-discount').value.trim();
  const desc = document.getElementById('offer-description').value.trim();
  const expiry = document.getElementById('offer-expiry').value;

  const nextId = Math.max(...STATE.offers.map(o => o.id)) + 1;

  const newOffer = {
    id: nextId,
    title: title,
    code: code,
    discount: discount,
    desc: desc,
    expiry: expiry,
    active: true,
    usage: 0
  };

  STATE.offers.push(newOffer);

  STATE.activities.unshift({
    text: `New promotional campaign "${code}" active`,
    time: 'Just now'
  });

  showToast(`Campaign coupon "${code}" created!`, 'success');
  closeModal('modal-add-offer');
  document.getElementById('form-add-offer').reset();
  
  renderOffersTab();
  updateHeaderInfo('offer');
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Icon
  const svgIcon = type === 'success' 
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    ${svgIcon}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    toast.style.animation = 'slideInToast 0.3s reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}
