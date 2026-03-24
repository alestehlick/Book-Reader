:root {
  --bg: #f5f1e8;
  --panel: rgba(255,255,255,0.72);
  --panel-strong: rgba(255,255,255,0.88);
  --text: #231c13;
  --muted: #6b6256;
  --line: rgba(35, 28, 19, 0.12);
  --accent: #7a5a2b;
  --accent-soft: rgba(122, 90, 43, 0.12);
  --shadow: 0 20px 60px rgba(53, 40, 18, 0.10);
  --radius-xl: 28px;
  --radius-lg: 22px;
  --radius-md: 16px;
  --font-serif: "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif;
  --font-ui: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
}

body.dark {
  --bg: #14110d;
  --panel: rgba(30, 26, 21, 0.78);
  --panel-strong: rgba(35, 30, 24, 0.9);
  --text: #f4eee4;
  --muted: #b9aa95;
  --line: rgba(244, 238, 228, 0.10);
  --accent: #d8b37a;
  --accent-soft: rgba(216, 179, 122, 0.16);
  --shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
}

* { box-sizing: border-box; }
html, body { height: 100%; }
body {
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(122, 90, 43, 0.08), transparent 30%),
    radial-gradient(circle at bottom right, rgba(122, 90, 43, 0.06), transparent 26%),
    var(--bg);
  color: var(--text);
  font-family: var(--font-ui);
}

button, input { font: inherit; }
button { cursor: pointer; }

.app-shell {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  min-height: 100dvh;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100dvh;
  overflow: auto;
  padding: max(24px, env(safe-area-inset-top)) 20px 24px 24px;
  background: var(--panel);
  backdrop-filter: blur(22px);
  border-right: 1px solid var(--line);
}

.sidebar-head {
  padding: 14px 10px 22px;
  border-bottom: 1px solid var(--line);
}

.eyebrow,
.block-title,
.now-reading-label,
.paragraph-label,
.context-label,
.hero-meta,
.progress-text {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 12px;
  color: var(--muted);
}

.sidebar h1 {
  margin: 8px 0 8px;
  font-size: 28px;
  line-height: 1.14;
  font-family: var(--font-serif);
  font-weight: 600;
}

.sidebar-sub {
  margin: 0;
  color: var(--muted);
  line-height: 1.45;
}

.sidebar-block {
  padding: 20px 10px 0;
}

.section-list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.section-link {
  width: 100%;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--text);
  border-radius: 16px;
  padding: 12px 14px;
  text-align: left;
  transition: 160ms ease;
}

.section-link .sec-id {
  display: inline-block;
  margin-bottom: 4px;
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.06em;
}

.section-link .sec-title {
  display: block;
  line-height: 1.35;
}

.section-link.active,
.section-link:hover {
  transform: translateY(-1px);
  background: var(--accent-soft);
  border-color: transparent;
}

.reader {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 18px;
  padding: max(18px, env(safe-area-inset-top)) 18px max(18px, env(safe-area-inset-bottom)) 18px;
}

.topbar,
.hero-card,
.paragraph-card,
.context-card,
.controls-card {
  background: var(--panel-strong);
  backdrop-filter: blur(18px);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
}

.topbar {
  border-radius: var(--radius-lg);
  padding: 12px 14px;
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
}

.ghost {
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 26px;
  border-radius: 14px;
  min-height: 44px;
}

.topbar-center {
  text-align: center;
}

.now-reading {
  font-size: 14px;
  margin-top: 4px;
}

.hero-card {
  border-radius: var(--radius-xl);
  padding: 22px 24px 20px;
}

.hero-title {
  margin: 6px 0 14px;
  font-family: var(--font-serif);
  font-size: clamp(28px, 5vw, 44px);
  line-height: 1.08;
  font-weight: 600;
}


.paragraph-range {
  margin: -4px 0 14px;
  color: var(--muted);
  font-size: 14px;
  letter-spacing: 0.02em;
}

.progress-wrap {
  display: grid;
  gap: 8px;
}

.progress-track {
  width: 100%;
  height: 10px;
  background: rgba(127, 127, 127, 0.18);
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  width: 0%;
  height: 100%;
  background: var(--accent);
  border-radius: 999px;
}

.text-stage {
  display: grid;
  gap: 18px;
  align-content: start;
}

.paragraph-card {
  border-radius: var(--radius-xl);
  padding: 28px 24px;
  min-height: 34dvh;
  display: grid;
  align-content: center;
}

.paragraph-text {
  margin: 12px 0 0;
  font-family: var(--font-serif);
  font-size: clamp(26px, 4.5vw, 38px);
  line-height: 1.58;
  letter-spacing: 0.01em;
}

.context-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.context-card {
  border-radius: var(--radius-lg);
  padding: 18px 18px 20px;
}

.context-card p {
  margin: 10px 0 0;
  font-family: var(--font-serif);
  font-size: 20px;
  line-height: 1.55;
}

.dim {
  opacity: 0.62;
}

.controls-card {
  border-radius: var(--radius-xl);
  padding: 18px;
  display: grid;
  gap: 14px;
}

.main-controls,
.sub-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.control,
.pill {
  border: none;
  min-height: 48px;
  border-radius: 999px;
  padding: 0 20px;
}

.primary {
  background: var(--accent);
  color: #fffdf8;
  font-weight: 600;
}

.secondary,
.pill {
  background: var(--accent-soft);
  color: var(--text);
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 6px;
  color: var(--muted);
}

.toggle input {
  width: 20px;
  height: 20px;
}

@media (max-width: 980px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(88vw, 360px);
    transform: translateX(-102%);
    transition: transform 180ms ease;
    z-index: 30;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .reader {
    padding-top: max(18px, env(safe-area-inset-top));
  }

  .context-row {
    grid-template-columns: 1fr;
  }
}
