/**
 * EventFlow - Countdown Timer Engine
 * Real-time dynamic ticker calculating days, hours, minutes, and seconds
 * for all upcoming events, featured hero events, and modal views.
 */

const CountdownEngine = (() => {
  let timerInterval = null;

  /**
   * Calculates the difference between now and the event target date.
   * @param {string|Date} targetDate 
   * @returns {Object} { days, hours, minutes, seconds, isPast, totalMs, isLive }
   */
  function getTimeRemaining(targetDate) {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const totalMs = target - now;

    if (isNaN(target)) {
      return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isLive: false };
    }

    if (totalMs <= 0) {
      // If within 24 hours of start time, consider it "Live Now"
      const oneDayMs = 24 * 60 * 60 * 1000;
      const isLive = Math.abs(totalMs) < oneDayMs;
      return {
        totalMs,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: !isLive,
        isLive: isLive
      };
    }

    const seconds = Math.floor((totalMs / 1000) % 60);
    const minutes = Math.floor((totalMs / 1000 / 60) % 60);
    const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

    return {
      totalMs,
      days,
      hours,
      minutes,
      seconds,
      isPast: false,
      isLive: false
    };
  }

  /**
   * Formats numbers to two digits with leading zero.
   * @param {number} n 
   * @returns {string}
   */
  function padZero(n) {
    return n < 10 ? `0${n}` : `${n}`;
  }

  /**
   * Generates a mini countdown HTML string for event cards.
   * @param {string} targetDate 
   * @returns {string}
   */
  function formatMiniBadge(targetDate) {
    const time = getTimeRemaining(targetDate);
    if (time.isLive) {
      return `<span class="countdown-badge live-pulse"><span class="pulse-dot"></span> Live Now</span>`;
    }
    if (time.isPast) {
      return `<span class="countdown-badge past-badge">Event Concluded</span>`;
    }
    return `
      <div class="countdown-mini" aria-label="Starts in ${time.days} days, ${time.hours} hours">
        <span class="countdown-unit"><strong>${padZero(time.days)}</strong>d</span>
        <span class="countdown-sep">:</span>
        <span class="countdown-unit"><strong>${padZero(time.hours)}</strong>h</span>
        <span class="countdown-sep">:</span>
        <span class="countdown-unit"><strong>${padZero(time.minutes)}</strong>m</span>
        <span class="countdown-sep">:</span>
        <span class="countdown-unit"><strong>${padZero(time.seconds)}</strong>s</span>
      </div>
    `;
  }

  /**
   * Generates a full interactive countdown grid for hero/modal details.
   * @param {string} targetDate 
   * @returns {string}
   */
  function formatDetailedGrid(targetDate) {
    const time = getTimeRemaining(targetDate);
    if (time.isLive) {
      return `
        <div class="countdown-live-banner">
          <span class="pulse-dot large"></span>
          <div>
            <strong>EVENT IS LIVE TODAY</strong>
            <p>Sessions and broadcasts are currently in progress.</p>
          </div>
        </div>
      `;
    }
    if (time.isPast) {
      return `
        <div class="countdown-past-banner">
          <span>This event has already concluded. Stay tuned for next year's edition!</span>
        </div>
      `;
    }

    return `
      <div class="countdown-grid" role="timer" aria-live="polite">
        <div class="countdown-box">
          <span class="countdown-val">${padZero(time.days)}</span>
          <span class="countdown-lbl">Days</span>
        </div>
        <div class="countdown-box">
          <span class="countdown-val">${padZero(time.hours)}</span>
          <span class="countdown-lbl">Hours</span>
        </div>
        <div class="countdown-box">
          <span class="countdown-val">${padZero(time.minutes)}</span>
          <span class="countdown-lbl">Minutes</span>
        </div>
        <div class="countdown-box">
          <span class="countdown-val">${padZero(time.seconds)}</span>
          <span class="countdown-lbl">Seconds</span>
        </div>
      </div>
    `;
  }

  /**
   * Scans DOM and updates all elements with [data-countdown-target]
   */
  function tick() {
    const cardTimers = document.querySelectorAll("[data-countdown-card]");
    cardTimers.forEach(el => {
      const target = el.getAttribute("data-countdown-card");
      if (target) {
        el.innerHTML = formatMiniBadge(target);
      }
    });

    const detailedTimers = document.querySelectorAll("[data-countdown-detailed]");
    detailedTimers.forEach(el => {
      const target = el.getAttribute("data-countdown-detailed");
      if (target) {
        el.innerHTML = formatDetailedGrid(target);
      }
    });
  }

  /**
   * Starts the 1-second interval loop.
   */
  function start() {
    if (timerInterval) clearInterval(timerInterval);
    tick(); // Run immediately
    timerInterval = setInterval(tick, 1000);
  }

  function stop() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  return {
    getTimeRemaining,
    formatMiniBadge,
    formatDetailedGrid,
    start,
    stop,
    tick
  };
})();
