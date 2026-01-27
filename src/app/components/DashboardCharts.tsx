import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';

interface ComplianceChartProps {
  data: Array<{ month: string; compliant: number; expiring: number; expired: number }>;
}

export function ComplianceAreaChart({ data }: ComplianceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCompliant" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpiring" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpired" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="month"
          tick={{ fill: '#64748b', fontSize: 12 }}
          tickLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 12 }}
          tickLine={{ stroke: '#e2e8f0' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Area
          type="monotone"
          dataKey="compliant"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#colorCompliant)"
          name="Compliant"
        />
        <Area
          type="monotone"
          dataKey="expiring"
          stroke="#f59e0b"
          strokeWidth={2}
          fill="url(#colorExpiring)"
          name="Expiring Soon"
        />
        <Area
          type="monotone"
          dataKey="expired"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#colorExpired)"
          name="Expired"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface CompliancePieChartProps {
  compliantCount: number;
  expiringCount: number;
  expiredCount: number;
  totalCount: number;
}

export function CompliancePieChart({ compliantCount, expiringCount, expiredCount, totalCount }: CompliancePieChartProps) {
  const pieData = [
    { name: 'Compliant', value: compliantCount, color: '#10b981' },
    { name: 'Expiring Soon', value: expiringCount, color: '#f59e0b' },
    { name: 'Expired', value: expiredCount, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const complianceRate = totalCount > 0
    ? Math.round((compliantCount / totalCount) * 100)
    : 0;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <Label
            value={`${complianceRate}%`}
            position="center"
            style={{
              fontSize: '28px',
              fontWeight: 700,
              fill: '#0f172a'
            }}
          />
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
