/* game.js: World Route Typing v0.1. Key decisions: segment-based routes, persisted selection, scoped DOM updates. */

import { routes } from './routes/index.js';

export const WORD_POOLS = {
  kana: ['ねこ', 'いぬ', 'やま', 'かわ', 'そら', 'ひこうき'],
  mixed: ['train', 'station', 'keyboard', 'program', 'ねこ', 'はし'],
  long: ['transportation', 'international', 'communication', 'architecture', 'ありがとう']
};

const DEFAULT_WORDS = WORD_POOLS.mixed;
const DEFAULT_ROUTE = 'tokyo_kyoto';
const ROUTE_KEY = 'wrt-route';

const state = {
  running: false,
  idx: 0,
  score: 0,
  time: 60,
  composing: false,
  plan: [],
  totalTime: 60,
  segmentIndex: 0
};

const el = {
  route: document.getElementById('route'),
  start: document.getElementById('start'),
  game: document.getElementById('game'),
  word: document.getElementById('word'),
  input: document.getElementById('input'),
  timer: document.getElementById('timer'),
  result: document.getElementById('result'),
  progress: document.getElementById('progress'),
  progressBar: document.getElementById('progress-bar')
};

function populateRoutes() {
  el.route.innerHTML = '<option value="">Free Play</option>';
  Object.values(routes).forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = r.name;
    el.route.appendChild(opt);
  });
  const saved = localStorage.getItem(ROUTE_KEY) || DEFAULT_ROUTE;
  if (routes[saved]) el.route.value = saved;
}
populateRoutes();

el.route.addEventListener('change', () => {
  localStorage.setItem(ROUTE_KEY, el.route.value);
});

let lastTime = 0;
let currentWords = DEFAULT_WORDS;

function setupPlan(route) {
  state.plan = [];
  let accum = 0;
  route.segments.forEach(seg => {
    accum += seg.durationSec;
    state.plan.push({ end: accum, words: WORD_POOLS[seg.wordPoolId] || DEFAULT_WORDS });
  });
  state.totalTime = accum;
  state.time = accum;
  state.segmentIndex = 0;
  currentWords = state.plan[0].words;
  setupProgressTicks();
}

function setupProgressTicks() {
  el.progress.innerHTML = '<div id="progress-bar"></div>';
  el.progressBar = document.getElementById('progress-bar');
  state.plan.slice(0, -1).forEach(seg => {
    const tick = document.createElement('span');
    tick.className = 'tick';
    tick.style.left = `${(seg.end / state.totalTime) * 100}%`;
    el.progress.appendChild(tick);
  });
}

function nextWord() {
  state.idx = Math.floor(Math.random() * currentWords.length);
  el.word.textContent = currentWords[state.idx];
  el.input.value = '';
}

function endGame() {
  state.running = false;
  el.result.textContent = `Score: ${state.score}`;
  el.start.disabled = false;
}

function updateSegment(elapsed) {
  while (state.segmentIndex < state.plan.length && elapsed >= state.plan[state.segmentIndex].end) {
    state.segmentIndex++;
    if (state.segmentIndex < state.plan.length) {
      currentWords = state.plan[state.segmentIndex].words;
    }
  }
}

function tick(ts) {
  if (!state.running) return;
  if (!lastTime) lastTime = ts;
  const dt = (ts - lastTime) / 1000;
  lastTime = ts;
  state.time -= dt;
  if (state.time <= 0) {
    el.timer.textContent = '0';
    el.progressBar.style.width = '100%';
    endGame();
    return;
  }
  const elapsed = state.totalTime - state.time;
  updateSegment(elapsed);
  el.timer.textContent = state.time.toFixed(0);
  el.progressBar.style.width = `${(elapsed / state.totalTime) * 100}%`;
  requestAnimationFrame(tick);
}

function submit() {
  if (el.input.value.trim() === el.word.textContent) {
    state.score++;
    nextWord();
  } else {
    el.input.classList.add('error');
    setTimeout(() => el.input.classList.remove('error'), 300);
  }
}

function start() {
  const routeId = el.route.value;
  if (routeId && routes[routeId]) {
    setupPlan(routes[routeId]);
  } else {
    state.plan = [{ end: 60, words: DEFAULT_WORDS }];
    state.totalTime = 60;
    state.time = 60;
    state.segmentIndex = 0;
    currentWords = DEFAULT_WORDS;
    setupProgressTicks();
  }
  state.running = true;
  state.score = 0;
  el.start.disabled = true;
  el.game.classList.remove('hidden');
  nextWord();
  el.input.focus();
  lastTime = 0;
  requestAnimationFrame(tick);
}

el.start.addEventListener('click', start);

document.body.addEventListener('click', () => {
  if (state.running) el.input.focus();
});

el.input.addEventListener('compositionstart', () => {
  state.composing = true;
});
el.input.addEventListener('compositionend', () => {
  state.composing = false;
});
el.input.addEventListener('keydown', (e) => {
  if (state.composing) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    submit();
  }
});

console.log('[QA] game.js loaded');
console.assert(Object.keys(WORD_POOLS).length > 0, '[QA] word pools available');
try {
  localStorage.setItem('tg-test', '1');
  localStorage.removeItem('tg-test');
  console.log('[QA] localStorage R/W works');
} catch (err) {
  console.warn('[QA] localStorage unavailable', err);
}
