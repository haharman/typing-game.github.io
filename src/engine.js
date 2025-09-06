/* src/engine.js: Route-based game engine. Key decisions: finite state machine, tick-based updates. */

// Pseudocode
// export class Game {
//   loadRoute(json) { /* stops, rules, normalizer */ }
//   start() { /* CountIn -> first station */ }
//   update(dt) { /* Approach/Stop/Depart */ }
//   onType(chars) { /* prefix match, commit, backspace rules */ }
// }
