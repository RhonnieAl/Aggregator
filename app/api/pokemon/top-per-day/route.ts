import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../libs/mongo";
import type {
  ITournament,
  ITopPokemonPerDay,
  IPokemonUsage
} from "../../../../types/tournaments";
import fs from "fs";
import path from "path";

// temporary interface
interface IPokemonUsageTemp {
  pokemon: string;
  total_pokemon_usage_count: number;
}

export async function GET(request: NextRequest) {
  try {
    const db = await dbConnect();
    const collection = db.collection<ITournament>("tournaments");

    // Step 1: Compute total_team_count per day
    const totalTeamCounts = await collection
      .aggregate([
        {
          $project: {
            date: {
              $dateToString: { format: "%m-%d-%Y", date: "$date" }
            },
            team_count: 1
          }
        },
        {
          $group: {
            _id: "$date",
            total_team_count: { $sum: "$team_count" }
          }
        }
      ])
      .toArray();

    // Create a map for quick lookup
    const totalTeamCountMap = new Map<string, number>();
    totalTeamCounts.forEach((item) => {
      totalTeamCountMap.set(item._id, item.total_team_count);
    });

    // Step 2: Compute total_pokemon_usage_count per Pokémon per day
    const pokemonUsageCounts = await collection
      .aggregate([
        {
          $project: {
            date: {
              $dateToString: { format: "%m-%d-%Y", date: "$date" }
            },
            pokemon_usage: 1,
            team_count: 1
          }
        },
        { $unwind: "$pokemon_usage" },
        {
          $project: {
            date: 1,
            pokemon: "$pokemon_usage.pokemon",
            pokemon_usage_count: {
              $multiply: [
                { $divide: ["$pokemon_usage.usage_percentage", 100] },
                "$team_count"
              ]
            }
          }
        },
        {
          $group: {
            _id: { date: "$date", pokemon: "$pokemon" },
            total_pokemon_usage_count: { $sum: "$pokemon_usage_count" }
          }
        }
      ])
      .toArray();

    // Step 3: Prepare usage data per day
    const usageDataPerDay: Record<string, IPokemonUsageTemp[]> = {};

    pokemonUsageCounts.forEach((item) => {
      const date = item._id.date;
      const pokemon = item._id.pokemon;
      const total_pokemon_usage_count = item.total_pokemon_usage_count;

      if (!usageDataPerDay[date]) {
        usageDataPerDay[date] = [];
      }
      usageDataPerDay[date].push({
        pokemon,
        total_pokemon_usage_count
      });
    });

    // Step 4: Compute usage_percentage per Pokémon per day using total_team_count
    const finalUsageDataPerDay: Record<string, IPokemonUsage[]> = {};

    Object.keys(usageDataPerDay).forEach((date) => {
      const totalTeamCount = totalTeamCountMap.get(date)!;
      finalUsageDataPerDay[date] = usageDataPerDay[date].map((pokemonUsage) => {
        const usage_percentage =
          (pokemonUsage.total_pokemon_usage_count / totalTeamCount) * 100;
        return {
          pokemon: pokemonUsage.pokemon,
          usage_percentage: Math.round(usage_percentage * 100) / 100 // Round to 2 decimal places
        };
      });
    });

    // Step 5: Prepare the final data
    const topPokemonPerDay: ITopPokemonPerDay[] = Object.entries(
      finalUsageDataPerDay
    ).map(([date, pokemons]) => {
      // Sort Pokémon by usage percentage descendingly, then by name ascendingly
      const sortedPokemons = pokemons.sort((a, b) => {
        if (b.usage_percentage !== a.usage_percentage) {
          return b.usage_percentage - a.usage_percentage;
        }
        return a.pokemon.localeCompare(b.pokemon);
      });
      // Select the top 6 Pokémon
      const topPokemons = sortedPokemons.slice(0, 6);
      return {
        date,
        top_pokemon: topPokemons
      };
    });

    // Sort by date in ascending order
    topPokemonPerDay.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json<ITopPokemonPerDay[]>(topPokemonPerDay);
  } catch (error) {
    console.error("Error fetching top Pokémon per day:", error);
    return NextResponse.json(
      { message: "Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
