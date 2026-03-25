(() => {
  "use strict";

  const audio = document.getElementById("audioPlayer");

  const bookTitleEl = document.getElementById("bookTitle");
  const nowReadingTitleEl = document.getElementById("nowReadingTitle");
  const sectionsNavEl = document.getElementById("sectionsNav");

  const sidebarEl = document.getElementById("sidebar");
  const sidebarBackdropEl = document.getElementById("sidebarBackdrop");
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

  const mediaSectionEl = document.getElementById("mediaSection");
  const mediaSummaryEl = document.getElementById("mediaSummary");
  const figureGroupEl = document.getElementById("figureGroup");
  const videoGroupEl = document.getElementById("videoGroup");
  const paragraphFiguresEl = document.getElementById("paragraphFigures");
  const paragraphVideosEl = document.getElementById("paragraphVideos");

  const DEFAULT_AUDIO_DIRS = ["audio/paragraphs/s", "audio/paragraphs"];
  const DEFAULT_FIGURES_DIR = "figures";
  const DEFAULT_VIDEOS_DIR = "videos";
  const THEME_STORAGE_KEY = "audio-reader-theme";

  const state = {
    book: null,
    flatParagraphs: [],
    sectionStartIndexById: new Map(),
    currentIndex: 0,
    continuous: true,
    oneParagraphMode: true,
    activeSectionId: null,

    currentAudioCandidates: [],
    currentAudioCandidateIndex: -1,
    currentAudioPath: "",
    autoplayRequested: false,
  };

  function getDataConfig() {
    const root = document.documentElement;
    const body = document.body;

    return {
      jsUrl: body.dataset.bookJs || root.dataset.bookJs || "",
      jsonUrl: body.dataset.bookJson || root.dataset.bookJson || "",
      prefer: (body.dataset.bookDataPreference || root.dataset.bookDataPreference || "js").toLowerCase(),
    };
  }

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

  function isAbsoluteLike(path) {
    return /^(https?:)?\/\//i.test(path) || path.startsWith("/") || path.startsWith("data:") || path.startsWith("blob:");
  }

function hasExtension(path) {
  const value = String(path || "").split(/[?#]/)[0].trim();
  const lastSegment = value.split("/").pop() || "";
  return /\.(png|jpg|jpeg|gif|webp|svg|mp4|webm|mp3|wav|ogg|m4a|json|js|css|html)$/i.test(lastSegment);
}

  function joinPath(base, leaf) {
    const cleanBase = normalizePath(base).replace(/\/+$/, "");
    const cleanLeaf = normalizePath(leaf).replace(/^\/+/, "");
    return cleanBase ? `${cleanBase}/${cleanLeaf}` : cleanLeaf;
  }

  function asArray(value) {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined || value === "") return [];
    return [value];
  }

  function uniqueStrings(items) {
    return [...new Set(items.filter(Boolean))];
  }

  function escapeHtml(text) {
    return String(text || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function collapseWhitespace(text) {
    return String(text || "")
      .replace(/\s*\n+\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function toSafeUrl(path) {
    if (!path) return "";
    return isAbsoluteLike(path) ? path : encodeURI(path).replace(/#/g, "%23");
  }

  function getCurrentParagraph() {
    return state.flatParagraphs[state.currentIndex] || null;
  }

  function getParagraph(index) {
    if (index < 0 || index >= state.flatParagraphs.length) return null;
    return state.flatParagraphs[index];
  }

  function getSectionById(sectionId) {
    return state.book?.sections?.find((section) => section.id === sectionId) || null;
  }

  function getSectionParagraphCount(sectionId) {
    const section = getSectionById(sectionId);
    return Array.isArray(section?.paragraphs) ? section.paragraphs.length : 0;
  }

  function getParagraphPreview(text, maxLength = 78) {
    const clean = collapseWhitespace(text);
    if (clean.length <= maxLength) return clean;
    return `${clean.slice(0, maxLength).trimEnd()}…`;
  }

  function getParagraphCode(paragraph) {
    if (paragraph?.id) return paragraph.id;
    const n = String(paragraph?.paragraphNumber || 1).padStart(3, "0");
    return `${paragraph?.sectionNumber || paragraph?.sectionId || "00.00"}-p${n}`;
  }

  function setLoadError(message) {
    bookTitleEl.textContent = "Loading failed";
    nowReadingTitleEl.textContent = "—";
    currentParagraphTextEl.innerHTML = `<p>${escapeHtml(message)}</p>`;
    previousParagraphTextEl.textContent = "—";
    nextParagraphTextEl.textContent = "—";
    mediaSectionEl.hidden = true;
    contextGridEl.style.display = "none";
  }

  function scriptAlreadyLoaded(url) {
    const wanted = normalizePath(url);
    return [...document.scripts].some((script) => {
      const src = script.getAttribute("src");
      if (!src) return false;
      const normalizedSrc = normalizePath(src);
      return normalizedSrc === wanted || normalizedSrc.endsWith(`/${wanted}`);
    });
  }

  function loadScriptOnce(url) {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error("No JS book-data path provided."));
        return;
      }

      if (scriptAlreadyLoaded(url)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));

      document.head.appendChild(script);
    });
  }

  async function loadBookData() {
    if (window.BOOK_DATA && typeof window.BOOK_DATA === "object") {
      return window.BOOK_DATA;
    }

    const inlineJsonEl = document.getElementById("bookDataInline");
    if (inlineJsonEl && inlineJsonEl.textContent.trim()) {
      return JSON.parse(inlineJsonEl.textContent);
    }

    const config = getDataConfig();
    const modes = config.prefer === "json" ? ["json", "js"] : ["js", "json"];

    for (const mode of modes) {
      if (mode === "js" && config.jsUrl) {
        try {
          await loadScriptOnce(config.jsUrl);
          if (window.BOOK_DATA && typeof window.BOOK_DATA === "object") {
            return window.BOOK_DATA;
          }
        } catch (error) {
          console.warn(error);
        }
      }

      if (mode === "json" && config.jsonUrl) {
        try {
          const response = await fetch(config.jsonUrl, { cache: "no-store" });
          if (!response.ok) {
            throw new Error(`Failed to fetch JSON: ${response.status} ${response.statusText}`);
          }
          return await response.json();
        } catch (error) {
          console.warn(error);
        }
      }
    }

    throw new Error(
      "No book data could be loaded. Provide window.BOOK_DATA via a JS file, or set data-book-json / data-book-js on the HTML root or body."
    );
  }

  function normalizeParagraph(paragraph, section, paragraphIndex) {
    const figures = Array.isArray(paragraph?.figures) ? paragraph.figures : [];
    const videos = Array.isArray(paragraph?.videos) ? paragraph.videos : [];

    return {
      ...paragraph,
      id: String(paragraph?.id || ""),
      text: String(paragraph?.text || ""),
      figures,
      videos,
      sectionId: String(section?.id || ""),
      sectionNumber: String(section?.number || section?.id || ""),
      sectionTitle: String(section?.title || ""),
      paragraphNumber: paragraphIndex + 1,
    };
  }

  function indexBookData(book) {
    state.book = {
      title: String(book?.title || "Untitled Book"),
      language: String(book?.language || "en"),
      sections: Array.isArray(book?.sections) ? book.sections : [],
    };

    state.flatParagraphs = [];
    state.sectionStartIndexById = new Map();

    state.book.sections.forEach((section) => {
      const startIndex = state.flatParagraphs.length;
      state.sectionStartIndexById.set(section.id, startIndex);

      const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];
      paragraphs.forEach((paragraph, pIndex) => {
        state.flatParagraphs.push(normalizeParagraph(paragraph, section, pIndex));
      });
    });

    state.activeSectionId = state.book.sections[0]?.id ?? null;
  }

  function resolveAudioCandidates(paragraph) {
    if (!paragraph) return [];

    const explicitEntries = asArray(paragraph.audio)
      .flatMap((entry) => {
        if (!entry) return [];

        if (typeof entry === "string") {
          const cleaned = normalizePath(entry);
          if (!cleaned) return [];
          if (cleaned.includes("/") || hasExtension(cleaned) || isAbsoluteLike(cleaned)) {
            return [cleaned];
          }
          return DEFAULT_AUDIO_DIRS.map((dir) => joinPath(dir, `${cleaned}.mp3`));
        }

        if (typeof entry === "object") {
          const explicitPath = normalizePath(
            entry.src || entry.path || entry.file || entry.filename || entry.audio || ""
          );

          if (!explicitPath) return [];
          if (explicitPath.includes("/") || hasExtension(explicitPath) || isAbsoluteLike(explicitPath)) {
            return [explicitPath];
          }
          return DEFAULT_AUDIO_DIRS.map((dir) => joinPath(dir, `${explicitPath}.mp3`));
        }

        return [];
      });

    if (explicitEntries.length > 0) {
      return uniqueStrings(explicitEntries);
    }

    if (!paragraph.id || paragraph.id.startsWith("00.00")) {
      return [];
    }

    return DEFAULT_AUDIO_DIRS.map((dir) => joinPath(dir, `${paragraph.id}.mp3`));
  }

  function resolveFigureEntry(rawEntry, index) {
    if (!rawEntry) return null;

    if (typeof rawEntry === "string") {
      const cleaned = normalizePath(rawEntry);
      const src = cleaned.includes("/") || hasExtension(cleaned) || isAbsoluteLike(cleaned)
        ? cleaned
        : joinPath(DEFAULT_FIGURES_DIR, hasExtension(cleaned) ? cleaned : `${cleaned}.png`);

      return {
        src,
        label: `Figure ${index + 1}`,
        caption: "",
        alt: `Figure ${index + 1}`,
      };
    }

    if (typeof rawEntry === "object") {
      const label = String(rawEntry.label || rawEntry.title || rawEntry.name || "").trim();
      const caption = String(rawEntry.caption || rawEntry.description || "").trim();
      const alt = String(rawEntry.alt || label || `Figure ${index + 1}`).trim();

      const explicitPath = normalizePath(
        rawEntry.src || rawEntry.path || rawEntry.file || rawEntry.filename || rawEntry.image || ""
      );

      let src = "";
      if (explicitPath) {
        src = explicitPath.includes("/") || isAbsoluteLike(explicitPath)
          ? explicitPath
          : joinPath(DEFAULT_FIGURES_DIR, explicitPath);
      } else if (label) {
        src = joinPath(DEFAULT_FIGURES_DIR, `${label}.png`);
      }

      return {
        src,
        label,
        caption,
        alt,
      };
    }

    return null;
  }

  function resolveVideoEntry(rawEntry, index) {
    if (!rawEntry) return null;

    if (typeof rawEntry === "string") {
      const cleaned = normalizePath(rawEntry);
      const src = cleaned.includes("/") || hasExtension(cleaned) || isAbsoluteLike(cleaned)
        ? cleaned
        : joinPath(DEFAULT_VIDEOS_DIR, `${cleaned}.webm`);

      return {
        src,
        title: cleaned || `Clip ${index + 1}`,
        caption: "",
        poster: "",
      };
    }

    if (typeof rawEntry === "object") {
      const title = String(rawEntry.title || rawEntry.label || rawEntry.name || `Clip ${index + 1}`).trim();
      const caption = String(rawEntry.caption || rawEntry.description || "").trim();
      const posterRaw = normalizePath(rawEntry.poster || "");

      const explicitPath = normalizePath(
        rawEntry.src || rawEntry.path || rawEntry.file || rawEntry.filename || rawEntry.video || ""
      );

      let src = "";
      if (explicitPath) {
        if (explicitPath.includes("/") || isAbsoluteLike(explicitPath)) {
          src = explicitPath;
        } else {
          src = joinPath(DEFAULT_VIDEOS_DIR, hasExtension(explicitPath) ? explicitPath : `${explicitPath}.webm`);
        }
      }

      let poster = "";
      if (posterRaw) {
        poster = posterRaw.includes("/") || isAbsoluteLike(posterRaw)
          ? posterRaw
          : joinPath(DEFAULT_VIDEOS_DIR, posterRaw);
      }

      return {
        src,
        title,
        caption,
        poster,
      };
    }

    return null;
  }

  function buildSectionNav() {
    sectionsNavEl.innerHTML = "";

    state.book.sections.forEach((section) => {
      const sectionStartIndex = state.sectionStartIndexById.get(section.id);
      const sectionParagraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];

      const sectionBlock = document.createElement("section");
      sectionBlock.className = "section-block";
      sectionBlock.dataset.sectionId = section.id;

      const sectionBtn = document.createElement("button");
      sectionBtn.type = "button";
      sectionBtn.className = "section-link";
      sectionBtn.dataset.sectionId = section.id;
      sectionBtn.innerHTML = `
        <span class="section-number">${escapeHtml(section.number || section.id || "")}</span>
        <span class="section-title">${escapeHtml(section.title || "")}</span>
      `;

      sectionBtn.addEventListener("click", async () => {
        if (typeof sectionStartIndex === "number") {
          await loadParagraph(sectionStartIndex, false);
        }

        document.querySelectorAll(".section-block").forEach((block) => {
          if (block !== sectionBlock) block.classList.remove("expanded");
        });

        sectionBlock.classList.toggle("expanded");
        closeSidebar();
      });

      const paragraphNav = document.createElement("div");
      paragraphNav.className = "paragraph-nav";

      sectionParagraphs.forEach((paragraph, pIndex) => {
        const globalIndex = sectionStartIndex + pIndex;
        const paragraphBtn = document.createElement("button");
        paragraphBtn.type = "button";
        paragraphBtn.className = "paragraph-link";
        paragraphBtn.dataset.paragraphIndex = String(globalIndex);

        const paragraphId =
          paragraph?.id || `${section.number || section.id || "00.00"}-p${String(pIndex + 1).padStart(3, "0")}`;

        paragraphBtn.innerHTML = `
          <span class="paragraph-code">${escapeHtml(paragraphId)}</span>
          <span class="paragraph-link-text">${escapeHtml(getParagraphPreview(paragraph.text || ""))}</span>
        `;

        paragraphBtn.addEventListener("click", async () => {
          await loadParagraph(globalIndex, false);
          closeSidebar();
        });

        paragraphNav.appendChild(paragraphBtn);
      });

      sectionBlock.appendChild(sectionBtn);
      sectionBlock.appendChild(paragraphNav);
      sectionsNavEl.appendChild(sectionBlock);
    });
  }

  function updateSectionHighlight() {
    document.querySelectorAll(".section-block").forEach((block) => {
      const isActiveSection = block.dataset.sectionId === state.activeSectionId;
      block.classList.toggle("active", isActiveSection);

      if (isActiveSection) {
        block.classList.add("expanded");
      }
    });

    document.querySelectorAll(".section-link").forEach((el) => {
      el.classList.toggle("active", el.dataset.sectionId === state.activeSectionId);
    });

    document.querySelectorAll(".paragraph-link").forEach((el) => {
      const index = Number(el.dataset.paragraphIndex);
      el.classList.toggle("active", index === state.currentIndex);
    });
  }

  function renderParagraphText(paragraph) {
    const blocks = String(paragraph?.text || "")
      .split(/\n\s*\n+/)
      .map((block) => block.replace(/\n+/g, " ").trim())
      .filter(Boolean);

    if (blocks.length === 0) {
      currentParagraphTextEl.innerHTML = "<p>—</p>";
      return;
    }

    currentParagraphTextEl.innerHTML = blocks
      .map((block) => `<p>${escapeHtml(block)}</p>`)
      .join("");
  }

  function createMissingMediaCard(message) {
    const card = document.createElement("article");
    card.className = "media-missing-card";

    const text = document.createElement("div");
    text.className = "media-missing-text";
    text.textContent = message;

    card.appendChild(text);
    return card;
  }

  function renderFigures(entries) {
    paragraphFiguresEl.innerHTML = "";

    entries.forEach((entry, index) => {
      const figureData = resolveFigureEntry(entry, index);
      if (!figureData || !figureData.src) return;

      const wrapper = document.createElement("article");
      wrapper.className = "media-figure-card";

      const figure = document.createElement("figure");
      figure.className = "media-figure";

      const img = document.createElement("img");
      img.className = "media-figure-image";
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = figureData.alt || figureData.label || `Figure ${index + 1}`;
      img.src = toSafeUrl(figureData.src);

      img.addEventListener("error", () => {
        wrapper.replaceWith(
          createMissingMediaCard(`Could not load figure file: ${figureData.src}`)
        );
      });

      figure.appendChild(img);

      if (figureData.label || figureData.caption) {
        const caption = document.createElement("figcaption");
        caption.className = "media-caption";

        if (figureData.label) {
          const labelSpan = document.createElement("span");
          labelSpan.className = "media-caption-label";
          labelSpan.textContent = figureData.label;
          caption.appendChild(labelSpan);

          if (figureData.caption) {
            caption.appendChild(document.createTextNode(". "));
          }
        }

        if (figureData.caption) {
          caption.appendChild(document.createTextNode(figureData.caption));
        }

        figure.appendChild(caption);
      }

      wrapper.appendChild(figure);
      paragraphFiguresEl.appendChild(wrapper);
    });
  }

function renderVideos(entries) {
  paragraphVideosEl.innerHTML = "";

  entries.forEach((entry, index) => {
    const videoData = resolveVideoEntry(entry, index);
    if (!videoData || !videoData.src) return;

    const wrapper = document.createElement("article");
    wrapper.className = "media-video-card";

    const video = document.createElement("video");
    video.className = "media-video";
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;

    const source = document.createElement("source");
    source.src = toSafeUrl(videoData.src);
    source.type = "video/webm";
    video.appendChild(source);

    if (videoData.poster) {
      video.poster = toSafeUrl(videoData.poster);
    }

    video.addEventListener("error", () => {
      wrapper.replaceWith(
        createMissingMediaCard(`Could not load video file: ${videoData.src}`)
      );
    });

    wrapper.appendChild(video);

    if (videoData.title || videoData.caption) {
      const meta = document.createElement("div");
      meta.className = "media-video-meta";

      if (videoData.title) {
        const title = document.createElement("div");
        title.className = "media-video-title";
        title.textContent = videoData.title;
        meta.appendChild(title);
      }

      if (videoData.caption) {
        const caption = document.createElement("div");
        caption.className = "media-video-caption";
        caption.textContent = videoData.caption;
        meta.appendChild(caption);
      }

      wrapper.appendChild(meta);
    }

    paragraphVideosEl.appendChild(wrapper);
    video.load();
  });
}

  function renderMedia() {
    const current = getCurrentParagraph();
    if (!current) {
      mediaSectionEl.hidden = true;
      return;
    }

    const figures = Array.isArray(current.figures) ? current.figures : [];
    const videos = Array.isArray(current.videos) ? current.videos : [];

    const figureCount = figures.length;
    const videoCount = videos.length;
    const totalCount = figureCount + videoCount;

    mediaSectionEl.hidden = totalCount === 0;
    figureGroupEl.hidden = figureCount === 0;
    videoGroupEl.hidden = videoCount === 0;

    if (totalCount === 0) {
      paragraphFiguresEl.innerHTML = "";
      paragraphVideosEl.innerHTML = "";
      mediaSummaryEl.textContent = "";
      return;
    }

    const summaryParts = [];
    if (figureCount > 0) summaryParts.push(`${figureCount} figure${figureCount === 1 ? "" : "s"}`);
    if (videoCount > 0) summaryParts.push(`${videoCount} clip${videoCount === 1 ? "" : "s"}`);
    mediaSummaryEl.textContent = summaryParts.join(" • ");

    renderFigures(figures);
    renderVideos(videos);
  }

  function renderTextAndMedia() {
    const current = getCurrentParagraph();
    const previous = getParagraph(state.currentIndex - 1);
    const next = getParagraph(state.currentIndex + 1);

    if (!current) {
      currentParagraphTextEl.textContent = "No paragraph found.";
      previousParagraphTextEl.textContent = "—";
      nextParagraphTextEl.textContent = "—";
      mediaSectionEl.hidden = true;
      return;
    }

    const sectionLabel = `${current.sectionNumber} — ${current.sectionTitle}`;
    const paragraphCode = getParagraphCode(current);
    const sectionParagraphCount = getSectionParagraphCount(current.sectionId);
    const candidates = resolveAudioCandidates(current);

    playerSectionLabelEl.textContent = sectionLabel;
    playerParagraphLabelEl.textContent = paragraphCode;

    const paragraphMeta = `Paragraph ${current.paragraphNumber} of ${sectionParagraphCount}`;

    playerTimeRangeEl.textContent =
      candidates.length > 0
        ? (current.duration && current.duration > 0
            ? `${paragraphMeta} • Duration: ${formatTime(current.duration)}`
            : `${paragraphMeta} • Audio ready`)
        : `${paragraphMeta} • No audio`;

    nowReadingTitleEl.textContent = sectionLabel;

    renderParagraphText(current);

    previousParagraphTextEl.textContent = previous ? collapseWhitespace(previous.text) : "—";
    nextParagraphTextEl.textContent = next ? collapseWhitespace(next.text) : "—";

    contextGridEl.style.display = state.oneParagraphMode ? "none" : "grid";

    renderMedia();
  }

  function renderMeta() {
    const current = getCurrentParagraph();
    if (!current) return;

    state.activeSectionId = current.sectionId;
    updateSectionHighlight();
    renderTextAndMedia();
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
    audio.src = toSafeUrl(state.currentAudioPath);
    audio.load();

    if (autoplay) {
      try {
        await audio.play();
      } catch (error) {
        console.warn("Autoplay was blocked or the source is not ready yet:", error);
      }
    }

    updatePlayPauseButton();
  }

  async function loadParagraph(index, autoplay = false) {
    if (index < 0 || index >= state.flatParagraphs.length) return;

    state.currentIndex = index;
    const paragraph = getCurrentParagraph();

    renderMeta();

    progressBar.value = "0";
    currentTimeLabel.textContent = "0:00";
    durationLabel.textContent = paragraph?.duration ? formatTime(paragraph.duration) : "0:00";

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
      } catch (error) {
        console.warn("Play failed:", error);
      }
    } else {
      audio.pause();
    }

    updatePlayPauseButton();
  }

  async function goToNextParagraph(autoplay = false) {
    if (state.currentIndex < state.flatParagraphs.length - 1) {
      await loadParagraph(state.currentIndex + 1, autoplay);
    }
  }

  async function goToPreviousParagraph(autoplay = false) {
    if (state.currentIndex > 0) {
      await loadParagraph(state.currentIndex - 1, autoplay);
    }
  }

  function findFirstPlayableIndex() {
    const index = state.flatParagraphs.findIndex((paragraph) => resolveAudioCandidates(paragraph).length > 0);
    return index >= 0 ? index : 0;
  }

  function applySavedTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    document.body.classList.toggle("dark", savedTheme !== "light");
  }

  function toggleTheme() {
    const willBeDark = !document.body.classList.contains("dark");
    document.body.classList.toggle("dark", willBeDark);
    localStorage.setItem(THEME_STORAGE_KEY, willBeDark ? "dark" : "light");
  }

  function isMobileLayout() {
    return window.matchMedia("(max-width: 980px)").matches;
  }

  function openSidebar() {
    if (!isMobileLayout()) return;
    sidebarEl.classList.add("open");
    sidebarBackdropEl.hidden = false;
  }

  function closeSidebar() {
    if (!isMobileLayout()) return;
    sidebarEl.classList.remove("open");
    sidebarBackdropEl.hidden = true;
  }

  function toggleSidebar() {
    if (isMobileLayout()) {
      if (sidebarEl.classList.contains("open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
      return;
    }

    document.body.classList.toggle("sidebar-collapsed");
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

    if (state.continuous && state.currentIndex < state.flatParagraphs.length - 1) {
      await goToNextParagraph(true);
    }
  });

  audio.addEventListener("error", async () => {
    const paragraph = getCurrentParagraph();
    if (!paragraph) return;

    const nextCandidateIndex = state.currentAudioCandidateIndex + 1;

    if (nextCandidateIndex < state.currentAudioCandidates.length) {
      console.warn(
        `Audio failed for ${state.currentAudioPath}. Trying fallback ${state.currentAudioCandidates[nextCandidateIndex]}.`
      );
      await loadAudioCandidate(nextCandidateIndex, state.autoplayRequested);
      return;
    }

    console.warn("All audio candidates failed for paragraph:", paragraph.id);
    clearAudioElement();
    updatePlayPauseButton();
  });

  progressBar.addEventListener("input", () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    if (duration <= 0) return;

    const ratio = Number(progressBar.value) / 100;
    audio.currentTime = duration * ratio;
  });

  prevBtn.addEventListener("click", () => goToPreviousParagraph(false));
  nextBtn.addEventListener("click", () => goToNextParagraph(false));
  playPauseBtn.addEventListener("click", togglePlayPause);

  continuousToggle.addEventListener("change", () => {
    state.continuous = continuousToggle.checked;
  });

  oneParagraphToggle.addEventListener("change", () => {
    state.oneParagraphMode = oneParagraphToggle.checked;
    renderTextAndMedia();
  });

  toggleSidebarBtn.addEventListener("click", toggleSidebar);
  sidebarBackdropEl.addEventListener("click", closeSidebar);
  themeToggleBtn.addEventListener("click", toggleTheme);

  document.addEventListener("keydown", async (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      await togglePlayPause();
    } else if (event.code === "ArrowRight") {
      event.preventDefault();
      await goToNextParagraph(false);
    } else if (event.code === "ArrowLeft") {
      event.preventDefault();
      await goToPreviousParagraph(false);
    } else if (event.code === "Escape") {
      closeSidebar();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobileLayout()) {
      closeSidebar();
    }
  });

  async function init() {
    try {
      applySavedTheme();

      const rawBookData = await loadBookData();
      indexBookData(rawBookData);

      if (state.flatParagraphs.length === 0) {
        throw new Error("The loaded book data has no paragraphs.");
      }

      bookTitleEl.textContent = state.book.title;
      buildSectionNav();

      state.continuous = continuousToggle.checked;
      state.oneParagraphMode = oneParagraphToggle.checked;

      const firstIndex = findFirstPlayableIndex();
      await loadParagraph(firstIndex, false);
    } catch (error) {
      console.error(error);
      setLoadError(error instanceof Error ? error.message : "Unknown loading error.");
    }
  }

  init();
})();
