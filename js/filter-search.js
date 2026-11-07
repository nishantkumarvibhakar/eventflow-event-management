/**
 * EventFlow - Filter, Search, and Event Card Rendering Engine
 * Powers multi-criteria live filtering, sorting, bookmarking,
 * category counts, and high-performance DOM updates.
 */

const EventRenderer = (() => {
  // Current filter state
  const state = {
    searchQuery: "",
    selectedCategory: "all",
    formatFilter: "all", // "all", "in-person", "online"
    priceFilter: "all",  // "all", "free", "paid"
    sortBy: "date-asc"   // "date-asc", "date-desc", "price-asc", "price-desc", "title-asc"
  };

  /**
   * Filters and sorts the EVENTS_DATA array based on current state.
   */
  function getFilteredEvents() {
    let list = [...EVENTS_DATA];

    // Search query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter(e => {
        const titleMatch = e.title.toLowerCase().includes(q);
        const descMatch = (e.shortDescription + " " + e.fullDescription).toLowerCase().includes(q);
        const venueMatch = (e.venue + " " + e.city).toLowerCase().includes(q);
        const catMatch = e.categoryLabel.toLowerCase().includes(q);
        const tagsMatch = e.tags.some(t => t.toLowerCase().includes(q));
        return titleMatch || descMatch || venueMatch || catMatch || tagsMatch;
      });
    }

    // Category filter
    if (state.selectedCategory !== "all") {
      list = list.filter(e => e.category === state.selectedCategory);
    }

    // Format filter
    if (state.formatFilter === "online") {
      list = list.filter(e => e.isOnline);
    } else if (state.formatFilter === "in-person") {
      list = list.filter(e => !e.isOnline || e.venue.toLowerCase().includes("pavilion") || e.venue.toLowerCase().includes("amphitheater") || e.venue.toLowerCase().includes("center") || e.venue.toLowerCase().includes("park"));
    }

    // Price filter
    if (state.priceFilter === "free") {
      list = list.filter(e => e.price === 0);
    } else if (state.priceFilter === "paid") {
      list = list.filter(e => e.price > 0);
    }

    // Sorting
    list.sort((a, b) => {
      if (state.sortBy === "date-asc") {
        return new Date(a.date) - new Date(b.date);
      } else if (state.sortBy === "date-desc") {
        return new Date(b.date) - new Date(a.date);
      } else if (state.sortBy === "price-asc") {
        return a.price - b.price;
      } else if (state.sortBy === "price-desc") {
        return b.price - a.price;
      } else if (state.sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      } else if (state.sortBy === "demand") {
        return a.seatsLeft - b.seatsLeft;
      }
      return 0;
    });

    return list;
  }

  /**
   * Generates single event card HTML.
   */
  function createCardHTML(event, isFeatured = false) {
    const isBookmarked = StorageEngine.isBookmarked(event.id);
    const seatsPercent = Math.round(((event.seatsTotal - event.seatsLeft) / event.seatsTotal) * 100);
    const isAlmostFull = event.seatsLeft < 30;

    return `
      <article class="event-card ${isFeatured ? 'featured-card' : ''}" data-event-id="${event.id}">
        <!-- Card Visual Header -->
        <div class="card-media">
          <img 
            src="${event.image}" 
            alt="${event.title}" 
            class="card-img" 
            loading="lazy" 
            onerror="this.onerror=null; this.src='assets/images/${event.category}-banner.svg';"
          />
          <div class="card-overlay-gradient"></div>

          <!-- Category Badge & Format Badge -->
          <div class="card-badges-top">
            <span class="badge badge-${event.category}">
              ${event.categoryLabel}
            </span>
            ${event.isOnline ? '<span class="badge badge-hybrid">Hybrid / Online</span>' : '<span class="badge badge-inperson">In-Person</span>'}
          </div>

          <!-- Bookmark Button -->
          <button 
            type="button" 
            class="btn-bookmark ${isBookmarked ? 'active' : ''}" 
            aria-label="${isBookmarked ? 'Remove bookmark' : 'Bookmark event'}" 
            data-bookmark-id="${event.id}"
            title="${isBookmarked ? 'Bookmarked' : 'Save Event'}"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>

          <!-- Live Countdown Bar on Card Image -->
          <div class="card-countdown-overlay" data-countdown-card="${event.date}">
            ${CountdownEngine.formatMiniBadge(event.date)}
          </div>
        </div>

        <!-- Card Content Body -->
        <div class="card-body">
          <div class="card-meta">
            <span class="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>${event.displayDate.split("•")[0].trim()}</span>
            </span>
            <span class="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span class="truncate-text">${event.city}</span>
            </span>
          </div>

          <h3 class="card-title" title="${event.title}">
            <a href="javascript:void(0)" class="event-title-link" data-action="details" data-id="${event.id}">
              ${event.title}
            </a>
          </h3>

          <p class="card-description">${event.shortDescription}</p>

          <!-- Seats & Demand Meter -->
          <div class="card-capacity">
            <div class="capacity-labels">
              <span class="seats-left ${isAlmostFull ? 'urgent' : ''}">
                <span class="seats-dot"></span>
                <strong>${event.seatsLeft}</strong> spots left
              </span>
              <span class="seats-percent">${seatsPercent}% filled</span>
            </div>
            <div class="capacity-track" role="progressbar" aria-valuenow="${seatsPercent}" aria-valuemin="0" aria-valuemax="100">
              <div class="capacity-fill ${isAlmostFull ? 'fill-urgent' : ''}" style="width: ${seatsPercent}%;"></div>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="card-footer">
          <div class="card-price">
            <span class="price-value">${event.price === 0 ? 'FREE' : `$${event.price}`}</span>
            ${event.price > 0 ? '<span class="price-sub">/ ticket</span>' : ''}
          </div>

          <div class="card-actions">
            <button 
              type="button" 
              class="btn btn-outline btn-sm" 
              data-action="details" 
              data-id="${event.id}"
              aria-label="View details for ${event.title}"
            >
              Details
            </button>
            <button 
              type="button" 
              class="btn btn-primary btn-sm" 
              data-action="register" 
              data-id="${event.id}"
              aria-label="Register for ${event.title}"
            >
              Register
            </button>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Renders the category counts inside filter pills.
   */
  function renderCategoryPills() {
    const container = document.getElementById("category-filter-pills");
    if (!container) return;

    // Calculate count per category
    const counts = { all: EVENTS_DATA.length };
    EVENTS_DATA.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });

    container.innerHTML = EVENT_CATEGORIES.map(cat => {
      const isActive = state.selectedCategory === cat.id;
      const count = counts[cat.id] || 0;
      return `
        <button 
          type="button" 
          class="category-pill ${isActive ? 'active' : ''}" 
          data-category="${cat.id}"
          role="tab"
          aria-selected="${isActive ? 'true' : 'false'}"
        >
          <span>${cat.label}</span>
          <span class="pill-count">${count}</span>
        </button>
      `;
    }).join("");
  }

  /**
   * Renders the featured events top carousel / highlights grid.
   */
  function renderFeaturedEvents() {
    const container = document.getElementById("featured-events-grid");
    if (!container) return;

    const featuredList = EVENTS_DATA.filter(e => e.isFeatured).slice(0, 3);
    container.innerHTML = featuredList.map(e => createCardHTML(e, true)).join("");
  }

  /**
   * Renders the main filtered events grid.
   */
  function renderMainEvents() {
    const container = document.getElementById("events-grid");
    const countDisplay = document.getElementById("events-count-badge");
    const emptyState = document.getElementById("events-empty-state");

    if (!container) return;

    const events = getFilteredEvents();

    if (countDisplay) {
      countDisplay.textContent = `${events.length} Event${events.length === 1 ? '' : 's'} Found`;
    }

    if (events.length === 0) {
      container.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    container.innerHTML = events.map(e => createCardHTML(e, false)).join("");

    // Retrigger countdown tick to populate fresh badges
    CountdownEngine.tick();
  }

  /**
   * Resets all search and filter options to default.
   */
  function resetFilters() {
    state.searchQuery = "";
    state.selectedCategory = "all";
    state.formatFilter = "all";
    state.priceFilter = "all";
    state.sortBy = "date-asc";

    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) sortSelect.value = "date-asc";

    const formatSelect = document.getElementById("filter-format");
    if (formatSelect) formatSelect.value = "all";

    const priceSelect = document.getElementById("filter-price");
    if (priceSelect) priceSelect.value = "all";

    renderCategoryPills();
    renderMainEvents();
  }

  /**
   * Attaches interactive listeners for search bar, category pills, dropdowns, and card buttons.
   */
  function initListeners() {
    // Search input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      let debounceTimeout = null;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          state.searchQuery = e.target.value;
          renderMainEvents();
        }, 150);
      });

      const clearSearchBtn = document.getElementById("btn-clear-search");
      if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
          searchInput.value = "";
          state.searchQuery = "";
          renderMainEvents();
          searchInput.focus();
        });
      }
    }

    // Category pill clicks (event delegation)
    const pillsContainer = document.getElementById("category-filter-pills");
    if (pillsContainer) {
      pillsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".category-pill");
        if (btn) {
          state.selectedCategory = btn.getAttribute("data-category");
          renderCategoryPills();
          renderMainEvents();
        }
      });
    }

    // Sort select
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        state.sortBy = e.target.value;
        renderMainEvents();
      });
    }

    // Format filter
    const formatSelect = document.getElementById("filter-format");
    if (formatSelect) {
      formatSelect.addEventListener("change", (e) => {
        state.formatFilter = e.target.value;
        renderMainEvents();
      });
    }

    // Price filter
    const priceSelect = document.getElementById("filter-price");
    if (priceSelect) {
      priceSelect.addEventListener("change", (e) => {
        state.priceFilter = e.target.value;
        renderMainEvents();
      });
    }

    // Reset buttons
    const resetBtns = document.querySelectorAll(".btn-reset-filters");
    resetBtns.forEach(btn => btn.addEventListener("click", resetFilters));

    // Event delegation on body for card clicks (Details, Register, Bookmark)
    document.addEventListener("click", (e) => {
      // Bookmark button
      const bookmarkBtn = e.target.closest(".btn-bookmark");
      if (bookmarkBtn) {
        const eventId = bookmarkBtn.getAttribute("data-bookmark-id");
        if (eventId) {
          const isNowBookmarked = StorageEngine.toggleBookmark(eventId);
          bookmarkBtn.classList.toggle("active", isNowBookmarked);
          bookmarkBtn.setAttribute("aria-label", isNowBookmarked ? "Remove bookmark" : "Bookmark event");
          const svg = bookmarkBtn.querySelector("svg");
          if (svg) {
            svg.setAttribute("fill", isNowBookmarked ? "currentColor" : "none");
          }
          if (window.ToastManager) {
            window.ToastManager.show(
              isNowBookmarked ? "Event saved to bookmarks!" : "Event removed from bookmarks",
              isNowBookmarked ? "success" : "info"
            );
          }
        }
        return;
      }

      // Details button or title link
      const detailsTrigger = e.target.closest('[data-action="details"]');
      if (detailsTrigger) {
        const eventId = detailsTrigger.getAttribute("data-id");
        if (window.ModalController) {
          window.ModalController.openDetailsModal(eventId);
        }
        return;
      }

      // Register button
      const registerTrigger = e.target.closest('[data-action="register"]');
      if (registerTrigger) {
        const eventId = registerTrigger.getAttribute("data-id");
        if (window.ModalController) {
          window.ModalController.openRegistrationModal(eventId);
        }
        return;
      }
    });
  }

  function init() {
    renderCategoryPills();
    renderFeaturedEvents();
    renderMainEvents();
    initListeners();
  }

  return {
    init,
    renderMainEvents,
    renderFeaturedEvents,
    renderCategoryPills,
    resetFilters,
    state
  };
})();
