import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, TrendingUp, Target } from 'lucide-react';

interface HabitOptimizerProps {
  currentHabits: {
    sleeping: number;
    scrolling: number;
    eating: number;
    working: number;
    netflix: number;
    commuting: number;
  };
  lifeExpectancy: number;
  currentAge: number;
  onOptimizedHabits: (habits: any) => void;
}

export default function HabitOptimizer({ 
  currentHabits, 
  lifeExpectancy, 
  currentAge, 
  onOptimizedHabits 
}: HabitOptimizerProps) {
  const [optimizedHabits, setOptimizedHabits] = useState(currentHabits);
  const [showComparison, setShowComparison] = useState(false);

  const remainingYears = lifeExpectancy - currentAge;

  const calculateYearsSpent = (dailyHours: number) => {
    return (dailyHours * 365 * remainingYears) / (24 * 365);
  };

  const suggestions = [
    {
      icon: '🏃',
      title: 'Digital Detox',
      description: 'Reduce scrolling to 1 hour/day',
      action: () => setOptimizedHabits(prev => ({ ...prev, scrolling: 1 })),
      impact: calculateYearsSpent(currentHabits.scrolling) - calculateYearsSpent(1)
    },
    {
      icon: '📚',
      title: 'Mindful Entertainment',
      description: 'Limit Netflix to 1 hour/day',
      action: () => setOptimizedHabits(prev => ({ ...prev, netflix: 1 })),
      impact: calculateYearsSpent(currentHabits.netflix) - calculateYearsSpent(1)
    },
    {
      icon: '😴',
      title: 'Sleep Optimization',
      description: 'Optimize sleep to 7.5 hours',
      action: () => setOptimizedHabits(prev => ({ ...prev, sleeping: 7.5 })),
      impact: Math.abs(calculateYearsSpent(currentHabits.sleeping) - calculateYearsSpent(7.5))
    },
    {
      icon: '🚀',
      title: 'Productivity Boost',
      description: 'Reduce work hours, increase efficiency',
      action: () => setOptimizedHabits(prev => ({ ...prev, working: Math.max(6, prev.working - 1) })),
      impact: calculateYearsSpent(Math.max(0, currentHabits.working - 6))
    }
  ];

  const currentAwareTime = Math.max(0, remainingYears - Object.values(currentHabits).reduce((sum, h) => sum + calculateYearsSpent(h), 0));
  const optimizedAwareTime = Math.max(0, remainingYears - Object.values(optimizedHabits).reduce((sum, h) => sum + calculateYearsSpent(h), 0));
  const timeReclaimed = optimizedAwareTime - currentAwareTime;

  const handleReset = () => {
    setOptimizedHabits(currentHabits);
    setShowComparison(false);
  };

  const handleApplyOptimizations = () => {
    onOptimizedHabits(optimizedHabits);
    setShowComparison(true);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
          Reclaim Your Time
        </h3>
        <p className="font-inter text-body-sm text-snow-white/80 max-w-2xl mx-auto">
          Small changes in your daily habits can give you years of life back. 
          Try these optimizations and see the impact.
        </p>
      </div>

      {/* Quick Suggestions */}
      <div className="grid md:grid-cols-2 gap-4">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="card-feature space-y-4 cursor-pointer hover:bg-soft-purple-gray/80 transition-colors"
            onClick={suggestion.action}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{suggestion.icon}</span>
              <div className="flex-1">
                <h4 className="font-space-grotesk font-semibold text-snow-white">
                  {suggestion.title}
                </h4>
                <p className="font-inter text-sm text-snow-white/70">
                  {suggestion.description}
                </p>
              </div>
              <div className="text-right">
                <div className="font-space-grotesk font-bold text-digital-teal">
                  +{suggestion.impact.toFixed(1)}y
                </div>
                <div className="font-inter text-xs text-snow-white/60">
                  reclaimed
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Manual Adjustments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="card-feature space-y-6"
      >
        <h4 className="font-space-grotesk font-bold text-lg text-snow-white text-center">
          Fine-tune Your Habits
        </h4>

        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(optimizedHabits).map(([key, value]) => {
            const icons = {
              sleeping: '😴',
              scrolling: '📱',
              eating: '🍽️',
              working: '💼',
              netflix: '🍿',
              commuting: '🚗'
            };

            const labels = {
              sleeping: 'Sleep',
              scrolling: 'Scrolling',
              eating: 'Eating',
              working: 'Work',
              netflix: 'Entertainment',
              commuting: 'Commuting'
            };

            return (
              <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{icons[key as keyof typeof icons]}</span>
                    <span className="font-inter text-sm text-snow-white">
                      {labels[key as keyof typeof labels]}
                    </span>
                  </div>
                  <span className="font-space-grotesk font-bold text-electric-orange">
                    {value}h
                  </span>
                </div>
                <Slider
                  value={[value]}
                  onValueChange={(newValue) => 
                    setOptimizedHabits(prev => ({ ...prev, [key]: newValue[0] }))
                  }
                  max={key === 'working' ? 16 : key === 'sleeping' ? 12 : 8}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-snow-white/20">
          <div className="text-center">
            <div className="font-space-grotesk font-bold text-2xl text-digital-teal">
              +{timeReclaimed.toFixed(1)} years
            </div>
            <div className="font-inter text-sm text-snow-white/80">
              Time reclaimed
            </div>
          </div>
          <div className="space-x-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="btn-secondary"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={handleApplyOptimizations}
              className="btn-primary"
            >
              <Target className="mr-2 h-4 w-4" />
              Apply Changes
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Before/After Comparison */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-countdown space-y-6"
          >
            <div className="text-center space-y-2">
              <h4 className="font-space-grotesk font-bold text-lg text-electric-orange">
                Before vs After Optimization
              </h4>
              <p className="font-inter text-sm text-snow-white/80">
                See how your changes impact your conscious living time
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="font-space-grotesk font-semibold text-snow-white text-center">
                  Before 😔
                </h5>
                <div className="bg-red-500/20 rounded-xl p-4 text-center">
                  <div className="font-space-grotesk font-bold text-2xl text-red-400">
                    {currentAwareTime.toFixed(1)} years
                  </div>
                  <div className="font-inter text-sm text-snow-white/80">
                    Conscious time
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-space-grotesk font-semibold text-snow-white text-center">
                  After 🎉
                </h5>
                <div className="bg-green-500/20 rounded-xl p-4 text-center">
                  <div className="font-space-grotesk font-bold text-2xl text-green-400">
                    {optimizedAwareTime.toFixed(1)} years
                  </div>
                  <div className="font-inter text-sm text-snow-white/80">
                    Conscious time
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-digital-teal to-warm-gold rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h5 className="font-space-grotesk font-bold text-xl text-dark-charcoal mb-2">
                Congratulations!
              </h5>
              <p className="font-inter text-dark-charcoal">
                You've reclaimed <span className="font-bold">{timeReclaimed.toFixed(1)} years</span> of 
                conscious living time. That's {(timeReclaimed * 365).toFixed(0)} extra days to pursue your dreams!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}