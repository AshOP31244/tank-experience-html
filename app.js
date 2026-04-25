/* ═══════════════════════════════════════════════════════════
   RHINO TANKS EXPERIENCE CENTER — app.js
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────
   TANK CONFIGS
   labelX: extra horizontal nudge in px (negative = more left)
   labelY: extra vertical nudge in px   (negative = up)
   lineLength: SVG viewBox width (default 140)
───────────────────────────────────────────────────────── */
const TANKS = {
  RCT: {
    image:     'assets/Hitech, Gujrat.jpg',
    showLiner: true,
    sizeClass: 'tank-size-rct',
    navLabel:  'RHINO COMMERCIAL TANK',
    navSub:    'RCT SERIES',
    rightLogo: 'assets/rct-logo.png',
    hotspots: [
      {
        id: 'foundation', top: 88, left: 76,
        label: 'Concrete Ring Foundation',
        sublabel: 'Ring Beam + Compacted Sand Pad',
        side: 'right', labelX: 0, labelY: 0,
        image: 'assets/foundation.png'
      },
      {
        id: 'wall', top: 50, left: 20,
        label: 'Zincalume Wall Sheet', sublabel: '',
        side: 'left', labelX: 0, labelY: 0,
        image: 'assets/sheet-info.png'
      },
      {
        id: 'nozzle', top: 80, left: 41,
        label: 'Anti-Vortex Assembly',
        sublabel: 'example text for info',
        side: 'left', labelX: 0, labelY: 0,
        image: 'assets/nozzels.png'
      }
    ]
  },

  SST: {
    image:     'assets/sst.jpeg',
    showLiner: false,
    sizeClass: 'tank-size-sst',
    navLabel:  'SECURESTORE TANK',
    navSub:    'SST SERIES',
    rightLogo: 'assets/sst-logo.png',
    hotspots: [
      {
        id: 'sst-foundation', top: 92, left: 48,
        label: 'CutSlot Foundation',
        sublabel: 'Reinforced Base Structure',
        side: 'left', lineLength: 180,
        labelX: -160, labelY: 0,
        image: 'assets/sstfoundation.png'
      },
      {
        id: 'sst-body', top: 52, left: 50,
        label: 'Microcoated Technology',
        sublabel: 'Grade 304 / 316 Available',
        side: 'right', labelX: 0, labelY: 0,
        image: 'assets/sstinfo.png'
      }
    ]
  },

  FM: {
    image:     'assets/fm_tank.png',
    showLiner: true,
    sizeClass: 'tank-size-fm',
    navLabel:  'FM APPROVED FIRE WATER TANK',
    navSub:    'FM SERIES',
    rightLogo: 'assets/fm-logo.png',
    hotspots: [
      {
        id: 'fm-panel', top: 40, left: 55,
        label: 'FM Wall Panel',
        sublabel: 'Galvanized Iron Steel Sheet',
        side: 'right', labelX: 0, labelY: 0,
        image: 'assets/fm.png'
      },
      {
        id: 'fm-base', top: 90, left: 30,
        label: 'RingBeam Foundation',
        sublabel: 'Modular Ring Foundation',
        side: 'left', labelX:-40, labelY: 0,
        image: 'assets/foundation.png'
      }
    ]
  }
};

/* ─────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────── */
let currentTank = 'RCT';
let panelOpen   = false;

/* ─────────────────────────────────────────────────────────
   DOM REFS
───────────────────────────────────────────────────────── */
const loader       = document.getElementById('loader');
const header       = document.getElementById('site-header');
const tankWrapper  = document.getElementById('tank-wrapper');
const tankImage    = document.getElementById('tank-image');
const bottomBar    = document.getElementById('bottom-bar');
const linerTrigger = document.getElementById('liner-trigger');
const canvas       = document.getElementById('particle-canvas');
const tankToggle   = document.getElementById('tank-toggle');

/* ─────────────────────────────────────────────────────────
   PARTICLES
───────────────────────────────────────────────────────── */
(function initParticles() {
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((W * H) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(Math.random() * 0.2 + 0.05),
        alpha: Math.random() * 0.4 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.y < -4)  p.y = H + 4;
      if (p.x < -4)  p.x = W + 4;
      if (p.x > W+4) p.x = -4;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize(); createParticles(); draw();
})();

/* ─────────────────────────────────────────────────────────
   UPDATE NAV — plain DOM swap, no GSAP
───────────────────────────────────────────────────────── */
function updateNav(type) {
  const c = TANKS[type];
  document.getElementById('tank-type-label').textContent = c.navLabel;
  document.getElementById('right-logo').src              = c.rightLogo;
}

/* ─────────────────────────────────────────────────────────
   RENDER HOTSPOTS
   Label position controlled by CSS + per-hotspot labelX/labelY
───────────────────────────────────────────────────────── */
function renderHotspots(tankType) {
  tankWrapper.querySelectorAll('.hotspot').forEach(el => el.remove());

  TANKS[tankType].hotspots.forEach((hs, i) => {
    const isLeft = hs.side === 'left';
    const len    = hs.lineLength || 140;
    const lx     = hs.labelX || 0;
    const ly     = hs.labelY || 0;

    const div = document.createElement('div');
    div.className  = 'hotspot';
    div.dataset.id = hs.id;
    div.style.top  = `${hs.top}%`;
    div.style.left = `${hs.left}%`;

    div.innerHTML = `
      <div class="hs-dot" style="animation-delay:${i * 0.4}s"></div>
      <svg class="hs-line ${isLeft ? 'hs-line--left' : 'hs-line--right'}"
           viewBox="0 0 ${len} 40" xmlns="http://www.w3.org/2000/svg">
        <line class="line-path" x1="${len}" y1="20" x2="10" y2="20"/>
      </svg>
      <div class="hs-label ${isLeft ? 'hs-label--left' : ''}"
           style="transform: translateY(calc(-50% + ${ly}px)) translateX(${lx}px); opacity:0;">
        <span class="label-title">${hs.label}</span>
        ${hs.sublabel ? `<span class="label-sub">${hs.sublabel}</span>` : ''}
      </div>
    `;

    div.addEventListener('click', () => openPanel(hs.id, div, hs.image));
    div.addEventListener('mouseenter', () => {
      if (div.classList.contains('active')) return;
      gsap.to(div.querySelector('.hs-dot'), { scale: 1.3, duration: 0.2, ease: 'power2.out' });
    });
    div.addEventListener('mouseleave', () => {
      if (div.classList.contains('active')) return;
      gsap.to(div.querySelector('.hs-dot'), { scale: 1, duration: 0.3, ease: 'power2.inOut' });
    });

    tankWrapper.appendChild(div);
  });

  animateLines();
}

/* ─────────────────────────────────────────────────────────
   ANIMATE LINES + FADE IN LABELS
───────────────────────────────────────────────────────── */
function animateLines() {
  tankWrapper.querySelectorAll('.hotspot').forEach((hs, i) => {
    const line  = hs.querySelector('.line-path');
    const label = hs.querySelector('.hs-label');
    const delay = i * 0.18 + 0.1;

    gsap.set(line, { strokeDashoffset: 300 });
    gsap.to(line,  { strokeDashoffset: 0, duration: 0.7, delay, ease: 'power2.out' });
    gsap.to(label, { opacity: 1, duration: 0.4, delay: delay + 0.5, ease: 'power2.out' });
  });
}

/* ─────────────────────────────────────────────────────────
   SWITCH TANK
───────────────────────────────────────────────────────── */
function switchTank(type) {
  if (type === currentTank) return;
  if (panelOpen) closePanel();

  currentTank = type;
  const config = TANKS[type];

  tankToggle.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tank === type);
  });

  document.body.classList.remove('tank-rct', 'tank-sst', 'tank-fm');
  document.body.classList.add(`tank-${type.toLowerCase()}`);

  updateNav(type);

  gsap.to(tankWrapper, {
    opacity: 0, scale: 0.94, duration: 0.3, ease: 'power2.in',
    onComplete: () => {
      tankImage.src = config.image;
      tankWrapper.classList.remove('tank-size-rct', 'tank-size-sst', 'tank-size-fm');
      tankWrapper.classList.add(config.sizeClass);
      linerTrigger.style.display = config.showLiner ? '' : 'none';
      renderHotspots(type);
      gsap.to(tankWrapper, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
    }
  });
}

/* ─────────────────────────────────────────────────────────
   TOGGLE CLICK HANDLER
───────────────────────────────────────────────────────── */
tankToggle.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTank(btn.dataset.tank));
});

/* ─────────────────────────────────────────────────────────
   PAGE LOAD
───────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  document.body.classList.add('tank-rct');
  tankWrapper.classList.add('tank-size-rct');
  renderHotspots('RCT');

  gsap.set(header,      { opacity: 0, y: -10 });
  gsap.set(bottomBar,   { opacity: 0 });
  gsap.set(tankWrapper, { opacity: 0, scale: 0.88, y: 30 });

  gsap.timeline()
    .to(loader, {
      opacity: 0, duration: 0.6, delay: 1.2, ease: 'power2.inOut',
      onComplete: () => { loader.style.display = 'none'; }
    })
    .to([header, bottomBar], {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1
    }, '-=0.1')
    .fromTo(tankWrapper,
      { opacity: 0, scale: 0.88, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'expo.out' },
      '-=0.4'
    )
    .add(() => { animateLines(); }, '-=0.2');

  initParallax();
});

/* ─────────────────────────────────────────────────────────
   PARALLAX
───────────────────────────────────────────────────────── */
function initParallax() {
  document.addEventListener('mousemove', (e) => {
    if (panelOpen) return;
    const dx = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2);
    const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    gsap.to(tankWrapper, { x: dx * 12, y: dy * 8, duration: 1.6, ease: 'power1.out' });
  });
}

/* ─────────────────────────────────────────────────────────
   OPEN OVERLAY
───────────────────────────────────────────────────────── */
function openPanel(id, triggerEl, imageSrc) {
  tankWrapper.querySelectorAll('.hotspot').forEach(h => h.classList.remove('active'));
  triggerEl.classList.add('active');

  const overlay = document.getElementById('fs-overlay');
  const content = overlay.querySelector('.fs-content');
  const img     = document.getElementById('overlay-image');

  img.src = imageSrc;
  img.alt = id;
  overlay.style.display = 'flex';
  panelOpen = true;
  document.body.classList.add('panel-open');
  tankWrapper.querySelectorAll('.hotspot').forEach(h => h.style.pointerEvents = 'none');
  tankToggle.style.pointerEvents = 'none';

  gsap.timeline()
    .fromTo(overlay,  { opacity: 0 },              { opacity: 1, duration: 0.4, ease: 'power3.out' })
    .fromTo(content,  { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2')
    .fromTo(img,      { y: 20, opacity: 0 },        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.3');
}

/* ─────────────────────────────────────────────────────────
   CLOSE OVERLAY
───────────────────────────────────────────────────────── */
function closePanel() {
  if (!panelOpen) return;
  const overlay = document.getElementById('fs-overlay');

  gsap.to(overlay, {
    opacity: 0, duration: 0.35, ease: 'power2.in',
    onComplete: () => {
      overlay.style.display = 'none';
      panelOpen = false;
      tankWrapper.querySelectorAll('.hotspot').forEach(h => {
        h.style.pointerEvents = '';
        h.classList.remove('active');
      });
      tankToggle.style.pointerEvents = '';
      document.body.classList.remove('panel-open');
    }
  });
}

document.getElementById('panel-close').addEventListener('click', closePanel);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });
tankWrapper.addEventListener('click', (e) => {
  if (!e.target.closest('.hotspot') && panelOpen) closePanel();
});

/* ─────────────────────────────────────────────────────────
   INFINITY LINER
───────────────────────────────────────────────────────── */
linerTrigger.addEventListener('click', () => {
  const overlay = document.getElementById('fs-overlay');
  const content = overlay.querySelector('.fs-content');
  const img     = document.getElementById('overlay-image');

  img.src = 'assets/linerdetails.png';
  img.alt = 'Infinity Liner System';
  overlay.style.display = 'flex';
  panelOpen = true;
  document.body.classList.add('panel-open');
  tankWrapper.querySelectorAll('.hotspot').forEach(h => h.style.pointerEvents = 'none');
  tankToggle.style.pointerEvents = 'none';

  gsap.timeline()
    .fromTo(overlay,  { opacity: 0 },              { opacity: 1, duration: 0.4, ease: 'power3.out' })
    .fromTo(content,  { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2')
    .fromTo(img,      { y: 20, opacity: 0 },        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.3');
});

/* ─────────────────────────────────────────────────────────
   AMBIENT GLOW
───────────────────────────────────────────────────────── */
gsap.to('#tank-glow', {
  opacity: 0.5, scale: 1.05, duration: 3,
  ease: 'sine.inOut', yoyo: true, repeat: -1
});

console.log('%c RHINO TANKS EXPERIENCE CENTER ', 'background:#00d4ff;color:#080a0e;font-weight:bold;padding:4px 8px;');