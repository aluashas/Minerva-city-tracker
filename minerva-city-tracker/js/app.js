/* =============================================
   Minerva City Rotation Tracker — app.js
   ============================================= */

// ── State ──────────────────────────────────────
const state = {
  activeView: "map",
  selectedCity: null,
  planner: {},      // { cityId: { goals, experiences, reflections } }
  deadlines: [],
};

// ── Boot ───────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();
  buildCityList();
  buildPlannerGrid();
  buildDeadlineTimeline();
  populateCitySelect();
  bindNav();
  bindDeadlineAdd();
  bindModal();
});

// ── Storage ────────────────────────────────────
function loadFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem("minerva_tracker") || "{}");
    state.planner = saved.planner || {};
    state.deadlines = saved.deadlines || [...DEFAULT_DEADLINES];
  } catch {
    state.deadlines = [...DEFAULT_DEADLINES];
  }
}

function saveToStorage() {
  localStorage.setItem("minerva_tracker", JSON.stringify({
    planner: state.planner,
    deadlines: state.deadlines,
  }));
}

// ── Navigation ─────────────────────────────────
function bindNav() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
      document.getElementById("view-" + view).classList.add("active");
      state.activeView = view;
    });
  });
}

// ── MAP VIEW ───────────────────────────────────
function buildCityList() {
  const list = document.getElementById("cityList");
  list.innerHTML = CITIES.map((city, i) => `
    <div class="city-card" data-id="${city.id}" style="animation-delay:${i * 60}ms">
      <div class="city-card-flag">${city.flag}</div>
      <div class="city-card-body">
        <div class="city-card-name">${city.name}</div>
        <div class="city-card-semester">${city.semester}</div>
        <div class="city-card-dates">${city.dates.start} – ${city.dates.end}</div>
      </div>
      <div class="city-card-arrow">→</div>
    </div>
  `).join("");

  list.querySelectorAll(".city-card").forEach(card => {
    card.addEventListener("click", () => selectCity(card.dataset.id));
  });
}

function selectCity(id) {
  state.selectedCity = id;
  const city = CITIES.find(c => c.id === id);

  document.querySelectorAll(".city-card").forEach(c => {
    c.classList.toggle("active", c.dataset.id === id);
  });

  const panel = document.getElementById("detailPanel");
  panel.style.opacity = 0;
  setTimeout(() => {
    panel.innerHTML = renderCityDetail(city);
    panel.style.opacity = 1;
    panel.querySelector(".btn-planner")?.addEventListener("click", () => openPlannerModal(city));
  }, 150);
}

function renderCityDetail(city) {
  return `
    <div class="detail-hero" style="border-color:${city.color}">
      <div class="detail-emoji">${city.emoji}</div>
      <div class="detail-hero-text">
        <h2 class="detail-city-name">${city.name} ${city.flag}</h2>
        <p class="detail-tagline">"${city.tagline}"</p>
        <div class="detail-meta">
          <span class="tag">${city.semester}</span>
          <span class="tag">${city.dates.start} → ${city.dates.end}</span>
        </div>
      </div>
    </div>

    <p class="detail-desc">${city.description}</p>

    <div class="detail-sections">
      <div class="detail-section">
        <h4>✦ Highlights</h4>
        <ul>${city.highlights.map(h => `<li>${h}</li>`).join("")}</ul>
      </div>

      <div class="detail-section">
        <h4>📅 Key Deadlines</h4>
        <ul class="deadline-list">${city.deadlines.map(d => `
          <li><span class="dl-label">${d.label}</span><span class="dl-date">${d.date}</span></li>
        `).join("")}</ul>
      </div>

      <div class="detail-section">
        <h4>🔗 Resources</h4>
        <ul class="resource-list">${city.resources.map(r => `
          <li><a href="${r.url}" target="_blank">${r.label}</a></li>
        `).join("")}</ul>
      </div>

      <div class="detail-tip">
        <span class="tip-label">💡 Student Tip</span>
        <p>${city.tips}</p>
      </div>
    </div>

    <button class="btn-primary btn-planner">Open My Planner for ${city.name} →</button>
  `;
}

// ── PLANNER VIEW ───────────────────────────────
function buildPlannerGrid() {
  const grid = document.getElementById("plannerGrid");
  grid.innerHTML = CITIES.map(city => {
    const p = state.planner[city.id] || {};
    return `
      <div class="planner-card" data-id="${city.id}" style="--city-color:${city.color}">
        <div class="planner-card-header">
          <span class="planner-flag">${city.flag}</span>
          <div>
            <div class="planner-city-name">${city.name}</div>
            <div class="planner-semester">${city.semester}</div>
          </div>
        </div>
        <div class="planner-fields">
          <label>My Goals</label>
          <textarea data-field="goals" placeholder="What do you want to achieve in ${city.name}?">${p.goals || ""}</textarea>
          <label>Experiences</label>
          <textarea data-field="experiences" placeholder="Log memorable moments…">${p.experiences || ""}</textarea>
          <label>Reflections</label>
          <textarea data-field="reflections" placeholder="What did you learn about yourself?">${p.reflections || ""}</textarea>
        </div>
        <button class="btn-save" data-id="${city.id}">Save ✓</button>
      </div>
    `;
  }).join("");

  grid.querySelectorAll(".btn-save").forEach(btn => {
    btn.addEventListener("click", () => savePlanner(btn.dataset.id, btn.closest(".planner-card")));
  });
}

function savePlanner(cityId, card) {
  const fields = {};
  card.querySelectorAll("textarea").forEach(ta => {
    fields[ta.dataset.field] = ta.value;
  });
  state.planner[cityId] = fields;
  saveToStorage();
  const btn = card.querySelector(".btn-save");
  btn.textContent = "Saved ✓";
  btn.classList.add("saved");
  setTimeout(() => { btn.textContent = "Save ✓"; btn.classList.remove("saved"); }, 1500);
}

function openPlannerModal(city) {
  const p = state.planner[city.id] || {};
  const content = document.getElementById("modalContent");
  content.innerHTML = `
    <h2>${city.flag} ${city.name} Planner</h2>
    <p class="modal-sub">${city.semester} · ${city.dates.start} – ${city.dates.end}</p>
    <div class="modal-fields">
      <label>My Goals</label>
      <textarea id="m-goals" placeholder="What do you want to achieve?">${p.goals || ""}</textarea>
      <label>Experiences</label>
      <textarea id="m-experiences" placeholder="Log memorable moments…">${p.experiences || ""}</textarea>
      <label>Reflections</label>
      <textarea id="m-reflections" placeholder="What did you learn about yourself?">${p.reflections || ""}</textarea>
    </div>
    <button class="btn-primary" id="modalSave">Save Planner</button>
  `;
  document.getElementById("modalSave").addEventListener("click", () => {
    state.planner[city.id] = {
      goals: document.getElementById("m-goals").value,
      experiences: document.getElementById("m-experiences").value,
      reflections: document.getElementById("m-reflections").value,
    };
    saveToStorage();
    buildPlannerGrid();
    closeModal();
  });
  openModal();
}

// ── DEADLINES VIEW ─────────────────────────────
function buildDeadlineTimeline() {
  const container = document.getElementById("deadlineTimeline");
  const sorted = [...state.deadlines].sort((a, b) => new Date(a.date) - new Date(b.date));
  const today = new Date();

  if (sorted.length === 0) {
    container.innerHTML = `<p class="empty-state">No deadlines yet. Add one below!</p>`;
    return;
  }

  container.innerHTML = sorted.map(d => {
    const dDate = new Date(d.date);
    const isPast = dDate < today;
    const city = CITIES.find(c => c.id === d.city);
    const daysUntil = Math.ceil((dDate - today) / (1000 * 60 * 60 * 24));
    const urgency = daysUntil <= 7 && !isPast ? "urgent" : daysUntil <= 30 && !isPast ? "soon" : "";
    return `
      <div class="deadline-item ${isPast ? "past" : ""} ${urgency}">
        <div class="deadline-dot" style="${city ? "background:" + city.color : ""}"></div>
        <div class="deadline-body">
          <div class="deadline-title">${d.title}</div>
          <div class="deadline-meta">
            ${city ? `<span class="dl-city">${city.flag} ${city.name}</span>` : "<span class='dl-city'>All Rotations</span>"}
            <span class="dl-date-pill ${isPast ? "past" : urgency}">${formatDate(d.date)}${!isPast ? ` · ${daysUntil}d` : " · Done"}</span>
          </div>
        </div>
        ${!d.system ? `<button class="dl-delete" data-id="${d.id}">✕</button>` : ""}
      </div>
    `;
  }).join("");

  container.querySelectorAll(".dl-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      state.deadlines = state.deadlines.filter(d => d.id !== btn.dataset.id);
      saveToStorage();
      buildDeadlineTimeline();
    });
  });
}

function populateCitySelect() {
  const sel = document.getElementById("deadlineCity");
  CITIES.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.flag} ${c.name}`;
    sel.appendChild(opt);
  });
}

function bindDeadlineAdd() {
  document.getElementById("addDeadlineBtn").addEventListener("click", () => {
    const title = document.getElementById("deadlineTitle").value.trim();
    const city = document.getElementById("deadlineCity").value;
    const date = document.getElementById("deadlineDate").value;
    if (!title || !date) return;
    state.deadlines.push({
      id: "u_" + Date.now(),
      title, city, date, system: false,
    });
    saveToStorage();
    buildDeadlineTimeline();
    document.getElementById("deadlineTitle").value = "";
    document.getElementById("deadlineDate").value = "";
  });
}

// ── MODAL ──────────────────────────────────────
function bindModal() {
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", e => {
    if (e.target === document.getElementById("modalOverlay")) closeModal();
  });
}
function openModal() { document.getElementById("modalOverlay").classList.add("active"); }
function closeModal() { document.getElementById("modalOverlay").classList.remove("active"); }

// ── UTILS ──────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
