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

  const playerCardEl = playerSectionLabelEl?.closest(".player-card") || null;
  const playerMetaEl = playerSectionLabelEl?.closest(".player-meta") || null;
  const playerControlsRowEl = prevBtn?.closest(".player-controls-row") || null;
  const toggleRowEl = continuousToggle?.closest(".toggle-row") || null;
  const progressWrapEl = progressBar?.closest(".progress-wrap") || null;

  const currentParagraphTextEl = document.getElementById("currentParagraphText");
  const previousParagraphTextEl = document.getElementById("previousParagraphText");
  const nextParagraphTextEl = document.getElementById("nextParagraphText");
  const contextGridEl = document.getElementById("contextGrid");

  const mediaSectionEl = document.getElementById("mediaSection");
  const mediaSummaryEl = document.getElementById("mediaSummary");
  const figureGroupEl = document.getElementById("figureGroup");
  const paragraphFiguresEl = document.getElementById("paragraphFigures");

  const currentCardEl = currentParagraphTextEl?.closest(".current-card") || null;

  let rewindBtn = null;
  let playerAudioRowEl = null;
  let timelineSectionEl = null;
  let timelineSummaryEl = null;
  let timelineRailEl = null;
  let timelineGridEl = null;
  let timelineSpansEl = null;
  let timelineSpanLabelsEl = null;
  let timelinePointsEl = null;
  let timelinePointLabelsEl = null;
  let timelineFallbackEl = null;

  const DEFAULT_AUDIO_DIRS = ["audio/paragraphs", "audio/paragraphs/s"];
  const DEFAULT_FIGURES_DIR = "figures";
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

  function getDatasetValue(name) {
    const root = document.documentElement;
    const body = document.body;
    return body.dataset[name] || root.dataset[name] || "";
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
    const figuresDir = normalizePath(getDatasetValue("figuresDir"));
    const videosDir = normalizePath(getDatasetValue("videosDir"));
    const videoExtensions = parseDatasetList(getDatasetValue("videoExtensions"));

    return {
      audioDirs: audioDirs.length > 0 ? audioDirs : [...DEFAULT_AUDIO_DIRS],
      figuresDir: figuresDir || DEFAULT_FIGURES_DIR,
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
    figureGroupEl.hidden = true;
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
    const figures = Array.isArray(paragraph?.figures) ? paragraph.figures : [];
    const videos = Array.isArray(paragraph?.videos) ? paragraph.videos : [];
    const timeline = normalizeMediaList(
      paragraph?.timeline || paragraph?.chronology || paragraph?.temporal || paragraph?.timelineItems
    );

    return {
      ...paragraph,
      id: String(paragraph?.id || `${section?.number || section?.id || "00.00"}-p${String(paragraphIndex + 1).padStart(3, "0")}`),
      text: String(paragraph?.text || ""),
      figures,
      videos,
      timeline,
      sectionId: String(section?.id || ""),
      sectionNumber: String(section?.number || section?.id || ""),
      sectionTitle: String(section?.title || ""),
      paragraphNumber: paragraphIndex + 1,
    };
  }

  function normalizeMediaList(value) {
    return Array.isArray(value) ? value.filter(Boolean) : [];
  }

  function coerceYear(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value !== "string") {
      return null;
    }

    const raw = value.trim();
    if (!raw) return null;

    const numeric = Number(raw.replace(/,/g, ""));
    if (Number.isFinite(numeric)) {
      return numeric;
    }

    const bcMatch = raw.match(/^(c\.?\s*)?(\d+(?:\.\d+)?)\s*(BC|BCE)$/i);
    if (bcMatch) {
      return -Number(bcMatch[2]);
    }

    const adMatch = raw.match(/^(c\.?\s*)?(\d+(?:\.\d+)?)\s*(AD|CE)$/i);
    if (adMatch) {
      return Number(adMatch[2]);
    }

    return null;
  }

  function normalizeCertainty(value) {
    const raw = String(value || "").trim().toLowerCase();
    if (["secure", "exact", "firm"].includes(raw)) return "secure";
    if (["approximate", "approx", "estimated", "circa", "c."].includes(raw)) return "approximate";
    if (["disputed", "debated", "uncertain", "questioned"].includes(raw)) return "disputed";
    if (["traditional", "legendary", "received"].includes(raw)) return "traditional";
    return raw || "approximate";
  }

  function formatTimelineBoundary(year) {
    if (!Number.isFinite(year)) return "";
    const rounded = Math.round(year);
    const abs = Math.abs(rounded);
    if (rounded < 0) return `${abs} BC`;
    if (rounded === 0) return "0";
    return `${abs} AD`;
  }

  function formatTimelineDisplayDate(entry) {
    if (entry.displayDate) return entry.displayDate;

    if (entry.type === "span") {
      if (Number.isFinite(entry.start) && Number.isFinite(entry.end)) {
        return `${formatTimelineBoundary(entry.start)} – ${formatTimelineBoundary(entry.end)}`;
      }
      if (Number.isFinite(entry.start)) {
        return formatTimelineBoundary(entry.start);
      }
    }

    if (Number.isFinite(entry.date)) {
      return formatTimelineBoundary(entry.date);
    }

    return "";
  }

  function formatTimelineTick(year) {
    return formatTimelineBoundary(year);
  }

  function niceTimelineUnit(spread) {
    const safeSpread = Number.isFinite(spread) && spread > 0 ? spread : 1;
    const candidates = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
    const target = Math.max(10, safeSpread / 8);
    return candidates.find((value) => value >= target) || candidates[candidates.length - 1];
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function pctFromYear(year, windowStart, windowEnd) {
    if (!Number.isFinite(year) || !Number.isFinite(windowStart) || !Number.isFinite(windowEnd) || windowEnd === windowStart) {
      return 0;
    }

    return clamp(((year - windowStart) / (windowEnd - windowStart)) * 100, 0, 100);
  }

  function buildTimelineWindow(entries) {
    const numericEntries = entries.filter((entry) =>
      entry.type === "span"
        ? Number.isFinite(entry.start) || Number.isFinite(entry.end)
        : Number.isFinite(entry.date)
    );

    if (numericEntries.length === 0) {
      return null;
    }

    const values = numericEntries.flatMap((entry) => {
      if (entry.type === "span") {
        return [entry.start, entry.end].filter(Number.isFinite);
      }
      return [entry.date].filter(Number.isFinite);
    });

    if (values.length === 0) {
      return null;
    }

    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const spread = Math.max(1, rawMax - rawMin);
    const unit = niceTimelineUnit(spread);
    const windowSize = unit * 10;

    let start = Math.floor((rawMin - unit) / unit) * unit;
    let end = start + windowSize;

    const maxWanted = rawMax + unit;
    if (end < maxWanted) {
      start = Math.ceil((maxWanted - windowSize) / unit) * unit;
      end = start + windowSize;
    }

    const ticks = Array.from({ length: 11 }, (_, index) => start + index * unit);

    return {
      unit,
      start,
      end,
      ticks,
      numericEntries,
    };
  }

  function assignIntervalLanes(items, gapPct = 2) {
    const laneEnds = [];

    items
      .sort((a, b) => {
        if (a.sortLeft !== b.sortLeft) return a.sortLeft - b.sortLeft;
        return a.sortRight - b.sortRight;
      })
      .forEach((item) => {
        let laneIndex = 0;
        while (laneIndex < laneEnds.length && item.sortLeft <= laneEnds[laneIndex] + gapPct) {
          laneIndex += 1;
        }

        if (laneIndex === laneEnds.length) {
          laneEnds.push(item.sortRight);
        } else {
          laneEnds[laneIndex] = item.sortRight;
        }

        item.lane = laneIndex;
      });

    return laneEnds.length;
  }

  function normalizeTimelineEntry(entry, index) {
    if (!entry) return null;

    if (typeof entry === "string") {
      return {
        id: `timeline-${index}`,
        type: "point",
        label: entry.trim(),
        displayDate: "",
        caption: "",
        certainty: "approximate",
        start: null,
        end: null,
        date: null,
      };
    }

    if (typeof entry !== "object") {
      return null;
    }

    const label = String(
      entry.label || entry.title || entry.name || entry.event || entry.period || entry.site || entry.landmark || ""
    ).trim();

    if (!label) return null;

    const explicitType = String(entry.type || entry.kind || entry.mode || "").trim().toLowerCase();
    const start = coerceYear(entry.start ?? entry.from ?? entry.startYear ?? entry.start_year ?? entry.yearStart);
    const end = coerceYear(entry.end ?? entry.to ?? entry.endYear ?? entry.end_year ?? entry.yearEnd);
    const date = coerceYear(entry.date ?? entry.year ?? entry.at ?? entry.point ?? entry.whenYear);

    const inferredType = explicitType === "span" || explicitType === "band" || explicitType === "period"
      ? "span"
      : explicitType === "point" || explicitType === "pin" || explicitType === "event" || explicitType === "landmark"
        ? "point"
        : (Number.isFinite(end) || (Number.isFinite(start) && entry.end !== undefined))
          ? "span"
          : "point";

    const normalized = {
      id: String(entry.id || `${inferredType}-${index}`),
      type: inferredType,
      label,
      displayDate: String(
        entry.displayDate || entry.display_date || entry.dateLabel || entry.date_label || entry.when || entry.range || ""
      ).trim(),
      caption: String(entry.caption || entry.description || entry.note || "").trim(),
      certainty: normalizeCertainty(entry.certainty || entry.status),
      start: inferredType === "span" ? start : null,
      end: inferredType === "span" ? (Number.isFinite(end) ? end : start) : null,
      date: inferredType === "point" ? (Number.isFinite(date) ? date : start) : null,
    };

    normalized.displayDate = formatTimelineDisplayDate(normalized);
    normalized.sortStart = normalized.type === "span"
      ? (Number.isFinite(normalized.start) ? normalized.start : Number.POSITIVE_INFINITY)
      : (Number.isFinite(normalized.date) ? normalized.date : Number.POSITIVE_INFINITY);
    normalized.sortEnd = normalized.type === "span"
      ? (Number.isFinite(normalized.end) ? normalized.end : normalized.sortStart)
      : normalized.sortStart;

    return normalized;
  }

  function sortTimelineEntries(entries) {
    return [...entries].sort((a, b) => {
      if (a.sortStart !== b.sortStart) return a.sortStart - b.sortStart;
      if (a.type !== b.type) return a.type === "span" ? -1 : 1;
      return a.label.localeCompare(b.label);
    });
  }

  function indexBookData(book) {
    const rawSections = Array.isArray(book?.sections) ? book.sections : [];

    state.book = {
      title: String(book?.title || "Untitled Book"),
      language: String(book?.language || "en"),
      sharedFigures: normalizeMediaList(book?.sharedFigures),
      sharedVideos: normalizeMediaList(book?.sharedVideos),
      sharedTimeline: normalizeMediaList(book?.sharedTimeline || book?.timeline),
      sections: rawSections.map((section, index) => ({
        ...section,
        id: String(section?.id || section?.number || `section-${index + 1}`),
        number: String(section?.number || section?.id || `Section ${index + 1}`),
        title: String(section?.title || ""),
        sharedFigures: normalizeMediaList(section?.sharedFigures),
        sharedVideos: normalizeMediaList(section?.sharedVideos),
        sharedTimeline: normalizeMediaList(section?.sharedTimeline || section?.timeline),
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

  function resolveFigureEntry(rawEntry, index) {
    if (!rawEntry) return null;

    if (typeof rawEntry === "string") {
      const cleaned = normalizePath(rawEntry);
      const src = cleaned.includes("/") || hasExtension(cleaned) || isAbsoluteLike(cleaned)
        ? cleaned
        : joinPath(MEDIA_CONFIG.figuresDir, hasExtension(cleaned) ? cleaned : `${cleaned}.png`);

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
          : joinPath(MEDIA_CONFIG.figuresDir, explicitPath);
      } else if (label) {
        src = joinPath(MEDIA_CONFIG.figuresDir, `${label}.png`);
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

  function dedupeResolvedFigures(entries) {
    const seen = new Set();

    return entries.filter((item) => {
      if (!item || !item.src) return false;
      const key = `${item.src}::${item.label || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function dedupeResolvedVideos(entries) {
    const seen = new Set();

    return entries.filter((item) => {
      if (!item || !Array.isArray(item.sources) || item.sources.length === 0) return false;
      const key = `${item.sources.join("|")}::${item.label || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function getEffectiveFigureEntries(paragraph) {
    const section = getSectionById(paragraph?.sectionId);
    const rawEntries = [
      ...normalizeMediaList(state.book?.sharedFigures),
      ...normalizeMediaList(section?.sharedFigures),
      ...normalizeMediaList(paragraph?.figures),
    ];

    return dedupeResolvedFigures(
      rawEntries
        .map((entry, index) => resolveFigureEntry(entry, index))
        .filter((item) => item && item.src)
    );
  }

  function getEffectiveVideoEntries(paragraph) {
    const section = getSectionById(paragraph?.sectionId);
    const rawEntries = [
      ...normalizeMediaList(state.book?.sharedVideos),
      ...normalizeMediaList(section?.sharedVideos),
      ...normalizeMediaList(paragraph?.videos),
    ];

    return dedupeResolvedVideos(
      rawEntries
        .map((entry, index) => resolveVideoEntry(entry, index))
        .filter((item) => item && Array.isArray(item.sources) && item.sources.length > 0)
    );
  }

  function dedupeTimelineEntries(entries) {
    const seen = new Set();

    return entries.filter((item) => {
      if (!item || !item.label) return false;
      const key = [item.type, item.label, item.displayDate, item.start, item.end, item.date].join("::");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function getEffectiveTimelineEntries(paragraph) {
    const section = getSectionById(paragraph?.sectionId);
    const rawEntries = [
      ...normalizeMediaList(state.book?.sharedTimeline),
      ...normalizeMediaList(section?.sharedTimeline),
      ...normalizeMediaList(paragraph?.timeline),
    ];

    return sortTimelineEntries(
      dedupeTimelineEntries(
        rawEntries
          .map((entry, index) => normalizeTimelineEntry(entry, index))
          .filter(Boolean)
      )
    );
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

  function appendMediaCaption(figureEl, label, caption) {
    if (!label && !caption) return;

    const figcaption = document.createElement("figcaption");
    figcaption.className = "media-caption";

    if (label) {
      const labelSpan = document.createElement("span");
      labelSpan.className = "media-caption-label";
      labelSpan.textContent = label;
      figcaption.appendChild(labelSpan);

      if (caption) {
        figcaption.appendChild(document.createTextNode(". "));
      }
    }

    if (caption) {
      figcaption.appendChild(document.createTextNode(caption));
    }

    figureEl.appendChild(figcaption);
  }

  function renderFigures(entries) {
    entries.forEach((figureData, index) => {
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
        wrapper.replaceWith(createMissingMediaCard(`Could not load figure file: ${figureData.src}`));
      });

      figure.appendChild(img);
      appendMediaCaption(figure, figureData.label, figureData.caption);

      wrapper.appendChild(figure);
      paragraphFiguresEl.appendChild(wrapper);
    });
  }

  function renderVideos(entries) {
    entries.forEach((videoData, index) => {
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
      appendMediaCaption(figure, videoData.label, videoData.caption);

      wrapper.appendChild(figure);
      paragraphFiguresEl.appendChild(wrapper);
    });
  }

  function formatMediaSummary(figureCount, videoCount) {
    const parts = [];

    if (figureCount > 0) {
      parts.push(`${figureCount} figure${figureCount === 1 ? "" : "s"}`);
    }

    if (videoCount > 0) {
      parts.push(`${videoCount} clip${videoCount === 1 ? "" : "s"}`);
    }

    return parts.join(" • ");
  }

  function renderMedia() {
    const current = getCurrentParagraph();

    paragraphFiguresEl.innerHTML = "";
    mediaSummaryEl.textContent = "";

    if (!current) {
      mediaSectionEl.hidden = true;
      figureGroupEl.hidden = true;
      return;
    }

    const effectiveFigures = getEffectiveFigureEntries(current);
    const effectiveVideos = getEffectiveVideoEntries(current);

    const figureCount = effectiveFigures.length;
    const videoCount = effectiveVideos.length;
    const totalCount = figureCount + videoCount;

    if (totalCount === 0) {
      mediaSectionEl.hidden = true;
      figureGroupEl.hidden = true;
      return;
    }

    mediaSectionEl.hidden = false;
    figureGroupEl.hidden = false;
    mediaSummaryEl.textContent = formatMediaSummary(figureCount, videoCount);

    renderFigures(effectiveFigures);
    renderVideos(effectiveVideos);
  }

  function formatTimelineSummary(entries, unit = null) {
    const spanCount = entries.filter((entry) => entry.type === "span").length;
    const pointCount = entries.filter((entry) => entry.type === "point").length;
    const parts = [];

    if (spanCount > 0) {
      parts.push(`${spanCount} span${spanCount === 1 ? "" : "s"}`);
    }

    if (pointCount > 0) {
      parts.push(`${pointCount} pin${pointCount === 1 ? "" : "s"}`);
    }

    if (Number.isFinite(unit) && unit > 0) {
      parts.push(`${unit}-year units`);
    }

    return parts.join(" • ");
  }

  function clearTimelineRail() {
    if (timelineGridEl) timelineGridEl.innerHTML = "";
    if (timelineSpansEl) timelineSpansEl.innerHTML = "";
    if (timelineSpanLabelsEl) timelineSpanLabelsEl.innerHTML = "";
    if (timelinePointsEl) timelinePointsEl.innerHTML = "";
    if (timelinePointLabelsEl) timelinePointLabelsEl.innerHTML = "";
    if (timelineFallbackEl) {
      timelineFallbackEl.hidden = true;
      timelineFallbackEl.innerHTML = "";
    }
  }

  function makeTimelineTooltip(entry) {
    const parts = [entry.label];
    if (entry.displayDate) {
      parts.push(entry.displayDate);
    }
    if (entry.caption) {
      parts.push(entry.caption);
    }
    return parts.filter(Boolean).join(" — ");
  }

  function renderTimelineRail(entries) {
    const windowData = buildTimelineWindow(entries);

    if (!windowData || !timelineRailEl || !timelineGridEl || !timelineSpansEl || !timelineSpanLabelsEl || !timelinePointsEl || !timelinePointLabelsEl) {
      clearTimelineRail();
      if (timelineRailEl) {
        timelineRailEl.hidden = true;
      }
      if (timelineFallbackEl) {
        timelineFallbackEl.hidden = false;
        timelineFallbackEl.textContent = "Timeline data is missing usable dates.";
      }
      return null;
    }

    clearTimelineRail();
    timelineRailEl.hidden = false;

    const { start, end, unit, ticks } = windowData;

    ticks.forEach((tickYear, index) => {
      const tick = document.createElement("div");
      tick.className = "timeline-tick";
      tick.style.left = `${pctFromYear(tickYear, start, end)}%`;
      if (index % 3 === 0) {
        tick.classList.add("timeline-tick--labeled");

        const label = document.createElement("div");
        label.className = "timeline-tick-label";
        label.textContent = formatTimelineTick(tickYear);
        tick.appendChild(label);
      }
      timelineGridEl.appendChild(tick);
    });

    const spanEntries = entries
      .filter((entry) => entry.type === "span" && (Number.isFinite(entry.start) || Number.isFinite(entry.end)))
      .map((entry) => {
        const startYear = Number.isFinite(entry.start) ? entry.start : entry.end;
        const endYear = Number.isFinite(entry.end) ? entry.end : entry.start;
        const left = pctFromYear(Math.min(startYear, endYear), start, end);
        const right = pctFromYear(Math.max(startYear, endYear), start, end);
        return {
          ...entry,
          left,
          right,
          sortLeft: Math.min(left, right),
          sortRight: Math.max(left, right),
        };
      });

    assignIntervalLanes(spanEntries, 3.5);

    spanEntries.forEach((entry) => {
      const width = Math.max(4, entry.sortRight - entry.sortLeft);
      const rowTop = 119 + entry.lane * 38;

      const band = document.createElement("div");
      band.className = "timeline-span";
      band.dataset.certainty = entry.certainty;
      band.style.left = `${entry.sortLeft}%`;
      band.style.width = `${width}%`;
      band.style.top = `${rowTop}px`;
      band.title = makeTimelineTooltip(entry);
      timelineSpansEl.appendChild(band);

      const label = document.createElement("div");
      label.className = "timeline-span-label";
      label.dataset.certainty = entry.certainty;
      label.style.left = `${entry.sortLeft + width / 2}%`;
      label.style.top = `${rowTop + 16}px`;
      label.textContent = entry.label;
      label.title = makeTimelineTooltip(entry);
      timelineSpanLabelsEl.appendChild(label);
    });

    const pointEntries = entries
      .filter((entry) => entry.type === "point" && Number.isFinite(entry.date))
      .map((entry) => {
        const x = pctFromYear(entry.date, start, end);
        return {
          ...entry,
          x,
          sortLeft: x - 7,
          sortRight: x + 7,
        };
      });

    assignIntervalLanes(pointEntries, 2.5);

    pointEntries.forEach((entry) => {
      const point = document.createElement("div");
      point.className = "timeline-point";
      point.dataset.certainty = entry.certainty;
      point.style.left = `${entry.x}%`;
      point.title = makeTimelineTooltip(entry);

      const stem = document.createElement("span");
      stem.className = "timeline-point-stem";
      const dot = document.createElement("span");
      dot.className = "timeline-point-dot";
      point.append(stem, dot);
      timelinePointsEl.appendChild(point);

      const label = document.createElement("div");
      label.className = "timeline-point-label";
      label.dataset.certainty = entry.certainty;
      label.style.left = `${entry.x}%`;
      label.style.top = `${78 - entry.lane * 22}px`;
      label.textContent = entry.label;
      label.title = makeTimelineTooltip(entry);
      timelinePointLabelsEl.appendChild(label);
    });

    return { unit, start, end };
  }

  function renderTimeline() {
    if (!timelineSectionEl) return;

    const current = getCurrentParagraph();
    if (!current) {
      timelineSectionEl.hidden = true;
      return;
    }

    const entries = getEffectiveTimelineEntries(current);
    if (entries.length === 0) {
      timelineSectionEl.hidden = true;
      return;
    }

    timelineSectionEl.hidden = false;
    const windowInfo = renderTimelineRail(entries);
    timelineSummaryEl.textContent = formatTimelineSummary(entries, windowInfo?.unit ?? null);
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
    const sectionParagraphCount = getSectionParagraphCount(current.sectionId);
    const candidates = resolveAudioCandidates(current);

    playerSectionLabelEl.textContent = sectionLabel;
    playerParagraphLabelEl.textContent = `Paragraph ${current.paragraphNumber}`;

    const paragraphMeta = `Paragraph ${current.paragraphNumber} of ${sectionParagraphCount}`;

    playerTimeRangeEl.textContent =
      candidates.length > 0
        ? `${paragraphMeta} • Audio ready`
        : `${paragraphMeta} • No audio`;

    nowReadingTitleEl.textContent = sectionLabel;

    renderParagraphText(current);

    previousParagraphTextEl.textContent = previous ? collapseWhitespace(previous.text) : "—";
    nextParagraphTextEl.textContent = next ? collapseWhitespace(next.text) : "—";

    contextGridEl.style.display = state.oneParagraphMode ? "none" : "grid";

    renderTimeline();
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
    updateAudioMetaControls();
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
    updateAudioMetaControls();

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

    if (progressBar) {
      progressBar.value = "0";
    }
    if (currentTimeLabel) {
      currentTimeLabel.textContent = "0:00";
    }
    if (durationLabel) {
      durationLabel.textContent = paragraph?.duration ? formatTime(paragraph.duration) : "0:00";
    }
    if (rewindBtn) {
      rewindBtn.disabled = true;
    }

    state.currentAudioCandidates = resolveAudioCandidates(paragraph);
    state.currentAudioCandidateIndex = -1;
    state.currentAudioPath = "";
    state.autoplayRequested = autoplay;
    updateAudioMetaControls();

    if (state.currentAudioCandidates.length === 0) {
      clearAudioElement();
      playPauseBtn.textContent = "Play";
      console.warn("Paragraph has no audio:", paragraph?.id);
      return;
    }

    await loadAudioCandidate(0, autoplay);
  }

  function updatePlayPauseButton() {
    const hasAudio = state.currentAudioCandidates.length > 0;
    playPauseBtn.textContent = hasAudio && !audio.paused ? "Pause" : "Play";
    if (rewindBtn) {
      rewindBtn.disabled = !hasAudio;
    }
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

  function rewindAudio(seconds = 10) {
    if (!state.currentAudioCandidates.length) return;
    audio.currentTime = Math.max(0, (Number.isFinite(audio.currentTime) ? audio.currentTime : 0) - seconds);
  }

  function updateAudioMetaControls() {
    if (!rewindBtn) return;
    rewindBtn.disabled = state.currentAudioCandidates.length === 0 || !state.currentAudioPath;
  }

  function ensureEnhancedLayout() {
    if (playerCardEl && playerMetaEl && playerControlsRowEl && !playerCardEl.querySelector(".player-top-row")) {
      const topRow = document.createElement("div");
      topRow.className = "player-top-row";
      playerCardEl.insertBefore(topRow, playerMetaEl);
      topRow.append(playerMetaEl, playerControlsRowEl);
    }

    if (playerCardEl && toggleRowEl && !playerCardEl.querySelector(".player-bottom-row")) {
      const bottomRow = document.createElement("div");
      bottomRow.className = "player-bottom-row";
      toggleRowEl.parentNode.insertBefore(bottomRow, toggleRowEl);
      bottomRow.appendChild(toggleRowEl);

      playerAudioRowEl = document.createElement("div");
      playerAudioRowEl.className = "player-audio-row";

      rewindBtn = document.createElement("button");
      rewindBtn.type = "button";
      rewindBtn.className = "control-btn player-rewind-btn";
      rewindBtn.textContent = "<<";
      rewindBtn.setAttribute("aria-label", "Rewind audio by ten seconds");
      rewindBtn.addEventListener("click", () => rewindAudio(10));

      const timeMeta = document.createElement("div");
      timeMeta.className = "player-audio-meta";

      const separator = document.createElement("span");
      separator.className = "player-time-separator";
      separator.textContent = "/";

      if (currentTimeLabel && durationLabel) {
        timeMeta.append(currentTimeLabel, separator, durationLabel);
      }

      playerAudioRowEl.append(rewindBtn, timeMeta);
      bottomRow.appendChild(playerAudioRowEl);
    }

    if (progressWrapEl) {
      progressWrapEl.hidden = true;
      progressWrapEl.setAttribute("aria-hidden", "true");
    }

    if (currentCardEl && !timelineSectionEl) {
      timelineSectionEl = document.createElement("section");
      timelineSectionEl.id = "timelineSection";
      timelineSectionEl.className = "timeline-card card";
      timelineSectionEl.hidden = true;
      timelineSectionEl.innerHTML = `
        <div class="timeline-header">
          <div class="eyebrow">Temporal setting</div>
          <div class="timeline-summary" id="timelineSummary"></div>
        </div>
        <div class="timeline-rail" id="timelineRail">
          <div class="timeline-track">
            <div class="timeline-grid" id="timelineGrid"></div>
            <div class="timeline-axis"></div>
            <div class="timeline-spans" id="timelineSpans"></div>
            <div class="timeline-span-labels" id="timelineSpanLabels"></div>
            <div class="timeline-points" id="timelinePoints"></div>
            <div class="timeline-point-labels" id="timelinePointLabels"></div>
          </div>
        </div>
        <div class="timeline-fallback" id="timelineFallback" hidden></div>
      `;
      currentCardEl.parentNode.insertBefore(timelineSectionEl, currentCardEl);
      timelineSummaryEl = timelineSectionEl.querySelector("#timelineSummary");
      timelineRailEl = timelineSectionEl.querySelector("#timelineRail");
      timelineGridEl = timelineSectionEl.querySelector("#timelineGrid");
      timelineSpansEl = timelineSectionEl.querySelector("#timelineSpans");
      timelineSpanLabelsEl = timelineSectionEl.querySelector("#timelineSpanLabels");
      timelinePointsEl = timelineSectionEl.querySelector("#timelinePoints");
      timelinePointLabelsEl = timelineSectionEl.querySelector("#timelinePointLabels");
      timelineFallbackEl = timelineSectionEl.querySelector("#timelineFallback");
    }
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
    if (durationLabel) {
      durationLabel.textContent = formatTime(duration);
    }
  });

  audio.addEventListener("timeupdate", () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

    if (currentTimeLabel) {
      currentTimeLabel.textContent = formatTime(currentTime);
    }
    if (durationLabel) {
      durationLabel.textContent = formatTime(duration);
    }

    if (progressBar) {
      if (duration > 0) {
        progressBar.value = String((currentTime / duration) * 100);
      } else {
        progressBar.value = "0";
      }
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

  if (progressBar) {
    progressBar.addEventListener("input", () => {
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      if (duration <= 0) return;

      const ratio = Number(progressBar.value) / 100;
      audio.currentTime = duration * ratio;
    });
  }

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
      ensureEnhancedLayout();

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
