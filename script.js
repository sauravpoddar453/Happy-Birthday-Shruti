/* 
  Happy Birthday Shruti - Handcrafted Scrapbook (Read-Only Present Edition)
  3D Tilt Photo Engine, Floating Heart Animations & "Baar Baar Din Ye Aaye" Audio Engine
*/

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initPopSurprises();
  initCandles();
  initPolaroidWall();
  initPolaroid3DTilt();
  initAutoPlayMusic();
});

/* Particle Canvas Engine */
let canvas, ctx, particles = [];

function initParticles() {
  canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  for (let i = 0; i < 45; i++) {
    particles.push(createParticle());
  }
  animateParticles();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle(x, y, isBurst = false) {
  const colors = ['#fbbf24', '#f43f5e', '#a855f7', '#38ef7d', '#38bdf8'];
  return {
    x: x !== undefined ? x : Math.random() * canvas.width,
    y: y !== undefined ? y : Math.random() * canvas.height,
    vx: isBurst ? (Math.random() - 0.5) * 10 : (Math.random() - 0.5) * 1.2,
    vy: isBurst ? (Math.random() - 0.5) * 10 : Math.random() * 1.2 + 0.3,
    radius: isBurst ? Math.random() * 5 + 3 : Math.random() * 2.5 + 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1,
    decay: isBurst ? Math.random() * 0.02 + 0.015 : 0,
    rotation: Math.random() * Math.PI * 2,
    vRot: (Math.random() - 0.5) * 0.1
  };
}

function triggerConfettiBurst(x, y, count = 70) {
  const posX = x !== undefined ? x : window.innerWidth / 2;
  const posY = y !== undefined ? y : window.innerHeight / 2;
  for (let i = 0; i < count; i++) {
    particles.push(createParticle(posX, posY, true));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.vRot;

    if (p.decay > 0) {
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }
    } else {
      if (p.y > canvas.height) p.y = -10;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  requestAnimationFrame(animateParticles);
}


/* 3D TILT EFFECT & FLOATING HEART EXPLOSION ON PHOTO CLICK */
function initPolaroid3DTilt() {
  const polaroids = document.querySelectorAll('.polaroid-item');

  polaroids.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -14;
      const rotateY = ((x - centerX) / centerX) * 14;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

function spawnFloatingHearts(x, y) {
  const heartEmojis = ['💖', '✨', '🌸', '⭐', '🎉', '💖'];
  for (let i = 0; i < 5; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = `${x + (Math.random() - 0.5) * 50}px`;
    heart.style.top = `${y + (Math.random() - 0.5) * 30}px`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1200);
  }
}


/* Web Audio Cassette Synth & Auto-Play Engine */
let audioCtx = null;
let isPlayingTune = false;
let tuneTimeout = null;

function initAutoPlayMusic() {
  const triggerAutoPlay = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isPlayingTune) {
      startTune();
    }
    document.removeEventListener('click', triggerAutoPlay);
    document.removeEventListener('touchstart', triggerAutoPlay);
    document.removeEventListener('scroll', triggerAutoPlay);
  };

  document.addEventListener('click', triggerAutoPlay, { once: true });
  document.addEventListener('touchstart', triggerAutoPlay, { once: true });
  document.addEventListener('scroll', triggerAutoPlay, { once: true });
}

function playPopSFX() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(750, audioCtx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

function playBlowSFX() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const bufferSize = audioCtx.sampleRate * 0.35;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

  noise.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
}

function playChimeSFX() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + idx * 0.08);
    osc.stop(audioCtx.currentTime + idx * 0.08 + 0.3);
  });
}

/* "BAAR BAAR DIN YE AAYE" CLASSIC HINDI BIRTHDAY SONG FREQUENCY SEQUENCE */
const baarBaarNotes = [
  { note: 392.00, duration: 0.35 }, { note: 392.00, duration: 0.35 },
  { note: 440.00, duration: 0.35 }, { note: 392.00, duration: 0.35 },
  { note: 349.23, duration: 0.6 },  { note: 329.63, duration: 0.6 },

  { note: 392.00, duration: 0.35 }, { note: 392.00, duration: 0.35 },
  { note: 440.00, duration: 0.35 }, { note: 392.00, duration: 0.35 },
  { note: 349.23, duration: 0.6 },  { note: 329.63, duration: 0.6 },

  { note: 329.63, duration: 0.35 }, { note: 349.23, duration: 0.35 },
  { note: 392.00, duration: 0.4 },  { note: 440.00, duration: 0.4 },
  { note: 523.25, duration: 0.4 },  { note: 493.88, duration: 0.4 },
  { note: 440.00, duration: 0.8 },

  { note: 440.00, duration: 0.35 }, { note: 392.00, duration: 0.35 },
  { note: 349.23, duration: 0.35 }, { note: 329.63, duration: 0.35 },
  { note: 293.66, duration: 0.4 },  { note: 349.23, duration: 0.4 },
  { note: 329.63, duration: 0.8 },

  { note: 261.63, duration: 0.3 }, { note: 261.63, duration: 0.25 },
  { note: 293.66, duration: 0.5 }, { note: 261.63, duration: 0.5 },
  { note: 349.23, duration: 0.5 }, { note: 329.63, duration: 0.9 },

  { note: 261.63, duration: 0.3 }, { note: 261.63, duration: 0.25 },
  { note: 523.25, duration: 0.5 }, { note: 440.00, duration: 0.5 },
  { note: 349.23, duration: 0.5 }, { note: 329.63, duration: 0.5 },
  { note: 293.66, duration: 1.1 }
];

function startTune() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  isPlayingTune = true;

  let idx = 0;
  function step() {
    if (!isPlayingTune) return;
    const item = baarBaarNotes[idx];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(item.note, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + item.duration * 0.92);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + item.duration * 0.92);

    idx = (idx + 1) % baarBaarNotes.length;
    tuneTimeout = setTimeout(step, item.duration * 1000);
  }
  step();
}

function stopTune() {
  isPlayingTune = false;
  if (tuneTimeout) clearTimeout(tuneTimeout);
}


/* Pop-it Balloon Logic */
function initPopSurprises() {
  const popItems = document.querySelectorAll('.pop-item');
  popItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (item.classList.contains('popped')) return;

      playPopSFX();
      spawnFloatingHearts(e.clientX, e.clientY);
      triggerConfettiBurst(e.clientX, e.clientY, 50);
      item.classList.add('popped');

      const title = item.getAttribute('data-title');
      const message = item.getAttribute('data-message');
      const icon = item.getAttribute('data-icon');
      showModal('surprise-modal', icon, title, message);
    });
  });

  const modalClose = document.getElementById('modal-close-btn');
  const modalOk = document.getElementById('modal-ok-btn');
  const modal = document.getElementById('surprise-modal');

  if (modalClose) modalClose.addEventListener('click', () => closeModal('surprise-modal'));
  if (modalOk) modalOk.addEventListener('click', () => closeModal('surprise-modal'));
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal('surprise-modal');
  });
}


/* Candle Blowing Engine */
function initCandles() {
  const flames = document.querySelectorAll('.flame-element');
  const blowBtn = document.getElementById('blow-candles-btn');
  const cutBtn = document.getElementById('cut-cake-btn');

  flames.forEach(f => {
    f.addEventListener('click', (e) => {
      e.stopPropagation();
      extinguish(f);
    });
  });

  if (blowBtn) {
    blowBtn.addEventListener('click', () => {
      playBlowSFX();
      flames.forEach(f => extinguish(f));
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 100);
      showModal('surprise-modal', '🕯️', 'Candles Blown Out!', 'Make a wish, Shruti! May every dream come true this year! 🌟✨');
    });
  }

  if (cutBtn) {
    cutBtn.addEventListener('click', () => {
      playChimeSFX();
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 130);
      showModal('surprise-modal', '🍰', 'Virtual Cake Cut! 🎉', 'First slice goes to Shruti! Have the happiest day ever! 🎂💖');
    });
  }
}

function extinguish(flame) {
  if (flame.classList.contains('blown-out')) return;
  playBlowSFX();
  flame.classList.add('blown-out');
  const rect = flame.getBoundingClientRect();
  triggerConfettiBurst(rect.left, rect.top, 25);
}


/* Polaroid Gallery */
function initPolaroidWall() {
  document.querySelectorAll('.polaroid-item').forEach(card => bindPolaroid(card));

  const photoModalClose = document.getElementById('photo-modal-close');
  const photoModal = document.getElementById('photo-modal');
  if (photoModalClose) photoModalClose.addEventListener('click', () => closeModal('photo-modal'));
  if (photoModal) photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) closeModal('photo-modal');
  });
}

function bindPolaroid(card) {
  card.addEventListener('click', (e) => {
    const img = card.getAttribute('data-img');
    const cap = card.getAttribute('data-caption');
    spawnFloatingHearts(e.clientX, e.clientY);
    triggerConfettiBurst(e.clientX, e.clientY, 30);
    document.getElementById('photo-modal-img').src = img;
    document.getElementById('photo-modal-caption').textContent = cap;
    showModal('photo-modal');
  });
}


/* Modal Helpers */
function showModal(modalId, icon, title, message) {
  if (icon) document.getElementById('modal-icon').textContent = icon;
  if (title) document.getElementById('modal-title').textContent = title;
  if (message) document.getElementById('modal-body').textContent = message;

  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}
