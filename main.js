/* =========================================================
   Township Capital — Main Application Logic
   Extracted and consolidated from inline <script> blocks:
     1. Horizon & Scenario Growth Engine
     2. 1% Rental Payout Engine
     3. Dual-Asset Simulator (Land vs Stocks)
     4. Yield & Area Conversion Planning Tool
     5. Consultation Form Dispatch
     6. Bihar Spatial Corridor Map (data + selection)
     7. Map Hover Tooltip
     8. Corridor <-> Ledger Sync
     9. Cadastral Viewport Pan/Zoom + Spotlight
   ========================================================= */

/* ---------------------------------------------------------
   1. HORIZON & SCENARIO ENGINE
   --------------------------------------------------------- */
const growthData = [
  { name: "Ahana City, Telmar", rate: 1500, kathaSqft: 1361.25 },
  { name: "Ekma City, Saran", rate: 551, kathaSqft: 1361.25, note: "Pre-revision" },
  { name: "Mountain Bliss, Rajgir", rate: 950, kathaSqft: 1361.25 },
  { name: "Shuvida Enclave, Bihta", rate: 1499, kathaSqft: 1361.25 }
];

let currentHorizon = 3;
let currentScenario = 0.10;

function renderGrowthTable() {
  const tbody = document.getElementById("growth-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  document.getElementById("disp-horizon-yrs").innerText = currentHorizon;
  document.getElementById("disp-scenario-pct").innerText = (currentScenario * 100).toFixed(0);

  growthData.forEach((item, index) => {
    const currentKathaVal = item.rate * item.kathaSqft;
    // Compound growth formula: FV = PV * (1 + r)^n
    const projectedRate = Math.round(item.rate * Math.pow(1 + currentScenario, currentHorizon));
    const projectedKathaVal = Math.round(projectedRate * item.kathaSqft);
    const netGain = projectedKathaVal - currentKathaVal;

    const row = document.createElement("tr");
    if (index % 2 === 1) row.className = "bg-surface-container/50";
    row.innerHTML = `
      <td class="py-space-sm font-semibold">${item.name}</td>
      <td class="py-space-sm font-data-metric">₹${item.rate.toLocaleString('en-IN')}</td>
      <td class="py-space-sm font-data-metric font-medium">₹${Math.round(currentKathaVal).toLocaleString('en-IN')}</td>
      <td class="py-space-sm font-data-metric text-secondary font-bold">₹${projectedRate.toLocaleString('en-IN')}</td>
      <td class="py-space-sm font-data-metric font-semibold">₹${projectedKathaVal.toLocaleString('en-IN')}</td>
      <td class="py-space-sm font-data-metric text-right text-secondary font-bold">+₹${Math.round(netGain).toLocaleString('en-IN')}</td>
    `;
    tbody.appendChild(row);
  });
}

function setHorizon(years) {
  currentHorizon = years;
  ["3", "5", "10"].forEach(y => {
    const el = document.getElementById(`btn-horizon-${y}`);
    if (el) {
      if (parseInt(y) === years) {
        el.className = "px-space-sm py-space-2xs font-label-caps text-label-caps uppercase bg-primary text-on-primary";
      } else {
        el.className = "px-space-sm py-space-2xs font-label-caps text-label-caps uppercase bg-surface text-on-surface hover:bg-surface-container-highest";
      }
    }
  });
  renderGrowthTable();
}

function setScenario(rate) {
  currentScenario = rate;
  const rateMap = { 0.06: "cons", 0.10: "mod", 0.15: "opt" };
  Object.keys(rateMap).forEach(k => {
    const key = rateMap[k];
    const el = document.getElementById(`btn-scenario-${key}`);
    if (el) {
      if (parseFloat(k) === rate) {
        el.className = "px-space-sm py-space-2xs font-label-caps text-label-caps uppercase bg-primary text-on-primary";
      } else {
        el.className = "px-space-sm py-space-2xs font-label-caps text-label-caps uppercase bg-surface text-on-surface hover:bg-surface-container-highest";
      }
    }
  });
  renderGrowthTable();
}

/* ---------------------------------------------------------
   2. 1% RENTAL PAYOUT ENGINE
   --------------------------------------------------------- */
function calcRentalPayout() {
  const capInput = document.getElementById("rental-capital-input");
  const capital = parseFloat(capInput ? capInput.value : 1293187) || 1293187;

  const monthly = Math.round(capital * 0.01);
  const annual = monthly * 12;
  const cumulative5Yr = annual * 5;

  const dispMonthly = document.getElementById("disp-rental-monthly");
  const dispAnnual = document.getElementById("disp-rental-annual");
  const dispCumulative = document.getElementById("disp-rental-cumulative");
  const tableBody = document.getElementById("rental-schedule-body");

  if (dispMonthly) dispMonthly.innerText = "₹" + monthly.toLocaleString('en-IN');
  if (dispAnnual) dispAnnual.innerText = "₹" + annual.toLocaleString('en-IN');
  if (dispCumulative) dispCumulative.innerText = "₹" + cumulative5Yr.toLocaleString('en-IN');

  if (tableBody) {
    tableBody.innerHTML = "";
    let runningTotal = 0;
    for (let yr = 1; yr <= 5; yr++) {
      runningTotal += annual;
      const remainingExposure = Math.max(0, Math.round(capital - runningTotal));
      const row = document.createElement("tr");
      if (yr % 2 === 0) row.className = "bg-surface-container/50";
      row.innerHTML = `
        <td class="py-space-2xs font-semibold">Year ${yr} (202${4 + yr})</td>
        <td class="py-space-2xs font-data-metric">₹${monthly.toLocaleString('en-IN')}/mo</td>
        <td class="py-space-2xs font-data-metric">₹${annual.toLocaleString('en-IN')}</td>
        <td class="py-space-2xs font-data-metric text-secondary font-bold">₹${runningTotal.toLocaleString('en-IN')}</td>
        <td class="py-space-2xs font-data-metric text-right font-medium">₹${remainingExposure.toLocaleString('en-IN')}</td>
      `;
      tableBody.appendChild(row);
    }
  }
}

/* ---------------------------------------------------------
   3. DUAL-ASSET SIMULATOR (LAND VS STOCKS)
   --------------------------------------------------------- */
function runSimulation() {
  const p = parseFloat(document.getElementById("sim-principal").value) || 2500000;
  const yrs = parseInt(document.getElementById("sim-years").value) || 5;
  const landCagr = parseFloat(document.getElementById("sim-case").value) || 0.16;
  const stockCagr = 0.115; // 11.5% historical Sensex average

  const landTotal = Math.round(p * Math.pow(1 + landCagr, yrs));
  const stockTotal = Math.round(p * Math.pow(1 + stockCagr, yrs));

  const landGain = landTotal - p;
  const stockGain = stockTotal - p;

  document.getElementById("sim-land-total").innerText = "₹" + landTotal.toLocaleString('en-IN');
  document.getElementById("sim-land-gain").innerText = "+₹" + landGain.toLocaleString('en-IN');

  document.getElementById("sim-stock-total").innerText = "₹" + stockTotal.toLocaleString('en-IN');
  document.getElementById("sim-stock-gain").innerText = "+₹" + stockGain.toLocaleString('en-IN');
}

/* ---------------------------------------------------------
   4. YIELD & AREA CONVERSION PLANNING TOOL
   --------------------------------------------------------- */
function setYieldProject(key) {
  const select = document.getElementById("calc-project-select");
  if (select) {
    select.value = key;
    applyProjectSelect();
  }
}

function applyProjectSelect() {
  const proj = document.getElementById("calc-project-select").value;
  const rateInput = document.getElementById("calc-rate");
  if (!rateInput) return;

  if (proj === "ahana") rateInput.value = 1500;
  else if (proj === "ekma") rateInput.value = 551;
  else if (proj === "rajgir") rateInput.value = 950;
  else if (proj === "bihta") rateInput.value = 1499;
  updateYieldOutputs();
}

function syncFromKatha() {
  const katha = parseFloat(document.getElementById("calc-katha").value) || 0;
  document.getElementById("calc-sqft").value = (katha * 1361.25).toFixed(2);
  updateYieldOutputs();
}

function syncFromSqft() {
  const sqft = parseFloat(document.getElementById("calc-sqft").value) || 0;
  document.getElementById("calc-katha").value = (sqft / 1361.25).toFixed(3);
  updateYieldOutputs();
}

function updateYieldOutputs() {
  const sqft = parseFloat(document.getElementById("calc-sqft").value) || 0;
  const katha = parseFloat(document.getElementById("calc-katha").value) || 0;
  const rate = parseFloat(document.getElementById("calc-rate").value) || 0;
  const growthRate = parseFloat(document.getElementById("calc-growth-rate").value) || 0.12;

  const baseCost = Math.round(sqft * rate);
  const bigha = (katha / 20).toFixed(3);
  const stampDuty = Math.round(baseCost * 0.085);
  const totalLayout = baseCost + stampDuty;

  const val3yr = Math.round(baseCost * Math.pow(1 + growthRate, 3));
  const val5yr = Math.round(baseCost * Math.pow(1 + growthRate, 5));
  const val10yr = Math.round(baseCost * Math.pow(1 + growthRate, 10));

  const elCost = document.getElementById("out-base-cost");
  const elBigha = document.getElementById("out-bigha");
  const elStamp = document.getElementById("out-stamp");
  const elTotal = document.getElementById("out-total-layout");
  const elVal3 = document.getElementById("out-val-3yr");
  const elVal5 = document.getElementById("out-val-5yr");
  const elVal10 = document.getElementById("out-val-10yr");

  if (elCost) elCost.innerText = "₹" + baseCost.toLocaleString('en-IN');
  if (elBigha) elBigha.innerText = bigha + " Bigha";
  if (elStamp) elStamp.innerText = "₹" + stampDuty.toLocaleString('en-IN');
  if (elTotal) elTotal.innerText = "₹" + totalLayout.toLocaleString('en-IN');
  if (elVal3) elVal3.innerText = "₹" + val3yr.toLocaleString('en-IN');
  if (elVal5) elVal5.innerText = "₹" + val5yr.toLocaleString('en-IN');
  if (elVal10) elVal10.innerText = "₹" + val10yr.toLocaleString('en-IN');
}

function dispatchToWhatsApp() {
  const proj = document.getElementById("calc-project-select").selectedOptions[0].text;
  const katha = document.getElementById("calc-katha").value;
  const sqft = document.getElementById("calc-sqft").value;
  const baseCost = document.getElementById("out-base-cost").innerText;

  const msg = encodeURIComponent(`Hello Township Capital, I have calculated a custom portfolio allocation:\n\n• Project: ${proj}\n• Area: ${katha} Katha (${sqft} Sq Ft)\n• Estimated Basis: ${baseCost}\n\nPlease dispatch verified title and demarcation records.`);
  window.open(`https://wa.me/919934200000?text=${msg}`, '_blank');
}

/* ---------------------------------------------------------
   5. CONSULTATION FORM DISPATCH
   --------------------------------------------------------- */
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("form-name").value;
  const phone = document.getElementById("form-phone").value;
  const project = document.getElementById("form-project").value;
  const budget = document.getElementById("form-budget").value;
  const notes = document.getElementById("form-notes").value;

  const text = `Township Capital Institutional Inquiry:\n\n• Investor: ${name}\n• Phone: ${phone}\n• Corridor: ${project}\n• Budget: ${budget}\n• Notes: ${notes || 'Immediate site inspection requested'}`;
  window.open(`https://wa.me/919934200000?text=${encodeURIComponent(text)}`, '_blank');
}

/* ---------------------------------------------------------
   6. BIHAR SPATIAL CORRIDOR MAP — data + base selectCorridor
   --------------------------------------------------------- */
const corridorDataMap = {
  all: { tag: 'Active Master Grid', id: 'OVERALL SPATIAL REGISTER', title: 'Greater Patna Metropolitan Region & Satellites', desc: 'Comprehensive multi-modal infrastructure envelope connecting core Patna to industrial logistics zones, education corridors, and tourism nodes under Bihar Master Plan 2031.', commute: '15 - 45 Min across nodes', road: '25ft to 35ft Dedications', catalyst: 'Danapur-Bihta Expressway & NH-131G', notes: 'All 5 portfolios physically acquired, mutation verified, and available for direct physical demarcated allocation.', ctaText: 'Explore 5 Portfolios', ctaLink: '#projects-section' },
  bihta: { tag: 'Tier 1 Priority Axis', id: 'CORRIDOR 01 • TECH & AVIATION', title: 'Bihta-Danapur Technology & Airport Corridor', desc: 'Nucleus of Bihar’s highest-velocity growth corridor anchored by IIT Patna, the 4-lane elevated corridor, and the under-construction Bihta Civil Enclave Airport.', commute: '22 Min to Core Patna / 5 Min to IIT', road: '30ft Arterial / 4-Lane Dedicated ROW', catalyst: 'Danapur-Bihta Elevated Highway & Airport', notes: 'Features Shuvida Enclave (Plots @ ₹1,499/sq ft) and Harmony Heights (Avatansa 3BHK @ ₹35L).', ctaText: 'Inspect Shuvida & Danapur Dossiers', ctaLink: '#dossier-bihta' },
  rajgir: { tag: 'Tourism & Sports SEZ', id: 'CORRIDOR 02 • SOVEREIGN HERITAGE', title: 'Patna-Rajgir Nalanda Express Corridor', desc: 'Fast-track sports and ecological tourism capital featuring the newly commissioned Rajgir International Cricket Stadium, Nature Safari, and Nalanda University campus.', commute: 'Direct 4-Lane Greenfield Expressway', road: '25ft to 30ft Internal Plotted Corridors', catalyst: 'BCCI International Stadium & Zoo Safari', notes: 'Home to Mountain Bliss (₹950/sq ft) with sovereign 1% Monthly Rental Assurance through Dec 2030.', ctaText: 'Inspect Mountain Bliss Rajgir', ctaLink: '#dossier-rajgir' },
  ekma: { tag: 'Western Commercial Hub', id: 'CORRIDOR 03 • FREIGHT & LOGISTICS', title: 'Saran / Ekma-Chapra NH-531 Expansion Spur', desc: 'Monumental 51.76 Bigha plotted township designed for industrial commercial growth connecting the Chhapra-Siwan freight artery directly to northern market basins.', commute: 'Immediate NH-531 highway linkage', road: '35ft Wide Main Arterial Boulevards', catalyst: 'Upcoming Notified Step Revision to ₹700', notes: 'Ekma City currently open at ₹551/sq ft prior to scheduled +27% statutory price step revision.', ctaText: 'Inspect Ekma City Saran', ctaLink: '#dossier-ekma' },
  telmar: { tag: 'Eastern Agro-Logistics', id: 'CORRIDOR 04 • ARTERIAL LOGISTICS', title: 'Telmar / Fatuha Southern Patna Artery', desc: 'High-calibre 120+ katha gated community directly connected to the Patna Ring Road interchange and state logistical warehouses.', commute: 'Direct Ring Road Spur Access', road: '30ft Arterial / 25ft Branch Avenues', catalyst: 'NH-131G Package 3 Paving Completion', notes: 'Ahana City offers luxury clubhouse amenities, swimming pool, and ₹1,500/sq ft launch window rate.', ctaText: 'Inspect Ahana City Telmar', ctaLink: '#dossier-ahana' },
  ring: { tag: 'Beltway Infrastructure', id: 'CORRIDOR 05 • RING EXPRESSWAY', title: 'Outer Patna Ring Road (NH-131G) Grid', desc: 'Sovereign 140km ring beltway systematically diverting inter-district heavy logistics around Patna through Naubatpur, Sampatchak, and Kanhauli interchanges.', commute: 'Zero congestion metropolitan bypass', road: '6-Lane Access-Controlled Expressway', catalyst: 'NHAI Package 3 & 4 Commissioning', notes: 'Propels 18-24% projected CAGR across peripheral plotted land tracts in southwest Patna.', ctaText: 'Simulate Corridor Growth', ctaLink: '#growth-engine' },
  patna: { tag: 'Metropolitan Core', id: 'CENTRAL REGISTRY BENCHMARK', title: 'Patna Urban Core (Bailey Road / Secretariat)', desc: 'High-density institutional benchmark exhibiting peak land scarcity with valuation benchmarks exceeding ₹180 Lakhs/Katha.', commute: 'Zero Distance (Core District)', road: 'Existing Municipal Right-of-Way', catalyst: 'Patna Metro Rail Project (Phase 1)', notes: 'Serves as pricing baseline for outward capital re-allocation into surrounding high-yield corridors.', ctaText: 'View Price Ledger Benchmarks', ctaLink: '#regional-corridors' }
};

function selectCorridor(key) {
  const data = corridorDataMap[key] || corridorDataMap.all;
  document.getElementById('audit-status-tag').innerText = data.tag;
  document.getElementById('audit-corridor-id').innerText = data.id;
  document.getElementById('audit-title').innerText = data.title;
  document.getElementById('audit-desc').innerText = data.desc;
  document.getElementById('audit-commute').innerText = data.commute;
  document.getElementById('audit-road').innerText = data.road;
  document.getElementById('audit-catalyst').innerText = data.catalyst;
  document.getElementById('audit-notes').innerText = data.notes;

  const cta = document.getElementById('audit-cta-primary');
  if (cta) {
    cta.href = data.ctaLink;
    document.getElementById('audit-cta-text').innerText = data.ctaText;
  }

  ['all', 'bihta', 'rajgir', 'ekma', 'telmar', 'ring'].forEach(k => {
    const btn = document.getElementById('btn-corridor-' + k);
    if (btn) {
      if (k === key) {
        btn.className = 'px-space-sm py-1 font-label-caps text-label-caps uppercase bg-primary text-on-primary transition-colors';
      } else {
        btn.className = 'px-space-sm py-1 font-label-caps text-label-caps uppercase bg-surface text-on-surface hover:bg-surface-container-highest transition-colors';
      }
    }
  });

  const routes = {
    bihta: document.getElementById('route-bihta'),
    rajgir: document.getElementById('route-rajgir'),
    ekma: document.getElementById('route-ekma'),
    telmar: document.getElementById('route-telmar'),
    ring: document.getElementById('route-ring')
  };
  Object.keys(routes).forEach(r => {
    const el = routes[r];
    if (!el) return;
    if (key === 'all') {
      el.setAttribute('opacity', r === 'ring' ? '0.75' : '0.9');
      el.setAttribute('stroke-width', r === 'ring' ? '2.5' : (r === 'ekma' ? '3.5' : '4'));
    } else if (key === r || (key === 'bihta' && r === 'bihta')) {
      el.setAttribute('opacity', '1');
      el.setAttribute('stroke-width', '6');
    } else {
      el.setAttribute('opacity', '0.2');
      el.setAttribute('stroke-width', '2');
    }
  });
}

/* ---------------------------------------------------------
   7. MAP HOVER TOOLTIP
   --------------------------------------------------------- */
(function () {
  const tooltipData = {
    'node-bihta': { title: 'Shuvida Enclave · Bihta', badge: 'Verified Deed', coreTime: '22 min via 4-Lane Elevated Hwy', airportTime: '10 min to Bihta Civil Enclave', railTime: '7 min to Bihta Junction (IIT: 5m)', row: '4-Lane Elevated / 30ft Arterial ROW' },
    'node-danapur': { title: 'Harmony Heights · Danapur', badge: 'Avatansa G+8', coreTime: '12–15 min to Core Bailey Rd', airportTime: '18 min to Patna City Airport (JPA)', railTime: '8 min to Danapur Junction', row: '35ft Paved Arterial Access Road' },
    'node-rajgir': { title: 'Mountain Bliss · Rajgir', badge: '1% Monthly Rent', coreTime: '65–75 min via 4-Lane NH-31/120', airportTime: 'Direct Tourist Expressway Corridor', railTime: '3 min to Stadium / 5m Zoo Safari', row: '30ft Heritage Internal Corridors' },
    'node-ekma': { title: 'Ekma City · Saran', badge: '51.76 Bigha', coreTime: '45–50 min via NH-131G Ring Spur', airportTime: '40 min to Proposed Saran Airstrip', railTime: '1 km (2 min) to Ekma Station / 25m Chapra', row: '35ft Boulevards / NH-531 Arterial' },
    'node-telmar': { title: 'Ahana City · Telmar', badge: '120+ Katha Club', coreTime: '28–35 min via 6-lane NH-31 Spur', airportTime: '35 min to Patna Airport via Ring Rd', railTime: '12 min to Fatuha Junction & ICD', row: '30ft Arterial / 25ft Branch Avenues' },
    'node-patna': { title: 'Patna Core (Bailey Rd / Secretariat)', badge: 'Sovereign Core', coreTime: '0 min (Capital Hub Benchmark)', airportTime: '10 min to Jay Prakash Airport (JPA)', railTime: '8 min to Patna Central Junction', row: 'Multi-Lane Metropolitan Arterials' },
    'node-ring': { title: 'Naubatpur & Outer Ring Node', badge: 'NH-131G Beltway', coreTime: '18 min to Patna Core via Khagaul Rd', airportTime: '20 min via Express Outer Beltway', railTime: 'Interchange directly on NH-131G', row: '6-Lane Access-Controlled Ring Road' }
  };

  const tooltipEl = document.getElementById('map-travel-tooltip');
  const titleEl = document.getElementById('tt-node-title');
  const badgeEl = document.getElementById('tt-node-badge');
  const coreEl = document.getElementById('tt-core-time');
  const airportEl = document.getElementById('tt-airport-time');
  const railEl = document.getElementById('tt-rail-time');
  const rowEl = document.getElementById('tt-row-detail');
  const mapContainer = tooltipEl ? tooltipEl.parentElement : null;
  if (!tooltipEl || !mapContainer) return;

  Object.keys(tooltipData).forEach(id => {
    const node = document.getElementById(id);
    if (!node) return;
    node.addEventListener('mouseenter', function (e) {
      const data = tooltipData[id];
      if (!data) return;
      titleEl.innerText = data.title;
      badgeEl.innerText = data.badge;
      coreEl.innerText = data.coreTime;
      airportEl.innerText = data.airportTime;
      railEl.innerText = data.railTime;
      rowEl.innerText = data.row;
      tooltipEl.classList.remove('opacity-0', 'translate-y-2');
      tooltipEl.classList.add('opacity-100', 'translate-y-0');
      updateTooltipPosition(e);
    });
    node.addEventListener('mousemove', function (e) {
      updateTooltipPosition(e);
    });
    node.addEventListener('mouseleave', function () {
      tooltipEl.classList.add('opacity-0', 'translate-y-2');
      tooltipEl.classList.remove('opacity-100', 'translate-y-0');
    });
  });

  function updateTooltipPosition(e) {
    const containerRect = mapContainer.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    const tooltipWidth = 310;
    const tooltipHeight = 165;
    let posX = mouseX + 18;
    let posY = mouseY - (tooltipHeight / 2);
    if (posX + tooltipWidth > containerRect.width - 15) {
      posX = mouseX - tooltipWidth - 18;
    }
    if (posY < 12) posY = 12;
    if (posY + tooltipHeight > containerRect.height - 12) {
      posY = containerRect.height - tooltipHeight - 12;
    }
    tooltipEl.style.left = posX + 'px';
    tooltipEl.style.top = posY + 'px';
  }
})();

/* ---------------------------------------------------------
   8. CORRIDOR <-> LEDGER SYNC
   (wraps window.selectCorridor to also highlight the ledger rows)
   --------------------------------------------------------- */
(function () {
  function updateLedgerHighlight(key) {
    var rows = document.querySelectorAll('#benchmark-ledger-rows > div');
    var pill = document.getElementById('ledger-filter-pill');
    var resetBtn = document.getElementById('ledger-reset-btn');
    if (!rows.length) return;

    if (key === 'all') {
      rows.forEach(function (r) { r.classList.remove('ledger-dimmed', 'ledger-highlight'); });
      if (pill) pill.classList.add('hidden');
      if (resetBtn) resetBtn.classList.add('hidden');
    } else {
      if (pill) {
        pill.textContent = 'Filtered: ' + key.toUpperCase();
        pill.classList.remove('hidden');
      }
      if (resetBtn) resetBtn.classList.remove('hidden');
      rows.forEach(function (r) {
        var match = r.getAttribute('data-corridor') === key;
        if (match) {
          r.classList.remove('ledger-dimmed');
          r.classList.add('ledger-highlight');
        } else {
          r.classList.remove('ledger-highlight');
          r.classList.add('ledger-dimmed');
        }
      });
    }
  }

  var origSelectCorridor = window.selectCorridor;
  window.selectCorridor = function (key) {
    if (typeof origSelectCorridor === 'function') {
      origSelectCorridor(key);
    }
    updateLedgerHighlight(key);
  };

  var rows = document.querySelectorAll('#benchmark-ledger-rows > div');
  rows.forEach(function (row) {
    row.style.cursor = 'pointer';
    row.addEventListener('click', function () {
      var corridorKey = this.getAttribute('data-corridor');
      if (corridorKey) {
        window.selectCorridor(corridorKey);
        var mapEl = document.getElementById('bihar-corridor-map-container');
        if (mapEl) {
          mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();

/* ---------------------------------------------------------
   9. CADASTRAL VIEWPORT PAN/ZOOM + SPOTLIGHT
   (wraps window.selectCorridor again to also pan/zoom the map,
   and exposes window.spotlightProjectOnMap for the "Spotlight on
   Map" buttons in each project dossier card)
   --------------------------------------------------------- */
(function () {
  const nodeCoordinates = {
    bihta: { x: 300, y: 265, scale: 1.85 },
    danapur: { x: 370, y: 255, scale: 1.95 },
    rajgir: { x: 490, y: 440, scale: 1.85 },
    ekma: { x: 190, y: 170, scale: 1.85 },
    telmar: { x: 640, y: 275, scale: 1.85 },
    patna: { x: 450, y: 250, scale: 1.75 },
    ring: { x: 450, y: 310, scale: 1.5 }
  };
  const allNodeIds = ['node-bihta', 'node-danapur', 'node-rajgir', 'node-ekma', 'node-telmar', 'node-patna', 'node-ring'];

  function applyMapPanZoom(corridorId) {
    const viewportLayer = document.getElementById('cadastral-viewport-layer');
    if (!viewportLayer) return;

    allNodeIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('node-active-spotlight', 'map-dimmed-element');
      }
    });

    if (!corridorId || corridorId === 'all' || !nodeCoordinates[corridorId]) {
      viewportLayer.style.transform = 'translate(0px, 0px) scale(1)';
      return;
    }

    const target = nodeCoordinates[corridorId];
    const targetNodeId = 'node-' + (corridorId === 'danapur' ? 'danapur' : corridorId);
    const scale = target.scale || 1.8;
    const viewBoxWidth = 880;
    const viewBoxHeight = 500;
    const transX = (viewBoxWidth / 2) - (target.x * scale);
    const transY = (viewBoxHeight / 2) - (target.y * scale);
    viewportLayer.style.transform = 'translate(' + transX + 'px, ' + transY + 'px) scale(' + scale + ')';

    allNodeIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === targetNodeId) {
          el.classList.add('node-active-spotlight');
        } else {
          el.classList.add('map-dimmed-element');
        }
      }
    });
  }

  const prevSelectCorridor = window.selectCorridor;
  window.selectCorridor = function (key) {
    if (typeof prevSelectCorridor === 'function') {
      prevSelectCorridor(key);
    }
    applyMapPanZoom(key);
  };

  window.spotlightProjectOnMap = function (projectKey) {
    const keyMap = { ahana: 'telmar', ekma: 'ekma', rajgir: 'rajgir', bihta: 'bihta', danapur: 'danapur' };
    const corr = keyMap[projectKey] || projectKey;
    if (typeof window.selectCorridor === 'function') {
      window.selectCorridor(corr);
    } else {
      applyMapPanZoom(corr);
    }
    const mapContainer = document.getElementById('bihar-corridor-map-container');
    if (mapContainer) {
      mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
})();

/* ---------------------------------------------------------
   INITIALIZATION
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderGrowthTable();
  calcRentalPayout();
  runSimulation();
  updateYieldOutputs();
});
