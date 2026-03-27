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
  const visualsGroupEl = document.getElementById("visualsGroup");
  const equationsGroupEl = document.getElementById("equationsGroup");
  const paragraphVisualsEl = document.getElementById("paragraphVisuals");
  const paragraphEquationsEl = document.getElementById("paragraphEquations");

  const DEFAULT_AUDIO_DIRS = ["audio/paragraphs", "audio/paragraphs/s"];
  const DEFAULT_VISUALS_DIR = "figures";
  const DEFAULT_VIDEOS_DIR = "videos";
  const DEFAULT_VIDEO_EXTENSIONS = ["webm", "mp4"];
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

  function getDatasetValue(name) {
    const root = document.documentElement;
    const body = document.body;
    return body.dataset[name] || root.dataset[name] || "";
  }

  function getDataConfig() {
    return {
      jsUrl: getDatasetValue("bookJs"),
      jsonUrl: getDatasetValue("bookJson"),
      prefer: (getDatasetValue("bookDataPreference") || "js").toLowerCase(),
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

  function parseDatasetList(value) {
    const raw = String(value || "").trim();
    if (!raw) return [];

    return uniqueStrings(
      raw
        .split(/\r?\n|[|,]/)
        .map((item) => normalizePath(item))
        .filter(Boolean)
    );
  }

  function getMediaConfig() {
    const audioDirs = parseDatasetList(getDatasetValue("audioDirs"));
    const visualsDir = normalizePath(getDatasetValue("visualsDir") || getDatasetValue("figuresDir"));
    const videosDir = normalizePath(getDatasetValue("videosDir"));
    const videoExtensions = parseDatasetList(getDatasetValue("videoExtensions"));

    return {
      audioDirs: audioDirs.length > 0 ? audioDirs : [...DEFAULT_AUDIO_DIRS],
      visualsDir: visualsDir || DEFAULT_VISUALS_DIR,
      videosDir: videosDir || DEFAULT_VIDEOS_DIR,
      videoExtensions: videoExtensions.length > 0 ? videoExtensions : [...DEFAULT_VIDEO_EXTENSIONS],
    };
  }

  const MEDIA_CONFIG = getMediaConfig();

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

  function setLoadError(message) {
    bookTitleEl.textContent = "Loading failed";
    nowReadingTitleEl.textContent = "—";
    currentParagraphTextEl.innerHTML = `<p>${escapeHtml(message)}</p>`;
    previousParagraphTextEl.textContent = "—";
    nextParagraphTextEl.textContent = "—";
    mediaSectionEl.hidden = true;
    visualsGroupEl.hidden = true;
    equationsGroupEl.hidden = true;
    contextGridEl.style.display = "none";
  }

  function getGlobalBookData() {
    if (typeof BOOK_DATA !== "undefined" && BOOK_DATA && typeof BOOK_DATA === "object") {
      return BOOK_DATA;
    }

    if (window.BOOK_DATA && typeof window.BOOK_DATA === "object") {
      return window.BOOK_DATA;
    }

    return null;
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async function readBookDataFromJsFile(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch JS data: ${response.status} ${response.statusText}`);
    }

    const source = await response.text();

    const factory = new Function(
      `${source}\n;return (typeof BOOK_DATA !== "undefined" ? BOOK_DATA : (typeof window !== "undefined" && window.BOOK_DATA && typeof window.BOOK_DATA === "object" ? window.BOOK_DATA : null));`
    );

    const data = factory();

    if (!data || typeof data !== "object") {
      throw new Error(`The JS data file did not expose BOOK_DATA: ${url}`);
    }

    window.BOOK_DATA = data;
    return data;
  }

  async function loadBookData() {
    const globalData = getGlobalBookData();
    if (globalData) {
      return globalData;
    }

    const inlineJsonEl = document.getElementById("bookDataInline");
    if (inlineJsonEl && inlineJsonEl.textContent.trim()) {
      const data = JSON.parse(inlineJsonEl.textContent);
      window.BOOK_DATA = data;
      return data;
    }

    const config = getDataConfig();
    const modes = config.prefer === "json" ? ["json", "js"] : ["js", "json"];

    for (const mode of modes) {
      if (mode === "js" && config.jsUrl) {
        try {
          return await readBookDataFromJsFile(config.jsUrl);
        } catch (error) {
          console.warn(error);
        }
      }

      if (mode === "json" && config.jsonUrl) {
        try {
          const data = await fetchJson(config.jsonUrl);
          window.BOOK_DATA = data;
          return data;
        } catch (error) {
          console.warn(error);
        }
      }
    }

    throw new Error(
      "No book data could be loaded. Provide BOOK_DATA via JS or JSON, or set data-book-json / data-book-js on the HTML root or body."
    );
  }

  function normalizeParagraph(paragraph, section, paragraphIndex) {
    const visuals = Array.isArray(paragraph?.visuals)
      ? paragraph.visuals
      : Array.isArray(paragraph?.figures)
        ? paragraph.figures.map((item) => ({ ...(item || {}), kind: "figure" }))
        : [];

    const equations = Array.isArray(paragraph?.equations) ? paragraph.equations : [];
    const videos = Array.isArray(paragraph?.videos) ? paragraph.videos : [];

    return {
      ...paragraph,
      id: String(paragraph?.id || `${section?.number || section?.id || "00.00"}-p${String(paragraphIndex + 1).padStart(3, "0")}`),
      text: String(paragraph?.text || ""),
      visuals,
      equations,
      videos,
      sectionId: String(section?.id || ""),
      sectionNumber: String(section?.number || section?.id || ""),
      sectionTitle: String(section?.title || ""),
      paragraphNumber: paragraphIndex + 1,
    };
  }

  function indexBookData(book) {
    const rawSections = Array.isArray(book?.sections) ? book.sections : [];

    state.book = {
      title: String(book?.title || "Untitled Book"),
      language: String(book?.language || "en"),
      sections: rawSections.map((section, index) => ({
        ...section,
        id: String(section?.id || section?.number || `section-${index + 1}`),
        number: String(section?.number || section?.id || `Section ${index + 1}`),
        title: String(section?.title || ""),
        paragraphs: Array.isArray(section?.paragraphs) ? section.paragraphs : [],
      })),
    };

    state.flatParagraphs = [];
    state.sectionStartIndexById = new Map();

    state.book.sections.forEach((section) => {
      const startIndex = state.flatParagraphs.length;
      state.sectionStartIndexById.set(section.id, startIndex);

      section.paragraphs.forEach((paragraph, pIndex) => {
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
          return MEDIA_CONFIG.audioDirs.map((dir) => joinPath(dir, `${cleaned}.mp3`));
        }

        if (typeof entry === "object") {
          const explicitPath = normalizePath(
            entry.src || entry.path || entry.file || entry.filename || entry.audio || ""
          );

          if (!explicitPath) return [];
          if (explicitPath.includes("/") || hasExtension(explicitPath) || isAbsoluteLike(explicitPath)) {
            return [explicitPath];
          }
          return MEDIA_CONFIG.audioDirs.map((dir) => joinPath(dir, `${explicitPath}.mp3`));
        }

        return [];
      });

    if (explicitEntries.length > 0) {
      return uniqueStrings(explicitEntries);
    }

    if (!paragraph.id || paragraph.id.startsWith("00.00")) {
      return [];
    }

    return MEDIA_CONFIG.audioDirs.map((dir) => joinPath(dir, `${paragraph.id}.mp3`));
  }

  function inferVisualSource(label) {
    const cleanLabel = String(label || "").trim();
    if (!cleanLabel) return "";
    return joinPath(MEDIA_CONFIG.visualsDir, `${cleanLabel}.png`);
  }

  function resolveVisualEntry(rawEntry, index) {
    if (!rawEntry) return null;

    if (typeof rawEntry === "string") {
      const cleaned = normalizePath(rawEntry);
      const src = cleaned.includes("/") || hasExtension(cleaned) || isAbsoluteLike(cleaned)
        ? cleaned
        : joinPath(MEDIA_CONFIG.visualsDir, `${cleaned}.png`);

      return {
        id: `visual-${index + 1}`,
        kind: "figure",
        src,
        label: `Figure ${index + 1}`,
        caption: "",
        alt: `Figure ${index + 1}`,
      };
    }

    if (typeof rawEntry === "object") {
      const label = String(rawEntry.label || rawEntry.title || rawEntry.name || "").trim();
      const caption = String(rawEntry.caption || rawEntry.description || "").trim();
      const kind = String(rawEntry.kind || rawEntry.type || "figure").trim().toLowerCase() || "figure";
      const alt = String(rawEntry.alt || label || `${kind} ${index + 1}`).trim();

      const explicitPath = normalizePath(
        rawEntry.src || rawEntry.path || rawEntry.file || rawEntry.filename || rawEntry.image || ""
      );

      const src = explicitPath
        ? (explicitPath.includes("/") || isAbsoluteLike(explicitPath)
            ? explicitPath
            : joinPath(MEDIA_CONFIG.visualsDir, explicitPath))
        : inferVisualSource(label);

      return {
        id: String(rawEntry.id || `${kind}-${index + 1}`).trim(),
        kind: kind || "figure",
        src,
        label,
        caption,
        alt,
      };
    }

    return null;
  }

  function resolveNamedMediaSources(rawValue, baseDir, defaultExtensions) {
    const cleaned = normalizePath(rawValue);
    if (!cleaned) return [];

    if (cleaned.includes("/") || hasExtension(cleaned) || isAbsoluteLike(cleaned)) {
      return [cleaned];
    }

    return defaultExtensions.map((ext) => joinPath(baseDir, `${cleaned}.${ext}`));
  }

  function resolveVideoEntry(rawEntry, index) {
    if (!rawEntry) return null;

    if (typeof rawEntry === "string") {
      return {
        sources: resolveNamedMediaSources(rawEntry, MEDIA_CONFIG.videosDir, MEDIA_CONFIG.videoExtensions),
        label: `Clip ${index + 1}`,
        caption: "",
      };
    }

    if (typeof rawEntry === "object") {
      const label = String(rawEntry.label || rawEntry.title || rawEntry.name || `Clip ${index + 1}`).trim();
      const caption = String(rawEntry.caption || rawEntry.description || "").trim();

      const explicitPath = rawEntry.src || rawEntry.path || rawEntry.file || rawEntry.filename || rawEntry.video || "";
      const sources = explicitPath
        ? resolveNamedMediaSources(explicitPath, MEDIA_CONFIG.videosDir, MEDIA_CONFIG.videoExtensions)
        : resolveNamedMediaSources(label, MEDIA_CONFIG.videosDir, MEDIA_CONFIG.videoExtensions);

      return {
        sources,
        label,
        caption,
      };
    }

    return null;
  }

  function resolveEquationEntry(rawEntry, index) {
    if (!rawEntry || typeof rawEntry !== "object") return null;

    const latex = String(rawEntry.latex || "").trim();
    if (!latex) return null;

    return {
      id: String(rawEntry.id || `eq-${index + 1}`).trim(),
      label: String(rawEntry.label || `Equation ${index + 1}`).trim(),
      latex,
      spoken: String(rawEntry.spoken || "").trim(),
      note: String(rawEntry.note || "").trim(),
    };
  }

  function buildSectionNav() {
    sectionsNavEl.innerHTML = "";

    state.book.sections.forEach((section) => {
      const sectionStartIndex = state.sectionStartIndexById.get(section.id);
      if (typeof sectionStartIndex !== "number") return;

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
        await loadParagraph(sectionStartIndex, false);
        closeSidebar();
      });

      sectionBlock.appendChild(sectionBtn);
      sectionsNavEl.appendChild(sectionBlock);
    });
  }

  function updateSectionHighlight() {
    document.querySelectorAll(".section-block").forEach((block) => {
      block.classList.toggle("active", block.dataset.sectionId === state.activeSectionId);
    });

    document.querySelectorAll(".section-link").forEach((el) => {
      el.classList.toggle("active", el.dataset.sectionId === state.activeSectionId);
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

  function appendMediaCaption(figureEl, entry) {
    const label = String(entry?.label || "").trim();
    const caption = String(entry?.caption || "").trim();
    if (!label && !caption) return;

    const figcaption = document.createElement("figcaption");
    figcaption.className = "media-caption";

    if (label) {
      const labelWrap = document.createElement("span");
      labelWrap.className = "media-label-row";

      const labelSpan = document.createElement("span");
      labelSpan.className = "media-caption-label";
      labelSpan.textContent = label;
      labelWrap.appendChild(labelSpan);

      const kind = String(entry?.kind || "").trim();
      if (kind) {
        const kindBadge = document.createElement("span");
        kindBadge.className = `media-kind-badge kind-${kind}`;
        kindBadge.textContent = kind;
        labelWrap.appendChild(kindBadge);
      }

      figcaption.appendChild(labelWrap);
    }

    if (caption) {
      const body = document.createElement("span");
      body.className = "media-caption-body";
      body.textContent = caption;
      figcaption.appendChild(body);
    }

    figureEl.appendChild(figcaption);
  }

  function renderVisuals(entries) {
    entries.forEach((entry, index) => {
      const visualData = resolveVisualEntry(entry, index);
      if (!visualData || !visualData.src) return;

      const wrapper = document.createElement("article");
      wrapper.className = "media-figure-card";
      wrapper.dataset.kind = visualData.kind || "figure";

      const figure = document.createElement("figure");
      figure.className = "media-figure";

      const img = document.createElement("img");
      img.className = "media-figure-image";
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = visualData.alt || visualData.label || `Visual ${index + 1}`;
      img.src = toSafeUrl(visualData.src);

      img.addEventListener("error", () => {
        wrapper.replaceWith(createMissingMediaCard(`Could not load visual file: ${visualData.src}`));
      });

      figure.appendChild(img);
      appendMediaCaption(figure, visualData);

      wrapper.appendChild(figure);
      paragraphVisualsEl.appendChild(wrapper);
    });
  }

  function renderVideos(entries) {
    entries.forEach((entry, index) => {
      const videoData = resolveVideoEntry(entry, index);
      if (!videoData || videoData.sources.length === 0) return;

      const wrapper = document.createElement("article");
      wrapper.className = "media-figure-card";

      const figure = document.createElement("figure");
      figure.className = "media-figure";

      const video = document.createElement("video");
      video.className = "media-video";
      video.controls = true;
      video.preload = "metadata";
      video.playsInline = true;

      videoData.sources.forEach((src) => {
        const source = document.createElement("source");
        source.src = toSafeUrl(src);
        video.appendChild(source);
      });

      video.appendChild(document.createTextNode("Your browser does not support embedded video playback."));

      video.addEventListener("error", () => {
        wrapper.replaceWith(createMissingMediaCard(`Could not load video file: ${videoData.sources[0]}`));
      });

      figure.appendChild(video);
      appendMediaCaption(figure, { label: videoData.label, caption: videoData.caption, kind: "clip" });

      wrapper.appendChild(figure);
      paragraphVisualsEl.appendChild(wrapper);
    });
  }

  function formatInlineMath(label) {
    return `\\[${label}\\]`;
  }

  async function typesetMath(container) {
    if (!container) return;

    if (window.MathJax?.typesetPromise) {
      try {
        await window.MathJax.typesetPromise([container]);
      } catch (error) {
        console.warn("MathJax typeset failed:", error);
      }
    }
  }

  async function renderEquations(entries) {
    const cards = [];

    entries.forEach((entry, index) => {
      const equationData = resolveEquationEntry(entry, index);
      if (!equationData) return;

      const wrapper = document.createElement("article");
      wrapper.className = "equation-card";
      wrapper.dataset.equationId = equationData.id;

      const header = document.createElement("div");
      header.className = "equation-card-header";

      const labelPill = document.createElement("span");
      labelPill.className = "equation-label-pill";
      labelPill.textContent = equationData.label || `Equation ${index + 1}`;
      header.appendChild(labelPill);

      wrapper.appendChild(header);

      const formula = document.createElement("div");
      formula.className = "equation-formula";
      formula.textContent = formatInlineMath(equationData.latex);
      wrapper.appendChild(formula);

      if (equationData.spoken) {
        const gloss = document.createElement("p");
        gloss.className = "equation-gloss";
        gloss.textContent = equationData.spoken;
        wrapper.appendChild(gloss);
      }

      if (equationData.note) {
        const note = document.createElement("p");
        note.className = "equation-note";
        note.textContent = equationData.note;
        wrapper.appendChild(note);
      }

      paragraphEquationsEl.appendChild(wrapper);
      cards.push(wrapper);
    });

    if (cards.length > 0) {
      await typesetMath(paragraphEquationsEl);
    }
  }

  function formatMediaSummary(visualCount, equationCount) {
    const parts = [];

    if (visualCount > 0) {
      parts.push(`${visualCount} visual${visualCount === 1 ? "" : "s"}`);
    }

    if (equationCount > 0) {
      parts.push(`${equationCount} equation${equationCount === 1 ? "" : "s"}`);
    }

    return parts.join(" • ");
  }

  async function renderMedia() {
    const current = getCurrentParagraph();

    paragraphVisualsEl.innerHTML = "";
    paragraphEquationsEl.innerHTML = "";
    mediaSummaryEl.textContent = "";

    if (!current) {
      mediaSectionEl.hidden = true;
      visualsGroupEl.hidden = true;
      equationsGroupEl.hidden = true;
      return;
    }

    const rawVisuals = Array.isArray(current.visuals) ? current.visuals : [];
    const rawEquations = Array.isArray(current.equations) ? current.equations : [];
    const rawVideos = Array.isArray(current.videos) ? current.videos : [];

    const validVisuals = rawVisuals
      .map((entry, index) => resolveVisualEntry(entry, index))
      .filter((item) => item && item.src);

    const validEquations = rawEquations
      .map((entry, index) => resolveEquationEntry(entry, index))
      .filter(Boolean);

    const validVideos = rawVideos
      .map((entry, index) => resolveVideoEntry(entry, index))
      .filter((item) => item && Array.isArray(item.sources) && item.sources.length > 0);

    const visualCount = validVisuals.length + validVideos.length;
    const equationCount = validEquations.length;
    const totalCount = visualCount + equationCount;

    if (totalCount === 0) {
      mediaSectionEl.hidden = true;
      visualsGroupEl.hidden = true;
      equationsGroupEl.hidden = true;
      return;
    }

    mediaSectionEl.hidden = false;
    mediaSummaryEl.textContent = formatMediaSummary(visualCount, equationCount);

    visualsGroupEl.hidden = visualCount === 0;
    equationsGroupEl.hidden = equationCount === 0;

    if (visualCount > 0) {
      renderVisuals(rawVisuals);
      renderVideos(rawVideos);
    }

    if (equationCount > 0) {
      await renderEquations(rawEquations);
    }
  }

  async function renderTextAndMedia() {
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
    const sectionParagraphCount = getSectionParagraphCount(current.sectionId);
    const candidates = resolveAudioCandidates(current);

    playerSectionLabelEl.textContent = sectionLabel;
    playerParagraphLabelEl.textContent = `Paragraph ${current.paragraphNumber}`;

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

    await renderMedia();
  }

  async function renderMeta() {
    const current = getCurrentParagraph();
    if (!current) return;

    state.activeSectionId = current.sectionId;
    updateSectionHighlight();
    await renderTextAndMedia();
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

    await renderMeta();

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
    const hasAudio = current && state.currentAudioCandidates.length > 0;
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

  function applyTheme(theme, persist = false) {
    const useDark = theme !== "light";
    document.body.classList.toggle("dark", useDark);
    document.documentElement.style.colorScheme = useDark ? "dark" : "light";

    if (persist) {
      localStorage.setItem(THEME_STORAGE_KEY, useDark ? "dark" : "light");
    }
  }

  function applySavedTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    applyTheme(savedTheme === "light" ? "light" : "dark", false);
  }

  function toggleTheme() {
    const willBeDark = !document.body.classList.contains("dark");
    applyTheme(willBeDark ? "dark" : "light", true);
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

  oneParagraphToggle.addEventListener("change", async () => {
    state.oneParagraphMode = oneParagraphToggle.checked;
    await renderTextAndMedia();
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
      document.title = state.book.title;
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
