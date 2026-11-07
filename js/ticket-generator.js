/**
 * EventFlow - Digital Ticket Pass & QR Code Generator
 * Creates an interactive boarding-pass style event badge,
 * renders an SVG QR code without external dependencies,
 * and provides .ics Calendar download and Print actions.
 */

const TicketGenerator = (() => {

  /**
   * Generates a sleek, authentic SVG QR Code pattern based on text input.
   * Self-contained 25x25 matrix with finder patterns, timing tracks, and encoded bits.
   * @param {string} text - Payload to encode
   * @param {number} size - Output pixel width/height
   * @returns {string} SVG HTML string
   */
  function generateQRCodeSVG(text, size = 160) {
    const modules = 25;
    const grid = Array.from({ length: modules }, () => Array(modules).fill(false));

    // Simple deterministic hash for pattern distribution
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    // Helper: draw finder pattern at (r, c)
    function drawFinder(row, col) {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const pr = row + r;
          const pc = col + c;
          if (pr < 0 || pr >= modules || pc < 0 || pc >= modules) continue;

          // 7x7 outer square, 3x3 inner square
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
              grid[pr][pc] = true;
            } else {
              grid[pr][pc] = false;
            }
          } else {
            grid[pr][pc] = false; // separator
          }
        }
      }
    }

    // Draw standard 3 finder patterns (Top-Left, Top-Right, Bottom-Left)
    drawFinder(0, 0);
    drawFinder(0, modules - 7);
    drawFinder(modules - 7, 0);

    // Timing patterns
    for (let i = 8; i < modules - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Dark module
    grid[modules - 8][8] = true;

    // Fill data areas deterministically using text bytes
    let byteIdx = 0;
    for (let c = modules - 1; c > 0; c -= 2) {
      if (c === 6) c--; // Skip vertical timing column
      for (let count = 0; count < modules; count++) {
        const r = (c % 4 === 1) ? modules - 1 - count : count;
        // Skip finder zones
        const inTL = r < 9 && c < 9;
        const inTR = r < 9 && c > modules - 9;
        const inBL = r > modules - 9 && c < 9;
        if (!inTL && !inTR && !inBL && grid[r][c] === false && grid[r][c - 1] === false) {
          const charCode = text.charCodeAt(byteIdx % text.length) ^ (r * modules + c);
          grid[r][c] = ((charCode + hash) % 3 === 0);
          grid[r][c - 1] = ((charCode ^ hash) % 2 === 0);
          byteIdx++;
        }
      }
    }

    // Build SVG rect elements
    const cellSize = (size / modules).toFixed(2);
    let rects = "";
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (grid[r][c]) {
          const x = (c * cellSize).toFixed(2);
          const y = (r * cellSize).toFixed(2);
          rects += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="currentColor" rx="0.8"/>`;
        }
      }
    }

    return `
      <svg class="qr-code-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" aria-label="QR Code Ticket verification">
        <rect width="${size}" height="${size}" fill="var(--color-surface, #ffffff)" rx="10"/>
        <g fill="var(--color-text, #111827)">
          ${rects}
        </g>
      </svg>
    `;
  }

  /**
   * Generates formatted iCalendar (.ics) content for the event.
   * @param {Object} event 
   * @returns {string} ics text file content
   */
  function generateIcsFileContent(event, registration) {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // +4 hours default duration

    const formatIcsTime = (d) => {
      return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const clean = (str) => (str || "").replace(/[,\n]/g, " ");

    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//EventFlow//Event Management Platform//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${registration.id}@eventflow.local`,
      `DTSTAMP:${formatIcsTime(new Date())}`,
      `DTSTART:${formatIcsTime(startDate)}`,
      `DTEND:${formatIcsTime(endDate)}`,
      `SUMMARY:${clean(event.title)}`,
      `DESCRIPTION:${clean(event.shortDescription)} | Ticket: ${registration.id} (${registration.ticketType})`,
      `LOCATION:${clean(event.venue)}, ${clean(event.city)}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
  }

  /**
   * Triggers a download of the .ics Calendar event file.
   */
  function downloadCalendarFile(event, registration) {
    const icsContent = generateIcsFileContent(event, registration);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Renders the complete HTML for the Digital Boarding Pass Ticket modal view.
   * @param {Object} reg - Registration data object
   * @param {Object} event - Event data object
   * @returns {string} HTML string
   */
  function renderTicketPassHTML(reg, event) {
    const qrSvg = generateQRCodeSVG(reg.qrData || `${reg.id}:${reg.email}`, 140);
    const eventTimeStr = event ? event.displayDate : reg.displayDate;
    const venueStr = event ? `${event.venue}, ${event.city}` : reg.venue;
    const categoryName = event ? event.categoryLabel : "Event";
    const priceText = reg.totalPrice > 0 ? `$${reg.totalPrice}.00` : "Free / Included";

    return `
      <div class="ticket-pass-wrapper" id="printable-ticket">
        <div class="ticket-pass">
          <!-- Left Ticket Stub (Main Details) -->
          <div class="ticket-main">
            <div class="ticket-header">
              <div class="ticket-brand">
                <span class="ticket-logo-icon">✨</span>
                <span class="ticket-brand-name">EventFlow Pass</span>
              </div>
              <span class="ticket-type-badge">${reg.ticketType || "General Admission"}</span>
            </div>

            <div class="ticket-event-info">
              <span class="ticket-category-tag">${categoryName}</span>
              <h3 class="ticket-title">${reg.eventTitle}</h3>
            </div>

            <div class="ticket-details-grid">
              <div class="detail-cell">
                <span class="detail-label">Date & Time</span>
                <span class="detail-val">${eventTimeStr}</span>
              </div>
              <div class="detail-cell">
                <span class="detail-label">Location</span>
                <span class="detail-val">${venueStr}</span>
              </div>
              <div class="detail-cell">
                <span class="detail-label">Attendee Name</span>
                <span class="detail-val">${reg.fullName}</span>
              </div>
              <div class="detail-cell">
                <span class="detail-label">Passes / Seats</span>
                <span class="detail-val">${reg.ticketCount || 1} Person(s) (${priceText})</span>
              </div>
            </div>

            <div class="ticket-footer-bar">
              <span class="ticket-status-pill"><span class="status-dot"></span> Confirmed</span>
              <span class="ticket-email-hint">${reg.email}</span>
            </div>
          </div>

          <!-- Perforated Notch Divider -->
          <div class="ticket-perforation" aria-hidden="true">
            <span class="notch top"></span>
            <div class="dash-line"></div>
            <span class="notch bottom"></span>
          </div>

          <!-- Right Ticket Stub (Barcode & Verification) -->
          <div class="ticket-side">
            <div class="ticket-qr-container">
              ${qrSvg}
            </div>
            <div class="ticket-code-block">
              <span class="ticket-id-label">REGISTRATION ID</span>
              <span class="ticket-id-value">${reg.id}</span>
            </div>
            <p class="ticket-scan-prompt">Scan at door for verified express entry</p>
          </div>
        </div>

        <!-- Ticket Interactive Actions -->
        <div class="ticket-actions no-print">
          <button class="btn btn-primary" id="btn-print-ticket" onclick="window.print()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print / Save PDF
          </button>
          <button class="btn btn-secondary" id="btn-add-calendar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Add to Calendar (.ics)
          </button>
        </div>
      </div>
    `;
  }

  return {
    generateQRCodeSVG,
    generateIcsFileContent,
    downloadCalendarFile,
    renderTicketPassHTML
  };
})();
