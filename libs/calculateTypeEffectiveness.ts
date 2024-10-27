import typeEffectivenessDataJson from "../data/type_matchup.json";
import { TypeEffectivenessData } from "../types/typeEffectiveness";

export interface TypeEffectivenessResult {
  type: string;
  multiplier: number;
  category: "Super-Effective" | "Neutral" | "Resisted" | "Immune";
}

const typeEffectivenessData =
  typeEffectivenessDataJson as TypeEffectivenessData;

export function calculateTypeEffectiveness(
  defensiveTypes: string[]
): TypeEffectivenessResult[] {
  const attackTypes = Object.keys(
    typeEffectivenessData.type_effectiveness
  ) as string[];

  return attackTypes.map((attackType) => {
    const multipliers = defensiveTypes.map((defenseType) => {
      const effectiveness =
        typeEffectivenessData.type_effectiveness[attackType][defenseType];
      return effectiveness !== undefined ? effectiveness : 1;
    });

    const totalMultiplier = multipliers.reduce((acc, curr) => acc * curr, 1);

    let category: TypeEffectivenessResult["category"];
    if (totalMultiplier === 0) {
      category = "Immune";
    } else if (totalMultiplier > 1) {
      category = "Super-Effective";
    } else if (totalMultiplier < 1) {
      category = "Resisted";
    } else {
      category = "Neutral";
    }

    return {
      type: attackType,
      multiplier: totalMultiplier,
      category
    };
  });
}
