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

/* Touch & Mouse Event Coordinate Helper */
function getEventCoordinates(e, targetElement) {
  let x, y;
  if (e.touches && e.touches.length > 0) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else if (e.changedTouches && e.changedTouches.length > 0) {
    x = e.changedTouches[0].clientX;
    y = e.changedTouches[0].clientY;
  } else if (e.clientX !== undefined && e.clientY !== undefined && e.clientX > 0) {
    x = e.clientX;
    y = e.clientY;
  } else if (targetElement) {
    const rect = targetElement.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  } else {
    x = window.innerWidth / 2;
    y = window.innerHeight / 2;
  }
  return { x, y };
}

/* Particle Canvas Engine */
let canvas, ctx, particles = [];

function initParticles() {
  canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 150);
  });

  const count = window.innerWidth < 600 ? 30 : 45;
  for (let i = 0; i < count; i++) {
    particles.push(createParticle());
  }
  animateParticles();
}

function resizeCanvas() {
  if (!canvas) return;
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

function triggerMassivePopperExplosion() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Screen-wide multi-point massive confetti burst
  triggerConfettiBurst(w * 0.15, h * 0.3, 100);
  triggerConfettiBurst(w * 0.5, h * 0.35, 160);
  triggerConfettiBurst(w * 0.85, h * 0.3, 100);
  triggerConfettiBurst(w * 0.3, h * 0.6, 90);
  triggerConfettiBurst(w * 0.7, h * 0.6, 90);

  // Floating party popper & celebration emojis burst
  const popperEmojis = ['🎉', '🎊', '🥳', '🎂', '✨', '💖', '👑', '🌟', '💖', '🎉', '🎊', '🎈'];
  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      const emojiNode = document.createElement('div');
      emojiNode.className = 'floating-heart';
      emojiNode.style.fontSize = `${Math.random() * 1.6 + 1.8}rem`;
      emojiNode.textContent = popperEmojis[Math.floor(Math.random() * popperEmojis.length)];
      emojiNode.style.left = `${Math.random() * 88 + 6}vw`;
      emojiNode.style.top = `${Math.random() * 45 + 30}vh`;
      document.body.appendChild(emojiNode);

      setTimeout(() => emojiNode.remove(), 1600);
    }, i * 35);
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
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  polaroids.forEach(card => {
    if (!isTouchDevice) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    }
  });
}

function spawnFloatingHearts(x, y) {
  const heartEmojis = ['💖', '✨', '🌸', '⭐', '🎉', '💖'];
  for (let i = 0; i < 5; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = `${x + (Math.random() - 0.5) * 40}px`;
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
  const tryStartMusic = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!isPlayingTune && audioCtx) {
      startTune();
    }

    // Try HTML5 Audio element as well if present
    const bgAudio = document.getElementById('bg-audio');
    if (bgAudio && bgAudio.paused && bgAudio.src) {
      bgAudio.play().catch(() => {});
    }
  };

  // Attempt initial playback on load
  try {
    tryStartMusic();
  } catch (e) {}

  // Multi-event unlock listener for strict mobile & desktop autoplay policies
  const interactionEvents = ['click', 'touchstart', 'touchend', 'scroll', 'pointerdown', 'mousedown', 'keydown'];
  const unlockAndPlay = () => {
    tryStartMusic();
    interactionEvents.forEach(evt => document.removeEventListener(evt, unlockAndPlay));
  };

  interactionEvents.forEach(evt => {
    document.addEventListener(evt, unlockAndPlay, { once: true, passive: true });
  });
}

function playPopSFX() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(750, audioCtx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

function playBlowSFX() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  if (!audioCtx) return;

  const bufferSize = audioCtx.sampleRate * 0.35;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

  noise.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
}

function playChimeSFX() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  if (!audioCtx) return;

  [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + idx * 0.08);
    osc.stop(audioCtx.currentTime + idx * 0.08 + 0.3);
  });
}

/* "HAPPY BIRTHDAY DEAR SHRUTI!" EXCLUSIVE SYNTHESIZED MELODY & SONG SEQUENCE */
const happyBirthdayShrutiNotes = [
  // Happy Birthday to you
  { note: 392.00, duration: 0.35 }, { note: 392.00, duration: 0.35 },
  { note: 440.00, duration: 0.6 },  { note: 392.00, duration: 0.6 },
  { note: 523.25, duration: 0.6 },  { note: 493.88, duration: 1.1 },

  // Happy Birthday to you
  { note: 392.00, duration: 0.35 }, { note: 392.00, duration: 0.35 },
  { note: 440.00, duration: 0.6 },  { note: 392.00, duration: 0.6 },
  { note: 587.33, duration: 0.6 },  { note: 523.25, duration: 1.1 },

  // Happy Birthday Dear Shruti!
  { note: 392.00, duration: 0.35 }, { note: 392.00, duration: 0.35 },
  { note: 783.99, duration: 0.6 },  { note: 659.25, duration: 0.6 },
  { note: 523.25, duration: 0.6 },  { note: 493.88, duration: 0.6 },
  { note: 440.00, duration: 1.1 },

  // Happy Birthday to you!
  { note: 698.46, duration: 0.35 }, { note: 698.46, duration: 0.35 },
  { note: 659.25, duration: 0.6 },  { note: 523.25, duration: 0.6 },
  { note: 587.33, duration: 0.6 },  { note: 523.25, duration: 1.2 },

  // Baar Baar Din Ye Aaye...
  { note: 392.00, duration: 0.35 }, { note: 392.00, duration: 0.35 },
  { note: 440.00, duration: 0.35 }, { note: 392.00, duration: 0.35 },
  { note: 349.23, duration: 0.6 },  { note: 329.63, duration: 0.6 },
  { note: 392.00, duration: 0.35 }, { note: 392.00, duration: 0.35 },
  { note: 440.00, duration: 0.35 }, { note: 392.00, duration: 0.35 },
  { note: 349.23, duration: 0.6 },  { note: 329.63, duration: 0.6 },

  // Happy Birthday Shruti!
  { note: 523.25, duration: 0.5 }, { note: 440.00, duration: 0.5 },
  { note: 349.23, duration: 0.5 }, { note: 329.63, duration: 0.5 },
  { note: 293.66, duration: 1.2 }
];

function startTune() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  if (!audioCtx) return;

  isPlayingTune = true;

  let idx = 0;
  function step() {
    if (!isPlayingTune || !audioCtx) return;
    const item = happyBirthdayShrutiNotes[idx];

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(item.note, audioCtx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(item.note * 0.5, audioCtx.currentTime); // Rich sub-harmonic

    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + item.duration * 0.92);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start(audioCtx.currentTime);
    osc2.start(audioCtx.currentTime);
    osc1.stop(audioCtx.currentTime + item.duration * 0.92);
    osc2.stop(audioCtx.currentTime + item.duration * 0.92);

    idx = (idx + 1) % happyBirthdayShrutiNotes.length;
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

      const coords = getEventCoordinates(e, item);
      playPopSFX();
      spawnFloatingHearts(coords.x, coords.y);
      triggerConfettiBurst(coords.x, coords.y, 50);
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


/* Candle Blowing & Microphone Sensor Engine */
let micStream = null;
let micAnalyser = null;
let isMicListening = false;
let micAnimationFrame = null;

function speakHappyBirthdayShruti() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // Play celebratory chime fanfare sound on Web Audio
  playChimeSFX();

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance("Happy Birthday Shruti! Wish you a very Happy Birthday Shruti!");
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.25;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(v => v.lang.startsWith('en') || v.lang.startsWith('hi')) || voices[0];
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }
}

function initCandles() {
  const flames = document.querySelectorAll('.flame-element');
  const blowBtn = document.getElementById('blow-candles-btn');
  const cutBtn = document.getElementById('cut-cake-btn');
  const micBtn = document.getElementById('mic-blow-btn');
  const micStatus = document.getElementById('mic-status');

  flames.forEach(f => {
    f.addEventListener('click', (e) => {
      e.stopPropagation();
      extinguish(f);
      speakHappyBirthdayShruti();
      if (!isPlayingTune) startTune();
    });
  });

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      toggleMicBlowingSensor(flames, micStatus, micBtn);
    });
  }

  if (blowBtn) {
    blowBtn.addEventListener('click', (e) => {
      playBlowSFX();
      flames.forEach(f => extinguish(f));
      triggerMassivePopperExplosion();
      speakHappyBirthdayShruti();
      if (!isPlayingTune) startTune();
      showModal('surprise-modal', '🎉', 'Candles Blown Out! 🎂🎉', 'Happy Birthday Shruti! Make a wish! May every dream come true this year! 🌟✨');
    });
  }

  if (cutBtn) {
    cutBtn.addEventListener('click', (e) => {
      playChimeSFX();
      triggerMassivePopperExplosion();
      speakHappyBirthdayShruti();
      if (!isPlayingTune) startTune();
      showModal('surprise-modal', '🍰', 'Virtual Cake Cut! 🎉', 'First slice goes to Shruti! Have the happiest day ever! 🎂💖');
    });
  }
}

function toggleMicBlowingSensor(flames, statusBadge, btn) {
  if (isMicListening) {
    stopMicListening(statusBadge, btn);
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (statusBadge) statusBadge.textContent = '❌ Mic Sensor unavailable in browser. Tap candles or button to blow!';
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    micStream = stream;
    isMicListening = true;

    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const source = audioCtx.createMediaStreamSource(stream);
    micAnalyser = audioCtx.createAnalyser();
    micAnalyser.fftSize = 256;
    source.connect(micAnalyser);

    if (statusBadge) {
      statusBadge.classList.add('active');
      statusBadge.textContent = '🎙️ Listening... Shruti, BLOW into your phone microphone now! 💨';
    }
    if (btn) btn.textContent = '🛑 Stop Mic Sensor';

    const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);

    function checkBlow() {
      if (!isMicListening) return;

      micAnalyser.getByteFrequencyData(dataArray);

      // Low-mid frequency wind noise average (50Hz - 600Hz)
      let sum = 0;
      const binCount = Math.min(25, dataArray.length);
      for (let i = 0; i < binCount; i++) {
        sum += dataArray[i];
      }
      const averageVolume = sum / binCount;

      // Blowing threshold detection
      if (averageVolume > 48) {
        playBlowSFX();
        flames.forEach(f => extinguish(f));

        // MASSIVE SCREEN-WIDE PARTY POPPER BURST!
        triggerMassivePopperExplosion();

        // Speak "Happy Birthday Shruti!" out loud & start tune!
        speakHappyBirthdayShruti();

        if (!isPlayingTune) {
          startTune();
        }

        stopMicListening(statusBadge, btn);

        if (statusBadge) {
          statusBadge.classList.add('active');
          statusBadge.textContent = '🎉 MASSIVE POPPER BURST! 🗣️ Happy Birthday Shruti!';
        }

        setTimeout(() => {
          showModal('surprise-modal', '🎉', 'HAPPY BIRTHDAY SHRUTI! 🎂🎉', 'WOOHOO! Shruti blew into the microphone and extinguished all the candles! Enjoy your celebration! 🌟✨');
        }, 300);

        return;
      }

      micAnimationFrame = requestAnimationFrame(checkBlow);
    }

    checkBlow();

  }).catch(() => {
    if (statusBadge) {
      statusBadge.textContent = '⚠️ Mic permission required! Please allow mic access to blow candles with your breath.';
    }
  });
}

function stopMicListening(statusBadge, btn) {
  isMicListening = false;
  if (micAnimationFrame) cancelAnimationFrame(micAnimationFrame);
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
  }
  if (statusBadge) {
    statusBadge.classList.remove('active');
  }
  if (btn) {
    btn.textContent = '🎙️ Blow Mic Sensor';
  }
}

function extinguish(flame) {
  if (flame.classList.contains('blown-out')) return;
  playBlowSFX();
  flame.classList.add('blown-out');
  const rect = flame.getBoundingClientRect();
  triggerConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
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
    const coords = getEventCoordinates(e, card);
    spawnFloatingHearts(coords.x, coords.y);
    triggerConfettiBurst(coords.x, coords.y, 30);
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

