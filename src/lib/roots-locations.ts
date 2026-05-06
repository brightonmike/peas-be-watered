export interface RootsLocation {
  id: string;
  siteName: string;
  city: string;
  postcode: string; // approximate town-centre postcode used for weather lookup
}

export const ROOTS_LOCATIONS: RootsLocation[] = [
  { id: "bosville-fields-allotments",      siteName: "Bosville Fields",      city: "Barnsley",         postcode: "S70 2JL" },
  { id: "tuckers-meadow-allotments",        siteName: "Tuckers Meadow",        city: "Bath",             postcode: "BA1 1LZ" },
  { id: "avon-views-allotments",            siteName: "Avon Views",            city: "Bathford",         postcode: "BA1 7TS" },
  { id: "bristol-leighwoods-allotments",    siteName: "Leigh Woods Meadows",   city: "Bristol",          postcode: "BS8 3PP" },
  { id: "galleywood-meadow-allotments",     siteName: "Galleywood Meadow",     city: "Chelmsford",       postcode: "CM2 8TN" },
  { id: "daffodil-views-allotments",        siteName: "Daffodil Views",        city: "Chester",          postcode: "CH1 2HJ" },
  { id: "meadow-hill-fields-allotments",    siteName: "Meadow Hill Fields",    city: "Croydon",          postcode: "CR0 1AB" },
  { id: "shirehall-pastures-allotments",    siteName: "Shirehall Pastures",    city: "Dartford",         postcode: "DA1 1DR" },
  { id: "newbottle-fields-allotments",      siteName: "Newbottle Fields",      city: "Durham",           postcode: "DH4 4EP" },
  { id: "bentham-fields-allotments",        siteName: "Bentham Fields",        city: "Gloucester",       postcode: "GL2 0SJ" },
  { id: "providence-pastures-allotments",   siteName: "Providence Pastures",   city: "Leeds",            postcode: "LS1 1BA" },
  { id: "station-pastures-allotments",      siteName: "Station Pastures",      city: "North Sheffield",  postcode: "S35 2XH" },
  { id: "ruddington-fields-allotments",     siteName: "Ruddington Fields",     city: "Nottingham",       postcode: "NG11 6AA" },
  { id: "oxney-views-allotments",           siteName: "Oxney Views",           city: "Peterborough",     postcode: "PE1 1XL" },
  { id: "bowshaw-views-allotments",         siteName: "Bowshaw Views",         city: "Sheffield",        postcode: "S8 8BR" },
  { id: "blithe-meadows-allotments",        siteName: "Blithe Meadows",        city: "Stoke-on-Trent",   postcode: "ST1 1RQ" },
  { id: "sugar-loaf-fields-allotments",     siteName: "Sugar Loaf Fields",     city: "Stourbridge",      postcode: "DY8 1PX" },
  { id: "muxton-meadows-allotments",        siteName: "Muxton Meadows",        city: "Telford",          postcode: "TF2 8PP" },
  { id: "kingsdown-fields-allotments",      siteName: "Kingsdown Fields",      city: "Wigan",            postcode: "WN1 1PH" },
  { id: "patching-meadows-allotments",      siteName: "Patching Meadows",      city: "Worthing",         postcode: "BN13 3UF" },
];

export const ROOTS_LOCATION_MAP = new Map(ROOTS_LOCATIONS.map((l) => [l.id, l]));
