/* game.js: Typing game logic and word list. Vanilla ES module with requestAnimationFrame loop and localStorage persistence. Key decisions: pre-render next word for smoother updates and keep state scoped to avoid globals. */

export const WORDS = [
  // Easy words
  'cat', 'dog', 'sun', 'moon', 'tree', 'sky', 'ai', 'ka', 'neko', 'inu', 'sora', 'hana',
  // Medium words
  'orange', 'guitar', 'sushi', 'ramen', 'kawaii', 'tokyo', 'sakura', 'sensei', 'samurai', 'river',
  // Hard words
  'javascript', 'responsibility', 'extraordinary', 'konnichiwa', 'arigatou', 'mountain', 'computer', 'keyboard', 'nihongo', 'generation'
];

const EASY = WORDS.slice(0, 12);
const MEDIUM = WORDS.slice(12, 22);
const HARD = WORDS.slice(22);

const TIMER_DURATION = 60; // seconds
const STORAGE_KEY = 'typing-game-stats';

const state = {
  running: false,
  currentWord: '',
  nextWord: '',
  score: 0,
  combo: 0,
  correct: 0,
  total: 0,
  startTime: 0,
  elapsed: 0,
  timeLeft: TIMER_DURATION,
  highScore: 0,
  bestWPM: 0,
  wpm: 0
};

const el = {};

console.log('[QA] game.js loaded');
console.assert(Array.isArray(WORDS) && WORDS.length > 0, '[QA] WORDS array should not be empty');
try {
  localStorage.setItem('tg-check', '1');
  localStorage.removeItem('tg-check');
  console.log('[QA] localStorage R/W works');
} catch (e) {
  console.warn('[QA] localStorage unavailable', e);
}

/**
 * Return a random word based on elapsed time for difficulty ramp.
 * @param {number} elapsed Seconds since game start.
 * @returns {string}
 */
function pickWord(elapsed) {
  const pool = elapsed < 20 ? EASY : elapsed < 40 ? MEDIUM : HARD;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Update statistics UI.
 */
function updateStats() {
  el.time.textContent = Math.ceil(state.timeLeft);
  el.score.textContent = state.score;
  const minutes = state.elapsed / 60;
  state.wpm = minutes > 0 ? Math.round(state.correct / minutes) : 0;
  el.wpm.textContent = `${state.wpm} WPM`;
  const accuracy = state.total > 0 ? Math.round((state.correct / state.total) * 100) : 100;
  el.accuracy.textContent = `${accuracy}%`;
  el.combo.textContent = `${state.combo}x`;
  el.highScore.textContent = `HS:${state.highScore}`;
}

function showWords() {
  el.currentWord.textContent = state.currentWord;
  el.nextWord.textContent = state.nextWord;
}

function flashError() {
  el.wordContainer.classList.add('error');
  setTimeout(() => el.wordContainer.classList.remove('error'), 300);
}

function handleKey(e) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    validateInput();
  }
}

function validateInput() {
  const value = el.input.value.trim();
  state.total++;
  if (value === state.currentWord) {
    state.correct++;
    state.score++;
    state.combo++;
    state.currentWord = state.nextWord;
    state.nextWord = pickWord(state.elapsed);
    showWords();
  } else {
    state.combo = 0;
    flashError();
  }
  el.input.value = '';
  updateStats();
  el.input.focus();
}

function tick(now) {
  state.elapsed = (now - state.startTime) / 1000;
  state.timeLeft = Math.max(0, TIMER_DURATION - state.elapsed);
  updateStats();
  if (state.timeLeft > 0) {
    requestAnimationFrame(tick);
  } else {
    endGame();
  }
}

/**
 * Initialize state and begin a new round.
 */
function startGame() {
  state.running = true;
  state.score = 0;
  state.combo = 0;
  state.correct = 0;
  state.total = 0;
  state.startTime = performance.now();
  state.elapsed = 0;
  state.timeLeft = TIMER_DURATION;

  state.currentWord = pickWord(0);
  state.nextWord = pickWord(0);
  showWords();

  el.start.classList.add('hidden');
  el.game.classList.remove('hidden');
  el.input.focus();
  requestAnimationFrame(tick);
}

/**
 * Finish the game, persist high scores, and show restart UI.
 */
function endGame() {
  state.running = false;
  el.restart.classList.remove('hidden');
  el.input.blur();
  if (state.score > state.highScore) state.highScore = state.score;
  if (state.wpm > state.bestWPM) state.bestWPM = state.wpm;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ highScore: state.highScore, bestWPM: state.bestWPM }));
  updateStats();
}

function loadStored() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  state.highScore = data.highScore || 0;
  state.bestWPM = data.bestWPM || 0;
}

function init() {
  el.start = document.getElementById('start');
  el.restart = document.getElementById('restart');
  el.game = document.getElementById('game');
  el.input = document.getElementById('input');
  el.currentWord = document.getElementById('current-word');
  el.nextWord = document.getElementById('next-word');
  el.time = document.getElementById('time');
  el.score = document.getElementById('score');
  el.wpm = document.getElementById('wpm');
  el.accuracy = document.getElementById('accuracy');
  el.combo = document.getElementById('combo');
  el.highScore = document.getElementById('high-score');
  el.wordContainer = document.getElementById('word-container');

  loadStored();
  updateStats();

  el.start.addEventListener('click', startGame);
  el.restart.addEventListener('click', () => {
    el.restart.classList.add('hidden');
    startGame();
  });
  el.input.addEventListener('keydown', handleKey);
  el.input.addEventListener('blur', () => {
    if (state.running) setTimeout(() => el.input.focus(), 0);
  });
  document.addEventListener('click', () => {
    if (state.running) el.input.focus();
  });
}

document.addEventListener('DOMContentLoaded', init);
