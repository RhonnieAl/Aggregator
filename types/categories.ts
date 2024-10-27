export type Category = "Super-Effective" | "Neutral" | "Resisted" | "Immune";

export type CategoryCounts = Record<Category, number>;

// Type Guard Function
export function isCategory(category: string): category is Category {
  return ["Super-Effective", "Neutral", "Resisted", "Immune"].includes(
    category
  );
}
