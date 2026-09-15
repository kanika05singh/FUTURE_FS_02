import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DashboardStats } from '../types';

const COLORS = {
  New: '#4c5fd9',
  Contacted: '#a67a1f',
  Converted: '#1f4d3a',
};

export default function StatusDistributionChart({ stats }: { stats: DashboardStats }) {
  const data = [
    { status: 'New', count: stats.new },
    { status: 'Contacted', count: stats.contacted },
    { status: 'Converted', count: stats.converted },
  ];

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <h3 className="mb-4 text-sm font-medium text-ink-muted">Leads by status</h3>
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
            <XAxis type="number" hide allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="status"
              width={80}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#5b6b60', fontSize: 12, fontFamily: 'Inter' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              contentStyle={{ borderRadius: 8, borderColor: '#e1e5df', fontSize: 12, fontFamily: 'Inter' }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={COLORS[entry.status as keyof typeof COLORS]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
