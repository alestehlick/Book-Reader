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

  let notesPanelEl = null;
  let notesBodyEl = null;
  let toggleNotesBtn = null;
  let notesStatusEl = null;
  let paragraphNoteInput = null;
  let clearParagraphNoteBtn = null;
  let notesCornerDockEl = null;
  let exportNotesBtn = null;
  let importNotesBtn = null;
  let importNotesFileInput = null;

  const mediaSectionEl = document.getElementById("mediaSection");
  const mediaSummaryEl = document.getElementById("mediaSummary");
  const figureGroupEl = document.getElementById("figureGroup");
  const videoGroupEl = document.getElementById("videoGroup");
  const paragraphFiguresEl = document.getElementById("paragraphFigures");
  const paragraphVideosEl = document.getElementById("paragraphVideos");

  const DEFAULT_AUDIO_DIRS = ["audio/paragraphs", "audio/paragraphs/s"];
  const DEFAULT_FIGURES_DIR = "figures";
  const DEFAULT_VIDEOS_DIR = "videos";
  const DEFAULT_VIDEO_EXTENSIONS = ["webm", "mp4"];
  const THEME_STORAGE_KEY = "audio-reader-theme";
  const NOTES_STORAGE_PREFIX = "audio-reader-notes";
  const MATHJAX_SCRIPT_ID = "reader-mathjax-script";
  const MATHJAX_CDN_URL = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";

  const SIMPLE_LATEX_TEXT_REPLACEMENTS = [
    [/\\AA\b/g, "Å"],
    [/\\angstrom\b/g, "Å"],
    [/\\Angstrom\b/g, "Å"],
    [/\\alpha\b/g, "α"],
    [/\\beta\b/g, "β"],
    [/\\gamma\b/g, "γ"],
    [/\\delta\b/g, "δ"],
    [/\\epsilon\b/g, "ε"],
    [/\\varepsilon\b/g, "ε"],
    [/\\theta\b/g, "θ"],
    [/\\lambda\b/g, "λ"],
    [/\\mu\b/g, "μ"],
    [/\\nu\b/g, "ν"],
    [/\\xi\b/g, "ξ"],
    [/\\pi\b/g, "π"],
    [/\\rho\b/g, "ρ"],
    [/\\sigma\b/g, "σ"],
    [/\\tau\b/g, "τ"],
    [/\\phi\b/g, "φ"],
    [/\\varphi\b/g, "φ"],
    [/\\chi\b/g, "χ"],
    [/\\psi\b/g, "ψ"],
    [/\\omega\b/g, "ω"],
    [/\\Gamma\b/g, "Γ"],
    [/\\Delta\b/g, "Δ"],
    [/\\Theta\b/g, "Θ"],
    [/\\Lambda\b/g, "Λ"],
    [/\\Xi\b/g, "Ξ"],
    [/\\Pi\b/g, "Π"],
    [/\\Sigma\b/g, "Σ"],
    [/\\Phi\b/g, "Φ"],
    [/\\Psi\b/g, "Ψ"],
    [/\\Omega\b/g, "Ω"],
    [/\\cdot\b/g, "·"],
    [/\\times\b/g, "×"],
    [/\\pm\b/g, "±"],
    [/\\mp\b/g, "∓"],
    [/\\leq?\b/g, "≤"],
    [/\\geq?\b/g, "≥"],
    [/\\neq\b/g, "≠"],
    [/\\approx\b/g, "≈"],
    [/\\sim\b/g, "∼"],
    [/\\propto\b/g, "∝"],
    [/\\infty\b/g, "∞"],
    [/\\to\b/g, "→"],
    [/\\rightarrow\b/g, "→"],
    [/\\leftarrow\b/g, "←"],
    [/\\leftrightarrow\b/g, "↔"],
    [/\\mapsto\b/g, "↦"],
    [/\\degree\b/g, "°"],
    [/\\ldots\b/g, "…"],
    [/\\dots\b/g, "…"],
  ];

  const SIMPLE_SUBSCRIPT_MAP = {
    "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
    "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
    "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
    "a": "ₐ", "e": "ₑ", "h": "ₕ", "i": "ᵢ", "j": "ⱼ",
    "k": "ₖ", "l": "ₗ", "m": "ₘ", "n": "ₙ", "o": "ₒ",
    "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", "u": "ᵤ",
    "v": "ᵥ", "x": "ₓ", "β": "ᵦ", "γ": "ᵧ", "ρ": "ᵨ", "φ": "ᵩ", "χ": "ᵪ"
  };

  const SIMPLE_SUPERSCRIPT_MAP = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
    "a": "ᵃ", "b": "ᵇ", "c": "ᶜ", "d": "ᵈ", "e": "ᵉ",
    "f": "ᶠ", "g": "ᵍ", "h": "ʰ", "i": "ⁱ", "j": "ʲ",
    "k": "ᵏ", "l": "ˡ", "m": "ᵐ", "n": "ⁿ", "o": "ᵒ",
    "p": "ᵖ", "r": "ʳ", "s": "ˢ", "t": "ᵗ", "u": "ᵘ",
    "v": "ᵛ", "w": "ʷ", "x": "ˣ", "y": "ʸ", "z": "ᶻ",
    "β": "ᵝ", "γ": "ᵞ", "δ": "ᵟ", "φ": "ᵠ", "χ": "ᵡ", "θ": "ᶿ"
  };

  let notesOpen = false;
  let mathJaxLoadPromise = null;
  let noteSaveTimer = null;

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

  function toSafeFileNameStem(value) {
    const stem = String(value || "notes")
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80);

    return stem || "notes";
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

  function getVideoStackEl() {
    return paragraphVideosEl || paragraphFiguresEl;
  }

  function clearMediaStacks() {
    if (paragraphFiguresEl) {
      paragraphFiguresEl.innerHTML = "";
    }

    if (paragraphVideosEl && paragraphVideosEl !== paragraphFiguresEl) {
      paragraphVideosEl.innerHTML = "";
    }
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

  function replaceSimpleLatexText(text) {
    let output = String(text || "");

    SIMPLE_LATEX_TEXT_REPLACEMENTS.forEach(([pattern, replacement]) => {
      output = output.replace(pattern, replacement);
    });

    return output
      .replace(/\\,/g, " ")
      .replace(/\\;/g, " ")
      .replace(/\\:/g, " ")
      .replace(/\\!/g, "")
      .replace(/~/g, " ");
  }

  function convertSimpleScriptRuns(text, marker, replacements) {
    return String(text || "").replace(
      new RegExp(`\\${marker}(\\{([^{}]+)\\}|([A-Za-z0-9+\-=()αβγδρφχθ]))`, "g"),
      (_, _whole, braced, single) => {
        const rawValue = braced ?? single ?? "";
        if (!rawValue) return marker;

        let converted = "";
        for (const char of rawValue) {
          const mapped = replacements[char];
          if (!mapped) {
            return marker + rawValue;
          }
          converted += mapped;
        }

        return converted;
      }
    );
  }

  function latexMathToPlainText(mathSource) {
    let text = String(mathSource || "").trim();

    if (text.startsWith("\\[") && text.endsWith("\\]")) {
      text = text.slice(2, -2);
    } else if (text.startsWith("\\(") && text.endsWith("\\)")) {
      text = text.slice(2, -2);
    } else if (text.startsWith("$$") && text.endsWith("$$")) {
      text = text.slice(2, -2);
    }

    text = text
      .replace(/\\text\{([^{}]*)\}/g, "$1")
      .replace(/\\mathrm\{([^{}]*)\}/g, "$1")
      .replace(/\\operatorname\{([^{}]*)\}/g, "$1")
      .replace(/\\left/g, "")
      .replace(/\\right/g, "");

    text = replaceSimpleLatexText(text);
    text = convertSimpleScriptRuns(text, "_", SIMPLE_SUBSCRIPT_MAP);
    text = convertSimpleScriptRuns(text, "^", SIMPLE_SUPERSCRIPT_MAP);
    text = text.replace(/[{}]/g, "");
    text = text.replace(/\\/g, "");
    return collapseWhitespace(text);
  }

  function splitMathAwareSegments(text) {
    const source = String(text || "");
    const pattern = /(\\\[(?:[\s\S]*?)\\\]|\$\$(?:[\s\S]*?)\$\$|\\\((?:[\s\S]*?)\\\))/g;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(source)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: "text", value: source.slice(lastIndex, match.index) });
      }

      const token = match[0];
      const type = token.startsWith("\\[") || token.startsWith("$$") ? "displayMath" : "inlineMath";
      segments.push({ type, value: token });
      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < source.length) {
      segments.push({ type: "text", value: source.slice(lastIndex) });
    }

    return segments;
  }

  function prepareReaderTextForDisplay(text) {
    return splitMathAwareSegments(text)
      .map((segment) => (segment.type === "text" ? replaceSimpleLatexText(segment.value) : segment.value))
      .join("");
  }

  function toPlainReadingText(text) {
    return collapseWhitespace(
      splitMathAwareSegments(text)
        .map((segment) => (segment.type === "text" ? replaceSimpleLatexText(segment.value) : latexMathToPlainText(segment.value)))
        .join(" ")
    );
  }

  function firstNonEmptyString(...values) {
    for (const value of values) {
      if (typeof value !== "string") continue;
      if (!value.trim()) continue;
      return value;
    }
    return "";
  }

  function getReaderText(paragraph) {
    return firstNonEmptyString(
      paragraph?.readerText,
      paragraph?.reader_text,
      paragraph?.displayText,
      paragraph?.display_text,
      paragraph?.text
    );
  }

  function getTtsText(paragraph) {
    return firstNonEmptyString(
      paragraph?.ttsText,
      paragraph?.tts_text,
      paragraph?.audioText,
      paragraph?.audio_text,
      paragraph?.spokenText,
      paragraph?.spoken_text,
      paragraph?.text,
      paragraph?.readerText,
      paragraph?.reader_text
    );
  }

  function hasRenderableMath(text) {
    return /\\\(|\\\[|\$\$|\\begin\{/.test(String(text || ""));
  }

  function getPlainPreviewText(paragraph) {
    const source = getReaderText(paragraph) || getTtsText(paragraph);
    return source ? toPlainReadingText(source) : "";
  }

  function splitReaderTextSegments(text) {
    const source = prepareReaderTextForDisplay(text);
    const pattern = /(\\\[(?:[\s\S]*?)\\\]|\$\$(?:[\s\S]*?)\$\$)/g;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(source)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: "text", value: source.slice(lastIndex, match.index) });
      }

      segments.push({ type: "displayMath", value: match[0] });
      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < source.length) {
      segments.push({ type: "text", value: source.slice(lastIndex) });
    }

    return segments;
  }

  function applyPlainMathFallback(element) {
    if (!element) return;

    element.querySelectorAll(".reader-display-math").forEach((mathBlock) => {
      mathBlock.textContent = latexMathToPlainText(mathBlock.textContent || "");
      mathBlock.classList.add("reader-display-math-fallback");
    });

    element.querySelectorAll("p").forEach((paragraphEl) => {
      paragraphEl.textContent = toPlainReadingText(paragraphEl.textContent || "");
    });
  }

  function ensureMathJax() {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      return Promise.resolve(window.MathJax);
    }

    if (mathJaxLoadPromise) {
      return mathJaxLoadPromise;
    }

    window.MathJax = window.MathJax || {
      tex: {
        inlineMath: [["\\(", "\\)"]],
        displayMath: [["\\[", "\\]"], ["$$", "$$"]],
      },
      options: {
        skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"],
      },
      startup: {
        typeset: false,
      },
    };

    mathJaxLoadPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(MATHJAX_SCRIPT_ID);

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(window.MathJax), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("MathJax failed to load.")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = MATHJAX_SCRIPT_ID;
      script.async = true;
      script.src = MATHJAX_CDN_URL;
      script.addEventListener("load", () => resolve(window.MathJax), { once: true });
      script.addEventListener("error", () => reject(new Error("MathJax failed to load.")), { once: true });
      document.head.appendChild(script);
    }).catch((error) => {
      mathJaxLoadPromise = null;
      console.warn("Could not load MathJax for reader text:", error);
      throw error;
    });

    return mathJaxLoadPromise;
  }

  async function typesetMathInElement(element) {
    if (!element || !hasRenderableMath(element.textContent || "")) return;

    try {
      const mathJax = await ensureMathJax();
      if (mathJax && typeof mathJax.typesetPromise === "function") {
        await mathJax.typesetPromise([element]);
      }
    } catch (error) {
      console.warn("Math rendering was skipped:", error);
      applyPlainMathFallback(element);
    }
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

  function getCurrentCardEl() {
    return currentParagraphTextEl?.closest(".current-card") || currentParagraphTextEl?.parentElement || null;
  }

  function getSectionLinkSelector(sectionId) {
    const escaped =
      window.CSS && typeof window.CSS.escape === "function"
        ? window.CSS.escape(String(sectionId || ""))
        : String(sectionId || "").replace(/"/g, '\\\"');
    return `.section-link[data-section-id="${escaped}"]`;
  }

  function ensureNotesUi() {
    if (!currentParagraphTextEl) return;

    const hostCard = getCurrentCardEl();
    if (!hostCard) return;

    if (!notesPanelEl) {
      notesPanelEl = document.createElement("section");
      notesPanelEl.className = "notes-panel";
      notesPanelEl.id = "notesPanel";
      notesPanelEl.innerHTML = `
        <div class="notes-panel-header">
          <div class="notes-panel-title-group">
            <span class="notes-panel-meta">Notes for this paragraph</span>
          </div>
          <div class="notes-panel-actions">
            <span class="notes-status" id="notesStatus">No note yet</span>
            <button type="button" class="notes-clear-btn" id="clearParagraphNoteBtn" hidden>Clear</button>
          </div>
        </div>
        <div class="notes-body" id="notesBody" hidden>
          <textarea
            id="paragraphNoteInput"
            class="paragraph-note-input"
            placeholder="Write your reflections, questions, analogies, or reminders for this paragraph..."
            spellcheck="true"
          ></textarea>
        </div>
      `;

      currentParagraphTextEl.insertAdjacentElement("afterend", notesPanelEl);
    }

    if (!notesCornerDockEl) {
      notesCornerDockEl = document.createElement("div");
      notesCornerDockEl.className = "notes-corner-dock";
      notesCornerDockEl.id = "notesCornerDock";
      notesCornerDockEl.innerHTML = `
        <button type="button" class="notes-corner-btn notes-corner-btn-primary" id="toggleNotesBtn" title="Open or close notes" aria-label="Open or close notes">✎</button>
        <button type="button" class="notes-corner-btn notes-corner-btn-aux" id="exportNotesBtn" title="Export all Molecular Biology notes backup" aria-label="Export all Molecular Biology notes backup" hidden>⇩</button>
        <button type="button" class="notes-corner-btn notes-corner-btn-aux" id="importNotesBtn" title="Import all Molecular Biology notes backup" aria-label="Import all Molecular Biology notes backup" hidden>⇧</button>
        <input type="file" id="importNotesFileInput" accept="application/json,.json" hidden />
      `;

      document.body.appendChild(notesCornerDockEl);
    }

    notesBodyEl = document.getElementById("notesBody");
    toggleNotesBtn = document.getElementById("toggleNotesBtn");
    notesStatusEl = document.getElementById("notesStatus");
    paragraphNoteInput = document.getElementById("paragraphNoteInput");
    clearParagraphNoteBtn = document.getElementById("clearParagraphNoteBtn");
    exportNotesBtn = document.getElementById("exportNotesBtn");
    importNotesBtn = document.getElementById("importNotesBtn");
    importNotesFileInput = document.getElementById("importNotesFileInput");

    if (!toggleNotesBtn?.dataset.bound) {
      toggleNotesBtn?.addEventListener("click", toggleNotesPanel);
      toggleNotesBtn.dataset.bound = "true";
    }

    if (!clearParagraphNoteBtn?.dataset.bound) {
      clearParagraphNoteBtn?.addEventListener("click", () => {
        if (!paragraphNoteInput) return;
        paragraphNoteInput.value = "";
        saveCurrentParagraphNote("", { statusMessage: "Note cleared" });
        renderCurrentParagraphNote();
        if (notesOpen) {
          paragraphNoteInput.focus();
        }
      });
      clearParagraphNoteBtn.dataset.bound = "true";
    }

    if (!paragraphNoteInput?.dataset.bound) {
      paragraphNoteInput?.addEventListener("input", () => {
        setNotesStatus("Saving...");
        clearTimeout(noteSaveTimer);

        noteSaveTimer = window.setTimeout(() => {
          saveCurrentParagraphNote(paragraphNoteInput.value, { statusMessage: "Saved locally" });
        }, 450);
      });
      paragraphNoteInput.dataset.bound = "true";
    }

    if (!exportNotesBtn?.dataset.bound) {
      exportNotesBtn?.addEventListener("click", exportNotesBackup);
      exportNotesBtn.dataset.bound = "true";
    }

    if (!importNotesBtn?.dataset.bound) {
      importNotesBtn?.addEventListener("click", () => {
        importNotesFileInput?.click();
      });
      importNotesBtn.dataset.bound = "true";
    }

    if (!importNotesFileInput?.dataset.bound) {
      importNotesFileInput?.addEventListener("change", handleImportNotesFileSelection);
      importNotesFileInput.dataset.bound = "true";
    }

    updateNotesButtonLabels();
    updateNotesDockState();
  }

  function updateNotesButtonLabels() {
    const projectTitle = getProjectTitle();
    const exportLabel = `Export all ${projectTitle} notes backup`;
    const importLabel = `Import all ${projectTitle} notes backup`;

    if (exportNotesBtn) {
      exportNotesBtn.title = exportLabel;
      exportNotesBtn.setAttribute("aria-label", exportLabel);
    }

    if (importNotesBtn) {
      importNotesBtn.title = importLabel;
      importNotesBtn.setAttribute("aria-label", importLabel);
    }
  }

  function hasAnyProjectNotes() {
    return collectAllProjectNotes().some((entry) => Object.keys(entry.notes).length > 0);
  }

  function updateNotesDockState() {
    const paragraph = getCurrentParagraph();
    const hasParagraph = Boolean(paragraph);
    const hasAnyNotes = hasAnyProjectNotes();

    if (notesCornerDockEl) {
      notesCornerDockEl.hidden = !hasParagraph;
      notesCornerDockEl.classList.toggle("expanded", notesOpen);
    }

    if (toggleNotesBtn) {
      toggleNotesBtn.classList.toggle("active", notesOpen);
      toggleNotesBtn.setAttribute("aria-pressed", notesOpen ? "true" : "false");
    }

    if (exportNotesBtn) {
      exportNotesBtn.hidden = !hasParagraph || (!notesOpen && !hasAnyNotes);
    }

    if (importNotesBtn) {
      importNotesBtn.hidden = !hasParagraph || !notesOpen;
    }
  }

  function getCurrentDirectoryPath() {
    return window.location.pathname.replace(/\/[^/]*$/, "") || "/";
  }

  function getParentDirectoryPath(pathValue) {
    const normalized = String(pathValue || "/").replace(/\/+$/, "") || "/";
    const parent = normalized.replace(/\/[^/]*$/, "") || "/";
    return parent || "/";
  }

  function getNotesProjectScope() {
    const explicit = normalizePath(getDatasetValue("notesProjectScope"));
    if (explicit) {
      return explicit.startsWith("/") ? explicit : `/${explicit}`;
    }

    return getParentDirectoryPath(getCurrentDirectoryPath());
  }

  function getProjectTitle() {
    const explicit = String(getDatasetValue("notesProjectTitle") || "").trim();
    if (explicit) return explicit;

    const scope = getNotesProjectScope().replace(/\/+$/, "") || "/";
    const tail = scope.split("/").filter(Boolean).pop() || "Book Reader";

    try {
      return decodeURIComponent(tail);
    } catch (error) {
      return tail;
    }
  }

  function getNotesStorageScope() {
    const pathScope = getCurrentDirectoryPath();
    const titleScope = String(state.book?.title || "untitled-book").trim() || "untitled-book";
    return `${pathScope}::${titleScope}`;
  }

  function getBookNotesStorageKey() {
    return `${NOTES_STORAGE_PREFIX}::${getNotesStorageScope()}`;
  }

  function readAllLocalNotes() {
    try {
      const raw = localStorage.getItem(getBookNotesStorageKey());
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      console.warn("Could not read notes from localStorage:", error);
      return {};
    }
  }

  function writeAllLocalNotes(notesMap) {
    try {
      localStorage.setItem(getBookNotesStorageKey(), JSON.stringify(notesMap));
    } catch (error) {
      console.warn("Could not write notes to localStorage:", error);
    }
  }

  function setNotesStatus(message) {
    if (notesStatusEl) {
      notesStatusEl.textContent = String(message || "");
    }
  }

  function updateClearNoteButton(noteText) {
    if (clearParagraphNoteBtn) {
      clearParagraphNoteBtn.hidden = !String(noteText || "").trim();
    }
  }

  function getCurrentParagraphNote() {
    const paragraph = getCurrentParagraph();
    if (!paragraph) return "";

    const notesMap = readAllLocalNotes();
    return typeof notesMap[paragraph.id] === "string" ? notesMap[paragraph.id] : "";
  }

  function saveCurrentParagraphNote(text, options = {}) {
    const paragraph = getCurrentParagraph();
    if (!paragraph) return;

    const notesMap = readAllLocalNotes();
    const cleaned = String(text || "").replace(/\s+$/u, "");

    if (cleaned.trim()) {
      notesMap[paragraph.id] = cleaned;
    } else {
      delete notesMap[paragraph.id];
    }

    writeAllLocalNotes(notesMap);
    updateClearNoteButton(cleaned);
    updateSectionNoteMarkers();
    setNotesStatus(options.statusMessage || (cleaned.trim() ? "Saved locally" : "No note yet"));
    updateNotesDockState();
  }

  function renderCurrentParagraphNote() {
    ensureNotesUi();

    if (!notesPanelEl) return;

    const paragraph = getCurrentParagraph();
    notesPanelEl.hidden = !paragraph;
    if (!paragraph) return;

    const noteText = getCurrentParagraphNote();

    if (paragraphNoteInput) {
      paragraphNoteInput.value = noteText;
    }

    if (notesBodyEl) {
      notesBodyEl.hidden = !notesOpen;
    }

    updateClearNoteButton(noteText);
    setNotesStatus(noteText.trim() ? "Saved locally" : "No note yet");
    updateNotesDockState();
  }

  function toggleNotesPanel() {
    notesOpen = !notesOpen;

    if (notesBodyEl) {
      notesBodyEl.hidden = !notesOpen;
    }

    updateNotesDockState();

    if (notesOpen && paragraphNoteInput) {
      paragraphNoteInput.focus();
      paragraphNoteInput.setSelectionRange(
        paragraphNoteInput.value.length,
        paragraphNoteInput.value.length
      );
    }
  }

  function updateSectionNoteMarkers() {
    if (!Array.isArray(state.book?.sections) || state.flatParagraphs.length === 0) return;

    const notesMap = readAllLocalNotes();

    document.querySelectorAll(".section-link").forEach((button) => {
      button.classList.remove("has-note-indicator");
    });

    state.book.sections.forEach((section) => {
      const hasNote = state.flatParagraphs.some((paragraph) => {
        if (paragraph.sectionId !== section.id) return false;
        return Boolean(String(notesMap[paragraph.id] || "").trim());
      });

      if (!hasNote) return;

      const button = document.querySelector(getSectionLinkSelector(section.id));
      button?.classList.add("has-note-indicator");
    });
  }

  function getProjectNotesKeyPrefix() {
    return `${NOTES_STORAGE_PREFIX}::${getNotesProjectScope().replace(/\/+$/, "")}/`;
  }

  function parseNotesStorageKey(storageKey) {
    if (!String(storageKey || "").startsWith(`${NOTES_STORAGE_PREFIX}::`)) {
      return null;
    }

    const storageScope = String(storageKey).slice(`${NOTES_STORAGE_PREFIX}::`.length);
    const separatorIndex = storageScope.lastIndexOf("::");
    if (separatorIndex === -1) {
      return null;
    }

    return {
      storageScope,
      pathScope: storageScope.slice(0, separatorIndex),
      bookTitle: storageScope.slice(separatorIndex + 2),
    };
  }

  function collectAllProjectNotes() {
    const entries = [];
    const projectPrefix = getProjectNotesKeyPrefix();

    for (let i = 0; i < localStorage.length; i += 1) {
      const storageKey = localStorage.key(i);
      if (!storageKey || !storageKey.startsWith(projectPrefix)) continue;

      const parsedKey = parseNotesStorageKey(storageKey);
      if (!parsedKey) continue;

      let notes = {};
      try {
        const raw = localStorage.getItem(storageKey);
        const parsedNotes = raw ? JSON.parse(raw) : {};
        notes = sanitizeImportedNotes(parsedNotes || {});
      } catch (error) {
        console.warn("Could not parse stored notes:", error);
        continue;
      }

      entries.push({
        storageKey,
        storageScope: parsedKey.storageScope,
        pathScope: parsedKey.pathScope,
        bookTitle: parsedKey.bookTitle,
        notes,
      });
    }

    return entries.sort((a, b) => {
      if (a.pathScope === b.pathScope) {
        return a.bookTitle.localeCompare(b.bookTitle);
      }
      return a.pathScope.localeCompare(b.pathScope);
    });
  }

  function buildNotesExportPayload() {
    const books = {};
    for (const entry of collectAllProjectNotes()) {
      books[entry.storageScope] = {
        bookTitle: entry.bookTitle,
        pathScope: entry.pathScope,
        notes: entry.notes,
      };
    }

    return {
      format: "book-reader-notes-v2",
      projectTitle: getProjectTitle(),
      projectScope: getNotesProjectScope(),
      exportedAt: new Date().toISOString(),
      books,
    };
  }

  function getNotesExportFileName() {
    return `${toSafeFileNameStem(getProjectTitle())}_notes_backup.json`;
  }

  async function exportNotesBackup() {
    try {
      const payload = buildNotesExportPayload();
      const bookCount = Object.keys(payload.books).length;
      const json = JSON.stringify(payload, null, 2);
      const fileName = getNotesExportFileName();
      const blob = new Blob([json], { type: "application/json" });

      if (typeof File === "function" && navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], fileName, { type: "application/json" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `${getProjectTitle()} notes backup`,
              text: `${getProjectTitle()} notes backup across ${bookCount} chapter${bookCount === 1 ? "" : "s"}`,
              files: [file],
            });
            setNotesStatus("Backup ready in share sheet");
            return;
          }
        } catch (error) {
          if (error?.name === "AbortError") {
            setNotesStatus("Export cancelled");
            return;
          }
          console.warn("Share export fell back to direct download:", error);
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1200);
      setNotesStatus("Backup exported");
    } catch (error) {
      console.error("Could not export notes:", error);
      setNotesStatus("Export failed");
    }
  }

  function sanitizeImportedNotes(rawNotes) {
    if (!rawNotes || typeof rawNotes !== "object" || Array.isArray(rawNotes)) {
      throw new Error("Invalid notes payload.");
    }

    const cleaned = {};
    for (const [key, value] of Object.entries(rawNotes)) {
      if (typeof value !== "string") continue;
      const noteText = value.replace(/\s+$/u, "");
      if (!noteText.trim()) continue;
      cleaned[String(key)] = noteText;
    }

    return cleaned;
  }

  function normalizeImportedBooks(parsed) {
    if (parsed?.format === "book-reader-notes-v2" && parsed?.books && typeof parsed.books === "object") {
      const normalized = [];

      for (const [storageScope, entry] of Object.entries(parsed.books)) {
        const cleanStorageScope = String(storageScope || "").trim();
        if (!cleanStorageScope) continue;

        const notes = sanitizeImportedNotes(entry?.notes || {});
        const parsedKey = parseNotesStorageKey(`${NOTES_STORAGE_PREFIX}::${cleanStorageScope}`) || {};

        normalized.push({
          storageScope: cleanStorageScope,
          pathScope: String(entry?.pathScope || parsedKey.pathScope || "").trim(),
          bookTitle: String(entry?.bookTitle || parsedKey.bookTitle || "Untitled Book").trim() || "Untitled Book",
          notes,
        });
      }

      return normalized;
    }

    const singleBookNotes = sanitizeImportedNotes(parsed?.notes ?? parsed);
    const singleBookStorageScope = String(parsed?.storageScope || getNotesStorageScope()).trim() || getNotesStorageScope();
    const parsedKey = parseNotesStorageKey(`${NOTES_STORAGE_PREFIX}::${singleBookStorageScope}`) || {};

    return [{
      storageScope: singleBookStorageScope,
      pathScope: String(parsed?.pathScope || parsedKey.pathScope || getCurrentDirectoryPath()).trim() || getCurrentDirectoryPath(),
      bookTitle: String(parsed?.bookTitle || parsedKey.bookTitle || state.book?.title || "Untitled Book").trim() || "Untitled Book",
      notes: singleBookNotes,
    }];
  }

  function clearProjectNotesSnapshot() {
    const keysToRemove = collectAllProjectNotes().map((entry) => entry.storageKey);
    keysToRemove.forEach((storageKey) => {
      localStorage.removeItem(storageKey);
    });
  }

  async function handleImportNotesFileSelection(event) {
    const input = event?.target;
    const file = input?.files?.[0];
    if (!file) return;

    try {
      const rawText = await file.text();
      const parsed = JSON.parse(rawText);
      const importedBooks = normalizeImportedBooks(parsed);
      const importedProjectTitle = String(parsed?.projectTitle || "").trim();
      const importedProjectScope = String(parsed?.projectScope || "").trim();
      const currentProjectScope = getNotesProjectScope();

      if (
        importedProjectTitle &&
        importedProjectScope &&
        importedProjectScope !== currentProjectScope &&
        !window.confirm(
          `This backup is for “${importedProjectTitle}”. Replace the current ${getProjectTitle()} notes with it anyway?`
        )
      ) {
        setNotesStatus("Import cancelled");
        return;
      }

      clearProjectNotesSnapshot();

      let importedNoteCount = 0;
      importedBooks.forEach((bookEntry) => {
        const notes = sanitizeImportedNotes(bookEntry.notes || {});
        const storageKey = `${NOTES_STORAGE_PREFIX}::${bookEntry.storageScope}`;
        localStorage.setItem(storageKey, JSON.stringify(notes));
        importedNoteCount += Object.keys(notes).length;
      });

      updateSectionNoteMarkers();
      renderCurrentParagraphNote();
      setNotesStatus(`Imported ${importedNoteCount} note${importedNoteCount === 1 ? "" : "s"} across ${importedBooks.length} chapter${importedBooks.length === 1 ? "" : "s"}`);
    } catch (error) {
      console.error("Could not import notes:", error);
      setNotesStatus("Import failed");
    } finally {
      if (input) {
        input.value = "";
      }
    }
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
    if (notesPanelEl) {
      notesPanelEl.hidden = true;
    }
    if (notesCornerDockEl) {
      notesCornerDockEl.hidden = true;
    }
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
    const rawText = String(paragraph?.text || "");
    const readerText = getReaderText(paragraph) || rawText;
    const ttsText = getTtsText(paragraph) || rawText || readerText;

    return {
      ...paragraph,
      id: String(paragraph?.id || `${section?.number || section?.id || "00.00"}-p${String(paragraphIndex + 1).padStart(3, "0")}`),
      text: rawText || readerText || ttsText,
      readerText,
      ttsText,
      figures,
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
    updateNotesButtonLabels();
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
      const plainSectionTitle = toPlainReadingText(section.title || "");
      sectionBtn.innerHTML = `
        <span class="section-number">${escapeHtml(section.number || section.id || "")}</span>
        <span class="section-title">${escapeHtml(plainSectionTitle)}</span>
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
    const readerText = prepareReaderTextForDisplay(getReaderText(paragraph));
    const segments = splitReaderTextSegments(readerText);
    let hasRenderableContent = false;

    currentParagraphTextEl.innerHTML = "";

    segments.forEach((segment) => {
      if (segment.type === "displayMath") {
        const mathBlock = document.createElement("div");
        mathBlock.className = "reader-display-math";
        mathBlock.textContent = segment.value.trim();
        currentParagraphTextEl.appendChild(mathBlock);
        hasRenderableContent = true;
        return;
      }

      const textBlocks = String(segment.value || "")
        .split(/\n\s*\n+/)
        .map((block) => block.replace(/\n+/g, " ").trim())
        .filter(Boolean);

      textBlocks.forEach((block) => {
        const paragraphEl = document.createElement("p");
        paragraphEl.textContent = block;
        currentParagraphTextEl.appendChild(paragraphEl);
        hasRenderableContent = true;
      });
    });

    if (!hasRenderableContent) {
      currentParagraphTextEl.innerHTML = "<p>—</p>";
      return;
    }

    void typesetMathInElement(currentParagraphTextEl);
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
        wrapper.replaceWith(createMissingMediaCard(`Could not load figure file: ${figureData.src}`));
      });

      figure.appendChild(img);
      appendMediaCaption(figure, figureData.label, figureData.caption);

      wrapper.appendChild(figure);
      paragraphFiguresEl.appendChild(wrapper);
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
      appendMediaCaption(figure, videoData.label, videoData.caption);

      wrapper.appendChild(figure);
      getVideoStackEl().appendChild(wrapper);
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

    clearMediaStacks();
    mediaSummaryEl.textContent = "";

    if (!current) {
      mediaSectionEl.hidden = true;
      figureGroupEl.hidden = true;
      if (videoGroupEl) videoGroupEl.hidden = true;
      return;
    }

    const rawFigures = Array.isArray(current.figures) ? current.figures : [];
    const rawVideos = Array.isArray(current.videos) ? current.videos : [];

    const validFigures = rawFigures
      .map((entry, index) => resolveFigureEntry(entry, index))
      .filter((item) => item && item.src);

    const validVideos = rawVideos
      .map((entry, index) => resolveVideoEntry(entry, index))
      .filter((item) => item && Array.isArray(item.sources) && item.sources.length > 0);

    const figureCount = validFigures.length;
    const videoCount = validVideos.length;
    const totalCount = figureCount + videoCount;

    if (totalCount === 0) {
      mediaSectionEl.hidden = true;
      figureGroupEl.hidden = true;
      if (videoGroupEl) videoGroupEl.hidden = true;
      return;
    }

    mediaSectionEl.hidden = false;
    figureGroupEl.hidden = figureCount === 0;

    if (videoGroupEl) {
      videoGroupEl.hidden = videoCount === 0;
    }

    mediaSummaryEl.textContent = formatMediaSummary(figureCount, videoCount);

    if (figureCount > 0) {
      renderFigures(rawFigures);
    }

    if (videoCount > 0) {
      renderVideos(rawVideos);
      if (!videoGroupEl && figureGroupEl.hidden) {
        figureGroupEl.hidden = false;
      }
    }
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

    const plainSectionTitle = toPlainReadingText(current.sectionTitle);
    const sectionLabel = `${current.sectionNumber} — ${plainSectionTitle}`;
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
    renderCurrentParagraphNote();

    previousParagraphTextEl.textContent = previous ? (getPlainPreviewText(previous) || "Mathematical paragraph") : "—";
    nextParagraphTextEl.textContent = next ? (getPlainPreviewText(next) || "Mathematical paragraph") : "—";

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
    const hasAudio = state.currentAudioCandidates.length > 0;
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

      const plainBookTitle = toPlainReadingText(state.book.title);
      bookTitleEl.textContent = plainBookTitle;
      document.title = plainBookTitle;
      buildSectionNav();
      ensureNotesUi();
      updateSectionNoteMarkers();

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
