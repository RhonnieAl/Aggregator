"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceArea
} from "recharts";
import type { ITopPokemonPerDay, IPokemonUsage } from "../types/tournaments";
import Loading from "./Loading";
import ErrorComponent from "./Error";
import {
  constructCategoryColors,
  AvailableChartColors,
  AvailableChartColorsKeys,
  getColorClassName
} from "../libs/chartUtils";
import PokemonTooltip from "./PokemonTooltip";
import pokemonData from "../data/pokemon.json";
import { pokemonNameMap } from "../libs/getPokemonTypes";

const TopPokemonStackedBarChart: React.FC = () => {
  // State Hooks
  const [data, setData] = useState<any[] | null>(null);
  const [originalData, setOriginalData] = useState<ITopPokemonPerDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [colorMap, setColorMap] = useState<
    Map<string, AvailableChartColorsKeys>
  >(new Map());
  const [hoveredPokemon, setHoveredPokemon] = useState<IPokemonUsage[]>([]);
  const [chartMargin, setChartMargin] = useState({
    right: 15,
    left: 15,
    bottom: 30
  });

  // Define the maximum number of bars for small screens
  const MAX_BARS_SMALL_SCREEN = 10;

  const displayData = useMemo(() => {
    if (data && isSmallScreen && data.length > MAX_BARS_SMALL_SCREEN) {
      // Display the last MAX_BARS_SMALL_SCREEN days
      return data.slice(-MAX_BARS_SMALL_SCREEN);
    }
    return data || [];
  }, [data, isSmallScreen]);

  // Fetch Data
  useEffect(() => {
    const fetchTopPokemon = async () => {
      try {
        const response = await fetch("/api/pokemon/top-per-day", {
          cache: "no-store"
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Error ${response.status}: ${errorData.message || response.statusText}`
          );
        }
        const result: ITopPokemonPerDay[] = await response.json();
        setOriginalData(result);

        // Extract unique Pokémon
        const uniquePokemonSet = new Set<string>();
        result.forEach((day) => {
          day.top_pokemon.forEach((pokemon) =>
            uniquePokemonSet.add(pokemon.pokemon)
          );
        });
        const uniquePokemon = Array.from(uniquePokemonSet);

        // Compute total usage per Pokémon
        const totalUsageMap = new Map<string, number>();
        uniquePokemon.forEach((pokemon) => {
          totalUsageMap.set(pokemon, 0);
        });
        result.forEach((day) => {
          day.top_pokemon.forEach((pokemon) => {
            const currentTotal = totalUsageMap.get(pokemon.pokemon) || 0;
            totalUsageMap.set(
              pokemon.pokemon,
              currentTotal + pokemon.usage_percentage
            );
          });
        });

        // Sort Pokémon based on total usage ascendingly
        const sortedPokemon = uniquePokemon.sort((a, b) => {
          const totalA = totalUsageMap.get(a) || 0;
          const totalB = totalUsageMap.get(b) || 0;
          return totalA - totalB; // Ascending order
        });

        setPokemonList(sortedPokemon);

        // Assign colors to Pokémon based on sorted list
        const assignedColors = constructCategoryColors(
          sortedPokemon,
          AvailableChartColors
        );
        setColorMap(assignedColors);

        // Transform data for the stacked bar chart
        const transformedData = result.map((day) => {
          const dayData: any = { date: day.date };
          sortedPokemon.forEach((pokemon) => {
            const pokemonData = day.top_pokemon.find(
              (p) => p.pokemon === pokemon
            );
            dayData[pokemon] = pokemonData ? pokemonData.usage_percentage : 0;
          });
          return dayData;
        });

        setData(transformedData);
      } catch (err: any) {
        console.error("Failed to fetch top Pokémon per day:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTopPokemon();
  }, []);

  // Set initial hover to the latest date
  useEffect(() => {
    if (data && originalData.length > 0) {
      const latestData = originalData[originalData.length - 1];
      setHoveredPokemon(latestData.top_pokemon);
    }
  }, [data, originalData]);

  // Dynamic Margin and Screen Size Handling
  useEffect(() => {
    const updateMargin = () => {
      const screenWidth = window.innerWidth;
      const smallScreen = screenWidth < 640;
      setIsSmallScreen(smallScreen);
      if (smallScreen) {
        setChartMargin({ right: 15, left: 15, bottom: 70 }); // Small screen
      } else if (screenWidth >= 1024) {
        setChartMargin({ right: 15, left: 15, bottom: 30 }); // Large screen
      } else {
        setChartMargin({ right: 15, left: 15, bottom: 40 }); // Medium screen
      }
    };

    window.addEventListener("resize", updateMargin);
    updateMargin(); // Set margin on initial load

    return () => window.removeEventListener("resize", updateMargin);
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  if (!data || data.length === 0) {
    return <div className="text-center mt-20">No data available.</div>;
  }

  // Handle Hover
  const handleMouseMove = (state: any) => {
    if (state && state.activeTooltipIndex != null) {
      let actualIndex = state.activeTooltipIndex;
      if (isSmallScreen && data.length > MAX_BARS_SMALL_SCREEN) {
        actualIndex =
          data.length - MAX_BARS_SMALL_SCREEN + state.activeTooltipIndex;
      }
      const dayData = originalData[actualIndex];
      if (dayData) {
        setHoveredPokemon(dayData.top_pokemon);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredPokemon([]);
  };

  const formatDate = (dateString: string) => {
    const [month, day, year] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric"
    };

    return date.toLocaleDateString("en-US", options); // This ensures the format "Oct 23"
  };

  const getPokemonImageUrl = (pokemonName: string) => {
    const mappedName =
      pokemonNameMap[pokemonName] ||
      pokemonName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .trim();

    const pokemon = pokemonData.pokemons.find(
      (p) => p.name.toLowerCase() === mappedName.toLowerCase()
    );

    if (!pokemon) {
      console.warn(`Pokémon "${pokemonName}" not found in pokemon.json.`);
    }

    return pokemon?.images.artwork || "";
  };

  // Determine the latest date in displayData
  const latestDate = displayData[displayData.length - 1].date;

  return (
    <div className="max-w-5xl mx-auto p-0">
      <h2 className="text-2xl font-semibold sm:text-3xl lg:text-3xl mb-6 sm:mb-6 lg:mb-10 text-center">
        Top 6 Most Used Pokémon Per Day
      </h2>
      <ResponsiveContainer
        width="100%"
        height={250}
        className="w-full h-64 sm:h-80 lg:h-96">
        <RechartsBarChart
          data={displayData}
          margin={chartMargin}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(150, 150, 150, 0.3)"
          />
          <XAxis
            dataKey="date"
            interval={0}
            angle={-45}
            textAnchor="end"
            tickFormatter={formatDate}
            tick={isSmallScreen ? { fontSize: 14 } : undefined}
          />
          <YAxis />
          <Tooltip
            content={
              <PokemonTooltip colorMap={colorMap} pokemonOrder={pokemonList} />
            }
            position={{ y: -120 }}
          />
          {pokemonList.map((pokemon) => (
            <Bar
              key={pokemon}
              dataKey={pokemon}
              stackId="a"
              fill={getColorClassName(
                colorMap.get(pokemon) as AvailableChartColorsKeys,
                "fill"
              )}
              isAnimationActive={true} // Disable animation for consistency
            />
          ))}
          {/* Highlight the Latest Bar */}
          <ReferenceArea
            x1={latestDate}
            x2={latestDate}
            y1={0}
            y2="auto"
            fill="rgba(255, 255, 0, 0.1)" // Light yellow overlay; adjust as needed
            stroke="rgba(255, 255, 0, 0.5)" // Yellow border; adjust as needed
          />
        </RechartsBarChart>
      </ResponsiveContainer>
      {hoveredPokemon.length > 0 && (
        <div className="flex justify-center mb-4 mt-0 flex-wrap">
          {hoveredPokemon
            .slice() // Create a shallow copy to avoid mutating state
            .sort((a, b) => {
              if (b.usage_percentage !== a.usage_percentage) {
                return b.usage_percentage - a.usage_percentage;
              }
              return (
                pokemonList.indexOf(a.pokemon) - pokemonList.indexOf(b.pokemon)
              );
            })
            .map((pokemon) => {
              const imageUrl = getPokemonImageUrl(pokemon.pokemon);
              return imageUrl ? (
                <img
                  key={pokemon.pokemon}
                  src={imageUrl}
                  alt={pokemon.pokemon}
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-1 my-1"
                />
              ) : (
                <div
                  key={pokemon.pokemon}
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-1 my-1 flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 rounded"
                  title={pokemon.pokemon}>
                  N/A
                </div>
              );
            })}
        </div>
      )}
      {/* Explainer Text - Visible Only on Small Screens */}
      <p className="mt-0 text-sm text-center sm:hidden">
        This chart displays the top 6 most used Pokémon on each day
      </p>
    </div>
  );
};

export default TopPokemonStackedBarChart;
