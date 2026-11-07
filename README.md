# ✨ EventFlow — Modern Responsive Event Management Platform

> **K Explore – Web Designing Task Submission**  
> **Task Title:** Design and Develop a Responsive Event Management Website  
> **Built with:** Semantic HTML5, Modular CSS3, Modern ES6+ JavaScript, LocalStorage API, and Vector Graphics.

---

## 🌐 Live Demo & Repository
- **Live Demo Link:** `https://nishantkumarvibhakar.github.io/eventflow-event-management/`
- **GitHub Repository:** `https://github.com/nishantkumarvibhakar/eventflow-event-management`

---

## 📖 Executive Summary & Problem Statement

EventFlow is a modern, responsive web application engineered to solve the fragmented experience of discovering and registering for multi-disciplinary events. Whether an attendee is searching for high-impact artificial intelligence summits, open-air indie music festivals, design masterclasses, or venture capital forums, EventFlow offers a fast, accessible, and intuitive platform.

The platform provides an engaging user experience with a clean visual interface, fluid responsiveness across devices, live ticking countdown timers, real-time search and multi-facet filtering, strict JavaScript form validation, scannable SVG QR boarding passes, and a complete offline-ready `localStorage` management system.

---

## 🚀 Key Features

### 1. 🎨 Modern, Fluid & Responsive UI/UX
- **Aesthetic Glassmorphism:** Subtle frosted glass navigation and card overlays using `backdrop-filter: blur(12px)`.
- **Responsive Layout Architecture:** Fully optimized for compact mobile phones (`<480px`), smartphones (`<768px`), tablets (`768px–1024px`), and ultra-wide desktop monitors (`>1024px`).
- **Accessible Design (a11y):** Keyboard navigation with visible focus rings (`:focus-visible`), skip-to-content bypass link, semantic HTML5 landmarks, and ARIA live regions for screen readers.

### 2. ⚡ Engaging Hero Section
- **Dynamic Spotlight Card:** Displays the upcoming flagship gathering with a live synchronized countdown timer.
- **Animated Live Counters:** IntersectionObserver-powered counters displaying active statistics (50+ Events, 12.5k+ Attendees, 98% Satisfaction, 100% Verified Entry).
- **Dual Call-to-Actions:** Quick actions to jump straight into event exploration or review existing registrations.

### 3. 🔍 Multi-Facet Search, Filter & Sort System
- **Real-Time Keystroke Search:** Instant debounced searching across event titles, speaker names, cities, venues, and topic tags.
- **Category Filter Pills:** One-click filter badges with dynamic category counts (`All`, `Technology`, `Music & Arts`, `Design & UX`, `Business`, `Sports & Health`).
- **Format Filter:** Instant switching between **Virtual / Hybrid** and **In-Person** gatherings.
- **Pricing Filter:** Quickly isolate **Free Admission** workshops from paid passes.
- **Sorting Modes:** Sort by soonest upcoming date, reverse date, price low-to-high, price high-to-low, alphabetical title, or high-demand seats.
- **Empty State Recovery:** Illustrated zero-state with a single-click "Reset All Filters" button.

### 4. ⏳ Real-Time Live Event Countdown Timers *(Bonus Challenge)*
- Custom JavaScript countdown engine calculating days, hours, minutes, and seconds.
- Embedded into every event card, the hero spotlight card, and the comprehensive event details modal.
- Dynamic status states:
  - Upcoming events: real-time live clock ticking down every second.
  - Event day: glowing pulsing **Live Now** badge.
  - Concluded events: clear archived indicator.

### 5. 📋 Comprehensive Event Details Modal
- Modal dialog with background blur, ESC-key dismiss, and click-outside dismissal.
- Comprehensive breakdown including banner visual, capacity progress bar, full event description, keynotes & speaker roster with headshots, detailed chronological agenda timeline, and topic tags.
- Direct "Proceed to Registration" action pre-populating the event in the registration workflow.

### 6. ✍️ Strict JavaScript Form Validation Engine
- **Field-Level Constraints:**
  - **Full Name:** Letters, spaces, apostrophes, and hyphens only (`/^[a-zA-Z\s.'-]{3,50}$/`), minimum 3 characters.
  - **Email Address:** Strict RFC 5322 regex validation (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`).
  - **Phone Number:** Validates minimum 10 digits with support for domestic and international formats.
  - **Event Selection:** Enforces valid option selection with live capacity checks.
  - **Pass Quantity & Tier:** Calculates dynamic subtotal, tier perks (General vs VIP All-Access), and totals.
  - **Terms Checkbox:** Required confirmation before submission.
- **Visual Feedback:** Instant green (`.is-valid`) and red (`.is-invalid`) cues, error messages tied to `aria-describedby` and `role="alert"`.
- **Duplicate Prevention:** Prevents double-registration under the same email address for an identical event.

### 7. 🎟️ Digital Boarding Pass & QR Code Generation
- Upon submission, EventFlow triggers an celebratory confetti burst and renders an authentic boarding pass ticket pass:
  - Unique registration identifier (e.g., `EF-2026-9A8B2`).
  - Event metadata, venue, attendee name, and pass tier.
  - **Zero-Dependency SVG QR Code Generator:** Dynamically generated 25x25 matrix QR SVG vector rendered client-side without external CDNs or APIs.
  - **Print / PDF Export:** `@media print` CSS stylesheet formatting the pass on a clean white background for high-resolution printing or PDF saving.
  - **Calendar Export (.ics):** Generates and downloads standard iCalendar `.ics` files that import directly into Google Calendar, Apple Calendar, or Microsoft Outlook.

### 8. 💾 LocalStorage Registration Management *(Bonus Challenge)*
- All registered tickets persist in `localStorage` (`eventflow_registrations_v1`).
- **"My Tickets" Slide-Over Drawer:** Attendees can access their registered passes anytime, search tickets, re-print or view digital passes, or cancel registrations.
- **Seat Capacity Restoration:** Cancelling a pass automatically releases the reserved spots back into the event's available capacity.
- **Bookmark System:** Users can save events to their personal bookmarks by toggling the card bookmark icon.

### 9. 🌓 Dark & Light Mode Theme Toggle *(Bonus Challenge)*
- Seamless theme toggle switch with animated Sun/Moon icons in the header.
- Respects system `prefers-color-scheme` by default, with manual override stored in `localStorage`.
- Comprehensive CSS custom property color system for high contrast and readability in both modes.

---

## 📁 Project Architecture & File Structure

```
eventflow-event-management/
├── index.html               # Main semantic HTML5 document
├── vercel.json              # Vercel deployment route configuration
├── .gitignore               # Standard git ignore definitions
├── README.md                # Project documentation and evaluation guide
├── css/
│   ├── theme.css            # Light & Dark design tokens, colors, elevation shadows
│   ├── style.css            # Global resets, typography, header, hero, sections, footer
│   ├── components.css       # Event cards, buttons, modals, forms, boarding pass, toasts
│   └── responsive.css       # Media queries for tablet, mobile, compact screens & print
├── js/
│   ├── events-data.js       # Curated multi-category events dataset with rich metadata
│   ├── countdown.js         # Real-time ticking countdown engine
│   ├── storage.js           # LocalStorage CRUD operations (registrations, bookmarks, theme)
│   ├── ticket-generator.js  # Client-side SVG QR code generator, .ics export & pass renderer
│   ├── validation.js        # Strict real-time & on-submit JavaScript form validator
│   ├── filter-search.js     # Live search, category pills, dropdown filters & card DOM renderer
│   ├── modal.js             # Accessible modal controller (Details, Registration, Pass, Drawer)
│   └── app.js               # Application bootstrap, toast notifications, mobile nav & theme
└── assets/
    └── images/              # Self-contained SVG vector banners & avatars (offline fallback)
        ├── tech-banner.svg
        ├── music-banner.svg
        ├── design-banner.svg
        ├── business-banner.svg
        ├── sports-banner.svg
        └── avatar-default.svg
```

---

## 🛠️ Technical Stack & Implementation Details

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Markup** | HTML5 | Semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `dialog`, `footer`), ARIA live regions |
| **Styling** | CSS3 | CSS Custom Properties (Variables), CSS Grid (`repeat(auto-fill, minmax())`), Flexbox, `@media print` |
| **Logic** | Vanilla JavaScript (ES6+) | Modular IIFE patterns, Event Delegation, CustomEvents, Constraint Validation API |
| **State** | Browser LocalStorage | Keys: `eventflow_registrations_v1`, `eventflow_bookmarks_v1`, `eventflow_theme_pref` |
| **Typography**| Google Fonts | Plus Jakarta Sans (`wght@400;500;600;700;800`) |
| **Zero Dependencies**| 100% Native | No node packages or compilation required; works immediately in any modern browser |

---

## 💻 How to Run Locally

Because EventFlow is built entirely with vanilla web standards, it requires **zero build steps, zero compilers, and zero package installations**.

### Option 1: Direct Browser Launch
1. Download or clone this repository:
   ```bash
   git clone https://github.com/nishantkumarvibhakar/eventflow-event-management.git
   cd eventflow-event-management
   ```
2. Double-click `index.html` or open it with any web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Development Server (Recommended)
You can serve the directory using Python or Node.js:
- **Using Python 3:**
  ```bash
  python -m http.server 8000
  ```
  Open `http://localhost:8000` in your browser.
- **Using Node / npx:**
  ```bash
  npx serve .
  ```
- **Using VS Code Live Server:**
  Right-click `index.html` and select **"Open with Live Server"**.

---

## 🚀 Deployment Instructions

### 1. Deploying to GitHub Pages (Free)
1. Push your project files to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: EventFlow Event Management Platform"
   git branch -M main
   git remote add origin https://github.com/nishantkumarvibhakar/eventflow-event-management.git
   git push -u origin main
   ```
2. On GitHub, navigate to **Settings** > **Pages** (under the "Code and automation" section).
3. Under **Branch**, select `main` and folder `/ (root)`, then click **Save**.
4. Within 1–2 minutes, your website will be live at:
   `https://nishantkumarvibhakar.github.io/eventflow-event-management/`

### 2. Deploying to Vercel
1. Install Vercel CLI (`npm i -g vercel`) or go to [vercel.com](https://vercel.com).
2. Connect your GitHub repository or run in your terminal:
   ```bash
   vercel
   ```
3. Follow the CLI prompts (defaults are pre-configured via `vercel.json`).

### 3. Deploying to Netlify
1. Log in to [netlify.com](https://www.netlify.com).
2. Click **"Add new site"** > **"Import an existing project"** > Choose GitHub.
3. Select your repository. Leave the build command blank and publish directory as `.`.
4. Click **"Deploy Site"**.

---

## 🎯 Bonus Challenge Compliance Matrix

| Bonus Requirement | Implemented Feature | Location in Codebase |
| :--- | :--- | :--- |
| **Dark / Light Mode** | Animated theme toggle with `localStorage` persistence and `prefers-color-scheme` support | [`css/theme.css`](file:///css/theme.css), [`js/app.js`](file:///js/app.js#L68) |
| **Event Countdown Timers** | Real-time ticking timers on all cards, hero spotlight, and details modal with "Live Now" states | [`js/countdown.js`](file:///js/countdown.js) |
| **LocalStorage Data Management** | Complete CRUD operations: register pass, view "My Tickets", cancel pass (with seat restoration), and bookmark events | [`js/storage.js`](file:///js/storage.js), [`js/modal.js`](file:///js/modal.js) |
| **Micro-Interactions & Animations** | Interactive Confetti burst canvas, Toast notifications, card hover 3D lifts, and counter increments | [`js/modal.js`](file:///js/modal.js#L265), [`css/components.css`](file:///css/components.css) |
| **Calendar & Print Integration** | Generates offline standard `.ics` Calendar files and provides `@media print` boarding pass formatting | [`js/ticket-generator.js`](file:///js/ticket-generator.js), [`css/responsive.css`](file:///css/responsive.css) |

---

## 📝 Evaluation Criteria Alignment

- **Creativity:** Original digital boarding-pass ticket concept with client-side SVG QR code generation, interactive confetti celebrations, and bookmarking.
- **UI/UX:** Cohesive visual design system, glassmorphism, fluid typography, dark/light modes, micro-interactions, and accessible forms.
- **Functionality:** Real-time multi-criteria filtering, search, live countdown ticker, full modal workflows, and validation.
- **Responsiveness:** Rigorously tested layouts adapting smoothly across mobile (<480px), tablet, and desktop viewports.
- **Code Quality:** Modular separation of concerns into dedicated JavaScript modules and CSS stylesheets, with zero legacy practices.
- **Documentation:** Complete setup guide, architecture map, deployment walkthrough, and feature matrices.

---

*Authored for the K Explore – Web Designing Event Management Challenge.*
