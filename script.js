// ── Índice de posts ──────────────────────────────────────────────
const POSTS = [
  {
    file: "posts/largo-plazo.md",
    title: "Por qué el largo plazo siempre gana",
    date: "Mayo 2026", readTime: "5 min", category: "Inversión",
    section: "blog",
    excerpt: "La mayoría de los inversionistas pierden contra el mercado por una sola razón."
  },
  {
    file: "posts/meli-tesis.md",
    title: "MercadoLibre: tesis para 2026",
    date: "Abril 2026", readTime: "7 min", category: "LatAm",
    section: "finanzas",
    excerpt: "Por qué MELI sigue siendo mi posición más relevante en LatAm a pesar de la volatilidad."
  },

  
   {
    file: "posts/clase-media-india-china_1.md",
    title: "La clase media: el motor de crecimiento",
    date: "Junio 2026", readTime: "12 min", category: "Macroeconomía",
    section: "articulos",
    excerpt: "¿Por qué es importante el desarrollo de las clases medias? Ejemplo India y China"
  },
  {
    file: "posts/poder-capital-asia.md",
    title: "Poder y capital en Asia",
    date: "Marzo 2026", readTime: "6 min", category: "Geopolítica",
    section: "articulos",
    excerpt: "Cómo los flujos de inversión globales están cambiando el orden mundial."
  }

];

// ── Estado ───────────────────────────────────────────────────────
let currentTab = 'articulos';
let previousTab = 'articulos';
let treemapRendered = false;

// ── Treemap ──────────────────────────────────────────────────────
function getColor(rend, type) {
  if (type === "EFEC") return "#1a3a5c";
  if (rend >= 20)  return "#1a9e6e";
  if (rend >= 5)   return "#2d7d6b";
  if (rend >= 0)   return "#3d6b5e";
  if (rend >= -5)  return "#7a4a4a";
  if (rend >= -15) return "#a03535";
  return "#c0392b";
}

async function renderTreemap() {
  if (treemapRendered) return;
  try {
    const res = await fetch("portfolio.json");
    if (!res.ok) throw new Error("No encontrado");
    const portfolio = await res.json();
    const data = portfolio.positions;

    const container = document.getElementById("treemap-container");
    const W = container.getBoundingClientRect().width || 660;
    const H = Math.round(W * 0.62);

    const tooltip = document.getElementById("tooltip");

    const root = d3.hierarchy({children: data}).sum(d => d.pct);
    d3.treemap().size([W, H]).padding(3).round(true)(root);

    const svg = d3.select("#treemap-container").append("svg")
      .attr("width", W).attr("height", H)
      .attr("viewBox", `0 0 ${W} ${H}`);

    const cell = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    cell.append("rect")
      .attr("width",  d => Math.max(0, d.x1 - d.x0))
      .attr("height", d => Math.max(0, d.y1 - d.y0))
      .attr("rx", 4)
      .attr("fill", d => getColor(d.data.rend, d.data.type))
      .attr("stroke", "rgba(0,16,31,0.6)")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mousemove", function(event, d) {
        const sign = d.data.rend > 0 ? "+" : "";
        const rendStr = d.data.type === "EFEC" ? "—" : sign + d.data.rend.toFixed(2) + "%";
        tooltip.style.display = "block";
        tooltip.style.left = (event.clientX + 14) + "px";
        tooltip.style.top  = (event.clientY - 10) + "px";
        tooltip.innerHTML = `<strong style="font-size:15px;">${d.data.ticker}</strong><br>
          <span style="color:rgba(232,220,200,0.6)">Portafolio</span> ${d.data.pct.toFixed(2)}%<br>
          <span style="color:rgba(232,220,200,0.6)">Rendimiento</span> ${rendStr}`;
      })
      .on("mouseleave", () => tooltip.style.display = "none");

    cell.each(function(d) {
      const cw = d.x1 - d.x0;
      const ch = d.y1 - d.y0;
      if (cw < 28 || ch < 18) return;
      const g = d3.select(this);
      const sign = d.data.rend > 0 ? "+" : "";
      const rendStr = d.data.type === "EFEC"
        ? "efectivo" : sign + d.data.rend.toFixed(1) + "%";
      const showRend = ch > 44 && cw > 40;
      const showPct  = ch > 62 && cw > 40;
      const fs = Math.min(14, Math.max(10, cw / 5));
      const cy = ch / 2;
      const off = showRend ? (showPct ? 10 : 8) : 0;

      g.append("text")
        .attr("x", cw/2).attr("y", cy - off)
        .attr("text-anchor","middle").attr("dominant-baseline","middle")
        .attr("fill","#e8dcc8").attr("font-size", fs).attr("font-weight","500")
        .attr("font-family","DM Sans, sans-serif")
        .text(d.data.ticker);

      if (showRend) {
        const rc = d.data.rend > 0 ? "#6ecfb0" : d.data.rend < 0 ? "#f08080" : "rgba(232,220,200,0.5)";
        g.append("text")
          .attr("x", cw/2).attr("y", cy - off + fs + 4)
          .attr("text-anchor","middle").attr("dominant-baseline","middle")
          .attr("fill", d.data.type === "EFEC" ? "rgba(232,220,200,0.5)" : rc)
          .attr("font-size", Math.min(11, fs-1))
          .attr("font-family","DM Sans, sans-serif")
          .text(rendStr);
      }

      if (showPct) {
        g.append("text")
          .attr("x", cw/2).attr("y", cy - off + fs + (showRend ? 20 : 4))
          .attr("text-anchor","middle").attr("dominant-baseline","middle")
          .attr("fill","rgba(232,220,200,0.45)")
          .attr("font-size", Math.min(10, fs-2))
          .attr("font-family","DM Sans, sans-serif")
          .text(d.data.pct.toFixed(1) + "%");
      }
    });

    document.getElementById("treemap-updated").textContent =
      "Actualizado: " + portfolio.updated + "  ·  TC: $" + portfolio.tc_usdmxn + " MXN/USD";

    treemapRendered = true;
  } catch(e) {
    document.getElementById("treemap-container").innerHTML =
      `<p style="color:rgba(232,220,200,0.4); font-size:14px; margin-top:1rem;">No se pudo cargar portfolio.json</p>`;
  }
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
          <div class="card" onclick="openPost('${p.file}')">
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
          <div class="blog-item" onclick="openPost('${p.file}')">
            <div><h4>${p.title}</h4><span>${p.date} · ${p.readTime} lectura</span></div>
            <div class="blog-arrow">→</div>
          </div>`).join("")}
      </div>`;
  }
}

// ── Abrir post ───────────────────────────────────────────────────
async function openPost(file) {
  previousTab = currentTab;
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error("No encontrado");
    const md = await res.text();
    document.getElementById("post-body").innerHTML = marked.parse(md);
    switchTab("post", null);
    window.scrollTo(0, 0);
  } catch(e) {
    document.getElementById("post-body").innerHTML =
      `<h1>Post no encontrado</h1><p>El archivo <code>${file}</code> no existe todavía.</p>`;
    switchTab("post", null);
  }
}

// ── Volver ───────────────────────────────────────────────────────
function goBack() {
  const idx = previousTab === "articulos" ? 0 : previousTab === "finanzas" ? 1 : 2;
  switchTab(previousTab, document.querySelectorAll(".nav-tabs button")[idx]);
}

// ── Cambiar tab ──────────────────────────────────────────────────
function switchTab(tab, btn) {
  document.querySelectorAll(".content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-tabs button").forEach(b => b.classList.remove("active"));
  document.getElementById("tab-" + tab).classList.add("active");
  if (btn) btn.classList.add("active");
  if (tab !== "post") currentTab = tab;
  if (tab === "finanzas") renderTreemap();
  document.querySelector(".nav-tabs").classList.remove("open");
  window.scrollTo(0, 0);
}

// ── Menú móvil ───────────────────────────────────────────────────
function toggleMenu() {
  document.querySelector(".nav-tabs").classList.toggle("open");
}

// ── Init ─────────────────────────────────────────────────────────
renderSection("articulos");
renderSection("finanzas");
renderSection("blog");
