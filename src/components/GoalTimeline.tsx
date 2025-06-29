import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { format, differenceInDays, differenceInYears } from 'date-fns';
import { Goal } from '@/lib/supabase';

interface GoalTimelineProps {
  goals: Goal[];
  currentAge: number;
  lifeExpectancy: number;
  onGoalComplete: (goalId: string) => void;
}

export default function GoalTimeline({ goals, currentAge, lifeExpectancy, onGoalComplete }: GoalTimelineProps) {
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sortedGoals = [...goals].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  const remainingYears = lifeExpectancy - currentAge;
  const currentDate = new Date();

  // Enable horizontal scrolling with mouse wheel
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const getTimelinePosition = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const totalTimespan = remainingYears * 365; // Total days remaining
    const daysUntilDeadline = differenceInDays(deadlineDate, currentDate);
    return Math.min(100, Math.max(0, (daysUntilDeadline / totalTimespan) * 100));
  };

  const getCriticalityColor = (deadline: string) => {
    const daysUntil = differenceInDays(new Date(deadline), currentDate);
    if (daysUntil < 30) return '#FF4444'; // Red - urgent
    if (daysUntil < 365) return '#FFA500'; // Orange - soon
    if (daysUntil < 365 * 3) return '#FFAA00'; // Yellow - medium term
    return '#4CAF50'; // Green - long term
  };

  const getUrgencyLabel = (deadline: string) => {
    const daysUntil = differenceInDays(new Date(deadline), currentDate);
    if (daysUntil < 0) return 'Overdue';
    if (daysUntil < 30) return 'Urgent';
    if (daysUntil < 365) return 'This Year';
    if (daysUntil < 365 * 3) return 'Medium Term';
    return 'Long Term';
  };

  if (goals.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <Target className="h-16 w-16 text-soft-purple-gray mx-auto" />
        <h3 className="font-space-grotesk font-bold text-xl text-snow-white">
          No Goals Yet
        </h3>
        <p className="font-inter text-snow-white/80">
          Create your first goal to see your timeline
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white">
          Your Life Goal Timeline
        </h3>
        <p className="font-inter text-body-sm text-snow-white/80">
          Scroll horizontally to explore your goals across your remaining {remainingYears} years
        </p>
      </div>

      {/* Timeline Container with horizontal scroll */}
      <div className="relative bg-soft-purple-gray rounded-2xl p-6">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-electric-orange scrollbar-track-soft-purple-gray"
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className="relative min-w-[1200px] h-32">
            {/* Timeline Base Line */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-digital-teal via-electric-orange to-warm-gold rounded-full" />
            
            {/* Year Markers */}
            <div className="absolute top-20 left-0 right-0 flex justify-between">
              {Array.from({ length: Math.min(remainingYears, 15) + 1 }, (_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-snow-white rounded-full" />
                  <span className="font-inter text-xs text-snow-white/60 mt-1">
                    {currentAge + i}
                  </span>
                </div>
              ))}
            </div>

            {/* Goals on Timeline */}
            {sortedGoals.map((goal, index) => {
              const position = getTimelinePosition(goal.deadline);
              const criticalityColor = getCriticalityColor(goal.deadline);
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="absolute cursor-pointer"
                  style={{ 
                    left: `${position}%`,
                    top: position < 50 ? '0px' : '4px',
                    transform: 'translateX(-50%)'
                  }}
                  onMouseEnter={() => setHoveredGoal(goal.id)}
                  onMouseLeave={() => setHoveredGoal(null)}
                  onClick={() => !goal.is_completed && onGoalComplete(goal.id)}
                >
                  {/* Goal Marker */}
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="relative"
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg ${
                        goal.is_completed ? 'bg-green-500' : ''
                      }`}
                      style={{ backgroundColor: goal.is_completed ? '#4CAF50' : criticalityColor }}
                    >
                      {goal.is_completed ? (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      ) : (
                        goal.emoji
                      )}
                    </div>
                    
                    {/* Connection Line */}
                    <div 
                      className="absolute top-8 left-1/2 w-0.5 h-6 transform -translate-x-1/2"
                      style={{ backgroundColor: goal.is_completed ? '#4CAF50' : criticalityColor }}
                    />
                  </motion.div>

                  {/* Hover Tooltip */}
                  {hoveredGoal === goal.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-dark-charcoal border border-electric-orange rounded-xl p-4 shadow-lg z-10 min-w-48"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{goal.emoji}</span>
                          <span className="font-space-grotesk font-bold text-snow-white">
                            {goal.title}
                          </span>
                          {goal.is_completed && (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-2 text-snow-white/80">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(goal.deadline), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-snow-white/80">
                            <Clock className="h-3 w-3" />
                            <span>{differenceInDays(new Date(goal.deadline), currentDate)} days left</span>
                          </div>
                          <div 
                            className="font-inter font-bold"
                            style={{ color: goal.is_completed ? '#4CAF50' : criticalityColor }}
                          >
                            {goal.is_completed ? 'Completed!' : getUrgencyLabel(goal.deadline)}
                          </div>
                        </div>
                        {!goal.is_completed && (
                          <div className="text-xs text-digital-teal">
                            Click to mark as completed
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="flex justify-center mt-4">
          <div className="text-xs text-snow-white/60 flex items-center space-x-2">
            <span>←</span>
            <span>Scroll horizontally to explore timeline</span>
            <span>→</span>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        <h4 className="font-space-grotesk font-semibold text-lg text-snow-white">
          Upcoming Goals
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sortedGoals.slice(0, 8).map((goal, index) => {
            const criticalityColor = getCriticalityColor(goal.deadline);
            const daysUntil = differenceInDays(new Date(goal.deadline), currentDate);
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`flex items-center justify-between bg-soft-purple-gray rounded-xl p-4 hover:bg-soft-purple-gray/80 transition-colors cursor-pointer ${
                  goal.is_completed ? 'opacity-75' : ''
                }`}
                onClick={() => !goal.is_completed && onGoalComplete(goal.id)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                    style={{ backgroundColor: goal.is_completed ? '#4CAF50' : criticalityColor }}
                  >
                    {goal.is_completed ? (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    ) : (
                      goal.emoji
                    )}
                  </div>
                  <div>
                    <div className={`font-space-grotesk font-semibold text-snow-white ${
                      goal.is_completed ? 'line-through' : ''
                    }`}>
                      {goal.title}
                    </div>
                    <div className="font-inter text-sm text-snow-white/70">
                      {format(new Date(goal.deadline), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    className="font-space-grotesk font-bold text-sm"
                    style={{ color: goal.is_completed ? '#4CAF50' : criticalityColor }}
                  >
                    {goal.is_completed ? 'Done!' : daysUntil > 0 ? `${daysUntil}d` : 'Overdue'}
                  </div>
                  <div className="font-inter text-xs text-snow-white/60">
                    {goal.is_completed ? 'Completed' : getUrgencyLabel(goal.deadline)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500 rounded-xl p-4 text-center">
          <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <div className="font-space-grotesk font-bold text-xl text-snow-white">
            {goals.filter(g => !g.is_completed).length}
          </div>
          <div className="font-inter text-sm text-snow-white/80">Active Goals</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500 rounded-xl p-4 text-center">
          <Clock className="h-6 w-6 text-orange-400 mx-auto mb-2" />
          <div className="font-space-grotesk font-bold text-xl text-snow-white">
            {goals.filter(g => differenceInDays(new Date(g.deadline), currentDate) < 365 && !g.is_completed).length}
          </div>
          <div className="font-inter text-sm text-snow-white/80">This Year</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500 rounded-xl p-4 text-center">
          <Target className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <div className="font-space-grotesk font-bold text-xl text-snow-white">
            {goals.length > 0 ? Math.round((goals.filter(g => g.is_completed).length / goals.length) * 100) : 0}%
          </div>
          <div className="font-inter text-sm text-snow-white/80">Completion Rate</div>
        </div>
      </motion.div>
    </div>
  );
}