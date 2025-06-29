import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BarChart3, Calculator, TrendingDown } from 'lucide-react';
import TimeAllocationSlider from './TimeAllocationSlider';
import TimeAllocationChart from './TimeAllocationChart';
import LifeImpactDisplay from './LifeImpactDisplay';

interface HabitAnalyzerSectionProps {
  onAnalyze: (habits: any) => void;
}

export default function HabitAnalyzerSection({ onAnalyze }: HabitAnalyzerSectionProps) {
  const [habits, setHabits] = useState({
    sleeping: 8,
    scrolling: 3,
    eating: 2,
    working: 8,
    netflix: 2,
    commuting: 1,
  });

  const [showAnalysis, setShowAnalysis] = useState(false);

  const habitConfig = [
    {
      key: 'sleeping',
      icon: '😴',
      label: 'Sleeping',
      description: 'Zzzzz time',
      max: 12,
      color: '#2D2B4A'
    },
    {
      key: 'scrolling',
      icon: '📱',
      label: 'Doomscrolling',
      description: 'Phone & social media',
      max: 8,
      color: '#FF4F61'
    },
    {
      key: 'working',
      icon: '💼',
      label: 'Work/Study',
      description: 'Productive hours',
      max: 16,
      color: '#FFA500'
    },
    {
      key: 'eating',
      icon: '🍽️',
      label: 'Eating & Cooking',
      description: 'Meal time',
      max: 6,
      color: '#FFD369'
    },
    {
      key: 'netflix',
      icon: '🍿',
      label: 'Netflix & Chill',
      description: 'Entertainment time',
      max: 8,
      color: '#511D47'
    },
    {
      key: 'commuting',
      icon: '🚗',
      label: 'Commuting',
      description: 'Travel time',
      max: 4,
      color: '#343B3C'
    }
  ];

  const totalHours = Object.values(habits).reduce((sum, hours) => sum + hours, 0);
  const isValid = totalHours <= 24;

  const chartData = habitConfig.map(config => ({
    name: config.label,
    value: habits[config.key as keyof typeof habits],
    color: config.color,
    icon: config.icon
  }));

  const handleAnalyze = () => {
    if (isValid) {
      setShowAnalysis(true);
      onAnalyze(habits);
    }
  };

  return (
    <section className="py-20 px-6 bg-dark-charcoal">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="font-space-grotesk font-bold text-display text-snow-white">
            Time Usage Analyzer
          </h2>
          <p className="font-inter text-body-lg text-snow-white/80 max-w-2xl mx-auto">
            Let's see how you really spend your 24 hours. Be honest - this is where the magic happens.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Input sliders */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-space-grotesk font-bold text-heading-md text-electric-orange">
                Daily Time Allocation
              </h3>
              <div className="text-right">
                <div className="font-space-grotesk font-bold text-xl text-snow-white">
                  {totalHours}/24h
                </div>
                <div className={`font-inter text-sm ${isValid ? 'text-digital-teal' : 'text-red-400'}`}>
                  {isValid ? '✓ Valid' : '⚠️ Over limit'}
                </div>
              </div>
            </div>

            {habitConfig.map((config, index) => (
              <motion.div
                key={config.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <TimeAllocationSlider
                  icon={config.icon}
                  label={config.label}
                  description={config.description}
                  value={habits[config.key as keyof typeof habits]}
                  onChange={(value) => setHabits(prev => ({ ...prev, [config.key]: value }))}
                  max={config.max}
                  color={config.color}
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="pt-6"
            >
              <Button
                onClick={handleAnalyze}
                disabled={!isValid}
                className="w-full btn-primary text-button py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Show Me My Life Reality
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center justify-center"
          >
            {showAnalysis && isValid ? (
              <div className="space-y-6 w-full">
                <TimeAllocationChart data={chartData} totalHours={totalHours} />
                <LifeImpactDisplay habits={habits} />
              </div>
            ) : (
              <div className="card-feature text-center space-y-6 w-full max-w-md">
                <div className="text-6xl">📊</div>
                <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
                  Your Analysis Will Appear Here
                </h3>
                <p className="font-inter text-body-sm text-snow-white/80">
                  Adjust your daily time allocation and click analyze to see the impact on your life.
                </p>
                {!isValid && (
                  <div className="bg-red-500/20 border border-red-500 rounded-xl p-4">
                    <p className="font-inter text-sm text-red-400">
                      Please adjust your time allocation to 24 hours or less.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}