/* src/input.js: Input normalization and IME handling helpers. Key decisions: separate concerns, JSDoc for public API. */

/** Normalize kana string.
 * @param {string} s
 * @returns {string}
 */
export function normalizeKana(s) {
  // TODO: implement kana normalization
  return s;
}

/** Normalize romaji string.
 * @param {string} s
 * @returns {string}
 */
export function normalizeRomaji(s) {
  // TODO: implement romaji normalization
  return s;
}

/** Attach IME handlers to input element.
 * @param {HTMLInputElement} el
 * @param {(value:string)=>void} onCommit
 */
export function attachIMEHandlers(el, onCommit) {
  // Pseudocode: listen to compositionstart/update/end
  // on compositionend -> onCommit(el.value)
}

/** Check prefix match between target and typed input.
 * @param {string} target
 * @param {string} typed
 * @returns {{okCount:number,isExact:boolean,isError:boolean}}
 */
export function checkPrefixMatch(target, typed) {
  // Pseudocode comparison
  return { okCount: 0, isExact: false, isError: false };
}
