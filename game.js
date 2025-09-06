/* game.js: Typing game logic. Imports locale data and manages modes, persistence, and UI updates. Key decisions: cache DOM writes, keep state encapsulated, and separate locale data. */

import { LOCALES, DEFAULT_LOCALE } from './typing/data.js';

const locale = LOCALES[DEFAULT_LOCALE];
const { easy: EASY, medium: MEDIUM, hard: HARD } = locale.words;
const ALL_WORDS = [...EASY, ...MEDIUM, ...HARD];

const TIMER_DURATION = 60; // seconds
const STORAGE_KEY = 'typing-game-stats';

const state = {
  running: false,
  mode: 'timed',
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
  wpm: 0,
  history: []
};

const el = {};
const prev = {};

console.log('[QA] game.js loaded');
console.assert(ALL_WORDS.length > 0, '[QA] word list should not be empty');
try {
  localStorage.setItem('tg-check', '1');
  localStorage.removeItem('tg-check');
  console.log('[QA] localStorage R/W works');
} catch (e) {
  console.warn('[QA] localStorage unavailable', e);
}

/**
 * Return a random word based on difficulty ramp or practice mode.
 * @returns {string}
 */
function pickWord() {
  if (state.mode === 'practice') {
    const pool = ALL_WORDS;
    return pool[Math.floor(Math.random() * pool.length)];
  }
  const elapsed = state.elapsed;
  const pool = elapsed < 20 ? EASY : elapsed < 40 ? MEDIUM : HARD;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Set text content if changed.
 * @param {HTMLElement} node
 * @param {string} value
 * @param {string} key
 */
function setText(node, value, key) {
  if (prev[key] !== value) {
    node.textContent = value;
    prev[key] = value;
  }
}

/** Update statistics UI. */
function updateStats() {
  const accuracy = state.total > 0 ? Math.round((state.correct / state.total) * 100) : 100;
  if (state.mode === 'timed') {
    const minutes = state.elapsed / 60;
    state.wpm = minutes > 0 ? Math.round(state.correct / minutes) : 0;
    setText(el.time, `${Math.ceil(state.timeLeft)}${locale.ui.stats.time}`, 'time');
    setText(el.score, `${state.score} ${locale.ui.stats.score}`, 'score');
    setText(el.wpm, `${state.wpm} ${locale.ui.stats.wpm}`, 'wpm');
    setText(el.accuracy, `${accuracy}${locale.ui.stats.accuracy}`, 'accuracy');
    setText(el.combo, `${state.combo}${locale.ui.stats.combo}`, 'combo');
    setText(el.highScore, `${locale.ui.stats.highScore}${state.highScore}`, 'high');
  } else {
    setText(el.accuracy, `${accuracy}${locale.ui.stats.accuracy}`, 'accuracy');
    setText(el.combo, `${state.combo}${locale.ui.stats.streak}`, 'combo');
  }
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
    state.nextWord = pickWord();
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

/** Start timed game. */
function startGame() {
  state.mode = 'timed';
  state.running = true;
  state.score = 0;
  state.combo = 0;
  state.correct = 0;
  state.total = 0;
  state.startTime = performance.now();
  state.elapsed = 0;
  state.timeLeft = TIMER_DURATION;

  state.currentWord = pickWord();
  state.nextWord = pickWord();
  showWords();

  el.menu.classList.add('hidden');
  el.restart.classList.add('hidden');
  el.game.classList.remove('hidden');
  el.time.classList.remove('hidden');
  el.score.classList.remove('hidden');
  el.wpm.classList.remove('hidden');
  el.highScore.classList.remove('hidden');
  el.input.focus();
  requestAnimationFrame(tick);
}

/** Start practice mode. */
function startPractice() {
  state.mode = 'practice';
  state.running = true;
  state.score = 0;
  state.combo = 0;
  state.correct = 0;
  state.total = 0;

  state.currentWord = pickWord();
  state.nextWord = pickWord();
  showWords();

  el.menu.classList.add('hidden');
  el.game.classList.remove('hidden');
  el.restart.classList.remove('hidden');
  el.restart.textContent = locale.ui.exit;
  el.time.classList.add('hidden');
  el.score.classList.add('hidden');
  el.wpm.classList.add('hidden');
  el.highScore.classList.add('hidden');
  el.input.focus();
}

/** Finish timed game and persist stats. */
function endGame() {
  state.running = false;
  el.restart.classList.remove('hidden');
  el.restart.textContent = locale.ui.restart;
  el.menu.classList.remove('hidden');
  el.input.blur();
  if (state.score > state.highScore) state.highScore = state.score;
  if (state.wpm > state.bestWPM) state.bestWPM = state.wpm;
  state.history.push({ score: state.score, wpm: state.wpm, ts: Date.now() });
  if (state.history.length > 5) state.history = state.history.slice(-5);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ highScore: state.highScore, bestWPM: state.bestWPM, history: state.history })
  );
  updateStats();
  renderHistory();
  el.restart.focus();
}

function exitPractice() {
  state.running = false;
  el.game.classList.add('hidden');
  el.menu.classList.remove('hidden');
  el.restart.classList.add('hidden');
  el.input.blur();
  el.start.focus();
}

/** Render last scores list. */
function renderHistory() {
  el.history.innerHTML = state.history
    .map(
      (h) =>
        `<li>${new Date(h.ts).toLocaleTimeString()} - ${h.score} ${locale.ui.stats.score}, ${h.wpm} ${locale.ui.stats.wpm}</li>`
    )
    .join('');
}

function loadStored() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  state.highScore = data.highScore || 0;
  state.bestWPM = data.bestWPM || 0;
  state.history = Array.isArray(data.history) ? data.history : [];
}

function init() {
  el.start = document.getElementById('start');
  el.practice = document.getElementById('practice');
  el.restart = document.getElementById('restart');
  el.game = document.getElementById('game');
  el.menu = document.getElementById('menu');
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
  el.history = document.getElementById('history');
  el.title = document.getElementById('title');
  el.description = document.getElementById('description');

  // apply locale strings
  document.documentElement.lang = DEFAULT_LOCALE;
  el.title.textContent = locale.ui.title;
  el.description.textContent = locale.ui.description;
  el.start.textContent = locale.ui.start;
  el.practice.textContent = locale.ui.practice;
  el.restart.textContent = locale.ui.restart;

  loadStored();
  updateStats();
  renderHistory();

  el.start.addEventListener('click', startGame);
  el.practice.addEventListener('click', startPractice);
  el.restart.addEventListener('click', () => {
    if (state.mode === 'practice') {
      exitPractice();
    } else {
      startGame();
    }
  });
  el.input.addEventListener('keydown', handleKey);
  el.input.addEventListener('blur', () => {
    if (state.running) setTimeout(() => el.input.focus(), 0);
  });
  document.addEventListener('click', (e) => {
    if (state.running && !e.target.closest('button')) el.input.focus();
  });
}

document.addEventListener('DOMContentLoaded', init);
