// ── Índice de posts ──────────────────────────────────────────────
// Cada post que agregues debe registrarse aquí
const POSTS = [
  {
    file: "posts/largo-plazo.md",
    title: "Por qué el largo plazo siempre gana",
    date: "Mayo 2026",
    readTime: "5 min",
    category: "Inversión",
    section: "blog",
    excerpt: "La mayoría de los inversionistas pierden contra el mercado por una sola razón."
  },
  {
    file: "posts/meli-tesis.md",
    title: "MercadoLibre: tesis para 2026",
    date: "Abril 2026",
    readTime: "7 min",
    category: "LatAm",
    section: "finanzas",
    excerpt: "Por qué MELI sigue siendo mi posición más relevante en LatAm a pesar de la volatilidad."
  },
  {
    file: "posts/poder-capital-asia.md",
    title: "Poder y capital en Asia",
    date: "Marzo 2026",
    readTime: "6 min",
    category: "Geopolítica",
    section: "articulos",
    excerpt: "Cómo los flujos de inversión globales están cambiando el orden mundial."
  }
];

// ── Estado ───────────────────────────────────────────────────────
let currentTab = 'articulos';
let previousTab = 'articulos';

// ── Render listas ────────────────────────────────────────────────
function renderSection(section) {
  const posts = POSTS.filter(p => p.section === section);
  const container = document.getElementById(section + '-list');

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="section-title">Próximamente</div>
      <div class="section-sub" style="margin-top:8px">Aún no hay publicaciones en esta sección.</div>`;
    return;
  }

  // Artículos y finanzas: cards en grid
  if (section === 'articulos' || section === 'finanzas') {
    container.innerHTML = `
      <div class="section-title">${section === 'articulos' ? 'Recientes' : 'Notas de inversión'}</div>
      <div class="section-sub">${posts.length} publicación${posts.length !== 1 ? 'es' : ''}</div>
      <div class="card-grid">
        ${posts.map(p => `
          <div class="card" onclick="openPost('${p.file}')">
            <div class="card-tag">${p.category}</div>
            <h3>${p.title}</h3>
            <p>${p.excerpt}</p>
            <div class="card-date">${p.date} · ${p.readTime} lectura</div>
          </div>`).join('')}
      </div>`;
  }

  // Blog: lista editorial
  if (section === 'blog') {
    container.innerHTML = `
      <div class="section-title">Entradas</div>
      <div class="section-sub">${posts.length} publicación${posts.length !== 1 ? 'es' : ''}</div>
      <div class="blog-list">
        ${posts.map(p => `
          <div class="blog-item" onclick="openPost('${p.file}')">
            <div>
              <h4>${p.title}</h4>
              <span>${p.date} · ${p.readTime} lectura</span>
            </div>
            <div class="blog-arrow">→</div>
          </div>`).join('')}
      </div>`;
  }
}

// ── Abrir post ───────────────────────────────────────────────────
async function openPost(file) {
  previousTab = currentTab;
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error('No encontrado');
    const md = await res.text();
    document.getElementById('post-body').innerHTML = marked.parse(md);
    switchTab('post', null);
    window.scrollTo(0, 0);
  } catch (e) {
    document.getElementById('post-body').innerHTML = `
      <h1>Post no encontrado</h1>
      <p>El archivo <code>${file}</code> no existe todavía.</p>`;
    switchTab('post', null);
  }
}

// ── Volver ───────────────────────────────────────────────────────
function goBack() {
  const btn = document.querySelector(`.nav-tabs button:nth-child(${
    previousTab === 'articulos' ? 1 : previousTab === 'finanzas' ? 2 : 3
  })`);
  switchTab(previousTab, document.querySelectorAll('.nav-tabs button')[
    previousTab === 'articulos' ? 0 : previousTab === 'finanzas' ? 1 : 2
  ]);
}

// ── Cambiar tab ──────────────────────────────────────────────────
function switchTab(tab, btn) {
  document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-tabs button').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  if (btn) btn.classList.add('active');
  if (tab !== 'post') currentTab = tab;
  document.querySelector('.nav-tabs').classList.remove('open');
}

// ── Menú móvil ───────────────────────────────────────────────────
function toggleMenu() {
  document.querySelector('.nav-tabs').classList.toggle('open');
}

// ── Init ─────────────────────────────────────────────────────────
renderSection('articulos');
renderSection('finanzas');
renderSection('blog');
