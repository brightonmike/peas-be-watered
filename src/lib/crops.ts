import type { Crop } from "@/lib/types";

export interface CategorisedCrop extends Crop {
  category: string;
}

export const CROPS: CategorisedCrop[] = [
  // Fruiting vegetables
  { id: "tomato",              name: "Tomatoes",            category: "Fruiting vegetables", waterNeed: 9, droughtTolerance: 2 },
  { id: "courgette",           name: "Courgettes",          category: "Fruiting vegetables", waterNeed: 8, droughtTolerance: 3 },
  { id: "cucumber",            name: "Cucumbers",           category: "Fruiting vegetables", waterNeed: 9, droughtTolerance: 2 },
  { id: "pepper",              name: "Peppers",             category: "Fruiting vegetables", waterNeed: 7, droughtTolerance: 3 },
  { id: "aubergine",           name: "Aubergines",          category: "Fruiting vegetables", waterNeed: 7, droughtTolerance: 3 },
  { id: "sweetcorn",           name: "Sweetcorn",           category: "Fruiting vegetables", waterNeed: 7, droughtTolerance: 4 },
  { id: "pumpkin",             name: "Pumpkins",            category: "Fruiting vegetables", waterNeed: 8, droughtTolerance: 3 },
  { id: "butternut-squash",    name: "Butternut Squash",    category: "Fruiting vegetables", waterNeed: 7, droughtTolerance: 4 },

  // Legumes
  { id: "runner-beans",        name: "Runner Beans",        category: "Legumes",             waterNeed: 7, droughtTolerance: 3 },
  { id: "french-beans",        name: "French Beans",        category: "Legumes",             waterNeed: 7, droughtTolerance: 3 },
  { id: "broad-beans",         name: "Broad Beans",         category: "Legumes",             waterNeed: 5, droughtTolerance: 5 },
  { id: "peas",                name: "Peas",                category: "Legumes",             waterNeed: 7, droughtTolerance: 3 },

  // Leaves & salads
  { id: "lettuce",             name: "Lettuce",             category: "Leaves & salads",     waterNeed: 8, droughtTolerance: 2 },
  { id: "spinach",             name: "Spinach",             category: "Leaves & salads",     waterNeed: 7, droughtTolerance: 3 },
  { id: "chard",               name: "Chard",               category: "Leaves & salads",     waterNeed: 7, droughtTolerance: 3 },
  { id: "kale",                name: "Kale",                category: "Leaves & salads",     waterNeed: 5, droughtTolerance: 5 },

  // Brassicas
  { id: "cabbage",             name: "Cabbage",             category: "Brassicas",           waterNeed: 6, droughtTolerance: 4 },
  { id: "broccoli",            name: "Broccoli",            category: "Brassicas",           waterNeed: 6, droughtTolerance: 4 },
  { id: "cauliflower",         name: "Cauliflower",         category: "Brassicas",           waterNeed: 6, droughtTolerance: 3 },
  { id: "brussels-sprouts",    name: "Brussels Sprouts",    category: "Brassicas",           waterNeed: 6, droughtTolerance: 4 },

  // Roots
  { id: "beetroot",            name: "Beetroot",            category: "Roots",               waterNeed: 6, droughtTolerance: 4 },
  { id: "carrot",              name: "Carrots",             category: "Roots",               waterNeed: 5, droughtTolerance: 5 },
  { id: "parsnip",             name: "Parsnips",            category: "Roots",               waterNeed: 4, droughtTolerance: 6 },
  { id: "turnip",              name: "Turnips",             category: "Roots",               waterNeed: 5, droughtTolerance: 4 },
  { id: "swede",               name: "Swede",               category: "Roots",               waterNeed: 5, droughtTolerance: 4 },
  { id: "radish",              name: "Radishes",            category: "Roots",               waterNeed: 5, droughtTolerance: 4 },
  { id: "celeriac",            name: "Celeriac",            category: "Roots",               waterNeed: 8, droughtTolerance: 2 },

  // Tubers
  { id: "potato",              name: "Potatoes",            category: "Tubers",              waterNeed: 7, droughtTolerance: 4 },
  { id: "sweet-potato",        name: "Sweet Potatoes",      category: "Tubers",              waterNeed: 6, droughtTolerance: 5 },

  // Alliums
  { id: "onion",               name: "Onions",              category: "Alliums",             waterNeed: 4, droughtTolerance: 6 },
  { id: "shallot",             name: "Shallots",            category: "Alliums",             waterNeed: 4, droughtTolerance: 6 },
  { id: "leek",                name: "Leeks",               category: "Alliums",             waterNeed: 5, droughtTolerance: 5 },
  { id: "garlic",              name: "Garlic",              category: "Alliums",             waterNeed: 3, droughtTolerance: 7 },
  { id: "chives",              name: "Chives",              category: "Alliums",             waterNeed: 5, droughtTolerance: 5 },

  // Stems & other
  { id: "celery",              name: "Celery",              category: "Stems & other",       waterNeed: 9, droughtTolerance: 1 },
  { id: "fennel",              name: "Fennel",              category: "Stems & other",       waterNeed: 6, droughtTolerance: 4 },
  { id: "asparagus",           name: "Asparagus",           category: "Stems & other",       waterNeed: 4, droughtTolerance: 6 },
  { id: "rhubarb",             name: "Rhubarb",             category: "Stems & other",       waterNeed: 5, droughtTolerance: 5 },
  { id: "globe-artichoke",     name: "Globe Artichoke",     category: "Stems & other",       waterNeed: 5, droughtTolerance: 5 },
  { id: "jerusalem-artichoke", name: "Jerusalem Artichoke", category: "Stems & other",       waterNeed: 3, droughtTolerance: 8 },

  // Fruit
  { id: "strawberry",          name: "Strawberries",        category: "Fruit",               waterNeed: 7, droughtTolerance: 3 },
  { id: "raspberry",           name: "Raspberries",         category: "Fruit",               waterNeed: 6, droughtTolerance: 4 },
  { id: "blackcurrant",        name: "Blackcurrants",       category: "Fruit",               waterNeed: 6, droughtTolerance: 4 },
  { id: "redcurrant",          name: "Redcurrants",         category: "Fruit",               waterNeed: 5, droughtTolerance: 5 },
  { id: "gooseberry",          name: "Gooseberries",        category: "Fruit",               waterNeed: 5, droughtTolerance: 5 },

  // Herbs
  { id: "mint",                name: "Mint",                category: "Herbs",               waterNeed: 7, droughtTolerance: 3 },
  { id: "basil",               name: "Basil",               category: "Herbs",               waterNeed: 7, droughtTolerance: 2 },
  { id: "parsley",             name: "Parsley",             category: "Herbs",               waterNeed: 6, droughtTolerance: 3 },
  { id: "coriander",           name: "Coriander",           category: "Herbs",               waterNeed: 6, droughtTolerance: 3 },
  { id: "dill",                name: "Dill",                category: "Herbs",               waterNeed: 5, droughtTolerance: 4 },
  { id: "oregano",             name: "Oregano",             category: "Herbs",               waterNeed: 3, droughtTolerance: 8 },
  { id: "thyme",               name: "Thyme",               category: "Herbs",               waterNeed: 3, droughtTolerance: 8 },
  { id: "rosemary",            name: "Rosemary",            category: "Herbs",               waterNeed: 2, droughtTolerance: 9 },
  { id: "sage",                name: "Sage",                category: "Herbs",               waterNeed: 3, droughtTolerance: 8 },
];

export const CROP_CATEGORIES = [
  "Fruiting vegetables",
  "Legumes",
  "Leaves & salads",
  "Brassicas",
  "Roots",
  "Tubers",
  "Alliums",
  "Stems & other",
  "Fruit",
  "Herbs",
] as const;

export const CROP_MAP = new Map(CROPS.map((c) => [c.id, c]));

export function getCropsByIds(ids: string[]): CategorisedCrop[] {
  return ids.flatMap((id) => CROP_MAP.get(id) ?? []);
}
