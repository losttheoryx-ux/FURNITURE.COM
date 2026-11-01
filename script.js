// Owner WhatsApp Configuration (Replace with your actual WhatsApp phone number with country code)
const OWNER_PHONE = "1234567890";

// Initial Sample Products Catalog
const initialProducts = [
    {
        id: 1,
        name: "Nordic Minimalist Oak Sofa",
        category: "instock",
        price: 850,
        type: "In-Stock",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
        dimensions: "80\"L x 34\"W x 32\"H",
        wood: "Solid Oak Wood"
    },
    {
        id: 2,
        name: "Handcrafted Teak Dining Table Set",
        category: "preorder",
        price: 1200,
        type: "Pre-Order",
        leadTime: "Ships in 2-3 Weeks",
        image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80",
        dimensions: "72\"L x 36\"W x 30\"H",
        wood: "Grade-A Teak Wood"
    },
    {
        id: 3,
        name: "Royal Sheesham King Bed",
        category: "instock",
        price: 1100,
        type: "In-Stock",
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
        dimensions: "78\"L x 72\"W x 48\"H",
        wood: "Rosewood / Sheesham"
    }
];

// Global Data Structures (Stored in Browser LocalStorage)
let customDemands = JSON.parse(localStorage.getItem('customDemands')) || [];
let salesLogs = JSON.parse(localStorage.getItem('salesLogs')) || [
    { id: 1, item: "Nordic Oak Sofa", customer: "Alice Smith", amount: 850 }
];
let expenseLogs = JSON.parse(localStorage.getItem('expenseLogs')) || [
    { id: 1, item: "Oak Timber Lumber", supplier: "City Timber Yard", amount: 350 }
];

// Active Image Preview String
let uploadedImageString = "";

// 1. Navigation Tab Switcher
function switchTab(tab) {
    document.getElementById('view-storefront').classList.add('hidden');
    document.getElementById('view-custom-demand').classList.add('hidden');
    document.getElementById('view-dashboard').classList.add('hidden');

    document.getElementById('view-' + tab).classList.remove('hidden');

    if (tab === 'dashboard') {
        updateDashboard();
    }
}

// 2. Render Product Cards (Feature 1 & Feature 2)
function renderProducts(filter = 'all') {
    const container = document.getElementById('product-grid');
    if (!container) return;
    container.innerHTML = "";

    const filtered = initialProducts.filter(p => filter === 'all' || p.category === filter);

    filtered.forEach(p => {
        const isPreOrder = p.category === 'preorder';
        const card = document.createElement('div');
        card.className = "bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col justify-between";
        
        const waMessage = encodeURIComponent(`Hi, I am interested in ordering: ${p.name} (Price: $${p.price}). Please share delivery details.`);

        card.innerHTML = `
            <div>
                <div class="relative h-48 bg-stone-200">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
                    <span class="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${isPreOrder ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'}">
                        ${p.type}
                    </span>
                </div>
                <div class="p-5">
                    <h3 class="font-serif text-lg font-bold text-stone-900">${p.name}</h3>
                    <p class="text-xs text-stone-500 mt-1">${p.wood} • ${p.dimensions}</p>
                    ${isPreOrder ? `<p class="text-xs text-amber-700 font-semibold mt-1">⏳ ${p.leadTime}</p>` : ''}
                    <div class="text-xl font-bold text-stone-900 mt-3">$${p.price}</div>
                </div>
            </div>
            <div class="px-5 pb-5">
                <a href="https://wa.me/${OWNER_PHONE}?text=${waMessage}" target="_blank" class="w-full bg-stone-900 hover:bg-stone-800 text-white text-center font-semibold py-2.5 rounded-lg flex items-center justify-center space-x-2 transition">
                    <i data-lucide="message-circle" class="w-4 h-4 text-emerald-400"></i>
                    <span>${isPreOrder ? 'Pre-Order on WhatsApp' : 'Order on WhatsApp'}</span>
                </a>
            </div>
        `;
        container.appendChild(card);
    });
    if (window.lucide) lucide.createIcons();
}

// 3. Image Upload & Preview Base64 Converter
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            uploadedImageString = evt.target.result;
            showPreview(uploadedImageString);
        }
        reader.readAsDataURL(file);
    }
}

function handleUrlInput(url) {
    if (url) {
        uploadedImageString = url;
        showPreview(url);
    }
}

function showPreview(src) {
    const img = document.getElementById('image-preview');
    if (img) {
        img.src = src;
        document.getElementById('image-preview-container').classList.remove('hidden');
    }
}

// 4. Handle Custom Design Form Submission (Feature 3)
function submitCustomDemand(e) {
    e.preventDefault();

    const newDemand = {
        id: Date.now(),
        name: document.getElementById('demand-name').value,
        phone: document.getElementById('demand-phone').value,
        dimensions: document.getElementById('demand-dimensions').value || 'Standard',
        material: document.getElementById('demand-material').value,
        budget: document.getElementById('demand-budget').value || 'Open',
        notes: document.getElementById('demand-notes').value,
        image: uploadedImageString || 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=300&q=80',
        date: new Date().toLocaleDateString()
    };

    customDemands.push(newDemand);
    localStorage.setItem('customDemands', JSON.stringify(customDemands));

    alert('Your custom furniture design demand has been submitted! The owner will review it in the dashboard.');
    document.getElementById('custom-demand-form').reset();
    document.getElementById('image-preview-container').classList.add('hidden');
    uploadedImageString = "";

    switchTab('dashboard');
}

// 5. Dashboard Stat Calculations & Data Table Render
function updateDashboard() {
    const totalSales = salesLogs.reduce((sum, s) => sum + Number(s.amount), 0);
    const totalExpenses = expenseLogs.reduce((sum, e) => sum + Number(e.amount), 0);
    const netProfit = totalSales - totalExpenses;

    const salesElem = document.getElementById('stat-sales');
    const expensesElem = document.getElementById('stat-expenses');
    const profitElem = document.getElementById('stat-profit');
    const preordersElem = document.getElementById('stat-preorders');

    if (salesElem) salesElem.innerText = `$${totalSales.toFixed(2)}`;
    if (expensesElem) expensesElem.innerText = `$${totalExpenses.toFixed(2)}`;
    if (profitElem) profitElem.innerText = `$${netProfit.toFixed(2)}`;
    if (preordersElem) preordersElem.innerText = customDemands.length;

    // Render Custom Demands Table
    const tbody = document.getElementById('table-custom-demands');
    if (!tbody) return;
    tbody.innerHTML = "";

    if (customDemands.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-4 text-center text-stone-400">No custom design demands submitted yet.</td></tr>`;
    } else {
        customDemands.forEach(d => {
            const tr = document.createElement('tr');
            tr.className = "border-b border-stone-100 hover:bg-stone-50";
            tr.innerHTML = `
                <td class="px-4 py-3"><img src="${d.image}" class="w-12 h-12 rounded object-cover border"></td>
                <td class="px-4 py-3 font-semibold text-stone-900">${d.name}</td>
                <td class="px-4 py-3">${d.phone}</td>
                <td class="px-4 py-3">${d.material} (${d.dimensions})</td>
                <td class="px-4 py-3 font-bold text-amber-700">${d.budget}</td>
                <td class="px-4 py-3">
                    <a href="https://wa.me/${d.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(d.name)},%20I%20reviewed%20your%20custom%20furniture%20demand!" target="_blank" class="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-emerald-700">Reply Quote</a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// 6. Log Completed Sale
function logSale(e) {
    e.preventDefault();
    const item = document.getElementById('sale-item').value;
    const customer = document.getElementById('sale-customer').value;
    const amount = document.getElementById('sale-amount').value;

    salesLogs.push({ id: Date.now(), item, customer, amount });
    localStorage.setItem('salesLogs', JSON.stringify(salesLogs));
    updateDashboard();
    e.target.reset();
}

// 7. Log Expense Entry
function logExpense(e) {
    e.preventDefault();
    const item = document.getElementById('expense-item').value;
    const supplier = document.getElementById('expense-supplier').value;
    const amount = document.getElementById('expense-amount').value;

    expenseLogs.push({ id: Date.now(), item, supplier, amount });
    localStorage.setItem('expenseLogs', JSON.stringify(expenseLogs));
    updateDashboard();
    e.target.reset();
}

// 8. Filter Pills Handler
function filterProducts(type) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-stone-900', 'text-white');
        btn.classList.add('bg-stone-200', 'text-stone-700');
    });
    if (event && event.target) {
        event.target.classList.remove('bg-stone-200', 'text-stone-700');
        event.target.classList.add('bg-stone-900', 'text-white');
    }
    renderProducts(type);
}

// Initialize Application
window.onload = function() {
    renderProducts();
    if (window.lucide) lucide.createIcons();
};
