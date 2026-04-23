/* ═══════════════════════════════════════════════════════════
   RHINO TANKS EXPERIENCE CENTER — app.js
   Multi-tank refactor: RCT · SST · FM
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────
   TANK CONFIGS
   Each entry: image path, showLiner flag, hotspot array
   Hotspot fields: id, top%, left%, label, sublabel, side ('left'|'right'), image
───────────────────────────────────────────────────────── */
const TANKS = {
  RCT: {
    image: 'assets/Hitech, Gujrat.jpg',
    showLiner: true,
    sizeClass: 'tank-size-rct',
    hotspots: [
      {
        id: 'foundation',
        top: 88, left: 70,
        label: 'Concrete Ring Foundation',
        sublabel: 'Ring Beam + Compacted Sand Pad',
        side: 'right',
        image: 'assets/foundation.png'
      },
      {
        id: 'wall',
        top: 50, left: 20,
        label: 'Zincalume Wall Sheet',
        sublabel: '',
        side: 'left',
        image: 'assets/sheet-info.png'
      },
      {
        id: 'nozzle',
        top: 80, left: 41,
        label: 'Anti-Vortex Assembly',
        sublabel: 'example text for info',
        side: 'left',
        image: 'assets/nozzels.png'
      }
    ]
  },

  SST: {
    image: 'assets/sst.jpeg',
    showLiner: false,
    sizeClass: 'tank-size-sst',
    hotspots: [
      {
        id: 'sst-foundation',
        top: 92, left: 48,
        label: 'CutSlot Foundation',
        sublabel: 'Reinforced Base Structure',
        side: 'right',
        image: 'assets/sstfoundation.png'
      },
      {
        id: 'sst-body',
        top: 52, left: 50,
        label: 'Microcoated Technology',
        sublabel: 'Grade 304 / 316 Available',
        side: 'right',
        image: 'assets/sstinfo.png'
      }
    ]
  },

  FM: {
    image: 'assets/fm_tank.png',
    showLiner: true,
    sizeClass: 'tank-size-fm',
    hotspots: [
      {
        id: 'fm-panel',
        top: 40, left: 65,
        label: 'FM Wall Panel',
        sublabel: 'Corrugated Zincalume AZ150',
        side: 'right',
        image: 'assets/fm.png'
      },
      {
        id: 'fm-base',
        top: 90, left: 30,
        label: 'RingBeam Foundation',
        sublabel: 'Modular Ring Foundation',
        side: 'left',
        image: 'assets/foundation.png'
      }
    ]
  }
};

/* ─────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────── */
let currentTank  = 'RCT';
let activeId     = null;
let panelOpen    = false;
let linesAnimated = false;

/* ─────────────────────────────────────────────────────────
   DOM REFS (static elements only)
───────────────────────────────────────────────────────── */
const loader       = document.getElementById('loader');
const header       = document.getElementById('site-header');
const tankWrapper  = document.getElementById('tank-wrapper');
const tankImage    = document.getElementById('tank-image');
const detailPanel  = document.getElementById('detail-panel');
const panelClose   = document.getElementById('panel-close');
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
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 1.2 + 0.3,
        vx:    (Math.random() - 0.5) * 0.15,
        vy:   -(Math.random() * 0.2 + 0.05),
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
      p.x += p.vx;
      p.y += p.vy;
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
   HOTSPOT RENDERING
   Clears existing hotspots and injects new ones for tankType
───────────────────────────────────────────────────────── */
function renderHotspots(tankType) {
  // Remove all existing hotspots
  tankWrapper.querySelectorAll('.hotspot').forEach(el => el.remove());

  const config = TANKS[tankType];
  linesAnimated = false;

  config.hotspots.forEach(hs => {
    const isLeft = hs.side === 'left';

    const div = document.createElement('div');
    div.className = 'hotspot';
    div.dataset.id = hs.id;
    div.style.top  = `${hs.top}%`;
    div.style.left = `${hs.left}%`;

    div.innerHTML = `
      <div class="hs-dot"></div>
      <svg class="hs-line ${isLeft ? 'hs-line--left' : 'hs-line--right'}" viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg">
        <line class="line-path" x1="140" y1="20" x2="10" y2="20"/>
      </svg>
      <div class="hs-label ${isLeft ? 'hs-label--left' : ''}">
        <span class="label-title">${hs.label}</span>
        ${hs.sublabel ? `<span class="label-sub">${hs.sublabel}</span>` : ''}
      </div>
    `;

    // Attach click + hover events
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

  // Init GSAP states for new labels
  tankWrapper.querySelectorAll('.hs-label').forEach(lbl => {
    gsap.set(lbl, { opacity: 0, x: lbl.classList.contains('hs-label--left') ? 8 : -8 });
  });

  // Stagger dot pulse phases
  tankWrapper.querySelectorAll('.hotspot').forEach((hs, i) => {
    hs.querySelector('.hs-dot').style.animationDelay = `${i * 0.4}s`;
  });
}

/* ─────────────────────────────────────────────────────────
   ANIMATE ANNOTATION LINES
───────────────────────────────────────────────────────── */
function animateLines() {
  if (linesAnimated) return;
  linesAnimated = true;

  tankWrapper.querySelectorAll('.hotspot').forEach((hs, i) => {
    const line  = hs.querySelector('.line-path');
    const label = hs.querySelector('.hs-label');
    const delay = i * 0.18 + 0.1;

    gsap.to(line, { strokeDashoffset: 0, duration: 0.7, delay, ease: 'power2.out' });
    gsap.to(label, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      delay: delay + 0.5,
      ease: 'power3.out'
    });
  });
}

/* ─────────────────────────────────────────────────────────
   SWITCH TANK
───────────────────────────────────────────────────────── */
function switchTank(type) {
  if (type === currentTank) return;

  // Close any open panel first
  if (panelOpen) closePanel();

  currentTank = type;
  const config = TANKS[type];

  // Fade tank out → swap → fade in
  gsap.to(tankWrapper, {
    opacity: 0,
    scale: 0.94,
    duration: 0.35,
    ease: 'power2.in',
    onComplete: () => {
      // Swap image
      tankImage.src = config.image;

      // Apply per-tank size class
      tankWrapper.classList.remove('tank-size-rct', 'tank-size-sst', 'tank-size-fm');
      tankWrapper.classList.add(config.sizeClass);

      // Re-render hotspots
      renderHotspots(type);

      // Toggle Infinity Liner button
      linerTrigger.style.display = config.showLiner ? '' : 'none';

      // Fade back in
      gsap.to(tankWrapper, {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: 'expo.out',
        onComplete: animateLines
      });
    }
  });

  // Update toggle button active states
  tankToggle.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tank === type);
  });
}

/* ─────────────────────────────────────────────────────────
   TOGGLE CLICK HANDLER
───────────────────────────────────────────────────────── */
tankToggle.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTank(btn.dataset.tank));
});

/* ─────────────────────────────────────────────────────────
   PAGE LOAD SEQUENCE
───────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  // Render initial RCT hotspots
  renderHotspots('RCT');
  tankWrapper.classList.add('tank-size-rct');

  const tl = gsap.timeline();

  tl.to(loader, {
    opacity: 0,
    duration: 0.6,
    delay: 1.2,
    ease: 'power2.inOut',
    onComplete: () => { loader.style.display = 'none'; }
  })
  .to([header, bottomBar], {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.1
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
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    gsap.to(tankWrapper, { x: dx * 12, y: dy * 8, duration: 1.6, ease: 'power1.out' });
  });
}

/* ─────────────────────────────────────────────────────────
   OPEN FULL-SCREEN OVERLAY
───────────────────────────────────────────────────────── */
function openPanel(id, triggerEl, imageSrc) {
  activeId = id;

  // Mark active hotspot
  tankWrapper.querySelectorAll('.hotspot').forEach(h => h.classList.remove('active'));
  triggerEl.classList.add('active');

  // Set image
  document.getElementById('overlay-image').src = imageSrc;
  document.getElementById('overlay-image').alt = id;

  const overlay = document.getElementById('fs-overlay');
  const content = overlay.querySelector('.fs-content');
  const img     = document.getElementById('overlay-image');

  overlay.style.display = 'flex';
  panelOpen = true;
  document.body.classList.add('panel-open');

  tankWrapper.querySelectorAll('.hotspot').forEach(h => h.style.pointerEvents = 'none');
  tankToggle.style.pointerEvents = 'none';

  gsap.timeline()
    .fromTo(overlay,  { opacity: 0 },                { opacity: 1, duration: 0.45, ease: 'power3.out' })
    .fromTo(content,  { scale: 0.96, opacity: 0 },   { scale: 1, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.25')
    .fromTo(img,      { y: 22, opacity: 0 },          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.35');
}

/* ─────────────────────────────────────────────────────────
   CLOSE FULL-SCREEN OVERLAY
───────────────────────────────────────────────────────── */
function closePanel() {
  if (!panelOpen) return;

  const overlay = document.getElementById('fs-overlay');

  gsap.to(overlay, {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: () => {
      overlay.style.display = 'none';
      panelOpen = false;
      activeId  = null;

      tankWrapper.querySelectorAll('.hotspot').forEach(h => {
        h.style.pointerEvents = '';
        h.classList.remove('active');
      });
      tankToggle.style.pointerEvents = '';
      document.body.classList.remove('panel-open');
    }
  });
}

/* ─────────────────────────────────────────────────────────
   PANEL CLOSE BUTTON + KEYBOARD + BACKDROP
───────────────────────────────────────────────────────── */
panelClose.addEventListener('click', closePanel);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });
tankWrapper.addEventListener('click', (e) => {
  if (!e.target.closest('.hotspot') && panelOpen) closePanel();
});

/* ─────────────────────────────────────────────────────────
   INFINITY LINER BUTTON
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
    .fromTo(overlay,  { opacity: 0 },              { opacity: 1, duration: 0.45, ease: 'power3.out' })
    .fromTo(content,  { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.25')
    .fromTo(img,      { y: 22, opacity: 0 },        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.35');
});

/* ─────────────────────────────────────────────────────────
   GSAP INITIAL STATES
───────────────────────────────────────────────────────── */
gsap.set(header,    { opacity: 0, y: -10 });
gsap.set(bottomBar, { opacity: 0 });
gsap.set(tankWrapper, { opacity: 0, scale: 0.88, y: 30 });

/* ─────────────────────────────────────────────────────────
   AMBIENT GLOW PULSE
───────────────────────────────────────────────────────── */
gsap.to('#tank-glow', {
  opacity: 0.5,
  scale: 1.05,
  duration: 3,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1
});

console.log('%c RHINO TANKS EXPERIENCE CENTER ', 'background:#00d4ff;color:#080a0e;font-weight:bold;padding:4px 8px;');
console.log('%c Click any hotspot to explore. Use RCT / SST / FM toggle to switch tanks.', 'color:#5a6478');