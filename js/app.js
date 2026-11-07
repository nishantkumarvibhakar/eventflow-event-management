/**
 * EventFlow - Application Bootstrap & Global UI Controller
 * Manages Dark/Light mode theme toggling, Toast alerts, Mobile Navigation,
 * Hero stats animation, and module initialization.
 */

// Global Toast Manager
const ToastManager = (() => {
  let toastContainer = null;

  function ensureContainer() {
    if (!toastContainer) {
      toastContainer = document.getElementById("toast-container");
      if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.className = "toast-container";
        toastContainer.setAttribute("aria-live", "polite");
        document.body.appendChild(toastContainer);
      }
    }
  }

  function show(message, type = "info", duration = 3500) {
    ensureContainer();

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;
    
    let icon = "✨";
    if (type === "success") icon = "✓";
    if (type === "warning") icon = "⚠️";
    if (type === "error") icon = "✕";

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
      <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.onclick = () => removeToast(toast);

    toastContainer.appendChild(toast);

    // Auto dismiss
    setTimeout(() => {
      removeToast(toast);
    }, duration);
  }

  function removeToast(toast) {
    if (!toast) return;
    toast.classList.add("toast-fade-out");
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }

  return { show };
})();
window.ToastManager = ToastManager;

// Theme Engine (Dark / Light Mode)
const ThemeEngine = (() => {
  const root = document.documentElement;

  function getPreferredTheme() {
    const saved = StorageEngine.getSavedTheme();
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    StorageEngine.saveTheme(theme);

    const toggleBtn = document.getElementById("theme-toggle-btn");
    if (toggleBtn) {
      const isDark = theme === "dark";
      toggleBtn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      toggleBtn.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");

      const sunIcon = toggleBtn.querySelector(".icon-sun");
      const moonIcon = toggleBtn.querySelector(".icon-moon");
      if (sunIcon && moonIcon) {
        sunIcon.style.display = isDark ? "block" : "none";
        moonIcon.style.display = isDark ? "none" : "block";
      }
    }
  }

  function toggle() {
    const current = root.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    ToastManager.show(`Switched to ${next} theme mode`, "info", 2000);
  }

  function init() {
    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);

    const toggleBtn = document.getElementById("theme-toggle-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", toggle);
    }

    // Respond to system preference changes if user hasn't explicitly saved a choice
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!StorageEngine.getSavedTheme()) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
  }

  return { init, toggle, applyTheme };
})();

// Mobile Navigation
function initMobileNavigation() {
  const hamburgerBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-nav-drawer");
  const closeMenuBtn = document.getElementById("mobile-nav-close");
  const navLinks = document.querySelectorAll(".mobile-nav-link");

  if (!hamburgerBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("modal-open");
  }

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("modal-open");
  }

  hamburgerBtn.addEventListener("click", openMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close when clicking outside drawer
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) closeMenu();
  });
}

// Animated Counter for Hero Stats
function animateHeroCounters() {
  const counters = document.querySelectorAll("[data-counter-target]");
  if (!counters || counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-counter-target"), 10);
        const prefix = el.getAttribute("data-counter-prefix") || "";
        const suffix = el.getAttribute("data-counter-suffix") || "";
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
        }, 30);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

// Newsletter subscription form
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("newsletter-email");
    const email = input.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      ToastManager.show("Please provide a valid email address.", "warning");
      input.focus();
      return;
    }

    ToastManager.show("🎉 Subscribed! You will receive weekly event alerts.", "success");
    input.value = "";
  });
}

// Global App Initialization
document.addEventListener("DOMContentLoaded", () => {
  ThemeEngine.init();
  initMobileNavigation();
  animateHeroCounters();
  initNewsletter();

  // Initialize modular controllers
  CountdownEngine.start();
  EventRenderer.init();
  ModalController.init();

  // Attach hero CTA to open registration or scroll
  const heroExploreBtn = document.getElementById("btn-hero-explore");
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener("click", () => {
      const target = document.getElementById("events-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Direct registration trigger from hero quick pass
  const heroQuickRegBtn = document.getElementById("btn-hero-quick-reg");
  if (heroQuickRegBtn) {
    heroQuickRegBtn.addEventListener("click", () => {
      ModalController.openRegistrationModal("evt-01"); // Preselect flagship event
    });
  }

  console.log("EventFlow Platform Initialized Successfully.");
});
