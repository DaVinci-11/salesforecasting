import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

const Visualization = ({ actualData, predictedData }) => {
  const chartData = actualData.map((val, index) => ({
    name: `Month ${index + 1}`, // Dynamic labeling
    Actual: val,
    Predicted: predictedData[index] || null,
  }));

  return (
    <LineChart width={500} height={300} data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Actual" stroke="#8884d8" />
      <Line type="monotone" dataKey="Predicted" stroke="#82ca9d" />
    </LineChart>
  );
};

export default Visualization;
