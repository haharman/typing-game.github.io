/* src/minimal.js: Phase0 minimal typing game. Key decisions: standalone module, IME-safe input, rAF timer. */

export const WORDS = [
  'train', 'station', 'keyboard', 'program', 'ねこ', 'ひこうき', 'りんご'
];

const TIMER_SECONDS = 60;

const state = {
  running: false,
  idx: 0,
  score: 0,
  time: TIMER_SECONDS,
  composing: false
};

const el = {
  start: document.getElementById('start'),
  game: document.getElementById('game'),
  word: document.getElementById('word'),
  input: document.getElementById('input'),
  timer: document.getElementById('timer'),
  result: document.getElementById('result')
};

let lastTime = 0;

function nextWord() {
  state.idx = Math.floor(Math.random() * WORDS.length);
  el.word.textContent = WORDS[state.idx];
  el.input.value = '';
}

function endGame() {
  state.running = false;
  el.result.textContent = `Score: ${state.score}`;
  el.start.disabled = false;
}

function tick(ts) {
  if (!state.running) return;
  if (!lastTime) lastTime = ts;
  const dt = (ts - lastTime) / 1000;
  lastTime = ts;
  state.time -= dt;
  if (state.time <= 0) {
    el.timer.textContent = '0';
    endGame();
    return;
  }
  el.timer.textContent = state.time.toFixed(0);
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
  state.running = true;
  state.score = 0;
  state.time = TIMER_SECONDS;
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
  if (e.key === 'Enter') {
    submit();
  }
});

console.log('[QA] minimal.js loaded');
console.assert(WORDS.length > 0, '[QA] words array non-empty');
try {
  localStorage.setItem('tg-test', '1');
  localStorage.removeItem('tg-test');
  console.log('[QA] localStorage R/W works');
} catch (err) {
  console.warn('[QA] localStorage unavailable', err);
}
