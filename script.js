// ── Índice de posts ──────────────────────────────────────────────
// slug = lo que aparece en la URL: pedroaortiz.com/slug
const POSTS = [
    {
    slug: "obligacion-producir-vs-pasion-crear",
    file: "posts/obligacion-producir-vs-pasion-crear.md",
    title: "La obligación por producir mata la pasión por crear",
    date: "Junio 2026", readTime: "5 min", category: "Economía",
    section: "articulos",
    excerpt: "¿En qué momento decidimos lo que es verdad?"
  },
  {
    slug: "obligacion-producir-vs-pasion-crear",
    file: "posts/verdades-colectivas.md",
    title: "# Las verdades prestadas",
    date: "Julio 2026", readTime: "5 min", category: "Blog",
    section: "blog",
    excerpt: "Sobre la quinta gran revolución del esquema"
  },

 {
    slug: "cada-vez-mas-somos-menos-duenos_1",
    file: "posts/cada-vez-mas-somos-menos-duenos_1.md",
    title: "Cada vez MÁS somos MENOS dueños",
    date: "Junio 2026", readTime: "7 min", category: "Economía",
    section: "articulos",
    excerpt: "Sobre la ilusión de sentirnos propietarios"
  },
   {
    slug: "economia-de-la-soledad",
    file: "posts/economia-de-la-soledad.md",
    title: " El negocio de la desconexión: el tecnofeudalismo y la economía de la soledad",
    date: "Junio 2026", readTime: "9 min", category: "Economía",
    section: "articulos",
    excerpt: "¿A quién le conviene que estés solo?"
  },
   {
    slug: "clase-media-india-china",
    file: "posts/clase-media-india-china.md",
    title: "La clase media como motor económico: China, India y el nuevo orden global",
    date: "Junio 2026", readTime: "12 min", category: "Macro",
    section: "articulos",
    excerpt: "China construyó la clase media más grande del mundo. India la está construyendo ahora."
  },
  {
    slug: "largo-plazo",
    file: "posts/largo-plazo.md",
    title: "El largo plazo no siempre es bueno...",
    date: "Mayo 2026", readTime: "7 min", category: "Finanzas",
    section: "finanzas",
    excerpt: "¿Por que invertir no es lo mismo que apostar?."
  },
  {
    slug: "meli-tesis",
    file: "posts/meli-tesis.md",
    title: "MercadoLibre: tesis para 2026",
    date: "Abril 2026", readTime: "7 min", category: "Inversión",
    section: "finanzas",
    excerpt: "Por qué MELI sigue siendo mi posición más relevante en LatAm a pesar de la volatilidad."
  },
  {
    slug: "poder-capital-asia",
    file: "posts/poder-capital-asia.md",
    title: "Poder y capital en Asia",
    date: "Marzo 2026", readTime: "6 min", category: "Geopolítica",
    section: "articulos",
    excerpt: "Cómo los flujos de inversión globales están cambiando el orden mundial."
  },
  {
    slug: "la-lucidez",
    file: "posts/La-lucidez.md",
    title: "La paradoja de la lucidez",
    date: "Mayo 2026", readTime: "7 min", category: "Blog",
    section: "blog",
    excerpt: "La autopercepción y su inevitable sesgo."
  }
];
// ── Estado ───────────────────────────────────────────────────────
let currentTab = 'articulos';
let previousTab = 'articulos';
let portfolioRendered = false;
let portfolioData = null;

// ── Routing ──────────────────────────────────────────────────────
function getSlugFromPath() {
  const path = window.location.pathname.replace(/^\//, "").replace(/\/$/, "");
  return path || null;
}

function navigateTo(slug) {
  window.history.pushState({ slug }, "", "/" + slug);
}

function navigateToTab(tab) {
  const path = tab === "articulos" ? "/" : "/" + tab;
  window.history.pushState({ tab }, "", path);
}

// ══════════════════════════════════════════════════════════════
// PORTFOLIO DASHBOARD
// ══════════════════════════════════════════════════════════════

const PF_COLOR_VAR = {
  indigo: "var(--pf-indigo)", gold: "var(--pf-gold)", green: "var(--pf-green)",
  red: "var(--pf-red)", olive: "var(--pf-olive)", terra: "var(--pf-terra)",
  muted: "var(--pf-muted)"
};

async function renderPortfolio() {
  if (portfolioRendered) return;
  try {
    const res = await fetch("/portfolio.json");
    if (!res.ok) throw new Error("No encontrado");
    portfolioData = await res.json();

    document.getElementById("pf-updated").textContent = "Al cierre · " + portfolioData.updated;
    document.getElementById("pf-invertido").textContent = portfolioData.invertido_pct + "%";
    document.getElementById("pf-efectivo").textContent = portfolioData.efectivo_pct + "%";
    document.getElementById("pf-num-posiciones").textContent = portfolioData.num_posiciones;

    renderPfPosiciones(portfolioData);
    renderPfPnl(portfolioData);
    renderPfValuacion(portfolioData);
    renderPfSectores(portfolioData);

    portfolioRendered = true;
  } catch (e) {
    document.getElementById("pf-tab-posiciones").innerHTML =
      `<p style="color:rgba(232,220,200,0.4); font-size:14px;">No se pudo cargar portfolio.json</p>`;
  }
}

function pfConvictionDots(n) {
  let html = '<div class="pf-conviction">';
  for (let i = 0; i < 5; i++) {
    html += `<div class="pf-dot ${i < n ? 'pf-filled' : 'pf-empty'}"></div>`;
  }
  return html + '</div>';
}

function pfMetricPills(metrics) {
  return metrics.map(m => `<div class="pf-metric-pill ${m.c ? 'pf-' + m.c : ''}">${m.t}</div>`).join("");
}

function renderPfPosiciones(data) {
  let html = "";
  data.groups.forEach(group => {
    html += `<div class="pf-section-title">${group.section}</div>`;
    group.positions.forEach(p => {
      const pnlClass = p.pnl > 0 ? "pf-pnl-pos" : p.pnl < 0 ? "pf-pnl-neg" : "pf-pnl-flat";
      const sign = p.pnl > 0 ? "+" : "";
      const barWidth = Math.min(100, Math.abs(p.cartera) * 8);
      html += `
        <div class="pf-pos-card">
          <div class="pf-pos-header">
            <div>
              <div class="pf-pos-ticker" style="color:${PF_COLOR_VAR[p.color] || 'var(--pf-text)'}">${p.ticker}</div>
              <div class="pf-pos-name">${p.name}</div>
            </div>
            ${pfConvictionDots(p.conviction)}
            <div class="pf-pos-right">
              <div class="pf-pos-pnl ${pnlClass}">${sign}${p.pnl}%</div>
              <div class="pf-pos-cartera">${p.cartera}% cartera</div>
            </div>
          </div>
          <div class="pf-pos-bar-bg"><div class="pf-pos-bar" style="width:${barWidth}%;background:${PF_COLOR_VAR[p.color] || 'var(--pf-muted)'}"></div></div>
          <div class="pf-pos-tesis">${p.tesis}</div>
          <div class="pf-pos-metrics">${pfMetricPills(p.metrics)}</div>
        </div>`;
    });
  });

  if (data.cash) {
    html += `<div class="pf-section-title">Efectivo</div>
      <div class="pf-pos-card" style="border-style:dashed">
        <div class="pf-pos-header">
          <div><div class="pf-pos-ticker" style="color:var(--pf-muted)">CASH</div><div class="pf-pos-name">Efectivo disponible</div></div>
          <div class="pf-pos-right"><div class="pf-pos-pnl" style="color:var(--pf-gold)">${data.cash.pct}%</div><div class="pf-pos-cartera">reserva</div></div>
        </div>
        <div class="pf-pos-bar-bg"><div class="pf-pos-bar" style="width:100%;background:var(--pf-muted)"></div></div>
        <div class="pf-pos-tesis">${data.cash.tesis}</div>
        <div class="pf-pos-metrics">${pfMetricPills(data.cash.metrics)}</div>
      </div>`;
  }

  document.getElementById("pf-tab-posiciones").innerHTML = html;
}

function renderPfPnl(data) {
  const rows = data.pnl_table.map(r => {
    const cls = r.sig === "cheap" ? "pf-per-cheap" : r.sig === "mid" ? "pf-per-mid" : "pf-per-rich";
    const sign = r.pnl > 0 ? "+" : "";
    const emoji = r.sig === "cheap" ? "🟢" : r.sig === "mid" ? "🟡" : "🔴";
    return `<tr><td><strong>${r.ticker}</strong></td><td class="${cls}">${sign}${r.pnl}%</td><td>${r.cartera}%</td><td>${emoji}</td></tr>`;
  }).join("");

  document.getElementById("pf-tab-pnl").innerHTML = `
    <div class="pf-section-title">Rendimiento por posición</div>
    <div class="pf-table-wrap">
      <table class="pf-table">
        <thead><tr><th>Ticker</th><th>PnL %</th><th>Cartera</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderPfValuacion(data) {
  const rows = data.valuacion_table.map(r => {
    const perCls = r.sigColor === "green" ? "pf-per-cheap" : r.sigColor === "red" ? "pf-per-rich" : "pf-per-mid";
    return `<tr><td><strong>${r.ticker}</strong></td><td class="${perCls}">${r.per}</td><td>${r.crec}</td><td><span class="pf-metric-pill pf-${r.sigColor}" style="font-size:0.62rem">${r.sig}</span></td></tr>`;
  }).join("");

  document.getElementById("pf-tab-valuacion").innerHTML = `
    <div class="pf-section-title">PER Forward — de barato a caro</div>
    <div class="pf-table-wrap">
      <table class="pf-table">
        <thead><tr><th>Ticker</th><th>PER Fwd</th><th>Crecimiento</th><th>Señal</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderPfSectores(data) {
  const rows = data.sectores.map(s => `
    <div class="pf-sector-row">
      <div class="pf-sector-top">
        <span class="pf-sector-name" style="color:${PF_COLOR_VAR[s.color] || 'var(--pf-text)'}">${s.name}</span>
        <span class="pf-sector-pct">${s.pct}%</span>
      </div>
      <div class="pf-sector-bar-bg"><div class="pf-sector-bar" style="width:${s.pct}%;background:${PF_COLOR_VAR[s.color] || 'var(--pf-muted)'}"></div></div>
      <div class="pf-sector-detail">${s.detail}</div>
    </div>`).join("");

  document.getElementById("pf-tab-sectores").innerHTML = `
    <div class="pf-section-title">Distribución por sector</div>
    <div class="pf-table-wrap" style="padding:16px">${rows}</div>`;
}

function showPfTab(tab) {
  const tabs = ['posiciones', 'pnl', 'valuacion', 'sectores'];
  tabs.forEach((t, i) => {
    document.getElementById('pf-tab-' + t).classList.add('pf-hidden');
    document.querySelectorAll('.pf-tab')[i].classList.remove('active');
  });
  document.getElementById('pf-tab-' + tab).classList.remove('pf-hidden');
  document.querySelectorAll('.pf-tab')[tabs.indexOf(tab)].classList.add('active');
}

// ── Render listas de posts ────────────────────────────────────────
function renderSection(section) {
  const posts = POSTS.filter(p => p.section === section);
  const container = document.getElementById(section + "-list");
  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = `<div class="section-title">Próximamente</div>
      <div class="section-sub" style="margin-top:8px">Aún no hay publicaciones.</div>`;
    return;
  }

  if (section === "articulos" || section === "finanzas") {
    container.innerHTML = `
      <div class="section-title" style="margin-top:2rem">${section === "articulos" ? "Recientes" : "Notas de inversión"}</div>
      <div class="section-sub">${posts.length} publicación${posts.length !== 1 ? "es" : ""}</div>
      <div class="card-grid">
        ${posts.map(p => `
          <div class="card" onclick="openPost('${p.slug}')">
            <div class="card-tag">${p.category}</div>
            <h3>${p.title}</h3>
            <p>${p.excerpt}</p>
            <div class="card-date">${p.date} · ${p.readTime} lectura</div>
          </div>`).join("")}
      </div>`;
  }

  if (section === "blog") {
    container.innerHTML = `
      <div class="section-title">Entradas</div>
      <div class="section-sub">${posts.length} publicación${posts.length !== 1 ? "es" : ""}</div>
      <div class="blog-list">
        ${posts.map(p => `
          <div class="blog-item" onclick="openPost('${p.slug}')">
            <div><h4>${p.title}</h4><span>${p.date} · ${p.readTime} lectura</span></div>
            <div class="blog-arrow">→</div>
          </div>`).join("")}
      </div>`;
  }
}

// ── Abrir post ───────────────────────────────────────────────────
async function openPost(slug) {
  const post = POSTS.find(p => p.slug === slug);
  if (!post) return;
  previousTab = currentTab;
  try {
    const res = await fetch("/" + post.file);
    if (!res.ok) throw new Error("No encontrado");
    const md = await res.text();
    document.getElementById("post-body").innerHTML = marked.parse(md);
    renderMathInElement(document.getElementById("post-body"), {
      delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "$", right: "$", display: false}
      ],
      throwOnError: false
    });
    navigateTo(slug);
    switchTab("post", null, false);
    window.scrollTo(0, 0);
  } catch(e) {
    document.getElementById("post-body").innerHTML =
      `<h1>Post no encontrado</h1><p>El archivo no existe todavía.</p>`;
    navigateTo(slug);
    switchTab("post", null, false);
  }
}

// ── Volver ───────────────────────────────────────────────────────
function goBack() {
  const idx = previousTab === "articulos" ? 0 : previousTab === "finanzas" ? 1 : 2;
  switchTab(previousTab, document.querySelectorAll(".nav-tabs button")[idx], true);
}

// ── Cambiar tab ──────────────────────────────────────────────────
function switchTab(tab, btn, updateUrl = true) {
  document.querySelectorAll(".content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-tabs button").forEach(b => b.classList.remove("active"));
  document.getElementById("tab-" + tab).classList.add("active");
  if (btn) btn.classList.add("active");
  if (tab !== "post") {
    currentTab = tab;
    if (updateUrl) navigateToTab(tab);
  }
  if (tab === "finanzas") renderPortfolio();
  document.querySelector(".nav-tabs").classList.remove("open");
  window.scrollTo(0, 0);
}

// ── Menú móvil ───────────────────────────────────────────────────
function toggleMenu() {
  document.querySelector(".nav-tabs").classList.toggle("open");
}

// ── Manejar botón atrás del navegador ────────────────────────────
window.addEventListener("popstate", () => handleRoute());

// ── Leer URL al cargar ───────────────────────────────────────────
function handleRoute() {
  const slug = getSlugFromPath();

  const post = POSTS.find(p => p.slug === slug);
  if (post) { openPost(slug); return; }

  if (slug === "finanzas") {
    switchTab("finanzas", document.querySelectorAll(".nav-tabs button")[1], false);
    return;
  }
  if (slug === "blog") {
    switchTab("blog", document.querySelectorAll(".nav-tabs button")[2], false);
    return;
  }

  switchTab("articulos", document.querySelectorAll(".nav-tabs button")[0], false);
}

// ── Init ─────────────────────────────────────────────────────────
renderSection("articulos");
renderSection("finanzas");
renderSection("blog");
handleRoute();
