import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import { motion } from 'framer-motion';

interface AnalyticsChartProps {
  data: any[];
  type: 'area' | 'bar' | 'line';
  dataKey: string;
  xAxisKey: string;
  yAxisKey?: string;
  colors?: {
    stroke: string;
    fill: string;
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="label font-bold text-gray-900 dark:text-white">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsChart({
  data,
  type,
  dataKey,
  xAxisKey,
  yAxisKey,
  colors = { stroke: '#8884d8', fill: '#8884d8' },
}: AnalyticsChartProps) {
  const chartComponents = {
    area: (
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.fill} stopOpacity={0.8} />
            <stop offset="95%" stopColor={colors.fill} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey={xAxisKey} stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey={dataKey} stroke={colors.stroke} fillOpacity={1} fill="url(#colorUv)" />
      </AreaChart>
    ),
    bar: (
      <BarChart data={data}>
        <XAxis dataKey={xAxisKey} stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey={dataKey} fill={colors.fill} radius={[4, 4, 0, 0]} />
      </BarChart>
    ),
    line: (
      <LineChart data={data}>
        <XAxis dataKey={xAxisKey} stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke={colors.stroke} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
      </LineChart>
    ),
  };

  return (
    <motion.div
      className="w-full h-80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer>
        {chartComponents[type]}
      </ResponsiveContainer>
    </motion.div>
  );
}
