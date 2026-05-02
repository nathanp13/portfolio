// ─── Common portfolio script ───

// Load projects data (used on home page only)
async function loadProjects() {
    try {
        const res = await fetch('projects.json');
        return await res.json();
    } catch (e) {
        return [];
    }
}

// ─── Render project grid (home page) ───
async function renderProjectGrid() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    const projects = await loadProjects();
    projects.forEach(p => {
        const card = document.createElement('a');
        card.className = 'project-card reveal';
        card.href = `${p.id}.html`;
        card.innerHTML = `
            <div class="project-card-inner">
                <p class="project-number">${p.number} — ${p.tags[0]}</p>
                <h3 class="project-card-title">${p.title}</h3>
                <p class="project-card-desc">${p.shortDesc}</p>
                <div class="project-tags">
                    ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
                </div>
            </div>
            <div class="project-card-thumb">
                <img src="img/${p.id}.png" alt="${p.title}" onerror="this.onerror=null;this.src=this.src.replace('.png','.jpg')">
            </div>
        `;
        grid.appendChild(card);
    });
}

// ─── Render project detail page ───
async function renderProjectPage(id) {
    const projects = await loadProjects();
    const p = projects.find(pr => pr.id === id);
    if (!p) return;

    const idx = projects.indexOf(p);
    const prev = projects[idx - 1];
    const next = projects[idx + 1];

    document.title = `${p.title} — Nathan Perissat`;

    const heroTitle = document.getElementById('projectHeroTitle');
    const heroSubtitle = document.getElementById('projectHeroSubtitle');
    const heroTags = document.getElementById('projectHeroTags');
    const infoBar = document.getElementById('projectInfoBar');
    const contentEl = document.getElementById('projectContent');
    const galleryEl = document.getElementById('projectGallery');
    const navEl = document.getElementById('projectNavLinks');

    if (heroTitle) heroTitle.textContent = p.title;
    if (heroSubtitle) heroSubtitle.textContent = p.subtitle;
    if (heroTags) heroTags.innerHTML = p.tags.map(t => `<span class="project-hero-tag">${t}</span>`).join('');

    if (infoBar) infoBar.innerHTML = `
        <div class="project-info-item">
            <p class="project-info-label">${p.category}</p>
            <p class="project-info-value">${p.year}</p>
        </div>
        <div class="project-info-item">
            <p class="project-info-label">Rôle</p>
            <p class="project-info-value">${p.role}</p>
        </div>
        <div class="project-info-item">
            <p class="project-info-label">Outils</p>
            <p class="project-info-value">${p.tools}</p>
        </div>
        <div class="project-info-item">
            <p class="project-info-label">Client</p>
            <p class="project-info-value">${p.client}</p>
        </div>
    `;

    if (contentEl) contentEl.innerHTML = `
        <h3 class="project-section-title">Contexte</h3>
        <p class="project-body">${p.context}</p>
        <h3 class="project-section-title">Mission</h3>
        <p class="project-body">${p.mission}</p>
        <h3 class="project-section-title">Résultats</h3>
        <p class="project-body">${p.results}</p>
    `;

    if (galleryEl) galleryEl.innerHTML = `
        <p class="project-gallery-title">Visuels du projet</p>
        <div class="gallery-grid">
            ${p.gallery.map((g, i) => `
                <div class="gallery-item">
                    <img src="img/${p.id}-${i + 1}.png" alt="${g.label}" onerror="this.onerror=null;this.src=this.src.replace('.png','.jpg')">
                </div>
            `).join('')}
        </div>
        ${p.hasVideo ? `
        <div style="margin-top:2rem;">
            <p class="project-gallery-title" style="margin-bottom:1rem;">Vidéo de présentation</p>
            <div style="width:100%;max-width:800px;margin:0 auto;border-radius:8px;overflow:hidden;background:var(--ink);">
                <video controls playsinline preload="metadata" style="width:100%;aspect-ratio:16/9;display:block;object-fit:cover;" poster="img/${p.id}-poster.png">
                    <source src="${p.videoSrc}" type="video/mp4">
                    Votre navigateur ne supporte pas la lecture vidéo.
                </video>
            </div>
        </div>
        ` : ''}
        ${p.siteUrl ? `
        <div style="text-align:center;margin-top:2.5rem;">
            <a href="${p.siteUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:0.6rem;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;color:var(--paper);background:var(--accent);padding:0.9rem 2rem;border-radius:4px;text-decoration:none;transition:background 0.3s ease,transform 0.2s ease;" onmouseover="this.style.background='var(--accent-light)';this.style.transform='translateY(-2px)'" onmouseout="this.style.background='var(--accent)';this.style.transform='translateY(0)'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Voir le site ${p.title}
            </a>
        </div>
        ` : ''}
    `;

    if (navEl) {
        let navHTML = `<a class="project-nav-link" href="index.html">← Tous les projets</a>`;
        if (prev) navHTML = `<a class="project-nav-link" href="${prev.id}.html">← ${prev.title}</a>` + navHTML;
        if (next) navHTML += `<a class="project-nav-link" href="${next.id}.html">${next.title} →</a>`;
        navEl.innerHTML = navHTML;
    }
}

// ─── Loader ───
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 1200);
});

// ─── Cursor ───
const cursor = document.getElementById('cursor');
if (cursor) {
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX - 5 + 'px';
        cursor.style.top = e.clientY - 5 + 'px';
    });
    document.addEventListener('mouseover', e => {
        if (e.target.closest('a, button, .project-card')) {
            cursor.classList.add('active');
        }
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest('a, button, .project-card')) {
            cursor.classList.remove('active');
        }
    });
}

// ─── Scroll reveal ───
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

// Init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Auto-detect page type
    const grid = document.getElementById('projectsGrid');
    if (grid) {
        renderProjectGrid().then(() => {
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        });
    }

    const projectId = document.body.dataset.project;
    if (projectId) {
        renderProjectPage(projectId);
    }
});
