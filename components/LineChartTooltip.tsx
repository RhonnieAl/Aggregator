import React from "react";
import clsx from "clsx";
import { TooltipProps } from "recharts";

interface AttackEffectiveness {
  category: string;
  percentage: number;
}

interface CustomTooltipProps {
  active: boolean;
  payload: any[];
  label: string;
}

const LineChartTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label
}) => {
  if (!active || !payload || payload.length === 0) return null;

  // Transform payload to match AttackEffectiveness interface
  const data: AttackEffectiveness[] = payload.map((item) => ({
    category: item.name,
    percentage: item.value
  }));

  return (
    <div
      className="w-64 rounded-md border border-gray-300 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      style={{ opacity: 0.99 }}>
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
      </div>
      <div className="space-y-1">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span
                className={clsx(
                  // Assign colors based on category
                  {
                    "h-2 w-2 bg-blue-500 rounded-sm":
                      item.category === "Super-Effective",
                    "h-2 w-2 bg-green-500 rounded-sm":
                      item.category === "Neutral",
                    "h-2 w-2 bg-yellow-500 rounded-sm":
                      item.category === "Resisted",
                    "h-2 w-2 bg-red-500 rounded-sm": item.category === "Immune"
                  }
                )}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.category}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineChartTooltip;
