/* =============================================
   DASHBOARD APP  –  Vanilla JS
   ============================================= */

// ── Helpers ──────────────────────────────────
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function getLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function setLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Greeting & Clock ─────────────────────────
const GREETINGS = [
  { range: [5,  12], text: "Good morning"   },
  { range: [12, 18], text: "Good afternoon" },
  { range: [18, 22], text: "Good evening"   },
  { range: [22, 24], text: "Good night"     },
  { range: [0,   5], text: "Good night"     },
];

function getGreeting(hour) {
  return GREETINGS.find(g => hour >= g.range[0] && hour < g.range[1])?.text ?? "Hello";
}

function tickClock() {
  const now  = new Date();
  const h    = now.getHours();
  const m    = now.getMinutes().toString().padStart(2, "0");
  const s    = now.getSeconds().toString().padStart(2, "0");
  const hh   = h.toString().padStart(2, "0");

  $("#clock").textContent = `${hh}:${m}:${s}`;
  $("#greeting-text").textContent = getGreeting(h);

  const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
  $("#date-display").textContent =
    `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}
tickClock();
setInterval(tickClock, 1000);

// ── Custom Name ──────────────────────────────
let userName = getLS("dashboard_name", "Friend");

function renderName() {
  $("#user-name").textContent = userName;
}
renderName();

$("#edit-name-btn").addEventListener("click", openNameModal);
$("#user-name").addEventListener("click", openNameModal);

function openNameModal() {
  $("#name-input").value = userName === "Friend" ? "" : userName;
  $("#name-modal").classList.remove("hidden");
  setTimeout(() => $("#name-input").focus(), 50);
}

$("#name-save-btn").addEventListener("click", () => {
  const val = $("#name-input").value.trim();
  if (val) { userName = val; setLS("dashboard_name", userName); }
  renderName();
  $("#name-modal").classList.add("hidden");
});

$("#name-cancel-btn").addEventListener("click", () => {
  $("#name-modal").classList.add("hidden");
});

// Close modal on backdrop click
$("#name-modal").addEventListener("click", (e) => {
  if (e.target === $("#name-modal")) $("#name-modal").classList.add("hidden");
});

// ── Theme ─────────────────────────────────────
let isDark = getLS("dashboard_theme", true);

function applyTheme() {
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  $("#theme-toggle").textContent = isDark ? "🌙" : "☀️";
}
applyTheme();

$("#theme-toggle").addEventListener("click", () => {
  isDark = !isDark;
  setLS("dashboard_theme", isDark);
  applyTheme();
});

// ── Focus Timer ──────────────────────────────
let timerDuration = getLS("timer_duration", 25); // minutes
let timerRemaining = timerDuration * 60;          // seconds
let timerInterval  = null;
let timerRunning   = false;

const timerDisplay  = $("#timer-display");
const timerDurInput = $("#timer-duration");
const timerStatus   = $("#timer-status");

timerDurInput.value = timerDuration;

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timerRemaining);
}
renderTimer();

function setTimerState(state) {
  timerDisplay.classList.remove("running", "finished");
  if (state) timerDisplay.classList.add(state);
}

$("#timer-start").addEventListener("click", () => {
  if (timerRunning || timerRemaining === 0) return;
  timerRunning = true;
  setTimerState("running");
  timerStatus.textContent = "Focus session in progress…";

  timerInterval = setInterval(() => {
    timerRemaining--;
    renderTimer();
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      setTimerState("finished");
      timerStatus.textContent = "🎉 Session complete! Take a break.";
      // browser notification if permission granted
      if (Notification.permission === "granted") {
        new Notification("Focus session complete!", { body: "Time to take a break." });
      }
    }
  }, 1000);
});

$("#timer-stop").addEventListener("click", () => {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  setTimerState(null);
  timerStatus.textContent = "Paused.";
});

$("#timer-reset").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerRunning = false;
  timerRemaining = timerDuration * 60;
  renderTimer();
  setTimerState(null);
  timerStatus.textContent = "";
});

$("#timer-set").addEventListener("click", applyTimerDuration);
timerDurInput.addEventListener("keydown", (e) => { if (e.key === "Enter") applyTimerDuration(); });

function applyTimerDuration() {
  const val = parseInt(timerDurInput.value, 10);
  if (!val || val < 1 || val > 120) {
    timerStatus.textContent = "Please enter a duration between 1 and 120 minutes.";
    return;
  }
  clearInterval(timerInterval);
  timerRunning  = false;
  timerDuration = val;
  timerRemaining = timerDuration * 60;
  setLS("timer_duration", timerDuration);
  renderTimer();
  setTimerState(null);
  timerStatus.textContent = `Timer set to ${timerDuration} minute${timerDuration !== 1 ? "s" : ""}.`;
}

// Ask for notification permission on first Start click
$("#timer-start").addEventListener("click", () => {
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}, { once: true });

// ── To-Do List ───────────────────────────────
let tasks = getLS("dashboard_tasks", []);
// task shape: { id, text, done }

let editingTaskId = null;

function saveTasks()  { setLS("dashboard_tasks", tasks); }

function renderTasks() {
  const list = $("#todo-list");
  list.innerHTML = "";
  const empty = $("#todo-empty");

  if (tasks.length === 0) {
    empty.style.display = "";
    return;
  }
  empty.style.display = "none";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (task.done ? " done" : "");
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" class="task-check" ${task.done ? "checked" : ""} aria-label="Mark done" />
      <span class="task-text">${escapeHTML(task.text)}</span>
      <div class="todo-item-actions">
        <button class="task-btn edit-btn" title="Edit">✏️</button>
        <button class="task-btn delete-btn" title="Delete">🗑️</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function escapeHTML(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
            .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

function addTask() {
  const input = $("#todo-input");
  const text  = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  saveTasks();
  renderTasks();
  input.value = "";
  input.focus();
}

$("#todo-add-btn").addEventListener("click", addTask);
$("#todo-input").addEventListener("keydown", (e) => { if (e.key === "Enter") addTask(); });

// Delegate clicks on the list
$("#todo-list").addEventListener("click", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.classList.contains("task-check")) {
    const task = tasks.find(t => t.id === id);
    if (task) { task.done = e.target.checked; saveTasks(); renderTasks(); }
  }

  if (e.target.classList.contains("edit-btn")) {
    const task = tasks.find(t => t.id === id);
    if (task) openEditModal(task);
  }

  if (e.target.classList.contains("delete-btn")) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }
});

// Edit modal
function openEditModal(task) {
  editingTaskId = task.id;
  $("#edit-input").value = task.text;
  $("#edit-modal").classList.remove("hidden");
  setTimeout(() => $("#edit-input").focus(), 50);
}

$("#edit-save-btn").addEventListener("click", saveEdit);
$("#edit-input").addEventListener("keydown", (e) => { if (e.key === "Enter") saveEdit(); });

function saveEdit() {
  const text = $("#edit-input").value.trim();
  if (!text) return;
  const task = tasks.find(t => t.id === editingTaskId);
  if (task) { task.text = text; saveTasks(); renderTasks(); }
  $("#edit-modal").classList.add("hidden");
  editingTaskId = null;
}

$("#edit-cancel-btn").addEventListener("click", () => {
  $("#edit-modal").classList.add("hidden");
  editingTaskId = null;
});

$("#edit-modal").addEventListener("click", (e) => {
  if (e.target === $("#edit-modal")) {
    $("#edit-modal").classList.add("hidden");
    editingTaskId = null;
  }
});

renderTasks();

// ── Quick Links ──────────────────────────────
let links = getLS("dashboard_links", []);
// link shape: { id, name, url }

function saveLinks()  { setLS("dashboard_links", links); }

function renderLinks() {
  const grid  = $("#links-grid");
  const empty = $("#links-empty");
  grid.innerHTML = "";

  if (links.length === 0) {
    empty.style.display = "";
    return;
  }
  empty.style.display = "none";

  links.forEach((link) => {
    const a = document.createElement("a");
    a.className = "link-chip";
    a.href      = link.url;
    a.target    = "_blank";
    a.rel       = "noopener noreferrer";
    a.dataset.id = link.id;

    a.innerHTML = `
      ${escapeHTML(link.name)}
      <button class="link-remove" title="Remove link" data-id="${link.id}">✕</button>
    `;
    grid.appendChild(a);
  });
}

function addLink() {
  const nameInput = $("#link-name-input");
  const urlInput  = $("#link-url-input");
  const name = nameInput.value.trim();
  let   url  = urlInput.value.trim();

  if (!name || !url) return;

  // Auto-prepend https:// if missing
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  links.push({ id: Date.now(), name, url });
  saveLinks();
  renderLinks();
  nameInput.value = "";
  urlInput.value  = "";
  nameInput.focus();
}

$("#link-add-btn").addEventListener("click", addLink);
$("#link-url-input").addEventListener("keydown", (e) => { if (e.key === "Enter") addLink(); });

// Delegate remove button (stop propagation so the link doesn't navigate)
$("#links-grid").addEventListener("click", (e) => {
  const btn = e.target.closest(".link-remove");
  if (!btn) return;
  e.preventDefault();
  const id = Number(btn.dataset.id);
  links = links.filter(l => l.id !== id);
  saveLinks();
  renderLinks();
});

renderLinks();

// ── Keyboard shortcut: Escape closes modals ─
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $("#edit-modal").classList.add("hidden");
    $("#name-modal").classList.add("hidden");
    editingTaskId = null;
  }
});
