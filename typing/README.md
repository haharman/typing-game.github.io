# Typing Game

Minimal typing game for GitHub Pages. Works with plain HTML/CSS/JS, no build step.

## Setup
1. Fork or clone this repo.
2. Serve the directory through GitHub Pages or any static host.
3. Open `index.html` in a modern browser.

## Customization
- **Word lists & UI strings:** edit `typing/data.js` for each locale.
- **Timer length:** adjust `TIMER_DURATION` in `game.js`.
- **Practice mode:** available via the *Practice* button; stats reset when exiting.

## Troubleshooting
- If stats do not persist, ensure the browser allows `localStorage`.
- Mobile keyboards may blur the input; tap the background to refocus.
- Use a modern browser; ES modules are required.

## CHANGELOG
- Added locale data module and practice mode.
- Persist and display last five scores.
