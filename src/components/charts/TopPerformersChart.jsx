import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const TopPerformersChart = ({
  data = [],
  xAxisKey = 'totalKg',
  yAxisKey = 'name',
  barColor = '#8884d8',
  title = '',
  height = 250,
  xAxisLabel = '',
  yAxisLabel = '',
  domain,
  tickCount,
  barLabelFormatter,
}) => (
  <div className="bg-white rounded-lg shadow p-4 min-h-[320px] flex flex-col justify-between">
    {title && <h3 className="font-semibold mb-4 text-lg text-gray-900">{title}</h3>}
    {(!data || data.length === 0) ? (
      <div className="text-gray-500 text-center py-8">No data available for current filters.</div>
    ) : (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 10, right: 80, top: 10, bottom: 30 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey={xAxisKey}
            label={xAxisLabel ? {
              value: xAxisLabel,
              position: 'insideBottom',
              offset: -10,
              style: { textAnchor: 'middle', fontWeight: 600, fill: '#374151', fontSize: 15 }
            } : undefined}
            tick={{ fontSize: 13 }}
            domain={domain}
            tickCount={tickCount}
          />
          <YAxis
            dataKey={yAxisKey}
            type="category"
            width={120}
            tick={{ fontSize: 15, fontWeight: 600, fill: '#374151' }}
            label={yAxisLabel ? {
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              style: { textAnchor: 'middle', fontWeight: 600, fill: '#374151', fontSize: 15 }
            } : undefined}
          />
          <Tooltip
            formatter={(value) => [`${value} kg`, 'Total']}
            labelFormatter={(label) => `${yAxisLabel}: ${label}`}
          />
          <Bar
            dataKey={xAxisKey}
            fill={barColor}
            radius={[0, 6, 6, 0]}
            label={barLabelFormatter ? { position: 'right', ...barLabelFormatter } : undefined}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default TopPerformersChart;
