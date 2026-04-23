
const COMPONENTS = {
  wall: {
    tag: 'WALL STRUCTURE',
    title: 'Zincalume\nWall Panels',
    image: 'assets/sheet-info.png',
    description: 'Corrugated Zincalume AZ150 wall sheets manufactured by Tata Bluescope to G300 Grade. The aluminium-zinc alloy coating provides 2–4× longer service life compared to standard galvanised steel. High solar reflectivity (67%) reduces internal heat gain significantly.',
    specs: [
      { key: 'Grade',       val: 'G300 · Az150' },
      { key: 'Thickness',   val: 'TCT 0.65 mm' },
      { key: 'Life Span',   val: '2–4× Galvanised' },
      { key: 'Reflectivity', val: '67% Solar Index' },
    ]
  },
  roof: {
    tag: 'ROOF SYSTEM',
    title: 'Corrugated\nZincalume Roof',
    image: 'assets/tankmaterials details.png',
    description: 'The roof consists of corrugated Zincalume sheets with a square lockable access hatch for safe inspection and maintenance. The top angle profile ensures structural rigidity. Colorbond colour options provide additional UV and corrosion protection.',
    specs: [
      { key: 'Material',  val: 'Zincalume AZ150' },
      { key: 'Access',    val: 'Square Lockable' },
      { key: 'Profile',   val: 'Top Angle' },
      { key: 'Finish',    val: 'Colorbond Available' },
    ]
  },
  nozzle: {
    tag: 'PIPING INTERFACE',
    title: 'Inlet / Outlet\nNozzles',
    image: 'assets/nozzels.png',
    description: 'Nozzle assemblies are engineered with a galvanised backing plate sized and bolted to comply with full nozzle load specifications. M12×30 GR 8.8 bolts with EPDM gaskets ensure leak-proof connections. An internal Infinity Liner fitting maintains full potable-grade integrity.',
    specs: [
      { key: 'Bolts',      val: 'M12×30 GR 8.8' },
      { key: 'Sealing',    val: 'EPDM Gasket' },
      { key: 'Liner Fit',  val: 'Infinity Liner' },
      { key: 'Compliance', val: 'Flange Spec.' },
    ]
  },
  liner: {
    tag: 'INTERNAL LINER',
    title: 'Infinity\nLiner System',
    image: 'assets/sheet-info.png',
    description: 'Exclusive to Shubham Kingspan Rhino Tanks — a 5-layer Japanese-manufactured liner certified to ANSI/NSF 61 for potable water storage. Outer layers use potable-grade UV-treated Metallocene film. The reinforced woven scrim 4th layer provides core structural strength, while Metallocene welded seams offer extra load and pressure resistance.',
    specs: [
      { key: 'Certification', val: 'ANSI / NSF 61' },
      { key: 'Layers',       val: '5-Layer Japanese' },
      { key: 'Outer Film',   val: 'Metallocene UV' },
      { key: 'Seam',         val: 'Metallocene Weld' },
    ]
  },
  foundation: {
    tag: 'FOUNDATION',
    title: 'Concrete Ring\nBeam Foundation',
    image: 'assets/foundation.png',
    description: 'Rhino Tanks are installed on a reinforced concrete ring beam with a compacted sand pad — or a fully concrete base — for rapid, cost-effective installation. The ring beam distributes the hydrostatic load evenly around the tank perimeter, eliminating differential settlement.',
    specs: [
      { key: 'Type',     val: 'Ring Beam + Pad' },
      { key: 'Base',     val: 'Concrete / Sand' },
      { key: 'Purpose',  val: 'Load Distribution' },
      { key: 'Install',  val: 'Quick & Cost-Eff.' },
    ]
  },
  ladder: {
    tag: 'ACCESS SYSTEM',
    title: 'External Caged\nSafety Ladder',
    image: 'assets/rct1.jpeg',
    description: 'The external caged ladder provides safe access to the roof hatch for inspection and maintenance operations. Constructed from hot-dip galvanised steel for maximum corrosion resistance in outdoor environments. Cage design complies with industrial safety standards for elevated work platforms.',
    specs: [
      { key: 'Material',  val: 'HDG Steel' },
      { key: 'Type',      val: 'External Caged' },
      { key: 'Access',    val: 'Roof Hatch' },
      { key: 'Standard',  val: 'Industrial Safety' },
    ]
  }
};

/* ─────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────── */
let activeId = null;
let panelOpen = false;
let linesAnimated = false;

/* ─────────────────────────────────────────────────────────
   DOM REFS
───────────────────────────────────────────────────────── */
const loader        = document.getElementById('loader');
const header        = document.getElementById('site-header');
const tankWrapper   = document.getElementById('tank-wrapper');
const tankImage     = document.getElementById('tank-image');
const detailPanel   = document.getElementById('detail-panel');
const panelClose    = document.getElementById('panel-close');
const panelTitle    = document.getElementById('panel-title');
const panelTag      = document.getElementById('panel-tag');
const panelImage    = document.getElementById('panel-image');
const panelDesc     = document.getElementById('panel-description');
const panelSpecs    = document.getElementById('panel-specs');
const bottomBar     = document.getElementById('bottom-bar');
const hotspots      = document.querySelectorAll('.hotspot');
const canvas        = document.getElementById('particle-canvas');

/* ─────────────────────────────────────────────────────────
   PARTICLES — lightweight floating dust
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
    const count = Math.floor((W * H) / 18000); // density
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
   PAGE LOAD SEQUENCE
───────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const tl = gsap.timeline();

  // 1. Hide loader
  tl.to(loader, {
    opacity: 0,
    duration: 0.6,
    delay: 1.2,
    ease: 'power2.inOut',
    onComplete: () => { loader.style.display = 'none'; }
  })

  // 2. Fade in header + bottom bar
  .to([header, bottomBar], {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.1
  }, '-=0.1')

  // 3. Tank appears — scale up from slightly smaller + fade
  .fromTo(tankWrapper,
    { opacity: 0, scale: 0.88, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'expo.out' },
    '-=0.4'
  )

  // 4. Animate annotation lines
  .add(() => { animateLines(); }, '-=0.2');

  // Subtle idle parallax on mouse move
  initParallax();
});

/* ─────────────────────────────────────────────────────────
   ANIMATE ANNOTATION LINES
   Each line: stroke-dashoffset 300 → 0, then label fades in
───────────────────────────────────────────────────────── */
function animateLines() {
  if (linesAnimated) return;
  linesAnimated = true;

  hotspots.forEach((hs, i) => {
    const line  = hs.querySelector('.line-path');
    const label = hs.querySelector('.hs-label');
    const delay = i * 0.18 + 0.1;

    gsap.to(line, {
      strokeDashoffset: 0,
      duration: 0.7,
      delay,
      ease: 'power2.out'
    });

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
   PARALLAX (mouse-based subtle tank drift)
───────────────────────────────────────────────────────── */
function initParallax() {
  document.addEventListener('mousemove', (e) => {
    if (panelOpen) return;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    gsap.to(tankWrapper, {
      x: dx * 12,
      y: dy * 8,
      duration: 1.6,
      ease: 'power1.out'
    });
  });
}

/* ─────────────────────────────────────────────────────────
   HOTSPOT CLICK → OPEN PANEL
───────────────────────────────────────────────────────── */
hotspots.forEach(hs => {
  hs.addEventListener('click', () => {
    const id = hs.dataset.id;
    openPanel(id, hs);
  });

  // Hover: highlight line
  hs.addEventListener('mouseenter', () => {
    if (hs.classList.contains('active')) return;
    gsap.to(hs.querySelector('.hs-dot'), {
      scale: 1.3, duration: 0.2, ease: 'power2.out'
    });
  });

  hs.addEventListener('mouseleave', () => {
    if (hs.classList.contains('active')) return;
    gsap.to(hs.querySelector('.hs-dot'), {
      scale: 1, duration: 0.3, ease: 'power2.inOut'
    });
  });
});



/* ─────────────────────────────────────────────────────────
   OPEN PANEL
───────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────
   OPEN FULL-SCREEN OVERLAY
   Replaces old side-panel openPanel()
───────────────────────────────────────────────────────── */
function openPanel(id, triggerHs) {
  const data = COMPONENTS[id];
  if (!data) return;

  activeId = id;

  // Mark active hotspot
  hotspots.forEach(h => h.classList.remove('active'));
  
  triggerHs.classList.add('active');
  const activeDot = document.querySelector(`.bd[data-id="${id}"]`);
  if (activeDot) activeDot.classList.add('active');

  // // Populate overlay content
  // document.getElementById('overlay-tag').textContent   = data.tag;
  // document.getElementById('overlay-title').textContent = data.title;
  // document.getElementById('overlay-image').src         = data.image;
  // document.getElementById('overlay-image').alt         = data.title;
  // document.getElementById('overlay-desc').textContent  = data.description;

  // // Build specs grid
  // document.getElementById('overlay-specs').innerHTML = data.specs.map(s => `
  //   <div class="spec-item">
  //     <span class="spec-key">${s.key}</span>
  //     <span class="spec-val">${s.val}</span>
  //   </div>
  // `).join('');

  // Populate overlay — image only
  document.getElementById('overlay-image').src = data.image;
  document.getElementById('overlay-image').alt = data.title;

  const overlay = document.getElementById('fs-overlay');
  const content = overlay.querySelector('.fs-content');
  const items   = overlay.querySelectorAll('.fs-animate');

  // Show overlay
  overlay.style.display = 'flex';
  panelOpen = true;
  document.body.classList.add('panel-open');

  // Disable hotspot pointer events while open
  hotspots.forEach(h => h.style.pointerEvents = 'none');

  // GSAP: fade in overlay, stagger content
  gsap.timeline()
    .fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.45, ease: 'power3.out' }
    )
    .fromTo(content,
      { scale: 0.96, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.55, ease: 'power3.out' },
      '-=0.25'
    )
    .fromTo(items,
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.07 },
      '-=0.35'
    );
}

/* ─────────────────────────────────────────────────────────
   ZOOM TANK TOWARD ACTIVE HOTSPOT
───────────────────────────────────────────────────────── */
function zoomTankToHotspot(hs) {
  const wrapRect = tankWrapper.getBoundingClientRect();
  const dotRect  = hs.querySelector('.hs-dot').getBoundingClientRect();

  // Hotspot position relative to tank center (normalised -0.5 to 0.5)
  const relX = (dotRect.left + 8 - wrapRect.left - wrapRect.width  / 2) / wrapRect.width;
  const relY = (dotRect.top  + 8 - wrapRect.top  - wrapRect.height / 2) / wrapRect.height;

  gsap.to(tankWrapper, {
    scale: 1.06,
    x: -relX * 40 - 60, // shift left so panel doesn't obscure
    y: -relY * 30,
    duration: 0.9,
    ease: 'expo.out'
  });
}

/* ─────────────────────────────────────────────────────────
   CLOSE PANEL
───────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────
   CLOSE FULL-SCREEN OVERLAY
   Replaces old side-panel closePanel()
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

      // Re-enable hotspot interactions
      hotspots.forEach(h => {
        h.style.pointerEvents = '';
        h.classList.remove('active');
      });
      document.body.classList.remove('panel-open');
    }
  });


}

panelClose.addEventListener('click', closePanel);

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePanel();
});

// Click on tank background also closes (not on hotspot)
tankWrapper.addEventListener('click', (e) => {
  if (!e.target.closest('.hotspot') && panelOpen) closePanel();
});

/* ─────────────────────────────────────────────────────────
   GSAP INITIAL STATES (before load animation runs)
───────────────────────────────────────────────────────── */
gsap.set(header,    { opacity: 0, y: -10 });
gsap.set(bottomBar, { opacity: 0 });
gsap.set(tankWrapper, { opacity: 0, scale: 0.88, y: 30 });

// Labels start invisible + shifted by 8px
document.querySelectorAll('.hs-label').forEach(lbl => {
  gsap.set(lbl, { opacity: 0, x: lbl.classList.contains('hs-label--left') ? 8 : -8 });
});

document.getElementById('liner-trigger').addEventListener('click', () => {
  // Directly open the liner image overlay
  const overlay = document.getElementById('fs-overlay');
  const content = overlay.querySelector('.fs-content');
  const img     = document.getElementById('overlay-image');

  img.src = 'assets/linerdetails.png';
  img.alt = 'Infinity Liner System';

  overlay.style.display = 'flex';
  panelOpen = true;
  document.body.classList.add('panel-open');
  hotspots.forEach(h => h.style.pointerEvents = 'none');

  gsap.timeline()
    .fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.45, ease: 'power3.out' }
    )
    .fromTo(content,
      { scale: 0.96, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.55, ease: 'power3.out' },
      '-=0.25'
    )
    .fromTo(img,
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.35'
    );
});

/* ─────────────────────────────────────────────────────────
   SMALL AMBIENT GLOW PULSE on tank
───────────────────────────────────────────────────────── */
gsap.to('#tank-glow', {
  opacity: 0.5,
  scale: 1.05,
  duration: 3,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1
});

/* ─────────────────────────────────────────────────────────
   HOTSPOT DOT IDLE ANIMATION VARIATION
   Give each dot a slightly different pulse phase
───────────────────────────────────────────────────────── */
hotspots.forEach((hs, i) => {
  // Stagger the CSS animation start
  const dot = hs.querySelector('.hs-dot');
  dot.style.animationDelay = `${i * 0.4}s`;
});

console.log('%c RHINO TANKS EXPERIENCE CENTER ', 'background:#00d4ff;color:#080a0e;font-weight:bold;padding:4px 8px;');
console.log('%c Click any hotspot to explore the tank components.', 'color:#5a6478');