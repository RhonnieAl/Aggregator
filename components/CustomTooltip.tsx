// CustomTooltip.tsx
import React from "react";
import { TooltipProps as RechartsTooltipProps } from "recharts";
import { cx } from "../libs/utils";
import {
  AvailableChartColorsKeys,
  getColorClassName
} from "../libs/chartUtils";
import { isCategory } from "../types/categories";

interface CustomTooltipProps extends RechartsTooltipProps<number, string> {
  colorMap: Map<string, AvailableChartColorsKeys>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  colorMap
}) => {
  if (active && payload && payload.length) {
    // Filter out entries with 0% usage
    const filteredPayload = payload.filter((item) => item.value > 0);

    // Sort the filteredPayload by value (percentage) in descending order
    const sortedPayload = filteredPayload.sort((a, b) => b.value - a.value);

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

            // Ensure dataKey is a valid Category
            if (!isCategory(dataKey)) {
              console.warn(`Invalid category: ${dataKey}`);
              return null;
            }

            const colorKey = colorMap.get(dataKey);
            if (!colorKey) {
              console.warn(`Color not found for category: ${dataKey}`);
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

export default CustomTooltip;
