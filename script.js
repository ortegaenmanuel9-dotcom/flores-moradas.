// ============================================
//   💜 FLORES MORADAS CON FOTOS 💜
// ============================================

const canvas = document.getElementById('jardin');
const ctx = canvas.getContext('2d', { alpha: false });

const esMovil = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
                 || window.matchMedia('(pointer: coarse)').matches;

let W, H, DPR;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, esMovil ? 1.5 : 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.floor(W * DPR);
  canvas.height = Math.floor(H * DPR);
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
resize();

// ============================================
//   📸 MENSAJES CON FOTO
// ============================================
const MENSAJES_CARINO = [
  {
    texto: 'Eres la persona más especial que tengo 💜',
    foto: 'fotos/foto1.jpeg'
  },
  {
    texto: 'Tu sonrisa ilumina mis días más oscuros ✨',
    foto: 'fotos/foto2.jpg'
  },
  {
    texto: 'Gracias por existir y estar en mi vida 🌷',
    foto: 'fotos/foto3.jpeg'
  },
  {
    texto: 'Contigo todo es más bonito, siempre 🌸',
    foto: 'fotos/foto4.jpg'
  },
  {
    texto: 'Eres mi pensamiento favorito al despertar ☀️',
    foto: 'fotos/foto5.jpeg'
  },
  {
    texto: 'Cada día a tu lado es un regalo 🎁',
    foto: 'fotos/foto6.jpg'
  },
  {
    texto: 'Tu forma de ser me enamora cada día más 💜',
    foto: 'fotos/foto7.jpeg'
  },
  {
    texto: 'No hay distancia que me impida irte avisitar execto tus perros 🌙',
    foto: 'fotos/foto8.jpg'
  },
  {
    texto: 'Eres mi flor morada favorita 🌷',
    foto: 'fotos/foto9.jpeg'
  },
  {
    texto: 'Me encanta cómo haces latir mi corazón 💓',
    foto: 'fotos/foto10.jpg'
  },
  {
    texto: 'Eres fuerte, hermosa y única 🦋',
    foto: 'fotos/foto11.jpeg'
  },
  {
    texto: 'Te quiero más de lo que las palabras pueden decir 💜',
    foto: 'fotos/foto12.jpeg'
  },
];

function barajar(arr) {
  const copia = arr.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// ============================================
//   👆 INTERACCIÓN TÁCTIL
// ============================================
const mouse = { x: -9999, y: -9999, active: false };
let touchActivo = false;

function setPunto(x, y) { mouse.x = x; mouse.y = y; mouse.active = true; }

window.addEventListener('mousemove', (e) => setPunto(e.clientX, e.clientY));
window.addEventListener('mouseleave', () => { mouse.active = false; });

if (window.PointerEvent) {
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') {
      touchActivo = true;
      setPunto(e.clientX, e.clientY);
      audio.iniciar();
      dispararToque(e.clientX, e.clientY);
    }
  }, { passive: true });

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') {
      setPunto(e.clientX, e.clientY);
    }
  }, { passive: true });

  window.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'touch') {
      setTimeout(() => { touchActivo = false; mouse.active = false; }, 600);
    }
  }, { passive: true });
} else {
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      touchActivo = true;
      setPunto(t.clientX, t.clientY);
      audio.iniciar();
      dispararToque(t.clientX, t.clientY);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      setPunto(t.clientX, t.clientY);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    setTimeout(() => { touchActivo = false; mouse.active = false; }, 600);
  }, { passive: true });
}

window.addEventListener('click', (e) => {
  if (touchActivo) return;
  audio.iniciar();
  dispararToque(e.clientX, e.clientY);
});

function dispararToque(x, y) {
  const radio = esMovil ? 85 : 65;
  let mejorFlor = null;
  let mejorDist = Infinity;

  for (const flor of flores) {
    if (flor.descubierta) continue;
    const fx = flor.x;
    const fy = flor.y - 115 * flor.escala;
    const dx = x - fx;
    const dy = y - fy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radio && dist < mejorDist) {
      mejorDist = dist;
      mejorFlor = flor;
    }
  }

  if (mejorFlor) mejorFlor.descubrir();
}

// ============================================
//   🎵 AUDIO
// ============================================
class AudioAmbiental {
  constructor() {
    this.activo = false; this.ctx = null;
    this.master = null; this.oscs = [];
    this.intentado = false;
  }
  iniciar() {
    if (this.activo || this.intentado) return;
    this.intentado = true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { this.ctx = new AC(); } catch (err) { return; }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => this.construir()).catch(() => {});
    } else this.construir();
  }
  construir() {
    if (this.activo || !this.ctx) return;
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
    const reverb = this.ctx.createConvolver();
    reverb.buffer = this.crearImpulso(esMovil ? 1.5 : 3, 2.5);
    const reverbGain = this.ctx.createGain();
    reverbGain.gain.value = esMovil ? 0.35 : 0.5;
    reverb.connect(reverbGain);
    reverbGain.connect(this.master);
    const notas = [220, 261.63, 329.63, 392, 493.88, 587.33];
    notas.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      lfo.frequency.value = 0.04 + Math.random() * 0.12;
      lfoGain.gain.value = 1 + Math.random() * 2;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      gain.gain.value = esMovil ? 0.04 : 0.06;
      osc.connect(gain);
      gain.connect(this.master);
      gain.connect(reverb);
      osc.start();
      this.oscs.push({ osc, gain, lfo });
    });
    this.master.gain.linearRampToValueAtTime(esMovil ? 0.22 : 0.38, this.ctx.currentTime + 3);
    this.activo = true;
  }
  crearImpulso(dur, decay) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * dur);
    const imp = this.ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const ch = imp.getChannelData(c);
      for (let i = 0; i < len; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return imp;
  }
  ping(freq = 880) {
    if (!this.activo || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(esMovil ? 0.1 : 0.14, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + 1.5);
  }
}
const audio = new AudioAmbiental();
document.addEventListener('mousemove', () => audio.iniciar(), { once: true });

// ============================================
//   PALETA
// ============================================
const PALETA_MORADA = [
  '#b76dff', '#9b4dff', '#7b2fd6', '#d9baff',
  '#c08bff', '#8b3fd9', '#e8d5ff', '#a855f7', '#c084fc'
];

// ============================================
//   💥 CHISPAS
// ============================================
const chispas = [];
const MAX_CHISPAS = esMovil ? 80 : 200;

class Chispa {
  constructor(x, y) {
    const ang = Math.random() * Math.PI * 2;
    const vel = 2 + Math.random() * 5;
    this.x = x; this.y = y;
    this.vx = Math.cos(ang) * vel;
    this.vy = Math.sin(ang) * vel;
    this.size = 2 + Math.random() * 3;
    this.life = 1;
    this.decay = 0.02 + Math.random() * 0.02;
    this.color = PALETA_MORADA[Math.floor(Math.random() * PALETA_MORADA.length)];
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vx *= 0.95; this.vy *= 0.95;
    this.vy += 0.08;
    this.life -= this.decay;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
function crearExplosion(x, y, cantidad = esMovil ? 10 : 16) {
  if (chispas.length + cantidad > MAX_CHISPAS) {
    cantidad = Math.max(4, MAX_CHISPAS - chispas.length);
  }
  for (let i = 0; i < cantidad; i++) chispas.push(new Chispa(x, y));
}

// ============================================
//   ESTRELLAS FUGACES
// ============================================
class EstrellaFugaz {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W; this.y = -50;
    this.len = 70 + Math.random() * 100;
    this.speed = 6 + Math.random() * 7;
    this.angulo = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
    this.alpha = 0; this.activo = false;
    this.espera = Math.random() * 400 + 150;
    this.contador = 0;
  }
  update() {
    if (!this.activo) {
      this.contador++;
      if (this.contador > this.espera) {
        this.activo = true;
        this.x = Math.random() * W * 0.7;
        this.y = -50; this.alpha = 0;
      }
      return;
    }
    this.x += Math.cos(this.angulo) * this.speed;
    this.y += Math.sin(this.angulo) * this.speed;
    this.alpha = Math.min(1, this.alpha + 0.06);
    if (this.y > H + 100 || this.x > W + 100) {
      this.alpha -= 0.06;
      if (this.alpha <= 0) this.reset();
    }
  }
  draw() {
    if (!this.activo || this.alpha <= 0) return;
    const grad = ctx.createLinearGradient(
      this.x, this.y,
      this.x - Math.cos(this.angulo) * this.len,
      this.y - Math.sin(this.angulo) * this.len
    );
    grad.addColorStop(0, `rgba(240, 228, 255, ${this.alpha})`);
    grad.addColorStop(0.5, `rgba(183, 109, 255, ${this.alpha * 0.6})`);
    grad.addColorStop(1, 'rgba(183, 109, 255, 0)');
    ctx.beginPath();
    ctx.strokeStyle = grad; ctx.lineWidth = 2;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - Math.cos(this.angulo) * this.len,
               this.y - Math.sin(this.angulo) * this.len);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fill();
  }
}
const estrellasFugaces = Array.from({ length: esMovil ? 2 : 4 }, () => new EstrellaFugaz());

// ============================================
//   ESTRELLAS
// ============================================
class Estrella {
  constructor() { this.reset(); this.y = Math.random() * H; }
  reset() {
    this.x = Math.random() * W; this.y = -10;
    this.size = Math.random() * 1.5 + 0.3;
    this.speed = Math.random() * 0.3 + 0.05;
    this.alpha = Math.random() * 0.7 + 0.3;
    this.twinkle = Math.random() * 0.02 + 0.005;
    this.color = PALETA_MORADA[Math.floor(Math.random() * PALETA_MORADA.length)];
  }
  update() {
    this.y += this.speed;
    this.alpha += this.twinkle;
    if (this.alpha > 1 || this.alpha < 0.2) this.twinkle *= -1;
    if (this.y > H + 10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
const estrellas = Array.from({ length: esMovil ? 70 : 180 }, () => new Estrella());

// ============================================
//   POLVO
// ============================================
class Polvo {
  constructor() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.size = Math.random() * 2.2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.color = PALETA_MORADA[Math.floor(Math.random() * PALETA_MORADA.length)];
    this.alpha = Math.random() * 0.5 + 0.2;
    this.pulso = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.pulso += 0.03;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    const a = this.alpha * (0.6 + Math.sin(this.pulso) * 0.4);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = a;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
const polvo = Array.from({ length: esMovil ? 18 : 50 }, () => new Polvo());

// ============================================
//   PÉTALOS
// ============================================
class Petalo {
  constructor() { this.reset(); this.y = Math.random() * H; }
  reset() {
    this.x = Math.random() * W; this.y = -20;
    this.size = Math.random() * 7 + 5;
    this.vy = Math.random() * 0.7 + 0.35;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.rot = Math.random() * Math.PI * 2;
    this.vrot = (Math.random() - 0.5) * 0.05;
    this.swing = Math.random() * Math.PI * 2;
    this.swingSpeed = 0.02 + Math.random() * 0.03;
    this.swingAmp = 1 + Math.random() * 1.5;
    this.color = PALETA_MORADA[Math.floor(Math.random() * PALETA_MORADA.length)];
    this.alpha = Math.random() * 0.5 + 0.4;
  }
  update() {
    this.swing += this.swingSpeed;
    this.y += this.vy;
    this.x += this.vx + Math.sin(this.swing) * this.swingAmp;
    this.rot += this.vrot;
    if (this.y > H + 30) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.quadraticCurveTo(this.size * 0.8, -this.size * 0.4, 0, this.size);
    ctx.quadraticCurveTo(-this.size * 0.8, -this.size * 0.4, 0, -this.size);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, 'rgba(140, 80, 220, 0.15)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
const petalos = Array.from({ length: esMovil ? 12 : 35 }, () => new Petalo());

// ============================================
//   MARIPOSAS
// ============================================
class Mariposa {
  constructor() { this.reset(); this.y = Math.random() * H; }
  reset() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.t = Math.random() * Math.PI * 2;
    this.velBase = 0.5 + Math.random() * 0.8;
    this.escala = 0.6 + Math.random() * 0.5;
    this.color = PALETA_MORADA[Math.floor(Math.random() * PALETA_MORADA.length)];
    this.color2 = PALETA_MORADA[Math.floor(Math.random() * PALETA_MORADA.length)];
    this.tiempo = 0;
  }
  update() {
    this.tiempo += 0.02; this.t += 0.03;
    this.x += Math.cos(this.t) * this.velBase;
    this.y += Math.sin(this.t * 1.7) * this.velBase * 0.8 + Math.cos(this.tiempo) * 0.3;
    if (this.x < 20) this.x = W - 20;
    if (this.x > W - 20) this.x = 20;
    if (this.y < 20) this.y = H - 20;
    if (this.y > H - 20) this.y = 20;
  }
  draw() {
    const ala = Math.abs(Math.sin(this.tiempo * 3));
    const s = this.escala;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(s, s);
    ctx.globalAlpha = 0.8;
    ctx.save(); ctx.scale(ala, 1);
    ctx.beginPath();
    ctx.ellipse(-8, -2, 8, 12, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
    ctx.save(); ctx.scale(ala, 1);
    ctx.beginPath();
    ctx.ellipse(8, -2, 8, 12, 0.3, 0, Math.PI * 2);
    ctx.fillStyle = this.color2;
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.ellipse(0, 0, 1.5, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f0e4ff'; ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
const mariposas = Array.from({ length: esMovil ? 2 : 5 }, () => new Mariposa());

// ============================================
//   🌷 FLOR
// ============================================
let floresDescubiertas = 0;
let totalFlores = 0;
const contadorNum = document.getElementById('contadorNum');
const contadorLabel = document.querySelector('.contador-label');
const anillo = document.getElementById('anillo');
const mensajeEl = document.getElementById('mensaje');
const panelMensajes = document.getElementById('panelMensajes');
const panelLista = document.getElementById('panelLista');
const panelVacio = document.getElementById('panelVacio');
const backdrop = document.getElementById('backdrop');
const btnPanel = document.getElementById('btnPanel');
const badge = document.getElementById('badge');
const modalFoto = document.getElementById('modalFoto');
const fotoGrandeImg = document.getElementById('fotoGrandeImg');
const fotoMensaje = document.getElementById('fotoMensaje');
const cerrarFoto = document.getElementById('cerrarFoto');

class FlorMorada {
  constructor(x, y, escala, tipo, mensaje) {
    this.baseX = x; this.baseY = y;
    this.x = x; this.y = y;
    this.escala = escala;
    this.tiempo = Math.random() * Math.PI * 2;
    this.velocidad = 0.012 + Math.random() * 0.01;
    this.tipo = tipo;
    this.colorPetalo = PALETA_MORADA[Math.floor(Math.random() * PALETA_MORADA.length)];
    this.colorPetalo2 = PALETA_MORADA[Math.floor(Math.random() * PALETA_MORADA.length)];
    this.glow = Math.random() * 12 + 20;
    this.interaccion = 0;
    this.descubierta = false;
    this.frecuencia = 500 + Math.random() * 700;
    this.brilloExtra = 0;
    this.pulsoFlor = Math.random() * Math.PI * 2;
    this.rotacionFlor = 0;
    this.mensaje = mensaje; // ahora es {texto, foto}
    this.emoji = ['🌷', '🌸', '🌺', '💐', '🏵️', '🌼', '💜'][Math.floor(Math.random() * 7)];
  }

  descubrir() {
    if (this.descubierta) return;
    this.descubierta = true;
    this.brilloExtra = 1;
    floresDescubiertas++;
    actualizarContador();
    audio.ping(this.frecuencia);
    agregarMensajeAlPanel(this.mensaje, this.emoji, floresDescubiertas);
    crearExplosion(this.x, this.y - 100 * this.escala, esMovil ? 12 : 18);

    if (navigator.vibrate) navigator.vibrate(35);

    if (floresDescubiertas >= totalFlores) {
      setTimeout(() => {
        mensajeEl.textContent = '✨ ¡Descubriste todo el jardín! ✨';
        crearExplosion(W / 2, H / 2, 30);
        setTimeout(() => audio.ping(1318.51), 100);
        setTimeout(() => audio.ping(1567.98), 300);
        setTimeout(() => audio.ping(2093.00), 500);
      }, 500);
    }
  }

  update() {
    this.tiempo += this.velocidad;
    this.pulsoFlor += 0.03;
    this.x = this.baseX + Math.sin(this.tiempo) * 12 * this.escala;
    this.y = this.baseY + Math.cos(this.tiempo * 0.7) * 6 * this.escala;
    this.rotacionFlor += 0.005;
    this.brilloExtra *= 0.97;
  }

  draw() {
    const s = this.escala;
    const pulso = 1 + Math.sin(this.pulsoFlor) * 0.05;
    const glow = this.glow + this.brilloExtra * 50;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(s * pulso, s * pulso);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(10 * Math.sin(this.tiempo), -50,
      5 * Math.sin(this.tiempo * 0.8), -110);
    ctx.strokeStyle = 'rgba(160, 100, 220, 0.75)';
    ctx.lineWidth = 3;
    ctx.shadowBlur = glow * 0.5;
    ctx.shadowColor = '#b76dff';
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.moveTo(2, -40);
    ctx.quadraticCurveTo(-30, -60, -22, -90);
    ctx.quadraticCurveTo(-8, -70, 2, -40);
    ctx.fillStyle = 'rgba(120, 70, 190, 0.5)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(4, -60);
    ctx.quadraticCurveTo(35, -80, 30, -105);
    ctx.quadraticCurveTo(10, -85, 4, -60);
    ctx.fillStyle = 'rgba(140, 90, 210, 0.5)';
    ctx.fill();

    const petaloY = -115 + Math.cos(this.tiempo * 0.7) * 6;
    const rotar = Math.sin(this.tiempo * 0.5) * 0.1 + this.rotacionFlor * 0.3;

    ctx.translate(4 * Math.sin(this.tiempo * 0.8), petaloY);
    ctx.rotate(rotar);

    if (this.tipo === 0) this.dibujarTulipan(glow);
    else if (this.tipo === 1) this.dibujarOrquidea(glow);
    else if (this.tipo === 2) this.dibujarLotoMorado(glow);
    else this.dibujarFlorEstrella(glow);

    const nucleoR = 5 + Math.sin(this.pulsoFlor * 2) * 1;
    ctx.beginPath();
    ctx.arc(0, -8, nucleoR, 0, Math.PI * 2);
    ctx.fillStyle = '#f0e4ff';
    ctx.shadowBlur = glow * 2;
    ctx.shadowColor = '#d9baff';
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  dibujarTulipan(glow) {
    for (let i = -1; i <= 1; i += 2) {
      ctx.beginPath();
      ctx.ellipse(i * 12, -3, 10, 22, (i * Math.PI) / 9, 0, Math.PI * 2);
      const g = ctx.createRadialGradient(i * 12, 0, 2, i * 12, 0, 24);
      g.addColorStop(0, this.colorPetalo);
      g.addColorStop(1, 'rgba(120, 60, 200, 0.15)');
      ctx.fillStyle = g;
      ctx.shadowBlur = glow;
      ctx.shadowColor = this.colorPetalo;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(0, -8, 14, 26, 0, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(0, -8, 2, 0, -8, 28);
    g.addColorStop(0, '#f0e4ff');
    g.addColorStop(0.35, this.colorPetalo);
    g.addColorStop(1, 'rgba(120, 60, 200, 0.2)');
    ctx.fillStyle = g;
    ctx.shadowBlur = glow * 1.4;
    ctx.shadowColor = this.colorPetalo;
    ctx.fill();
  }

  dibujarOrquidea(glow) {
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const px = Math.cos(ang) * 16;
      const py = Math.sin(ang) * 16 - 8;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(ang + Math.PI / 2);
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 15, 0, 0, Math.PI * 2);
      const g = ctx.createRadialGradient(0, 0, 1, 0, 0, 15);
      g.addColorStop(0, this.colorPetalo);
      g.addColorStop(1, 'rgba(120, 60, 200, 0.1)');
      ctx.fillStyle = g;
      ctx.shadowBlur = glow;
      ctx.shadowColor = this.colorPetalo;
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.ellipse(0, 4, 9, 12, 0, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(0, 4, 1, 0, 4, 14);
    g.addColorStop(0, '#f0e4ff');
    g.addColorStop(0.5, this.colorPetalo2);
    g.addColorStop(1, 'rgba(120, 60, 200, 0.2)');
    ctx.fillStyle = g;
    ctx.shadowBlur = glow * 1.2;
    ctx.shadowColor = this.colorPetalo2;
    ctx.fill();
  }

  dibujarLotoMorado(glow) {
    for (let capa = 0; capa < 3; capa++) {
      const num = 6 + capa * 2;
      const radio = 10 + capa * 5;
      for (let i = 0; i < num; i++) {
        const ang = (i / num) * Math.PI * 2 + capa * 0.3 + this.rotacionFlor;
        ctx.save();
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(0, -radio, 5, 13 + capa * 2, 0, 0, Math.PI * 2);
        const alpha = 0.9 - capa * 0.25;
        ctx.fillStyle = this.hexToRgba(
          capa % 2 === 0 ? this.colorPetalo : this.colorPetalo2,
          alpha
        );
        ctx.shadowBlur = glow;
        ctx.shadowColor = this.colorPetalo;
        ctx.fill();
        ctx.restore();
      }
    }
  }

  dibujarFlorEstrella(glow) {
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2 + this.rotacionFlor * 0.5;
      ctx.save();
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(6, -32);
      ctx.lineTo(0, -40);
      ctx.lineTo(-6, -32);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, -8, 0, -40);
      g.addColorStop(0, '#f0e4ff');
      g.addColorStop(0.5, this.colorPetalo);
      g.addColorStop(1, 'rgba(120, 60, 200, 0.1)');
      ctx.fillStyle = g;
      ctx.shadowBlur = glow * 1.3;
      ctx.shadowColor = this.colorPetalo;
      ctx.fill();
      ctx.restore();
    }
  }

  hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
}

// ============================================
//   💜 AGREGAR MENSAJE CON FOTO AL PANEL
// ============================================
function agregarMensajeAlPanel(mensaje, emoji, num) {
  if (panelVacio) panelVacio.style.display = 'none';

  const item = document.createElement('div');
  item.className = 'mensaje-item';
  item.innerHTML = `
    <div class="foto-wrap">
      <img src="${mensaje.foto}" alt="Recuerdo ${num}" loading="lazy" />
    </div>
    <div class="contenido">
      <span class="num">💜 Flor ${num}</span>
      <span class="texto">${mensaje.texto}</span>
    </div>
  `;

  // Al tocar la tarjeta → abrir modal ampliado con la foto
  item.addEventListener('click', () => {
    abrirFotoGrande(mensaje.foto, mensaje.texto);
  });

  panelLista.insertBefore(item, panelLista.firstChild);

  // Actualizar badge con animación
  badge.textContent = floresDescubiertas;
  badge.classList.remove('pulso');
  void badge.offsetWidth;
  badge.classList.add('pulso');
}

// ============================================
//   📸 MODAL FOTO AMPLIADA
// ============================================
function abrirFotoGrande(src, texto) {
  fotoGrandeImg.src = src;
  fotoMensaje.textContent = texto;
  modalFoto.classList.add('activo');
  audio.ping(1046.5);
}

cerrarFoto.addEventListener('click', (e) => {
  e.preventDefault();
  modalFoto.classList.remove('activo');
});
modalFoto.addEventListener('click', (e) => {
  if (e.target === modalFoto) modalFoto.classList.remove('activo');
});

// ============================================
//   ABRIR / CERRAR PANEL
// ============================================
function abrirPanel() {
  panelMensajes.classList.add('activo');
  backdrop.classList.add('activo');
}
function cerrarPanel() {
  panelMensajes.classList.remove('activo');
  backdrop.classList.remove('activo');
}

btnPanel.addEventListener('click', (e) => {
  e.preventDefault();
  audio.iniciar();
  if (panelMensajes.classList.contains('activo')) cerrarPanel();
  else abrirPanel();
});
document.getElementById('panelCerrar').addEventListener('click', cerrarPanel);
backdrop.addEventListener('click', cerrarPanel);

// ============================================
//   JARDÍN
// ============================================
const flores = [];
let mensajesBarajados = [];

function crearJardin() {
  flores.length = 0;
  floresDescubiertas = 0;
  contadorNum.textContent = '0';
  panelLista.innerHTML = '';
  if (panelVacio) {
    panelLista.appendChild(panelVacio);
    panelVacio.style.display = 'flex';
  }
  badge.textContent = '0';
  cerrarPanel();

  const divisor = esMovil ? 220 : 160;
  const cantidad = Math.max(esMovil ? 5 : 7, Math.floor(W / divisor));
  totalFlores = cantidad;
  contadorLabel.textContent = '/ ' + totalFlores;

  // Mezclar y asegurar que cada flor tenga una foto distinta (si alcanzan)
  mensajesBarajados = barajar(MENSAJES_CARINO);

  for (let i = 0; i < cantidad; i++) {
    const x = (W / (cantidad + 1)) * (i + 1) + (Math.random() - 0.5) * 50;
    const y = H - 60 - Math.random() * 50;
    const escala = (esMovil ? 0.65 : 0.8) + Math.random() * 0.4;
    const tipo = Math.floor(Math.random() * 4);
    // Si hay más flores que mensajes, se reciclan con nuevo orden
    const mensaje = mensajesBarajados[i % mensajesBarajados.length];
    flores.push(new FlorMorada(x, y, escala, tipo, mensaje));
  }
  actualizarContador();
}
crearJardin();

function actualizarContador() {
  const progreso = totalFlores > 0 ? floresDescubiertas / totalFlores : 0;
  const circunferencia = 2 * Math.PI * 26;
  anillo.style.strokeDashoffset = circunferencia * (1 - progreso);
}

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { resize(); crearJardin(); }, 300);
});
window.addEventListener('orientationchange', () => {
  setTimeout(() => { resize(); crearJardin(); }, 400);
});

// ============================================
//   NEBULOSA
// ============================================
function dibujarNebulosa(t) {
  const g1 = ctx.createRadialGradient(
    W * 0.3 + Math.sin(t * 0.0002) * 80, H * 0.35, 0,
    W * 0.3, H * 0.35, W * 0.7);
  g1.addColorStop(0, 'rgba(120, 40, 180, 0.28)');
  g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  const g2 = ctx.createRadialGradient(
    W * 0.75 + Math.cos(t * 0.0003) * 80, H * 0.65, 0,
    W * 0.75, H * 0.65, W * 0.6);
  g2.addColorStop(0, 'rgba(80, 20, 140, 0.25)');
  g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);
}

// ============================================
//   LOOP
// ============================================
let t = 0;
let lastTime = 0;
const FPS_LIMITE = esMovil ? 40 : 60;
const INTERVALO = 1000 / FPS_LIMITE;

function animar(timestamp) {
  requestAnimationFrame(animar);
  const delta = timestamp - lastTime;
  if (delta < INTERVALO) return;
  lastTime = timestamp;
  t += 16;

  ctx.fillStyle = 'rgba(10, 2, 18, 0.4)';
  ctx.fillRect(0, 0, W, H);

  dibujarNebulosa(t);

  for (let i = 0; i < estrellasFugaces.length; i++) {
    estrellasFugaces[i].update();
    estrellasFugaces[i].draw();
  }
  for (let i = 0; i < estrellas.length; i++) {
    estrellas[i].update();
    estrellas[i].draw();
  }
  for (let i = 0; i < polvo.length; i++) {
    polvo[i].update();
    polvo[i].draw();
  }
  for (let i = 0; i < petalos.length; i++) {
    petalos[i].update();
    petalos[i].draw();
  }
  for (let i = 0; i < mariposas.length; i++) {
    mariposas[i].update();
    mariposas[i].draw();
  }

  const suelo = ctx.createLinearGradient(0, H - 130, 0, H);
  suelo.addColorStop(0, 'rgba(40, 10, 70, 0)');
  suelo.addColorStop(1, 'rgba(120, 50, 200, 0.3)');
  ctx.fillStyle = suelo;
  ctx.fillRect(0, H - 130, W, 130);

  for (let i = 0; i < flores.length; i++) {
    flores[i].update();
    flores[i].draw();
  }

  for (let i = chispas.length - 1; i >= 0; i--) {
    chispas[i].update();
    chispas[i].draw();
    if (chispas[i].life <= 0) chispas.splice(i, 1);
  }
}
requestAnimationFrame(animar);

// ============================================
//   MODAL FINAL
// ============================================
const btnMensaje = document.getElementById('btnMensaje');
const modal = document.getElementById('modal');
const cerrar = document.getElementById('cerrar');

btnMensaje.addEventListener('click', (e) => {
  e.preventDefault();
  audio.iniciar();
  modal.classList.add('activo');
  const rect = btnMensaje.getBoundingClientRect();
  crearExplosion(rect.left + rect.width / 2, rect.top, esMovil ? 15 : 25);
  setTimeout(() => audio.ping(880), 100);
  setTimeout(() => audio.ping(1108.73), 300);
  setTimeout(() => audio.ping(1318.51), 500);
});

cerrar.addEventListener('click', (e) => {
  e.preventDefault();
  modal.classList.remove('activo');
});
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('activo');
});

// Prevenir zoom doble tap
let lastTap = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTap < 300) e.preventDefault();
  lastTap = now;
}, { passive: false });

document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

document.addEventListener('visibilitychange', () => {
  if (!audio.master || !audio.activo) return;
  if (document.hidden) {
    audio.master.gain.linearRampToValueAtTime(0, audio.ctx.currentTime + 0.3);
  } else {
    audio.master.gain.linearRampToValueAtTime(
      esMovil ? 0.22 : 0.38,
      audio.ctx.currentTime + 0.5
    );
  }
});