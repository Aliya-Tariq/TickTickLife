import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Save, Share2, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import HabitSimulatorSliders from './HabitSimulatorSliders';
import BeforeAfterComparison from './BeforeAfterComparison';
import EmotionMeter from './EmotionMeter';
import ActionSuggestions from './ActionSuggestions';
import { toast } from 'sonner';

interface WhatIfSimulatorSectionProps {
  birthDate: Date;
  lifeExpectancy: number;
  originalHabits: {
    sleeping: number;
    scrolling: number;
    eating: number;
    working: number;
    netflix: number;
    commuting: number;
  };
  onComplete?: (optimizedHabits: any, goalsCreated: number) => void;
}

export default function WhatIfSimulatorSection({ 
  birthDate, 
  lifeExpectancy, 
  originalHabits,
  onComplete 
}: WhatIfSimulatorSectionProps) {
  const [simulatedHabits, setSimulatedHabits] = useState(originalHabits);
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showFinalCTA, setShowFinalCTA] = useState(false);

  const currentAge = new Date().getFullYear() - birthDate.getFullYear();
  const remainingYears = lifeExpectancy - currentAge;

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

  const handleHabitChange = (habit: string, value: number) => {
    setSimulatedHabits(prev => ({
      ...prev,
      [habit]: value
    }));
  };

  const handleReset = () => {
    setSimulatedHabits(originalHabits);
    setShowResults(false);
    toast.success('Habits reset to original values');
  };

  const handleSaveScenario = () => {
    const scenario = {
      id: Date.now(),
      name: `Scenario ${savedScenarios.length + 1}`,
      habits: { ...simulatedHabits },
      timeReclaimed,
      consciousTime: simulatedConsciousTime,
      createdAt: new Date()
    };
    
    setSavedScenarios(prev => [...prev, scenario]);
    toast.success('Scenario saved successfully!');
  };

  const handleShareResults = async () => {
    const shareText = `🔮 I just simulated my life habits and discovered I could reclaim ${timeReclaimed.toFixed(1)} years of conscious living time! That's ${(timeReclaimed * 365).toFixed(0)} extra days to pursue my dreams. What would you do with extra time? #WhatIfSimulator #TimeAwareness #LifeOptimization`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Life Simulation Results',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Results copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share results');
    }
  };

  const handleCompleteJourney = () => {
    if (onComplete) {
      // Estimate goals created based on time reclaimed and user engagement
      const estimatedGoals = Math.max(1, Math.min(10, Math.floor(timeReclaimed * 2) + savedScenarios.length));
      onComplete(simulatedHabits, estimatedGoals);
    }
  };

  useEffect(() => {
    // Show results when habits change significantly
    const totalChange = Object.keys(originalHabits).reduce((sum, key) => {
      const original = originalHabits[key as keyof typeof originalHabits];
      const simulated = simulatedHabits[key as keyof typeof simulatedHabits];
      return sum + Math.abs(original - simulated);
    }, 0);

    setShowResults(totalChange > 0.5);

    // Show final CTA after significant engagement
    if (totalChange > 2 || savedScenarios.length > 0) {
      setTimeout(() => setShowFinalCTA(true), 5000);
    }
  }, [simulatedHabits, originalHabits, savedScenarios.length]);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-soft-purple-gray to-dark-charcoal">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="text-4xl">🔮</div>
            <h2 className="font-space-grotesk font-bold text-display text-snow-white">
              "What If?" Life Simulator
            </h2>
          </div>
          <p className="font-inter text-body-lg text-snow-white/80 max-w-3xl mx-auto">
            Experiment with different daily habits and see how much life you can reclaim. 
            Small changes can lead to years of extra conscious living time.
          </p>
        </motion.div>

        {/* Current vs Potential Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-electric-orange/20 to-electric-orange/10 border border-electric-orange rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">⏰</div>
            <div className="font-space-grotesk font-bold text-2xl text-snow-white">
              {originalConsciousTime.toFixed(1)}
            </div>
            <div className="font-inter text-sm text-snow-white/80">Current Conscious Years</div>
          </div>

          <div className="bg-gradient-to-br from-digital-teal/20 to-digital-teal/10 border border-digital-teal rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">🎯</div>
            <div className="font-space-grotesk font-bold text-2xl text-snow-white">
              {simulatedConsciousTime.toFixed(1)}
            </div>
            <div className="font-inter text-sm text-snow-white/80">Simulated Conscious Years</div>
          </div>

          <div className={`bg-gradient-to-br rounded-2xl p-6 text-center border ${
            timeReclaimed > 0 
              ? 'from-green-500/20 to-green-500/10 border-green-500' 
              : timeReclaimed < 0 
              ? 'from-red-500/20 to-red-500/10 border-red-500'
              : 'from-warm-gold/20 to-warm-gold/10 border-warm-gold'
          }`}>
            <div className="text-3xl mb-3">
              {timeReclaimed > 0 ? '📈' : timeReclaimed < 0 ? '📉' : '⚖️'}
            </div>
            <div className={`font-space-grotesk font-bold text-2xl ${
              timeReclaimed > 0 ? 'text-green-400' : 
              timeReclaimed < 0 ? 'text-red-400' : 'text-warm-gold'
            }`}>
              {timeReclaimed > 0 ? '+' : ''}{timeReclaimed.toFixed(1)}
            </div>
            <div className="font-inter text-sm text-snow-white/80">Years Difference</div>
          </div>
        </motion.div>

        {/* Habit Simulator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <HabitSimulatorSliders
            originalHabits={originalHabits}
            simulatedHabits={simulatedHabits}
            onHabitChange={handleHabitChange}
            onReset={handleReset}
          />
        </motion.div>

        {/* Results Section */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Before/After Comparison */}
            <BeforeAfterComparison
              originalHabits={originalHabits}
              simulatedHabits={simulatedHabits}
              remainingYears={remainingYears}
            />

            {/* Emotion Meter */}
            <EmotionMeter
              consciousYearsGained={timeReclaimed}
              totalConsciousYears={simulatedConsciousTime}
            />

            {/* Action Suggestions */}
            {timeReclaimed > 0 && (
              <ActionSuggestions timeReclaimed={timeReclaimed} />
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={handleSaveScenario}
                className="btn-secondary"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Scenario
              </Button>

              <Button
                onClick={handleShareResults}
                className="btn-primary"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Results
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="bg-soft-purple-gray text-snow-white border-soft-purple-gray hover:bg-soft-purple-gray/80"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset All
              </Button>
            </div>
          </motion.div>
        )}

        {/* Saved Scenarios */}
        {savedScenarios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="font-space-grotesk font-bold text-heading-md text-snow-white text-center">
              Saved Scenarios
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedScenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="card-feature cursor-pointer hover:border-electric-orange transition-colors"
                  onClick={() => setSimulatedHabits(scenario.habits)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-space-grotesk font-bold text-lg text-snow-white">
                        {scenario.name}
                      </h4>
                      <Sparkles className="h-5 w-5 text-electric-orange" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-inter text-sm text-snow-white/80">
                          Time Reclaimed:
                        </span>
                        <span className={`font-space-grotesk font-bold ${
                          scenario.timeReclaimed > 0 ? 'text-digital-teal' : 'text-red-400'
                        }`}>
                          {scenario.timeReclaimed > 0 ? '+' : ''}{scenario.timeReclaimed.toFixed(1)}y
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="font-inter text-sm text-snow-white/80">
                          Conscious Time:
                        </span>
                        <span className="font-space-grotesk font-bold text-snow-white">
                          {scenario.consciousTime.toFixed(1)}y
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <span className="font-inter text-xs text-snow-white/60">
                        Click to load scenario
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Final Call to Action */}
        {showFinalCTA && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="bg-gradient-to-r from-electric-orange/20 to-warm-gold/20 rounded-3xl p-8 border border-electric-orange">
              <div className="space-y-4">
                <div className="text-4xl">🎯</div>
                <h3 className="font-space-grotesk font-bold text-2xl text-snow-white">
                  Ready to See Your Complete Journey?
                </h3>
                <p className="font-inter text-lg text-snow-white/90 max-w-2xl mx-auto">
                  You've explored the possibilities and seen how much life you can reclaim. 
                  Now let's create your personalized summary and action plan to turn these insights into reality.
                </p>
                <Button
                  onClick={handleCompleteJourney}
                  className="btn-primary text-lg px-8 py-4 animate-pulse-glow"
                >
                  <span>Complete My Journey</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-electric-orange/20 to-warm-gold/20 rounded-3xl p-8 border border-electric-orange">
            <div className="space-y-4">
              <div className="text-4xl">💡</div>
              <h3 className="font-space-grotesk font-bold text-2xl text-snow-white">
                Ready to Make It Real?
              </h3>
              <p className="font-inter text-lg text-snow-white/90 max-w-2xl mx-auto">
                You've seen the potential. Now it's time to turn simulation into reality. 
                Start with one small habit change today and begin reclaiming your precious time.
              </p>
              <div className="font-space-grotesk font-bold text-xl text-electric-orange">
                Your future self is counting on you! ⏰
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}