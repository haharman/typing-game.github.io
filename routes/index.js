/* routes/index.js: Route registry. Key decisions: simple object map keyed by id. */

import { routeTokyoKyoto } from './sample_tokyo_kyoto.js';

export const routes = {
  [routeTokyoKyoto.id]: routeTokyoKyoto
};
