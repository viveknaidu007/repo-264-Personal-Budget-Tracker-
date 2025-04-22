import { useEffect, useRef } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables); // Register all components manually

function BarChart({ data, type }) {
  const chartRef = useRef(null); // Ref to persist chart instance
  const canvasRef = useRef(null); // Ref to the canvas DOM element

  useEffect(() => {
    // Get or create the canvas element
    let canvas = canvasRef.current || document.getElementById(`chart-${type}`);
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = `chart-${type}`;
      document.querySelector(`#chart-${type}`)?.replaceWith(canvas);
    }
    const ctx = canvas.getContext("2d");

    // Destroy existing chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    if (data && Object.keys(data).length > 0) {
      const labels = Object.keys(data);
      const values = Object.values(data).map((val) => (val || 0)); // Handle null/undefined

      chartRef.current = new ChartJS(ctx, {
        type: type,
        data: {
          labels: labels,
          datasets: [{
            label: type === "bar" ? "Amount" : "",
            data: values,
            backgroundColor: type === "bar" ? "rgba(75, 192, 192, 0.2)" : "rgba(75, 192, 192, 0.4)",
            borderColor: type === "bar" ? "rgba(75, 192, 192, 1)" : "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          }],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Store the canvas ref if not already set
    if (!canvasRef.current) canvasRef.current = canvas;

    // Cleanup function to destroy chart on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data, type]); // Re-run when data or type changes

  return <canvas ref={canvasRef} id={`chart-${type}`} />;
}

export default BarChart;