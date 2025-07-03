import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Zap, Target, Award, Crown, Flame, Calendar, BookOpen, Heart, Globe, Mountain, Rocket, Diamond, Shield, Sunrise } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  emoji: string;
  deadline: string;
  category: string;
  is_completed: boolean;
  created_at: string;
}

interface GamifiedGoalTrackingProps {
  goals: Goal[];
  completedGoals: number;
}

const badges = [
  // Basic Achievement Badges
  {
    id: 'first_goal',
    name: 'Goal Setter',
    description: 'Created your first goal',
    icon: Target,
    color: '#4CAF50',
    requirement: 1,
    type: 'goals_created'
  },
  {
    id: 'goal_master',
    name: 'Goal Master',
    description: 'Created 5 goals',
    icon: Star,
    color: '#FFA500',
    requirement: 5,
    type: 'goals_created'
  },
  {
    id: 'goal_architect',
    name: 'Goal Architect',
    description: 'Created 10 goals',
    icon: Crown,
    color: '#9C27B0',
    requirement: 10,
    type: 'goals_created'
  },
  {
    id: 'visionary',
    name: 'Visionary',
    description: 'Created 25 goals',
    icon: Diamond,
    color: '#E91E63',
    requirement: 25,
    type: 'goals_created'
  },

  // Completion Badges
  {
    id: 'achiever',
    name: 'Achiever',
    description: 'Completed your first goal',
    icon: Trophy,
    color: '#FFD700',
    requirement: 1,
    type: 'goals_completed'
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Completed 3 goals',
    icon: Award,
    color: '#FF6B6B',
    requirement: 3,
    type: 'goals_completed'
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Completed 10 goals',
    icon: Crown,
    color: '#8B5CF6',
    requirement: 10,
    type: 'goals_completed'
  },
  {
    id: 'time_master',
    name: 'Time Master',
    description: 'Completed 25 goals',
    icon: Rocket,
    color: '#06B6D4',
    requirement: 25,
    type: 'goals_completed'
  },

  // Engagement & Consistency Badges
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Active for 7 consecutive days',
    icon: Flame,
    color: '#FF5722',
    requirement: 7,
    type: 'consecutive_days'
  },
  {
    id: 'month_master',
    name: 'Month Master',
    description: 'Active for 30 days',
    icon: Calendar,
    color: '#18C3B9',
    requirement: 30,
    type: 'total_days'
  },
  {
    id: 'year_champion',
    name: 'Year Champion',
    description: 'Active for 365 days',
    icon: Sunrise,
    color: '#F59E0B',
    requirement: 365,
    type: 'total_days'
  },

  // Category-Specific Badges
  {
    id: 'health_hero',
    name: 'Health Hero',
    description: 'Completed 5 health goals',
    icon: Heart,
    color: '#EF4444',
    requirement: 5,
    type: 'category_health'
  },
  {
    id: 'learning_legend',
    name: 'Learning Legend',
    description: 'Completed 5 learning goals',
    icon: BookOpen,
    color: '#3B82F6',
    requirement: 5,
    type: 'category_learning'
  },
  {
    id: 'adventure_seeker',
    name: 'Adventure Seeker',
    description: 'Completed 3 travel goals',
    icon: Globe,
    color: '#10B981',
    requirement: 3,
    type: 'category_travel'
  },

  // Long-term Engagement Badges (5+ years)
  {
    id: 'life_transformer',
    name: 'Life Transformer',
    description: 'Active for 5 years',
    icon: Shield,
    color: '#7C3AED',
    requirement: 1825, // 5 years in days
    type: 'total_days'
  },
  {
    id: 'mountain_mover',
    name: 'Mountain Mover',
    description: 'Completed 100 goals',
    icon: Mountain,
    color: '#059669',
    requirement: 100,
    type: 'goals_completed'
  },
  {
    id: 'time_sage',
    name: 'Time Sage',
    description: 'Maintained 90% completion rate with 50+ goals',
    icon: Crown,
    color: '#DC2626',
    requirement: 90,
    type: 'completion_rate_with_volume'
  },
  {
    id: 'consistency_king',
    name: 'Consistency King',
    description: 'Completed goals for 12 consecutive months',
    icon: Diamond,
    color: '#7C2D12',
    requirement: 12,
    type: 'consecutive_months'
  },
  {
    id: 'inspiration_icon',
    name: 'Inspiration Icon',
    description: 'Shared 25 success stories',
    icon: Zap,
    color: '#BE185D',
    requirement: 25,
    type: 'shares'
  }
];

const levels = [
  { level: 1, name: 'Dreamer', xpRequired: 0, color: '#4CAF50' },
  { level: 2, name: 'Planner', xpRequired: 100, color: '#2196F3' },
  { level: 3, name: 'Achiever', xpRequired: 300, color: '#FFA500' },
  { level: 4, name: 'Champion', xpRequired: 600, color: '#9C27B0' },
  { level: 5, name: 'Master', xpRequired: 1000, color: '#E91E63' },
  { level: 6, name: 'Legend', xpRequired: 1500, color: '#FFD700' },
  { level: 7, name: 'Sage', xpRequired: 2500, color: '#8B5CF6' },
  { level: 8, name: 'Titan', xpRequired: 4000, color: '#06B6D4' },
  { level: 9, name: 'Immortal', xpRequired: 6000, color: '#DC2626' },
  { level: 10, name: 'Time God', xpRequired: 10000, color: '#7C2D12' }
];

export default function GamifiedGoalTracking({ goals, completedGoals }: GamifiedGoalTrackingProps) {
  const [currentXP, setCurrentXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    totalDays: 1, // Simulate user has been active for at least 1 day
    consecutiveDays: 1,
    consecutiveMonths: 1,
    shares: 0
  });

  // Calculate XP based on goals
  useEffect(() => {
    const xp = (goals.length * 20) + (completedGoals * 50);
    setCurrentXP(xp);

    // Determine current level
    const level = levels.reduce((acc, level) => {
      return xp >= level.xpRequired ? level : acc;
    }, levels[0]);
    setCurrentLevel(level.level);
  }, [goals.length, completedGoals]);

  // Calculate category-specific completions
  const getCategoryCompletions = (category: string) => {
    return goals.filter(goal => 
      goal.is_completed && 
      goal.category.toLowerCase() === category.toLowerCase()
    ).length;
  };

  // Calculate completion rate
  const getCompletionRate = () => {
    if (goals.length === 0) return 0;
    return (completedGoals / goals.length) * 100;
  };

  // Check for badge unlocks with proper validation
  useEffect(() => {
    const checkBadges = () => {
      const newUnlocked: string[] = [];

      badges.forEach(badge => {
        // Skip if already unlocked
        if (unlockedBadges.includes(badge.id)) {
          return;
        }

        let shouldUnlock = false;

        switch (badge.type) {
          case 'goals_created':
            shouldUnlock = goals.length >= badge.requirement;
            break;
          
          case 'goals_completed':
            shouldUnlock = completedGoals >= badge.requirement;
            break;
          
          case 'consecutive_days':
            shouldUnlock = userStats.consecutiveDays >= badge.requirement;
            break;
          
          case 'total_days':
            shouldUnlock = userStats.totalDays >= badge.requirement;
            break;
          
          case 'category_health':
            shouldUnlock = getCategoryCompletions('health') >= badge.requirement;
            break;
          
          case 'category_learning':
            shouldUnlock = getCategoryCompletions('learning') >= badge.requirement;
            break;
          
          case 'category_travel':
            shouldUnlock = getCategoryCompletions('travel') >= badge.requirement;
            break;
          
          case 'completion_rate_with_volume':
            shouldUnlock = goals.length >= 50 && getCompletionRate() >= badge.requirement;
            break;
          
          case 'consecutive_months':
            shouldUnlock = userStats.consecutiveMonths >= badge.requirement;
            break;
          
          case 'shares':
            shouldUnlock = userStats.shares >= badge.requirement;
            break;
          
          default:
            shouldUnlock = false;
        }

        if (shouldUnlock) {
          newUnlocked.push(badge.id);
        }
      });

      if (newUnlocked.length > 0) {
        setUnlockedBadges(prev => {
          const updated = [...prev, ...newUnlocked];
          // Show notification for the first newly unlocked badge
          if (newUnlocked.length > 0) {
            setNewlyUnlockedBadge(newUnlocked[0]);
            // Clear the notification after 4 seconds
            setTimeout(() => setNewlyUnlockedBadge(null), 4000);
          }
          return updated;
        });
      }
    };

    checkBadges();
  }, [goals.length, completedGoals, unlockedBadges, userStats]);

  const currentLevelData = levels.find(l => l.level === currentLevel) || levels[0];
  const nextLevelData = levels.find(l => l.level === currentLevel + 1);
  const progressToNextLevel = nextLevelData 
    ? ((currentXP - currentLevelData.xpRequired) / (nextLevelData.xpRequired - currentLevelData.xpRequired)) * 100
    : 100;

  // Get badge progress for locked badges
  const getBadgeProgress = (badge: typeof badges[0]) => {
    switch (badge.type) {
      case 'goals_created':
        return Math.min(100, (goals.length / badge.requirement) * 100);
      case 'goals_completed':
        return Math.min(100, (completedGoals / badge.requirement) * 100);
      case 'consecutive_days':
        return Math.min(100, (userStats.consecutiveDays / badge.requirement) * 100);
      case 'total_days':
        return Math.min(100, (userStats.totalDays / badge.requirement) * 100);
      case 'category_health':
        return Math.min(100, (getCategoryCompletions('health') / badge.requirement) * 100);
      case 'category_learning':
        return Math.min(100, (getCategoryCompletions('learning') / badge.requirement) * 100);
      case 'category_travel':
        return Math.min(100, (getCategoryCompletions('travel') / badge.requirement) * 100);
      case 'completion_rate_with_volume':
        if (goals.length < 50) return (goals.length / 50) * 50; // 50% for volume, 50% for rate
        return 50 + Math.min(50, (getCompletionRate() / badge.requirement) * 50);
      case 'consecutive_months':
        return Math.min(100, (userStats.consecutiveMonths / badge.requirement) * 100);
      case 'shares':
        return Math.min(100, (userStats.shares / badge.requirement) * 100);
      default:
        return 0;
    }
  };

  // Calculate actual unlocked badges count
  const actualUnlockedCount = unlockedBadges.length;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
          Your Achievement Dashboard
        </h3>
        <p className="font-inter text-body-sm text-snow-white/80">
          Level up by creating and completing goals!
        </p>
      </div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-soft-purple-gray to-dark-charcoal rounded-2xl p-6 border border-electric-orange"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-dark-charcoal"
              style={{ backgroundColor: currentLevelData.color }}
            >
              {currentLevel}
            </div>
            <div>
              <h4 className="font-space-grotesk font-bold text-xl text-snow-white">
                Level {currentLevel}: {currentLevelData.name}
              </h4>
              <p className="font-inter text-sm text-snow-white/80">
                {currentXP} XP {nextLevelData && `• ${nextLevelData.xpRequired - currentXP} XP to next level`}
              </p>
            </div>
          </div>
          <Star className="h-8 w-8 text-electric-orange" />
        </div>

        {/* Progress Bar */}
        {nextLevelData && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-snow-white/80">Progress to {nextLevelData.name}</span>
              <span className="text-electric-orange font-bold">{Math.round(progressToNextLevel)}%</span>
            </div>
            <div className="h-3 bg-soft-purple-gray rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-digital-teal to-electric-orange"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextLevel}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* XP Breakdown */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-soft-purple-gray rounded-xl p-4 text-center">
          <Target className="h-6 w-6 text-digital-teal mx-auto mb-2" />
          <div className="font-space-grotesk font-bold text-xl text-snow-white">
            {goals.length}
          </div>
          <div className="font-inter text-sm text-snow-white/80">Goals Created</div>
          <div className="font-inter text-xs text-digital-teal">+{goals.length * 20} XP</div>
        </div>

        <div className="bg-soft-purple-gray rounded-xl p-4 text-center">
          <Trophy className="h-6 w-6 text-warm-gold mx-auto mb-2" />
          <div className="font-space-grotesk font-bold text-xl text-snow-white">
            {completedGoals}
          </div>
          <div className="font-inter text-sm text-snow-white/80">Goals Completed</div>
          <div className="font-inter text-xs text-warm-gold">+{completedGoals * 50} XP</div>
        </div>

        <div className="bg-soft-purple-gray rounded-xl p-4 text-center">
          <Zap className="h-6 w-6 text-electric-orange mx-auto mb-2" />
          <div className="font-space-grotesk font-bold text-xl text-snow-white">
            {currentXP}
          </div>
          <div className="font-inter text-sm text-snow-white/80">Total XP</div>
          <div className="font-inter text-xs text-electric-orange">Keep going!</div>
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <h4 className="font-space-grotesk font-semibold text-lg text-snow-white">
          Achievement Badges ({actualUnlockedCount}/{badges.length})
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge, index) => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            const IconComponent = badge.icon;
            const progress = getBadgeProgress(badge);
            
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={`relative p-4 rounded-xl text-center transition-all duration-300 ${
                  isUnlocked 
                    ? 'bg-gradient-to-br from-electric-orange/20 to-warm-gold/20 border border-electric-orange' 
                    : 'bg-soft-purple-gray/50 border border-soft-purple-gray'
                }`}
              >
                {/* Glow effect for unlocked badges */}
                {isUnlocked && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ 
                      background: `radial-gradient(circle, ${badge.color}20, transparent)`,
                      filter: 'blur(8px)'
                    }}
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                )}
                
                <div className="relative z-10 space-y-2">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                      isUnlocked ? 'text-dark-charcoal' : 'text-snow-white/40'
                    }`}
                    style={{ 
                      backgroundColor: isUnlocked ? badge.color : '#2D2B4A'
                    }}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  <div>
                    <h5 className={`font-space-grotesk font-bold text-sm ${
                      isUnlocked ? 'text-snow-white' : 'text-snow-white/60'
                    }`}>
                      {badge.name}
                    </h5>
                    <p className={`font-inter text-xs ${
                      isUnlocked ? 'text-snow-white/80' : 'text-snow-white/40'
                    }`}>
                      {badge.description}
                    </p>
                  </div>

                  {/* Progress bar for locked badges */}
                  {!isUnlocked && progress > 0 && (
                    <div className="space-y-1">
                      <div className="h-1 bg-dark-charcoal rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-digital-teal to-electric-orange"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <div className="font-inter text-xs text-snow-white/60">
                        {Math.round(progress)}% complete
                      </div>
                    </div>
                  )}

                  {/* Lock overlay for completely locked badges */}
                  {!isUnlocked && progress === 0 && (
                    <div className="absolute inset-0 bg-dark-charcoal/60 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl mb-1">🔒</div>
                        <div className="font-inter text-xs text-snow-white/80">
                          {badge.requirement} {badge.type.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Badge Unlock Notification */}
      <AnimatePresence>
        {newlyUnlockedBadge && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-electric-orange to-warm-gold rounded-2xl p-6 shadow-2xl z-50 max-w-sm border border-electric-orange"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🎉</div>
              <div>
                <h4 className="font-space-grotesk font-bold text-dark-charcoal">
                  Badge Unlocked!
                </h4>
                <p className="font-inter text-sm text-dark-charcoal/80">
                  {badges.find(b => b.id === newlyUnlockedBadge)?.name}
                </p>
                <p className="font-inter text-xs text-dark-charcoal/70">
                  {badges.find(b => b.id === newlyUnlockedBadge)?.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivational section for long-term engagement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-gradient-to-r from-digital-teal/20 to-electric-orange/20 rounded-2xl p-6 text-center border border-digital-teal"
      >
        <Rocket className="h-8 w-8 text-digital-teal mx-auto mb-3" />
        <h4 className="font-space-grotesk font-bold text-lg text-snow-white mb-2">
          Your Journey to Time Mastery
        </h4>
        <p className="font-inter text-sm text-snow-white/90 mb-4">
          Every goal completed, every badge earned, every level gained brings you closer to becoming a true Time Master. 
          Keep building momentum - your future self will thank you!
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-space-grotesk font-bold text-digital-teal">
              {Math.round(getCompletionRate())}%
            </div>
            <div className="text-snow-white/70">Success Rate</div>
          </div>
          <div>
            <div className="font-space-grotesk font-bold text-electric-orange">
              {actualUnlockedCount}
            </div>
            <div className="text-snow-white/70">Badges Earned</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}