// src/components/ChartBox.jsx
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./ChartBox.css";

const ChartBox = ({ type = "bar", data, height = 250 }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data]);

  return (
    <div className="chart-wrapper" style={{ height: `${height}px` }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartBox;
