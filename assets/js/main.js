/* =====================================================================
   PORTFOLIO — SERGE ARISTIDE BABA · interactions & animations
   Aucune bibliothèque externe. Le contenu modifiable est dans data.js.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     Outils
     --------------------------------------------------------------- */
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const html = document.documentElement;
  const DATA = window.SITE || { projects: [], aiExperiments: [], socials: [], filters: [], contact: {} };
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const fineMQ = matchMedia('(hover: hover) and (pointer: fine)');
  const desktopMQ = matchMedia('(min-width: 1024px)');
  const reduced = () => reduceMQ.matches;
  const fine = () => fineMQ.matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad = (n) => String(n).padStart(2, '0');
  const timecode = (s, fps = 25) => {
    s = Math.max(0, s);
    const t = Math.floor(s);
    return `${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}:${pad(Math.floor((s % 1) * fps))}`;
  };
  const esc = (str = '') => String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hasExt = (src = '') => /\.[a-z0-9]{2,5}$/i.test(src);
  const icon = (id) => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;

  /** Image : chemin sans extension → AVIF + WebP ; avec extension → fichier tel quel */
  function mediaHTML(src, alt = '', { lazy = true, cls = '', position = '' } = {}) {
    const attrs = `alt="${esc(alt)}" ${lazy ? 'loading="lazy"' : ''} decoding="async" ${cls ? `class="${cls}"` : ''} ${position ? `style="object-position:${esc(position)}"` : ''}`;
    if (hasExt(src)) return `<img src="${esc(src)}" ${attrs} />`;
    return `<picture><source type="image/avif" srcset="${esc(src)}.avif" /><img src="${esc(src)}.webp" ${attrs} /></picture>`;
  }

  let scrollLocks = 0;
  function lockScroll(on) {
    scrollLocks += on ? 1 : -1;
    const gap = window.innerWidth - html.clientWidth;
    if (scrollLocks > 0) {
      document.body.style.overflow = 'hidden';
      if (gap > 0) document.body.style.paddingRight = gap + 'px';
    } else {
      scrollLocks = 0;
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  /* ---------------------------------------------------------------
     1. Révélations au scroll
     --------------------------------------------------------------- */
  function splitWords(el) {
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'w';
            const inner = document.createElement('span');
            inner.textContent = part;
            inner.style.setProperty('--i', i++);
            w.appendChild(inner);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(el);
  }

  let revealObserver;
  function initReveal() {
    $$('[data-reveal="words"]').forEach((el) => { if (!el.dataset.split) { splitWords(el); el.dataset.split = '1'; } });
    $$('[data-reveal="lines"]').forEach((el) => $$('.line', el).forEach((l, i) => l.style.setProperty('--i', i)));
    $$('[data-reveal="stagger"]').forEach((el) => Array.from(el.children).forEach((c, i) => c.style.setProperty('--i', i)));

    if (!('IntersectionObserver' in window)) { $$('[data-reveal]').forEach((el) => el.classList.add('is-in')); return; }
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); revealObserver.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    $$('[data-reveal]').forEach((el) => revealObserver.observe(el));
  }
  const observeReveal = (root) => {
    if (!revealObserver) return;
    $$('[data-reveal]', root).forEach((el) => revealObserver.observe(el));
  };

  /* ---------------------------------------------------------------
     2. Intro (compte à rebours timecode)
     --------------------------------------------------------------- */
  function runIntro(done) {
    const pre = $('#preloader');
    if (!pre || html.classList.contains('no-intro')) { pre && pre.remove(); done(); return; }
    const tc = $('#preloader-tc');
    const DURATION = 1150;
    const start = performance.now();
    lockScroll(true);
    const tick = (t) => {
      const p = Math.min(1, (t - start) / DURATION);
      const f = Math.round(p * 25);
      tc.textContent = `00:00:0${f === 25 ? 1 : 0}:${pad(f % 25)}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    setTimeout(() => {
      try { sessionStorage.setItem('sab-intro', '1'); } catch (e) { /* stockage indisponible */ }
      pre.classList.add('is-done');
      lockScroll(false);
      setTimeout(done, 250);
      setTimeout(() => pre.remove(), 1000);
    }, DURATION);
  }

  /* ---------------------------------------------------------------
     3. Navigation, timecode, progression, sections actives
     --------------------------------------------------------------- */
  const navIds = ['accueil', 'a-propos', 'competences', 'projets', 'ia', 'contact'];
  const FILM = 180; // le site = un film de 3 minutes
  const nav = $('#nav');
  const navTc = $('#nav-tc');
  const navProgress = $('#nav-progress');
  const indicator = $('.nav__indicator');
  const navLinks = $$('.nav__links a');
  let activeId = '';

  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    $$('[data-nav]').forEach((a) => {
      const on = a.dataset.nav === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    moveIndicator();
  }
  function moveIndicator() {
    const link = navLinks.find((a) => a.dataset.nav === activeId);
    if (!link || !indicator) return;
    indicator.style.width = (link.offsetWidth - 24) + 'px';
    indicator.style.transform = `translateX(${link.offsetLeft + 12}px)`;
  }

  /* ---------------------------------------------------------------
     4. Boucle de scroll (une seule, synchronisée à l'affichage)
     --------------------------------------------------------------- */
  const parallaxEls = $$('[data-parallax-scroll]');
  const aboutInner = $('[data-parallax-inner]');
  const journeyList = $('.journey__list');
  const journeySteps = $$('.journey__step');
  const processList = $('#process');
  const processSteps = $$('.process__step');
  let ticking = false;

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
  }
  function updateScroll() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const progress = max > 0 ? clamp(y / max, 0, 1) : 0;

    nav.classList.toggle('is-scrolled', y > 40);
    navProgress.style.transform = `scaleX(${progress})`;
    navTc.textContent = timecode(progress * FILM);

    // section active
    let current = navIds[0];
    navIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= vh * 0.45) current = id;
    });
    if (y >= max - 4) current = navIds[navIds.length - 1];
    setActive(current);

    if (!reduced()) {
      // parallaxe du hero
      if (y < vh * 1.2) parallaxEls.forEach((el) => { el.style.translate = `0 ${(y * parseFloat(el.dataset.parallaxScroll)).toFixed(1)}px`; });
      // portrait « À propos »
      if (aboutInner) {
        const r = aboutInner.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) {
          const lim = r.height * 0.07;
          aboutInner.style.translate = `0 ${clamp((r.top + r.height / 2 - vh / 2) * -0.06, -lim, lim).toFixed(1)}px`;
        }
      }
    }

    // parcours : la ligne se dessine
    if (journeyList) {
      const r = journeyList.getBoundingClientRect();
      const p = clamp((vh * 0.85 - r.top) / Math.max(r.height, vh * 0.4), 0, 1);
      journeyList.style.setProperty('--p', p.toFixed(3));
      journeySteps.forEach((s, i) => s.classList.toggle('is-lit', p >= i / (journeySteps.length - 1) - 0.02));
    }

    // processus : timeline
    if (processList) {
      const r = processList.getBoundingClientRect();
      processList.style.setProperty('--p', clamp((vh * 0.6 - r.top) / r.height, 0, 1).toFixed(3));
      processSteps.forEach((s) => {
        const sr = s.getBoundingClientRect();
        const passed = sr.top < vh * 0.55;
        if (passed) s.classList.add('is-seen');
        s.classList.toggle('is-on', passed && sr.bottom > vh * 0.45);
      });
    }
  }

  /* ---------------------------------------------------------------
     5. Menu mobile
     --------------------------------------------------------------- */
  function initMenu() {
    const burger = $('#burger');
    const menu = $('#menu');
    const label = $('.nav__burger-label');
    if (!burger || !menu) return;
    $$('.menu__nav a', menu).forEach((a, i) => a.style.setProperty('--i', i));
    let open = false;
    const set = (state) => {
      open = state;
      burger.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Fermer' : 'Menu';
      document.body.classList.toggle('menu-open', open);
      lockScroll(open);
      if (open) {
        menu.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
      } else {
        menu.classList.remove('is-open');
        setTimeout(() => { if (!open) menu.hidden = true; }, reduced() ? 250 : 700);
      }
    };
    burger.addEventListener('click', () => set(!open));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) { set(false); burger.focus(); } });
    desktopMQ.addEventListener?.('change', () => open && set(false));
  }

  /* ---------------------------------------------------------------
     6. Curseur personnalisé + boutons magnétiques + parallaxe souris
     --------------------------------------------------------------- */
  function initPointer() {
    if (!fine()) return;
    const cursor = $('#cursor');
    const dot = $('.cursor__dot', cursor);
    const ring = $('.cursor__ring', cursor);
    const label = $('.cursor__label', cursor);
    html.classList.add('has-cursor');

    let mx = -100, my = -100, rx = -100, ry = -100;
    const hero = $('#accueil');
    const layers = $$('[data-depth]', hero);
    let px = 0, py = 0, tx = 0, ty = 0;

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      cursor.classList.add('is-visible');
      const t = e.target instanceof Element ? e.target : null;
      const labelled = t && t.closest('[data-cursor]');
      const interactive = t && t.closest('a, button, input, textarea, select, label, [tabindex]');
      const text = labelled ? labelled.getAttribute('data-cursor') : '';
      if (label.textContent !== text) label.textContent = text;
      cursor.classList.toggle('has-label', Boolean(text));
      cursor.classList.toggle('is-hover', Boolean(interactive) && !text);
      // parallaxe du hero
      const hr = hero.getBoundingClientRect();
      if (my < hr.bottom) { tx = mx / window.innerWidth - 0.5; ty = (my - hr.top) / hr.height - 0.5; }
    }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));

    const loop = () => {
      const k = reduced() ? 1 : 0.2;
      rx = lerp(rx, mx, k); ry = lerp(ry, my, k);
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      label.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (!reduced()) {
        px = lerp(px, tx, 0.06); py = lerp(py, ty, 0.06);
        layers.forEach((l) => { const d = +l.dataset.depth; l.style.transform = `translate3d(${(px * d).toFixed(2)}px, ${(py * d).toFixed(2)}px, 0)`; });
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    // Boutons magnétiques
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        if (reduced()) return;
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.35}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------------
     7. Hero : timecode du portrait, chaîne du concept
     --------------------------------------------------------------- */
  function initHero() {
    const rtc = $('#running-tc');
    if (rtc && !reduced()) {
      const start = performance.now();
      let last = -1;
      const tick = (t) => {
        const s = (t - start) / 1000;
        const f = Math.floor(s * 25);
        if (f !== last) { rtc.textContent = timecode(s); last = f; }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    // chaîne Message → Image → … : le mot actif s'allume
    const words = $$('#chain span');
    const arrows = $$('#chain b');
    if (words.length && !reduced()) {
      let i = 0;
      const step = () => {
        words.forEach((w, k) => w.classList.toggle('is-on', k === i));
        arrows.forEach((a, k) => a.classList.toggle('is-on', k === i));
        i = (i + 1) % words.length;
      };
      step();
      setInterval(step, 1600);
    }
    if (reduced()) $$('svg').forEach((s) => s.pauseAnimations && s.pauseAnimations());
  }

  /* ---------------------------------------------------------------
     8. Ce que je fais (accordéon)
     --------------------------------------------------------------- */
  function initExpertise() {
    const panels = $$('.xp__panel');
    // points de la visualisation IA
    $$('[data-dots]').forEach((box) => {
      const core = [6, 7, 8, 11, 12, 13, 16, 17, 18];
      for (let i = 0; i < 25; i++) {
        const r = (n) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
        const d = document.createElement('span');
        if (core.includes(i)) d.className = 'is-core';
        d.style.setProperty('--dx', `${((r(1) - 0.5) * 160).toFixed(0)}%`);
        d.style.setProperty('--dy', `${((r(2) - 0.5) * 160).toFixed(0)}%`);
        d.style.animationDelay = `${(r(3) * 0.4).toFixed(2)}s`;
        box.appendChild(d);
      }
    });
    const activate = (panel, toggle = false) => {
      const already = panel.classList.contains('is-active');
      panels.forEach((p) => {
        const on = p === panel ? (toggle ? !already : true) : false;
        p.classList.toggle('is-active', on);
        $('.xp__head', p).setAttribute('aria-expanded', String(on));
      });
    };
    panels.forEach((p) => {
      const head = $('.xp__head', p);
      p.addEventListener('pointerenter', (e) => { if (desktopMQ.matches && e.pointerType === 'mouse') activate(p); });
      head.addEventListener('focus', () => { if (desktopMQ.matches) activate(p); });
      head.addEventListener('click', () => activate(p, !desktopMQ.matches));
    });
  }

  /* ---------------------------------------------------------------
     9. Projets : filtres, cartes, aperçu vidéo, fiche détaillée
     --------------------------------------------------------------- */
  const projects = DATA.projects || [];

  function cardHTML(p, index) {
    const n = pad(index + 1);
    const tags = [
      p.placeholder ? '<span class="tag tag--paper">Exemple</span>' : '',
      p.video ? `<span class="tag tag--ink">${icon('play')} Vidéo</span>` : '',
    ].join('');
    return `
      <article class="card card--${esc(p.layout || 'wide')}${p.offset ? ' card--offset' : ''}" data-filter="${esc(p.filter || '')}" data-id="${esc(p.id)}">
        <button type="button" class="card__btn" data-cursor="${p.video ? 'Lire' : 'Voir'}" aria-label="Ouvrir le projet : ${esc(p.title)}${p.placeholder ? ' (exemple)' : ''}">
          <div class="card__media" data-reveal="image">
            <div class="reveal-zoom">${mediaHTML(p.cover.src, p.cover.alt, { position: p.cover.position })}</div>
            <div class="card__shade"></div>
            <div class="card__tags">${tags}</div>
            <span class="card__role meta">${esc((p.role || []).join(' · '))}</span>
          </div>
          <div class="card__info">
            <span class="meta">${n}</span>
            <div><h3>${esc(p.title)}</h3><p>${esc(p.category)}</p></div>
            <span class="meta">${esc(p.year || '')}</span>
          </div>
        </button>
      </article>`;
  }

  function ctaHTML() {
    return `
      <article class="card card--cta" data-filter="*">
        <a href="#contact" class="cta-card" data-cursor="Écrire">
          <span class="meta"><span>Plan suivant</span><span>—</span></span>
          <span>
            <span class="cta-card__big">Votre<br>projet<br><span class="outline">ici ?</span></span>
            <span class="cta-card__go">Parlons-en ${icon('arrow-ur')}</span>
          </span>
        </a>
      </article>`;
  }

  function initProjects() {
    const grid = $('#works');
    const filtersBox = $('#filters');
    if (!grid) return;
    grid.innerHTML = projects.map(cardHTML).join('') + ctaHTML();
    if (projects.some((p) => p.placeholder)) $('#works-notice').hidden = false;

    // filtres (uniquement ceux qui ont des projets)
    const filters = (DATA.filters || []).filter((f) => f.id === 'all' || projects.some((p) => p.filter === f.id));
    filtersBox.innerHTML = filters.map((f) => {
      const count = f.id === 'all' ? projects.length : projects.filter((p) => p.filter === f.id).length;
      return `<button type="button" class="filter" data-f="${esc(f.id)}" aria-pressed="${f.id === 'all'}">${esc(f.label)} <sup>${count}</sup></button>`;
    }).join('');
    filtersBox.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter');
      if (!btn) return;
      $$('.filter', filtersBox).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const f = btn.dataset.f;
      $$('.card', grid).forEach((card) => {
        const show = f === 'all' || card.dataset.filter === '*' || card.dataset.filter === f;
        if (show && card.hidden) {
          card.hidden = false;
          card.classList.add('is-leaving');
          requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('is-leaving')));
          $$('[data-reveal]', card).forEach((r) => r.classList.add('is-in'));
        } else if (!show && !card.hidden) {
          card.classList.add('is-leaving');
          setTimeout(() => { card.hidden = true; card.classList.remove('is-leaving'); }, reduced() ? 0 : 300);
        }
      });
    });

    // liens externes vers un filtre (ex. bouton « Voir les réalisations IA »)
    $$('[data-filter-link]').forEach((link) => link.addEventListener('click', () => {
      const btn = $(`.filter[data-f="${link.dataset.filterLink}"]`, filtersBox);
      if (btn) btn.click();
    }));

    // ouverture des fiches + aperçu vidéo au survol
    $$('.card[data-id]', grid).forEach((card) => {
      const p = projects.find((x) => x.id === card.dataset.id);
      const btn = $('.card__btn', card);
      btn.addEventListener('click', () => openProject(p, btn));
      if (!p.video) return;
      const media = $('.card__media', card);
      let video = null;
      btn.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse' || reduced()) return;
        if (!video) {
          video = document.createElement('video');
          video.className = 'card__video';
          video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'none';
          video.setAttribute('aria-hidden', 'true');
          if (p.video.poster) video.poster = p.video.poster;
          video.innerHTML = (p.video.webm ? `<source src="${esc(p.video.webm)}" type="video/webm">` : '') + `<source src="${esc(p.video.mp4)}" type="video/mp4">`;
          media.insertBefore(video, $('.card__shade', media));
        }
        video.classList.add('is-on');
        video.play().catch(() => {});
      });
      btn.addEventListener('pointerleave', () => { if (video) { video.pause(); video.classList.remove('is-on'); } });
    });
  }

  /* ---------- Lecteur vidéo ---------- */
  function createPlayer(v, title) {
    const wrap = document.createElement('div');
    wrap.className = `player player--${v.orientation === 'portrait' ? 'portrait' : 'landscape'}`;
    wrap.innerHTML = `
      <video playsinline preload="none" ${v.poster ? `poster="${esc(v.poster)}"` : ''} aria-label="${esc(title)}" data-cursor="Lire">
        ${v.webm ? `<source src="${esc(v.webm)}" type="video/webm">` : ''}<source src="${esc(v.mp4)}" type="video/mp4">
      </video>
      <button type="button" class="player__big" data-cursor="Lire" aria-label="Lire la vidéo : ${esc(title)}"><span>${icon('play')}</span></button>
      <div class="player__bar">
        <button type="button" class="pp" aria-label="Lecture">${icon('play')}</button>
        <span class="player__time">00:00 / 00:00</span>
        <input type="range" class="range" min="0" max="1000" value="0" aria-label="Position dans la vidéo" />
        <button type="button" class="mute" aria-label="Couper le son">${icon('volume')}</button>
        <button type="button" class="fs" aria-label="Plein écran">${icon('max')}</button>
      </div>`;
    const video = $('video', wrap);
    const pp = $('.pp', wrap);
    const range = $('.range', wrap);
    const time = $('.player__time', wrap);
    const mute = $('.mute', wrap);
    const fmt = (s) => (isFinite(s) ? `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}` : '00:00');
    const toggle = () => { if (video.paused) { video.play().catch(() => {}); wrap.classList.add('is-started'); } else video.pause(); };
    $('.player__big', wrap).addEventListener('click', toggle);
    video.addEventListener('click', toggle);
    pp.addEventListener('click', toggle);
    video.addEventListener('play', () => { wrap.classList.add('is-playing'); $('use', pp).setAttribute('href', '#i-pause'); pp.setAttribute('aria-label', 'Pause'); video.dataset.cursor = 'Pause'; });
    video.addEventListener('pause', () => { wrap.classList.remove('is-playing'); $('use', pp).setAttribute('href', '#i-play'); pp.setAttribute('aria-label', 'Lecture'); video.dataset.cursor = 'Lire'; });
    video.addEventListener('timeupdate', () => {
      const pct = video.duration ? (video.currentTime / video.duration) * 100 : 0;
      range.value = Math.round(pct * 10);
      range.style.setProperty('--p', pct + '%');
      time.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
    });
    video.addEventListener('loadedmetadata', () => { time.textContent = `00:00 / ${fmt(video.duration)}`; });
    range.addEventListener('input', () => { if (video.duration) video.currentTime = (range.value / 1000) * video.duration; });
    mute.addEventListener('click', () => {
      video.muted = !video.muted;
      $('use', mute).setAttribute('href', video.muted ? '#i-mute' : '#i-volume');
      mute.setAttribute('aria-label', video.muted ? 'Activer le son' : 'Couper le son');
    });
    $('.fs', wrap).addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (wrap.requestFullscreen) wrap.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    });
    return wrap;
  }

  /* ---------- Fiche projet ---------- */
  const modal = $('#modal');
  const modalBody = $('#modal-body');
  const modalCrumb = $('#modal-crumb');
  const modalClose = $('#modal-close');
  let opener = null;
  let modalOpen = false;

  function renderProject(p) {
    const index = projects.indexOf(p);
    const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
    modalCrumb.innerHTML = `Projet ${pad(index + 1)}<i>/</i>${esc(p.category)}`;
    const specs = [
      ['Catégorie', p.category], ['Année', p.year], ['Client', p.client],
      ['Mon rôle', (p.role || []).join(' · ')], ['Outils', (p.tools || []).join(' · ')], ['IA utilisées', (p.ai || []).join(' · ')],
    ].filter(([, v]) => v);
    let media = '';
    if (p.embed) media = `<div class="modal__embed"><iframe src="${esc(p.embed)}" title="${esc(p.title)}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    else if (!p.video) media = mediaHTML(p.cover.src, p.cover.alt, { lazy: false });

    modalBody.innerHTML = `
      ${p.placeholder ? '<p class="meta modal__notice">Projet d’exemple — contenu de démonstration à remplacer par une réalisation réelle</p>' : ''}
      <h2 class="display modal__title" id="modal-title">${esc(p.title)}</h2>
      <div class="modal__media">${media}</div>
      <div class="modal__grid">
        <div class="modal__text">
          <p class="meta">Le projet</p>
          <p class="modal__desc">${esc(p.description || '')}</p>
          ${p.result ? `<p class="meta modal__label-2">Résultat</p><p class="modal__result">${esc(p.result)}</p>` : ''}
          ${p.link && p.link.url ? `<a class="meta modal__link" href="${esc(p.link.url)}" target="_blank" rel="noopener noreferrer" data-cursor="Ouvrir">${esc(p.link.label || 'Voir le projet')} ${icon('arrow-ur')}</a>` : ''}
        </div>
        <div class="modal__specs"><dl class="specs">${specs.map(([k, v]) => `<div><dt class="meta">${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
      </div>
      ${(p.gallery || []).length ? `<div class="gallery">${p.gallery.map((g) => `<figure data-reveal="image"><div class="reveal-zoom">${mediaHTML(g.src, g.alt)}</div></figure>`).join('')}</div>` : ''}
      ${next && next !== p ? `<button type="button" class="next" data-cursor="Suivant"><span><span class="meta">Projet suivant</span><span class="next__title">${esc(next.title)}</span></span><span class="next__arrow">${icon('arrow-right')}</span></button>` : ''}`;

    if (!p.embed && p.video) $('.modal__media', modalBody).appendChild(createPlayer(p.video, p.title));
    const nextBtn = $('.next', modalBody);
    if (nextBtn) nextBtn.addEventListener('click', () => { pauseModalMedia(); renderProject(next); modal.scrollTo({ top: 0 }); modalClose.focus({ preventScroll: true }); });
    observeReveal(modalBody);
  }
  function pauseModalMedia() { $$('video', modalBody).forEach((v) => v.pause()); }

  function openProject(p, from) {
    if (!p) return;
    opener = from;
    renderProject(p);
    modal.hidden = false;
    modal.scrollTop = 0;
    modalOpen = true;
    lockScroll(true);
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('is-open')));
    modalClose.focus({ preventScroll: true });
  }
  function closeProject() {
    if (!modalOpen) return;
    modalOpen = false;
    pauseModalMedia();
    modal.classList.add('is-closing');
    modal.classList.remove('is-open');
    setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove('is-closing');
      modalBody.innerHTML = '';
      lockScroll(false);
      if (opener) opener.focus({ preventScroll: true });
    }, reduced() ? 250 : 850);
  }
  function initModal() {
    modalClose.addEventListener('click', closeProject);
    document.addEventListener('keydown', (e) => {
      if (!modalOpen) return;
      if (e.key === 'Escape') { closeProject(); return; }
      if (e.key !== 'Tab') return;
      const f = $$('a[href], button:not([disabled]), input, iframe, [tabindex]:not([tabindex="-1"])', modal).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------------------------------------------------------------
     10. Laboratoire IA : onglets, avant/après, prompt tapé
     --------------------------------------------------------------- */
  function initLab() {
    const exps = DATA.aiExperiments || [];
    const tabs = $('#lab-tabs');
    const ba = $('#ba');
    if (!tabs || !ba || !exps.length) return;
    const imgBefore = $('#ba-before'), imgAfter = $('#ba-after');
    const srcBefore = $('#ba-before-avif'), srcAfter = $('#ba-after-avif');
    const range = $('#ba-range');
    const prompt = $('#lab-prompt'), promptSr = $('#lab-prompt-sr');
    let typer = null;

    tabs.innerHTML = exps.map((e, i) => `
      <button type="button" class="lab__tab" role="tab" aria-selected="${i === 0}" data-i="${i}">
        <span class="num">${pad(i + 1)}</span>
        <span class="txt"><strong>${esc(e.title)}</strong><small>${esc(e.technique || '')}</small></span>
        <span class="pin" aria-hidden="true"></span>
      </button>`).join('');

    const setImg = (img, source, m) => {
      if (hasExt(m.src)) { source.removeAttribute('srcset'); img.src = m.src; }
      else { source.srcset = m.src + '.avif'; img.src = m.src + '.webp'; }
      img.alt = m.alt || '';
    };
    const typeText = (text) => {
      clearInterval(typer);
      promptSr.textContent = text;
      if (reduced()) { prompt.textContent = text; return; }
      let n = 0;
      typer = setInterval(() => { n += 2; prompt.textContent = text.slice(0, n); if (n >= text.length) clearInterval(typer); }, 18);
    };
    const show = (i, animate = true) => {
      const e = exps[i];
      $$('.lab__tab', tabs).forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
      const swap = () => {
        setImg(imgBefore, srcBefore, e.before);
        setImg(imgAfter, srcAfter, e.after);
        range.setAttribute('aria-label', `Comparer avant et après : ${e.title}`);
        const done = () => ba.classList.remove('is-switching');
        imgAfter.complete ? setTimeout(done, 30) : imgAfter.addEventListener('load', done, { once: true });
      };
      if (animate && !reduced()) { ba.classList.add('is-switching'); setTimeout(swap, 300); } else swap();
      typeText(e.prompt || '');
      $('#lab-steps').innerHTML = (e.steps || []).map((s, k, a) => `<li><span>${esc(s)}</span>${k < a.length - 1 ? '<b>→</b>' : ''}</li>`).join('');
      $('#lab-tools').textContent = (e.tools || []).join(' · ');
      $('#lab-note').hidden = !e.placeholder;
    };
    tabs.addEventListener('click', (ev) => { const t = ev.target.closest('.lab__tab'); if (t) show(+t.dataset.i); });
    tabs.addEventListener('keydown', (ev) => {
      if (ev.key !== 'ArrowDown' && ev.key !== 'ArrowUp') return;
      ev.preventDefault();
      const cur = $$('.lab__tab', tabs).findIndex((t) => t.getAttribute('aria-selected') === 'true');
      const ni = (cur + (ev.key === 'ArrowDown' ? 1 : exps.length - 1)) % exps.length;
      show(ni); $$('.lab__tab', tabs)[ni].focus();
    });
    show(0, false);

    // curseur avant/après (souris = suit le pointeur, tactile = glisser, clavier = flèches)
    let target = 50, pos = 50, dragging = false, running = false;
    const render = () => {
      pos = reduced() ? target : lerp(pos, target, 0.18);
      ba.style.setProperty('--pos', pos.toFixed(2) + '%');
      if (Math.abs(pos - target) > 0.05) requestAnimationFrame(render); else { pos = target; ba.style.setProperty('--pos', pos + '%'); running = false; }
    };
    const setTarget = (v) => { target = clamp(v, 0, 100); range.value = Math.round(target); if (!running) { running = true; requestAnimationFrame(render); } };
    const fromEvent = (e) => { const r = ba.getBoundingClientRect(); setTarget(((e.clientX - r.left) / r.width) * 100); };
    ba.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || dragging) fromEvent(e); });
    ba.addEventListener('pointerdown', (e) => { dragging = true; ba.setPointerCapture && ba.setPointerCapture(e.pointerId); fromEvent(e); });
    ba.addEventListener('pointerup', () => { dragging = false; });
    ba.addEventListener('pointercancel', () => { dragging = false; });
    range.addEventListener('input', () => setTarget(+range.value));
  }

  /* ---------------------------------------------------------------
     11. Contact : réseaux, copie, formulaire
     --------------------------------------------------------------- */
  function initContact() {
    const c = DATA.contact || {};
    const email = c.email || 'Sergearistidebaba225@gmail.com';
    const mailto = (subject, body) => `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const cta = $('#big-cta');
    if (cta) cta.href = mailto(c.mailSubject || 'Proposition de collaboration', c.mailBody || '');

    const socials = $('#socials');
    if (socials) socials.innerHTML = (DATA.socials || []).map((s) => s.url
      ? `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" data-cursor="Ouvrir">${esc(s.label)} ${icon('arrow-ur')}</a></li>`
      : `<li class="soon">${esc(s.label)} <small>· bientôt</small></li>`).join('');

    const copy = $('#copy-email');
    if (copy) copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(email);
        $('span', copy).textContent = 'Copié';
        $('use', copy).setAttribute('href', '#i-check');
        setTimeout(() => { $('span', copy).textContent = 'Copier'; $('use', copy).setAttribute('href', '#i-copy'); }, 2000);
      } catch (e) { window.location.href = 'mailto:' + email; }
    });

    const form = $('#contact-form');
    const status = $('#form-status');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const d = Object.fromEntries(new FormData(form).entries());
      const body = `Nom : ${d.name}\nE-mail : ${d.email}\nType de projet : ${d.type}\n\n${d.message}`;
      if (!c.formEndpoint) {
        window.location.href = mailto(`Projet — ${d.type} — ${d.name}`, body);
        status.textContent = 'Votre messagerie s’ouvre avec le message pré-rempli.';
        return;
      }
      const btn = $('button[type="submit"]', form);
      btn.disabled = true;
      $('.btn__txt', btn).textContent = 'Envoi…';
      try {
        const res = await fetch(c.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(d) });
        if (!res.ok) throw new Error();
        status.textContent = 'Merci ! Votre message a bien été envoyé.';
        form.reset();
      } catch (err) {
        status.textContent = `L’envoi a échoué. Écrivez directement à ${email}`;
      } finally {
        btn.disabled = false;
        $('.btn__txt', btn).textContent = 'Envoyer le message';
      }
    });
  }

  /* ---------------------------------------------------------------
     Démarrage
     --------------------------------------------------------------- */
  initProjects();
  initModal();
  initExpertise();
  initLab();
  initContact();
  initMenu();
  initPointer();
  initHero();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { moveIndicator(); onScroll(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);
  updateScroll();

  runIntro(initReveal);
})();
