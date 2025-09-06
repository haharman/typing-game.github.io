/* routes/schema.js: Route type description. Key decisions: explicit fields for segments and defaults. */

/**
 * Segment describing a portion of a route.
 * @typedef {Object} RouteSegment
 * @property {number} durationSec - duration of this segment in seconds.
 * @property {string} wordPoolId - key of the word pool to draw from.
 * @property {string} [speedHint] - optional textual hint for pacing.
 */

/**
 * Definition of a typing route.
 * @typedef {Object} Route
 * @property {string} id - unique identifier for the route.
 * @property {string} name - display name.
 * @property {string} description - short description shown to players.
 * @property {RouteSegment[]} segments - ordered segments making up the route.
 */

/** @type {Route} */
export const RouteSchema = {
  id: '',
  name: '',
  description: '',
  segments: []
};
