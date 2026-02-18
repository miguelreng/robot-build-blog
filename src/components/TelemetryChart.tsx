import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';

const MONO_FONT = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  xAxis?: string;
  yAxis?: string;
  title?: string;
  legend?: string;
}

const COLORS = ['#676767', '#4D4D4D', '#8C8C8C', '#facc15', '#B3B3B3'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-[#676767]/10 p-3 rounded-xl tracking-normal font-mono scale-95 uppercase">
        <p className="text-[12px] !font-bold text-[#262626] mb-1">{label}</p>
        <p className="text-sm !font-bold text-[#262626]">
          {payload[0].value} <span className="text-[12px] text-[#262626]/60 ml-1 !font-bold uppercase">{payload[0].name}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function TelemetryChart({ type, data, xAxis = 'name', yAxis = 'val', title, legend }: ChartProps) {
  const chartId = React.useId().replace(/:/g, '');

  return (
    <div
      className="w-full md:w-[60vw] md:relative md:left-1/2 md:-translate-x-1/2 h-fit my-6 bg-white rounded-[32px] border border-brand-gray-90/5 px-8 py-6 group"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(103, 103, 103, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(103, 103, 103, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gray-90/[0.01] to-transparent pointer-events-none" />

      {title && (
        <div className="flex items-center justify-center mb-12">
          <h4 className="text-[16px] text-brand-black !font-bold tracking-normal uppercase font-mono">{title}</h4>
        </div>
      )}

      <div className="h-80 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }} style={{ outline: 'none' }}>
              <XAxis dataKey={xAxis} fontSize={13} tickLine={false} axisLine={{ stroke: '#676767', opacity: 0.6 }} tick={{ fill: '#262626', letterSpacing: '0', fontWeight: 700, fontFamily: MONO_FONT }} tickFormatter={(val) => String(val).toUpperCase()} />
              <YAxis fontSize={13} tickLine={false} axisLine={{ stroke: '#676767', opacity: 0.6 }} tick={{ fill: '#262626', letterSpacing: '0', fontWeight: 700, fontFamily: MONO_FONT }} tickFormatter={(val) => String(val).toUpperCase()} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                isAnimationActive={false}
                type="monotone"
                dataKey={yAxis}
                stroke="#676767"
                strokeWidth={2.5}
                dot={{ fill: '#facc15', r: 4, stroke: '#4D4D4C', strokeWidth: 2.5 }}
                activeDot={{ r: 6, stroke: '#262626', strokeWidth: 2, fill: '#262626' }}
              />
            </LineChart>
          ) : type === 'area' ? (
            <AreaChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }} style={{ outline: 'none' }}>
              <defs>
                <linearGradient id={`gradient-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#facc15" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#676767" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey={xAxis} fontSize={13} tickLine={false} axisLine={{ stroke: '#676767', opacity: 0.6 }} tick={{ fill: '#262626', letterSpacing: '0', fontWeight: 700, fontFamily: MONO_FONT }} tickFormatter={(val) => String(val).toUpperCase()} />
              <YAxis fontSize={13} tickLine={false} axisLine={{ stroke: '#676767', opacity: 0.6 }} tick={{ fill: '#262626', letterSpacing: '0', fontWeight: 700, fontFamily: MONO_FONT }} tickFormatter={(val) => String(val).toUpperCase()} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                isAnimationActive={false}
                type="monotone"
                dataKey={yAxis}
                stroke="#676767"
                fillOpacity={1}
                fill={`url(#gradient-${chartId})`}
                strokeWidth={2}
              />
            </AreaChart>
          ) : type === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }} style={{ outline: 'none' }}>
              <XAxis dataKey={xAxis} fontSize={13} tickLine={false} axisLine={{ stroke: '#676767', opacity: 0.6 }} tick={{ fill: '#262626', letterSpacing: '0', fontWeight: 700, fontFamily: MONO_FONT }} tickFormatter={(val) => String(val).toUpperCase()} />
              <YAxis fontSize={13} tickLine={false} axisLine={{ stroke: '#676767', opacity: 0.6 }} tick={{ fill: '#262626', letterSpacing: '0', fontWeight: 700, fontFamily: MONO_FONT }} tickFormatter={(val) => String(val).toUpperCase()} />
              <Tooltip content={<CustomTooltip />} />
              <Bar isAnimationActive={false} dataKey={yAxis} fill="#676767" radius={[4, 4, 0, 0]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#facc15' : '#676767'} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart style={{ outline: 'none' }}>
              <Pie
                isAnimationActive={false}
                data={data}
                dataKey={yAxis}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                stroke="none"
              >
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: '11px',
                  letterSpacing: '0',
                  fontWeight: '600',
                  paddingTop: '24px',
                  color: '#676767',
                  fontFamily: MONO_FONT,
                  textTransform: 'uppercase'
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {legend && (
        <div className="mt-4 flex items-center gap-3 px-2 border-t border-[#676767]/10 pt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#676767]/30" />
          <p className="text-[13px] !font-bold text-[#262626] font-mono uppercase">
            {legend}
          </p>
        </div>
      )}
    </div>
  );
}
