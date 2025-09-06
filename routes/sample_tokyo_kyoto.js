/* routes/sample_tokyo_kyoto.js: Sample route from Tokyo to Kyoto. Key decisions: kana start, mixed middle, long English end. */

/** @type {import('./schema.js').Route} */
export const routeTokyoKyoto = {
  id: 'tokyo_kyoto',
  name: 'Tokyo → Kyoto',
  description: 'Kana to English progression.',
  segments: [
    { durationSec: 20, wordPoolId: 'kana' },
    { durationSec: 20, wordPoolId: 'mixed', speedHint: 'faster' },
    { durationSec: 20, wordPoolId: 'long' }
  ]
};
