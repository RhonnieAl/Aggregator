// Render the effectiveness distribution line chart.
import React, { useState, useEffect } from "react";
import { LineChart } from "@/components/LineChart";

interface EffectivenessLineChartProps {
  data: {
    attackType: string;
    "Super-Effective": number;
    Neutral: number;
    Resisted: number;
    Immune: number;
  }[];
  categories: string[];
}

const EffectivenessLineChartComponent: React.FC<
  EffectivenessLineChartProps
> = ({ data, categories }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    // Set initial screen size
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="mb-14 max-w-5xl mx-auto">
      <LineChart
        className="h-80 md:h-96 w-full"
        data={data}
        index="attackType"
        categories={categories}
        colors={["#1f77b4", "#2ca02c", "#ff7f0e", "#d62728"]}
        valueFormatter={(number: number) => `${number}%`}
        yAxisWidth={40}
        showLegend={true}
        showGridLines={true}
        showXAxis={true}
        showYAxis={true}
        autoMinValue={true}
        minValue={0}
        maxValue={80}
        connectNulls={true}
        xAxisLabel="Attack Type"
        yAxisLabel={isSmallScreen ? "" : "Effectiveness (%)"}
      />
    </div>
  );
};

export default EffectivenessLineChartComponent;
