// This component handles the tournament selection dropdown.

"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem
} from "@/components/Selector";
import type { ITournament } from "../types/tournaments";

interface TournamentSelectorProps {
  tournaments: ITournament[];
  selectedTournamentId: number | null;
  onChange: (id: number) => void;
}

const TournamentSelector: React.FC<TournamentSelectorProps> = ({
  tournaments,
  selectedTournamentId,
  onChange
}) => {
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 p-4 w-[90%] sm:left-0 sm:transform-none sm:p-12 sm:w-[350px] md:w-[350px] lg:w-[400px] xl:w-[400px] 2xl:w-[500px]">
      <Select
        value={selectedTournamentId?.toString() || ""}
        onValueChange={(value) => onChange(Number(value))}>
        <SelectTrigger className="w-full shadow-[0_0_10px_rgba(255,127,14,0.6)]">
          <SelectValue placeholder="Select a tournament" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectGroupLabel>Latest 20 Tournaments</SelectGroupLabel>
            {tournaments.map((tourney) => (
              <SelectItem
                key={tourney.tournament_id}
                value={tourney.tournament_id.toString()}
                className="text-gray-900">
                {`${(new Date(tourney.date).getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}-${new Date(tourney.date)
                  .getDate()
                  .toString()
                  .padStart(
                    2,
                    "0"
                  )}-${new Date(tourney.date).getFullYear()} | ${tourney.tournament_title}`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TournamentSelector;
