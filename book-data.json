(function () {
  const audio = document.getElementById('audioEl');
  const bookTitle = document.getElementById('bookTitle');
  const bookMeta = document.getElementById('bookMeta');
  const sectionList = document.getElementById('sectionList');
  const nowReading = document.getElementById('nowReading');
  const heroMeta = document.getElementById('heroMeta');
  const sectionTitle = document.getElementById('sectionTitle');
  const paragraphText = document.getElementById('paragraphText');
  const prevText = document.getElementById('prevText');
  const nextText = document.getElementById('nextText');
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const restartBtn = document.getElementById('restartBtn');
  const autoplayToggle = document.getElementById('autoplayToggle');
  const revealToggle = document.getElementById('revealToggle');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const menuButton = document.getElementById('menuButton');
  const sidebar = document.getElementById('sidebar');
  const themeButton = document.getElementById('themeButton');
  const paragraphRange = document.getElementById('paragraphRange');

  const state = {
    flatParagraphs: [],
    currentIndex: 0,
    suppressTimeUpdate: false,
  };

  function flattenBook(book) {
    const flat = [];
    book.sections.forEach((section, sIdx) => {
      section.paragraphs.forEach((para, pIdx) => {
        flat.push({
          ...para,
          sectionId: section.id,
          sectionTitle: section.title,
          sectionIndex: sIdx,
          paragraphIndex: pIdx,
          paragraphCountInSection: section.paragraphs.length,
        });
      });
    });
    return flat;
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    const total = Math.max(0, Math.floor(seconds));
    const hr = Math.floor(total / 3600);
    const min = Math.floor((total % 3600) / 60);
    const sec = total % 60;
    if (hr > 0) return `${hr}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    return `${min}:${String(sec).padStart(2, '0')}`;
  }

  function currentParagraph() {
    return state.flatParagraphs[state.currentIndex];
  }

  function safeTextContent(el, value) {
    el.textContent = value ?? '—';
  }

  function renderSidebar() {
    sectionList.innerHTML = '';
    BOOK_DATA.sections.forEach((section) => {
      const btn = document.createElement('button');
      btn.className = 'section-link';
      btn.innerHTML = `
        <span class="sec-id">SECTION ${section.id}</span>
        <span class="sec-title">${section.title}</span>
      `;
      btn.addEventListener('click', () => {
        const targetIndex = state.flatParagraphs.findIndex((p) => p.sectionId === section.id);
        if (targetIndex >= 0) {
          goToIndex(targetIndex, false, true);
          sidebar.classList.remove('open');
        }
      });
      btn.dataset.sectionId = section.id;
      sectionList.appendChild(btn);
    });
  }

  function updateSidebarHighlight() {
    const para = currentParagraph();
    if (!para) return;
    document.querySelectorAll('.section-link').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.sectionId === para.sectionId);
    });
  }

  function render() {
    const para = currentParagraph();
    if (!para) return;

    const prev = state.flatParagraphs[state.currentIndex - 1];
    const next = state.flatParagraphs[state.currentIndex + 1];

    safeTextContent(nowReading, `Section ${para.sectionId} · Paragraph ${para.paragraphIndex + 1}`);
    safeTextContent(
      heroMeta,
      `SECTION ${para.sectionId} · Paragraph ${para.paragraphIndex + 1} of ${para.paragraphCountInSection}`
    );
    safeTextContent(sectionTitle, para.sectionTitle);
    safeTextContent(paragraphText, para.text);
    safeTextContent(paragraphRange, `${formatTime(para.start)} – ${formatTime(para.end)}`);

    const showContext = !revealToggle.checked;
    document.getElementById('prevCard').style.display = showContext ? '' : 'none';
    document.getElementById('nextCard').style.display = showContext ? '' : 'none';

    safeTextContent(prevText, prev ? prev.text : '—');
    safeTextContent(nextText, next ? next.text : '—');

    updateSidebarHighlight();
    updateProgress();
  }

  function updateProgress() {
    const current = audio.currentTime || 0;
    const duration = audio.duration || BOOK_DATA.chapterDuration || 0;
    const pct = duration > 0 ? (current / duration) * 100 : 0;
    progressBar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    progressText.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  }

  function seekTo(seconds, autoplay) {
    state.suppressTimeUpdate = true;
    audio.currentTime = Math.max(0, seconds || 0);
    setTimeout(() => {
      state.suppressTimeUpdate = false;
      syncIndexToTime(audio.currentTime);
      render();
      if (autoplay) {
        audio.play().catch(() => {
          playBtn.textContent = 'Play';
        });
      }
    }, 30);
  }

  function goToIndex(index, autoplay, seekAudio = true) {
    const clamped = Math.max(0, Math.min(index, state.flatParagraphs.length - 1));
    state.currentIndex = clamped;
    const para = currentParagraph();
    render();
    if (seekAudio && para) {
      seekTo(para.start, autoplay);
    } else if (autoplay) {
      audio.play().catch(() => {
        playBtn.textContent = 'Play';
      });
    }
  }

  function playCurrent() {
    audio.play().then(() => {
      playBtn.textContent = 'Pause';
    }).catch((err) => {
      console.warn(err);
    });
  }

  function pauseCurrent() {
    audio.pause();
    playBtn.textContent = 'Play';
  }

  function nextParagraph(autoplay) {
    if (state.currentIndex < state.flatParagraphs.length - 1) {
      goToIndex(state.currentIndex + 1, autoplay, true);
    } else {
      pauseCurrent();
    }
  }

  function prevParagraph(autoplay) {
    const para = currentParagraph();
    if (!para) return;
    if ((audio.currentTime - para.start) > 2) {
      seekTo(para.start, autoplay && !audio.paused);
      return;
    }
    if (state.currentIndex > 0) {
      goToIndex(state.currentIndex - 1, autoplay, true);
    } else {
      seekTo(0, autoplay && !audio.paused);
    }
  }

  function syncIndexToTime(time) {
    const paragraphs = state.flatParagraphs;
    if (!paragraphs.length) return;

    const current = currentParagraph();
    if (current && time >= current.start && time < current.end) return;

    let low = 0;
    let high = paragraphs.length - 1;
    let found = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const para = paragraphs[mid];
      if (time < para.start) {
        high = mid - 1;
      } else if (time >= para.end) {
        low = mid + 1;
        found = Math.min(mid + 1, paragraphs.length - 1);
      } else {
        found = mid;
        break;
      }
    }

    if (found !== state.currentIndex) {
      state.currentIndex = found;
      render();
    }
  }

  function bindEvents() {
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        playCurrent();
      } else {
        pauseCurrent();
      }
    });

    prevBtn.addEventListener('click', () => prevParagraph(!audio.paused));
    nextBtn.addEventListener('click', () => nextParagraph(!audio.paused));
    restartBtn.addEventListener('click', () => {
      const para = currentParagraph();
      if (!para) return;
      seekTo(para.start, !audio.paused);
    });

    revealToggle.addEventListener('change', render);
    menuButton.addEventListener('click', () => sidebar.classList.toggle('open'));
    themeButton.addEventListener('click', () => document.body.classList.toggle('dark'));

    audio.addEventListener('timeupdate', () => {
      if (state.suppressTimeUpdate) return;
      updateProgress();
      syncIndexToTime(audio.currentTime);

      if (!autoplayToggle.checked) {
        const para = currentParagraph();
        if (para && audio.currentTime >= para.end) {
          pauseCurrent();
          audio.currentTime = para.end;
          updateProgress();
        }
      }
    });

    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('play', () => playBtn.textContent = 'Pause');
    audio.addEventListener('pause', () => playBtn.textContent = 'Play');
    audio.addEventListener('ended', () => {
      playBtn.textContent = 'Play';
    });

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (audio.paused) playCurrent(); else pauseCurrent();
      } else if (e.code === 'ArrowRight') {
        nextParagraph(!audio.paused);
      } else if (e.code === 'ArrowLeft') {
        prevParagraph(!audio.paused);
      }
    });
  }

  function validateTimingData() {
    const missing = state.flatParagraphs.some((p) => !Number.isFinite(p.start) || !Number.isFinite(p.end));
    if (missing) {
      paragraphText.textContent = 'Timing data is missing. Run tools/generate_xtts_audio.py first.';
      return false;
    }
    return true;
  }

  function init() {
    if (!window.BOOK_DATA) {
      paragraphText.textContent = 'BOOK_DATA is missing.';
      return;
    }

    state.flatParagraphs = flattenBook(BOOK_DATA);
    if (!state.flatParagraphs.length) {
      paragraphText.textContent = 'No paragraphs found.';
      return;
    }
    if (!validateTimingData()) return;

    bookTitle.textContent = BOOK_DATA.title;
    bookMeta.textContent = `${BOOK_DATA.fullTitle} · ${BOOK_DATA.sections.length} sections`;

    audio.src = BOOK_DATA.chapterAudio;
    audio.load();

    renderSidebar();
    bindEvents();
    render();
  }

  init();
})();
