import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleLeft, ToggleRight, TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface BeforeAfterComparisonProps {
  originalHabits: {
    sleeping: number;
    scrolling: number;
    eating: number;
    working: number;
    netflix: number;
    commuting: number;
  };
  simulatedHabits: {
    sleeping: number;
    scrolling: number;
    eating: number;
    working: number;
    netflix: number;
    commuting: number;
  };
  remainingYears: number;
}

export default function BeforeAfterComparison({ 
  originalHabits, 
  simulatedHabits, 
  remainingYears 
}: BeforeAfterComparisonProps) {
  const [viewMode, setViewMode] = useState<'toggle' | 'split'>('toggle');
  const [showingSimulated, setShowingSimulated] = useState(false);

  const calculateYearsSpent = (dailyHours: number) => {
    return (dailyHours * 365 * remainingYears) / (24 * 365);
  };

  const calculateConsciousTime = (habits: typeof originalHabits) => {
    const totalUsedYears = Object.values(habits).reduce((sum, hours) => 
      sum + calculateYearsSpent(hours), 0
    );
    return Math.max(0, remainingYears - totalUsedYears);
  };

  const originalConsciousTime = calculateConsciousTime(originalHabits);
  const simulatedConsciousTime = calculateConsciousTime(simulatedHabits);
  const timeReclaimed = simulatedConsciousTime - originalConsciousTime;

  const habitConfig = [
    { key: 'sleeping', label: 'Sleep', icon: '😴', color: '#5DA7DB' },
    { key: 'scrolling', label: 'Scrolling', icon: '📱', color: '#FF6B6B' },
    { key: 'working', label: 'Work', icon: '💼', color: '#F7C948' },
    { key: 'eating', label: 'Eating', icon: '🍽️', color: '#FF9800' },
    { key: 'netflix', label: 'Entertainment', icon: '🍿', color: '#9C27B0' },
    { key: 'commuting', label: 'Commuting', icon: '🚗', color: '#607D8B' }
  ];

  const getHabitData = (habits: typeof originalHabits) => {
    return habitConfig.map(config => ({
      ...config,
      years: calculateYearsSpent(habits[config.key as keyof typeof habits]),
      hours: habits[config.key as keyof typeof habits]
    }));
  };

  const originalData = getHabitData(originalHabits);
  const simulatedData = getHabitData(simulatedHabits);

  const renderLifeBar = (data: any[], consciousTime: number, label: string, isSimulated = false) => (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="font-space-grotesk font-bold text-lg text-snow-white mb-2">
          {label}
        </h4>
        <div className={`text-2xl font-space-grotesk font-bold ${
          isSimulated ? 'text-digital-teal' : 'text-electric-orange'
        }`}>
          {consciousTime.toFixed(1)} conscious years
        </div>
      </div>

      {/* Stacked bar */}
      <div className="relative h-8 bg-soft-purple-gray rounded-xl overflow-hidden">
        <div className="flex h-full">
          {data.map((item, index) => {
            const percentage = (item.years / remainingYears) * 100;
            return (
              <motion.div
                key={item.key}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="h-full relative group cursor-pointer"
                style={{ backgroundColor: item.color }}
                title={`${item.label}: ${item.years.toFixed(1)} years`}
              >
                {percentage > 8 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {item.icon}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
          
          {/* Conscious time */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(consciousTime / remainingYears) * 100}%` }}
            transition={{ delay: data.length * 0.1, duration: 0.8 }}
            className="h-full bg-gradient-to-r from-digital-teal to-green-500 flex items-center justify-center"
          >
            <span className="text-white text-sm font-bold">🧠</span>
          </motion.div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[...data, { 
          key: 'conscious', 
          label: 'Conscious', 
          icon: '🧠', 
          color: '#18C3B9', 
          years: consciousTime 
        }].map((item) => (
          <div key={item.key} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-inter text-xs text-snow-white/80">
              {item.label}: {item.years.toFixed(1)}y
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
          Before vs After Comparison
        </h3>
        <p className="font-inter text-body-sm text-snow-white/80">
          See the impact of your habit changes on your life timeline
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setViewMode('toggle')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            viewMode === 'toggle' 
              ? 'bg-electric-orange text-dark-charcoal' 
              : 'bg-soft-purple-gray text-snow-white hover:bg-soft-purple-gray/80'
          }`}
        >
          Toggle View
        </button>
        <button
          onClick={() => setViewMode('split')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            viewMode === 'split' 
              ? 'bg-electric-orange text-dark-charcoal' 
              : 'bg-soft-purple-gray text-snow-white hover:bg-soft-purple-gray/80'
          }`}
        >
          Split View
        </button>
      </div>

      {viewMode === 'toggle' ? (
        <div className="space-y-6">
          {/* Toggle Switch */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`font-space-grotesk font-semibold ${
              !showingSimulated ? 'text-electric-orange' : 'text-snow-white/60'
            }`}>
              Current
            </span>
            <motion.button
              onClick={() => setShowingSimulated(!showingSimulated)}
              className="relative w-16 h-8 bg-soft-purple-gray rounded-full p-1 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 bg-electric-orange rounded-full shadow-lg"
                animate={{ x: showingSimulated ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className={`font-space-grotesk font-semibold ${
              showingSimulated ? 'text-digital-teal' : 'text-snow-white/60'
            }`}>
              Simulated
            </span>
          </div>

          {/* Animated Life Bar */}
          <AnimatePresence mode="wait">
            <motion.div
              key={showingSimulated ? 'simulated' : 'current'}
              initial={{ opacity: 0, x: showingSimulated ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: showingSimulated ? -50 : 50 }}
              transition={{ duration: 0.5 }}
              className="card-feature"
            >
              {showingSimulated ? 
                renderLifeBar(simulatedData, simulatedConsciousTime, 'Simulated Life', true) :
                renderLifeBar(originalData, originalConsciousTime, 'Current Life')
              }
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-feature">
            {renderLifeBar(originalData, originalConsciousTime, 'Current Life')}
          </div>
          <div className="card-feature">
            {renderLifeBar(simulatedData, simulatedConsciousTime, 'Simulated Life', true)}
          </div>
        </div>
      )}

      {/* Impact Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className={`card-feature text-center ${
          timeReclaimed > 0 ? 'border border-digital-teal' : 
          timeReclaimed < 0 ? 'border border-red-500' : ''
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            {timeReclaimed > 0 ? (
              <TrendingUp className="h-8 w-8 text-digital-teal" />
            ) : timeReclaimed < 0 ? (
              <TrendingDown className="h-8 w-8 text-red-400" />
            ) : (
              <Zap className="h-8 w-8 text-electric-orange" />
            )}
            <div>
              <h4 className="font-space-grotesk font-bold text-xl text-snow-white">
                {timeReclaimed > 0 ? 'Time Reclaimed!' : 
                 timeReclaimed < 0 ? 'Time Lost' : 'No Change'}
              </h4>
              <div className={`font-space-grotesk font-bold text-2xl ${
                timeReclaimed > 0 ? 'text-digital-teal' : 
                timeReclaimed < 0 ? 'text-red-400' : 'text-electric-orange'
              }`}>
                {timeReclaimed > 0 ? '+' : ''}{timeReclaimed.toFixed(1)} years
              </div>
            </div>
          </div>

          <p className="font-inter text-snow-white/90 max-w-md mx-auto">
            {timeReclaimed > 0 ? 
              `Amazing! You've gained ${timeReclaimed.toFixed(1)} years of conscious living time. That's ${(timeReclaimed * 365).toFixed(0)} extra days to pursue your dreams!` :
              timeReclaimed < 0 ?
              `Your changes would cost you ${Math.abs(timeReclaimed).toFixed(1)} years. Consider adjusting your habits differently.` :
              'Your changes balance out. Try adjusting habits more significantly to see bigger impacts.'
            }
          </p>

          {timeReclaimed > 1 && (
            <div className="bg-gradient-to-r from-digital-teal/20 to-green-500/20 rounded-xl p-4">
              <p className="font-inter text-sm text-snow-white/90">
                💡 <strong>What could you do with {timeReclaimed.toFixed(1)} extra years?</strong>
                <br />
                Learn 3 new languages • Travel to 50 countries • Master 2 instruments • Write 5 books
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}