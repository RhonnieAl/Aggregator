/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import {
  Pie,
  PieChart as ReChartsDonutChart,
  ResponsiveContainer,
  Sector,
  Tooltip
} from "recharts";

import {
  AvailableChartColors,
  AvailableChartColorsKeys,
  constructCategoryColors,
  getColorClassName,
  chartColors
} from "../libs/chartUtils";
import { cx } from "../libs/utils";

const sumNumericArray = (arr: number[]): number =>
  arr.reduce((sum, num) => sum + num, 0);

const parseData = (
  data: Record<string, any>[],
  categoryColors: Map<string, AvailableChartColorsKeys>,
  category: string
) =>
  data.map((dataPoint) => ({
    ...dataPoint,
    fill:
      chartColors[categoryColors.get(dataPoint[category])!]?.fill ||
      chartColors.gray.fill // Use actual color value
  }));

const calculateDefaultLabel = (data: any[], valueKey: string): number =>
  sumNumericArray(data.map((dataPoint) => dataPoint[valueKey]));

const parseLabelInput = (
  labelInput: string | undefined,
  valueFormatter: (value: number) => string,
  data: any[],
  valueKey: string
): string =>
  labelInput || valueFormatter(calculateDefaultLabel(data, valueKey));

// Tooltip

type TooltipProps = Pick<ChartTooltipProps, "active" | "payload">;

type PayloadItem = {
  category: string;
  value: number;
  color: AvailableChartColorsKeys;
};

interface ChartTooltipProps {
  active: boolean | undefined;
  payload: PayloadItem[];
  valueFormatter: (value: number) => string;
}

const ChartTooltip = ({
  active,
  payload,
  valueFormatter
}: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={cx(
          // base
          "rounded-md border text-sm shadow-md",
          // border color
          "border-gray-200 dark:border-gray-800",
          // background color
          "bg-white dark:bg-gray-950"
        )}>
        <div className={cx("space-y-1 px-4 py-2")}>
          {payload.map(({ value, category, color }, index) => (
            <div
              key={`id-${index}`}
              className="flex items-center justify-between space-x-8">
              <div className="flex items-center space-x-2">
                <span
                  aria-hidden="true"
                  className={cx(
                    "size-2 shrink-0 rounded-full",
                    getColorClassName(color, "bg")
                  )}
                />
                <p
                  className={cx(
                    // base
                    "whitespace-nowrap text-right",
                    // text color
                    "text-gray-700 dark:text-gray-300"
                  )}>
                  {category}
                </p>
              </div>
              <p
                className={cx(
                  // base
                  "whitespace-nowrap text-right font-medium tabular-nums",
                  // text color
                  "text-gray-900 dark:text-gray-50"
                )}>
                {valueFormatter(value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const renderInactiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, className } =
    props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      className={className}
      fill=""
      opacity={0.3}
      style={{ outline: "none" }}
    />
  );
};

type DonutChartVariant = "donut" | "pie";

type BaseEventProps = {
  eventType: "sector";
  categoryClicked: string;
  [key: string]: number | string;
};

type DonutChartEventProps = BaseEventProps | null | undefined;

interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, any>[];
  category: string;
  value: string;
  colors?: AvailableChartColorsKeys[];
  variant?: DonutChartVariant;
  valueFormatter?: (value: number) => string;
  label?: string;
  showLabel?: boolean;
  showTooltip?: boolean;
  onValueChange?: (value: DonutChartEventProps) => void;
  tooltipCallback?: (tooltipCallbackContent: TooltipProps) => void;
  customTooltip?: React.ComponentType<TooltipProps>;
}

const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      data = [],
      value,
      category,
      colors = AvailableChartColors,
      variant = "donut",
      valueFormatter = (value: number) => value.toString(),
      label,
      showLabel = false,
      showTooltip = true,
      onValueChange,
      tooltipCallback,
      customTooltip,
      className,
      ...other
    },
    forwardedRef
  ) => {
    const CustomTooltip = customTooltip;
    const isDonut = variant === "donut";
    const parsedLabelInput = parseLabelInput(
      label,
      valueFormatter,
      data,
      value
    );

    const categories = Array.from(new Set(data.map((item) => item[category])));
    const categoryColors = constructCategoryColors(categories, colors);

    const prevActiveRef = React.useRef<boolean | undefined>(undefined);
    const prevCategoryRef = React.useRef<string | undefined>(undefined);

    const handleShapeHover = (data: any, index: number) => {
      if (onValueChange) {
        onValueChange({
          eventType: "sector",
          categoryClicked: data.payload[category],
          ...data.payload
        });
      }
    };

    const handleShapeLeave = () => {
      if (onValueChange) {
        onValueChange(null);
      }
    };

    // Split label by newline
    const labelLines = parsedLabelInput.split("\n");

    return (
      <div
        ref={forwardedRef}
        className={cx("h-40 w-40", className)}
        tremor-id="tremor-raw"
        {...other}>
        <ResponsiveContainer className="size-full">
          <ReChartsDonutChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
            {showLabel && isDonut && (
              <text
                className="fill-gray-700 dark:fill-gray-300"
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle">
                {labelLines.map((line, index) => (
                  <tspan
                    key={index}
                    x="50%"
                    dy={index === 0 ? "-0.5em" : "1.2em"}
                    className={cx(
                      "text-sm sm:text-base lg:text-lg",
                      index > 0 ? "mt-1" : ""
                    )}>
                    {line}
                  </tspan>
                ))}
              </text>
            )}
            <Pie
              className={cx(
                "stroke-white dark:stroke-gray-950 [&_.recharts-pie-sector]:outline-none",
                onValueChange ? "cursor-pointer" : "cursor-default"
              )}
              data={parseData(data, categoryColors, category)}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius={isDonut ? "70%" : "0%"}
              outerRadius="100%"
              stroke=""
              strokeLinejoin="round"
              dataKey={value}
              nameKey={category}
              isAnimationActive={false}
              inactiveShape={renderInactiveShape}
              style={{ outline: "none" }}
              onMouseEnter={(data, index) => handleShapeHover(data, index)}
              onMouseLeave={handleShapeLeave}
            />
            {showTooltip && (
              <Tooltip
                wrapperStyle={{ outline: "none" }}
                isAnimationActive={false}
                content={({ active, payload }) => {
                  const cleanPayload = payload
                    ? payload.map((item: any) => ({
                        category: item.payload[category],
                        value: item.value,
                        color: categoryColors.get(
                          item.payload[category]
                        ) as AvailableChartColorsKeys
                      }))
                    : [];

                  const payloadCategory: string = cleanPayload[0]?.category;

                  if (
                    tooltipCallback &&
                    (active !== prevActiveRef.current ||
                      payloadCategory !== prevCategoryRef.current)
                  ) {
                    tooltipCallback({
                      active,
                      payload: cleanPayload
                    });
                    prevActiveRef.current = active;
                    prevCategoryRef.current = payloadCategory;
                  }

                  return showTooltip && active ? (
                    CustomTooltip ? (
                      <CustomTooltip active={active} payload={cleanPayload} />
                    ) : (
                      <ChartTooltip
                        active={active}
                        payload={cleanPayload}
                        valueFormatter={valueFormatter}
                      />
                    )
                  ) : null;
                }}
              />
            )}
          </ReChartsDonutChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

DonutChart.displayName = "DonutChart";

export { DonutChart, type DonutChartEventProps, type TooltipProps };
