import React from "react";
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableRoot
} from "@/components/Table";
import { Category, CategoryCounts } from "../types/categories";

interface AttackTypeTotalsTableProps {
  attackTypes: string[];
  attackTypeTotals: Record<string, CategoryCounts>;
  attackTypePercentages: Record<string, Record<Category, string>>;
}

const AttackTypeTotalsTable: React.FC<AttackTypeTotalsTableProps> = ({
  attackTypes,
  attackTypeTotals,
  attackTypePercentages
}) => {
  return (
    <>
      {/* Responsive Heading */}
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mt-12 mb-6 text-center">
        Tournament Attack Type Totals
      </h3>

      {/* Table Container with Horizontal Scrolling */}
      <TableRoot className="mb-8">
        <div className="overflow-x-auto shadow-md rounded-lg">
          {/* Main Table */}
          <Table
            className="min-w-full text-sm sm:text-base"
            aria-label="Attack Type Effectiveness Totals">
            <TableHead>
              <TableRow>
                <TableHeaderCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm md:text-base">
                  Attack Type
                </TableHeaderCell>
                <TableHeaderCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm md:text-base">
                  Super-Effective
                </TableHeaderCell>
                <TableHeaderCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm md:text-base">
                  Neutral
                </TableHeaderCell>
                <TableHeaderCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm md:text-base">
                  Resisted
                </TableHeaderCell>
                <TableHeaderCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm md:text-base">
                  Immune
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attackTypes.map((attackType) => (
                <TableRow
                  key={attackType}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  {/* Attack Type */}
                  <TableCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm md:text-base">
                    {attackType.charAt(0).toUpperCase() + attackType.slice(1)}
                  </TableCell>

                  {/* Super-Effective */}
                  <TableCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm md:text-base">
                    {attackTypeTotals[attackType]["Super-Effective"]} Pokémon (
                    <span className="font-medium">
                      {attackTypePercentages[attackType]["Super-Effective"]}%
                    </span>
                    )
                  </TableCell>

                  {/* Neutral */}
                  <TableCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm md:text-base">
                    {attackTypeTotals[attackType].Neutral} Pokémon (
                    <span className="font-medium">
                      {attackTypePercentages[attackType].Neutral}%
                    </span>
                    )
                  </TableCell>

                  {/* Resisted */}
                  <TableCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm md:text-base">
                    {attackTypeTotals[attackType].Resisted} Pokémon (
                    <span className="font-medium">
                      {attackTypePercentages[attackType].Resisted}%
                    </span>
                    )
                  </TableCell>

                  {/* Immune */}
                  <TableCell className="px-2 py-2 sm:px-4 sm:py-3.5 text-sm md:text-base">
                    {attackTypeTotals[attackType].Immune} Pokémon (
                    <span className="font-medium">
                      {attackTypePercentages[attackType].Immune}%
                    </span>
                    )
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableRoot>
    </>
  );
};

export default AttackTypeTotalsTable;
