import { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';

interface HabitSimulatorSlidersProps {
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
  onHabitChange: (habit: string, value: number) => void;
  onReset: () => void;
}

const habitConfig = [
  {
    key: 'sleeping',
    icon: '😴',
    label: 'Sleep',
    description: 'Hours of sleep per night',
    max: 12,
    color: '#5DA7DB',
    optimal: 7.5
  },
  {
    key: 'scrolling',
    icon: '📱',
    label: 'Scrolling',
    description: 'Social media & phone time',
    max: 8,
    color: '#FF6B6B',
    optimal: 1
  },
  {
    key: 'working',
    icon: '💼',
    label: 'Work/Study',
    description: 'Productive work hours',
    max: 16,
    color: '#F7C948',
    optimal: 8
  },
  {
    key: 'eating',
    icon: '🍽️',
    label: 'Eating',
    description: 'Meals & cooking time',
    max: 6,
    color: '#FF9800',
    optimal: 2
  },
  {
    key: 'netflix',
    icon: '🍿',
    label: 'Entertainment',
    description: 'TV, movies, streaming',
    max: 8,
    color: '#9C27B0',
    optimal: 1.5
  },
  {
    key: 'commuting',
    icon: '🚗',
    label: 'Commuting',
    description: 'Travel & transportation',
    max: 4,
    color: '#607D8B',
    optimal: 0.5
  }
];

export default function HabitSimulatorSliders({ 
  originalHabits, 
  simulatedHabits, 
  onHabitChange, 
  onReset 
}: HabitSimulatorSlidersProps) {
  const [hoveredHabit, setHoveredHabit] = useState<string | null>(null);

  const totalHours = Object.values(simulatedHabits).reduce((sum, hours) => sum + hours, 0);
  const isValid = totalHours <= 24;

  const getChangeIndicator = (habitKey: string) => {
    const original = originalHabits[habitKey as keyof typeof originalHabits];
    const simulated = simulatedHabits[habitKey as keyof typeof simulatedHabits];
    const change = simulated - original;
    
    if (Math.abs(change) < 0.1) return null;
    
    return {
      change,
      isPositive: change > 0,
      icon: change > 0 ? TrendingUp : TrendingDown,
      color: change > 0 ? '#FF6B6B' : '#4CAF50'
    };
  };

  const getOptimalityScore = (habitKey: string, value: number) => {
    const config = habitConfig.find(h => h.key === habitKey);
    if (!config) return 0;
    
    const distance = Math.abs(value - config.optimal);
    const maxDistance = Math.max(config.optimal, config.max - config.optimal);
    return Math.max(0, 100 - (distance / maxDistance) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
            Habit Simulator
          </h3>
          <p className="font-inter text-body-sm text-snow-white/80">
            Adjust your daily habits to see how much life you can reclaim
          </p>
        </div>
        
        <div className="text-right space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-space-grotesk font-bold text-xl text-snow-white">
              {totalHours.toFixed(1)}/24h
            </span>
            <motion.button
              onClick={onReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-soft-purple-gray rounded-xl hover:bg-soft-purple-gray/80 transition-colors"
            >
              <RotateCcw className="h-4 w-4 text-snow-white" />
            </motion.button>
          </div>
          <div className={`font-inter text-sm ${isValid ? 'text-digital-teal' : 'text-red-400'}`}>
            {isValid ? '✓ Valid schedule' : '⚠️ Over 24 hours'}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {habitConfig.map((config, index) => {
          const value = simulatedHabits[config.key as keyof typeof simulatedHabits];
          const changeIndicator = getChangeIndicator(config.key);
          const optimalityScore = getOptimalityScore(config.key, value);
          
          return (
            <motion.div
              key={config.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="card-feature space-y-4 relative overflow-hidden"
              onMouseEnter={() => setHoveredHabit(config.key)}
              onMouseLeave={() => setHoveredHabit(null)}
            >
              {/* Background gradient based on optimality */}
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `linear-gradient(135deg, ${config.color}40, transparent)`
                }}
                animate={{
                  opacity: hoveredHabit === config.key ? 0.2 : 0.1
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <motion.span 
                      className="text-2xl"
                      animate={{ 
                        scale: hoveredHabit === config.key ? 1.2 : 1,
                        rotate: hoveredHabit === config.key ? [0, -5, 5, 0] : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {config.icon}
                    </motion.span>
                    <div>
                      <h4 className="font-space-grotesk font-semibold text-lg text-snow-white">
                        {config.label}
                      </h4>
                      <p className="font-inter text-sm text-snow-white/70">
                        {config.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="font-space-grotesk font-bold text-xl text-electric-orange">
                        {value}h
                      </span>
                      {changeIndicator && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center space-x-1"
                          style={{ color: changeIndicator.color }}
                        >
                          <changeIndicator.icon className="h-4 w-4" />
                          <span className="font-inter text-sm font-bold">
                            {Math.abs(changeIndicator.change).toFixed(1)}h
                          </span>
                        </motion.div>
                      )}
                    </div>
                    <div className="font-inter text-xs text-snow-white/60">
                      Optimal: {config.optimal}h
                    </div>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-3">
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => onHabitChange(config.key, newValue[0])}
                    max={config.max}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-xs font-inter text-snow-white/60">
                    <span>0h</span>
                    <span>{config.max}h</span>
                  </div>
                </div>

                {/* Optimality indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-inter text-xs text-snow-white/80">
                      Health Score
                    </span>
                    <span 
                      className="font-inter text-xs font-bold"
                      style={{ 
                        color: optimalityScore > 70 ? '#4CAF50' : 
                               optimalityScore > 40 ? '#FFA500' : '#FF6B6B'
                      }}
                    >
                      {Math.round(optimalityScore)}%
                    </span>
                  </div>
                  <div className="h-1 bg-soft-purple-gray rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: optimalityScore > 70 ? '#4CAF50' : 
                                       optimalityScore > 40 ? '#FFA500' : '#FF6B6B'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${optimalityScore}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Tooltip on hover */}
                {hoveredHabit === config.key && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-dark-charcoal border border-electric-orange rounded-xl p-3 shadow-lg z-20 min-w-48"
                  >
                    <div className="text-center space-y-1">
                      <p className="font-inter text-sm text-snow-white">
                        {value < config.optimal ? 
                          `+${(config.optimal - value).toFixed(1)}h to optimal` :
                          value > config.optimal ?
                          `-${(value - config.optimal).toFixed(1)}h from optimal` :
                          'Perfect! This is optimal'
                        }
                      </p>
                      {changeIndicator && (
                        <p className="font-inter text-xs" style={{ color: changeIndicator.color }}>
                          {changeIndicator.isPositive ? 'Increased' : 'Decreased'} by {Math.abs(changeIndicator.change).toFixed(1)}h
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Schedule validation */}
      {!isValid && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/20 border border-red-500 rounded-xl p-4 text-center"
        >
          <p className="font-inter text-red-400">
            ⚠️ Your schedule totals {totalHours.toFixed(1)} hours. Please adjust to 24 hours or less.
          </p>
        </motion.div>
      )}
    </div>
  );
}