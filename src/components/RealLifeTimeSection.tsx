import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import TimeBreakdownBar from './TimeBreakdownBar';
import SummaryStatCards from './SummaryStatCards';
import HabitOptimizer from './HabitOptimizer';
import TimeAwarenessRing from './TimeAwarenessRing';
import ShareResults from './ShareResults';

interface RealLifeTimeSectionProps {
  birthDate: Date;
  lifeExpectancy: number;
  habits: {
    sleeping: number;
    scrolling: number;
    eating: number;
    working: number;
    netflix: number;
    commuting: number;
  };
  onComplete?: () => void;
}

export default function RealLifeTimeSection({ 
  birthDate, 
  lifeExpectancy, 
  habits,
  onComplete 
}: RealLifeTimeSectionProps) {
  const [currentHabits, setCurrentHabits] = useState(habits);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showGoalCTA, setShowGoalCTA] = useState(false);

  const currentAge = new Date().getFullYear() - birthDate.getFullYear();
  const remainingYears = lifeExpectancy - currentAge;

  const calculateYearsSpent = (dailyHours: number) => {
    return (dailyHours * 365 * remainingYears) / (24 * 365);
  };

  const calculateConsciousTime = (habitData: typeof habits) => {
    const totalUsedYears = Object.values(habitData).reduce((sum, hours) => 
      sum + calculateYearsSpent(hours), 0
    );
    return Math.max(0, remainingYears - totalUsedYears);
  };

  const consciousYears = calculateConsciousTime(currentHabits);

  // Find the biggest time waster
  const timeWasters = [
    { activity: 'Scrolling', years: calculateYearsSpent(currentHabits.scrolling), icon: '📱' },
    { activity: 'Netflix', years: calculateYearsSpent(currentHabits.netflix), icon: '🍿' },
    { activity: 'Commuting', years: calculateYearsSpent(currentHabits.commuting), icon: '🚗' }
  ];
  
  const topTimeWaster = timeWasters.reduce((max, current) => 
    current.years > max.years ? current : max
  );

  const handleOptimizedHabits = (optimizedHabits: typeof habits) => {
    setCurrentHabits(optimizedHabits);
  };

  useEffect(() => {
    // Auto-scroll to next section after initial load
    const timer = setTimeout(() => {
      setShowOptimizer(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show goal management CTA after user has seen their results
    const timer = setTimeout(() => {
      setShowGoalCTA(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 px-6 bg-dark-charcoal">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="font-space-grotesk font-bold text-display text-snow-white">
            Your Real-Life Time Left
          </h2>
          <p className="font-inter text-body-lg text-snow-white/80 max-w-3xl mx-auto">
            This is where it gets real. See exactly how your daily habits are consuming 
            your precious remaining years — and discover how little conscious time you actually have.
          </p>
        </motion.div>

        {/* Time Breakdown Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <TimeBreakdownBar
            lifeExpectancy={lifeExpectancy}
            currentAge={currentAge}
            habits={currentHabits}
          />
        </motion.div>

        {/* Summary Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <SummaryStatCards
            lifeExpectancy={lifeExpectancy}
            currentAge={currentAge}
            habits={currentHabits}
          />
        </motion.div>

        {/* Time Awareness Ring */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <TimeAwarenessRing
            consciousYears={consciousYears}
            totalRemainingYears={remainingYears}
          />
        </motion.div>

        {/* Habit Optimizer */}
        {showOptimizer && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <HabitOptimizer
              currentHabits={habits}
              lifeExpectancy={lifeExpectancy}
              currentAge={currentAge}
              onOptimizedHabits={handleOptimizedHabits}
            />
          </motion.div>
        )}

        {/* Goal Management CTA */}
        {showGoalCTA && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="bg-gradient-to-r from-electric-orange/20 to-warm-gold/20 rounded-3xl p-8 border border-electric-orange">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-space-grotesk font-bold text-2xl text-snow-white mb-4">
                Now That You Know Your Reality...
              </h3>
              <p className="font-inter text-lg text-snow-white/90 mb-6 max-w-2xl mx-auto">
                You have {consciousYears.toFixed(1)} conscious years left. What will you do with them? 
                Set meaningful goals and make every moment count.
              </p>
              <Button
                onClick={onComplete}
                className="btn-primary text-lg px-8 py-4 animate-pulse-glow"
              >
                <span>Create Life Goals</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Call to Action for Sharing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={() => setShowShare(true)}
            className="btn-secondary text-lg px-8 py-4"
          >
            🤯 Share My Reality Check
          </button>
        </motion.div>

        {/* Share Results */}
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ShareResults
              consciousYears={consciousYears}
              totalRemainingYears={remainingYears}
              currentAge={currentAge}
              lifeExpectancy={lifeExpectancy}
              topTimeWaster={topTimeWaster}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}