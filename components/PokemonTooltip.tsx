import React from "react";
import { TooltipProps as RechartsTooltipProps } from "recharts";
import { cx } from "../libs/utils";
import {
  AvailableChartColorsKeys,
  getColorClassName
} from "../libs/chartUtils";

interface PokemonTooltipProps extends RechartsTooltipProps<number, string> {
  colorMap: Map<string, AvailableChartColorsKeys>;
  pokemonOrder: string[];
}

const PokemonTooltip: React.FC<PokemonTooltipProps> = ({
  active,
  payload,
  label,
  colorMap,
  pokemonOrder
}) => {
  if (active && payload && payload.length) {
    // Filter out entries with 0% usage
    const filteredPayload = payload.filter(
      (item): item is { dataKey: string; value: number } =>
        item.value > 0 && typeof item.dataKey === "string"
    );

    // Sort the filteredPayload by value (percentage) descendingly
    // and then by the order in pokemonOrder for consistent ordering
    const sortedPayload = filteredPayload.sort((a, b) => {
      if (b.value !== a.value) {
        return b.value - a.value; // Primary sort: usage_percentage descending
      }
      // Secondary sort: order in pokemonOrder
      const indexA = pokemonOrder.indexOf(a.dataKey);
      const indexB = pokemonOrder.indexOf(b.dataKey);
      return indexA - indexB;
    });

    // If no entries remain after filtering, do not display the tooltip
    if (sortedPayload.length === 0) return null;

    return (
      <div
        className={cx(
          "w-64 rounded-md border text-sm shadow-md",
          "border-gray-200 dark:border-gray-800",
          "bg-white dark:bg-gray-800"
        )}
        style={{ opacity: 0.99 }}>
        {/* Tooltip Header */}
        <div className={cx("border-b border-inherit px-4 py-2")}>
          <p
            className={cx(
              "flex items-center justify-between",
              "font-medium text-gray-900 dark:text-gray-50"
            )}>
            <span>Date:</span>
            <span>{label}</span>
          </p>
        </div>

        {/* Tooltip Body */}
        <div className={cx("space-y-1 px-4 py-2")}>
          {sortedPayload.map(({ dataKey, value }, index) => {
            // Ensure dataKey is a string
            if (typeof dataKey !== "string") {
              console.warn(`dataKey is not a string: ${dataKey}`);
              return null;
            }

            const colorKey = colorMap.get(dataKey);
            if (!colorKey) {
              console.warn(`Color not found for Pokémon: ${dataKey}`);
              return null;
            }

            return (
              <div
                key={`tooltip-item-${index}`}
                className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-2">
                  {/* Colored Indicator as Rounded Square */}
                  <span
                    aria-hidden="true"
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: getColorClassName(colorKey, "bg")
                    }}
                  />
                  {/* Pokémon Name */}
                  <span className="text-gray-700 dark:text-gray-300">
                    {dataKey}
                  </span>
                </div>
                {/* Usage Percentage */}
                <span className="text-gray-900 dark:text-gray-50 font-medium">
                  {value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default PokemonTooltip;
