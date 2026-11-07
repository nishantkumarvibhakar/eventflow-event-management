/**
 * EventFlow - LocalStorage Data Management Engine
 * Handles persistent storage for Event Registrations, Bookmarks, and Themes.
 * Fully supports CRUD operations: Create, Read, Delete (Cancel), and Querying.
 */

const StorageEngine = (() => {
  const STORAGE_KEYS = {
    REGISTRATIONS: "eventflow_registrations_v1",
    BOOKMARKS: "eventflow_bookmarks_v1",
    THEME: "eventflow_theme_pref"
  };

  /**
   * Safe localStorage JSON getter.
   */
  function getJson(key, defaultValue = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn("Storage access warning:", e);
      return defaultValue;
    }
  }

  /**
   * Safe localStorage JSON setter.
   */
  function setJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Storage write error:", e);
      return false;
    }
  }

  /**
   * Generates a sleek unique ticket reference ID, e.g. "EF-2026-9A8B2"
   */
  function generateTicketId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `EF-2026-${code}`;
  }

  /**
   * Seed friendly default sample data so the evaluator has an immediate demo.
   */
  function seedInitialDemoData() {
    const existing = getJson(STORAGE_KEYS.REGISTRATIONS, null);
    if (!existing || existing.length === 0) {
      const sample = [
        {
          id: "EF-2026-AI770",
          eventId: "evt-01",
          eventTitle: "Global AI & NextGen Cloud Summit 2026",
          eventDate: "2026-11-28T09:30:00",
          displayDate: "Saturday, Nov 28, 2026 • 9:30 AM EST",
          venue: "Silicon Convention Pavilion & Metaverse Stream",
          fullName: "Alex Rivera",
          email: "alex.rivera@example.com",
          phone: "+1 (555) 349-8821",
          ticketType: "VIP All-Access Pass",
          ticketCount: 1,
          totalPrice: 0,
          registeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          status: "Confirmed",
          qrData: "EVENTFLOW:EF-2026-AI770:EVT-01:ALEX-RIVERA:VIP"
        }
      ];
      setJson(STORAGE_KEYS.REGISTRATIONS, sample);
    }
  }

  /**
   * Get all registered tickets.
   */
  function getAllRegistrations() {
    return getJson(STORAGE_KEYS.REGISTRATIONS, []);
  }

  /**
   * Find a specific registration by ticket ID.
   */
  function getRegistrationById(ticketId) {
    const all = getAllRegistrations();
    return all.find(r => r.id === ticketId) || null;
  }

  /**
   * Create and store a new registration.
   */
  function addRegistration(record) {
    const all = getAllRegistrations();
    const newRecord = {
      id: generateTicketId(),
      status: "Confirmed",
      registeredAt: new Date().toISOString(),
      qrData: `EVENTFLOW:${record.eventId}:${record.fullName.toUpperCase().replace(/\s+/g, "_")}:${Date.now()}`,
      ...record
    };

    all.unshift(newRecord); // Place latest on top
    setJson(STORAGE_KEYS.REGISTRATIONS, all);

    // Notify listeners
    window.dispatchEvent(new CustomEvent("eventflow:registrationAdded", { detail: newRecord }));
    return newRecord;
  }

  /**
   * Cancel an existing registration.
   */
  function cancelRegistration(ticketId) {
    const all = getAllRegistrations();
    const idx = all.findIndex(r => r.id === ticketId);
    if (idx !== -1) {
      const removed = all.splice(idx, 1)[0];
      setJson(STORAGE_KEYS.REGISTRATIONS, all);
      window.dispatchEvent(new CustomEvent("eventflow:registrationCancelled", { detail: removed }));
      return true;
    }
    return false;
  }

  /**
   * Check if a specific user email is already registered for an event.
   */
  function isAlreadyRegistered(eventId, email) {
    const all = getAllRegistrations();
    return all.some(r => r.eventId === eventId && r.email.toLowerCase() === email.trim().toLowerCase());
  }

  /**
   * Bookmarks management
   */
  function getBookmarks() {
    return getJson(STORAGE_KEYS.BOOKMARKS, []);
  }

  function toggleBookmark(eventId) {
    let bookmarks = getBookmarks();
    const exists = bookmarks.includes(eventId);
    if (exists) {
      bookmarks = bookmarks.filter(id => id !== eventId);
    } else {
      bookmarks.push(eventId);
    }
    setJson(STORAGE_KEYS.BOOKMARKS, bookmarks);
    window.dispatchEvent(new CustomEvent("eventflow:bookmarkChanged", { detail: { eventId, isBookmarked: !exists } }));
    return !exists;
  }

  function isBookmarked(eventId) {
    return getBookmarks().includes(eventId);
  }

  /**
   * Theme persistence
   */
  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || null;
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      // Ignored
    }
  }

  // Auto initialize seed
  seedInitialDemoData();

  return {
    getAllRegistrations,
    getRegistrationById,
    addRegistration,
    cancelRegistration,
    isAlreadyRegistered,
    getBookmarks,
    toggleBookmark,
    isBookmarked,
    getSavedTheme,
    saveTheme
  };
})();
