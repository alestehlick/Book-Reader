(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const chapterId = document.documentElement.dataset.chapter || "ch01";
  const themeButton = byId("theme-button");
  const themeKey = `ancient-japan-${chapterId}-theme`;
  function setTheme(theme) {
    const dark = theme !== "light";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.title = dark ? "Switch to light theme" : "Switch to dark theme";
  }
  try {
    setTheme(localStorage.getItem(themeKey));
  } catch {
    setTheme("dark");
  }
  themeButton.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(theme);
    try {
      localStorage.setItem(themeKey, theme);
    } catch {
      // The theme can still be changed for this visit.
    }
  });

  const chapter = byId("chapter");
  const book = window.BOOK_DATA;
  const guide = window.CHAPTER_GUIDE;
  if (!book?.sections?.length || !guide) {
    const fallback = document.createElement("a");
    fallback.href = `${chapterId}-data.json`;
    fallback.textContent = "Open the chapter text";
    chapter.append(fallback);
    return;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function externalLink(url, label) {
    const link = element("a", "", label);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    return link;
  }

  const maps = new Map(book.catalogs.maps.map((map) => [map.id, map]));
  const illustrations = new Map(book.catalogs.illustrations.map((image) => [image.id, image]));
  const stops = new Map(guide.maps.map((stop) => [stop.id, stop]));
  const sectionHeading = new Map();
  const sectionMapIds = new Map();
  const passageNodes = [];
  const atlasDialog = byId("atlas-dialog");
  const contentsDialog = byId("contents-dialog");
  const imageDialog = byId("image-dialog");

  function showDialog(dialog) {
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-open");
  }

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("close", () => {
      if (!document.querySelector("dialog[open]")) document.body.classList.remove("dialog-open");
    });
    dialog.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-dialog]")) dialog.close();
    });
    dialog.addEventListener("pointerdown", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });

  byId("contents-button").addEventListener("click", () => showDialog(contentsDialog));
  contentsDialog.addEventListener("click", (event) => {
    if (event.target.closest("a[href^='#']")) contentsDialog.close();
  });

  function renderMap(map) {
    const figure = element("figure", "plate");
    const button = element("button", "plate-button");
    button.type = "button";
    button.dataset.openAtlas = map.id;
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-label", `Explore map: ${map.title}`);
    const thumbnail = element("img");
    thumbnail.src = map.fallback;
    thumbnail.alt = map.alt;
    thumbnail.loading = "lazy";
    thumbnail.decoding = "async";
    const action = element("span", "plate-open", "Explore map ↗");
    action.setAttribute("aria-hidden", "true");
    button.append(thumbnail, action);
    const caption = element("figcaption", "plate-legend");
    caption.append(element("strong", "", map.title), element("small", "", map.subtitle));
    figure.append(button, caption);
    return figure;
  }

  function renderImage(image) {
    const objectPhoto = image.historicalStatus === "artifact-photo";
    const figure = element("figure", objectPhoto ? "editorial-image object-photo" : "editorial-image");
    const button = element("button", "image-button");
    button.type = "button";
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-label", `Enlarge illustration: ${image.alt}`);
    const img = element("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";
    img.decoding = "async";
    const size = guide.imageSizes[image.id];
    if (size) {
      img.width = size[0];
      img.height = size[1];
    }
    button.append(img);
    const caption = element("figcaption", "fig-caption", image.caption);
    if (image.credit && image.sourceUrl) {
      caption.append(document.createTextNode(" "), externalLink(image.sourceUrl, image.credit));
    }
    button.addEventListener("click", () => {
      const enlarged = byId("enlarged-image");
      enlarged.src = image.src;
      enlarged.alt = image.alt;
      const enlargedCaption = byId("enlarged-caption");
      enlargedCaption.replaceChildren(...Array.from(caption.childNodes, (child) => child.cloneNode(true)));
      showDialog(imageDialog);
    });
    figure.append(button, caption);
    return figure;
  }

  function renderStudyNotes() {
    const details = element("details", "sources");
    details.id = "sources";
    details.append(element("summary", "", "Sources and image credits"));
    const content = element("div", "sources-inner");
    content.append(element("p", "", guide.sourceIntro));
    const list = element("ul");
    for (const [section, label, url] of guide.sources) {
      const item = element("li");
      if (section) item.append(document.createTextNode(`${section} · `));
      item.append(externalLink(url, label));
      list.append(item);
    }
    content.append(list);
    details.append(content);
    return details;
  }

  const year = (value) => Number(value) < 0
    ? `${Math.abs(Number(value)).toLocaleString("en-US")} BC`
    : `AD ${Number(value).toLocaleString("en-US")}`;

  function renderTimeline() {
    const details = element("details", "sources reference-details");
    details.append(element("summary", "", "Chronology and relationships"));
    const container = element("div", "sources-inner");
    const timeline = new Map(book.catalogs.timeline.map((entry) => [entry.id, entry]));
    for (const section of book.sections) {
      const entries = new Set(section.paragraphs.flatMap((paragraph) => paragraph.timelineRefs || []));
      if (!entries.size) continue;
      container.append(element("h3", "", section.title));
      const list = element("dl", "chronology-list");
      for (const entryId of entries) {
        const entry = timeline.get(entryId);
        if (!entry) continue;
        const estimate = entry.certainty === "approximate" ? "About " : "";
        const dates = entry.display_date || estimate + (String(entry.start) === String(entry.end)
          ? year(entry.start)
          : `${year(entry.start)} to ${year(entry.end)}`);
        list.append(element("dt", "", `${entry.label} · ${dates}`), element("dd", "", entry.caption));
      }
      container.append(list);
    }
    const relationLabels = {
      "siblings": "is a sibling of",
      "adviser-to": "assists in governing with",
      "successor-to": "succeeded",
      "same-clan": "belonged to the same clan as",
      "ancestor-of": "is a traditional ancestor of",
      "mother-of": "is the mother of",
      "father-of": "is the father of",
      "spouse-of": "is a consort of",
      "traditional-predecessor-to": "precedes in the traditional line",
      "received-dynastic-predecessor-of": "precedes in the received dynastic line",
      "traditional-ancestor-of": "is a traditional ancestor of",
    };
    for (const tree of book.genealogy?.trees || []) {
      container.append(element("h3", "", tree.title), element("p", "", tree.caption));
      const nodes = new Map(tree.nodes.map((node) => [node.id, node.name]));
      const list = element("ul");
      for (const edge of tree.edges) {
        const relation = relationLabels[edge.relation];
        if (relation) list.append(element("li", "", `${nodes.get(edge.from)} ${relation} ${nodes.get(edge.to)}.`));
      }
      container.append(list);
    }
    details.append(container);
    return details;
  }

  for (const [index, section] of book.sections.entries()) {
    const sectionNode = element("section", "chapter-section");
    sectionNode.id = `section-${section.id}`;
    const heading = element("header", "section-heading");
    const title = element("h2", "", section.title);
    title.id = `title-${section.id}`;
    heading.append(element("p", "section-where", guide.sections[section.id]), title);
    sectionNode.setAttribute("aria-labelledby", title.id);
    sectionNode.append(heading);
    sectionHeading.set(section.id, heading);
    const firstMap = section.paragraphs.flatMap((paragraph) => paragraph.mapRefs || [])[0];
    if (firstMap) sectionMapIds.set(section.id, firstMap);

    for (const navId of ["chapter-contents", "mobile-contents"]) {
      const link = element("a", "contents-link", section.title);
      link.href = `#${sectionNode.id}`;
      link.dataset.section = section.id;
      if (index === 0) link.setAttribute("aria-current", "location");
      byId(navId).append(link);
    }
    for (const passage of section.paragraphs) {
      const node = element("div", "passage");
      node.id = passage.id;
      node.append(element("p", "", passage.text));
      sectionNode.append(node);
      passageNodes.push({ node, id: passage.id, title: section.title, sectionId: section.id });
      for (const mapRef of passage.mapRefs || []) {
        const map = maps.get(mapRef);
        if (map) sectionNode.append(renderMap(map));
      }
      for (const ref of passage.illustrationRefs || []) {
        const image = illustrations.get(ref.id);
        if (image && ref.id !== guide.cover) sectionNode.append(renderImage(image));
      }
    }
    chapter.append(sectionNode);
  }

  if (guide.next) {
    const next = element("a", "read-next");
    next.href = guide.next.href;
    const nextText = element("span");
    nextText.append(element("span", "sidebar-label", guide.next.label), element("strong", "", guide.next.title));
    const nextArrow = element("span", "", "→");
    nextArrow.setAttribute("aria-hidden", "true");
    next.append(nextText, nextArrow);
    chapter.append(next);
  }
  chapter.append(renderStudyNotes(), renderTimeline());

  const tileNode = byId("atlas-map");
  const fallbackMap = byId("atlas-fallback");
  const atlasReset = byId("atlas-reset");
  const placeSummary = byId("atlas-place");
  const atlasSelect = byId("atlas-select");
  const atlasList = byId("atlas-list");
  const places = byId("atlas-places");
  let currentStop = guide.maps[0];
  let terrain = null;
  let tiles = null;
  let focusMarker = null;
  let mapResetZoom = 3;
  let mapVersion = 0;

  function dialogMapBounds(map) {
    const [[west, south], [east, north]] = map.view.bounds;
    return [[south, west], [north, east]];
  }

  function openMapSite(event) {
    const threshold = window.matchMedia("(pointer: coarse)").matches ? 17 : 13;
    let selected = null;
    let distance = threshold;
    for (const site of currentStop.sites) {
      if (site.rank > 2 && terrain.getZoom() < 7) continue;
      const point = terrain.latLngToContainerPoint([site.lat, site.lon]);
      const gap = point.distanceTo(event.containerPoint);
      if (gap < distance) {
        distance = gap;
        selected = site;
      }
    }
    if (!selected) return;
    const card = element("div", "atlas-site");
    card.append(element("strong", "", selected.name), element("p", "", selected.note));
    L.popup({ maxWidth: 265 }).setLatLng([selected.lat, selected.lon]).setContent(card).openOn(terrain);
  }

  function renderTerrain() {
    const map = maps.get(currentStop.id);
    const version = ++mapVersion;
    const showFallback = () => {
      fallbackMap.src = map.fallback;
      fallbackMap.alt = map.alt;
      fallbackMap.hidden = false;
      tileNode.hidden = true;
      atlasReset.hidden = true;
    };
    if (!window.L || !map.localSceneTiles) {
      showFallback();
      return;
    }
    fallbackMap.hidden = true;
    tileNode.hidden = false;
    atlasReset.hidden = false;
    if (!terrain) {
      terrain = L.map(tileNode, {
        fadeAnimation: false,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        minZoom: 3,
        maxZoom: 9,
        scrollWheelZoom: false,
        attributionControl: true,
        worldCopyJump: false,
      });
      terrain.attributionControl.setPrefix(false);
      L.control.scale({ imperial: false, position: "bottomright" }).addTo(terrain);
      terrain.on("click", openMapSite);
    }
    terrain.closePopup();
    if (tiles) terrain.removeLayer(tiles);
    if (focusMarker) {
      terrain.removeLayer(focusMarker);
      focusMarker = null;
    }
    const [west, south, east, north] = map.renderBounds;
    const area = [[south, west], [north, east]];
    terrain.stop();
    terrain.setMinZoom(map.view.minZoom);
    terrain.setMaxZoom(map.view.maxZoom);
    terrain.setMaxBounds(L.latLngBounds(area).pad(0.11));
    terrain.invalidateSize({ pan: false });
    terrain.fitBounds(dialogMapBounds(map), { animate: false, padding: [13, 13] });
    mapResetZoom = terrain.getZoom();
    terrain.setMinZoom(Math.max(map.view.minZoom, mapResetZoom - 0.75));
    let loadedAny = false;
    let failedAny = false;
    tiles = L.tileLayer(map.localSceneTiles, {
      tileSize: 256,
      minNativeZoom: 3,
      maxNativeZoom: 9,
      bounds: area,
      noWrap: true,
      attribution: "Ancient Japan Study Atlas · QGIS",
    });
    tiles.on("tileload", () => {
      loadedAny = true;
    });
    tiles.on("tileerror", () => {
      failedAny = true;
    });
    tiles.on("load", () => {
      if (version === mapVersion && failedAny && !loadedAny) showFallback();
    });
    tiles.addTo(terrain);
  }

  function showPlace(place, button) {
    for (const choice of places.querySelectorAll("button")) {
      choice.setAttribute("aria-pressed", String(choice === button));
    }
    placeSummary.textContent = place.note;
    placeSummary.hidden = false;
    if (!terrain || tileNode.hidden) return;
    if (focusMarker) terrain.removeLayer(focusMarker);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (place.outline) {
      focusMarker = L.geoJSON(place.outline, {
        interactive: false,
        style: { color: "#713b55", weight: 2.5, dashArray: "5 6", fillOpacity: 0.09 },
      }).addTo(terrain);
      terrain.fitBounds(place.bounds, { animate: !prefersReducedMotion, padding: [26, 26], maxZoom: 7.5 });
      return;
    }
    focusMarker = L.circleMarker([place.lat, place.lon], {
      radius: 13,
      color: "#803923",
      weight: 2,
      fillColor: "#fff4d1",
      fillOpacity: 0.18,
      interactive: false,
    }).addTo(terrain);
    terrain.setView([place.lat, place.lon], Math.min(8.5, Math.max(mapResetZoom, place.zoom)), {
      animate: !prefersReducedMotion,
    });
  }

  function selectStop(id) {
    currentStop = stops.get(id) || currentStop;
    const map = maps.get(currentStop.id);
    byId("atlas-title").textContent = map.title;
    byId("atlas-caption").textContent = map.caption;
    byId("atlas-evidence").textContent = map.evidence;
    byId("atlas-plate").href = map.fallback;
    tileNode.setAttribute("aria-label", map.alt);
    atlasSelect.value = currentStop.id;
    for (const button of atlasList.querySelectorAll("button")) {
      button.setAttribute("aria-pressed", String(button.dataset.id === currentStop.id));
    }
    placeSummary.hidden = true;
    places.replaceChildren();
    for (const place of currentStop.places) {
      const button = element("button", "place-button", place.name);
      button.type = "button";
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => showPlace(place, button));
      places.append(button);
    }
    renderTerrain();
  }

  for (const stop of guide.maps) {
    const title = maps.get(stop.id).title;
    const button = element("button", "atlas-tab");
    button.type = "button";
    button.dataset.id = stop.id;
    button.textContent = title;
    button.addEventListener("click", () => selectStop(stop.id));
    atlasList.append(button);
    const option = element("option", "", title);
    option.value = stop.id;
    atlasSelect.append(option);
  }
  atlasSelect.addEventListener("change", () => selectStop(atlasSelect.value));
  atlasReset.addEventListener("click", () => selectStop(currentStop.id));
  atlasDialog.addEventListener("close", () => {
    mapVersion += 1;
    if (terrain) {
      terrain.remove();
      terrain = null;
      tiles = null;
      focusMarker = null;
    }
  });
  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-open-atlas]");
    if (!opener) return;
    showDialog(atlasDialog);
    selectStop(opener.dataset.openAtlas || currentStop.id);
  });

  const audio = byId("narration");
  const listenPlayer = byId("listen-player");
  const listenButton = byId("listen-button");
  const play = byId("play-audio");
  const previous = byId("previous-audio");
  const advance = byId("next-audio");
  const audioLocation = byId("audio-location");
  const seek = byId("audio-seek");
  const audioTime = byId("audio-time");
  const audioStatus = byId("audio-status");
  const speed = byId("audio-speed");
  let audioIndex = -1;
  let speedValue = 1;
  let readingFrame = 0;
  const contentsLinks = Array.from(document.querySelectorAll(".contents-link"));

  function clock(seconds) {
    const time = Number.isFinite(seconds) ? Math.floor(seconds) : 0;
    return `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;
  }

  function updateAudioTime() {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    seek.disabled = duration === 0;
    seek.value = duration ? audio.currentTime / duration * 100 : 0;
    audioTime.textContent = `${clock(audio.currentTime)} / ${clock(duration)}`;
  }

  function followPassage() {
    const node = passageNodes[audioIndex]?.node;
    if (!node || document.querySelector("dialog[open]")) return;
    node.scrollIntoView({ block: "start" });
  }

  function showAudioStatus(message) {
    audioStatus.textContent = message;
    audioStatus.hidden = !message;
  }

  function playCurrent() {
    audio.play().catch((error) => {
      if (error.name === "AbortError") return;
      if (error.name === "NotAllowedError") {
        showAudioStatus("Press Play to start narration.");
        return;
      }
      showAudioStatus("This recording could not be played.");
    });
  }

  function selectAudio(index, { autoplay = false, follow = false } = {}) {
    if (index < 0 || index >= passageNodes.length) return;
    passageNodes[audioIndex]?.node.classList.remove("is-speaking");
    audioIndex = index;
    const passage = passageNodes[index];
    passage.node.classList.add("is-speaking");
    audio.src = `${guide.audioDir}/${passage.id}.mp3`;
    audio.playbackRate = speedValue;
    audioLocation.textContent = `${passage.title} · ${index + 1} of ${passageNodes.length}`;
    previous.disabled = audioIndex === 0;
    advance.disabled = audioIndex === passageNodes.length - 1;
    showAudioStatus("");
    updateAudioTime();
    if (follow) followPassage();
    if (autoplay) playCurrent();
  }

  function nearestReadingPassage() {
    const target = Math.min(220, window.innerHeight * 0.32);
    const readingIndex = passageNodes.findIndex(({ node }) => node.getBoundingClientRect().bottom > target);
    return readingIndex < 0 ? passageNodes.length - 1 : readingIndex;
  }

  listenButton.addEventListener("click", () => {
    listenPlayer.hidden = false;
    document.body.classList.add("audio-open");
    listenButton.setAttribute("aria-expanded", "true");
    if (audioIndex === -1) selectAudio(nearestReadingPassage(), { autoplay: true, follow: true });
    else if (audio.paused) playCurrent();
    play.focus({ preventScroll: true });
  });
  byId("close-audio").addEventListener("click", () => {
    audio.pause();
    listenPlayer.hidden = true;
    document.body.classList.remove("audio-open");
    listenButton.setAttribute("aria-expanded", "false");
    listenButton.focus({ preventScroll: true });
  });
  audioLocation.addEventListener("click", followPassage);
  play.addEventListener("click", () => {
    if (audio.paused) playCurrent();
    else audio.pause();
  });
  previous.addEventListener("click", () => selectAudio(audioIndex - 1, { autoplay: !audio.paused, follow: true }));
  advance.addEventListener("click", () => selectAudio(audioIndex + 1, { autoplay: !audio.paused, follow: true }));
  speed.addEventListener("change", () => {
    speedValue = Number(speed.value);
    audio.playbackRate = speedValue;
  });
  seek.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) audio.currentTime = Number(seek.value) / 100 * audio.duration;
  });
  for (const eventName of ["timeupdate", "loadedmetadata", "durationchange"]) {
    audio.addEventListener(eventName, updateAudioTime);
  }
  for (const eventName of ["play", "pause", "ended"]) {
    audio.addEventListener(eventName, () => {
      play.textContent = audio.paused ? "▶" : "Ⅱ";
      play.setAttribute("aria-label", audio.paused ? "Play narration" : "Pause narration");
    });
  }
  audio.addEventListener("ended", () => {
    if (audioIndex < passageNodes.length - 1) selectAudio(audioIndex + 1, { autoplay: true, follow: true });
  });
  audio.addEventListener("error", () => {
    showAudioStatus("This recording could not be loaded.");
  });

  function updateReadingProgress() {
    const rectangle = chapter.getBoundingClientRect();
    const extent = Math.max(1, rectangle.height - window.innerHeight * 0.86);
    const progress = Math.min(1, Math.max(0, (90 - rectangle.top) / extent));
    byId("reading-progress").style.transform = `scaleX(${progress})`;
    let current = book.sections[0].id;
    for (const [id, heading] of sectionHeading) {
      if (heading.getBoundingClientRect().top > 180) break;
      current = id;
    }
    for (const link of contentsLinks) {
      if (link.dataset.section === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
    const nearbyMap = maps.get(sectionMapIds.get(current));
    const sidebar = document.querySelector(".atlas-sidebar-button");
    if (sidebar && nearbyMap && sidebar.dataset.openAtlas !== nearbyMap.id) {
      sidebar.dataset.openAtlas = nearbyMap.id;
      sidebar.querySelector("img").src = nearbyMap.fallback;
      sidebar.querySelector("strong").textContent = nearbyMap.title;
    }
    readingFrame = 0;
  }

  const positionKey = `ancient-japan-${chapterId}-reading-passage`;
  function saveReadingPosition() {
    if (chapter.getBoundingClientRect().top > 200) return;
    try {
      localStorage.setItem(positionKey, passageNodes[nearestReadingPassage()].id);
    } catch {
      // Some browsers disable storage for local files.
    }
  }

  window.addEventListener("scroll", () => {
    if (!readingFrame) readingFrame = window.requestAnimationFrame(updateReadingProgress);
  }, { passive: true });

  function followAnchor() {
    const anchor = window.location.hash.slice(1);
    const target = byId(anchor);
    if (target?.id === "sources") target.open = true;
    if (target) target.scrollIntoView();
  }

  window.addEventListener("hashchange", followAnchor);
  window.addEventListener("pagehide", saveReadingPosition);
  if (window.location.hash) {
    window.requestAnimationFrame(followAnchor);
  } else {
    try {
      const saved = byId(localStorage.getItem(positionKey));
      const start = document.querySelector(".hero-read");
      if (saved?.classList.contains("passage") && saved !== passageNodes[0].node) {
        start.href = "#" + saved.id;
        start.firstChild.textContent = "Continue reading ";
      }
    } catch {
      // The full chapter is still available.
    }
  }
  updateReadingProgress();
})();
