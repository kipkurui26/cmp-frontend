import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';


const BarChartWidget = ({
  data = [],
  xAxisKey = '',
  yAxisKeys = [],
  colors = [],
  title = '',
  height = 350,
  barProps = {},
  xTickFormatter,
  ...props
}) => (
  <div className="bg-white rounded shadow p-4 mb-4">
    {title && <h3 className="font-semibold mb-2">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} {...props}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 12 }}
          tickFormatter={xTickFormatter}
          interval="preserveStartEnd"
          minTickGap={20}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        {yAxisKeys.map((key, idx) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[idx % colors.length] || '#8884d8'}
            name={key}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
            {...barProps}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BarChartWidget