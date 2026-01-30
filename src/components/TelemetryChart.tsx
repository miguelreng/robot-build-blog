import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface ChartProps {
  type: 'line' | 'bar' | 'pie';
  data: any[];
  xAxis?: string;
  yAxis?: string;
  title?: string;
}

const COLORS = ['#403F3C', '#A2A19E', '#d1d1d1', '#ededed'];

export default function TelemetryChart({ type, data, xAxis, yAxis, title }: ChartProps) {
  return (
    <div className="w-full h-80 my-12 p-6 bg-[#403F3C]/[0.02] border border-[#403F3C]/5 rounded-sm">
      {title && <h4 className="text-[10px] uppercase tracking-widest text-[#403F3C]/40 mb-6 font-bold">{title}</h4>}
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#403F3C10" />
            <XAxis dataKey={xAxis} fontSize={10} tick={{fill: '#403F3C40'}} />
            <YAxis fontSize={10} tick={{fill: '#403F3C40'}} />
            <Tooltip contentStyle={{backgroundColor: '#F8F6F3', borderColor: '#403F3C10', borderRadius: '4px', fontSize: '12px'}} />
            <Line type="monotone" dataKey={yAxis} stroke="#403F3C" strokeWidth={2} dot={{fill: '#403F3C'}} />
          </LineChart>
        ) : type === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#403F3C10" />
            <XAxis dataKey={xAxis} fontSize={10} tick={{fill: '#403F3C40'}} />
            <YAxis fontSize={10} tick={{fill: '#403F3C40'}} />
            <Tooltip contentStyle={{backgroundColor: '#F8F6F3', borderColor: '#403F3C10', borderRadius: '4px', fontSize: '12px'}} />
            <Bar dataKey={yAxis} fill="#403F3C" />
          </BarChart>
        ) : (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#403F3C" label={{fontSize: 10, fill: '#403F3C80'}}>
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em'}} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
