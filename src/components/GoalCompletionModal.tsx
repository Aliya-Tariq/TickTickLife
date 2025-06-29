import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Goal } from '@/lib/supabase';

interface GoalCompletionModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (goalId: string, responses: any) => void;
}

const difficultyQuestions = [
  {
    id: 'difficulty',
    question: 'How challenging was this goal?',
    options: [
      { value: 'easy', label: 'Easy - I could do this anytime', emoji: '😊' },
      { value: 'moderate', label: 'Moderate - Required some effort', emoji: '🤔' },
      { value: 'hard', label: 'Hard - Really pushed my limits', emoji: '😤' },
      { value: 'extreme', label: 'Extreme - One of the hardest things I\'ve done', emoji: '🔥' }
    ]
  },
  {
    id: 'satisfaction',
    question: 'How satisfied are you with achieving this goal?',
    options: [
      { value: 'very_satisfied', label: 'Very satisfied - Exceeded expectations', emoji: '🎉' },
      { value: 'satisfied', label: 'Satisfied - Met my expectations', emoji: '😊' },
      { value: 'somewhat', label: 'Somewhat satisfied - Could be better', emoji: '😐' },
      { value: 'disappointed', label: 'Disappointed - Not what I hoped for', emoji: '😞' }
    ]
  },
  {
    id: 'impact',
    question: 'What impact did achieving this goal have on your life?',
    options: [
      { value: 'life_changing', label: 'Life-changing - Transformed my perspective', emoji: '🌟' },
      { value: 'significant', label: 'Significant - Made a real difference', emoji: '💪' },
      { value: 'moderate', label: 'Moderate - Some positive changes', emoji: '👍' },
      { value: 'minimal', label: 'Minimal - Not much changed', emoji: '🤷' }
    ]
  },
  {
    id: 'time_management',
    question: 'How well did you manage your time for this goal?',
    options: [
      { value: 'excellent', label: 'Excellent - Perfect planning and execution', emoji: '⏰' },
      { value: 'good', label: 'Good - Mostly on track', emoji: '👌' },
      { value: 'average', label: 'Average - Some delays but manageable', emoji: '⚖️' },
      { value: 'poor', label: 'Poor - Struggled with time management', emoji: '😅' }
    ]
  }
];

export default function GoalCompletionModal({ goal, isOpen, onClose, onComplete }: GoalCompletionModalProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!goal) return null;

  const handleOptionSelect = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < difficultyQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(goal.id, responses);
    
    // Reset state
    setResponses({});
    setCurrentStep(0);
    setIsSubmitting(false);
    onClose();
  };

  const currentQuestion = difficultyQuestions[currentStep];
  const canProceed = responses[currentQuestion.id];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-charcoal rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-electric-orange"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
                <h2 className="font-space-grotesk font-bold text-2xl text-snow-white">
                  Goal Completed!
                </h2>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-snow-white hover:bg-soft-purple-gray"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Goal Info */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-2xl p-6 mb-8 border border-green-500/30">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{goal.emoji}</div>
                <div>
                  <h3 className="font-space-grotesk font-bold text-xl text-snow-white">
                    {goal.title}
                  </h3>
                  <p className="font-inter text-green-400">
                    Congratulations on achieving this goal!
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-sm text-snow-white/80">
                  Question {currentStep + 1} of {difficultyQuestions.length}
                </span>
                <span className="font-inter text-sm text-electric-orange">
                  {Math.round(((currentStep + 1) / difficultyQuestions.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-soft-purple-gray rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-digital-teal to-electric-orange"
                  initial={{ width: '25%' }}
                  animate={{ width: `${((currentStep + 1) / difficultyQuestions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="font-space-grotesk font-bold text-xl text-snow-white">
                    {currentQuestion.question}
                  </h3>
                  <p className="font-inter text-snow-white/80">
                    Your honest feedback helps us understand your journey better
                  </p>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        responses[currentQuestion.id] === option.value
                          ? 'border-electric-orange bg-electric-orange/10 text-snow-white'
                          : 'border-soft-purple-gray bg-soft-purple-gray hover:border-warm-gold text-snow-white/80 hover:text-snow-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="font-inter font-medium">{option.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                onClick={handleBack}
                disabled={currentStep === 0}
                variant="outline"
                className="btn-secondary"
              >
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed || isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-dark-charcoal/30 border-t-dark-charcoal rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : currentStep === difficultyQuestions.length - 1 ? (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Complete Goal</span>
                  </div>
                ) : (
                  'Next'
                )}
              </Button>
            </div>

            {/* Motivational message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6 text-center bg-gradient-to-r from-digital-teal/20 to-green-500/20 rounded-xl p-4 border border-digital-teal/30"
            >
              <Star className="h-6 w-6 text-digital-teal mx-auto mb-2" />
              <p className="font-inter text-sm text-snow-white/90">
                Every completed goal is a step towards a more conscious and fulfilling life. 
                You're building momentum that will carry you forward!
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}