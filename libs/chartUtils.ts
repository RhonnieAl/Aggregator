export type ColorUtility = "bg" | "stroke" | "fill" | "text";

export const chartColors = {
  blue: {
    bg: "#1f77b4",
    stroke: "#1f77b4",
    fill: "#1f77b4",
    text: "#1f77b4"
  },
  emerald: {
    bg: "#2ca02c",
    stroke: "#2ca02c",
    fill: "#2ca02c",
    text: "#2ca02c"
  },
  violet: {
    bg: "#9467bd",
    stroke: "#9467bd",
    fill: "#9467bd",
    text: "#9467bd"
  },
  amber: {
    bg: "#ff7f0e",
    stroke: "#ff7f0e",
    fill: "#ff7f0e",
    text: "#ff7f0e"
  },
  gray: {
    bg: "#808080",
    stroke: "#808080",
    fill: "#808080",
    text: "#808080"
  },
  cyan: {
    bg: "#17becf",
    stroke: "#17becf",
    fill: "#17becf",
    text: "#17becf"
  },
  pink: {
    bg: "#e377c2",
    stroke: "#e377c2",
    fill: "#e377c2",
    text: "#e377c2"
  },
  lime: {
    bg: "#bcbd22",
    stroke: "#bcbd22",
    fill: "#bcbd22",
    text: "#bcbd22"
  },
  fuchsia: {
    bg: "#d62728",
    stroke: "#d62728",
    fill: "#d62728",
    text: "#d62728"
  },
  orange: {
    bg: "#ff9f40",
    stroke: "#ff9f40",
    fill: "#ff9f40",
    text: "#ff9f40"
  },
  teal: {
    bg: "#1abc9c",
    stroke: "#1abc9c",
    fill: "#1abc9c",
    text: "#1abc9c"
  },
  maroon: {
    bg: "#800000",
    stroke: "#800000",
    fill: "#800000",
    text: "#800000"
  },
  navy: {
    bg: "#000080",
    stroke: "#000080",
    fill: "#000080",
    text: "#000080"
  },
  olive: {
    bg: "#808000",
    stroke: "#808000",
    fill: "#808000",
    text: "#808000"
  },
  purple: {
    bg: "#800080",
    stroke: "#800080",
    fill: "#800080",
    text: "#800080"
  },
  brown: {
    bg: "#a52a2a",
    stroke: "#a52a2a",
    fill: "#a52a2a",
    text: "#a52a2a"
  },
  gold: {
    bg: "#ffd700",
    stroke: "#ffd700",
    fill: "#ffd700",
    text: "#ffd700"
  },
  magenta: {
    bg: "#ff00ff",
    stroke: "#ff00ff",
    fill: "#ff00ff",
    text: "#ff00ff"
  },
  indigo: {
    bg: "#4b0082",
    stroke: "#4b0082",
    fill: "#4b0082",
    text: "#4b0082"
  },
  coral: {
    bg: "#ff7f50",
    stroke: "#ff7f50",
    fill: "#ff7f50",
    text: "#ff7f50"
  },
  salmon: {
    bg: "#fa8072",
    stroke: "#fa8072",
    fill: "#fa8072",
    text: "#fa8072"
  },
  turquoise: {
    bg: "#40e0d0",
    stroke: "#40e0d0",
    fill: "#40e0d0",
    text: "#40e0d0"
  },
  orchid: {
    bg: "#da70d6",
    stroke: "#da70d6",
    fill: "#da70d6",
    text: "#da70d6"
  },
  sienna: {
    bg: "#a0522d",
    stroke: "#a0522d",
    fill: "#a0522d",
    text: "#a0522d"
  },
  slateblue: {
    bg: "#6a5acd",
    stroke: "#6a5acd",
    fill: "#6a5acd",
    text: "#6a5acd"
  },
  chartreuse: {
    bg: "#7fff00",
    stroke: "#7fff00",
    fill: "#7fff00",
    text: "#7fff00"
  },
  peru: {
    bg: "#cd853f",
    stroke: "#cd853f",
    fill: "#cd853f",
    text: "#cd853f"
  },
  khaki: {
    bg: "#f0e68c",
    stroke: "#f0e68c",
    fill: "#f0e68c",
    text: "#f0e68c"
  },
  violetred: {
    bg: "#d02090",
    stroke: "#d02090",
    fill: "#d02090",
    text: "#d02090"
  },
  lightblue: {
    bg: "#add8e6",
    stroke: "#add8e6",
    fill: "#add8e6",
    text: "#add8e6"
  },
  darkgreen: {
    bg: "#006400",
    stroke: "#006400",
    fill: "#006400",
    text: "#006400"
  },
  darkorange: {
    bg: "#ff8c00",
    stroke: "#ff8c00",
    fill: "#ff8c00",
    text: "#ff8c00"
  },
  deeppink: {
    bg: "#ff1493",
    stroke: "#ff1493",
    fill: "#ff1493",
    text: "#ff1493"
  },
  mediumseagreen: {
    bg: "#3cb371",
    stroke: "#3cb371",
    fill: "#3cb371",
    text: "#3cb371"
  },
  darkslateblue: {
    bg: "#483d8b",
    stroke: "#483d8b",
    fill: "#483d8b",
    text: "#483d8b"
  },
  mediumorchid: {
    bg: "#ba55d3",
    stroke: "#ba55d3",
    fill: "#ba55d3",
    text: "#ba55d3"
  },
  lightcoral: {
    bg: "#f08080",
    stroke: "#f08080",
    fill: "#f08080",
    text: "#f08080"
  },
  darkturquoise: {
    bg: "#00ced1",
    stroke: "#00ced1",
    fill: "#00ced1",
    text: "#00ced1"
  },
  palevioletred: {
    bg: "#db7093",
    stroke: "#db7093",
    fill: "#db7093",
    text: "#db7093"
  }
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string;
  };
};

export type AvailableChartColorsKeys = keyof typeof chartColors;

export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors
) as Array<AvailableChartColorsKeys>;

export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[]
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>();
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length]);
  });
  return categoryColors;
};

export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility
): string => {
  const fallbackColor = {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500"
  };
  return chartColors[color]?.[type] ?? fallbackColor[type];
};

// Tremor Raw getYAxisDomain [v0.0.0]

export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined
) => {
  const minDomain = autoMinValue ? "auto" : minValue ?? 0;
  const maxDomain = maxValue ?? "auto";
  return [minDomain, maxDomain];
};

// Tremor Raw hasOnlyOneValueForKey [v0.1.0]

export function hasOnlyOneValueForKey(
  array: any[],
  keyToCheck: string
): boolean {
  const val: any[] = [];

  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      val.push(obj[keyToCheck]);
      if (val.length > 1) {
        return false;
      }
    }
  }

  return true;
}
