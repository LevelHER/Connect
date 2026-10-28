// Browser copy of server/api-util/treatmentFees.js.
// Used only to warn providers on the listing form. If you change a fee on the server, change it here too.

const PERCENTAGE_FEE = 15;

const PERCENTAGE_TREATMENTS = [
  'chemical-peels',
  'hydrafacial',
  'led-light-therapy',
  'lymphatic-drainage-massage',
  'ultrasonic-cavitation',
  'facial',
];

const FLAT_FEES_USD = {
  botox: 60,
  coolsculpting: 100,
  'dermal-fillers': 105,
  dysport: 60,
  'emsculpt-neo': 128,
  'exilis-ultra': 60,
  ipl: 60,
  jeuveau: 57,
  kybella: 150,
  'laser-cellulite-reduction': 180,
  'laser-fat-reduction': 225,
  'laser-hair-removal': 38,
  'laser-lipolysis': 50,
  'laser-skin-rejuvenation': 75,
  'laser-skin-resurfacing': 180,
  'laser-skin-tightening': 90,
  'laser-therapy': 68,
  liposonix: 70,
  'hifu-face': 60,
  'vampire-facial': 113,
  'pdo-thread-lift': 330,
  prf: 113,
  'prf-gel-ezgel': 60,
  prp: 98,
  'rf-skin-tightening': 68,
  sculpsure: 75,
  sculptra: 135,
  skinvive: 113,
  'venus-legacy': 60,
  'trusculpt-id': 88,
  ultherapy: 100,
  ultrashape: 110,
  velashape: 53,
};

export const getTreatmentFee = treatment => {
  if (PERCENTAGE_TREATMENTS.includes(treatment)) {
    return { type: 'percentage', percentage: PERCENTAGE_FEE };
  }
  if (Object.prototype.hasOwnProperty.call(FLAT_FEES_USD, treatment)) {
    return { type: 'flat', amountUsd: FLAT_FEES_USD[treatment] };
  }
  return null;
};