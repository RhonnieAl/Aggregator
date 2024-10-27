import { TypeEffectivenessResult } from "./calculateTypeEffectiveness";
import { CategoryCounts } from "../types/categories";

export function summarizeEffectiveness(
  results: TypeEffectivenessResult[]
): CategoryCounts {
  const counts: CategoryCounts = {
    "Super-Effective": 0,
    Neutral: 0,
    Resisted: 0,
    Immune: 0
  };

  results.forEach((result) => {
    counts[result.category]++;
  });

  return counts;
}
