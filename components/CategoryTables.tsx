// Generate tables for each effectiveness category.
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

interface CategoryTablesProps {
  categories: Category[];
  attackTypes: string[];
  categoryAttackTypeCounts: Record<Category, Record<string, number>>;
  grandTotal: CategoryCounts;
}

const CategoryTables: React.FC<CategoryTablesProps> = ({
  categories,
  attackTypes,
  categoryAttackTypeCounts,
  grandTotal
}) => {
  return (
    <>
      {categories.map((category) => (
        <div key={category}>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mt-8 mb-4 text-center">
            {category} Hits Across All Attack Types In This Tournament
          </h3>
          <TableRoot className="mb-8">
            <div className="overflow-hidden shadow-md rounded-lg">
              <Table className="mx-auto">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className="px-2 py-2 text-sm md:px-4 md:py-3.5 text-base">
                      Attack Type
                    </TableHeaderCell>
                    <TableHeaderCell className="px-2 py-2 text-sm md:px-4 md:py-3.5 text-base">
                      Hits
                    </TableHeaderCell>
                    <TableHeaderCell className="px-2 py-2 text-sm md:px-4 md:py-3.5 text-base">
                      Percentage of Total {category} Hits
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attackTypes
                    .filter(
                      (attackType) =>
                        categoryAttackTypeCounts[category][attackType] > 0
                    )
                    .sort(
                      (a, b) =>
                        categoryAttackTypeCounts[category][b] -
                        categoryAttackTypeCounts[category][a]
                    )
                    .map((attackType) => {
                      const count =
                        categoryAttackTypeCounts[category][attackType];
                      const totalInCategory = grandTotal[category];
                      const percentage =
                        totalInCategory > 0
                          ? ((count / totalInCategory) * 100).toFixed(1)
                          : "0.0";
                      return (
                        <TableRow key={attackType}>
                          <TableCell className="px-2 py-2 text-sm md:px-4 md:py-3.5 text-base">
                            {attackType.charAt(0).toUpperCase() +
                              attackType.slice(1)}
                          </TableCell>
                          <TableCell className="px-2 py-2 text-sm md:px-4 md:py-3.5 text-base">
                            {count}
                          </TableCell>
                          <TableCell className="px-2 py-2 text-sm md:px-4 md:py-3.5 text-base">
                            {percentage}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </TableRoot>
        </div>
      ))}
    </>
  );
};

export default CategoryTables;
