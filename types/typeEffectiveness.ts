import { PokemonType } from "./pokemonTypes";

// Define the type for the effectiveness between an attack and defense type.
export interface TypeEffectiveness {
  [defenseType: string]: number; // Index signature that allows any PokemonType as a key
}

// Define the structure of the type effectiveness data for all attack types.
export interface TypeEffectivenessData {
  type_effectiveness: {
    [attackType: string]: TypeEffectiveness;
  };
}
