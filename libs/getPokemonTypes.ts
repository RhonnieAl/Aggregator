import pokemonsData from "../data/pokemon.json";

export const pokemonNameMap: { [key: string]: string } = {
  // Map names from top_pokemons.json to pokemon.json. Continue to exapnd this list as they come
  "Typhlosion Hisui": "typhlosion-hisuian",
  Tatsugiri: "tatsugiri-stretchy-form",
  Basculegion: "basculegion-male",
  "Lilligant Hisui": "lilligant-hisuian",
  Indeedee: "indeedee-female",
  "Indeedee F": "indeedee-female",
  "Indeedee M": "indeedee-male",
  "Zoroark Hisui": "zoroark-hisuian",
  "Weezing Galar": "weezing-galarian",
  Maushold: "maushold-family-of-four",
  "Ninetales Alola": "ninetales-alolan",
  "Decidueye Hisui": "decidueye-hisuian",
  Palafin: "palafin-zero-form",
  Toxtricity: "toxtricity-amped-form",
  "Palkia Origin": "palkia-origin-forme",
  "Dudunsparce Three Segment": "dudunsparce-three-segment-form",
  "Dudunsparce Two Segment": "dudunsparce-two-segment-form",
  "Braviary Hisui": "braviary-hisuian",
  "Arcanine Hisui": "arcanine-hisuian",
  "Tauros Paldea Aqua": "tauros-aqua-breed",
  "Tauros Paldea Blaze": "tauros-blaze-breed",
  "Samurott Hisui": "samurott-hisuian",
  "Slowking Galar": "slowking-galarian",
  Lycanroc: "lycanroc-midday-form",
  "Calyrex Ice": "calyrex-ice-rider",
  "Calyrex Shadow": "calyrex-shadow-rider",
  "Ursaluna Bloodmoon": "ursaluna-bloodmoon",
  "Sandslash Alola": "sandslash-alolan",
  "Porygon-Z": "porygon-z",
  "Kommo-O": "kommo-o",
  "Muk Alola": "muk-alolan",
  "Ting Lu": "ting-lu",
  "Flutter Mane": "flutter-mane",
  "Urshifu Rapid Strike": "urshifu-rapid-strike-style",
  "Urshifu Single Strike": "urshifu-single-strike-style",
  "Chien Pao": "chien-pao",
  "Wo Chien": "wo-chien",
  "Tyranitar Mega": "tyranitar-mega",
  "Iron Hands": "iron-hands",
  "Iron Jugulis": "iron-jugulis",
  "Iron Moth": "iron-moth",
  "Iron Valiant": "iron-valiant",
  "Iron Bundle": "iron-bundle",
  "Iron Thorns": "iron-thorns",
  "Iron Leaves": "iron-leaves",
  "Iron Treads": "iron-treads",
  "Iron Boulder": "iron-boulder",
  "Iron Crown": "iron-crown",
  "Aggron Mega": "aggron-mega",
  "Ogerpon Hearthflame": "ogerpon-hearthflame-mask",
  "Ogerpon Wellspring": "ogerpon-wellspring-mask",
  "Ogerpon Cornerstone": "ogerpon-cornerstone-mask",
  "Ogerpon Teal": "ogerpon-teal-mask",
  "Marowak Alola": "marowak-alolan",
  "Raging Bolt": "raging-bolt",
  "Gengar Mega": "gengar-mega",
  "Chi Yu": "chi-yu",
  "Scream Tail": "scream-tail",
  "Lopunny Mega": "lopunny-mega",
  "Landorus Incarnate": "landorus-incarnate-forme",
  "Landorus Therian": "landorus-therian-forme",
  "Blaziken Mega": "blaziken-mega",
  "Tapu Lele": "tapu-lele",
  "Tapu Fini": "tapu-fini",
  "Tapu Koko": "tapu-koko",
  "Tapu Bulu": "tapu-bulu",
  "Swampert Mega": "swampert-mega",
  "Moltres Galar": "moltres-galarian",
  "Venusaur Mega": "venusaur-mega",
  "Charizard Mega Y": "charizard-mega-y",
  "Charizard Mega X": "charizard-mega-x",
  "Rotom Heat": "rotom-heat",
  "Rotom Wash": "rotom-wash",
  "Rotom Frost": "rotom-frost",
  "Rotom Mow": "rotom-mow",
  "Rotom Fan": "rotom-fan",
  "Persian Alola": "persian-alolan",
  "Oricorio Sensu": "oricorio-sensu-style",
  "Oricorio Pom Pom": "oricorio-pom-pom-style",
  "Oricorio Baile": "oricorio-baile-style",
  "Raichu Alola": "raichu-alolan",
  "Goodra Hisui": "goodra-hisuian",
  "Electrode Hisui": "electrode-hisuian"

  // Add other mappings as needed
};

export function getPokemonTypes(pokemonName: string): string[] {
  // Use alias mapping if available
  let mappedName = pokemonNameMap[pokemonName];

  // If no mapping exists, normalize the name
  if (!mappedName) {
    mappedName = pokemonName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
      .trim();
  }

  // Find the Pokémon in the data
  const pokemon = pokemonsData.pokemons.find((p) => {
    const normalizedDataName = p.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .trim();

    return normalizedDataName === mappedName;
  });

  if (!pokemon) {
    throw new Error(`${pokemonName} not found in the Pokémon data.`);
  }

  return pokemon.types;
}
