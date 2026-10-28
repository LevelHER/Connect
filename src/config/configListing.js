/////////////////////////////////////////////////////////
// Configurations related to listing.                  //
// LevelHER: listing fields and listing types          //
/////////////////////////////////////////////////////////

// Note: In development, this file is merged with the marketplace configuration
// (see configHelpers.js). Keep the exports below: listingFields, listingTypes,
// enforceValidListingType.

export const listingFields = [
  {
    key: 'originalPrice',
    scope: 'public',
    schemaType: 'long',
    numberConfig: {
      minimum: 1,
      maximum: 100000,
    },
    showConfig: {
      label: 'Original price (USD)',
      isDetail: false,
    },
    saveConfig: {
      label: 'Original price before discount (USD, optional)',
      placeholderMessage: 'For example: 200',
      isRequired: false,
    },
  },
  {
    key: 'treatment',
    scope: 'public',
    schemaType: 'enum',
    enumOptions: [
      { option: 'botox', label: 'Botox' },
      { option: 'chemical-peels', label: 'Chemical Peels' },
      { option: 'coolsculpting', label: 'CoolSculpting' },
      { option: 'dermal-fillers', label: 'Dermal Fillers' },
      { option: 'dysport', label: 'Dysport' },
      { option: 'emsculpt-neo', label: 'Emsculpt Neo' },
      { option: 'exilis-ultra', label: 'Exilis Ultra' },
      { option: 'ipl', label: 'IPL' },
      { option: 'jeuveau', label: 'Jeuveau' },
      { option: 'kybella', label: 'Kybella' },
      { option: 'laser-cellulite-reduction', label: 'Laser Cellulite Reduction' },
      { option: 'laser-fat-reduction', label: 'Laser Fat Reduction' },
      { option: 'laser-hair-removal', label: 'Laser Hair Removal' },
      { option: 'laser-lipolysis', label: 'Laser Lipolysis' },
      { option: 'laser-skin-rejuvenation', label: 'Laser Skin Rejuvenation' },
      { option: 'laser-skin-resurfacing', label: 'Laser Skin Resurfacing' },
      { option: 'laser-skin-tightening', label: 'Laser Skin Tightening' },
      { option: 'laser-therapy', label: 'Laser Therapy' },
      { option: 'liposonix', label: 'Liposonix' },
      { option: 'hifu-face', label: 'HIFU Face' },
      { option: 'vampire-facial', label: 'Vampire Facial' },
      { option: 'pdo-thread-lift', label: 'PDO Thread Lift' },
      { option: 'prf', label: 'PRF' },
      { option: 'prf-gel-ezgel', label: 'PRF Gel/EZGel' },
      { option: 'prp', label: 'PRP' },
      { option: 'rf-skin-tightening', label: 'RF Skin Tightening' },
      { option: 'sculpsure', label: 'SculpSure' },
      { option: 'sculptra', label: 'Sculptra' },
      { option: 'skinvive', label: 'SKINVIVE' },
      { option: 'venus-legacy', label: 'Venus Legacy' },
      { option: 'trusculpt-id', label: 'TruSculpt iD' },
      { option: 'ultherapy', label: 'Ultherapy' },
      { option: 'ultrashape', label: 'UltraShape' },
      { option: 'velashape', label: 'VelaShape' },
      { option: 'hydrafacial', label: 'HydraFacial' },
      { option: 'led-light-therapy', label: 'LED Light Therapy' },
      { option: 'lymphatic-drainage-massage', label: 'Lymphatic Drainage Massage' },
      { option: 'ultrasonic-cavitation', label: 'Ultrasonic Cavitation' },
      { option: 'facial', label: 'Facial' },
    ],
    filterConfig: {
      indexForSearch: true,
      filterType: 'SelectSingleFilter',
      label: 'Treatment',
      group: 'primary',
    },
    showConfig: {
      label: 'Treatment',
      isDetail: true,
    },
    saveConfig: {
      label: 'Treatment',
      placeholderMessage: 'Select a treatment…',
      isRequired: true,
      requiredMessage: 'Please select a treatment.',
    },
  },
];

///////////////////////////////////////////////////////////////////////
// Configurations related to listing types and transaction processes //
///////////////////////////////////////////////////////////////////////

export const listingTypes = [
  {
    listingType: 'levelher-instant-booking',
    label: 'Instant booking',
    transactionType: {
      process: 'levelher-booking',
      alias: 'levelher-booking/release-1',
      unitType: 'fixed',
    },
    availabilityType: 'oneSeat',
    defaultListingFields: {
      location: true,
      payoutDetails: false,
    },
  },
];

// SearchPage can enforce listing query to only those listings with valid listingType
// However, it only works if you have set 'enum' type search schema for the public data fields
//   - listingType
export const enforceValidListingType = false;