import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface LifeImpactDisplayProps {
  habits: {
    sleeping: number;
    scrolling: number;
    eating: number;
    working: number;
    netflix: number;
    commuting: number;
  };
}

export default function LifeImpactDisplay({ habits }: LifeImpactDisplayProps) {
  // Calculate life impact based on habits
  const calculateLifeImpact = () => {
    const impacts = {
      scrolling: {
        yearsLost: (habits.scrolling * 365 * 50) / (24 * 365), // Assuming 50 years of adult life
        description: 'Years lost to mindless scrolling',
        severity: habits.scrolling > 4 ? 'high' : habits.scrolling > 2 ? 'medium' : 'low'
      },
      netflix: {
        yearsLost: (habits.netflix * 365 * 50) / (24 * 365),
        description: 'Years spent binge-watching',
        severity: habits.netflix > 4 ? 'high' : habits.netflix > 2 ? 'medium' : 'low'
      },
      commuting: {
        yearsLost: (habits.commuting * 365 * 40) / (24 * 365), // 40 working years
        description: 'Years in transit',
        severity: habits.commuting > 2 ? 'high' : habits.commuting > 1 ? 'medium' : 'low'
      }
    };

    const totalYearsLost = Object.values(impacts).reduce((sum, impact) => sum + impact.yearsLost, 0);
    
    return { impacts, totalYearsLost };
  };

  const { impacts, totalYearsLost } = calculateLifeImpact();
  const freeTime = Math.max(0, 24 - Object.values(habits).reduce((sum, h) => sum + h, 0));
  const freeTimePercentage = (freeTime / 24) * 100;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-snow-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <TrendingDown className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <TrendingUp className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-feature space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="font-space-grotesk font-bold text-heading-md text-electric-orange">
          Life Impact Analysis
        </h3>
        <p className="font-inter text-body-sm text-snow-white/80">
          The real cost of your daily habits
        </p>
      </div>

      {/* Total impact summary */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-charcoal rounded-2xl p-6 border border-electric-orange"
      >
        <div className="text-center space-y-2">
          <div className="font-space-grotesk font-bold text-2xl text-electric-orange">
            {totalYearsLost.toFixed(1)} Years
          </div>
          <p className="font-inter text-sm text-snow-white/80">
            Potentially lost to time-wasting habits
          </p>
        </div>
      </motion.div>

      {/* Individual habit impacts */}
      <div className="space-y-3">
        {Object.entries(impacts).map(([habit, impact], index) => (
          <motion.div
            key={habit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex items-center justify-between bg-soft-purple-gray rounded-xl p-4"
          >
            <div className="flex items-center space-x-3">
              <span className={getSeverityColor(impact.severity)}>
                {getSeverityIcon(impact.severity)}
              </span>
              <div>
                <div className="font-inter text-sm text-snow-white">
                  {impact.description}
                </div>
                <div className="font-inter text-xs text-snow-white/60">
                  {habits[habit as keyof typeof habits]}h daily
                </div>
              </div>
            </div>
            <div className={`font-space-grotesk font-bold ${getSeverityColor(impact.severity)}`}>
              {impact.yearsLost.toFixed(1)}y
            </div>
          </motion.div>
        ))}
      </div>

      {/* Free time analysis */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className={`rounded-xl p-4 border ${
          freeTimePercentage > 30 
            ? 'bg-digital-teal/20 border-digital-teal' 
            : freeTimePercentage > 15 
            ? 'bg-yellow-400/20 border-yellow-400'
            : 'bg-red-400/20 border-red-400'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-space-grotesk font-bold text-snow-white">
              Free Time: {freeTime}h ({freeTimePercentage.toFixed(1)}%)
            </div>
            <div className="font-inter text-sm text-snow-white/80">
              {freeTimePercentage > 30 
                ? '🌟 Great! You have good work-life balance'
                : freeTimePercentage > 15 
                ? '⚠️ Consider optimizing your schedule'
                : '🚨 You need more free time for yourself'
              }
            </div>
          </div>
          <TrendingUp className={`h-6 w-6 ${
            freeTimePercentage > 30 ? 'text-digital-teal' : 
            freeTimePercentage > 15 ? 'text-yellow-400' : 'text-red-400'
          }`} />
        </div>
      </motion.div>

      {/* Motivational message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-center bg-gradient-orange-gold rounded-xl p-4"
      >
        <p className="font-inter text-sm text-dark-charcoal font-medium">
          💡 Small changes in daily habits can give you years of life back. 
          What would you do with an extra {(totalYearsLost * 0.5).toFixed(1)} years?
        </p>
      </motion.div>
    </motion.div>
  );
}