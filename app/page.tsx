"use client";

import React, { useEffect, useState } from "react";
import { getPokemonTypes } from "../libs/getPokemonTypes";
import { calculateTypeEffectiveness } from "../libs/calculateTypeEffectiveness";
import type { ITournament } from "../types/tournaments";
import typeEffectivenessData from "../data/type_matchup.json";
import TournamentSelector from "@/components/TournamentSelector";
import Header from "@/components/Header";
import GrandTotalSection from "@/components/GrandTotalSection";
import EffectivenessLineChart from "@/components/EffectivenessLineChart";
import CategoryTables from "@/components/CategoryTables";
import AttackTypeTotalsTable from "@/components/AttackTypeTotalsTable";
import Loading from "@/components/Loading";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorComponent from "@/components/Error";
import { summarizeEffectiveness } from "../libs/summarizeEffectiveness";
import TopPokemonStackedBarChart from "@/components/TopPokemonStackedBarChart";
import type { Category, CategoryCounts } from "../types/categories";

const AnalysisHome = () => {
  const [tournament, setTournament] = useState<ITournament | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [tournaments, setTournaments] = useState<ITournament[]>([]); // State for latest 20 tournaments
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);

  const tournamentId = selectedTournamentId
    ? selectedTournamentId.toString()
    : "latest";

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`/api/tournaments/${tournamentId}`, {
          cache: "no-store"
        });
        let data: ITournament | null = null;

        if (response.ok) {
          const contentType = response.headers.get("Content-Type");
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
            setTournament(data);
          } else {
            throw new Error("Received non-JSON response from the server.");
          }
        } else {
          const contentType = response.headers.get("Content-Type");
          let errorMessage = `Error ${response.status}: ${response.statusText}`;
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = `Error ${response.status}: ${errorData.message || response.statusText}`;
          } else {
            const errorText = await response.text();
            errorMessage = `Error ${response.status}: ${response.statusText}\n${errorText}`;
          }
          throw new Error(errorMessage);
        }
      } catch (err: any) {
        console.error("Failed to fetch tournament:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
        console.log("Loading state set to false");
      }
    };

    fetchTournament();
  }, [tournamentId]);

  // Fetch the latest 20 tournaments for the selector
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(`/api/tournaments`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Error ${response.status}: ${errorData.message || response.statusText}`
          );
        }
        const data: ITournament[] = await response.json();

        // Reverse the array to get the highest tournament_id first
        const sortedTournaments = data.sort(
          (a, b) => b.tournament_id - a.tournament_id
        );

        setTournaments(sortedTournaments);

        // Automatically select the most recent tournament (highest tournament_id)
        if (sortedTournaments.length > 0) {
          setSelectedTournamentId(sortedTournaments[0].tournament_id);
        }
      } catch (err: any) {
        console.error("Failed to fetch tournaments:", err);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  if (!tournament) {
    return (
      <div className="text-center mt-20">No tournament data available.</div>
    );
  }

  const pokemonUsage = tournament.pokemon_usage;

  // Total number of Pokémon analyzed
  const totalPokemonsAnalyzed = pokemonUsage.length;

  // Tournament title
  const tournamentTitle = tournament.tournament_title;

  // Initialize grand totals
  const grandTotal: CategoryCounts = {
    "Super-Effective": 0,
    Neutral: 0,
    Resisted: 0,
    Immune: 0
  };

  // Initialize attackTypeTotals
  const attackTypes = Object.keys(typeEffectivenessData.type_effectiveness);
  const totalAttackTypes = attackTypes.length;
  const totalInteractions = totalPokemonsAnalyzed * totalAttackTypes;

  const attackTypeTotals: {
    [attackType: string]: CategoryCounts;
  } = {};

  attackTypes.forEach((attackType) => {
    attackTypeTotals[attackType] = {
      "Super-Effective": 0,
      Neutral: 0,
      Resisted: 0,
      Immune: 0
    };
  });

  pokemonUsage.forEach((pokemonData) => {
    const pokemonName = pokemonData.pokemon;
    try {
      const defensiveTypes = getPokemonTypes(pokemonName);
      const results = calculateTypeEffectiveness(defensiveTypes);
      const totalSummary = summarizeEffectiveness(results);

      // Update grand totals
      grandTotal["Super-Effective"] += totalSummary["Super-Effective"];
      grandTotal["Neutral"] += totalSummary["Neutral"];
      grandTotal["Resisted"] += totalSummary["Resisted"];
      grandTotal["Immune"] += totalSummary["Immune"];

      // Update attackTypeTotals
      results.forEach((result) => {
        const attackType = result.type;
        const category = result.category as Category;
        attackTypeTotals[attackType][category]++;
      });
    } catch (error: any) {
      console.warn(`Could not process ${pokemonName}: ${error.message}`);
    }
  });

  // Calculate percentages for grand total
  const grandTotalPercentages: Record<Category, string> = {
    "Super-Effective": (
      (grandTotal["Super-Effective"] / totalInteractions) *
      100
    ).toFixed(1),
    Neutral: ((grandTotal.Neutral / totalInteractions) * 100).toFixed(1),
    Resisted: ((grandTotal.Resisted / totalInteractions) * 100).toFixed(1),
    Immune: ((grandTotal.Immune / totalInteractions) * 100).toFixed(1)
  };

  // Calculate percentages for each attack type
  const attackTypePercentages: {
    [attackType: string]: {
      "Super-Effective": string;
      Neutral: string;
      Resisted: string;
      Immune: string;
    };
  } = {};

  attackTypes.forEach((attackType) => {
    const total = totalPokemonsAnalyzed; // Each attack type interacts with all Pokémon
    attackTypePercentages[attackType] = {
      "Super-Effective": (
        (attackTypeTotals[attackType]["Super-Effective"] / total) *
        100
      ).toFixed(1),
      Neutral: ((attackTypeTotals[attackType].Neutral / total) * 100).toFixed(
        1
      ),
      Resisted: ((attackTypeTotals[attackType].Resisted / total) * 100).toFixed(
        1
      ),
      Immune: ((attackTypeTotals[attackType].Immune / total) * 100).toFixed(1)
    };
  });

  // Define categories
  const categories: Category[] = [
    "Super-Effective",
    "Neutral",
    "Resisted",
    "Immune"
  ];

  // Build categoryAttackTypeCounts
  const categoryAttackTypeCounts: Record<Category, Record<string, number>> = {
    "Super-Effective": {},
    Neutral: {},
    Resisted: {},
    Immune: {}
  };

  // Initialize the categoryAttackTypeCounts object
  categories.forEach((category) => {
    categoryAttackTypeCounts[category] = {};
    attackTypes.forEach((attackType) => {
      categoryAttackTypeCounts[category][attackType] =
        attackTypeTotals[attackType][category as Category];
    });
  });

  const lineChartData = attackTypes.map((attackType) => ({
    attackType: attackType.charAt(0).toUpperCase() + attackType.slice(1),
    "Super-Effective": parseFloat(
      attackTypePercentages[attackType]["Super-Effective"]
    ),
    Neutral: parseFloat(attackTypePercentages[attackType].Neutral),
    Resisted: parseFloat(attackTypePercentages[attackType].Resisted),
    Immune: parseFloat(attackTypePercentages[attackType].Immune)
  }));

  // Define categories for the line chart
  const lineChartCategories = [
    "Super-Effective",
    "Neutral",
    "Resisted",
    "Immune"
  ];

  // Prepare data for the Donut Chart (Grand Total)
  const donutChartData: { category: Category; value: number }[] =
    categories.map((category) => ({
      category,
      value: parseFloat(grandTotalPercentages[category])
    }));

  return (
    <ErrorBoundary
      fallback={
        <ErrorComponent message="An error occurred while rendering the page." />
      }>
      <div className="relative">
        {/* === Tournament Selector === */}
        <TournamentSelector
          tournaments={tournaments}
          selectedTournamentId={selectedTournamentId}
          onChange={setSelectedTournamentId}
        />

        {/* === Main Page Content Container === */}
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <Header
            title="Build The Right Team With Data"
            subtitle={`${tournamentTitle}`}
            description=""
          />
          {/* Attack Type Effectiveness Line Chart */}
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold mt-8 mb-4 text-center">
            Tournament Attack Type Effectiveness
          </h2>

          <EffectivenessLineChart
            data={lineChartData}
            categories={lineChartCategories}
          />

          {/* Grand Total Summary and Donut Chart */}
          <GrandTotalSection
            grandTotal={grandTotal}
            grandTotalPercentages={grandTotalPercentages}
            donutChartData={donutChartData}
            totalInteractions={totalInteractions}
            hoveredCategory={hoveredCategory}
            setHoveredCategory={setHoveredCategory}
          />

          {/* Stacked Bar Chat - Top 6 Pokes each day */}
          <TopPokemonStackedBarChart />

          {/* Effectiveness Distribution Across Attack Types */}
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold mt-20 mb-4 text-center">
            Tournament Attack Type Effectiveness
          </h2>

          {/* Category Tables */}
          <CategoryTables
            categories={categories}
            attackTypes={attackTypes}
            categoryAttackTypeCounts={categoryAttackTypeCounts}
            grandTotal={grandTotal}
          />

          {/* Attack Type Effectiveness Totals */}
          <AttackTypeTotalsTable
            attackTypes={attackTypes}
            attackTypeTotals={attackTypeTotals}
            attackTypePercentages={attackTypePercentages}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AnalysisHome;
