export interface RootsLocation {
  id: string;
  siteName: string;
  city: string;
  postcode: string; // approximate town-centre postcode (display only)
  lat: number;      // pre-resolved coordinates so we never need to geocode
  lon: number;
}

export const ROOTS_LOCATIONS: RootsLocation[] = [
  { id: "bosville-fields-allotments",      siteName: "Bosville Fields",      city: "Barnsley",         postcode: "S70 2JL",  lat: 53.55385, lon: -1.47925 },
  { id: "tuckers-meadow-allotments",       siteName: "Tuckers Meadow",       city: "Bath",             postcode: "BA1 1LZ",  lat: 51.38112, lon: -2.36010 },
  { id: "avon-views-allotments",           siteName: "Avon Views",           city: "Bathford",         postcode: "BA1 7TS",  lat: 51.40141, lon: -2.29464 },
  { id: "bristol-leighwoods-allotments",   siteName: "Leigh Woods Meadows",  city: "Bristol",          postcode: "BS8 3PP",  lat: 51.45436, lon: -2.63131 },
  { id: "galleywood-meadow-allotments",    siteName: "Galleywood Meadow",    city: "Chelmsford",       postcode: "CM2 8TN",  lat: 51.69780, lon:  0.45747 },
  { id: "daffodil-views-allotments",       siteName: "Daffodil Views",       city: "Chester",          postcode: "CH1 2HJ",  lat: 53.19174, lon: -2.89272 },
  { id: "meadow-hill-fields-allotments",   siteName: "Meadow Hill Fields",   city: "Croydon",          postcode: "CR0 1AB",  lat: 51.36750, lon: -0.10104 },
  { id: "shirehall-pastures-allotments",   siteName: "Shirehall Pastures",   city: "Dartford",         postcode: "DA1 1DR",  lat: 51.44666, lon:  0.21928 },
  { id: "newbottle-fields-allotments",     siteName: "Newbottle Fields",     city: "Durham",           postcode: "DH4 4EP",  lat: 54.85687, lon: -1.47538 },
  { id: "bentham-fields-allotments",       siteName: "Bentham Fields",       city: "Gloucester",       postcode: "GL2 0SJ",  lat: 51.86392, lon: -2.21751 },
  { id: "providence-pastures-allotments",  siteName: "Providence Pastures",  city: "Leeds",            postcode: "LS1 1BA",  lat: 53.79707, lon: -1.55641 },
  { id: "station-pastures-allotments",     siteName: "Station Pastures",     city: "North Sheffield",  postcode: "S35 2XH",  lat: 53.46359, lon: -1.46519 },
  { id: "ruddington-fields-allotments",    siteName: "Ruddington Fields",    city: "Nottingham",       postcode: "NG11 6AA", lat: 52.89728, lon: -1.16323 },
  { id: "oxney-views-allotments",          siteName: "Oxney Views",          city: "Peterborough",     postcode: "PE1 1XL",  lat: 52.57229, lon: -0.24249 },
  { id: "bowshaw-views-allotments",        siteName: "Bowshaw Views",        city: "Sheffield",        postcode: "S8 8BR",   lat: 53.32633, lon: -1.46952 },
  // ST1, DY8, WN1: postcodes.io didn't have those exact unit codes, so we use
  // outcode-level centroids (~town centre). Good enough for weather lookups.
  { id: "blithe-meadows-allotments",       siteName: "Blithe Meadows",       city: "Stoke-on-Trent",   postcode: "ST1 1RQ",  lat: 53.02739, lon: -2.17292 },
  { id: "sugar-loaf-fields-allotments",    siteName: "Sugar Loaf Fields",    city: "Stourbridge",      postcode: "DY8 1PX",  lat: 52.46089, lon: -2.15585 },
  { id: "muxton-meadows-allotments",       siteName: "Muxton Meadows",       city: "Telford",          postcode: "TF2 8PP",  lat: 52.72454, lon: -2.42573 },
  { id: "kingsdown-fields-allotments",     siteName: "Kingsdown Fields",     city: "Wigan",            postcode: "WN1 1PH",  lat: 53.55351, lon: -2.62795 },
  { id: "patching-meadows-allotments",     siteName: "Patching Meadows",     city: "Worthing",         postcode: "BN13 3UF", lat: 50.83980, lon: -0.43532 },
];

export const ROOTS_LOCATION_MAP = new Map(ROOTS_LOCATIONS.map((l) => [l.id, l]));
