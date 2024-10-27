export interface IPokemonUsage {
  pokemon: string;
  usage_percentage: number;
}

export interface ITournament {
  tournament_id: number;
  tournament_title: string;
  navigation_url: string;
  date: Date;
  pokemon_usage: IPokemonUsage[];
  team_count: number;
  is_official: boolean;
}

export interface ITopPokemonPerDay {
  date: string; // "MM-DD-YYYY";
  top_pokemon: IPokemonUsage[];
}
