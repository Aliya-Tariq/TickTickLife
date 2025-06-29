import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface SummaryStatCardsProps {
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

export default function SummaryStatCards({ lifeExpectancy, currentAge, habits }: SummaryStatCardsProps) {
  const remainingYears = lifeExpectancy - currentAge;
  
  const calculateYearsSpent = (dailyHours: number) => {
    return (dailyHours * 365 * remainingYears) / (24 * 365);
  };

  const stats = [
    {
      icon: '😴',
      title: 'Sleep Time',
      years: calculateYearsSpent(habits.sleeping),
      gradient: 'from-blue-500 to-blue-600',
      description: 'Years you\'ll spend sleeping',
      severity: 'neutral'
    },
    {
      icon: '📱',
      title: 'Scrolling Void',
      years: calculateYearsSpent(habits.scrolling),
      gradient: 'from-red-500 to-pink-500',
      description: 'Years lost to mindless scrolling',
      severity: habits.scrolling > 3 ? 'high' : habits.scrolling > 1.5 ? 'medium' : 'low'
    },
    {
      icon: '💼',
      title: 'Work Grind',
      years: calculateYearsSpent(habits.working),
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Years dedicated to work/study',
      severity: 'neutral'
    },
    {
      icon: '🍿',
      title: 'Entertainment',
      years: calculateYearsSpent(habits.netflix),
      gradient: 'from-purple-500 to-indigo-500',
      description: 'Years of Netflix & entertainment',
      severity: habits.netflix > 4 ? 'high' : habits.netflix > 2 ? 'medium' : 'low'
    },
    {
      icon: '🧠',
      title: 'Conscious Time',
      years: Math.max(0, remainingYears - Object.values(habits).reduce((sum, h) => sum + calculateYearsSpent(h), 0)),
      gradient: 'from-green-500 to-emerald-500',
      description: 'Your precious aware living time',
      severity: 'positive'
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-400" />;
      default: return null;
    }
  };

  const getSeverityMessage = (stat: typeof stats[0]) => {
    if (stat.title === 'Scrolling Void' && stat.years > 3) {
      return '🚨 This is stealing your life!';
    }
    if (stat.title === 'Entertainment' && stat.years > 5) {
      return '⚠️ Consider reducing binge time';
    }
    if (stat.title === 'Conscious Time' && stat.years < remainingYears * 0.2) {
      return '😱 You need more aware time!';
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
          Your Life Summary
        </h3>
        <p className="font-inter text-body-sm text-snow-white/80">
          Where your remaining {remainingYears} years will go
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.15, 
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${stat.gradient} shadow-lg cursor-pointer group`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-12 translate-y-12" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{stat.icon}</span>
                {getSeverityIcon(stat.severity)}
              </div>

              <div className="space-y-2">
                <h4 className="font-space-grotesk font-bold text-lg text-white">
                  {stat.title}
                </h4>
                <div className="font-space-grotesk font-black text-3xl text-white">
                  {stat.years.toFixed(1)} <span className="text-lg font-medium">years</span>
                </div>
                <p className="font-inter text-sm text-white/90">
                  {stat.description}
                </p>
              </div>

              {getSeverityMessage(stat) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 + 0.5 }}
                  className="bg-white/20 rounded-xl p-3 text-center"
                >
                  <p className="font-inter text-xs text-white font-medium">
                    {getSeverityMessage(stat)}
                  </p>
                </motion.div>
              )}

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="bg-gradient-to-r from-electric-orange to-warm-gold rounded-3xl p-6 text-center"
      >
        <div className="text-3xl mb-3">💡</div>
        <h4 className="font-space-grotesk font-bold text-xl text-dark-charcoal mb-2">
          Time Reality Check
        </h4>
        <p className="font-inter text-dark-charcoal/90">
          Out of your {remainingYears} remaining years, you'll spend{' '}
          <span className="font-bold">
            {(calculateYearsSpent(habits.scrolling) + calculateYearsSpent(habits.netflix)).toFixed(1)} years
          </span>{' '}
          on screens. What could you create with that time instead?
        </p>
      </motion.div>
    </div>
  );
}