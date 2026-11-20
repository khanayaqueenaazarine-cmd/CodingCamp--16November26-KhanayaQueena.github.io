# Implementation Plan: Life Dashboard

## Overview

All features described in `requirements.md` and `design.md` are already implemented across three files: `index.html`, `css/style.css`, and `js/app.js`. Every task below is marked as completed and serves as a baseline record of what was built, grouped by feature area.

## Tasks

- [x] 1. Project setup — HTML skeleton, CSS file, JS file
  - [x] 1.1 Create `index.html` with `<html data-theme="dark">`, `<head>` meta/links, and script tag pointing to `js/app.js`
    - Define the base document structure and load order (stylesheet in `<head>`, script at end of `<body>`).
    - _Requirements: R1, R4, R14_
  - [x] 1.2 Create `css/style.css` with CSS custom-property tokens for both themes
    - Declare all design tokens on `:root` (light palette) and override palette tokens under `[data-theme="dark"]`.
    - _Requirements: R4, R14_
  - [x] 1.3 Create `js/app.js` with shared helper functions (`$`, `$$`, `getLS`, `setLS`, `escapeHTML`)
    - Implement `getLS` with `try/catch` fallback, `setLS` with `JSON.stringify`, and `escapeHTML` for XSS safety.
    - _Requirements: R8, R13_

- [x] 2. Clock and date display
  - [x] 2.1 Add `.topbar-center` markup to `index.html` with `#clock` and `#date-display` elements
    - Place both elements inside the sticky `<header class="topbar">`.
    - _Requirements: R1_
  - [x] 2.2 Style `.topbar-center`, `#clock`, and `#date-display` in `css/style.css`
    - Apply font size (`2rem` for clock), colour (`var(--accent)`), and centre alignment.
    - _Requirements: R1, R14_
  - [x] 2.3 Implement `tickClock()` in `js/app.js` and schedule it with `setInterval`
    - Format time as `HH:MM:SS` (zero-padded) and date as `{DayName}, {DayNumber} {MonthName} {FullYear}`; call once immediately then every 1000 ms.
    - _Requirements: R1.1, R1.2, R1.3, R1.4_

- [x] 3. Time-based greeting
  - [x] 3.1 Add `#greeting-text` element inside `.topbar-left` in `index.html`
    - Precedes the user-name span in the topbar left section.
    - _Requirements: R2_
  - [x] 3.2 Style `#greeting-text` in `css/style.css`
    - Muted colour (`var(--text-muted)`), appropriate font size.
    - _Requirements: R2_
  - [x] 3.3 Implement greeting logic inside `tickClock()` in `js/app.js` using a `GREETINGS` lookup array
    - Map hour ranges to: 05–11 → `Good morning`, 12–17 → `Good afternoon`, 18–21 → `Good evening`, 22–04 → `Good night`.
    - _Requirements: R2.1, R2.2, R2.3, R2.4, R2.5, R2.6_

- [x] 4. Custom user name and Name_Modal
  - [x] 4.1 Add `#user-name`, `#edit-name-btn`, and `#name-modal` markup to `index.html`
    - `#user-name` and `#edit-name-btn` inside `.topbar-left`; `#name-modal` with `class="modal hidden"` wrapping `.modal-box` containing `#name-input`, `#name-save-btn`, `#name-cancel-btn`.
    - _Requirements: R3_
  - [x] 4.2 Style the Name_Modal in `css/style.css`
    - Full-viewport overlay (`position: fixed; inset: 0`), semi-transparent backdrop, blurred `.modal-box`, `fadeIn` and `slideUp` keyframe animations.
    - _Requirements: R3, R15_
  - [x] 4.3 Implement the Custom Name Module in `js/app.js`
    - Load `dashboard_name` from `localStorage` (default `"Friend"`), implement `renderName()` and `openNameModal()`, wire `#edit-name-btn`, `#user-name`, `#name-save-btn`, `#name-cancel-btn`, and backdrop click; enforce 1–30 character limit; focus input within 50 ms on open.
    - _Requirements: R3.1, R3.2, R3.3, R3.4, R3.5, R3.6, R3.7, R3.8, R3.9, R3.10, R3.11, R3.12_

- [x] 5. Light/Dark theme toggle
  - [x] 5.1 Add `#theme-toggle` button inside `.topbar-right` in `index.html`
    - Button displays sun/moon emoji; initial emoji set by JavaScript on load.
    - _Requirements: R4_
  - [x] 5.2 Declare dark-theme override block in `css/style.css`
    - `[data-theme="dark"]` overrides the seven palette tokens; `body` carries transition for smooth switching.
    - _Requirements: R4.3, R4.4_
  - [x] 5.3 Implement the Theme Module in `js/app.js`
    - Load `dashboard_theme` boolean (default `true` = dark), implement `applyTheme()` to set `data-theme` and icon, call on startup and on `#theme-toggle` click; persist to `dashboard_theme`.
    - _Requirements: R4.1, R4.2, R4.3, R4.4, R4.5, R4.6_

- [x] 6. Focus Timer — display and duration setting
  - [x] 6.1 Add `section.card.timer-card` markup to `index.html`
    - Contains `#timer-display`, Start/Stop/Reset buttons (`#timer-start`, `#timer-stop`, `#timer-reset`), duration input `#timer-duration`, Set button `#timer-set`, and status paragraph `#timer-status`.
    - _Requirements: R5_
  - [x] 6.2 Style the timer card in `css/style.css`
    - `#timer-display` at `3.5rem`, colour `var(--accent)`; `.running` override to `var(--success)`; `.finished` override to `var(--danger)`.
    - _Requirements: R5, R6_
  - [x] 6.3 Implement timer state variables and `applyTimerDuration()` in `js/app.js`
    - Declare `timerDuration`, `timerRemaining`, `timerInterval`, `timerRunning`; implement `formatTime()` and `renderTimer()`; `applyTimerDuration()` validates 1–120 range, updates state, persists to `timer_duration`.
    - _Requirements: R5.1, R5.2, R5.3, R5.4, R5.5_

- [x] 7. Focus Timer — start, stop, reset
  - [x] 7.1 Wire `#timer-start`, `#timer-stop`, and `#timer-reset` click handlers in `js/app.js`
    - Start: guard `timerRunning`/`timerRemaining===0`, set interval, apply `.running` class, show status text. Stop: guard `!timerRunning`, clear interval, remove class. Reset: clear interval, restore `timerDuration*60`, re-render, clear classes.
    - _Requirements: R6.1, R6.2, R6.3, R6.4, R6.5, R6.6, R6.7_
  - [x] 7.2 Add CSS transitions for button states in `css/style.css`
    - Hover and active states using `var(--accent-hover)`, `var(--danger-hover)`, `var(--warning)` for Start, Stop, Reset respectively.
    - _Requirements: R6_

- [x] 8. Focus Timer — completion state and desktop notification
  - [x] 8.1 Implement countdown-completion branch inside the `setInterval` callback in `js/app.js`
    - When `timerRemaining` reaches zero: clear interval, `timerRunning = false`, call `setTimerState("finished")`, set status text `🎉 Session complete! Take a break.`, fire `Notification` if permission is `"granted"`.
    - _Requirements: R7.1, R7.2, R7.4, R7.5_
  - [x] 8.2 Implement one-time Notification permission request on first Start click in `js/app.js`
    - Attach `{ once: true }` listener to `#timer-start` that calls `Notification.requestPermission()` only when permission is `"default"`.
    - _Requirements: R7.3, R7.6_

- [x] 9. To-Do List — add tasks
  - [x] 9.1 Add `section.card.todo-card` markup to `index.html`
    - Contains `#todo-input` (maxlength 120), `#todo-add-btn`, `<ul id="todo-list">`, and empty-state hint `#todo-empty`.
    - _Requirements: R8_
  - [x] 9.2 Style the to-do card in `css/style.css`
    - `#todo-list` with `max-height: 360px; overflow-y: auto`; task row layout; `.done` class applies strikethrough and `opacity ≤ 0.5`.
    - _Requirements: R8, R9, R10_
  - [x] 9.3 Implement `addTask()`, `saveTasks()`, and `renderTasks()` in `js/app.js`
    - Load `dashboard_tasks` on startup; `addTask()` trims input, creates `{ id: Date.now(), text, done: false }`, appends, persists, re-renders, clears input; `renderTasks()` uses `escapeHTML` and toggles empty-state hint.
    - _Requirements: R8.1, R8.2, R8.3, R8.4, R8.5_

- [x] 10. To-Do List — complete and edit tasks
  - [x] 10.1 Implement event delegation on `#todo-list` for toggle and edit actions in `js/app.js`
    - Single click listener; dispatch to toggle-done or `openEditModal` via `e.target.classList`.
    - _Requirements: R9.1, R9.2, R9.3, R9.4_
  - [x] 10.2 Add `#edit-modal` markup to `index.html`
    - Hidden overlay with `#edit-input` (maxlength 120), `#edit-save-btn`, `#edit-cancel-btn`.
    - _Requirements: R9, R15_
  - [x] 10.3 Style the Edit_Modal in `css/style.css`
    - Shares modal pattern with Name_Modal; apply same `fadeIn`/`slideUp` animations.
    - _Requirements: R9, R15_
  - [x] 10.4 Implement `openEditModal()` and `saveEdit()` in `js/app.js`
    - `openEditModal(task)` sets `editingTaskId`, populates `#edit-input`, removes `.hidden`, focuses within 50 ms. `saveEdit()` trims value, validates non-empty, updates task text, persists, re-renders, closes modal; shows validation indicator on empty save attempt.
    - _Requirements: R9.4, R9.5, R9.6, R9.7, R9.8, R9.9, R9.10, R9.11_

- [x] 11. To-Do List — delete tasks and empty state
  - [x] 11.1 Implement delete dispatch inside the `#todo-list` event delegation handler in `js/app.js`
    - Filter task by array index on `.delete-btn` click, call `saveTasks()`, call `renderTasks()`.
    - _Requirements: R10.1_
  - [x] 11.2 Implement empty-state toggling inside `renderTasks()` in `js/app.js`
    - Show `#todo-empty` and hide `#todo-list` when array is empty; reverse when non-empty; preserve insertion order.
    - _Requirements: R10.2, R10.3, R10.4_
  - [x] 11.3 Apply `max-height` and scroll CSS to `#todo-list` in `css/style.css`
    - `max-height: 360px; overflow-y: auto`.
    - _Requirements: R10.5_

- [x] 12. Quick Links — add and open links
  - [x] 12.1 Add `section.card.links-card` markup to `index.html`
    - Contains `#link-name-input` (maxlength 30), `#link-url-input` (maxlength 300), `#link-add-btn`, `#links-grid`, and empty-state hint `#links-empty`.
    - _Requirements: R11_
  - [x] 12.2 Style the links card and `.link-chip` in `css/style.css`
    - Chip layout with accent background, hover state, remove button (✕) positioned absolutely; grid wrap for `#links-grid`.
    - _Requirements: R11, R12_
  - [x] 12.3 Implement `addLink()`, `saveLinks()`, and `renderLinks()` in `js/app.js`
    - Load `dashboard_links` on startup; `addLink()` trims both inputs, prepends `https://` when missing, validates non-empty and non-bare-protocol URL, pushes `{ id: Date.now(), name, url }`, persists, re-renders, clears inputs; each chip rendered as `<a target="_blank" rel="noopener noreferrer">`.
    - _Requirements: R11.1, R11.2, R11.3, R11.4, R11.5, R11.6, R11.7, R11.8, R11.9, R11.10_

- [x] 13. Quick Links — remove links and empty state
  - [x] 13.1 Implement event delegation on `#links-grid` for remove action in `js/app.js`
    - `click` listener calls `e.target.closest(".link-remove")`; if matched, `e.preventDefault()`, filter link, persist, re-render; handle `setLS` failure by retaining link and showing error.
    - _Requirements: R12.1, R12.2_
  - [x] 13.2 Implement empty-state toggling inside `renderLinks()` in `js/app.js`
    - Show `#links-empty` and hide `#links-grid` when array is empty; reverse when non-empty.
    - _Requirements: R12.3, R12.4_

- [x] 14. Data persistence — LocalStorage helpers
  - [x] 14.1 Implement `getLS(key, fallback)` in `js/app.js`
    - Wraps `JSON.parse(localStorage.getItem(key))` in `try/catch`; returns `fallback` on absent key or parse error without overwriting stored entry.
    - _Requirements: R13.1, R13.2_
  - [x] 14.2 Implement `setLS(key, value)` in `js/app.js`
    - Wraps `localStorage.setItem(key, JSON.stringify(value))`.
    - _Requirements: R13.1_
  - [x] 14.3 Wire startup reads for all five keys in `js/app.js`
    - On script execution read `dashboard_name`, `dashboard_theme`, `timer_duration`, `dashboard_tasks`, `dashboard_links` and restore in-memory state before any render call.
    - _Requirements: R13.3, R13.6_
  - [x] 14.4 Verify synchronous write after each mutation in `js/app.js`
    - Confirm `saveTasks()` and `saveLinks()` are called immediately after every add/toggle/edit/delete so `JSON.parse(localStorage.getItem(key))` deep-equals the live array.
    - _Requirements: R13.4, R13.5_

- [x] 15. Responsive layout — media query
  - [x] 15.1 Apply `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))` and `max-width: 1200px` to `.dashboard` in `css/style.css`
    - Automatic multi-column reflow; centred with `margin: 0 auto`.
    - _Requirements: R14.1, R14.2_
  - [x] 15.2 Add `@media (max-width: 600px)` block in `css/style.css`
    - Reduce topbar padding to `0.8rem 1rem`, `#clock` font to `1.5rem`, `#timer-display` font to `2.6rem`, `.dashboard` padding to `1rem` and gap to `1rem`.
    - _Requirements: R14.3, R14.4, R14.5_

- [x] 16. Keyboard and modal accessibility
  - [x] 16.1 Implement global `keydown` listener in `js/app.js`
    - On `Escape`: add `.hidden` to both `#edit-modal` and `#name-modal`, reset `editingTaskId` to `null`; no-op when neither is open.
    - _Requirements: R15.1, R15.2, R15.3_
  - [x] 16.2 Implement backdrop-click close for both modals in `js/app.js`
    - `click` listener on each modal overlay; close only when `e.target === modalElement` (not `.modal-box` children).
    - _Requirements: R15.4, R15.5_
  - [x] 16.3 Implement focus management on modal open and close in `js/app.js`
    - `openNameModal()` focuses `#name-input` after 50 ms; `openEditModal()` focuses `#edit-input` after 50 ms; store triggering element reference and restore focus on close.
    - _Requirements: R15.6, R15.7, R15.8_
  - [x] 16.4 Enforce single-modal-at-a-time rule in `js/app.js`
    - Both `openNameModal()` and `openEditModal()` add `.hidden` to the other modal before opening their own.
    - _Requirements: R15.9_

## Notes

- All tasks are marked as completed. This document is a baseline record of the existing implementation.
- Each task references the requirements it satisfies for full traceability.
- Sub-tasks break down work at the file level: HTML structure, CSS styling, and JS logic.
- Tasks marked with `*` (optional test sub-tasks) are not present here — the existing codebase does not include automated tests; test tasks can be added as new tasks when needed.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "3.1", "4.1", "5.1", "6.1", "9.1", "10.2", "12.1"] },
    { "id": 2, "tasks": ["2.2", "3.2", "4.2", "5.2", "6.2", "7.2", "9.2", "10.3", "11.3", "12.2", "15.1"] },
    { "id": 3, "tasks": ["2.3", "3.3", "4.3", "5.3", "6.3", "9.3", "14.1", "14.2"] },
    { "id": 4, "tasks": ["7.1", "8.1", "8.2", "10.1", "10.4", "11.1", "11.2", "12.3", "13.1", "13.2", "14.3", "14.4", "15.2"] },
    { "id": 5, "tasks": ["16.1", "16.2", "16.3", "16.4"] }
  ]
}
```
