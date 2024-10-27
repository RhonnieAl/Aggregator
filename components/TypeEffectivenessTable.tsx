import React from "react";

export interface TypeEffectivenessResult {
  type: string;
  multiplier: number;
  category: "Super-Effective" | "Neutral" | "Resisted" | "Immune";
}

interface Props {
  results: TypeEffectivenessResult[];
}

const TypeEffectivenessTable: React.FC<Props> = ({ results }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Attack Type</th>
          <th>Multiplier</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => (
          <tr key={result.type}>
            <td>{result.type}</td>
            <td>{result.multiplier}</td>
            <td>{result.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TypeEffectivenessTable;
