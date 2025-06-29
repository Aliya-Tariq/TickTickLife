import { motion } from 'framer-motion';
import { useState } from 'react';

interface TimeBreakdownBarProps {
  lifeExpectancy: number;
  currentAge: number;
  habits: {
    sleeping: number;
    scrolling: number;
    eating: number;
    working: number;
    netflix: number;
    commuting: number;
  };
}

export default function TimeBreakdownBar({ lifeExpectancy, currentAge, habits }: TimeBreakdownBarProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  
  const remainingYears = lifeExpectancy - currentAge;
  const totalDailyHours = Object.values(habits).reduce((sum, hours) => sum + hours, 0);
  
  // Calculate years spent on each activity for remaining life
  const calculateYearsSpent = (dailyHours: number) => {
    return (dailyHours * 365 * remainingYears) / (24 * 365);
  };

  const segments = [
    {
      key: 'sleeping',
      label: 'Sleep',
      icon: '😴',
      years: calculateYearsSpent(habits.sleeping),
      color: '#5DA7DB',
      description: 'Time spent sleeping'
    },
    {
      key: 'scrolling',
      label: 'Scrolling',
      icon: '📱',
      years: calculateYearsSpent(habits.scrolling),
      color: '#FF6B6B',
      description: 'Time lost to mindless scrolling'
    },
    {
      key: 'working',
      label: 'Work/Study',
      icon: '💼',
      years: calculateYearsSpent(habits.working),
      color: '#F7C948',
      description: 'Time spent working or studying'
    },
    {
      key: 'netflix',
      label: 'Entertainment',
      icon: '🍿',
      years: calculateYearsSpent(habits.netflix),
      color: '#9C27B0',
      description: 'Time spent on entertainment'
    },
    {
      key: 'eating',
      label: 'Eating',
      icon: '🍽️',
      years: calculateYearsSpent(habits.eating),
      color: '#FF9800',
      description: 'Time spent eating and cooking'
    },
    {
      key: 'commuting',
      label: 'Commuting',
      icon: '🚗',
      years: calculateYearsSpent(habits.commuting),
      color: '#607D8B',
      description: 'Time spent traveling'
    }
  ];

  const totalUsedYears = segments.reduce((sum, segment) => sum + segment.years, 0);
  const awareTimeYears = Math.max(0, remainingYears - totalUsedYears);
  
  const awareTimeSegment = {
    key: 'aware',
    label: 'Conscious Time',
    icon: '🧠',
    years: awareTimeYears,
    color: '#4CAF50',
    description: 'Your precious conscious living time'
  };

  const allSegments = [...segments, awareTimeSegment];
  const totalYears = remainingYears;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
          Your Remaining {remainingYears} Years Breakdown
        </h3>
        <p className="font-inter text-body-sm text-snow-white/80">
          Hover over each segment to see the impact
        </p>
      </div>

      {/* Main stacked bar */}
      <div className="relative bg-soft-purple-gray rounded-2xl p-6 overflow-hidden">
        <div className="flex h-8 rounded-xl overflow-hidden shadow-lg">
          {allSegments.map((segment, index) => {
            const percentage = (segment.years / totalYears) * 100;
            
            return (
              <motion.div
                key={segment.key}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
                className="relative cursor-pointer transition-all duration-200 hover:brightness-110"
                style={{ backgroundColor: segment.color }}
                onMouseEnter={() => setHoveredSegment(segment.key)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                {percentage > 8 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-space-grotesk font-bold text-sm">
                      {segment.icon}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Tooltip */}
        {hoveredSegment && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-dark-charcoal text-snow-white p-4 rounded-xl shadow-lg border border-electric-orange z-10"
          >
            {(() => {
              const segment = allSegments.find(s => s.key === hoveredSegment);
              if (!segment) return null;
              
              return (
                <div className="text-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{segment.icon}</span>
                    <span className="font-space-grotesk font-bold text-lg">
                      {segment.label}
                    </span>
                  </div>
                  <div className="font-space-grotesk font-bold text-2xl text-electric-orange">
                    {segment.years.toFixed(1)} years
                  </div>
                  <p className="font-inter text-sm text-snow-white/80 max-w-48">
                    {segment.description}
                  </p>
                  {segment.key === 'scrolling' && segment.years > 2 && (
                    <p className="font-inter text-xs text-coral-pink">
                      💡 Reduce to 1h/day to reclaim {(segment.years * 0.6).toFixed(1)} years!
                    </p>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {allSegments.map((segment, index) => (
          <motion.div
            key={segment.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex items-center space-x-2 bg-soft-purple-gray rounded-xl p-3"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <div className="flex-1">
              <div className="font-inter text-xs text-snow-white/80">{segment.label}</div>
              <div className="font-space-grotesk font-bold text-sm text-snow-white">
                {segment.years.toFixed(1)}y
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Awareness Alert */}
      {awareTimeYears < remainingYears * 0.3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500 rounded-xl p-6 text-center"
        >
          <div className="text-4xl mb-2">😱</div>
          <h4 className="font-space-grotesk font-bold text-lg text-snow-white mb-2">
            Wake-Up Call!
          </h4>
          <p className="font-inter text-sm text-snow-white/90">
            You only have <span className="font-bold text-electric-orange">{awareTimeYears.toFixed(1)} years</span> of 
            conscious living time left. That's just {((awareTimeYears / remainingYears) * 100).toFixed(1)}% of your remaining life!
          </p>
        </motion.div>
      )}
    </div>
  );
}