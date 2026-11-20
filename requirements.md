# Requirements Document

## Introduction

The Life Dashboard is a single-page, client-side web application that serves as a personal productivity hub. It presents a live clock with a time-based greeting, a customisable user name, a light/dark theme toggle, a countdown focus timer with desktop notifications, a to-do list, and a quick-links launcher. All user data is persisted in the browser's `localStorage` with no server component. The application is fully implemented in vanilla HTML, CSS, and JavaScript across three files (`index.html`, `css/style.css`, `js/app.js`).

---

## Glossary

- **Dashboard**: The full single-page application rendered in `index.html`.
- **Topbar**: The sticky header bar containing the greeting, clock, and theme toggle.
- **Clock**: The live `HH:MM:SS` time display in the Topbar.
- **Greeting**: The time-of-day salutation shown to the left of the user name in the Topbar.
- **User_Name**: The personalised display name shown in the Topbar, editable via the Name Modal.
- **Name_Modal**: The overlay dialog used to change the User_Name.
- **Theme_Toggle**: The button in the Topbar that switches between dark and light themes.
- **Focus_Timer**: The countdown timer widget on the dashboard.
- **Timer_Display**: The `MM:SS` numeric display inside the Focus_Timer card.
- **To_Do_List**: The task-management widget on the dashboard.
- **Task**: A single item in the To_Do_List, with an `id`, `text`, and `done` flag.
- **Edit_Modal**: The overlay dialog used to edit an existing Task's text.
- **Quick_Links**: The bookmarks widget on the dashboard.
- **Link**: A single item in the Quick_Links widget, with an `id`, `name`, and `url`.
- **LocalStorage**: The browser's `localStorage` API used for all persistence.
- **escapeHTML**: The function that replaces `&`, `<`, `>`, `"`, `'` with their HTML entities before inserting user-supplied text into the DOM.

---

## Requirements

### Requirement 1: Greeting Header — Live Clock

**User Story:** As a user, I want to see a live clock and today's date in the Topbar, so that I always know the current time without leaving the page.

#### Acceptance Criteria

1. WHEN the DOM content has finished loading, THE Dashboard SHALL render the Clock display with the current local time and date using the formats defined in criteria 3 and 4, before the first interval tick fires.
2. WHEN the DOM content has finished loading, THE Dashboard SHALL start a 1-second interval that updates the Clock and date display on every tick.
3. WHEN the Clock is updated, THE Dashboard SHALL display the current local time in `HH:MM:SS` format with zero-padded hours, minutes, and seconds.
4. WHEN the Clock is updated, THE Dashboard SHALL display the current date in the format `{DayName}, {DayNumber} {MonthName} {FullYear}` (e.g. `Saturday, 21 November 2026`), using full English day and month names.

---

### Requirement 2: Greeting Header — Time-Based Greeting

**User Story:** As a user, I want a greeting that reflects the time of day, so that the page feels personal and contextually aware.

#### Acceptance Criteria

1. WHEN the hour is between 05:00 (inclusive) and 12:00 (exclusive), THE Dashboard SHALL display the greeting text `Good morning`.
2. WHEN the hour is between 12:00 (inclusive) and 18:00 (exclusive), THE Dashboard SHALL display the greeting text `Good afternoon`.
3. WHEN the hour is between 18:00 (inclusive) and 22:00 (exclusive), THE Dashboard SHALL display the greeting text `Good evening`.
4. WHEN the hour is between 22:00 (inclusive) and 24:00 (exclusive) or between 00:00 (inclusive) and 05:00 (exclusive), THE Dashboard SHALL display the greeting text `Good night`.
5. THE Dashboard SHALL determine the current hour using the user's local device time.
6. WHEN the user's local device time crosses an hour boundary, THE Dashboard SHALL update the greeting text without requiring a page reload.

---

### Requirement 3: Custom User Name

**User Story:** As a user, I want to set a personal name that appears in the Topbar greeting, so that the dashboard feels like it belongs to me.

#### Acceptance Criteria

1. WHEN the page is loaded and LocalStorage key `dashboard_name` contains a non-empty value, THE Dashboard SHALL display that stored value as the User_Name in the Topbar greeting.
2. IF the page is loaded and LocalStorage key `dashboard_name` is absent or empty, THEN THE Dashboard SHALL display `Friend` as the default User_Name in the Topbar greeting.
3. WHEN the user clicks the User_Name element or the edit-name button, THE Dashboard SHALL open the Name_Modal.
4. WHEN the Name_Modal opens and the current User_Name is `Friend`, THE Dashboard SHALL pre-clear the name input field.
5. WHEN the Name_Modal opens and the current User_Name is not `Friend`, THE Dashboard SHALL pre-fill the name input with the current User_Name.
6. WHEN the Name_Modal opens, THE Dashboard SHALL move keyboard focus to the name input field within 50 ms.
7. WHEN the user submits a name containing at least 1 non-whitespace character in the Name_Modal, THE Dashboard SHALL update the displayed User_Name with the trimmed value, write the trimmed value to LocalStorage key `dashboard_name`, and close the Name_Modal.
8. IF the user submits an empty name or a name consisting entirely of whitespace characters in the Name_Modal, THEN THE Dashboard SHALL keep the current User_Name unchanged, leave LocalStorage unmodified, and keep the Name_Modal open.
9. WHEN the user clicks the Cancel button in the Name_Modal, THE Dashboard SHALL close the Name_Modal without changing the User_Name or LocalStorage.
10. WHEN the user clicks the backdrop of the Name_Modal, THE Dashboard SHALL close the Name_Modal without changing the User_Name or LocalStorage.
11. WHEN the user presses the Escape key while the Name_Modal is open, THE Dashboard SHALL close the Name_Modal without changing the User_Name or LocalStorage.
12. THE Name_Modal input SHALL accept between 1 and 30 characters, rejecting any input that exceeds 30 characters.

---

### Requirement 4: Light / Dark Theme

**User Story:** As a user, I want to toggle between a dark and a light colour scheme, so that I can match the dashboard to my environment or preference.

#### Acceptance Criteria

1. WHEN the page is loaded and LocalStorage key `dashboard_theme` holds the value `"dark"` or `"light"`, THE Dashboard SHALL apply that stored theme immediately.
2. IF the page is loaded and LocalStorage key `dashboard_theme` is absent, empty, or holds a value other than `"dark"` or `"light"`, THEN THE Dashboard SHALL default to the dark theme.
3. WHEN the dark theme is active, THE Dashboard SHALL set `data-theme="dark"` on the `<html>` element and display the Theme_Toggle icon as `🌙`.
4. WHEN the light theme is active, THE Dashboard SHALL set `data-theme="light"` on the `<html>` element and display the Theme_Toggle icon as `☀️`.
5. WHEN the user clicks the Theme_Toggle button, THE Dashboard SHALL switch to the opposite theme, update the `data-theme` attribute and icon accordingly, and write the new theme name as the string `"dark"` or `"light"` to LocalStorage key `dashboard_theme`.
6. WHEN the page is loaded, THE Dashboard SHALL apply the theme before rendering any visible content, so that the correct `data-theme` attribute is set on the `<html>` element prior to the first CSS paint.

---

### Requirement 5: Focus Timer — Display and Duration

**User Story:** As a user, I want to set a countdown timer for focused work sessions, so that I can manage my time with a Pomodoro-style workflow.

#### Acceptance Criteria

1. WHEN the page is loaded, THE Dashboard SHALL read the timer duration from LocalStorage key `timer_duration` and use that value as the active duration if it is a whole number between 1 and 120 inclusive.
2. IF the page is loaded and LocalStorage key `timer_duration` is absent, empty, non-numeric, or outside the range 1–120, THEN THE Dashboard SHALL default the active duration to 25 minutes.
3. WHEN the page is loaded, THE Dashboard SHALL initialise the Timer_Display to `{active duration}:00` in MM:SS format with zero-padded minutes and seconds.
4. WHEN the user enters a whole number between 1 and 120 inclusive in the duration input and clicks the Set button or presses Enter, THE Focus_Timer SHALL update the active duration to that value, reset the remaining time to that value multiplied by 60 seconds, stop any running countdown, clear the timer status text, and write the new duration to LocalStorage key `timer_duration`.
5. IF the user enters a value outside 1–120 or a non-numeric value in the duration input and clicks the Set button or presses Enter, THEN THE Focus_Timer SHALL display a status message indicating the duration must be between 1 and 120 minutes and leave the active duration, remaining time, and countdown state unchanged.

---

### Requirement 6: Focus Timer — Start, Stop, Reset

**User Story:** As a user, I want to start, pause, and reset the focus timer, so that I can control my session flexibly.

#### Acceptance Criteria

1. WHEN the user clicks the Start button and the timer is not running and the remaining time is greater than zero, THE Focus_Timer SHALL begin counting down one second per real second, updating the Timer_Display on each tick, and display the status text `Focus session in progress…`.
2. WHILE the Focus_Timer is counting down, THE Dashboard SHALL apply the CSS class `running` to the Timer_Display element (which renders it in the success/green colour).
3. IF the user clicks the Start button while the timer is already running or the remaining time is zero, THEN THE Focus_Timer SHALL ignore the click.
4. WHEN the user clicks the Stop button and the Focus_Timer is running, THE Focus_Timer SHALL pause the countdown, clear the interval, remove the CSS class `running` from the Timer_Display, and display the status text `Paused.`
5. IF the user clicks the Stop button when the Focus_Timer is not running, THEN THE Focus_Timer SHALL ignore the click.
6. WHEN the user clicks the Reset button, THE Focus_Timer SHALL stop any running countdown, restore the remaining time to `timerDuration × 60` seconds where `timerDuration` is a whole number between 1 and 120 inclusive, update the Timer_Display, clear the status text, and remove any CSS state classes from the Timer_Display.
7. WHEN the Focus_Timer countdown reaches zero, THE Focus_Timer SHALL stop the countdown, clear the interval, and remove the CSS class `running` from the Timer_Display.

---

### Requirement 7: Focus Timer — Completion and Notification

**User Story:** As a user, I want to be notified when my focus session ends, so that I know to take a break even if I am not watching the screen.

#### Acceptance Criteria

1. WHEN the Focus_Timer countdown reaches zero, THE Focus_Timer SHALL stop the countdown and apply the CSS class `finished` to the Timer_Display.
2. WHEN the Focus_Timer countdown reaches zero, THE Focus_Timer SHALL display the status text `🎉 Session complete! Take a break.`
3. WHEN the user clicks the Start button and no Notification permission decision has been recorded in the current page session, THE Dashboard SHALL request the browser's Notification permission from the user.
4. WHEN the Focus_Timer countdown reaches zero and the browser's Notification permission is `granted`, THE Dashboard SHALL fire a desktop notification with the title `Focus session complete!` and body text `Time to take a break.`
5. IF the browser's Notification permission is not `granted` when the Focus_Timer reaches zero, THEN THE Dashboard SHALL not attempt to send a desktop notification.
6. IF the browser's Notification permission is already `granted` or `denied` when the user clicks the Start button, THEN THE Dashboard SHALL not request Notification permission again during that page session.

---

### Requirement 8: To-Do List — Adding Tasks

**User Story:** As a user, I want to add tasks to a list, so that I can track what I need to do during my session.

#### Acceptance Criteria

1. WHEN the page is loaded, THE Dashboard SHALL read the tasks array from LocalStorage key `dashboard_tasks`; if no value is stored, THE Dashboard SHALL initialise the tasks array as empty, then render the task list.
2. WHEN the user enters text in the task input and clicks the Add button or presses Enter, THE To_Do_List SHALL trim the input text, create a new Task with a unique numeric `id` (from `Date.now()`), `text` set to the trimmed value, and `done` set to `false`, append it to the tasks array, persist the array to LocalStorage, re-render the task list, and clear the input field.
3. IF the user attempts to add a task with empty or whitespace-only text, THEN THE To_Do_List SHALL ignore the action and leave the input field contents unchanged.
4. THE task input SHALL accept a maximum of 120 characters and SHALL not permit characters beyond that limit to be entered.
5. WHEN a Task is rendered, THE To_Do_List SHALL pass its `text` through `escapeHTML` before inserting it into the DOM, so that HTML special characters in task text are displayed as literals rather than parsed as markup.

---

### Requirement 9: To-Do List — Completing and Editing Tasks

**User Story:** As a user, I want to mark tasks as done and correct mistakes in task text, so that I can keep the list accurate.

#### Acceptance Criteria

1. WHEN the user checks a Task's checkbox, THE To_Do_List SHALL set that Task's `done` flag to `true`, persist the updated array to LocalStorage, and re-render the list so the Task row reflects its new done state.
2. WHEN the user unchecks a Task's checkbox, THE To_Do_List SHALL set that Task's `done` flag to `false`, persist the updated array to LocalStorage, and re-render the list so the Task row reflects its new incomplete state.
3. WHILE a Task has `done === true`, THE To_Do_List SHALL render that Task's row with the CSS class `done`, which applies strikethrough styling to the task text and reduces the text opacity to 50% or less.
4. WHEN the user clicks the edit button on a Task, THE Dashboard SHALL open the Edit_Modal pre-filled with the current text of that Task and move keyboard focus to the edit input within 50 ms.
5. WHEN the user saves a non-empty value in the Edit_Modal, THE To_Do_List SHALL trim the new text, update the Task's `text` field, persist the updated array to LocalStorage, re-render the list, and close the Edit_Modal.
6. IF the user attempts to save an empty or whitespace-only value in the Edit_Modal, THEN THE To_Do_List SHALL ignore the save action, leave the Edit_Modal open, and display a validation indicator on the edit input field.
7. WHEN the user clicks the Cancel button in the Edit_Modal, THE Dashboard SHALL close the Edit_Modal without modifying the Task.
8. WHEN the user clicks the backdrop of the Edit_Modal, THE Dashboard SHALL close the Edit_Modal without modifying the Task.
9. WHEN the user presses the Escape key while the Edit_Modal is open, THE Dashboard SHALL close the Edit_Modal without modifying the Task.
10. THE To_Do_List SHALL prevent the edit input from accepting more than 120 characters by blocking input beyond that length.
11. IF persisting the updated Task array to LocalStorage fails, THEN THE To_Do_List SHALL revert the in-memory change, re-render the list to its previous state, and display an error message indicating the save did not complete.

---

### Requirement 10: To-Do List — Deleting Tasks and Empty State

**User Story:** As a user, I want to remove completed or unwanted tasks and see a helpful prompt when the list is empty.

#### Acceptance Criteria

1. WHEN the user clicks the delete button on a Task, THE To_Do_List SHALL remove the Task at the matching array index from the tasks array, persist the updated array to LocalStorage, and re-render the list.
2. IF the tasks array is empty, THEN THE To_Do_List SHALL display the empty-state paragraph `No tasks yet. Add one above!` and hide the task list element.
3. IF the tasks array is non-empty, THEN THE To_Do_List SHALL hide the empty-state paragraph and display the task list element.
4. THE To_Do_List SHALL display tasks in the order they appear in the tasks array (insertion order), with the most recently added task at the bottom.
5. THE task list element SHALL have a maximum height of 360 px and scroll vertically when the number of tasks exceeds the visible area.

---

### Requirement 11: Quick Links — Adding and Opening Links

**User Story:** As a user, I want to save bookmarks with custom labels and open them quickly, so that I can reach my frequently visited sites from the dashboard.

#### Acceptance Criteria

1. WHEN the page is loaded, THE Dashboard SHALL read the links array from LocalStorage key `dashboard_links`.
2. IF no value is stored under LocalStorage key `dashboard_links`, THEN THE Dashboard SHALL initialise the links array as empty.
3. WHEN the user fills in both the label and URL inputs and clicks the Add button or presses Enter in the URL field, THE Quick_Links widget SHALL trim both values, create a new Link with a unique numeric `id` (from `Date.now()`), `name` set to the trimmed label, and `url` set to the trimmed URL.
4. WHEN the URL value does not begin with `http://` or `https://` (case-insensitive), THE Quick_Links widget SHALL prepend `https://` to the URL before saving.
5. IF either the label or the URL is empty after trimming, THEN THE Quick_Links widget SHALL ignore the add action and display an error message indicating which field is missing.
6. THE label input SHALL accept a maximum of 30 characters and SHALL prevent input beyond that limit.
7. THE URL input SHALL accept a maximum of 300 characters and SHALL prevent input beyond that limit.
8. IF the URL after any `https://` prepending contains no characters beyond the protocol prefix, THEN THE Quick_Links widget SHALL ignore the add action and display an error message indicating the URL is invalid.
9. WHEN a new Link is added, THE Quick_Links widget SHALL append it to the links array, persist the array to LocalStorage, re-render the links grid, and clear both input fields.
10. WHEN the user clicks a Link chip, THE Dashboard SHALL open the link's URL in a new browser tab with `target="_blank"` and `rel="noopener noreferrer"`.

---

### Requirement 12: Quick Links — Removing Links and Empty State

**User Story:** As a user, I want to remove links I no longer need and see a prompt when the grid is empty.

#### Acceptance Criteria

1. WHEN the user clicks the remove button (✕) on a Link chip, THE Quick_Links widget SHALL remove only that single Link entry from the links array, persist the updated array to LocalStorage, re-render the links grid, and keep the browser on the current page without navigating to the link's URL.
2. IF the LocalStorage write fails during a link removal, THEN THE Quick_Links widget SHALL retain the link in the links array, re-render the links grid with the link still present, and display an error message indicating the link could not be removed.
3. WHEN the links array is empty, THE Quick_Links widget SHALL display the empty-state paragraph `No links yet. Add your favorites!` and hide the links grid.
4. WHEN the links array is non-empty, THE Quick_Links widget SHALL hide the empty-state paragraph and display the links grid.

---

### Requirement 13: Data Persistence

**User Story:** As a developer, I want all user data written to and read from `localStorage` reliably, so that preferences and content survive page reloads.

#### Acceptance Criteria

1. THE Dashboard SHALL serialise values using `JSON.stringify` before writing to `localStorage` and deserialise them using `JSON.parse` after reading, for all five keys defined in criterion 3.
2. IF `JSON.parse` throws an exception while reading a `localStorage` key, THEN THE Dashboard SHALL return the following fallback value for that key without overwriting the stored entry: `dashboard_name` → empty string `""`, `dashboard_theme` → `false`, `timer_duration` → `25`, `dashboard_tasks` → empty array `[]`, `dashboard_links` → empty array `[]`.
3. THE Dashboard SHALL use the following `localStorage` keys exclusively: `dashboard_name` (string), `dashboard_theme` (boolean), `timer_duration` (number), `dashboard_tasks` (array), `dashboard_links` (array).
4. WHEN a task mutation occurs (add, toggle done, edit text, or delete), THE Dashboard SHALL synchronously write the updated tasks array to `localStorage` key `dashboard_tasks` such that `JSON.parse(localStorage.getItem("dashboard_tasks"))` deep-equals the live in-memory tasks array immediately after the mutation.
5. WHEN a link mutation occurs (add or remove), THE Dashboard SHALL synchronously write the updated links array to `localStorage` key `dashboard_links` such that `JSON.parse(localStorage.getItem("dashboard_links"))` deep-equals the live in-memory links array immediately after the mutation.
6. WHEN the Dashboard initialises on page load, THE Dashboard SHALL read each of the five `localStorage` keys and restore the corresponding in-memory state, so that values written in a prior session are observable in the UI without user action.

---

### Requirement 14: Responsive Layout

**User Story:** As a user, I want the dashboard to be usable on small screens such as phones, so that I can access it from any device.

#### Acceptance Criteria

1. THE Dashboard SHALL display widgets in a multi-column grid that automatically reflows to a single column as the viewport narrows, without requiring horizontal scrolling at any viewport width of 320 px or greater.
2. THE Dashboard SHALL constrain the main grid to a maximum width of 1200 px and centre it horizontally within the viewport.
3. WHEN the viewport width is 600 px or less, THE Dashboard SHALL reduce the Topbar padding so that it does not exceed half its full-width value.
4. WHEN the viewport width is 600 px or less, THE Dashboard SHALL reduce the clock font size and the Timer_Display font size so that neither element overflows its containing card.
5. WHEN the viewport width is 600 px or less, THE Dashboard SHALL reduce the main grid padding and gap so that each card occupies the full available width with no horizontal overflow.

---

### Requirement 15: Keyboard and Modal Accessibility

**User Story:** As a user, I want to be able to close any open modal with the Escape key and by clicking outside it, so that I can dismiss dialogs without reaching for a specific button.

#### Acceptance Criteria

1. WHILE the Edit_Modal is open, WHEN the user presses the Escape key, THE Dashboard SHALL close the Edit_Modal and revert the edit input field to the value it held when the Edit_Modal was opened.
2. WHILE the Name_Modal is open, WHEN the user presses the Escape key, THE Dashboard SHALL close the Name_Modal and discard any value typed into the name input field since the Name_Modal opened.
3. WHEN the user presses the Escape key and neither modal is open, THE Dashboard SHALL perform no visible action.
4. WHILE the Edit_Modal is open, WHEN the user clicks the backdrop of the Edit_Modal, THE Dashboard SHALL close the Edit_Modal and revert the edit input field to the value it held when the Edit_Modal was opened.
5. WHILE the Name_Modal is open, WHEN the user clicks the backdrop of the Name_Modal, THE Dashboard SHALL close the Name_Modal and discard any value typed into the name input field since the Name_Modal opened.
6. WHEN the Name_Modal opens, THE Dashboard SHALL move keyboard focus to the name input field so that the field accepts keystrokes without requiring an additional click.
7. WHEN the Edit_Modal opens, THE Dashboard SHALL move keyboard focus to the edit input field so that the field accepts keystrokes without requiring an additional click.
8. WHEN the Edit_Modal or Name_Modal closes, THE Dashboard SHALL return keyboard focus to the element that triggered the modal to open.
9. THE Dashboard SHALL display only one modal at a time.
