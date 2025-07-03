import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Target, Calendar, TrendingUp, ArrowRight, Sparkles, Trophy, ChevronDown } from 'lucide-react';
import GoalWizardModal from './GoalWizardModal';
import MotivationalMicrocards from './MotivationalMicrocards';
import GoalTimeline from './GoalTimeline';
import AutoSuggestionsPanel from './AutoSuggestionsPanel';
import GamifiedGoalTracking from './GamifiedGoalTracking';
import GoalCompletionModal from './GoalCompletionModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Goal } from '@/lib/supabase';
import { toast } from 'sonner';

interface GoalManagementSectionProps {
  birthDate: Date;
  lifeExpectancy: number;
  consciousYears: number;
  onComplete?: () => void;
}

export default function GoalManagementSection({ 
  birthDate, 
  lifeExpectancy, 
  consciousYears,
  onComplete 
}: GoalManagementSectionProps) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'suggestions' | 'achievements'>('overview');
  const [showSimulatorCTA, setShowSimulatorCTA] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const currentAge = new Date().getFullYear() - birthDate.getFullYear();
  const completedGoals = goals.filter(g => g.is_completed).length;

  // Load goals from Supabase
  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleGoalCreated = async (goalData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([{
          user_id: user.id,
          title: goalData.title,
          emoji: goalData.emoji,
          category: goalData.category,
          deadline: goalData.deadline.toISOString(),
          is_completed: false
        }])
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
      
      // Show encouragement for first goal
      if (goals.length === 0) {
        setShowEncouragement(true);
        setTimeout(() => setShowEncouragement(false), 5000);
      }
      
      // Show simulator CTA after creating a few goals
      if (goals.length >= 2) {
        setTimeout(() => setShowSimulatorCTA(true), 2000);
      }

      toast.success('Goal created successfully!');
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const handleGoalComplete = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal && !goal.is_completed) {
      setSelectedGoal(goal);
      setShowCompletionModal(true);
    }
  };

  const handleGoalCompletion = async (goalId: string, responses: any) => {
    if (!user) return;

    try {
      // Update goal as completed
      const { error: goalError } = await supabase
        .from('goals')
        .update({ 
          is_completed: true,
          completion_data: responses
        })
        .eq('id', goalId);

      if (goalError) throw goalError;

      // Save reflection data
      const { error: reflectionError } = await supabase
        .from('reflections')
        .insert([{
          goal_id: goalId,
          user_id: user.id,
          responses: responses
        }]);

      if (reflectionError) throw reflectionError;

      // Update local state
      setGoals(prev => prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, is_completed: true, completion_data: responses }
          : goal
      ));

      // Update user stats
      await updateUserStats();

      toast.success('🎉 Goal completed! Great job on your achievement!');
    } catch (error) {
      console.error('Error completing goal:', error);
      toast.error('Failed to complete goal');
    }
  };

  const updateUserStats = async () => {
    if (!user) return;

    try {
      const totalGoals = goals.length;
      const completed = goals.filter(g => g.is_completed).length + 1; // +1 for the just completed goal
      const successRate = totalGoals > 0 ? (completed / totalGoals) * 100 : 0;

      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          goals_completed: completed,
          total_goals: totalGoals,
          success_rate: successRate,
          years_saved: consciousYears // This could be calculated based on goal impact
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const handleSuggestionSelect = async (suggestion: any) => {
    const goalData = {
      title: suggestion.title,
      emoji: suggestion.icon,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      category: suggestion.category
    };
    
    await handleGoalCreated(goalData);
    setActiveTab('timeline');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'suggestions', label: 'Suggestions', icon: Plus },
    { id: 'achievements', label: 'Achievements', icon: TrendingUp }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as any);
    setMobileDropdownOpen(false);
  };

  if (loading) {
    return (
      <section className="py-20 px-6 bg-gradient-to-b from-dark-charcoal to-soft-purple-gray">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-orange mx-auto"></div>
          <p className="mt-4 text-snow-white/80">Loading your goals...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-dark-charcoal to-soft-purple-gray">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="font-space-grotesk font-bold text-display text-snow-white">
            Goal Management
          </h2>
          <p className="font-inter text-body-lg text-snow-white/80 max-w-3xl mx-auto">
            With {consciousYears.toFixed(1)} conscious years remaining, every goal matters. 
            Create meaningful objectives that will make your time count.
          </p>
        </motion.div>

        {/* Encouragement Message for First Goal */}
        {showEncouragement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 shadow-2xl border border-green-400 max-w-md mx-4"
          >
            <div className="text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <h3 className="font-space-grotesk font-bold text-xl text-white">
                You're Finally Getting Your Life Back!
              </h3>
              <p className="font-inter text-white/90">
                You've taken the first step to steal your life back from mindless habits. 
                This is the beginning of your conscious living journey!
              </p>
              <div className="flex items-center justify-center space-x-2 text-white/80">
                <Sparkles className="h-4 w-4" />
                <span className="font-inter text-sm">Every goal brings you closer to freedom</span>
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          <div className="bg-gradient-to-br from-digital-teal/20 to-digital-teal/10 border border-digital-teal rounded-2xl p-4 md:p-6 text-center">
            <Target className="h-6 w-6 md:h-8 md:w-8 text-digital-teal mx-auto mb-2 md:mb-3" />
            <div className="font-space-grotesk font-bold text-xl md:text-2xl text-snow-white">
              {goals.length}
            </div>
            <div className="font-inter text-xs md:text-sm text-snow-white/80">Active Goals</div>
          </div>

          <div className="bg-gradient-to-br from-warm-gold/20 to-warm-gold/10 border border-warm-gold rounded-2xl p-4 md:p-6 text-center">
            <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-warm-gold mx-auto mb-2 md:mb-3" />
            <div className="font-space-grotesk font-bold text-xl md:text-2xl text-snow-white">
              {completedGoals}
            </div>
            <div className="font-inter text-xs md:text-sm text-snow-white/80">Completed</div>
          </div>

          <div className="bg-gradient-to-br from-electric-orange/20 to-electric-orange/10 border border-electric-orange rounded-2xl p-4 md:p-6 text-center">
            <Calendar className="h-6 w-6 md:h-8 md:w-8 text-electric-orange mx-auto mb-2 md:mb-3" />
            <div className="font-space-grotesk font-bold text-xl md:text-2xl text-snow-white">
              {consciousYears.toFixed(1)}
            </div>
            <div className="font-inter text-xs md:text-sm text-snow-white/80">Years Left</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500 rounded-2xl p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl mb-2 md:mb-3">🎯</div>
            <div className="font-space-grotesk font-bold text-xl md:text-2xl text-snow-white">
              {goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0}%
            </div>
            <div className="font-inter text-xs md:text-sm text-snow-white/80">Success Rate</div>
          </div>
        </motion.div>

        {/* Create Goal Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => setShowWizard(true)}
            className={`text-base md:text-lg px-6 md:px-8 py-3 md:py-4 ${goals.length === 0 ? 'animate-pulse-glow btn-primary' : 'btn-primary'}`}
          >
            <Plus className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            {goals.length === 0 ? 'Create Your First Goal' : 'Create More Goals'}
          </Button>
        </motion.div>

        {/* Tab Navigation - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="w-full"
        >
          {/* Desktop Tab Navigation */}
          <div className="hidden md:flex justify-center">
            <div className="bg-soft-purple-gray rounded-2xl p-2 flex space-x-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-electric-orange text-dark-charcoal'
                        : 'text-snow-white hover:bg-dark-charcoal'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="font-space-grotesk font-semibold">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Tab Navigation - Dropdown */}
          <div className="md:hidden">
            <div className="relative">
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="w-full bg-soft-purple-gray rounded-2xl p-4 flex items-center justify-between text-snow-white"
              >
                <div className="flex items-center space-x-3">
                  {activeTabData && (
                    <>
                      <activeTabData.icon className="h-5 w-5 text-electric-orange" />
                      <span className="font-space-grotesk font-semibold text-lg">
                        {activeTabData.label}
                      </span>
                    </>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: mobileDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </button>

              {/* Mobile Dropdown Menu */}
              {mobileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-soft-purple-gray rounded-2xl border border-snow-white/10 shadow-lg z-10"
                >
                  <div className="p-2 space-y-1">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-electric-orange text-dark-charcoal'
                              : 'text-snow-white hover:bg-dark-charcoal'
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span className="font-space-grotesk font-semibold">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-[400px]"
        >
          {activeTab === 'overview' && (
            <MotivationalMicrocards
              consciousYears={consciousYears}
              totalRemainingYears={lifeExpectancy - currentAge}
            />
          )}

          {activeTab === 'timeline' && (
            <GoalTimeline
              goals={goals}
              currentAge={currentAge}
              lifeExpectancy={lifeExpectancy}
              onGoalComplete={handleGoalComplete}
            />
          )}

          {activeTab === 'suggestions' && (
            <AutoSuggestionsPanel
              currentAge={currentAge}
              consciousYears={consciousYears}
              onSuggestionSelect={handleSuggestionSelect}
            />
          )}

          {activeTab === 'achievements' && (
            <GamifiedGoalTracking
              goals={goals}
              completedGoals={completedGoals}
            />
          )}
        </motion.div>

        {/* What If Simulator CTA */}
        {showSimulatorCTA && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="bg-gradient-to-r from-electric-orange/20 to-warm-gold/20 rounded-3xl p-6 md:p-8 border border-electric-orange">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="font-space-grotesk font-bold text-xl md:text-2xl text-snow-white mb-4">
                Ready to Optimize Your Life?
              </h3>
              <p className="font-inter text-base md:text-lg text-snow-white/90 mb-6 max-w-2xl mx-auto">
                You've set your goals. Now discover how changing your daily habits could give you 
                even more time to achieve them. Try our "What If?" simulator!
              </p>
              <Button
                onClick={onComplete}
                className="btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 animate-pulse-glow"
              >
                <span>Simulate Different Habits</span>
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Goal Wizard Modal */}
        <GoalWizardModal
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          onGoalCreated={handleGoalCreated}
        />

        {/* Goal Completion Modal */}
        <GoalCompletionModal
          goal={selectedGoal}
          isOpen={showCompletionModal}
          onClose={() => {
            setShowCompletionModal(false);
            setSelectedGoal(null);
          }}
          onComplete={handleGoalCompletion}
        />
      </div>
    </section>
  );
}