/* ---------- State and reusable helpers ---------- */
const content = document.getElementById('stageContent');
const card = document.getElementById('stageCard');
const penguin = document.getElementById('penguin');
const burstLayer = document.getElementById('burstLayer');
const floatingLayer = document.getElementById('floatingLayer');
const progressDots = [...document.querySelectorAll('.progress-dot')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let stage = 1;
let noAttempts = 0;
let floatingTimer;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, reduceMotion ? Math.min(ms, 80) : ms));
const setMood = (mood) => {
  penguin.className = `penguin ${mood} holding-heart`;
};
const updateProgress = (step) => {
  stage = step;
  progressDots.forEach(dot => dot.classList.toggle('is-active', Number(dot.dataset.step) === step));
};
const render = (html) => { content.innerHTML = html; };

function heartBurst(x = innerWidth / 2, y = innerHeight / 2, count = 18) {
  if (reduceMotion) return;
  const icons = ['♥', '✦', '♡', '✨'];
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.textContent = icons[Math.floor(Math.random() * icons.length)];
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.color = Math.random() > .42 ? '#fff' : '#ff4d7d';
    particle.style.fontSize = `${12 + Math.random() * 18}px`;
    particle.style.setProperty('--dx', `${(Math.random() - .5) * 220}px`);
    particle.style.setProperty('--dy', `${(Math.random() - .5) * 220}px`);
    burstLayer.appendChild(particle);
    setTimeout(() => particle.remove(), 950);
  }
}

function confetti(count = 34) {
  if (reduceMotion) return;
  const colors = ['#ffffff', '#ff4d7d', '#ffd166', '#c77dff'];
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.textContent = Math.random() > .55 ? '♥' : '✦';
    particle.style.left = `${innerWidth / 2}px`;
    particle.style.top = `${innerHeight / 2}px`;
    particle.style.color = colors[i % colors.length];
    particle.style.fontSize = `${10 + Math.random() * 16}px`;
    particle.style.setProperty('--dx', `${(Math.random() - .5) * 340}px`);
    particle.style.setProperty('--dy', `${-80 - Math.random() * 230}px`);
    burstLayer.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }
}

/* ---------- Ambient hearts and cursor sparkle trail ---------- */
function startAmbient() {
  if (reduceMotion) return;
  floatingTimer = setInterval(() => {
    const el = document.createElement('span');
    el.className = 'floaty';
    el.textContent = Math.random() > .45 ? '♡' : '✦';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.fontSize = `${10 + Math.random() * 18}px`;
    el.style.animationDuration = `${8 + Math.random() * 8}s`;
    el.style.color = Math.random() > .45 ? 'rgba(255,255,255,.72)' : 'rgba(255,126,166,.78)';
    floatingLayer.appendChild(el);
    setTimeout(() => el.remove(), 16000);
  }, 650);
}

document.addEventListener('pointermove', (event) => {
  if (reduceMotion || event.pointerType !== 'mouse' || Math.random() > .08) return;
  heartBurst(event.clientX, event.clientY, 1);
});

/* ---------- Stage 1: hook ---------- */
function stageOne() {
  updateProgress(1);
  card.classList.remove('dimmed');
  setMood('mood-wave');
  render(`
    <p class="kicker">Made for Sandali Khare</p>
    <h1>Hey <span class="script">Darling...</span></h1>
    <p>I need exactly 2 minutes of your attention.</p>
    <p>And haan... you can't skip this one.</p>
    <div class="actions"><button class="btn" id="listenBtn">Okay, I'm listening →</button></div>
  `);
  document.getElementById('listenBtn').addEventListener('click', (e) => {
    setMood('mood-happy');
    heartBurst(e.clientX, e.clientY, 24);
    setTimeout(stageTwo, 550);
  });
}

/* ---------- Stage 2: first question with two legitimate routes ---------- */
function stageTwo() {
  updateProgress(2);
  setMood('mood-happy');
  render(`
    <p class="kicker">Okay, first question...</p>
    <h2>Be honest...</h2>
    <p>Do you think I'm a little too attached to you?</p>
    <div class="actions">
      <button class="btn" id="attachedYes">YES</button>
      <button class="btn secondary" id="attachedNo">NO</button>
    </div>
  `);
  document.getElementById('attachedYes').addEventListener('click', () => stageTwoAnswer(true));
  document.getElementById('attachedNo').addEventListener('click', () => stageTwoAnswer(false));
}

async function stageTwoAnswer(isYes) {
  card.classList.add('shake');
  setMood(isYes ? 'mood-shocked' : 'mood-suspicious');
  render(isYes ? `
    <h2>Excuse me?? 😭</h2><p>Itna sach bhi nahi bolna tha.</p><p>Okay okay... moving on.</p>
  ` : `
    <h2>Hmm... suspicious answer.</h2><p>I don't believe you. 😌</p><p>Moving on before you change your answer.</p>
  `);
  await wait(1800);
  card.classList.remove('shake');
  stageThree();
}

/* ---------- Stage 3: impossible NO button prank ---------- */
function stageThree() {
  updateProgress(3);
  noAttempts = 0;
  setMood('mood-suspicious');
  render(`
    <p class="kicker">Okay Darling, serious question now...</p>
    <h2>Do you think someone could secretly be very fond of you?</h2>
    <div class="actions">
      <button class="btn" id="fondYes">YES</button>
      <button class="btn secondary" id="fondNo">NO</button>
    </div>
  `);
  const yes = document.getElementById('fondYes');
  const no = document.getElementById('fondNo');
  yes.addEventListener('click', acceptFondness);
  no.addEventListener('pointerenter', dodgeNo);
  no.addEventListener('pointerdown', dodgeNo, { passive: false });
  no.addEventListener('touchstart', dodgeNo, { passive: false });
  no.addEventListener('click', (e) => { e.preventDefault(); dodgeNo(e); });
}

function dodgeNo(event) {
  event?.preventDefault?.();
  noAttempts += 1;
  const no = document.getElementById('fondNo');
  if (!no) return;
  no.classList.add('runner');
  const rect = no.getBoundingClientRect();
  const padding = 12;
  const maxX = innerWidth - rect.width - padding;
  const maxY = innerHeight - rect.height - padding;
  let x = padding + Math.random() * Math.max(1, maxX - padding);
  let y = padding + Math.random() * Math.max(1, maxY - padding);
  const yesRect = document.getElementById('fondYes').getBoundingClientRect();
  if (Math.abs(x - yesRect.left) < 150 && Math.abs(y - yesRect.top) < 100) y = Math.min(maxY, yesRect.bottom + 28);
  no.style.left = `${Math.max(padding, Math.min(maxX, x))}px`;
  no.style.top = `${Math.max(padding, Math.min(maxY, y))}px`;
  no.style.transform = `scale(${noAttempts % 3 === 0 ? .88 : 1}) rotate(${(Math.random() - .5) * 12}deg)`;
  if (noAttempts % 4 === 0) { no.style.opacity = '0'; setTimeout(() => no.style.opacity = '1', 160); }
  const noTexts = ['Nice try.', 'Nope 😂', 'Almost.', 'Not happening.', 'Try again.', 'You really thought?', 'Bas karo 😂', 'Catch me first.', 'NO is unavailable.', 'System says YES.'];
  no.textContent = noAttempts >= 8 ? 'Okay fine... YES 😭' : noTexts[noAttempts % noTexts.length];
  const moods = ['mood-suspicious', 'mood-laugh', 'mood-facepalm', 'mood-point'];
  setMood(moods[noAttempts % moods.length]);
  showTease();
}

function showTease() {
  const messages = [
    'Darling, why are you fighting the website?',
    'The website knows you better.',
    'Bas karo 😂',
    'You really thought NO was an option?',
    'Why are you bullying my website?',
    'Even the penguin knows what you\'re supposed to click.',
    'At this point, you\'re just testing the developer.'
  ];
  const bubble = document.createElement('div');
  bubble.className = 'tease-bubble';
  bubble.textContent = messages[Math.min(noAttempts - 1, messages.length - 1)];
  document.body.appendChild(bubble);
  setTimeout(() => bubble.remove(), 1300);
}

function acceptFondness(event) {
  setMood('mood-wave');
  heartBurst(event.clientX || innerWidth / 2, event.clientY || innerHeight / 2, 30);
  confetti(22);
  setTimeout(stageFour, 700);
}

/* ---------- Stage 4: romantic buildup and final twist ---------- */
async function stageFour() {
  updateProgress(4);
  card.classList.add('dimmed');
  setMood('mood-happy');
  render(`<h2>Okay...</h2>`);
  await wait(900);
  render(`
    <h2>Now forget all the questions.</h2>
    <div class="glow-heart">♥</div>
    <div class="romance-lines" id="romanceLines"></div>
    <div class="actions"><button class="btn" id="lastThing" hidden>One last thing...</button></div>
  `);
  const lines = [
    'Kuch log zindagi mein bina kisi plan ke aa jaate hain,',
    'aur pata hi nahi chalta kab woh itne special ban gaye.',
    'Tum bhi kuch aisi hi ho, Darling.',
    'Na koi perfect reason hai, na koi perfect explanation...',
    'bas tum ho, aur somehow tumhari smile mere din ko thoda better bana deti hai.',
    'Aur haan... agar tum abhi smile kar rahi ho,',
    'toh technically meri website successful ho gayi. ❤️'
  ];
  const box = document.getElementById('romanceLines');
  for (const text of lines) {
    const line = document.createElement('div');
    line.className = 'line';
    line.textContent = text;
    box.appendChild(line);
    await wait(760);
    line.classList.add('visible');
  }
  const last = document.getElementById('lastThing');
  last.hidden = false;
  last.addEventListener('click', finalTwist);
}

async function finalTwist() {
  clearInterval(floatingTimer);
  card.classList.add('dimmed');
  setMood('mood-shocked');
  render(`<div class="glow-heart">♥</div>`);
  await wait(1100);
  setMood('mood-facepalm');
  render(`<h1 class="final-title">I HATE YOU.</h1>`);
  await wait(1200);
  setMood('mood-happy');
  render(`
    <h1 class="final-title">I HATE YOU.</h1>
    <p>Itna time laga diya ye website banane mein...</p>
    <p>ab smile toh karni padegi.</p>
    <p class="kicker">— Prateek</p>
  `);
  confetti(48);
  heartBurst(innerWidth / 2, innerHeight / 2, 42);
}

startAmbient();
stageOne();
