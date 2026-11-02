/* ============================================
   CRAFTED LIVING — 3D MODERN THEME
   ============================================ */

:root {
  --bg: #0a0c0b;
  --surface: #141716;
  --surface2: #1c201e;
  --ink: #f2f3f0;
  --muted: #8a9490;
  --brand: #ff5b2e;
  --brand-ink: #fff;
  --accent: #ff7448;
  --line: #2a2f2c;
  --glass: rgba(20, 23, 22, 0.72);
  --serif: "Bricolage Grotesque", system-ui, sans-serif;
  --sans: "Manrope", system-ui, sans-serif;
  --danger: #e0553d;
  box-sizing: border-box;
}

@media (prefers-color-scheme: light) {
  :root {
    --bg: #f1f1ee;
    --surface: #fff;
    --surface2: #f5f5f2;
    --ink: #101312;
    --muted: #667069;
    --brand: #101312;
    --brand-ink: #fff;
    --accent: #ff5b2e;
    --line: #e0e1dc;
    --glass: rgba(255, 255, 255, 0.72);
  }
}

/* ---------- RESET ---------- */
*, *:before, *:after { box-sizing: inherit; }

html {
  scroll-behavior: smooth;
  scroll-padding-top: 90px;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font: 400 16px/1.6 var(--sans);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--serif);
  font-weight: 800;
  line-height: 1.05;
  margin: 0;
  letter-spacing: -0.035em;
}

button, input, select, textarea {
  font: inherit;
  color: inherit;
}

:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
  border-radius: 8px;
}

.hidden { display: none !important; }

.wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ---------- 3D SCENE CANVAS ---------- */
#scene3d {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.55;
}

#app { position: relative; z-index: 1; }

/* ---------- NAV ---------- */
nav {
  position: sticky;
  top: 12px;
  z-index: 50;
  margin: 0 16px;
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid var(--line);
  border-radius: 999px;
  transition: box-shadow 0.3s, transform 0.3s;
}

nav.scrolled { box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.5); }

nav .wrap {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 58px;
  padding: 0 10px 0 24px;
}

.logo {
  font: 800 22px var(--serif);
  margin-right: auto;
  letter-spacing: -0.04em;
}

nav a {
  color: var(--muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: color 0.2s;
}

nav a:hover { color: var(--ink); }

/* ---------- BUTTONS (3D PRESS) ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 999px;
  padding: 13px 26px;
  background: var(--brand);
  color: var(--brand-ink);
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25), 0 8px 24px -8px var(--accent);
  transform: translateY(0);
  will-change: transform;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.25), 0 12px 28px -8px var(--accent);
}

.btn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.25), 0 4px 12px -8px var(--accent);
}

.btn.accent { background: var(--accent); color: #fff; }

.btn.ghost {
  background: transparent;
  color: var(--ink);
  border: 1.5px solid var(--line);
  box-shadow: none;
}

.btn.ghost:hover { background: var(--surface); }

.btn.sm { padding: 7px 16px; font-size: 14px; }

.btn.danger {
  background: var(--danger);
  color: #fff;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
}

.btn[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* ---------- AUTH ---------- */
#auth {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  position: relative;
  z-index: 1;
}

.auth-art {
  background:
    radial-gradient(circle at 20% 15%, #ff7448 0, transparent 42%),
    radial-gradient(circle at 90% 90%, #3b4bff55 0, transparent 45%),
    radial-gradient(circle at 50% 50%, #ff5b2e22 0, transparent 60%),
    #0a0c0b;
  color: #fff;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  perspective: 1000px;
}

.auth-art::after {
  content: "";
  position: absolute;
  inset: -50%;
  background: conic-gradient(from 0deg, transparent, #ff5b2e11, transparent, #ff744811, transparent);
  animation: spin 20s linear infinite;
  pointer-events: none;
}

@keyframes spin { to { transform: rotate(360deg); } }

.auth-art b {
  font: 800 22px var(--serif);
  position: relative;
  z-index: 1;
}

.auth-art h1 {
  font-size: clamp(40px, 5vw, 68px);
  letter-spacing: -0.045em;
  position: relative;
  z-index: 1;
}

.auth-art p {
  max-width: 38ch;
  color: #c9d6d0;
  position: relative;
  z-index: 1;
}

.chairs {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  position: relative;
  z-index: 1;
}

.chairs i {
  display: block;
  width: 44px;
  border-radius: 8px 8px 3px 3px;
  background: linear-gradient(180deg, #ff7448, #ff5b2e);
  box-shadow: 0 8px 20px -6px #ff5b2e88, inset 0 1px 0 #fff3;
  transform: translateZ(20px);
  transition: transform 0.3s;
}

.chairs i:nth-child(1) { animation: float 4s ease-in-out infinite; }
.chairs i:nth-child(2) { animation: float 4s ease-in-out infinite 0.5s; }
.chairs i:nth-child(3) { animation: float 4s ease-in-out infinite 1s; }
.chairs i:nth-child(4) { animation: float 4s ease-in-out infinite 1.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.auth-box {
  display: grid;
  place-content: center;
  padding: 32px;
  position: relative;
  z-index: 1;
}

/* ---------- CARD ---------- */
.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 28px;
  padding: 28px;
  width: min(440px, 100%);
  box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 32px 56px -24px rgba(0, 0, 0, 0.5);
}

/* ---------- TABS ---------- */
.tabs {
  display: flex;
  gap: 4px;
  background: var(--bg);
  padding: 4px;
  border-radius: 999px;
  margin-bottom: 22px;
}

.tabs button {
  flex: 1;
  border: 0;
  background: none;
  padding: 10px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  color: var(--muted);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.tabs button[aria-selected="true"] {
  background: var(--surface);
  color: var(--ink);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* ---------- FORMS ---------- */
label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  margin: 14px 0 6px;
}

input, select, textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  background: var(--bg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus, select:focus, textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent);
  outline: none;
}

textarea { min-height: 90px; resize: vertical; }

.msg {
  color: var(--danger);
  font-size: 14px;
  min-height: 20px;
  margin: 10px 0 0;
}

.card .btn { width: 100%; margin-top: 14px; }

/* ---------- HERO ---------- */
.hero2 { padding: 72px 0 32px; perspective: 1200px; }

.hero2 h1 {
  font-size: clamp(48px, 10.5vw, 148px);
  letter-spacing: -0.055em;
  line-height: 0.88;
  max-width: 12ch;
  font-weight: 800;
}

.hero2 h1 span {
  display: inline-block;
  background: linear-gradient(135deg, #ff5b2e, #ff7448);
  color: #fff;
  border-radius: 0.18em;
  padding: 0 0.14em;
  transform: rotate(-2deg);
  box-shadow:
    0 1px 0 #b33d1a, 0 2px 0 #b33d1a, 0 3px 0 #b33d1a,
    0 4px 0 #b33d1a, 0 5px 0 #b33d1a, 0 6px 0 #b33d1a,
    0 7px 0 #b33d1a, 0 20px 30px rgba(0, 0, 0, 0.4);
  animation: pop 0.8s cubic-bezier(0.2, 1.4, 0.4, 1) both;
  transform-style: preserve-3d;
}

@keyframes pop {
  from { transform: scale(0.5) rotate(-12deg) translateZ(-80px); opacity: 0; }
}

.hero2 .sub {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
}

.hero2 p {
  margin: 0;
  color: var(--muted);
  max-width: 44ch;
  font-size: 19px;
}

/* ---------- BENTO ---------- */
.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 150px;
  gap: 16px;
  margin: 48px 0 12px;
  perspective: 1400px;
}

.bento div {
  border-radius: 28px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #fff;
  font: 800 22px/1.1 var(--serif);
  letter-spacing: -0.03em;
  overflow: hidden;
  position: relative;
  box-shadow: 0 18px 32px -16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: transform 0.2s ease-out;
  transform-style: preserve-3d;
  will-change: transform;
  cursor: default;
}

.bento div:hover {
  box-shadow: 0 24px 44px -16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.bento small {
  font: 500 14px var(--sans);
  opacity: 0.85;
  letter-spacing: 0;
  margin-top: 6px;
}

.b1 {
  grid-column: span 2;
  grid-row: span 2;
  background: linear-gradient(160deg, #9a6a3d, #3f2a1b);
}

.b1::after {
  content: "";
  position: absolute;
  right: -40px;
  top: -40px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: #ffffff1a;
  filter: blur(2px);
}

.b2 { background: linear-gradient(160deg, #ff5b2e, #d63d12); }
.b3 { background: linear-gradient(160deg, #2b3a35, #141f1a); }
.b4 { grid-column: span 2; background: linear-gradient(120deg, #3b4bff, #1b1f6b); }

/* ---------- MARQUEE ---------- */
.marquee {
  overflow: hidden;
  border-block: 1px solid var(--line);
  padding: 18px 0;
  margin: 32px 0 0;
  white-space: nowrap;
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
}

.marquee div {
  display: inline-block;
  animation: slide 28s linear infinite;
  font: 800 28px var(--serif);
  letter-spacing: -0.03em;
}

.marquee span { margin: 0 22px; color: var(--muted); }
.marquee b { color: var(--accent); }

@keyframes slide { to { transform: translateX(-50%); } }

/* ---------- SECTIONS ---------- */
section { padding: 56px 0; }

.sec-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 28px;
}

.sec-head h2 { font-size: clamp(32px, 4vw, 48px); }

/* ---------- CHIPS ---------- */
.chips { display: flex; gap: 8px; flex-wrap: wrap; }

.chip {
  border: 1.5px solid var(--line);
  background: var(--surface);
  border-radius: 999px;
  padding: 9px 18px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
}

.chip:hover { transform: translateY(-1px); }

.chip[aria-pressed="true"] {
  background: var(--ink);
  color: var(--bg);
  border-color: var(--ink);
}

/* ---------- PRODUCT GRID (3D CARDS) ---------- */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 22px;
  perspective: 1200px;
}

.item {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: relative;
  transition: transform 0.25s ease-out, box-shadow 0.25s;
  transform-style: preserve-3d;
  will-change: transform;
  box-shadow: 0 12px 32px -16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  cursor: pointer;
}

.item:hover {
  box-shadow: 0 28px 48px -20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.item::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
  background: radial-gradient(
    circle at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--accent) 20%, transparent),
    transparent 50%
  );
}

.item:hover::after { opacity: 1; }

.thumb {
  aspect-ratio: 1/1;
  background-size: cover;
  background-position: center;
  position: relative;
  display: grid;
  place-items: center;
  font: 800 80px var(--serif);
  color: #ffffff90;
  border-radius: 22px;
  transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
  transform: translateZ(20px);
}

.item:hover .thumb { transform: scale(1.04) translateZ(30px); }

.tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ffffffdc;
  color: #101312;
  font: 800 11px var(--sans);
  padding: 5px 12px;
  border-radius: 999px;
  backdrop-filter: blur(6px);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.tag.wait { background: var(--danger); color: #fff; }
.tag.pre { background: var(--accent); color: #fff; }

.fav {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 0;
  background: #ffffffdc;
  color: #9aa0a6;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;
  backdrop-filter: blur(6px);
}

.fav[aria-pressed="true"] { color: #e0245e; }
.fav:hover { transform: scale(1.15); }

.item .body {
  padding: 16px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.item h3 { font-size: 22px; letter-spacing: -0.03em; }
.item small { color: var(--muted); font-size: 13px; }

.price {
  font-weight: 800;
  font-size: 20px;
  margin-top: auto;
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty {
  grid-column: 1/-1;
  text-align: center;
  color: var(--muted);
  padding: 56px;
  border: 1.5px dashed var(--line);
  border-radius: 28px;
}

/* ---------- SPLIT ---------- */
.split {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 36px;
  align-items: start;
}

.split .card { width: 100%; }
.split .card:hover { transform: none; }

.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.preview {
  margin-top: 12px;
  border-radius: 14px;
  max-height: 200px;
  object-fit: cover;
  width: 100%;
}

/* ---------- ADMIN ---------- */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 16px;
  margin-bottom: 0;
}

.stat {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 20px 22px;
  box-shadow: 0 12px 28px -16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: transform 0.2s ease-out;
  transform-style: preserve-3d;
}

.stat:hover { transform: translateY(-2px); }
.stat span { color: var(--muted); font-size: 14px; }

.stat b {
  display: block;
  font: 800 34px var(--serif);
  letter-spacing: -0.04em;
  margin-top: 4px;
}

.pos { color: #2a9d6a; }
.neg { color: var(--danger); }

.scroll { overflow-x: auto; }

table { width: 100%; border-collapse: collapse; font-size: 14px; }

th, td {
  text-align: left;
  padding: 12px 12px;
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
}

td img { width: 56px; height: 42px; object-fit: cover; border-radius: 10px; }

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.admin-grid .card { width: 100%; }

footer {
  padding: 40px 0;
  color: var(--muted);
  font-size: 14px;
  border-top: 1px solid var(--line);
  position: relative;
  z-index: 1;
}

/* ---------- TOAST ---------- */
#toast {
  position: fixed;
  left: 50%;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%) translateY(0);
  background: var(--ink);
  color: var(--bg);
  padding: 12px 22px;
  border-radius: 999px;
  font-weight: 700;
  z-index: 100;
  box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.5);
  animation: toastIn 0.4s cubic-bezier(0.2, 1.4, 0.4, 1) both;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.9); }
}

/* ---------- ROLE ---------- */
.role-badge {
  font: 800 12px var(--sans);
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
}

body.is-owner .role-badge { background: var(--ink); color: var(--bg); }
body.is-owner .cust-only { display: none !important; }
body.is-owner #app { display: flex; flex-direction: column; }
body.is-owner nav { order: -2; }
body.is-owner #shop { display: none; }

/* ---------- MINI ---------- */
.mini {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.mini span { flex: 1; font-size: 14px; }
.mini img { width: 48px; height: 40px; object-fit: cover; border-radius: 10px; }

.pill {
  font: 800 12px var(--sans);
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
}

.note { color: var(--muted); font-size: 14px; margin: 8px 0 0; }
.st { width: auto; padding: 7px 12px; border-radius: 12px; }

/* ---------- P&L ---------- */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  font-size: 13px;
  color: var(--muted);
  margin-top: 8px;
}

.legend i {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 4px;
  margin-right: 6px;
  vertical-align: -1px;
}

.legend i.ln {
  height: 3px;
  background: var(--ink);
  border-radius: 2px;
  vertical-align: 3px;
}

#pl-sum .stat b { font-size: 28px; }

#pl-chart svg { width: 100%; min-width: 560px; height: auto; display: block; }

.kind {
  font: 800 11px var(--sans);
  padding: 3px 9px;
  border-radius: 999px;
  color: #fff;
  letter-spacing: 0.02em;
}

.k-s { background: #2a9d6a; }
.k-e { background: #e0553d; }

/* ---------- QTY ---------- */
.qty { display: inline-flex; align-items: center; gap: 8px; }

.qty button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1.5px solid var(--line);
  background: var(--surface);
  cursor: pointer;
  font-weight: 800;
  line-height: 1;
  transition: transform 0.15s, background 0.15s;
}

.qty button:hover { background: var(--bg); transform: scale(1.1); }
.qty button:active { transform: scale(0.95); }
.qty b { min-width: 26px; text-align: center; }

/* ---------- TYPES ---------- */
.types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 14px 0 6px;
}

.tp {
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 16px 18px;
  background: var(--surface2);
}

.tp h4 { margin: 0 0 2px; font: 800 17px var(--serif); letter-spacing: -0.02em; }
.tp small { color: var(--muted); }
.tp .r { display: flex; justify-content: space-between; font-size: 14px; margin-top: 6px; }

.tp .bar {
  height: 6px;
  border-radius: 99px;
  background: var(--line);
  margin-top: 12px;
  overflow: hidden;
}

.tp .bar i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #ff9a6e);
  border-radius: 99px;
  transition: width 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}

/* ---------- REVEAL 3D ---------- */
.rv {
  opacity: 0;
  transform: perspective(900px) translateY(50px) rotateX(24deg) scale(0.94);
  filter: blur(8px);
  transition:
    opacity 0.9s cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1),
    filter 0.9s;
  transition-delay: var(--d, 0ms);
  transform-style: preserve-3d;
}

.rv.up { transform: perspective(900px) translateY(-50px) rotateX(-24deg) scale(0.94); }

.rv.in {
  opacity: 1;
  transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(1);
  filter: none;
}

.item.rv.in { transition: transform 0.2s ease-out, opacity 0.9s, filter 0.9s; }

.item.rv.in:hover {
  transform: perspective(900px) translateY(-6px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(1);
}

/* ---------- APP ENTRANCE ---------- */
.app-in { animation: appin 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both; }

@keyframes appin {
  from { opacity: 0; transform: scale(0.97) translateY(20px); filter: blur(10px); }
}

/* ---------- PROGRESS BAR ---------- */
#prog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), #ff9a6e);
  transform: scaleX(0);
  transform-origin: left;
  z-index: 100;
  box-shadow: 0 0 12px var(--accent);
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 860px) {
  #auth, .hero2 .sub, .split { grid-template-columns: 1fr; }
  #auth { grid-template-columns: 1fr; }
  .auth-art { padding: 32px; min-height: 240px; }
  nav .links { display: none; }
  .row2 { grid-template-columns: 1fr; }
  .bento { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 130px; }
  .b4 { grid-column: span 2; }
  .hero2 { padding-top: 40px; }
  .stat b { font-size: 28px; }
}

/* ---------- REDUCED MOTION ---------- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
  html { scroll-behavior: auto; }
  .rv { opacity: 1; transform: none; filter: none; }
  #scene3d { display: none; }
}
