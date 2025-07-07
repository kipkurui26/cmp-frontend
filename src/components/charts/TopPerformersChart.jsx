import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TopPerformersChart = ({
  data = [],
  valueKey = 'value',
  nameKey = 'name',
  barColor = '#8884d8',
  title = '',
  xAxisLabel = '',
  yAxisLabel = ''
}) => {
  // Ensure all values are integers
  const processedData = Array.isArray(data)
    ? data.map(item => ({
        ...item,
        [valueKey]: parseInt(item[valueKey], 10) || 0,
        [nameKey]: item[nameKey],
      }))
    : [];

  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      {title && <h3 style={{ marginBottom: 8, fontWeight: 'bold', textAlign: 'center' }}>{title}</h3>}
      <ResponsiveContainer width="100%" height={Math.max(60 * processedData.length, 200)}>
        <BarChart
          layout="vertical"
          data={processedData}
          margin={{
            top: 5,
            right: 20,
            left: 10,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            allowDecimals={false}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -8 } : undefined}
          />
          <YAxis
            dataKey={nameKey}
            type="category"
            width={80}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
          <Tooltip />
          <Bar
            dataKey={valueKey}
            fill={barColor}
            activeBar={<Rectangle fill="pink" stroke="blue" />}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopPerformersChart;
