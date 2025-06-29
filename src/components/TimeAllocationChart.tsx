import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TimeAllocationChartProps {
  data: {
    name: string;
    value: number;
    color: string;
    icon: string;
  }[];
  totalHours: number;
}

export default function TimeAllocationChart({ data, totalHours }: TimeAllocationChartProps) {
  const freeTime = Math.max(0, 24 - totalHours);
  
  const chartData = [
    ...data.filter(item => item.value > 0),
    ...(freeTime > 0 ? [{
      name: 'Free Time',
      value: freeTime,
      color: '#18C3B9',
      icon: '🌟'
    }] : [])
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-dark-charcoal border border-electric-orange rounded-xl p-3 shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{data.icon}</span>
            <span className="font-space-grotesk font-semibold text-snow-white">
              {data.name}
            </span>
          </div>
          <p className="font-inter text-electric-orange font-bold">
            {data.value}h ({((data.value / 24) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (value < 1) return null; // Don't show labels for very small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="#F2F2F2" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-inter font-semibold text-sm"
      >
        {`${value}h`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="card-countdown space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="font-space-grotesk font-bold text-heading-md text-electric-orange">
          Your Daily Time Breakdown
        </h3>
        <p className="font-inter text-body-sm text-snow-white/80">
          How you spend your 24 hours
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={100}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {chartData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex items-center space-x-2 bg-soft-purple-gray rounded-xl p-3"
          >
            <span className="text-lg">{item.icon}</span>
            <div className="flex-1">
              <div className="font-inter text-xs text-snow-white/80">{item.name}</div>
              <div className="font-space-grotesk font-bold text-sm" style={{ color: item.color }}>
                {item.value}h
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {totalHours > 24 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/20 border border-red-500 rounded-xl p-4 text-center"
        >
          <p className="font-inter text-sm text-red-400">
            ⚠️ You've allocated {totalHours} hours - that's {totalHours - 24} hours over a 24-hour day!
          </p>
        </motion.div>
      )}

      {freeTime > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-digital-teal/20 border border-digital-teal rounded-xl p-4 text-center"
        >
          <p className="font-inter text-sm text-digital-teal">
            🌟 You have {freeTime} hours of free time daily!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}