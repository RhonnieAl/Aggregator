import React from "react";
import cx from "classnames";
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableRoot
} from "@/components/Table";
import { DonutChart } from "@/components/DonutChart";
import type { Category, CategoryCounts } from "../types/categories";
import type { AvailableChartColorsKeys } from "../libs/chartUtils";
import { isCategory } from "../types/categories";

interface GrandTotalSectionProps {
  grandTotal: CategoryCounts;
  grandTotalPercentages: Record<Category, string>;
  donutChartData: { category: Category; value: number }[];
  totalInteractions: number;
  hoveredCategory: Category | null;
  setHoveredCategory: (category: Category | null) => void;
}

const GrandTotalSection: React.FC<GrandTotalSectionProps> = ({
  grandTotal,
  grandTotalPercentages,
  donutChartData,
  totalInteractions,
  hoveredCategory,
  setHoveredCategory
}) => {
  const categories: Category[] = [
    "Super-Effective",
    "Neutral",
    "Resisted",
    "Immune"
  ];

  return (
    <>
      {/* Responsive Heading */}
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mt-8 mb-8 text-center">
        Tournament Grand Total of All Pokémon
      </h3>

      {/* Responsive Flex Container */}
      <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8 mb-20">
        {/* Table Container */}
        <TableRoot className="w-full md:w-7/8">
          <div className="overflow-x-auto shadow-md rounded-lg">
            {/* Main Table */}
            <Table
              className="min-w-full text-sm sm:text-base"
              aria-label="Tournament Grand Total of All Pokémon">
              <TableHead>
                <TableRow>
                  {/* Category Header */}
                  <TableHeaderCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm sm:text-base w-1/4 md:w-1/5">
                    Category
                  </TableHeaderCell>

                  {/* Count Header */}
                  <TableHeaderCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm sm:text-base w-1/6 md:w-1/8">
                    Count
                  </TableHeaderCell>

                  {/* Percentage Header - Hidden on Small Devices */}
                  <TableHeaderCell className="hidden md:table-cell px-2 py-2 sm:px-4 sm:py-3.5 text-sm sm:text-base w-1/6 md:w-1/8">
                    Percentage
                  </TableHeaderCell>

                  {/* Description Header */}
                  <TableHeaderCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm sm:text-base w-1/3 md:w-1/4">
                    Description
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow
                    key={category}
                    className={cx(
                      hoveredCategory === category ? "bg-gray-700" : "",
                      "transition-colors duration-100"
                    )}>
                    {/* Category Cell */}
                    <TableCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm sm:text-base">
                      {category}
                    </TableCell>

                    {/* Count Cell */}
                    <TableCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm sm:text-base">
                      {grandTotal[category]}
                    </TableCell>

                    {/* Percentage Cell - Hidden on Small Devices */}
                    <TableCell className="hidden md:table-cell px-1 py-2 sm:px-4 sm:py-3.5 text-sm sm:text-base text-center w-1/6 md:w-1/8">
                      {grandTotalPercentages[category]}%
                    </TableCell>

                    {/* Description Cell */}
                    <TableCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm sm:text-base">
                      {grandTotalPercentages[category]}% of attacks{" "}
                      {category === "Super-Effective"
                        ? "result in double damage"
                        : category === "Neutral"
                          ? "deal normal damage"
                          : category === "Resisted"
                            ? "are not very effective"
                            : "have no effect"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TableRoot>

        {/* Donut Chart Container */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <DonutChart
            data={donutChartData}
            category="category"
            value="value"
            label={`100%\n(${totalInteractions} counts)`}
            showTooltip={true}
            showLabel={true}
            variant="donut"
            onValueChange={(event) => {
              if (event) {
                const clickedCategory = event.categoryClicked;
                if (isCategory(clickedCategory)) {
                  setHoveredCategory(clickedCategory);
                } else {
                  console.warn(`Invalid category clicked: ${clickedCategory}`);
                  setHoveredCategory(null);
                }
              } else {
                setHoveredCategory(null);
              }
            }}
            valueFormatter={(value: number) => `${value}%`}
            colors={
              [
                "blue",
                "emerald",
                "amber",
                "fuchsia"
              ] as AvailableChartColorsKeys[]
            }
            className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80" // Responsive sizing
          />
          {/* Explainer Text - Visible Only on Small Screens */}
          <p className="mt-6 text-sm text-center md:hidden">
            This donut chart represents the overall effectiveness of attack
            types across all Pokémon in the tournament.
          </p>
        </div>
      </div>
    </>
  );
};

export default GrandTotalSection;
