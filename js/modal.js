/**
 * EventFlow - Accessible Modal Dialog Controller
 * Manages Event Details, Registration, Confirmation Ticket Pass,
 * and My Tickets drawer modals with full keyboard trap and ARIA compliance.
 */

const ModalController = (() => {
  let activeModal = null;
  let previousActiveElement = null;

  /**
   * Closes any currently active modal dialog.
   */
  function closeModal() {
    if (!activeModal) return;

    activeModal.classList.remove("is-open");
    activeModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    // Return focus to previously active element
    if (previousActiveElement && typeof previousActiveElement.focus === "function") {
      previousActiveElement.focus();
    }

    activeModal = null;
  }

  /**
   * Opens an accessible modal element.
   * @param {HTMLElement|string} modal 
   */
  function openModal(modal) {
    const targetModal = typeof modal === "string" ? document.getElementById(modal) : modal;
    if (!targetModal) return;

    // Close any previous open modal
    if (activeModal && activeModal !== targetModal) {
      activeModal.classList.remove("is-open");
      activeModal.setAttribute("aria-hidden", "true");
    }

    previousActiveElement = document.activeElement;
    activeModal = targetModal;

    targetModal.classList.add("is-open");
    targetModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    // Focus first interactive element or modal content
    const focusable = targetModal.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (focusable) {
      setTimeout(() => focusable.focus(), 50);
    }
  }

  /**
   * Pre-populates and opens the Event Details Modal.
   * @param {string} eventId 
   */
  function openDetailsModal(eventId) {
    const event = EVENTS_DATA.find(e => e.id === eventId);
    if (!event) return;

    const modal = document.getElementById("modal-event-details");
    if (!modal) return;

    // Header & Media
    const imgEl = modal.querySelector(".modal-hero-img");
    if (imgEl) {
      imgEl.src = event.image;
      imgEl.alt = event.title;
      imgEl.onerror = () => {
        imgEl.onerror = null;
        imgEl.src = `assets/images/${event.category}-banner.svg`;
      };
    }

    const badgeEl = modal.querySelector(".modal-badge-category");
    if (badgeEl) {
      badgeEl.className = `badge badge-${event.category}`;
      badgeEl.textContent = event.categoryLabel;
    }

    const formatEl = modal.querySelector(".modal-badge-format");
    if (formatEl) {
      formatEl.textContent = event.isOnline ? "Hybrid / Virtual" : "In-Person Event";
    }

    // Title & Time
    modal.querySelector(".modal-event-title").textContent = event.title;
    modal.querySelector(".modal-event-date").textContent = event.displayDate;
    modal.querySelector(".modal-event-venue").textContent = `${event.venue}, ${event.city}`;

    // Live Countdown Container
    const countdownContainer = modal.querySelector(".modal-countdown-box");
    if (countdownContainer) {
      countdownContainer.setAttribute("data-countdown-detailed", event.date);
      countdownContainer.innerHTML = CountdownEngine.formatDetailedGrid(event.date);
    }

    // Pricing & Capacity
    const priceText = event.price === 0 ? "FREE" : `$${event.price}.00`;
    modal.querySelector(".modal-event-price").textContent = priceText;
    modal.querySelector(".modal-event-seats").textContent = `${event.seatsLeft} spots remaining of ${event.seatsTotal}`;

    // Full Description
    modal.querySelector(".modal-description-full").textContent = event.fullDescription;

    // Speakers List
    const speakersContainer = modal.querySelector(".modal-speakers-list");
    if (speakersContainer) {
      if (event.speakers && event.speakers.length > 0) {
        speakersContainer.innerHTML = event.speakers.map(s => `
          <div class="speaker-card">
            <img src="${s.avatar}" alt="${s.name}" class="speaker-avatar" loading="lazy" onerror="this.onerror=null; this.src='assets/images/avatar-default.svg';" />
            <div class="speaker-info">
              <span class="speaker-name">${s.name}</span>
              <span class="speaker-role">${s.role}</span>
              <span class="speaker-company">${s.company}</span>
            </div>
          </div>
        `).join("");
      } else {
        speakersContainer.innerHTML = "<p class='text-muted'>Speaker roster to be announced shortly.</p>";
      }
    }

    // Agenda Timeline
    const agendaContainer = modal.querySelector(".modal-agenda-timeline");
    if (agendaContainer) {
      if (event.agenda && event.agenda.length > 0) {
        agendaContainer.innerHTML = event.agenda.map(a => `
          <div class="agenda-item">
            <div class="agenda-time">${a.time}</div>
            <div class="agenda-content">
              <h4 class="agenda-title">${a.title}</h4>
              <p class="agenda-speaker">Led by: ${a.speaker}</p>
            </div>
          </div>
        `).join("");
      } else {
        agendaContainer.innerHTML = "<p class='text-muted'>Detailed timeline arriving soon.</p>";
      }
    }

    // Tags
    const tagsContainer = modal.querySelector(".modal-tags-container");
    if (tagsContainer) {
      tagsContainer.innerHTML = event.tags.map(t => `<span class="tag-pill">#${t}</span>`).join("");
    }

    // CTA Button in details modal
    const registerBtn = modal.querySelector("#btn-modal-register-cta");
    if (registerBtn) {
      registerBtn.setAttribute("data-id", event.id);
      registerBtn.onclick = () => {
        closeModal();
        openRegistrationModal(event.id);
      };
    }

    openModal(modal);
  }

  /**
   * Pre-populates and opens the Registration Modal.
   * @param {string} [eventId] - Optional event to preselect
   */
  function openRegistrationModal(eventId) {
    const modal = document.getElementById("modal-registration");
    if (!modal) return;

    // Populate event options dropdown
    const selectEl = document.getElementById("reg-event");
    if (selectEl) {
      selectEl.innerHTML = '<option value="">-- Choose an Event --</option>' + 
        EVENTS_DATA.map(e => `
          <option value="${e.id}" ${eventId === e.id ? 'selected' : ''}>
            ${e.title} (${e.price === 0 ? 'Free' : '$' + e.price}) - ${e.seatsLeft} spots left
          </option>
        `).join("");
    }

    // Reset previous validation state
    const formEl = document.getElementById("registration-form");
    FormValidator.resetForm(formEl);

    // If an event is pre-selected, update summary card
    if (eventId) {
      selectEl.value = eventId;
    }
    updatePricingSummary();

    openModal(modal);
  }

  /**
   * Updates real-time cost calculation in the registration form.
   */
  function updatePricingSummary() {
    const selectEl = document.getElementById("reg-event");
    const countEl = document.getElementById("reg-tickets");
    const tierRadio = document.querySelector('input[name="ticket-tier"]:checked');
    const summaryBox = document.getElementById("reg-cost-summary");

    if (!summaryBox) return;

    const eventId = selectEl ? selectEl.value : "";
    const event = EVENTS_DATA.find(e => e.id === eventId);
    const count = parseInt(countEl ? countEl.value : 1, 10) || 1;
    const isVip = tierRadio ? tierRadio.value.includes("VIP") : false;

    if (!event) {
      summaryBox.innerHTML = `
        <div class="summary-line">
          <span>Select an event above to view pricing breakdown</span>
          <span class="summary-val">$0.00</span>
        </div>
      `;
      return;
    }

    const basePrice = event.price;
    const surcharge = isVip ? 30 : 0;
    const unitPrice = basePrice + surcharge;
    const subtotal = unitPrice * count;

    summaryBox.innerHTML = `
      <div class="summary-line">
        <span>Base Event Admission (${count}x ${event.price === 0 ? 'Free' : '$' + basePrice}):</span>
        <span class="summary-val">${event.price === 0 ? '$0.00' : '$' + (basePrice * count) + '.00'}</span>
      </div>
      ${isVip ? `
        <div class="summary-line text-accent">
          <span>VIP Access Upgrade ($30 x ${count}):</span>
          <span class="summary-val">+$${30 * count}.00</span>
        </div>
      ` : ''}
      <div class="summary-total">
        <span>Total Due:</span>
        <span class="total-amount">${subtotal === 0 ? 'FREE ($0.00)' : '$' + subtotal + '.00'}</span>
      </div>
    `;
  }

  /**
   * Opens the Confirmation Modal showing the sleek digital boarding pass.
   * @param {Object} registrationRecord 
   */
  function openConfirmationModal(registrationRecord) {
    const modal = document.getElementById("modal-confirmation");
    if (!modal) return;

    const event = EVENTS_DATA.find(e => e.id === registrationRecord.eventId);
    const container = document.getElementById("confirmation-ticket-container");
    if (container) {
      container.innerHTML = TicketGenerator.renderTicketPassHTML(registrationRecord, event);

      // Attach add-to-calendar handler
      const calBtn = container.querySelector("#btn-add-calendar");
      if (calBtn && event) {
        calBtn.addEventListener("click", () => {
          TicketGenerator.downloadCalendarFile(event, registrationRecord);
          if (window.ToastManager) {
            window.ToastManager.show("Event calendar pass (.ics) downloaded!", "success");
          }
        });
      }
    }

    // Fire Confetti Celebration
    triggerConfetti();

    openModal(modal);
  }

  /**
   * Opens the "My Tickets / Registrations" slide-over drawer modal.
   */
  function openMyTicketsModal() {
    const modal = document.getElementById("modal-my-tickets");
    if (!modal) return;

    renderMyTicketsList();
    openModal(modal);
  }

  /**
   * Renders all registered tickets inside My Tickets modal.
   */
  function renderMyTicketsList() {
    const container = document.getElementById("my-tickets-list-container");
    const emptyState = document.getElementById("my-tickets-empty-state");
    const badgeCount = document.getElementById("nav-tickets-badge");

    const registrations = StorageEngine.getAllRegistrations();

    // Update nav counter
    if (badgeCount) {
      badgeCount.textContent = registrations.length;
      badgeCount.style.display = registrations.length > 0 ? "inline-flex" : "none";
    }

    if (!container) return;

    if (registrations.length === 0) {
      container.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    container.innerHTML = registrations.map(reg => {
      const event = EVENTS_DATA.find(e => e.id === reg.eventId);
      const eventDateStr = event ? event.displayDate : reg.displayDate;
      const venueStr = event ? `${event.venue}, ${event.city}` : reg.venue;

      return `
        <div class="my-ticket-card" data-ticket-id="${reg.id}">
          <div class="my-ticket-badge-row">
            <span class="ticket-status-tag"><span class="status-dot"></span> Confirmed</span>
            <span class="ticket-id-tag">${reg.id}</span>
          </div>

          <h4 class="my-ticket-event-title">${reg.eventTitle}</h4>

          <div class="my-ticket-meta">
            <span>📅 ${eventDateStr}</span>
            <span>📍 ${venueStr}</span>
            <span>👤 ${reg.fullName} • ${reg.ticketCount || 1} pass(es)</span>
          </div>

          <div class="my-ticket-actions">
            <button class="btn btn-outline btn-sm btn-view-pass" data-ticket-id="${reg.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              View Pass
            </button>
            <button class="btn btn-danger-soft btn-sm btn-cancel-ticket" data-ticket-id="${reg.id}" data-title="${reg.eventTitle}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Cancel
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  /**
   * Confetti celebration burst animation on successful registration.
   */
  function triggerConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#6366f1", "#a855f7", "#ec4899", "#10b981", "#f59e0b", "#06b6d4"];

    for (let i = 0; i < 75; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 4,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 14,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let frame = 0;
    function renderFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.98; // drag
        p.rotation += p.vr;
        if (frame > 25) {
          p.opacity -= 0.015;
        }

        if (p.opacity > 0) {
          alive++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      frame++;
      if (alive > 0 && frame < 120) {
        requestAnimationFrame(renderFrame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    renderFrame();
  }

  /**
   * Initializes listeners for closing, keyboard traps, backdrop clicks, and pricing updates.
   */
  function init() {
    // Backdrop click and close buttons
    document.addEventListener("click", (e) => {
      // Close button
      if (e.target.closest("[data-modal-close]")) {
        closeModal();
        return;
      }

      // Backdrop click (click outside modal content)
      if (e.target.classList.contains("modal-backdrop") && e.target === activeModal) {
        closeModal();
        return;
      }

      // Open My Tickets button
      if (e.target.closest("#btn-open-my-tickets") || e.target.closest("#btn-hero-my-tickets")) {
        openMyTicketsModal();
        return;
      }

      // My Tickets View Pass action
      const viewPassBtn = e.target.closest(".btn-view-pass");
      if (viewPassBtn) {
        const ticketId = viewPassBtn.getAttribute("data-ticket-id");
        const reg = StorageEngine.getRegistrationById(ticketId);
        if (reg) {
          closeModal();
          openConfirmationModal(reg);
        }
        return;
      }

      // My Tickets Cancel action
      const cancelBtn = e.target.closest(".btn-cancel-ticket");
      if (cancelBtn) {
        const ticketId = cancelBtn.getAttribute("data-ticket-id");
        const title = cancelBtn.getAttribute("data-title") || "this event";
        if (confirm(`Are you sure you want to cancel your registration for "${title}" (${ticketId})?`)) {
          const success = StorageEngine.cancelRegistration(ticketId);
          if (success) {
            renderMyTicketsList();
            if (window.ToastManager) {
              window.ToastManager.show("Registration cancelled successfully. Spot released.", "info");
            }
          }
        }
        return;
      }
    });

    // Escape key closes modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && activeModal) {
        closeModal();
      }
    });

    // Registration price change listeners
    const regEventSelect = document.getElementById("reg-event");
    const regTicketsInput = document.getElementById("reg-tickets");
    const tierRadios = document.querySelectorAll('input[name="ticket-tier"]');

    if (regEventSelect) regEventSelect.addEventListener("change", updatePricingSummary);
    if (regTicketsInput) regTicketsInput.addEventListener("input", updatePricingSummary);
    tierRadios.forEach(radio => radio.addEventListener("change", updatePricingSummary));

    // Registration form submission handler
    const formEl = document.getElementById("registration-form");
    if (formEl) {
      FormValidator.attachLiveListeners(formEl);

      formEl.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = FormValidator.validateEntireForm(formEl);
        if (!formData) return;

        // Check if duplicate registration
        if (StorageEngine.isAlreadyRegistered(formData.eventId, formData.email)) {
          if (window.ToastManager) {
            window.ToastManager.show("You have already registered for this event with this email!", "warning");
          }
          alert("Notice: You have already reserved a pass for this event with this email address. You can view your pass in 'My Tickets'.");
          return;
        }

        // Show submit loading spinner
        const submitBtn = formEl.querySelector("#btn-submit-registration");
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spinner" width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="32" stroke-linecap="round"/></svg>
          Processing Pass...
        `;

        setTimeout(() => {
          // Decrement seats in data
          const event = EVENTS_DATA.find(ev => ev.id === formData.eventId);
          if (event && event.seatsLeft >= formData.ticketCount) {
            event.seatsLeft -= formData.ticketCount;
          }

          // Save to LocalStorage
          const newRecord = StorageEngine.addRegistration(formData);

          // Reset button
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          // Close registration modal & open digital ticket pass modal
          closeModal();
          openConfirmationModal(newRecord);

          // Update UI counts
          renderMyTicketsList();
          EventRenderer.renderMainEvents();
          EventRenderer.renderFeaturedEvents();

          if (window.ToastManager) {
            window.ToastManager.show("Registration confirmed! Your pass is ready.", "success");
          }
        }, 600);
      });
    }

    // Update tickets counter badge on start
    renderMyTicketsList();
  }

  return {
    init,
    openModal,
    closeModal,
    openDetailsModal,
    openRegistrationModal,
    openConfirmationModal,
    openMyTicketsModal,
    renderMyTicketsList,
    triggerConfetti
  };
})();
