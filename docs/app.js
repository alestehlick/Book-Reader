(() => {
  "use strict";

  const audio = document.getElementById("audioPlayer");

  const bookTitleEl = document.getElementById("bookTitle");
  const nowReadingTitleEl = document.getElementById("nowReadingTitle");
  const sectionsNavEl = document.getElementById("sectionsNav");

  const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  const playerSectionLabelEl = document.getElementById("playerSectionLabel");
  const playerParagraphLabelEl = document.getElementById("playerParagraphLabel");
  const playerTimeRangeEl = document.getElementById("playerTimeRange");

  const prevBtn = document.getElementById("prevBtn");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const nextBtn = document.getElementById("nextBtn");

  const continuousToggle = document.getElementById("continuousToggle");
  const oneParagraphToggle = document.getElementById("oneParagraphToggle");

  const progressBar = document.getElementById("progressBar");
  const currentTimeLabel = document.getElementById("currentTimeLabel");
  const durationLabel = document.getElementById("durationLabel");

  const currentParagraphTextEl = document.getElementById("currentParagraphText");
  const previousParagraphTextEl = document.getElementById("previousParagraphText");
  const nextParagraphTextEl = document.getElementById("nextParagraphText");
  const contextGridEl = document.getElementById("contextGrid");

  if (typeof BOOK_DATA === "undefined") {
    bookTitleEl.textContent = "Loading failed";
    currentParagraphTextEl.textContent = "BOOK_DATA is missing.";
    console.error("BOOK_DATA is missing. Make sure chapter1-data.js loads before app.js.");
    return;
  }

  const book = BOOK_DATA;
  const flatParagraphs = [];
  const sectionStartIndexById = new Map();

  book.sections.forEach((section) => {
    sectionStartIndexById.set(section.id, flatParagraphs.length);

    section.paragraphs.forEach((paragraph, pIndex) => {
      flatParagraphs.push({
        ...paragraph,
        sectionId: section.id,
        sectionNumber: section.number || section.id,
        sectionTitle: section.title,
        paragraphNumber: pIndex + 1,
      });
    });
  });

  const state = {
    currentIndex: 0,
    continuous: true,
    oneParagraphMode: true,
    activeSectionId: book.sections[0]?.id ?? null,
  };

  function formatTime(seconds) {
    const value = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const mins = Math.floor(value / 60);
    const secs = Math.floor(value % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function getCurrentParagraph() {
    return flatParagraphs[state.currentIndex] || null;
  }

  function getParagraph(index) {
    if (index < 0 || index >= flatParagraphs.length) return null;
    return flatParagraphs[index];
  }

  function buildSectionNav() {
    sectionsNavEl.innerHTML = "";

    book.sections.forEach((section) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "section-link";
      btn.dataset.sectionId = section.id;
      btn.innerHTML = `
        <span class="section-number">${section.number || section.id}</span>
        <span class="section-title">${section.title}</span>
      `;

      btn.addEventListener("click", () => {
        const index = sectionStartIndexById.get(section.id);
        if (typeof index === "number") {
          loadParagraph(index, false);
        }
      });

      sectionsNavEl.appendChild(btn);
    });
  }

  function updateSectionHighlight() {
    document.querySelectorAll(".section-link").forEach((el) => {
      const isActive = el.dataset.sectionId === state.activeSectionId;
      el.classList.toggle("active", isActive);
    });
  }

  function renderText() {
    const current = getCurrentParagraph();
    const previous = getParagraph(state.currentIndex - 1);
    const next = getParagraph(state.currentIndex + 1);

    if (!current) {
      currentParagraphTextEl.textContent = "No paragraph found.";
      previousParagraphTextEl.textContent = "—";
      nextParagraphTextEl.textContent = "—";
      return;
    }

    const sectionLabel = `${current.sectionNumber} — ${current.sectionTitle}`;
    const paragraphLabel = `Paragraph ${current.paragraphNumber}`;

    playerSectionLabelEl.textContent = sectionLabel;
    playerParagraphLabelEl.textContent = paragraphLabel;
    playerTimeRangeEl.textContent =
      current.duration && current.duration > 0
        ? `Duration: ${formatTime(current.duration)}`
        : "Duration: —";

    nowReadingTitleEl.textContent = sectionLabel;

    currentParagraphTextEl.innerHTML = current.text
      .split(/\n+/)
      .map((line) => `<p>${escapeHtml(line)}</p>`)
      .join("");

    previousParagraphTextEl.textContent = previous ? previous.text : "—";
    nextParagraphTextEl.textContent = next ? next.text : "—";

    contextGridEl.style.display = state.oneParagraphMode ? "none" : "grid";
  }

  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function renderMeta() {
    const current = getCurrentParagraph();
    if (!current) return;

    state.activeSectionId = current.sectionId;
    updateSectionHighlight();
    renderText();
  }

  async function loadParagraph(index, autoplay = false) {
    if (index < 0 || index >= flatParagraphs.length) return;

    state.currentIndex = index;
    const paragraph = getCurrentParagraph();
    renderMeta();

    progressBar.value = 0;
    currentTimeLabel.textContent = "0:00";
    durationLabel.textContent = paragraph?.duration ? formatTime(paragraph.duration) : "0:00";

    if (!paragraph || !paragraph.audio) {
      playPauseBtn.textContent = "Play";
      console.warn("Paragraph has no audio:", paragraph);
      return;
    }

    audio.pause();
    audio.src = paragraph.audio;
    audio.load();

    if (autoplay) {
      try {
        await audio.play();
      } catch (err) {
        console.warn("Autoplay was blocked:", err);
      }
    }

    updatePlayPauseButton();
  }

  function updatePlayPauseButton() {
    playPauseBtn.textContent = audio.paused ? "Play" : "Pause";
  }

  async function togglePlayPause() {
    const current = getCurrentParagraph();
    if (!current) return;

    if (!current.audio) {
      console.warn("Current paragraph has no audio.");
      return;
    }

    if (!audio.src || !audio.src.endsWith(current.audio)) {
      await loadParagraph(state.currentIndex, true);
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
      } catch (err) {
        console.warn("Play failed:", err);
      }
    } else {
      audio.pause();
    }

    updatePlayPauseButton();
  }

  async function goToNextParagraph(autoplay = false) {
    if (state.currentIndex < flatParagraphs.length - 1) {
      await loadParagraph(state.currentIndex + 1, autoplay);
    }
  }

  async function goToPreviousParagraph(autoplay = false) {
    if (state.currentIndex > 0) {
      await loadParagraph(state.currentIndex - 1, autoplay);
    }
  }

  audio.addEventListener("loadedmetadata", () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    durationLabel.textContent = formatTime(duration);
  });

  audio.addEventListener("timeupdate", () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

    currentTimeLabel.textContent = formatTime(currentTime);
    durationLabel.textContent = formatTime(duration);

    if (duration > 0) {
      progressBar.value = String((currentTime / duration) * 100);
    } else {
      progressBar.value = "0";
    }
  });

  audio.addEventListener("play", updatePlayPauseButton);
  audio.addEventListener("pause", updatePlayPauseButton);

  audio.addEventListener("ended", async () => {
    updatePlayPauseButton();

    if (state.continuous && state.currentIndex < flatParagraphs.length - 1) {
      await goToNextParagraph(true);
    }
  });

  progressBar.addEventListener("input", () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    if (duration <= 0) return;
    const target = (Number(progressBar.value) / 100) * duration;
    audio.currentTime = target;
  });

  prevBtn.addEventListener("click", () => {
    goToPreviousParagraph(false);
  });

  nextBtn.addEventListener("click", () => {
    goToNextParagraph(false);
  });

  playPauseBtn.addEventListener("click", () => {
    togglePlayPause();
  });

  continuousToggle.addEventListener("change", () => {
    state.continuous = continuousToggle.checked;
  });

  oneParagraphToggle.addEventListener("change", () => {
    state.oneParagraphMode = oneParagraphToggle.checked;
    renderText();
  });

  toggleSidebarBtn.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-collapsed");
  });

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  function init() {
    bookTitleEl.textContent = book.title || "Untitled";
    buildSectionNav();
    renderMeta();
    loadParagraph(0, false);
  }

  init();
})();
