/**
 * EventFlow - Form Validation & Submission Engine
 * Provides comprehensive real-time and on-submit JavaScript validation
 * with accessible ARIA live feedback, error states, and submission handling.
 */

const FormValidator = (() => {
  // Regex rules
  const REGEX = {
    name: /^[a-zA-Z\s.'-]{3,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,15}$/
  };

  /**
   * Field validation rules definition
   */
  const rules = {
    "reg-name": (val) => {
      if (!val || !val.trim()) return "Full name is required.";
      if (val.trim().length < 3) return "Name must be at least 3 characters.";
      if (!REGEX.name.test(val.trim())) return "Name can only contain letters, spaces, and hyphens.";
      return "";
    },
    "reg-email": (val) => {
      if (!val || !val.trim()) return "Email address is required.";
      if (!REGEX.email.test(val.trim())) return "Please enter a valid email address (e.g., name@domain.com).";
      return "";
    },
    "reg-phone": (val) => {
      if (!val || !val.trim()) return "Phone number is required.";
      const digitsOnly = val.replace(/\D/g, "");
      if (digitsOnly.length < 10) return "Please enter at least 10 digits for your phone number.";
      if (!REGEX.phone.test(val.trim())) return "Please enter a valid phone number (e.g. +1 555-019-2834).";
      return "";
    },
    "reg-event": (val) => {
      if (!val || val === "") return "Please choose an event to register for.";
      return "";
    },
    "reg-tickets": (val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 1 || num > 5) return "Tickets must be between 1 and 5 passes.";
      return "";
    },
    "reg-terms": (val, el) => {
      if (!el.checked) return "You must agree to the event attendee terms & privacy policy.";
      return "";
    }
  };

  /**
   * Validates a single input element and updates its DOM state.
   * @param {HTMLElement} inputEl 
   * @returns {boolean} isValid
   */
  function validateField(inputEl) {
    const fieldId = inputEl.id;
    const rule = rules[fieldId];
    if (!rule) return true;

    const errorMsg = rule(inputEl.value, inputEl);
    const feedbackEl = document.getElementById(`${fieldId}-error`);

    if (errorMsg) {
      inputEl.classList.remove("is-valid");
      inputEl.classList.add("is-invalid");
      inputEl.setAttribute("aria-invalid", "true");
      if (feedbackEl) {
        feedbackEl.textContent = errorMsg;
        feedbackEl.style.display = "block";
      }
      return false;
    } else {
      inputEl.classList.remove("is-invalid");
      inputEl.classList.add("is-valid");
      inputEl.setAttribute("aria-invalid", "false");
      if (feedbackEl) {
        feedbackEl.textContent = "";
        feedbackEl.style.display = "none";
      }
      return true;
    }
  }

  /**
   * Resets all validation classes and error texts on a form.
   */
  function resetForm(formEl) {
    if (!formEl) return;
    formEl.reset();
    const fields = formEl.querySelectorAll("input, select, textarea");
    fields.forEach(field => {
      field.classList.remove("is-valid", "is-invalid");
      field.removeAttribute("aria-invalid");
    });
    const feedbacks = formEl.querySelectorAll(".form-feedback");
    feedbacks.forEach(fb => {
      fb.textContent = "";
      fb.style.display = "none";
    });
  }

  /**
   * Attaches real-time listeners (blur, input) to all registered fields in a form.
   */
  function attachLiveListeners(formEl) {
    if (!formEl) return;

    Object.keys(rules).forEach(fieldId => {
      const inputEl = document.getElementById(fieldId);
      if (!inputEl) return;

      // Validate on blur
      inputEl.addEventListener("blur", () => {
        validateField(inputEl);
      });

      // Clear or update on input once the user starts fixing errors
      inputEl.addEventListener("input", () => {
        if (inputEl.classList.contains("is-invalid")) {
          validateField(inputEl);
        }
      });

      if (inputEl.type === "checkbox" || inputEl.tagName === "SELECT") {
        inputEl.addEventListener("change", () => {
          validateField(inputEl);
        });
      }
    });
  }

  /**
   * Validates the entire registration form and collects sanitized data.
   * @param {HTMLFormElement} formEl 
   * @returns {Object|null} Form data payload or null if invalid
   */
  function validateEntireForm(formEl) {
    let isAllValid = true;
    let firstInvalidField = null;

    Object.keys(rules).forEach(fieldId => {
      const el = document.getElementById(fieldId);
      if (el) {
        const isValid = validateField(el);
        if (!isValid) {
          isAllValid = false;
          if (!firstInvalidField) {
            firstInvalidField = el;
          }
        }
      }
    });

    if (!isAllValid) {
      if (firstInvalidField) firstInvalidField.focus();
      return null;
    }

    const eventSelect = document.getElementById("reg-event");
    const selectedEventId = eventSelect.value;
    const selectedEvent = EVENTS_DATA.find(e => e.id === selectedEventId);

    const ticketCount = parseInt(document.getElementById("reg-tickets").value, 10) || 1;
    const ticketTypeEl = document.querySelector('input[name="ticket-tier"]:checked');
    const ticketType = ticketTypeEl ? ticketTypeEl.value : "General Admission";

    let unitPrice = selectedEvent ? selectedEvent.price : 0;
    if (ticketType.includes("VIP")) {
      unitPrice += 30; // VIP surcharge
    }
    const totalPrice = unitPrice * ticketCount;

    return {
      fullName: document.getElementById("reg-name").value.trim(),
      email: document.getElementById("reg-email").value.trim(),
      phone: document.getElementById("reg-phone").value.trim(),
      eventId: selectedEventId,
      eventTitle: selectedEvent ? selectedEvent.title : "Event",
      eventDate: selectedEvent ? selectedEvent.date : "",
      displayDate: selectedEvent ? selectedEvent.displayDate : "",
      venue: selectedEvent ? `${selectedEvent.venue}, ${selectedEvent.city}` : "",
      ticketType: ticketType,
      ticketCount: ticketCount,
      totalPrice: totalPrice,
      specialRequests: document.getElementById("reg-notes") ? document.getElementById("reg-notes").value.trim() : ""
    };
  }

  return {
    validateField,
    validateEntireForm,
    resetForm,
    attachLiveListeners
  };
})();
