"use client";

import React, { useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts";
import clsx from "clsx";
import { useOnWindowResize } from "@/libs/useOnWindowResize";
import LineChartTooltip from "@/components/LineChartTooltip";

interface LineChartProps {
  data: Record<string, any>[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
  yAxisWidth?: number;
  showLegend?: boolean;
  showGridLines?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  autoMinValue?: boolean;
  minValue?: number;
  maxValue?: number;
  connectNulls?: boolean;
  tooltipCallback?: (props: any) => void;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  index,
  categories,
  colors = ["#1f77b4", "#2ca02c", "#ff7f0e", "#d62728"],
  valueFormatter = (value) => value.toString(),
  className,
  yAxisWidth = 56,
  showLegend = true,
  showGridLines = true,
  showXAxis = true,
  showYAxis = true,
  autoMinValue = false,
  minValue,
  maxValue,
  connectNulls = false,
  tooltipCallback,
  xAxisLabel,
  yAxisLabel
}) => {
  const legendRef = useRef<HTMLDivElement>(null);
  const [legendHeight, setLegendHeight] = useState<number>(60);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useOnWindowResize(() => {
    const calculateHeight = (height: number | undefined) =>
      height ? Number(height) + 15 : 60;
    setLegendHeight(calculateHeight(legendRef.current?.clientHeight));
  });

  const CustomLegend = ({
    payload,
    categories,
    colors,
    selectedCategory,
    setSelectedCategory,
    legendRef
  }: {
    payload?: any;
    categories: string[];
    colors: string[];
    selectedCategory: string | null;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
    legendRef: React.RefObject<HTMLDivElement>;
  }) => {
    // Generate the labels with clickable functionality
    return (
      <div ref={legendRef} style={{ display: "flex", flexWrap: "wrap" }}>
        {categories.map((category, idx) => (
          <div
            key={category}
            onClick={() => {
              // Toggle the selected category
              if (selectedCategory === category) {
                setSelectedCategory(null);
              } else {
                setSelectedCategory(category);
              }
            }}
            style={{
              marginRight: 10,
              cursor: "pointer",
              color:
                selectedCategory === null || selectedCategory === category
                  ? "grey"
                  : "black",
              fontWeight: selectedCategory === category ? "bold" : "normal",
              display: "flex",
              alignItems: "center"
            }}>
            <span
              style={{
                display: "inline-block",
                backgroundColor: colors[idx % colors.length],
                width: 15,
                height: 10,
                marginRight: 10
              }}></span>
            {category}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={clsx("w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            bottom: xAxisLabel ? 20 : 5,
            left: yAxisLabel ? 20 : 0
          }}>
          {showGridLines && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(150, 150, 150, 0.15)"
            />
          )}
          <XAxis
            dataKey={index}
            hide={!showXAxis}
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={80}
            label={
              xAxisLabel
                ? {
                    value: xAxisLabel,
                    position: "insideBottom",
                    offset: -2,
                    style: { textAnchor: "middle", fill: "#666" }
                  }
                : undefined
            }
          />
          <YAxis
            width={yAxisWidth}
            hide={!showYAxis}
            tick={{ fontSize: 12 }}
            tickFormatter={valueFormatter}
            domain={
              autoMinValue
                ? [minValue || "auto", maxValue || "auto"]
                : undefined
            }
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    offset: -10,
                    style: { textAnchor: "middle", fill: "#666" }
                  }
                : undefined
            }
          />
          {showLegend && (
            <Legend
              verticalAlign="top"
              align="right"
              height={legendHeight}
              wrapperStyle={{ top: 0 }}
              content={(props) => (
                <CustomLegend
                  {...props}
                  categories={categories}
                  colors={colors}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  legendRef={legendRef}
                />
              )}
            />
          )}
          <RechartsTooltip
            content={LineChartTooltip} // Use the custom tooltip
            formatter={(value: any) => valueFormatter(Number(value))}
            position={{ y: -50 }}
            // If you have a tooltip callback, you can handle it here
            // content={(props) => {
            //   if (tooltipCallback) tooltipCallback(props);
            //   return <LineChartTooltip {...props} />;
            // }}
          />
          {categories.map((category, idx) => (
            <Line
              key={category}
              dot={false}
              type="monotone"
              dataKey={category}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              connectNulls={connectNulls}
              activeDot={{ r: 2 }}
              strokeOpacity={
                selectedCategory === null || selectedCategory === category
                  ? 1
                  : 0.2
              }
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
