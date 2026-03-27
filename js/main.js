const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function setYear() {
  const year = new Date().getFullYear();
  const node = $('#year');
  if (node) node.textContent = year;
}

function setupMenu() {
  const toggle = $('.menu-toggle');
  const nav = $('.site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  $$('.site-nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
}

function setupReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  elements.forEach(el => obs.observe(el));
}

function renderResearchCards(targetId, items) {
  const container = document.getElementById(targetId);
  if (!container) return;
  container.innerHTML = items.map((item, index) => `
    <article class="card reveal ${index % 3 === 1 ? 'delay-1' : index % 3 === 2 ? 'delay-2' : ''}">
      <div class="card-meta">
        <span class="badge">${item.tema}</span>
        <span class="badge muted-badge">${item.status}</span>
      </div>
      <h3>${item.titulo}</h3>
      <p>${item.resumo}</p>
      <a class="text-link" href="pesquisa.html?slug=${item.slug}">Ver detalhes</a>
    </article>
  `).join('');
}

function renderArticleList() {
  const container = document.getElementById('article-list');
  if (!container) return;
  container.innerHTML = window.articleData.map((item, index) => `
    <article class="article-item reveal ${index % 2 ? 'delay-1' : ''}">
      <span class="article-kicker">${item.categoria}</span>
      <h2>${item.titulo}</h2>
      <p>${item.resumo}</p>
      <div class="detail-meta">
        <span class="badge">${item.data}</span>
      </div>
      <div style="margin-top:18px">
        <a class="text-link" href="artigo.html?slug=${item.slug}">Ler artigo</a>
      </div>
    </article>
  `).join('');
}

function renderFeaturedBlocks() {
  renderResearchCards('featured-research', window.researchData.slice(0, 3));
  const feature = document.getElementById('featured-article-card');
  if (feature && window.articleData.length) {
    const item = window.articleData[0];
    feature.innerHTML = `
      <span class="article-kicker">${item.categoria}</span>
      <h3 style="margin-top: 12px; font-size: 1.5rem;">${item.titulo}</h3>
      <p style="margin-bottom: 18px;">${item.resumo}</p>
      <div class="detail-meta">
        <span class="badge">${item.data}</span>
      </div>
      <div style="margin-top: 20px;">
        <a class="text-link" href="artigo.html?slug=${item.slug}">Ler agora</a>
      </div>
    `;
  }
}

function renderFullResearchList() {
  renderResearchCards('research-list', window.researchData);
}

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

function renderResearchDetail() {
  const target = document.getElementById('research-detail');
  if (!target) return;
  const slug = getSlug();
  const item = window.researchData.find(entry => entry.slug === slug) || window.researchData[0];
  if (!item) {
    target.innerHTML = '<div class="empty-state">Nenhuma pesquisa encontrada.</div>';
    return;
  }
  document.title = `${item.titulo} | biosaramed`;
  target.innerHTML = `
    <a class="back-link" href="pesquisas.html">← Voltar para pesquisas</a>
    <header class="detail-head reveal in-view">
      <span class="eyebrow">Pesquisa</span>
      <h1 style="font-size: clamp(2.2rem, 5vw, 4rem);">${item.titulo}</h1>
      <p class="lead">${item.resumo}</p>
      <div class="detail-meta">
        <span class="badge">${item.tema}</span>
        <span class="badge muted-badge">${item.status}</span>
      </div>
    </header>
    <div class="detail-body reveal in-view">
      <div>
        <h3>Objetivo</h3>
        <p>${item.objetivo}</p>
      </div>
      <div>
        <h3>Metodologia</h3>
        <p>${item.metodologia}</p>
      </div>
      <div>
        <h3>Resultados esperados</h3>
        <p>${item.resultados}</p>
      </div>
      <div>
        <h3>Palavras-chave</h3>
        <div class="tags">${item.palavrasChave.map(keyword => `<span>${keyword}</span>`).join('')}</div>
      </div>
    </div>
  `;
}

function renderArticleDetail() {
  const target = document.getElementById('article-detail');
  if (!target) return;
  const slug = getSlug();
  const item = window.articleData.find(entry => entry.slug === slug) || window.articleData[0];
  if (!item) {
    target.innerHTML = '<div class="empty-state">Nenhum artigo encontrado.</div>';
    return;
  }
  document.title = `${item.titulo} | biosaramed`;
  target.innerHTML = `
    <a class="back-link" href="artigos.html">← Voltar para artigos</a>
    <header class="detail-head reveal in-view">
      <span class="article-kicker">${item.categoria}</span>
      <h1 style="font-size: clamp(2.2rem, 5vw, 4rem); margin-top: 12px;">${item.titulo}</h1>
      <div class="detail-meta">
        <span class="badge">${item.data}</span>
      </div>
    </header>
    <article class="detail-body reveal in-view">
      ${item.conteudo.map(paragrafo => `<p>${paragrafo}</p>`).join('')}
    </article>
  `;
}

function runParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w = 0;
  let h = 0;

  function resize() {
    w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const count = window.innerWidth < 760 ? 24 : 42;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(86, 123, 107, 0.18)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(60, 90, 115, ${0.10 - dist / 1400})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

function init() {
  setYear();
  setupMenu();
  renderFeaturedBlocks();
  renderFullResearchList();
  renderArticleList();
  renderResearchDetail();
  renderArticleDetail();
  setupReveal();
  runParticles();
}

document.addEventListener('DOMContentLoaded', init);
