/* =========================================================
   MAHALAXMI ACADEMY — main.js  (Multi-page version)
   Animations · Interactivity · Scroll Effects · Mobile UX
   ========================================================= */
'use strict';

window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('done');
    setTimeout(() => loader.remove(), 600);
  }
  initAll();
});

function initAll() {
  initMobileMenu();
  initSmoothScroll();
  initNavScroll();
  initScrollReveal();
  initCounters();
  initLightbox();
  initRipple();
  initParallax();
  initFormEnhancements();
  initBackToTop();
  initActiveNav();
  initCardTilt();
  initCursorGlow();
  initScrollProgress();
}

/* ── 1. MOBILE MENU ── */
function initMobileMenu() {
  const burger   = document.getElementById('burger');
  const mobileNav= document.getElementById('mobile-nav');
  const overlay  = document.getElementById('nav-overlay');
  if (!burger || !mobileNav) return;

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    burger.setAttribute('aria-expanded', open);
  });
  overlay.addEventListener('click', closeMenu);
  mobileNav.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));

  function closeMenu() {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', false);
  }
}

/* ── 2. SMOOTH SCROLL (anchor links on same page) ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector('body > nav')?.offsetHeight || 64;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 16, behavior: 'smooth' });
    });
  });
}

/* ── 3. NAV SHRINK ON SCROLL ── */
function initNavScroll() {
  const nav = document.querySelector('body > nav');
  if (!nav) return;
  const fn = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', fn, { passive: true });
  fn();
}

/* ── 4. SCROLL REVEAL ── */
function initScrollReveal() {
  const sel = '.card,.g-item,.vid-card,.soc-card,.step,.feat-list li,' +
              '.ii,.info-row,.courses-hdr,.gallery-hdr,.sec-label,h2,' +
              '.enq-form,.info-card,.contact-info,.map-embed,.page-hero-inner';
  const els = document.querySelectorAll(sel);
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }});
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach((el, i) => {
    el.classList.add('reveal');
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = `${Math.min(sibs.indexOf(el) * 0.07, 0.45)}s`;
    obs.observe(el);
  });
}

/* ── 5. COUNTERS ── */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const suffix = raw.replace(/[\d]/g, '');
      const target = parseInt(raw.replace(/\D/g, ''), 10);
      if (!target) return;
      obs.unobserve(el);
      const step = ts => {
        if (!step.s) step.s = ts;
        const p = Math.min((ts - step.s) / 2000, 1);
        el.textContent = Math.round((1 - Math.pow(1-p,4)) * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-n').forEach(c => obs.observe(c));
}

/* ── 6. LIGHTBOX ── */
function initLightbox() {
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lb-img');
  if (!lb || !lbImg) return;

  const imgs = [...document.querySelectorAll('.g-item img, .hero-collage img')];
  let idx = 0;

  imgs.forEach((img, i) => img.addEventListener('click', () => open(i)));
  document.querySelectorAll('.g-item').forEach((item, i) => {
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(i); });
  });

  function open(i) {
    idx = i;
    lbImg.src = ''; lbImg.classList.add('loading');
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
    const t = new Image();
    t.onload = () => { lbImg.src = imgs[idx].src; lbImg.classList.remove('loading'); };
    t.src = imgs[i].src;
  }
  function close() {
    lb.classList.remove('open'); document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }
  function prev() { open((idx - 1 + imgs.length) % imgs.length); }
  function next() { open((idx + 1) % imgs.length); }

  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.getElementById('lb-close')?.addEventListener('click', close);
  document.getElementById('lb-prev')?.addEventListener('click', e => { e.stopPropagation(); prev(); });
  document.getElementById('lb-next')?.addEventListener('click', e => { e.stopPropagation(); next(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const d = sx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) d > 0 ? next() : prev();
  });
}

/* ── 7. RIPPLE ── */
function initRipple() {
  document.querySelectorAll('.btn-primary,.btn-outline,.form-btn,.nav-cta,.soc-card').forEach(el => {
    el.addEventListener('click', function(e) {
      const r = this.getBoundingClientRect();
      const s = document.createElement('span');
      s.className = 'ripple';
      s.style.cssText = `left:${e.clientX-r.left}px;top:${e.clientY-r.top}px`;
      this.appendChild(s);
      setTimeout(() => s.remove(), 700);
    });
  });
}

/* ── 8. PARALLAX ── */
function initParallax() {
  const hero = document.querySelector('.hero, .page-hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  window.addEventListener('scroll', () => {
    hero.style.setProperty('--parallax-y', `${window.scrollY * 0.3}px`);
  }, { passive: true });
}

/* ── 9. FORM ── */
function initFormEnhancements() {
  document.querySelectorAll('.fg input,.fg select,.fg textarea').forEach(inp => {
    inp.addEventListener('focus', () => inp.parentElement.classList.add('focused'));
    inp.addEventListener('blur', () => { if (!inp.value) inp.parentElement.classList.remove('focused'); });
  });
  const btn = document.querySelector('.form-btn');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    const name   = document.querySelector('.fg input[type="text"]');
    const phone  = document.querySelector('.fg input[type="tel"]');
    const course = document.querySelector('#enq-course');
    let valid = true;
    [name, phone, course].forEach(el => {
      if (!el) return;
      el.parentElement.classList.remove('error');
      if (!el.value.trim() || el.value === '') { el.parentElement.classList.add('error'); valid = false; }
    });
    if (!valid) { btn.classList.add('shake'); setTimeout(() => btn.classList.remove('shake'), 600); return; }
    btn.textContent = '✓ Submitted!';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    btn.disabled = true;
    showToast('🎉 Thank you! We will contact you within 24 hours.\n📞 97842-83986 / 96804-23986');
    setTimeout(() => {
      btn.textContent = 'Submit Enquiry →'; btn.style.background = ''; btn.disabled = false;
      [name, phone, course].forEach(el => { if (el) el.value = ''; });
    }, 4000);
  });
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 4000);
}

/* ── 10. BACK TO TOP ── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── 11. ACTIVE NAV (per-page highlight) ── */
function initActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('body > nav .nav-links a, #mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
  // Also highlight anchor-based sections on same page
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('body > nav .nav-links a, #mobile-nav a').forEach(l => {
          if (l.getAttribute('href') === `#${entry.target.id}`) l.classList.add('active');
          else if (l.getAttribute('href').startsWith('#')) l.classList.remove('active');
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => obs.observe(s));
}

/* ── 12. CARD TILT ── */
function initCardTilt() {
  if (window.matchMedia('(hover:none)').matches) return;
  document.querySelectorAll('.card,.soc-card,.vid-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y*6}deg) rotateY(${x*6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}

/* ── 13. CURSOR GLOW ── */
function initCursorGlow() {
  if (window.matchMedia('(hover:none)').matches) return;
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  document.body.appendChild(glow);
  let mx=0,my=0,cx=0,cy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function loop() { cx+=(mx-cx)*.1; cy+=(my-cy)*.1; glow.style.transform=`translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
  document.querySelectorAll('a,button,.card,.soc-card,.g-item').forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('big'));
    el.addEventListener('mouseleave', () => glow.classList.remove('big'));
  });
}

/* ── 14. SCROLL PROGRESS BAR ── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    bar.style.width = `${(window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%`;
  }, { passive: true });
}
