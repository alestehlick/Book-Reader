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

  const DEFAULT_AUDIO_DIRS = [
    "audio/paragraphs/s", // your current screenshot suggests this is the real folder
    "audio/paragraphs",   // fallback in case you remove the extra /s later
  ];

  const state = {
    currentIndex: 0,
    continuous: true,
    oneParagraphMode: true,
    activeSectionId: book.sections[0]?.id ?? null,

    currentAudioCandidates: [],
    currentAudioCandidateIndex: -1,
    currentAudioPath: "",
    autoplayRequested: false,
  };

  function formatTime(seconds) {
    const value = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const mins = Math.floor(value / 60);
    const secs = Math.floor(value % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function normalizePath(path) {
    return String(path || "")
      .trim()
      .replace(/\\/g, "/")
      .replace(/^\.?\//, "");
  }

  function resolveAudioCandidates(paragraph) {
    if (!paragraph) return [];

    const explicit = normalizePath(paragraph.audio);
    if (explicit) return [explicit];

    if (!paragraph.id || paragraph.id.startsWith("00.00")) {
      return [];
    }

    return DEFAULT_AUDIO_DIRS.map((dir) => `${dir}/${paragraph.id}.mp3`);
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

  function escapeHtml(text) {
    return String(text || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
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

    const candidates = resolveAudioCandidates(current);
    playerTimeRangeEl.textContent =
      candidates.length > 0
        ? (current.duration && current.duration > 0
            ? `Duration: ${formatTime(current.duration)}`
            : "Audio ready")
        : "No audio";

    nowReadingTitleEl.textContent = sectionLabel;

    currentParagraphTextEl.innerHTML = current.text
      .split(/\n+/)
      .map((line) => `<p>${escapeHtml(line)}</p>`)
      .join("");

    previousParagraphTextEl.textContent = previous ? previous.text : "—";
    nextParagraphTextEl.textContent = next ? next.text : "—";

    contextGridEl.style.display = state.oneParagraphMode ? "none" : "grid";
  }

  function renderMeta() {
    const current = getCurrentParagraph();
    if (!current) return;

    state.activeSectionId = current.sectionId;
    updateSectionHighlight();
    renderText();
  }

  function clearAudioElement() {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    state.currentAudioPath = "";
    state.currentAudioCandidateIndex = -1;
  }

  async function loadAudioCandidate(candidateIndex, autoplay = false) {
    const paragraph = getCurrentParagraph();
    if (!paragraph) return;

    const candidates = state.currentAudioCandidates;
    if (candidateIndex < 0 || candidateIndex >= candidates.length) {
      clearAudioElement();
      updatePlayPauseButton();
      console.warn("No working audio source found for paragraph:", paragraph.id);
      return;
    }

    state.currentAudioCandidateIndex = candidateIndex;
    state.currentAudioPath = candidates[candidateIndex];
    state.autoplayRequested = autoplay;

    audio.pause();
    audio.src = state.currentAudioPath;
    audio.load();

    if (autoplay) {
      try {
        await audio.play();
      } catch (err) {
        console.warn("Autoplay was blocked or source is not ready yet:", err);
      }
    }

    updatePlayPauseButton();
  }

  async function loadParagraph(index, autoplay = false) {
    if (index < 0 || index >= flatParagraphs.length) return;

    state.currentIndex = index;
    const paragraph = getCurrentParagraph();

    renderMeta();

    progressBar.value = 0;
    currentTimeLabel.textContent = "0:00";
    durationLabel.textContent =
      paragraph?.duration ? formatTime(paragraph.duration) : "0:00";

    state.currentAudioCandidates = resolveAudioCandidates(paragraph);
    state.currentAudioCandidateIndex = -1;
    state.currentAudioPath = "";
    state.autoplayRequested = autoplay;

    if (state.currentAudioCandidates.length === 0) {
      clearAudioElement();
      playPauseBtn.textContent = "Play";
      console.warn("Paragraph has no audio:", paragraph?.id);
      return;
    }

    await loadAudioCandidate(0, autoplay);
  }

  function updatePlayPauseButton() {
    const current = getCurrentParagraph();
    const hasAudio = resolveAudioCandidates(current).length > 0;
    playPauseBtn.textContent = hasAudio && !audio.paused ? "Pause" : "Play";
  }

  async function togglePlayPause() {
    const current = getCurrentParagraph();
    if (!current) return;

    const candidates = resolveAudioCandidates(current);
    if (candidates.length === 0) {
      console.warn("Current paragraph has no audio.");
      return;
    }

    if (!state.currentAudioPath) {
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

  function findFirstPlayableIndex() {
    const index = flatParagraphs.findIndex((p) => resolveAudioCandidates(p).length > 0);
    return index >= 0 ? index : 0;
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

  audio.addEventListener("error", async () => {
    const paragraph = getCurrentParagraph();
    if (!paragraph) return;

    const nextCandidateIndex = state.currentAudioCandidateIndex + 1;

    if (nextCandidateIndex < state.currentAudioCandidates.length) {
      console.warn(
        `Audio failed for ${state.currentAudioPath}. Trying fallback: ${state.currentAudioCandidates[nextCandidateIndex]}`
      );
      await loadAudioCandidate(nextCandidateIndex, state.autoplayRequested);
      return;
    }

    console.warn("All audio candidates failed for paragraph:", paragraph.id, state.currentAudioCandidates);
    updatePlayPauseButton();
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
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.classList.toggle("open");
    }
  });

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  function init() {
    bookTitleEl.textContent = book.title || "Untitled";
    buildSectionNav();

    const startIndex = findFirstPlayableIndex();
    loadParagraph(startIndex, false);
  }

  init();
})();
